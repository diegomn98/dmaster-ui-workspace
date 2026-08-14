import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmButtonComponent } from '@dmaster/ui';

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
    "import { provideDmasterUI } from '@dmaster/ui';",
    '',
    'export const appConfig: ApplicationConfig = {',
    '  providers: [',
    "    provideDmasterUI({ theme: 'auto', density: 'comfortable' }),",
    '  ],',
    '};',
  ].join('\n');

  protected readonly firstComponentCode = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent } from '@dmaster/ui';",
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

  protected readonly darkModeCode = [
    "import { inject } from '@angular/core';",
    "import { ThemeService } from '@dmaster/ui';",
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
    'import type {',
    '  DmSize,',
    '  DmTheme,',
    '  DmDensity,',
    '  DmButtonColor,',
    '  DmButtonVariant,',
    "} from '@dmaster/ui';",
  ].join('\n');
}
