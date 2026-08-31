import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmButtonComponent } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { PALETTE_PRESETS } from '../../core/palette/palette';
import { PaletteService } from '../../core/palette/palette.service';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';

@Component({
  selector: 'app-theming-page',
  imports: [RouterLink, DmButtonComponent, CodeSnippetComponent],
  templateUrl: './theming-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemingPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().theming);

  // ---- Prebuilt themes gallery (live preview, dogfoods PaletteService) ------
  protected readonly palette = inject(PaletteService);
  protected readonly presets = PALETTE_PRESETS;

  /** `ng add` line for the active preset — prebuilt themes ship on a subpath. */
  protected readonly themeInstall = computed(() => {
    const key = this.palette.current();
    return key === 'default' ? 'ng add @dmaster/ui' : `ng add @dmaster/ui --theme=${key}`;
  });

  /** angular.json styles for the active preset (falls back to `ocean` on default). */
  protected readonly themeStylesCode = computed(() => {
    const key = this.palette.current();
    const name = key === 'default' ? 'ocean' : key;
    return [
      '// angular.json → architect.build.options.styles',
      '"styles": [',
      '  "node_modules/@angular/cdk/overlay-prebuilt.css",',
      '  "node_modules/@dmaster/ui/styles/dmaster-ui.css",',
      `  "node_modules/@dmaster/ui/themes/${name}.css"`,
      ']',
    ].join('\n');
  });

  // ---- Code snippets --------------------------------------------------------

  protected readonly overrideCode = [
    '/* Override any token in plain CSS — no Sass, no build step */',
    ':root {',
    '  --dm-primary: #e11d48;         /* a bold rose accent */',
    '  --dm-radius-md: 0.5rem;        /* sharper corners */',
    '}',
  ].join('\n');

  protected readonly allTokensCode = [
    '/* Surfaces */',
    '--dm-bg                /* page base */',
    '--dm-bg-subtle         /* sunken areas, code blocks */',
    '--dm-bg-muted          /* input fills, hover backgrounds */',
    '--dm-bg-elevated       /* cards, popovers, raised panels */',
    '',
    '/* Text */',
    '--dm-fg                /* primary text */',
    '--dm-fg-muted          /* secondary labels, descriptions */',
    '--dm-fg-subtle         /* placeholders, disabled states */',
    '',
    '/* Borders */',
    '--dm-border            /* standard separators, input outlines */',
    '--dm-border-strong     /* emphasized dividers */',
    '',
    '/* Shadows */',
    '--dm-shadow-sm         /* subtle elevation */',
    '--dm-shadow-md         /* cards, dropdowns */',
    '--dm-shadow-lg         /* dialogs, drawers */',
    '--dm-shadow-xl         /* top-level overlays */',
  ].join('\n');

  protected readonly colorRolesCode = [
    '/* Six semantic colors, each with five role variants */',
    '',
    '/* Base      */ --dm-primary             /* solid fills, borders, icons */',
    '/* Hover     */ --dm-primary-hover        /* interactive hover state */',
    '/* Foreground*/ --dm-primary-fg           /* text on solid fill (white on blue) */',
    '/* Subtle    */ --dm-primary-subtle        /* tinted background for flat variants */',
    '/* Text      */ --dm-primary-text          /* text on subtle background */',
    '',
    '/* Same pattern for all six: */',
    '/* default | primary | secondary | success | warning | danger */',
  ].join('\n');

  protected readonly cascadeCode = [
    '/* Override ONE token — hover, text, and subtle re-derive automatically */',
    ':root {',
    '  --dm-primary: #e50914;',
    '}',
    '',
    '/* What the browser computes via OKLCH relative color syntax: */',
    '/* --dm-primary-hover: oklch(from #e50914 49.2% calc(c * 0.859) h)  */',
    '/* --dm-primary-text:  oklch(from #e50914 38.7% calc(c * 0.82) h)   */',
    '/* --dm-primary-subtle: color-mix(in srgb, #e50914 12%, transparent) */',
  ].join('\n');

  protected readonly oklchCode = [
    '/* OKLCH relative color syntax — how the cascade works */',
    '',
    '/* Fixed lightness preserves WCAG AA contrast for ANY brand color */',
    '--dm-primary-hover: oklch(from var(--dm-primary) 49.2% calc(c * 0.859) h);',
    '--dm-primary-text:  oklch(from var(--dm-primary) 38.7% calc(c * 0.82) h);',
    '',
    '/* Subtle via color-mix — controlled alpha over transparent */',
    '--dm-primary-subtle: color-mix(in srgb, var(--dm-primary) 12%, transparent);',
  ].join('\n');

  protected readonly themeServiceCode = [
    "import { inject } from '@angular/core';",
    "import { ThemeService } from '@dmaster/ui';",
    '',
    '@Component({ /* ... */ })',
    'export class MyComponent {',
    '  private readonly theme = inject(ThemeService);',
    '',
    '  // Read the active theme',
    "  current = this.theme.theme();           // 'auto' | 'light' | 'dark' | string",
    "  resolved = this.theme.resolvedTheme();   // what's on <html>",
    "  scheme = this.theme.scheme();            // always 'light' or 'dark'",
    '',
    '  // Switch themes',
    '  toggle(): void { this.theme.toggle(); }',
    "  goDark(): void { this.theme.setTheme('dark'); }",
    "  useSystem(): void { this.theme.setTheme('auto'); }",
    '',
    '  // List all registered themes (for building a picker)',
    '  allThemes = this.theme.themes();',
    '}',
  ].join('\n');

  protected readonly namedThemeCode = [
    '// 1. Register the theme in your ApplicationConfig',
    "import { provideDmasterUI } from '@dmaster/ui';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    '    provideDmasterUI({',
    '      themes: {',
    "        midnight: { scheme: 'dark', label: 'Midnight' },",
    "        forest:  { scheme: 'dark', label: 'Forest' },",
    "        sand:    { scheme: 'light', label: 'Sand' },",
    '      },',
    '    }),',
    '  ],',
    '};',
  ].join('\n');

  protected readonly namedThemeCssCode = [
    '/* 2. Author the CSS tokens (styles.scss) */',
    "[data-dm-theme='midnight'] {",
    '  --dm-bg: #0b1020;',
    '  --dm-bg-subtle: #111630;',
    '  --dm-bg-muted: #1a1f40;',
    '  --dm-bg-elevated: #222850;',
    '  --dm-primary: #7c9cff;',
    '  --dm-border: rgba(124, 156, 255, 0.15);',
    '  /* ...only the tokens you want to change */',
    '}',
  ].join('\n');

  protected readonly namedThemeApplyCode = [
    '// 3. Apply by name — light/dark still work as expected',
    "inject(ThemeService).setTheme('midnight');",
    '',
    '// Build a picker from all registered themes',
    'const themes = inject(ThemeService).themes();',
    "// → [{ name: 'light', ... }, { name: 'dark', ... }, { name: 'midnight', ... }, ...]",
  ].join('\n');

  protected readonly densityCode = [
    '// Set the default density at application start',
    "provideDmasterUI({ density: 'compact' }),",
    '',
    '// Or change at runtime with DensityService',
    "import { DensityService } from '@dmaster/ui';",
    '',
    'const density = inject(DensityService);',
    "density.setDensity('spacious');",
    "const current = density.density(); // 'compact' | 'comfortable' | 'spacious'",
  ].join('\n');

  protected readonly motionCode = [
    '/* Use the shared motion tokens for consistency */',
    '.my-panel {',
    '  transition:',
    '    transform var(--dm-duration-base) var(--dm-ease-out),',
    '    opacity var(--dm-duration-fast) var(--dm-ease-out);',
    '}',
    '',
    '.my-button:active {',
    '  transform: scale(0.95);',
    '  transition: transform var(--dm-duration-fast) var(--dm-ease-snappy);',
    '}',
    '',
    '/* Under prefers-reduced-motion: reduce, all --dm-duration-*  */',
    '/* collapse to 0ms automatically — zero opt-in required.      */',
  ].join('\n');

  protected readonly reducedMotionCode = [
    "import { ReducedMotionService } from '@dmaster/ui';",
    '',
    'const motion = inject(ReducedMotionService);',
    '',
    '// Reactive signal — true when prefers-reduced-motion: reduce is active',
    'if (motion.reducedMotion()) {',
    '  // skip programmatic animations',
    '}',
  ].join('\n');

  protected readonly componentTokensCode = [
    '/* Per-component tokens — consumed with verbatim fallback */',
    '/* (inside button.component.scss): */',
    '/*   border-radius: var(--dm-button-radius, var(--dm-radius-full)); */',
    '',
    '/* Override globally */',
    ':root {',
    '  --dm-button-radius: var(--dm-radius-md);',
    '  --dm-button-height: 3rem;',
    '}',
    '',
    '/* Override per-theme */',
    "[data-dm-theme='midnight'] {",
    '  --dm-card-shadow: var(--dm-shadow-lg);',
    '  --dm-switch-track-bg: #2a2e55;',
    '}',
    '',
    '/* Override per-instance */',
    'dm-button {',
    '  --dm-button-radius: var(--dm-radius-sm);',
    '}',
  ].join('\n');

  protected readonly overlayCode = [
    '// Overlay panels are portaled to <body> by the CDK.',
    '// A subtree override will NOT reach them.',
    '// Use panelClass to scope styles inside an overlay:',
    '',
    "import { DmDialogService } from '@dmaster/ui';",
    '',
    'const dialog = inject(DmDialogService);',
    '',
    'dialog.open(MyDialogComponent, {',
    "  panelClass: 'my-branded-panel',",
    '  data: { /* ... */ },',
    '});',
  ].join('\n');

  protected readonly overlayStyleCode = [
    '/* The panelClass lands directly on the CDK overlay pane */',
    '.my-branded-panel {',
    '  --dm-primary: #f31260;',
    '  --dm-bg: #1a0820;',
    '  --dm-bg-elevated: #2a1830;',
    '}',
  ].join('\n');
}
