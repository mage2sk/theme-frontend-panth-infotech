/**
 * Generate backend-config.css from theme-config.json
 *
 * This script reads the theme-config.json and produces generated/backend-config.css
 * with the exact CSS custom property names expected by the Hyva theme.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, 'theme-config.json');
const outputPath = join(__dirname, 'generated', 'backend-config.css');

const config = JSON.parse(readFileSync(configPath, 'utf8'));

/**
 * Mapping from JSON paths to CSS variable names.
 * Order matches the original backend-config.css exactly.
 */
const sections = [
  {
    comment: 'Primary Colors',
    vars: [
      ['colors.primary.lighter',  '--color-primary-lighter'],
      ['colors.primary.DEFAULT',  '--color-primary'],
      ['colors.primary.darker',   '--color-primary-darker'],
      ['colors.primary.on',       '--color-on-primary'],
    ]
  },
  {
    comment: 'Secondary Colors',
    vars: [
      ['colors.secondary.lighter',  '--color-secondary-lighter'],
      ['colors.secondary.DEFAULT',  '--color-secondary'],
      ['colors.secondary.darker',   '--color-secondary-darker'],
      ['colors.secondary.on',       '--color-on-secondary'],
    ]
  },
  {
    comment: 'Background Colors',
    vars: [
      ['colors.background.body',              '--color-bg'],
      ['colors.background.surface',           '--color-surface'],
      ['colors.background.container-lighter', '--color-container-lighter'],
      ['colors.background.container',         '--color-container'],
      ['colors.background.container-darker',  '--color-container-darker'],
    ]
  },
  {
    comment: 'Text Colors',
    vars: [
      ['colors.text.DEFAULT',    '--color-fg'],
      ['colors.text.secondary',  '--color-fg-secondary'],
    ]
  },
  {
    comment: 'Typography',
    vars: [
      ['typography.font-family',         '--default-font-family'],
      ['typography.heading-font-family', '--heading-font-family'],
      ['typography.font-size',           '--default-font-size'],
    ]
  },
  {
    comment: 'Effects & Transitions',
    vars: [
      ['effects.transition-duration', '--default-transition-duration'],
      ['effects.timing-function',     '--default-transition-timing-function'],
      ['effects.shadow-sm',           '--shadow-sm'],
      ['effects.shadow-md',           '--shadow-md'],
      ['effects.shadow-lg',           '--shadow-lg'],
    ]
  },
  {
    comment: 'Border & Spacing',
    vars: [
      ['layout.border-radius',       '--border-radius'],
      ['layout.container-max-width', '--container-max-width'],
    ]
  },
  {
    comment: 'Status Colors',
    vars: [
      ['colors.status.success', '--color-success'],
      ['colors.status.warning', '--color-warning'],
      ['colors.status.error',   '--color-error'],
      ['colors.status.info',    '--color-info'],
    ]
  },
  {
    comment: 'Link Colors',
    vars: [
      ['colors.link.DEFAULT',   '--link-color'],
      ['colors.link.hover',     '--link-hover'],
      ['colors.link.active',    '--link-active'],
      ['colors.link.underline', '--link-underline'],
    ]
  },
  {
    comment: 'Button Colors - Primary',
    vars: [
      ['buttons.primary.bg',           '--btn-primary-bg'],
      ['buttons.primary.text',         '--btn-primary-text'],
      ['buttons.primary.hover-bg',     '--btn-primary-hover-bg'],
      ['buttons.primary.border',       '--btn-primary-border'],
      ['buttons.primary.hover-border', '--btn-primary-hover-border'],
    ]
  },
  {
    comment: 'Button Colors - Secondary',
    vars: [
      ['buttons.secondary.bg',           '--btn-secondary-bg'],
      ['buttons.secondary.text',         '--btn-secondary-text'],
      ['buttons.secondary.hover-bg',     '--btn-secondary-hover-bg'],
      ['buttons.secondary.border',       '--btn-secondary-border'],
      ['buttons.secondary.hover-border', '--btn-secondary-hover-border'],
    ]
  },
  {
    comment: 'Button Colors - Disabled',
    vars: [
      ['buttons.disabled.bg',       '--btn-disabled-bg'],
      ['buttons.disabled.text',     '--btn-disabled-text'],
      ['buttons.disabled.border',   '--btn-disabled-border'],
      ['buttons.border-radius',     '--btn-border-radius'],
    ]
  },
  {
    comment: 'Border & Divider Colors',
    vars: [
      ['colors.border.DEFAULT', '--border-color'],
      ['colors.border.divider', '--divider-color'],
    ]
  },
  {
    comment: 'Form / Input Colors',
    vars: [
      ['forms.bg',                '--form-bg'],
      ['forms.text',              '--form-text'],
      ['forms.border',            '--form-border'],
      ['forms.focus-border',      '--form-focus-border'],
      ['forms.radius',            '--form-radius'],
      ['forms.input-border',      '--input-border'],
      ['forms.input-focus-border','--input-focus-border'],
    ]
  },
  {
    comment: 'Card Settings',
    vars: [
      ['cards.bg',        '--card-bg'],
      ['cards.text',      '--card-text'],
      ['cards.border',    '--card-border'],
      ['cards.radius',    '--card-radius'],
      ['cards.padding-y', '--card-padding-y'],
      ['cards.padding-x', '--card-padding-x'],
    ]
  },
  {
    comment: 'Breadcrumb Colors',
    vars: [
      ['breadcrumbs.bg',        '--breadcrumb-bg'],
      ['breadcrumbs.text',      '--breadcrumb-text'],
      ['breadcrumbs.active',    '--breadcrumb-active'],
      ['breadcrumbs.separator', '--breadcrumb-separator'],
    ]
  },
  {
    comment: 'Heading Colors',
    vars: [
      ['typography.heading-color',      '--heading-color'],
      ['typography.headings.h1.color',  '--h1-color'],
      ['typography.headings.h2.color',  '--h2-color'],
      ['typography.headings.h3.color',  '--h3-color'],
      ['typography.headings.h4.color',  '--h4-color'],
      ['typography.headings.h5.color',  '--h5-color'],
      ['typography.headings.h6.color',  '--h6-color'],
      ['typography.label-color',        '--label-color'],
    ]
  },
  {
    comment: 'Heading Typography',
    vars: [
      ['typography.headings.h1.size',   '--h1-size'],
      ['typography.headings.h1.weight', '--h1-weight'],
      ['typography.headings.h2.size',   '--h2-size'],
      ['typography.headings.h2.weight', '--h2-weight'],
      ['typography.headings.h3.size',   '--h3-size'],
      ['typography.headings.h3.weight', '--h3-weight'],
      ['typography.headings.h4.size',   '--h4-size'],
      ['typography.headings.h4.weight', '--h4-weight'],
      ['typography.headings.h5.size',   '--h5-size'],
      ['typography.headings.h5.weight', '--h5-weight'],
      ['typography.headings.h6.size',   '--h6-size'],
      ['typography.headings.h6.weight', '--h6-weight'],
    ]
  },
  {
    comment: 'Body Typography',
    vars: [
      ['typography.font-weight-normal', '--font-weight-normal'],
      ['typography.font-weight-bold',   '--font-weight-bold'],
      ['typography.line-height',        '--line-height-base'],
    ]
  },
  {
    comment: 'Spacing',
    vars: [
      ['layout.section-spacing', '--section-spacing'],
      ['cards.padding',          '--card-padding'],
      ['layout.sidebar-width',   '--sidebar-width'],
    ]
  },
  {
    comment: 'Review System Colors',
    vars: [
      ['reviews.stars-filled',           '--review-stars-filled'],
      ['reviews.stars-empty',            '--review-stars-empty'],
      ['reviews.title',                  '--review-title'],
      ['reviews.text',                   '--review-text'],
      ['reviews.author',                 '--review-author'],
      ['reviews.date',                   '--review-date'],
      ['reviews.helpful-button',         '--review-helpful-button'],
      ['reviews.helpful-button-hover',   '--review-helpful-button-hover'],
      ['reviews.write-review-button-bg', '--write-review-button-bg'],
      ['reviews.write-review-button-text','--write-review-button-text'],
    ]
  },
  {
    comment: 'Header Colors',
    vars: [
      ['header.bg',        '--header-bg-color'],
      ['header.bg',        '--header-bg'],
      ['header.text',      '--header-text-color'],
      ['header.text',      '--header-text'],
      ['header.link',      '--header-link-color'],
      ['header.link-hover','--header-link-hover-color'],
      ['header.border',    '--header-border-color'],
      ['header.border',    '--header-border'],
      ['header.sticky-bg', '--header-sticky-bg'],
    ]
  },
  {
    comment: 'Header Top Bar Colors',
    vars: [
      ['header.topbar.bg',   '--header-topbar-bg'],
      ['header.topbar.bg',   '--topbar-bg'],
      ['header.topbar.text', '--header-topbar-text'],
      ['header.topbar.text', '--topbar-text'],
    ]
  },
  {
    comment: 'Header Icon Colors',
    vars: [
      ['header.icons.search',       '--header-icon-search'],
      ['header.icons.search-hover', '--header-icon-search-hover'],
      ['header.icons.account',      '--header-icon-account'],
      ['header.icons.account-hover','--header-icon-account-hover'],
      ['header.icons.cart',         '--header-icon-cart'],
      ['header.icons.cart',         '--header-icon-minicart'],
      ['header.icons.cart-hover',   '--header-icon-cart-hover'],
      ['header.icons.cart-hover',   '--header-icon-minicart-hover'],
      ['header.icons.counter-bg',   '--header-icon-counter-bg'],
      ['header.icons.counter-bg',   '--header-counter-bg'],
      ['header.icons.counter-text', '--header-icon-counter-text'],
      ['header.icons.counter-text', '--header-counter-text'],
    ]
  },
  {
    comment: 'Menu / Navigation Colors',
    vars: [
      ['header.menu.text',                '--menu-text'],
      ['header.menu.text-hover',          '--menu-text-hover'],
      ['header.menu.text-active',         '--menu-text-active'],
      ['header.menu.dropdown-bg',         '--menu-dropdown-bg'],
      ['header.menu.dropdown-border',     '--menu-dropdown-border'],
      ['header.menu.dropdown-shadow',     '--menu-dropdown-shadow'],
      ['header.menu.level1-bg',           '--menu-level1-bg'],
      ['header.menu.level1-text',         '--menu-level1-text'],
      ['header.menu.level1-hover-bg',     '--menu-level1-hover-bg'],
      ['header.menu.level1-hover-text',   '--menu-level1-hover-text'],
      ['header.menu.level2-bg',           '--menu-level2-bg'],
      ['header.menu.level2-text',         '--menu-level2-text'],
      ['header.menu.level2-hover-bg',     '--menu-level2-hover-bg'],
      ['header.menu.level2-hover-text',   '--menu-level2-hover-text'],
      ['header.menu.subcategory-heading', '--menu-subcategory-heading'],
      ['header.menu.mobile-bg',           '--menu-mobile-bg'],
      ['header.menu.mobile-header-bg',    '--menu-mobile-header-bg'],
      ['header.menu.mobile-border',       '--menu-mobile-border'],
      ['header.menu.mobile-text',         '--menu-mobile-text'],
      ['header.menu.mobile-text-hover',   '--menu-mobile-text-hover'],
    ]
  },
  {
    comment: 'Footer Colors',
    vars: [
      ['footer.bg',       '--footer-bg-color'],
      ['footer.text',     '--footer-text-color'],
      ['footer.h2-color', '--footer-h2-color'],
      ['footer.h3-color', '--footer-h3-color'],
    ]
  },
  {
    comment: 'Footer Newsletter Colors',
    vars: [
      ['footer.newsletter.bg',               '--footer-newsletter-bg'],
      ['footer.newsletter.title',            '--footer-newsletter-title'],
      ['footer.newsletter.text',             '--footer-newsletter-text'],
      ['footer.newsletter.button-bg',        '--footer-newsletter-button-bg'],
      ['footer.newsletter.button-text',      '--footer-newsletter-button-text'],
      ['footer.newsletter.button-hover',     '--footer-newsletter-button-hover'],
      ['footer.newsletter.input-bg',         '--footer-newsletter-input-bg'],
      ['footer.newsletter.input-text',       '--footer-newsletter-input-text'],
      ['footer.newsletter.input-border',     '--footer-newsletter-input-border'],
      ['footer.newsletter.input-focus-border','--footer-newsletter-input-focus-border'],
    ]
  },
  {
    comment: 'Footer Back to Top Button Colors',
    vars: [
      ['footer.back-to-top.bg',         '--footer-backtotop-bg'],
      ['footer.back-to-top.icon',       '--footer-backtotop-icon'],
      ['footer.back-to-top.hover-bg',   '--footer-backtotop-hover-bg'],
      ['footer.back-to-top.hover-icon', '--footer-backtotop-hover-icon'],
    ]
  },
  {
    comment: 'Product Slider Arrow Colors',
    vars: [
      ['product-slider.arrow-color',       '--product-slider-arrow-color'],
      ['product-slider.arrow-bg',          '--product-slider-arrow-bg'],
      ['product-slider.arrow-hover-color', '--product-slider-arrow-hover-color'],
      ['product-slider.arrow-hover-bg',    '--product-slider-arrow-hover-bg'],
      ['product-slider.arrow-border',      '--product-slider-arrow-border'],
    ]
  },
  {
    comment: 'Banner Slider',
    vars: [
      ['banner-slider.arrow-color',        '--banner-arrow-color'],
      ['banner-slider.arrow-bg',           '--banner-arrow-bg'],
      ['banner-slider.arrow-hover-bg',     '--banner-arrow-hover-bg'],
      ['banner-slider.arrow-size',         '--banner-arrow-size'],
      ['banner-slider.arrow-size-mobile',  '--banner-arrow-size-mobile'],
      ['banner-slider.arrow-icon-size',    '--banner-arrow-icon-size'],
      ['banner-slider.dot-color',          '--banner-dot-color'],
      ['banner-slider.dot-active-color',   '--banner-dot-active-color'],
      ['banner-slider.dot-size',           '--banner-dot-size'],
      ['banner-slider.dot-active-width',   '--banner-dot-active-width'],
      ['banner-slider.overlay-bg',         '--banner-overlay-bg'],
      ['banner-slider.content-max-width',  '--banner-content-max-width'],
      ['banner-slider.height-desktop',     '--banner-height-desktop'],
      ['banner-slider.height-tablet',      '--banner-height-tablet'],
      ['banner-slider.height-mobile',      '--banner-height-mobile'],
      ['banner-slider.transition-speed',   '--banner-transition-speed'],
      ['banner-slider.autoplay-speed',     '--banner-autoplay-speed'],
      ['banner-slider.border-radius',      '--banner-border-radius'],
    ]
  },
  {
    comment: 'Quick View',
    vars: [
      ['modules.quick-view.header-gradient-from',  '--quickview-header-gradient-from'],
      ['modules.quick-view.header-gradient-to',    '--quickview-header-gradient-to'],
      ['modules.quick-view.header-text',           '--quickview-header-text'],
      ['modules.quick-view.btn-primary-from',      '--quickview-btn-primary-from'],
      ['modules.quick-view.btn-primary-to',        '--quickview-btn-primary-to'],
      ['modules.quick-view.btn-primary-hover-from','--quickview-btn-primary-hover-from'],
      ['modules.quick-view.btn-primary-hover-to',  '--quickview-btn-primary-hover-to'],
      ['modules.quick-view.btn-primary-text',      '--quickview-btn-primary-text'],
      ['modules.quick-view.login-btn-from',        '--quickview-login-btn-from'],
      ['modules.quick-view.login-btn-to',          '--quickview-login-btn-to'],
      ['modules.quick-view.register-btn-from',     '--quickview-register-btn-from'],
      ['modules.quick-view.register-btn-to',       '--quickview-register-btn-to'],
    ]
  },
  {
    comment: 'Price Drop Alert',
    vars: [
      ['modules.price-drop-alert.box-bg',     '--pricedropalert-box-bg'],
      ['modules.price-drop-alert.box-border', '--pricedropalert-box-border'],
      ['modules.price-drop-alert.text',       '--pricedropalert-text'],
      ['modules.price-drop-alert.heading',    '--pricedropalert-heading'],
      ['modules.price-drop-alert.primary',    '--pricedropalert-primary'],
      ['modules.price-drop-alert.btn-from',   '--pricedropalert-btn-from'],
      ['modules.price-drop-alert.btn-to',     '--pricedropalert-btn-to'],
      ['modules.price-drop-alert.btn-text',   '--pricedropalert-btn-text'],
    ]
  },
  {
    comment: 'Low Stock Notification',
    vars: [
      ['modules.low-stock-notification.box-bg',     '--lowstocknotification-box-bg'],
      ['modules.low-stock-notification.box-border', '--lowstocknotification-box-border'],
      ['modules.low-stock-notification.text',       '--lowstocknotification-text'],
      ['modules.low-stock-notification.heading',    '--lowstocknotification-heading'],
      ['modules.low-stock-notification.primary',    '--lowstocknotification-primary'],
      ['modules.low-stock-notification.btn-from',   '--lowstocknotification-btn-from'],
      ['modules.low-stock-notification.btn-to',     '--lowstocknotification-btn-to'],
      ['modules.low-stock-notification.btn-text',   '--lowstocknotification-btn-text'],
    ]
  },
  {
    comment: 'WhatsApp',
    vars: [
      ['modules.whatsapp.button-bg',                          '--whatsapp-button-bg'],
      ['modules.whatsapp.button-text',                        '--whatsapp-button-text'],
      ['modules.whatsapp.float-size',                         '--whatsapp-float-size'],
      ['modules.whatsapp.float-size-mobile',                  '--whatsapp-float-size-mobile'],
      ['modules.whatsapp.float-icon-size',                    '--whatsapp-float-icon-size'],
      ['modules.whatsapp.float-icon-size-mobile',             '--whatsapp-float-icon-size-mobile'],
      ['modules.whatsapp.float-side-offset',                  '--whatsapp-float-side'],
      ['modules.whatsapp.float-bottom-offset',                '--whatsapp-float-bottom'],
      ['modules.whatsapp.float-bottom-offset-with-backtotop', '--whatsapp-float-bottom-with-btt'],
      ['modules.whatsapp.product-btn-icon-size',              '--whatsapp-product-btn-icon-size'],
      ['modules.whatsapp.product-btn-radius',                 '--whatsapp-product-btn-radius'],
    ]
  },
  {
    comment: 'Live Activity',
    vars: [
      ['modules.live-activity.bg',              '--live-activity-bg'],
      ['modules.live-activity.bg-dark',         '--live-activity-bg-dark'],
      ['modules.live-activity.text',            '--live-activity-text'],
      ['modules.live-activity.text-secondary',  '--live-activity-text-secondary'],
      ['modules.live-activity.text-dark',       '--live-activity-text-dark'],
      ['modules.live-activity.border',          '--live-activity-border'],
      ['modules.live-activity.border-dark',     '--live-activity-border-dark'],
      ['modules.live-activity.icon-bg',         '--live-activity-icon-bg'],
      ['modules.live-activity.icon-bg-end',     '--live-activity-icon-bg-end'],
      ['modules.live-activity.progress-bar',    '--live-activity-progress'],
      ['modules.live-activity.progress-bar-end','--live-activity-progress-end'],
      ['modules.live-activity.close-color',     '--live-activity-close'],
      ['modules.live-activity.close-hover',     '--live-activity-close-hover'],
      ['modules.live-activity.image-bg',        '--live-activity-image-bg'],
      ['modules.live-activity.image-border',    '--live-activity-image-border'],
      ['modules.live-activity.highlight',       '--live-activity-highlight'],
      ['modules.live-activity.shadow',          '--live-activity-shadow'],
    ]
  },
  {
    comment: 'Product Attachments',
    vars: [
      ['modules.product-attachments.primary',          '--pa-primary'],
      ['modules.product-attachments.primary-dark',     '--pa-primary-dark'],
      ['modules.product-attachments.bg',               '--pa-bg'],
      ['modules.product-attachments.bg-hover',         '--pa-bg-hover'],
      ['modules.product-attachments.text',             '--pa-text'],
      ['modules.product-attachments.text-secondary',   '--pa-text-secondary'],
      ['modules.product-attachments.text-muted',       '--pa-text-muted'],
      ['modules.product-attachments.border',           '--pa-border'],
      ['modules.product-attachments.icon-bg',          '--pa-icon-bg'],
      ['modules.product-attachments.icon-text',        '--pa-icon-text'],
      ['modules.product-attachments.badge-bg',         '--pa-badge-bg'],
      ['modules.product-attachments.badge-text',       '--pa-badge-text'],
      ['modules.product-attachments.download-btn-bg',  '--pa-download-btn-bg'],
      ['modules.product-attachments.download-btn-text','--pa-download-btn-text'],
      ['modules.product-attachments.table-header-bg',  '--pa-table-header-bg'],
      ['modules.product-attachments.table-header-text','--pa-table-header-text'],
      ['modules.product-attachments.table-row-hover',  '--pa-table-row-hover'],
      ['modules.product-attachments.success',          '--pa-success'],
      ['modules.product-attachments.warning',          '--pa-warning'],
      ['modules.product-attachments.danger',           '--pa-danger'],
    ]
  },
  {
    comment: 'Badge Colors',
    vars: [
      ['badges.sale',       '--badge-sale'],
      ['badges.new',        '--badge-new'],
      ['badges.hot',        '--badge-hot'],
      ['badges.limited',    '--badge-limited'],
      ['badges.exclusive',  '--badge-exclusive'],
      ['badges.bestseller', '--badge-bestseller'],
      ['badges.trending',   '--badge-trending'],
      ['badges.featured',   '--badge-featured'],
    ]
  },
  {
    comment: 'Header Layout',
    vars: [
      ['header.height',                '--header-height'],
      ['header.logo.desktop-width',    '--logo-desktop-width'],
      ['header.logo.desktop-height',   '--logo-desktop-height'],
      ['header.logo.mobile-width',     '--logo-mobile-width'],
      ['header.logo.mobile-height',    '--logo-mobile-height'],
    ]
  },
  {
    comment: 'Footer H2/H3 Colors',
    vars: [
      ['footer.h2-color', '--footer-h2-color'],
      ['footer.h3-color', '--footer-h3-color'],
    ]
  },
];

