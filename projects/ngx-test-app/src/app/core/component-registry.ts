import { DashboardTranslations } from './i18n/translations.types';

/** Nav dictionary shape — used to type `navKey` below without `any`. */
type ShellNav = DashboardTranslations['shell']['nav'];

/** Stable category keys — drive the per-section grouping on the Overview page. */
export type CategoryKey =
  | 'primitives'
  | 'layout'
  | 'feedback'
  | 'buttons'
  | 'forms'
  | 'navigation'
  | 'dataDisplay'
  | 'overlays';

/** Ordered category keys (defines the Overview section order too). */
export const CATEGORY_ORDER: CategoryKey[] = [
  'primitives',
  'layout',
  'feedback',
  'buttons',
  'forms',
  'navigation',
  'dataDisplay',
  'overlays',
];

/** One entry per library component. */
export interface ComponentRegistryEntry {
  /** Route segment (`/components/{id}`) and Overview `@switch` case. */
  id: string;
  categoryKey: CategoryKey;
  /** Key into `shell.nav` for the localized display name. */
  navKey: keyof ShellNav;
}

/**
 * Canonical, single-source-of-truth list of every documented library
 * component. The Overview page renders one tile per entry; the Home page's
 * "N components" stat is simply this array's length. Adding a component to
 * the library MUST add it here too — see the "nuevo componente" checklist in
 * CLAUDE.md — or the count silently drifts from reality again.
 */
export const COMPONENT_REGISTRY: ComponentRegistryEntry[] = [
  { id: 'skeleton', categoryKey: 'primitives', navKey: 'skeleton' },
  { id: 'spinner', categoryKey: 'primitives', navKey: 'spinner' },
  { id: 'badge', categoryKey: 'primitives', navKey: 'badge' },
  { id: 'avatar', categoryKey: 'primitives', navKey: 'avatar' },
  { id: 'kbd', categoryKey: 'primitives', navKey: 'kbd' },
  { id: 'icon', categoryKey: 'primitives', navKey: 'icon' },
  { id: 'card', categoryKey: 'layout', navKey: 'card' },
  { id: 'accordion', categoryKey: 'layout', navKey: 'accordion' },
  { id: 'divider', categoryKey: 'layout', navKey: 'divider' },
  { id: 'progress', categoryKey: 'feedback', navKey: 'progress' },
  { id: 'alert', categoryKey: 'feedback', navKey: 'alert' },
  { id: 'button', categoryKey: 'buttons', navKey: 'button' },
  { id: 'button-group', categoryKey: 'buttons', navKey: 'buttonGroup' },
  { id: 'copy-button', categoryKey: 'buttons', navKey: 'copyButton' },
  { id: 'switch', categoryKey: 'forms', navKey: 'switch' },
  { id: 'checkbox', categoryKey: 'forms', navKey: 'checkbox' },
  { id: 'radio-group', categoryKey: 'forms', navKey: 'radioGroup' },
  { id: 'select', categoryKey: 'forms', navKey: 'select' },
  { id: 'autocomplete', categoryKey: 'forms', navKey: 'autocomplete' },
  { id: 'search-field', categoryKey: 'forms', navKey: 'searchField' },
  { id: 'date-picker', categoryKey: 'forms', navKey: 'datePicker' },
  { id: 'color-picker', categoryKey: 'forms', navKey: 'colorPicker' },
  { id: 'slider', categoryKey: 'forms', navKey: 'slider' },
  { id: 'rating', categoryKey: 'forms', navKey: 'rating' },
  { id: 'file-upload', categoryKey: 'forms', navKey: 'fileUpload' },
  { id: 'number-input', categoryKey: 'forms', navKey: 'numberInput' },
  { id: 'otp', categoryKey: 'forms', navKey: 'otp' },
  { id: 'toggle-group', categoryKey: 'forms', navKey: 'toggleGroup' },
  { id: 'form-field', categoryKey: 'forms', navKey: 'formField' },
  { id: 'error-message', categoryKey: 'forms', navKey: 'errorMessage' },
  { id: 'breadcrumbs', categoryKey: 'navigation', navKey: 'breadcrumbs' },
  { id: 'tabs', categoryKey: 'navigation', navKey: 'tabs' },
  { id: 'pagination', categoryKey: 'navigation', navKey: 'pagination' },
  { id: 'stepper', categoryKey: 'navigation', navKey: 'stepper' },
  { id: 'table', categoryKey: 'dataDisplay', navKey: 'table' },
  { id: 'tree', categoryKey: 'dataDisplay', navKey: 'tree' },
  { id: 'timeline', categoryKey: 'dataDisplay', navKey: 'timeline' },
  { id: 'empty-state', categoryKey: 'dataDisplay', navKey: 'emptyState' },
  { id: 'tooltip', categoryKey: 'overlays', navKey: 'tooltip' },
  { id: 'popover', categoryKey: 'overlays', navKey: 'popover' },
  { id: 'menu', categoryKey: 'overlays', navKey: 'menu' },
  { id: 'dialog', categoryKey: 'overlays', navKey: 'dialog' },
  { id: 'drawer', categoryKey: 'overlays', navKey: 'drawer' },
  { id: 'toast', categoryKey: 'overlays', navKey: 'toast' },
  { id: 'command', categoryKey: 'overlays', navKey: 'command' },
];
