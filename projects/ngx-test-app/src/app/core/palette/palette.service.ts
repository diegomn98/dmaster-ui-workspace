import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

import { PALETTE_PRESETS } from './palette';

const DEFAULT_KEY = 'default';

/**
 * Manages the current preset palette. Writes the four `--dm-primary-*` tokens
 * to <html>'s inline style so every component re-skins live. The `default`
 * preset removes the inline overrides — the library's own light/dark values
 * from _themes.scss take over.
 *
 * Deliberately NOT persisted: the app always starts on the default theme
 * (brand identity — logo, favicon, hero — is derived from --dm-primary, so a
 * stale non-default palette surviving a reload would make the whole brand
 * look inconsistent). The picker is a live "try it out" tool for the current
 * session only.
 */
@Injectable({ providedIn: 'root' })
export class PaletteService {
  private readonly document = inject(DOCUMENT);
  private readonly _current = signal<string>(DEFAULT_KEY);
  readonly current = this._current.asReadonly();

  setPalette(key: string): void {
    if (!PALETTE_PRESETS.some((p) => p.key === key)) return;
    this._current.set(key);
    this.apply(key);
  }

  private apply(key: string): void {
    // En SSR/prerender no hay CSSOM fiable y la paleta es puramente cosmética:
    // el HTML estático sale con la paleta por defecto y el cliente re-aplica.
    if (!this.document.defaultView) return;

    const root = this.document.documentElement.style;
    if (key === DEFAULT_KEY) {
      root.removeProperty('--dm-primary');
      root.removeProperty('--dm-primary-hover');
      root.removeProperty('--dm-primary-fg');
      root.removeProperty('--dm-primary-subtle');
      return;
    }
    const preset = PALETTE_PRESETS.find((p) => p.key === key);
    if (!preset) return;
    root.setProperty('--dm-primary', preset.primary);
    root.setProperty('--dm-primary-hover', preset.primaryHover);
    root.setProperty('--dm-primary-fg', preset.primaryFg);
    root.setProperty('--dm-primary-subtle', preset.primarySubtle);
  }
}
