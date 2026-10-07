#!/usr/bin/env bash
#
# Post-Build Auto-Deployment Script
# Automatically deploys CSS changes after `npm run build` based on Magento mode.
#
# Security notes:
#  - Uses a strict shell (set -euo pipefail), pinned PATH, restrictive umask.
#  - Lock is created with `mkdir` (atomic, refuses to follow symlinks) inside
#    $MAGENTO_ROOT/var, NOT in /tmp — this avoids the classic /tmp symlink
#    attack and the TOCTOU race in the previous test-then-write design.
#  - $MAGENTO_ROOT is resolved from the script's own location (resilient to
#    symlinks via a pure-bash realpath) and then sanity-checked: must be
#    absolute, must exist, must contain bin/magento, must not be a top-level
#    or system directory. Same checks apply to the optional override env var.
#  - All filesystem mutations are guarded so they can only touch paths INSIDE
#    the resolved $MAGENTO_ROOT.

set -euo pipefail
IFS=$' \t\n'
umask 077

# Pin PATH so a poisoned caller cannot inject malicious binaries.
PATH='/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin'
export PATH

# ---------- Colours ---------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()   { printf '%b\n' "${GREEN}$*${NC}"; }
warn()  { printf '%b\n' "${YELLOW}$*${NC}"; }
fail()  { printf '%b\n' "${RED}$*${NC}" >&2; exit 1; }

# ---------- Pure-bash realpath ----------------------------------------------
# Resolves symlinks without depending on GNU readlink -f or python.
resolve_path() {
    local target="$1"
    local dir base
    while [ -L "$target" ]; do
        dir="$(cd "$(dirname -- "$target")" && pwd -P)"
        base="$(readlink -- "$target")"
        case "$base" in
            /*) target="$base" ;;
            *)  target="$dir/$base" ;;
        esac
    done
    dir="$(cd "$(dirname -- "$target")" && pwd -P)"
    base="$(basename -- "$target")"
    printf '%s/%s\n' "$dir" "$base"
}

# ---------- Validate a candidate Magento root -------------------------------
# Rejects: relative paths, missing dirs, dirs without bin/magento, and any
# top-level/system path that would be catastrophic to rm -rf inside.
validate_magento_root() {
    local candidate="$1"
    [ -n "$candidate" ]                          || return 1
    [ "${candidate#/}" != "$candidate" ]         || return 1   # must be absolute
    [ -d "$candidate" ]                          || return 1
    [ -f "$candidate/bin/magento" ]              || return 1
    [ -d "$candidate/app" ]                      || return 1
    [ -d "$candidate/pub" ]                      || return 1
    # Refuse dangerously shallow paths.
    case "$candidate" in
        /|/bin|/boot|/dev|/etc|/home|/lib|/lib64|/media|/mnt|/opt|/proc|/root|/run|/sbin|/srv|/sys|/tmp|/usr|/var)
            return 1
            ;;
    esac
    # Must have at least 2 path segments after the leading slash, e.g. /srv/app.
    local stripped="${candidate#/}"
    case "$stripped" in
        */*) ;;
        *)   return 1 ;;
    esac
    return 0
}

# ---------- Resolve Magento root --------------------------------------------
SCRIPT_PATH="$(resolve_path "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(cd "$(dirname -- "$SCRIPT_PATH")" && pwd -P)"

# Script lives at:
#   <magento>/app/design/frontend/<Vendor>/<Theme>/web/tailwind/post-build-deploy.sh
# so the Magento root is 6 directories up.
CANDIDATE="$(cd "$SCRIPT_DIR/../../../../../../.." && pwd -P)"

MAGENTO_ROOT=""
if [ -n "${MAGENTO_ROOT_OVERRIDE:-}" ]; then
    if validate_magento_root "$MAGENTO_ROOT_OVERRIDE"; then
        MAGENTO_ROOT="$MAGENTO_ROOT_OVERRIDE"
    else
        fail "❌ MAGENTO_ROOT_OVERRIDE='${MAGENTO_ROOT_OVERRIDE}' is not a valid Magento root."
    fi
elif validate_magento_root "$CANDIDATE"; then
    MAGENTO_ROOT="$CANDIDATE"
else
    # Walk up from the script directory looking for bin/magento.
    SEARCH_DIR="$SCRIPT_DIR"
    while [ "$SEARCH_DIR" != "/" ]; do
        if validate_magento_root "$SEARCH_DIR"; then
            MAGENTO_ROOT="$SEARCH_DIR"
            break
        fi
        SEARCH_DIR="$(dirname -- "$SEARCH_DIR")"
    done
fi

if [ -z "$MAGENTO_ROOT" ]; then
    fail "❌ Could not locate a valid Magento root from ${SCRIPT_DIR}.
   Set MAGENTO_ROOT_OVERRIDE=/abs/path/to/magento to override."
