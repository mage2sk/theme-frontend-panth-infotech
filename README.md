# Panth Infotech Hyva Child Theme for Magento 2

`mage2kishan/theme-frontend-panth-infotech` is a Magento 2 storefront theme
registered as `frontend/Panth/Infotech`. It is a Hyva child theme: the parent
theme is `Hyva/default` (declared in `theme.xml`), and this package only
overrides the templates, layouts and styles listed below. Everything else is
inherited from the Hyva default theme.

## Requirements

- PHP `~8.1.0 || ~8.2.0 || ~8.3.0 || ~8.4.0`
- `magento/framework` `^103.0` (Magento Open Source or Adobe Commerce 2.4.x)
- The Hyva default theme (`hyva-themes/magento2-default-theme`), which provides
  the `Hyva/default` parent theme. It is listed under `suggest` in
  `composer.json` and has to be installed separately with a valid Hyva license.
- The `mage2kishan/*` modules listed under `require` in `composer.json`. They
  are installed automatically by Composer.
- Node.js 20 or newer and npm, only if you rebuild the Tailwind CSS
  (`web/tailwind/.nvmrc` pins Node 20, `package.json` requires `>=20.0.0`).

## What the theme overrides

### Magento_Catalog

- `layout/catalog_product_view.xml`: switches the date custom option renderer
  to `product/view/options/type/date-html5.phtml` (native date and time
  inputs instead of dropdowns).
- `layout/catalog_category_view.xml`: empty body; the category page uses the
  parent layout.
- `templates/product/list/item.phtml`: product card for category and search
  listings (image, name, price, add to cart or configure button, wishlist,
  compare, and an optional `quickview` child block).
- `templates/product/price/tier_prices.phtml`: tier price list as clickable
  rows. Clicking a row sets the quantity field; the tier price is recalculated
  when custom options change the product price.
- `templates/product/view/addtocart.phtml`: add to cart / update item button
  with an icon and its text label; below 768px it is a full-width 48px button
  under the quantity field.
- `templates/product/view/breadcrumbs.phtml`: product page breadcrumbs with the
  separator taken from the Theme Customizer configuration.
  `breadcrumbs_temp.phtml` is a variant without the configurable separator; no
  layout in this theme uses it.
- `templates/product/view/options/*`: custom option templates (select, text,
  file, date, date dropdowns, native date inputs) with inline price display,
  file upload box and per-option validation.
- `templates/product/view/product-info.phtml`: product info column (title,
  review summary, short description, stock, attributes, price, quantity, add
  to cart).
- `templates/product/view/quantity.phtml`: quantity field with plus and minus
  buttons that respect minimum, maximum and increment settings.
- `templates/product/widget/viewed/grid.phtml`: recently viewed products grid.

### Magento_Checkout

- `templates/php-cart/wrapper.phtml`: cart page layout; on mobile the items are
  shown first and the summary below.
- `templates/php-cart/form.phtml` and `form/clear.phtml`: cart items form and
  an inline clear cart button.
- `templates/php-cart/item/default.phtml`: cart row with thumbnail, options,
  prices, quantity and actions. The `Attachments` option added by
  `mage2kishan/module-order-attachments` is rendered as its own block.
- `templates/php-cart/noItems.phtml`: empty cart page that uses the
  `CartEnhancements` view model of `mage2kishan/module-advancedcart`.

### Magento_GiftMessage

- `templates/php-cart/gift-options-container.phtml`: gift message options on
  the cart page, based on the Hyva template. Nothing is rendered when gift
  options are disabled in the configuration.

### Magento_LayeredNavigation

- `templates/layer/view.phtml`: layered navigation. Below 1024px a 44px
  "Filters" button with the active filter count opens the filters in an
  off-canvas drawer (focus trap, Escape, close button, scroll lock, "Clear all"
  and "Apply"); from 1024px up the filters are shown in the left sidebar. The
  filter option markup is the Hyva markup, so filter renderers of other
  modules keep working.

### Magento_Swatches

- `templates/product/view/renderer.phtml`: configurable product swatches in a
  card layout with the attribute label, the selected value and the swatch
  options.