/**
 * Resolve a dot-path like "colors.primary.DEFAULT" from the config object.
 */
function resolve(path) {
  const keys = path.split('.');
  let val = config;
  for (const key of keys) {
    if (val == null || typeof val !== 'object') return undefined;
    val = val[key];
  }
  return val;
}

function primaryFill() {
  const fill = resolve('colors.primary.fill');
  if (fill) return fill;
  const base = String(resolve('colors.primary.DEFAULT') || '');
  if (base.toUpperCase() === '#0D9488') {
    return resolve('colors.primary.darker') || '#0F766E';
  }
  return base;
}

// Build the CSS output
const now = new Date();
const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);

let lines = [];
lines.push('/**');
lines.push(' * Auto-generated from theme-config.json');
lines.push(' * DO NOT EDIT - Run "node generate-theme-css.js" to regenerate');
lines.push(` * Generated: ${timestamp}`);
lines.push(' */');
lines.push('');
lines.push('@theme {');

for (const section of sections) {
  lines.push('');
  lines.push(`    /* ${section.comment} */`);
  for (const [jsonPath, cssVar] of section.vars) {
    const value = resolve(jsonPath);
    if (value === undefined) {
      console.warn(`WARNING: Missing config value for path "${jsonPath}" (CSS var: ${cssVar})`);
      continue;
    }
    lines.push(`    ${cssVar}: ${value};`);
  }
  if (section.comment === 'Primary Colors') {
    lines.push(`    --color-primary-fill: ${primaryFill()};`);
  }
}

lines.push('}');
lines.push('');

// Ensure output directory exists
mkdirSync(dirname(outputPath), { recursive: true });

writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`Generated ${outputPath}`);
console.log(`Total CSS variables: ${sections.reduce((sum, s) => sum + s.vars.length, 0)}`);
