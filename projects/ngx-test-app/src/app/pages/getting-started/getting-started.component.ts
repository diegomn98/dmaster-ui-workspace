import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmButtonComponent } from '@dmaster/ui/button';

import { LocaleService } from '../../core/i18n/locale.service';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';

@Component({
  selector: 'app-getting-started',
  imports: [RouterLink, DmButtonComponent, CodeSnippetComponent],
  templateUrl: './getting-started.component.html',
  styleUrl: './getting-started.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GettingStartedComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().gettingStarted);

  // ---- Code snippets --------------------------------------------------------
  protected readonly installNgAdd = 'ng add @dmaster/ui';
  protected readonly installNpm = 'npm install @dmaster/ui @angular/cdk';
  protected readonly installPnpm = 'pnpm add @dmaster/ui @angular/cdk';
  protected readonly installYarn = 'yarn add @dmaster/ui @angular/cdk';

  protected readonly stylesCode = [
    '/* src/styles.scss */',
    "@use '@dmaster/ui/styles/index';",
  ].join('\n');

  protected readonly overlayCode = [
    '// angular.json — inside build.options.styles',
    '"styles": [',
    '  "node_modules/@angular/cdk/overlay-prebuilt.css",',
    '  "src/styles.scss"',
    ']',
  ].join('\n');

  protected readonly providersCode = [
    '// src/app/app.config.ts',
    "import { ApplicationConfig } from '@angular/core';",
    "import { provideDmasterUI } from '@dmaster/ui/core';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    "    provideDmasterUI({ theme: 'auto', density: 'comfortable' }),",
    '  ],',
    '};',
  ].join('\n');

  protected readonly firstComponentCode = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent } from '@dmaster/ui/button';",
    '',
    '@Component({',
    "  selector: 'app-save-form',",
    '  imports: [DmButtonComponent],',
    '  template: `',
    '    <dm-button color="primary" [state]="saving() ? \'loading\' : \'idle\'" (clicked)="save()">',
    '      Save changes',
    '    </dm-button>',
    '  `,',
    '})',
    'export class SaveFormComponent {',
    '  protected readonly saving = signal(false);',
    '  save(): void { /* ... */ }',
    '}',
  ].join('\n');

  protected readonly importsCode = [
    "import { provideDmasterUI, ThemeService } from '@dmaster/ui/core';",
    "import { DmButtonComponent } from '@dmaster/ui/button';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui/select';",
    "import { DmTabComponent, DmTabPanelComponent, DmTabsComponent } from '@dmaster/ui/tabs';",
    "import { DmIconComponent, provideDmasterIcons } from '@dmaster/ui/icon'; // the component",
    "import { DM_ICONS } from '@dmaster/ui/icons'; // optional curated SVG set",
  ].join('\n');

  protected readonly migrationCode = [
    '// Before — deprecated root import (still works in 0.12)',
    'import {',
    '  provideDmasterUI,',
    '  DmButtonComponent,',
    '  DmToggleComponent,',
    '  DmToggleGroupComponent,',
    '  DmDialogService,',
    '  DialogRef,',
    "} from '@dmaster/ui';",
    '',
    '// After — one import per entry point',
    "import { provideDmasterUI } from '@dmaster/ui/core';",
    "import { DmButtonComponent } from '@dmaster/ui/button';",
    "import { DmToggleComponent, DmToggleGroupComponent } from '@dmaster/ui/toggle-group';",
    "import { DialogRef, DmDialogService } from '@dmaster/ui/dialog';",
  ].join('\n');

  protected readonly darkModeCode = [
    "import { inject } from '@angular/core';",
    "import { ThemeService } from '@dmaster/ui/core';",
    '',
    '@Component({ /* ... */ })',
    'export class ThemeToggle {',
    '  protected readonly theme = inject(ThemeService);',
    '',
    '  toggle(): void { this.theme.toggle(); }',
    "  useSystem(): void { this.theme.setTheme('auto'); }",
    '}',
  ].join('\n');

  protected readonly customTokensCode = [
    '/* Re-skin without forking: override any semantic token */',
    ':root {',
    '  --dm-primary: #f31260;         /* pink accent */',
    '  --dm-radius-md: 0.5rem;        /* sharper corners */',
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '/* Use the semantic tokens in your own components */',
    '.my-badge {',
    '  background: var(--dm-primary-subtle);',
    '  color: var(--dm-primary);',
    '  border: 1px solid var(--dm-primary);',
    '}',
    '',
    '.my-alert {',
    '  background: var(--dm-danger-subtle);',
    '  color: var(--dm-danger);',
    '}',
  ].join('\n');

  protected readonly namedThemesCode = [
    '// 1. Register the theme + its base scheme',
    "provideDmasterUI({ themes: { midnight: { scheme: 'dark', label: 'Midnight' } } }),",
    '',
    '/* 2. Author its tokens (styles.scss) */',
    "[data-dm-theme='midnight'] {",
    '  --dm-bg: #0b1020;',
    '  --dm-primary: #7c9cff;',
    '  /* …only the tokens you want to change */',
    '}',
    '',
    '// 3. Apply it by name — light/dark still work',
    "inject(ThemeService).setTheme('midnight');",
  ].join('\n');

  protected readonly animationCode = [
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
  ].join('\n');

  protected readonly typescriptCode = [
    "import type { DmSize, DmTheme, DmDensity } from '@dmaster/ui/core';",
    "import type { DmButtonColor, DmButtonVariant } from '@dmaster/ui/button';",
  ].join('\n');
}
