import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmCardComponent,
  DmDividerComponent,
  DmErrorComponent,
  DmSwitchComponent,
  DmSwitchSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface NotificationRow {
  title: string;
  description: string;
  enabled: WritableSignal<boolean>;
}

@Component({
  selector: 'app-switch-page',
  imports: [
    DmSwitchComponent,
    DmButtonComponent,
    DmCardComponent,
    DmDividerComponent,
    DmErrorComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './switch-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.switch);

  protected readonly playground = signal<PropValues>({
    checked: false,
    disabled: false,
    size: 'md',
  });

  protected readonly controls: PropControl[] = [
    { key: 'checked', label: 'checked', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgChecked = computed(() => this.playground()['checked'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSwitchSize);

  protected patchChecked(checked: boolean): void {
    this.playground.update((values) => ({ ...values, checked }));
  }

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['[(checked)]="enabled"'];
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    return `<dm-switch ${attrs.join(' ')}>${this.page().labels['notifications']}</dm-switch>`;
  });

  // ---- With label ----------------------------------------------------------
  protected readonly withLabelCode = [
    '<!-- The projected content becomes the accessible label. -->',
    '<dm-switch [(checked)]="notifications">Email notifications</dm-switch>',
    '',
    '<!-- No visible label? Pass ariaLabel instead. -->',
    '<dm-switch [(checked)]="darkMode" ariaLabel="Dark mode" />',
  ].join('\n');

  protected readonly withLabelTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-switch-labels',",
    '  imports: [DmSwitchComponent],',
    "  templateUrl: './switch-labels.component.html',",
    '})',
    'export class SwitchLabelsComponent {',
    '  protected readonly notifications = signal(true);',
    '  protected readonly darkMode = signal(false);',
    '}',
  ].join('\n');

  // ---- Sizes ---------------------------------------------------------------
  protected readonly sizesCode = [
    '<dm-switch size="sm" [checked]="true">Small</dm-switch>',
    '<dm-switch size="md" [checked]="true">Medium</dm-switch>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-switch-sizes',",
    '  imports: [DmSwitchComponent],',
    "  templateUrl: './switch-sizes.component.html',",
    '})',
    'export class SwitchSizesComponent {}',
  ].join('\n');

  // ---- Colors (token override) --------------------------------------------
  protected readonly colorsCode = [
    '<!-- The checked track paints with --dm-primary. Re-color a single -->',
    '<!-- switch (or a whole section) by overriding the token locally. -->',
    '<dm-switch [checked]="true" ariaLabel="Primary" />',
    '<dm-switch',
    '  [checked]="true"',
    '  ariaLabel="Success"',
    '  style="--dm-primary: var(--dm-success); --dm-primary-hover: var(--dm-success-hover)"',
    '/>',
    '<dm-switch',
    '  [checked]="true"',
    '  ariaLabel="Warning"',
    '  style="--dm-primary: var(--dm-warning); --dm-primary-hover: var(--dm-warning-hover)"',
    '/>',
    '<dm-switch',
    '  [checked]="true"',
    '  ariaLabel="Danger"',
    '  style="--dm-primary: var(--dm-danger); --dm-primary-hover: var(--dm-danger-hover)"',
    '/>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-switch-colors',",
    '  imports: [DmSwitchComponent],',
    "  templateUrl: './switch-colors.component.html',",
    '})',
    'export class SwitchColorsComponent {}',
  ].join('\n');

  // ---- States --------------------------------------------------------------
  protected readonly statesCode = [
    '<dm-switch [checked]="true">Interactive</dm-switch>',
    '<dm-switch [disabled]="true">Disabled off</dm-switch>',
    '<dm-switch [disabled]="true" [checked]="true">Disabled on</dm-switch>',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component } from '@angular/core';",
    "import { DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-switch-states',",
    '  imports: [DmSwitchComponent],',
    "  templateUrl: './switch-states.component.html',",
    '})',
    'export class SwitchStatesComponent {}',
  ].join('\n');

  // ---- Reactive forms ------------------------------------------------------
  protected readonly formControl = new FormControl(true, { nonNullable: true });
  protected readonly formValue = signal(true);

  protected readonly formsCode = [
    '<dm-switch [formControl]="control">Email notifications</dm-switch>',
    '<span>Value: {{ value() }}</span>',
    '',
    '<!-- writeValue flows back into the switch -->',
    '<dm-button size="sm" variant="bordered"',
    '           (clicked)="control.setValue(!control.value)">',
    '  Toggle from code',
    '</dm-button>',
  ].join('\n');

  protected readonly formsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    "import { DmButtonComponent, DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-switch-forms',",
    '  imports: [DmSwitchComponent, DmButtonComponent, ReactiveFormsModule],',
    "  templateUrl: './switch-forms.component.html',",
    '})',
    'export class SwitchFormsComponent {',
    '  protected readonly control = new FormControl(true, { nonNullable: true });',
    '  protected readonly value = signal(true);',
    '',
    '  constructor() {',
    '    this.control.valueChanges.subscribe((value) => this.value.set(value));',
    '  }',
    '}',
  ].join('\n');

  // ---- Validation (requiredTrue + dm-error) --------------------------------
  protected readonly consentControl = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
  protected readonly consentError = signal(false);
  protected readonly consentDone = signal(false);

  protected submitConsent(): void {
    this.consentControl.markAsTouched();
    this.consentError.set(this.consentControl.invalid);
    this.consentDone.set(this.consentControl.valid);
  }

  protected readonly validationCode = [
    '<dm-switch [formControl]="consent">I accept the Terms of Service</dm-switch>',
    '',
    '@if (showError()) {',
    '  <dm-error>You must accept the terms to continue</dm-error>',
    '}',
    '',
    '<dm-button size="sm" (clicked)="submit()">Continue</dm-button>',
  ].join('\n');

  protected readonly validationTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmButtonComponent, DmErrorComponent, DmSwitchComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-consent',",
    '  imports: [DmSwitchComponent, DmErrorComponent, DmButtonComponent, ReactiveFormsModule],',
    "  templateUrl: './consent.component.html',",
    '})',
    'export class ConsentComponent {',
    '  protected readonly consent = new FormControl(false, {',
    '    nonNullable: true,',
    '    validators: [Validators.requiredTrue],',
    '  });',
    '  protected readonly showError = signal(false);',
    '',
    '  protected submit(): void {',
    '    this.consent.markAsTouched();',
    '    this.showError.set(this.consent.invalid);',
    '    if (this.consent.valid) {',
    '      // proceed…',
    '    }',
    '  }',
    '}',
  ].join('\n');

  // ---- Composition: notification settings card -----------------------------
  protected readonly notificationRows: NotificationRow[] = [
    {
      title: 'Email notifications',
      description: 'Product updates and billing receipts, straight to your inbox.',
      enabled: signal(true),
    },
    {
      title: 'Push notifications',
      description: 'Mentions and replies, the moment they happen.',
      enabled: signal(false),
    },
    {
      title: 'Weekly digest',
      description: 'A summary of your workspace activity, every Monday.',
      enabled: signal(true),
    },
  ];

  protected readonly enabledCount = computed(
    () => this.notificationRows.filter((row) => row.enabled()).length,
  );

  protected readonly compositionCode = [
    '<!-- A product settings card: title + muted description on the left, -->',
    '<!-- the switch on the right, rows separated by dm-divider. -->',
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <div style="display: grid; gap: 0.875rem">',
    '    <div>',
    '      <p style="margin: 0; font-weight: 600">Notifications</p>',
    '      <p style="margin: 0.125rem 0 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">',
    '        {{ enabledCount() }} of {{ rows.length }} enabled',
    '      </p>',
    '    </div>',
    '    <dm-divider />',
    '    @for (row of rows; track row.title) {',
    '      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem">',
    '        <div style="min-width: 0">',
    '          <p style="margin: 0; font-size: 0.875rem; font-weight: 600">{{ row.title }}</p>',
    '          <p style="margin: 0.125rem 0 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">',
    '            {{ row.description }}',
    '          </p>',
    '        </div>',
    '        <dm-switch [(checked)]="row.enabled" [ariaLabel]="row.title" />',
    '      </div>',
    '      @if (!$last) {',
    '        <dm-divider />',
    '      }',
    '    }',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal, WritableSignal } from '@angular/core';",
    "import { DmCardComponent, DmDividerComponent, DmSwitchComponent } from '@dmaster/ui';",
    '',
    'interface NotificationRow {',
    '  title: string;',
    '  description: string;',
    '  enabled: WritableSignal<boolean>;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-notification-settings',",
    '  imports: [DmCardComponent, DmDividerComponent, DmSwitchComponent],',
    "  templateUrl: './notification-settings.component.html',",
    '})',
    'export class NotificationSettingsComponent {',
    '  protected readonly rows: NotificationRow[] = [',
    '    {',
    "      title: 'Email notifications',",
    "      description: 'Product updates and billing receipts, straight to your inbox.',",
    '      enabled: signal(true),',
    '    },',
    '    {',
    "      title: 'Push notifications',",
    "      description: 'Mentions and replies, the moment they happen.',",
    '      enabled: signal(false),',
    '    },',
    '    {',
    "      title: 'Weekly digest',",
    "      description: 'A summary of your workspace activity, every Monday.',",
    '      enabled: signal(true),',
    '    },',
    '  ];',
    '',
    '  protected readonly enabledCount = computed(',
    '    () => this.rows.filter((row) => row.enabled()).length,',
    '  );',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSwitchDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSwitchDefaults({ size: 'sm' })]",
  ].join('\n');

  constructor() {
    this.formControl.valueChanges.subscribe((value) => this.formValue.set(value));
    this.consentControl.valueChanges.subscribe(() => {
      this.consentError.set(this.consentControl.touched && this.consentControl.invalid);
      this.consentDone.set(false);
    });
  }

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'checked', type: 'model<boolean>', default: 'false', description: api['checked'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
      { name: 'inputId', type: 'string', default: "''", description: api['inputId'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