### Magento_Theme

- `layout/default.xml`: adds the free shipping progress bar to the cart drawer.
  The back to top button comes from `mage2kishan/module-footer` only.
- `layout/default_head_blocks.xml`: loads Font Awesome 6.5.1 from cdnjs with a
  subresource integrity hash (the icons are used by the footer and the mega
  menu), preloads `fonts/dm-sans-latin.woff2`, adds the self-hosted fonts in
  `css/fonts.css` and removes the DM Sans
  stylesheet from fonts.googleapis.com that `mage2kishan/module-footer` adds.
- `templates/html/header.phtml`: header with optional top bar, sticky
  behaviour, search, account, compare, wishlist and mini cart icons, all
  controlled by the Theme Customizer header configuration. The search and mini
  cart icons use the Icon Size (px) setting and the header uses the Header
  Height (px) setting, which overrides the `header.height` value from
  `theme-config.json` for the header element. When the custom header is
  disabled there, the Hyva default header template is used.
- `templates/html/header/logo.phtml`, `header/search-form.phtml`,
  `header/menu/desktop.phtml`: logo, search form (keyboard navigation of
  suggestions) and the desktop menu (dropdown closes on mouse leave).
- `templates/html/cart/cart-drawer.phtml` and
  `cart/free-shipping-progress.phtml`: mini cart drawer with an optional free
  shipping progress bar. The subtotal row follows the Show Cart Subtotal
  setting and the Continue Shopping button of the empty drawer follows the
  Show Continue Shopping Button setting.
- `templates/html/footer.phtml`, `html/newsletter.phtml`: footer columns and
  newsletter form, configured through `mage2kishan/module-footer`.
- `templates/html/breadcrumbs.phtml`: breadcrumbs with a configurable
  separator.
- `templates/html/whatsapp-float.phtml`: floating WhatsApp button that links to
  `wa.me` with the phone number and message from the Theme Customizer
  configuration.

### Magento_Wishlist

- `templates/sidebar.phtml`: the Hyva wishlist sidebar with the product name
  as the thumbnail alt text.

### Panth_MegaMenu

- `layout/default.xml`: replaces the Hyva desktop and mobile top menus with the
  `Panth\MegaMenu\Block\Menu` block (only when `panth_megamenu/general/enabled`
  is set) and adds the dynamic styles block.
- `templates/menu.phtml`: collects the menu tree (or the category tree when no
  menu resolves) and the mega menu configuration and renders them with the
  shared Panth Mega Menu template `Panth_MegaMenu::pmm/render.phtml`
  (module 1.0.18 or later): mega panels and dropdowns on desktop from 1024px,
  the off-canvas drawer below. Styles and behaviour come from the module files
  `css/pmm.css` and `js/pmm.js`.
- `templates/js/megamenu-alpine.phtml`, `css/styles.phtml`,
  `css/dynamic-styles.phtml`: legacy Alpine.js components and the custom CSS and
  JavaScript entered in the mega menu configuration.
- `templates/preview.phtml`: the admin menu preview; renders `menu.phtml` for
  the previewed menu, so the preview matches the storefront.

### Other files

- `etc/view.xml`: image sizes and view settings, based on the Hyva default.
- `web/css/styles.css`: the compiled Tailwind CSS served by the theme.
- `web/css/panth-theme.css`: loaded after `styles.css` from
  `Magento_Theme/layout/default_head_blocks.xml`. It holds the primary and
  secondary button colours, CMS content typography (CMS pages, `.cms-content`,
  Page Builder text and HTML elements, static CMS blocks), the cart action row,
  product card price alignment, slider pager tap targets and mega menu badges.
  The same file is imported into the Tailwind sources as
  `web/tailwind/theme/panth-theme.css`.
- `web/css/fonts.css` and `web/fonts/`: the self-hosted fonts, see "Fonts".
- `web/js/zxcvbn.js`: the zxcvbn password strength library.
- `media/preview.jpg`: theme preview image shown in the admin.

## Fonts

