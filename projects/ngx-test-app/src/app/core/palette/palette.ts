/**
 * Preset palettes for the live theme picker. Each entry defines the four
 * `--dm-primary-*` tokens the library uses; the picker writes them as inline
 * styles on <html>, so the whole app re-skins instantly.
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
  primarySubtle: string;
}

export const PALETTE_PRESETS: readonly PalettePreset[] = [
  {
    key: 'default',
    label: 'Default',
    primary: '#006FEE',
    primaryHover: '#005BC4',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(0 111 238 / 12%)',
  },
  {
    key: 'sky',
    label: 'Sky',
    primary: '#0EA5E9',
    primaryHover: '#0284C7',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(14 165 233 / 15%)',
  },
  {
    key: 'lavender',
    label: 'Lavender',
    primary: '#A855F7',
    primaryHover: '#9333EA',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(168 85 247 / 15%)',
  },
  {
    key: 'mint',
    label: 'Mint',
    primary: '#10B981',
    primaryHover: '#059669',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(16 185 129 / 15%)',
  },
  {
    key: 'netflix',
    label: 'Netflix',
    primary: '#E50914',
    primaryHover: '#B00610',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(229 9 20 / 15%)',
  },
  {
    key: 'uber',
    label: 'Uber',
    primary: '#276EF1',
    primaryHover: '#1E54B7',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(39 110 241 / 15%)',
  },
  {
    key: 'spotify',
    label: 'Spotify',
    primary: '#1DB954',
    primaryHover: '#169240',
    primaryFg: '#000000',
    primarySubtle: 'rgb(29 185 84 / 15%)',
  },
  {
    key: 'coinbase',
    label: 'Coinbase',
    primary: '#0052FF',
    primaryHover: '#0040CC',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(0 82 255 / 15%)',
  },
  {
    key: 'airbnb',
    label: 'Airbnb',
    primary: '#FF385C',
    primaryHover: '#E31C5F',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(255 56 92 / 15%)',
  },
  {
    key: 'discord',
    label: 'Discord',
    primary: '#5865F2',
    primaryHover: '#4752C4',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(88 101 242 / 15%)',
  },
  {
    key: 'rabbit',
    label: 'Rabbit',
    primary: '#F97316',
    primaryHover: '#EA580C',
    primaryFg: '#FFFFFF',
    primarySubtle: 'rgb(249 115 22 / 15%)',
  },
];

export type PaletteKey = (typeof PALETTE_PRESETS)[number]['key'];
