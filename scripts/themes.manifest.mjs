/**
 * Prebuilt theme palettes for @dmaster/ui — the SINGLE SOURCE OF TRUTH.
 *
 * `scripts/build-themes.mjs` turns each entry into a tiny CSS file under
 * `dist/dmaster-ui/themes/<name>.css`, shipped on the `./themes/*` subpath.
 *
 * A prebuilt theme only recolors the BRAND (`--dm-primary` + its foreground);
 * every derived token (`-hover`, `-text`, `-subtle`, the brand gradient, the
 * focus ring) re-computes from that base via the library's OKLCH cascade, in
 * BOTH light and dark, so the light/dark toggle keeps working. That is why an
 * entry is just a light hue, a dark hue and a label colour.
 *
 * Contract enforced by the build script (fails the build otherwise):
 *  - `light` is the primary on `:root`; `dark` is the primary under
 *    `[data-dm-theme='dark']`.
 *  - `fg` (the label over a solid fill) must clear WCAG AA (>= 4.5:1) against
 *    BOTH the light and the dark fill — bright hues (cyan/orange/green) take a
 *    dark label, deep hues take white, exactly like the built-in status colors.
 *
 * Names are neutral/aesthetic on purpose (no third-party brand names in a
 * published package). Hues are spread around the wheel; `default` (the built-in
 * blue) needs no file.
 *
 * Two consumers mirror this list — keep them in sync when editing:
 *  - schema.json's `theme` enum (the `ng add` prompt).
 *  - the dashboard's live palette picker (projects/ngx-test-app/.../palette.ts).
 *
 * @typedef {{ name: string, label: string, light: string, dark: string, fg: string }} ThemePalette
 * @type {readonly ThemePalette[]}
 */
export const THEMES = [
  { name: 'ocean', label: 'Ocean', light: '#06b6d4', dark: '#22d3ee', fg: '#052b34' },
  { name: 'cobalt', label: 'Cobalt', light: '#2563eb', dark: '#3b6fe6', fg: '#ffffff' },
  { name: 'iris', label: 'Iris', light: '#4f46e5', dark: '#5b54e8', fg: '#ffffff' },
  { name: 'grape', label: 'Grape', light: '#9333ea', dark: '#9333ea', fg: '#ffffff' },
  { name: 'rose', label: 'Rose', light: '#e11d48', dark: '#e11d48', fg: '#ffffff' },
  { name: 'ember', label: 'Ember', light: '#dc2626', dark: '#dc2626', fg: '#ffffff' },
  { name: 'sunset', label: 'Sunset', light: '#ea580c', dark: '#f97316', fg: '#2a1206' },
  { name: 'forest', label: 'Forest', light: '#16a34a', dark: '#22c55e', fg: '#052e16' },
  { name: 'slate', label: 'Slate', light: '#475569', dark: '#556173', fg: '#ffffff' },
];