The theme CSS uses `'DM Sans', 'Inter', system-ui, sans-serif` for body text
and headings (`typography.font-family` and `typography.heading-font-family` in
`web/tailwind/theme-config.json`). Both families are served from the theme
itself; no font is loaded from Google:

- `web/fonts/dm-sans-latin.woff2`, `web/fonts/dm-sans-latin-ext.woff2`
- `web/fonts/inter-latin.woff2`, `web/fonts/inter-latin-ext.woff2`

The files are the variable fonts from the Google Fonts API (weights 400 to
800, latin and latin-ext subsets). `web/css/fonts.css` declares them with
`font-display: swap` and the same unicode ranges as the Google Fonts CSS.
The DM Sans latin file is preloaded in the page head so it is usually ready
before the first paint, which avoids a layout shift when the font swaps in.
The fonts are licensed under the SIL Open Font License 1.1; the license text
and the copyright lines are in `web/fonts/OFL.txt`.

Google Fonts are loaded only when "Load Google Fonts"
(`theme_customizer/typography/load_google_fonts`) is enabled in the Theme
Customizer. Resource hints for fonts.googleapis.com or fonts.gstatic.com come
from the Core Web Vitals module configuration
(`panth_corewebvitals/resource_hints/*`), not from the theme; clear those
fields if the store should not contact Google at all.

## Admin HTML

Some texts entered in the admin are printed as HTML or code. Only trusted
administrators should be given access to these settings.

| Field | Admin location | Output | ACL resource |
| --- | --- | --- | --- |
| Top bar Left Side Text, Right Side Text | Stores > Configuration, section `panth_header` (Header Configuration), group Top Bar | HTML limited to a, b, br, em, i, small, span, strong, u (escaper allow list) | `Panth_ThemeCustomizer::config` |
| Copyright Text | Stores > Configuration, section `panth_footer` (Footer Configuration), group Bottom Bar | HTML limited to a, b, strong, em, i, u, small, span, br (escaper allow list) | `Panth_Footer::config` |
| Physical Address | Stores > Configuration, section `panth_footer` (Footer Configuration), group Column 4 - Contact Information | plain text, escaped | `Panth_Footer::config` |
| Custom HTML Content of a menu item | Mega Menu > Menu Items, menu item | raw HTML | `Panth_MegaMenu::menu` |
| CMS block of a menu item | Mega Menu > Menu Items, menu item | rendered CMS block HTML | `Panth_MegaMenu::menu` |
| Custom CSS (per menu) | Mega Menu > Menu Items, menu form | raw CSS inside a style element | `Panth_MegaMenu::menu` |
| Custom CSS | Stores > Configuration, section `panth_megamenu`, group Styling Settings | raw CSS inside a style element | `Panth_MegaMenu::config` |
| Custom JavaScript | Stores > Configuration, section `panth_megamenu`, group Advanced Settings | raw JavaScript inside a script element | `Panth_MegaMenu::config` |

Raw CSS and JavaScript are not escaped, because escaping would break them; a
closing `</style` or `</script` sequence in the value is neutralised so the
value cannot close its own element. Any administrator who has one of the ACL
resources above can place markup or script on every storefront page.

## Module dependencies

The templates depend on or integrate with these `mage2kishan` modules:

| Package | Used by |
| --- | --- |
| `mage2kishan/module-theme-customizer` | header, breadcrumbs, cart drawer, free shipping bar, WhatsApp button; `bin/magento theme:customizer:build` runs the npm build |
| `mage2kishan/module-footer` | footer, newsletter, back to top |
| `mage2kishan/module-core` | icon view model in the free shipping bar; reads `web/tailwind/theme-config.json` of the active theme |
| `mage2kishan/module-advancedcart` | empty cart page |
| `mage2kishan/module-mega-menu` | everything under `Panth_MegaMenu` |
| `mage2kishan/module-quickview` | `quickview` child block in the product card |
| `mage2kishan/module-order-attachments` | `Attachments` option in the cart |
| `mage2kishan/module-advanced-seo` | outputs the breadcrumb JSON-LD, so the theme breadcrumbs do not |

The other modules in the `require` list are installed together with the theme
but are not referenced by its templates.

