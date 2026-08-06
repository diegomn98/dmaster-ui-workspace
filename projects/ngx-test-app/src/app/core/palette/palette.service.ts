import { Injectable, signal } from '@angular/core';

import { PALETTE_PRESETS } from './palette';

const STORAGE_KEY = 'dmaster-ui-palette';
const DEFAULT_KEY = 'default';

/**
 * Manages the current preset palette. Writes the four `--dm-primary-*` tokens
 * to <html>'s inline style so every component re-skins live. The `default`
 * preset removes the inline overrides — the library's own light/dark values
 * from _themes.scss take over.
 */
@Injectable({ providedIn: 'root' })
export class PaletteService {
  private readonly _current = signal<string>(this.readInitial());
  readonly current = this._current.asReadonly();

  constructor() {
    this.apply(this._current());
  }

  setPalette(key: string): void {
    if (!PALETTE_PRESETS.some((p) => p.key === key)) return;
    this._current.set(key);
    this.apply(key);
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      /* localStorage unavailable — silently ignore (SSR, privacy mode) */
    }
  }

  private apply(key: string): void {
    const root = document.documentElement.style;
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

  private readInitial(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && PALETTE_PRESETS.some((p) => p.key === stored)) return stored;
    } catch {
      /* localStorage unavailable */
    }
    return DEFAULT_KEY;
  }
}
