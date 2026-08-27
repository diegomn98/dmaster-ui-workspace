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

export const PALETTE_PRESETS: readonly PalettePreset[] = [
  {
    key: 'default',
    label: 'Default',
    primary: '#006FEE',
    primaryHover: '#005BC4',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'sky',
    label: 'Sky',
    primary: '#0EA5E9',
    primaryHover: '#0284C7',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'lavender',
    label: 'Lavender',
    primary: '#A855F7',
    primaryHover: '#9333EA',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'mint',
    label: 'Mint',
    primary: '#10B981',
    primaryHover: '#059669',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'netflix',
    label: 'Netflix',
    primary: '#E50914',
    primaryHover: '#B00610',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'uber',
    label: 'Uber',
    primary: '#276EF1',
    primaryHover: '#1E54B7',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'spotify',
    label: 'Spotify',
    primary: '#1DB954',
    primaryHover: '#169240',
    primaryFg: '#000000',
  },
  {
    key: 'coinbase',
    label: 'Coinbase',
    primary: '#0052FF',
    primaryHover: '#0040CC',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'airbnb',
    label: 'Airbnb',
    primary: '#FF385C',
    primaryHover: '#E31C5F',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'discord',
    label: 'Discord',
    primary: '#5865F2',
    primaryHover: '#4752C4',
    primaryFg: '#FFFFFF',
  },
  {
    key: 'rabbit',
    label: 'Rabbit',
    primary: '#F97316',
    primaryHover: '#EA580C',
    primaryFg: '#FFFFFF',
  },
];

export type PaletteKey = (typeof PALETTE_PRESETS)[number]['key'];
