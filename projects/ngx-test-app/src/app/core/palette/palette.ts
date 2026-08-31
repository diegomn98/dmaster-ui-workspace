/**
 * Preset palettes for the live theme picker. The picker only writes
 * `--dm-primary` (and `--dm-primary-fg` for labels over solid fills) as inline
 * styles on <html> — the library's derived-token cascade re-derives `-hover`,
 * `-text` and `-subtle` from the base automatically, which is exactly the
 * customization story the picker demos.
 *
 * `primaryHover` stays as DATA (not written to CSS): the favicon SVG is a
 * standalone document with no access to the page's CSS, so
 * `FaviconThemeService` needs a concrete hex pair for its gradient.
 *
 * The `default` preset removes the inline overrides so the library's own
 * light/dark values (from _themes.scss) can take over.
 */
export interface PalettePreset {
  key: string;
  label: string;
  primary: string;
  primaryHover: string;
  primaryFg: string;
}

// The non-default presets mirror the prebuilt themes SHIPPED on the
// `@dmaster/ui/themes/*` subpath, so this live picker previews exactly what
// `ng add`/the CSS files apply. Keep the hues in sync with the single source of
// truth, scripts/themes.manifest.mjs (`primary` = its `light`, `primaryFg` =
// its `fg`; `primaryHover` is a darker step used only by the favicon SVG).
export const PALETTE_PRESETS: readonly PalettePreset[] = [
  {
    key: 'default',
    label: 'Default',
    primary: '#006FEE',
    primaryHover: '#005BC4',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'ocean',
    label: 'Ocean',
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    primaryFg: '#052B34',
  },
  {
    key: 'cobalt',
    label: 'Cobalt',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'iris',
    label: 'Iris',
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'grape',
    label: 'Grape',
    primary: '#9333EA',
    primaryHover: '#7E22CE',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'rose',
    label: 'Rose',
    primary: '#E11D48',
    primaryHover: '#BE123C',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'ember',
    label: 'Ember',
    primary: '#DC2626',
    primaryHover: '#B91C1C',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'sunset',
    label: 'Sunset',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    primaryFg: '#2A1206',
  },
  {
    key: 'forest',
    label: 'Forest',
    primary: '#16A34A',
    primaryHover: '#15803D',
    primaryFg: '#052E16',
  },
  {
    key: 'slate',
    label: 'Slate',
    primary: '#475569',
    primaryHover: '#334155',
    primaryFg: '#FFFFFF',
  },
];

export type PaletteKey = (typeof PALETTE_PRESETS)[number]['key'];