fi

# Verify resolved root really contains the script (defence-in-depth: protects
# against an attacker symlinking the script into an unrelated tree).
case "$SCRIPT_PATH" in
    "$MAGENTO_ROOT"/*) ;;
    *) fail "❌ Refusing to run: script path ${SCRIPT_PATH} is not inside ${MAGENTO_ROOT}." ;;
esac

# ---------- Resolve the theme this script belongs to -------------------------
# Script lives at <magento>/app/design/frontend/<Vendor>/<Theme>/web/tailwind/,
# so the theme directory is two levels up from the script directory.
THEME_DIR="$(cd "$SCRIPT_DIR/../.." && pwd -P)"
THEME_NAME="$(basename -- "$THEME_DIR")"
THEME_VENDOR="$(basename -- "$(dirname -- "$THEME_DIR")")"
THEME="${THEME_VENDOR}/${THEME_NAME}"

case "$THEME_DIR" in
    "$MAGENTO_ROOT"/app/design/frontend/*) ;;
    *) fail "❌ Refusing to run: ${THEME_DIR} is not a frontend theme directory." ;;
esac

log  "🚀 Post-Build Deployment Starting..."
warn "📂 Magento root: ${MAGENTO_ROOT}"
warn "🎨 Theme: ${THEME}"

cd "$MAGENTO_ROOT"

# ---------- Locking (atomic, in-tree) ---------------------------------------
LOCK_DIR="$MAGENTO_ROOT/var/.panth-theme-deploy.lock"

cleanup() {
    # Only remove a lock we own.
    if [ -d "$LOCK_DIR" ] && [ -f "$LOCK_DIR/pid" ] && [ "$(cat "$LOCK_DIR/pid" 2>/dev/null || true)" = "$$" ]; then
        rm -rf -- "$LOCK_DIR"
    fi
}
trap cleanup EXIT INT TERM HUP

# `mkdir` is atomic and will not follow symlinks. If the directory already
# exists we check whether the holding PID is still alive; if not, the lock is
# stale and we steal it.
if ! mkdir -- "$LOCK_DIR" 2>/dev/null; then
    if [ -f "$LOCK_DIR/pid" ]; then
        OLD_PID="$(cat "$LOCK_DIR/pid" 2>/dev/null || echo "")"
        if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
            warn "⚠️  Another deployment is already running (PID: ${OLD_PID}). Skipping..."
            trap - EXIT INT TERM HUP
            exit 0
        fi
    fi
    rm -rf -- "$LOCK_DIR"
    mkdir -- "$LOCK_DIR" || fail "❌ Could not acquire lock at ${LOCK_DIR}"
fi
printf '%s\n' "$$" > "$LOCK_DIR/pid"

# ---------- Detect Magento mode (portable) ----------------------------------
MODE="$(php bin/magento deploy:mode:show 2>/dev/null \
        | sed -n 's/.*mode:[[:space:]]*\([a-zA-Z]*\).*/\1/p' \
        | head -1 || true)"
MODE="${MODE:-developer}"
warn "📋 Detected Magento mode: ${MODE}"

# ---------- Helper: only allow rm inside MAGENTO_ROOT -----------------------
safe_remove() {
    local victim="$1"
    case "$victim" in
        "$MAGENTO_ROOT"/*) ;;
        *) fail "❌ Refusing to remove path outside Magento root: ${victim}" ;;
    esac
    # Block traversal attempts.
    case "$victim" in
        *..*) fail "❌ Refusing to remove path with traversal sequence: ${victim}" ;;
    esac
    rm -rf -- "$victim"
}

# ---------- Mode-specific deployment ----------------------------------------
case "$MODE" in
    developer)
        log "🔧 Developer Mode - Removing cached static CSS..."
        STATIC_CSS="$MAGENTO_ROOT/pub/static/frontend/${THEME}/en_US/css/styles.css"
        if [ -f "$STATIC_CSS" ]; then
            safe_remove "$STATIC_CSS"
            log "✓ Removed cached CSS file"
        fi
        log  "✅ Done! CSS will be auto-generated on next page load"
        warn "ℹ️  Cache will auto-clear on next request in developer mode"
        ;;
    production)
        log "🏭 Production Mode - Deploying static content..."
        safe_remove "$MAGENTO_ROOT/pub/static/frontend/${THEME}"
        php bin/magento setup:static-content:deploy -f en_US \
            --area frontend --theme "$THEME"
        log "✅ Production deployment complete!"
        ;;
    default|maintenance)
        warn "⚠️  Magento is in '${MODE}' mode — skipping deployment."
        ;;
    *)
        warn "⚠️  Unknown mode: ${MODE}"
        log  "✓ Skipping deployment"
        ;;
esac

log "🎉 Post-build deployment finished successfully!"