## Installation

```bash
composer require mage2kishan/theme-frontend-panth-infotech
bin/magento setup:upgrade
bin/magento cache:flush
```

In production mode also run `bin/magento setup:di:compile` and
`bin/magento setup:static-content:deploy`.

Then open **Content > Design > Configuration** in the admin, edit the website
or store view, choose **Panth Infotech - Hyva Child Theme** as the applied
theme and save.

## Primary fill colour

White text on the shipped teal `#0D9488` reaches only 3.74:1, below WCAG AA
for normal text. Filled primary surfaces (`.btn-primary`, `.bg-primary` with
white text) therefore use `--color-primary-fill`. `generate-theme-css.js`
writes it from `colors.primary.fill` in `theme-config.json` when that key is
set; otherwise it uses `colors.primary.darker` (`#0F766E`, 5.47:1) for the
default teal and `colors.primary.DEFAULT` for any other primary colour, so a
custom primary colour is kept as chosen. Until the theme is rebuilt,
`panth-theme.css` falls back to `#0F766E`.

## Building the Tailwind CSS

The Tailwind sources live in `web/tailwind`. The compiled file is written to
`web/css/styles.css`.

```bash
cd web/tailwind
npm install
npm run build
```

Scripts defined in `web/tailwind/package.json`:

- `prebuild` and `prewatch`: run `node generate-theme-css.js` (reads
  `theme-config.json` and writes `backend-config.css`), then
  `npx hyva-sources` and `npx hyva-tokens` (write `hyva-source.css` and
  `hyva-tokens.css` from `hyva.config.json`). `tailwind-source.css` imports
  these three files.
- `build`: `npx tailwindcss -i tailwind-source.css -o ../css/styles.css --minify`,
  followed by `post-build-deploy.sh` (`postbuild`).
- `watch` (also `start`): Tailwind in watch mode without minification.
- `browser-sync`: starts Browser Sync with `browser-sync.config.js`. Pass the
  store URL, for example `npm run browser-sync -- --proxy https://hyva.test --https`.

### post-build-deploy.sh

After a build, `post-build-deploy.sh` refreshes the deployed CSS:

- It resolves the Magento root from its own location (or from
  `MAGENTO_ROOT_OVERRIDE`) and only accepts an absolute directory that contains
  `bin/magento`, `app` and `pub` and is not a system directory such as `/`,
  `/usr` or `/var`.
- It refuses to run when the script is not inside that root, or when the theme
  directory is not under `app/design/frontend`. The theme code
  (`Vendor/Theme`) is taken from the directory names, so a copy of the theme
  under another name deploys itself.
- It takes a lock directory in `var/.panth-theme-deploy.lock`, so two builds do
  not deploy at the same time.
- It reads the mode from `bin/magento deploy:mode:show`. In developer mode it
  deletes `pub/static/frontend/<Vendor>/<Theme>/en_US/css/styles.css` so the
  file is built again on the next request. In production mode it deletes
  `pub/static/frontend/<Vendor>/<Theme>` and runs
  `setup:static-content:deploy -f en_US --area frontend --theme <Vendor>/<Theme>`.
  In default or maintenance mode it does nothing.
- Every deletion goes through a check that rejects paths outside the Magento
  root and paths that contain `..`.

When the theme is installed with Composer it lives in `vendor/`, so the
post-build step stops with an error after the CSS has been written. Deploy
the static content yourself in that case, or copy the theme to
`app/design/frontend/Panth/Infotech` before building.

See the Hyva documentation for details on the build:
[Building your theme](https://docs.hyva.io/hyva-themes/building-your-theme/index.html).

## Uninstall

1. In **Content > Design > Configuration**, switch every store view back to
   another theme, for example the Hyva default theme.
2. Remove the package and clean up:

```bash
composer remove mage2kishan/theme-frontend-panth-infotech
bin/magento setup:upgrade
bin/magento cache:flush
```

The theme row stays in the `theme` table. Delete it from there if you do not
want it listed in the admin any more.

## Support

Email: kishansavaliyakb@gmail.com

## License

Proprietary. See `LICENSE.txt`.
