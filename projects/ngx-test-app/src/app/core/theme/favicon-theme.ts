import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  effect,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { ThemeService } from '@dmaster/ui';

import { PALETTE_PRESETS } from '../palette/palette';
import { PaletteService } from '../palette/palette.service';

const LIGHT = { primary: '#006FEE', primaryHover: '#005BC4' };
const DARK = { primary: '#338EF7', primaryHover: '#66AAF9' };

/**
 * Keeps the browser-tab favicon in sync with what the app is actually
 * showing (resolved light/dark theme + live palette), same source of truth
 * as the header/hero logo — never a fixed color independent of the theme.
 *
 * Colors are resolved from ThemeService/PaletteService state directly
 * (not read back from the DOM via getComputedStyle) to sidestep any
 * effect-ordering race with ThemeService's own effect that stamps
 * `data-dm-theme`.
 *
 * public/favicon.svg (its own document, no access to this app's CSS vars
 * or JS state) stands in for the pre-hydration paint, and reacts to the
 * OS-level `prefers-color-scheme` on its own — the one axis a static file
 * can observe. This service takes over once Angular boots and can react to
 * the in-app toggle and the palette picker too.
 */
@Injectable({ providedIn: 'root' })
export class FaviconThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly theme = inject(ThemeService);
  private readonly palette = inject(PaletteService);

  constructor() {
    if (!this.document.defaultView) return; // SSR/prerender: the static favicon.svg stands in.

    effect(() => {
      const preset = PALETTE_PRESETS.find((p) => p.key === this.palette.current());
      const colors =
        preset && preset.key !== 'default'
          ? { primary: preset.primary, primaryHover: preset.primaryHover }
          : this.theme.resolvedTheme() === 'dark'
            ? DARK
            : LIGHT;
      this.apply(colors.primary, colors.primaryHover);
    });
  }

  private apply(primary: string, primaryHover: string): void {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<defs>' +
      '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      `<stop offset="0" stop-color="${primaryHover}"/>` +
      `<stop offset="1" stop-color="${primary}"/>` +
      '</linearGradient>' +
      '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffffff" stop-opacity="0.22"/>' +
      '<stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="64" height="64" rx="16" fill="url(#g)"/>' +
      '<rect width="64" height="64" rx="16" fill="url(#s)"/>' +
      '<text x="32" y="34" text-anchor="middle" dominant-baseline="central" ' +
      "font-family=\"'Inter','Segoe UI',system-ui,-apple-system,Arial,sans-serif\" " +
      'font-size="31" font-weight="700" letter-spacing="-2.5" fill="#ffffff">dm</text>' +
      '</svg>';

    // Target ONLY the SVG favicon link (modern browser tabs) so the static
    // .ico / PNG links stay intact for Google Search and older browsers.
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][type="image/svg+xml"]',
    );
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/svg+xml';
      this.document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }
}

/** Arranca el favicon reactivo con la app. */
export function provideFaviconTheme(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => inject(FaviconThemeService));
}
