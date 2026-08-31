import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmErrorComponent,
  DmOtpColor,
  DmOtpComponent,
  DmOtpMode,
  DmOtpSize,
  DmOtpVariant,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-otp-page',
  imports: [
    DmOtpComponent,
    DmButtonComponent,
    DmCardComponent,
    DmErrorComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './otp-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OtpPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.otp);

  // Playground
  protected readonly playground = signal<PropValues>({
    length: 6,
    mode: 'numeric',
    variant: 'flat',
    groupSize: 0,
    mask: false,
    size: 'md',
    color: 'default',
    disabled: false,
  });

  protected readonly controls: PropControl[] = [
    { key: 'length', label: 'length', type: 'number', min: 3, max: 8, step: 1 },
    {
      key: 'mode',
      label: 'mode',
      type: 'select',
      options: [
        { label: 'numeric', value: 'numeric' },
        { label: 'alphanumeric', value: 'alphanumeric' },
        { label: 'text', value: 'text' },
      ],
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'flat', value: 'flat' },
        { label: 'bordered', value: 'bordered' },
        { label: 'faded', value: 'faded' },
        { label: 'underlined', value: 'underlined' },
      ],
    },
    { key: 'groupSize', label: 'groupSize', type: 'number', min: 0, max: 4, step: 1 },
    { key: 'mask', label: 'mask', type: 'boolean' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' },
      ],
    },
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: [
        { label: 'default', value: 'default' },
        { label: 'primary', value: 'primary' },
        { label: 'success', value: 'success' },
        { label: 'danger', value: 'danger' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgLength = computed(() => Number(this.playground()['length']) || 6);
  protected readonly pgMode = computed(() => this.playground()['mode'] as DmOtpMode);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmOtpVariant);
  protected readonly pgGroupSize = computed(() => Number(this.playground()['groupSize']) || 0);
  protected readonly pgMask = computed(() => this.playground()['mask'] === true);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmOtpSize);
  protected readonly pgColor = computed(() => this.playground()['color'] as DmOtpColor);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgValue = signal<string>('');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgLength() !== 6) attrs.push(`[length]="${this.pgLength()}"`);
    if (this.pgMode() !== 'numeric') attrs.push(`mode="${this.pgMode()}"`);
    if (this.pgVariant() !== 'flat') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgGroupSize() > 0) attrs.push(`[groupSize]="${this.pgGroupSize()}"`);
    if (this.pgMask()) attrs.push('mask');
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgColor() !== 'default') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgDisabled()) attrs.push('disabled');
    attrs.push('[(value)]="code"');
    attrs.push('ariaLabel="Verification code"');
    return `<dm-otp ${attrs.join(' ')} />`;
  });

  // Demo signals
  protected readonly numericValue = signal<string>('');
  protected readonly alnumValue = signal<string>('');
  protected readonly maskedValue = signal<string>('');
  protected readonly fourValue = signal<string>('');
  protected readonly smValue = signal<string>('');
  protected readonly mdValue = signal<string>('');
  protected readonly lgValue = signal<string>('');
  protected readonly borderedValue = signal<string>('');
  protected readonly fadedValue = signal<string>('');
  protected readonly underlinedValue = signal<string>('');
  protected readonly sepValue = signal<string>('');
  protected readonly completeMsg = signal<string>('');

  protected onCompleted(code: string): void {
    this.completeMsg.set(`${this.page().labels['completeMsg']}: ${code}`);
  }

  // Demo code
  protected readonly numericCode = [
    '<dm-otp [(value)]="code" [length]="6" ariaLabel="Verification code"',
    '        (completed)="verify($event)" />',
    '<span>value: {{ code() }}</span>',
  ].join('\n');

  protected readonly numericTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-numeric-otp',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './numeric-otp.component.html',",
    '})',
    'export class NumericOtpComponent {',
    "  protected readonly code = signal<string>('');",
    '',
    '  protected verify(code: string): void {',
    '    // fired once every cell is filled',
    '    console.log(code);',
    '  }',
    '}',
  ].join('\n');

  protected readonly alnumCode = [
    '<dm-otp [(value)]="code" mode="alphanumeric" [length]="5" ariaLabel="Coupon code" />',
  ].join('\n');

  protected readonly alnumTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-coupon-otp',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './coupon-otp.component.html',",
    '})',
    'export class CouponOtpComponent {',
    "  protected readonly code = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly maskedCode = [
    '<!-- mask renders each filled cell as a password dot -->',
    '<dm-otp [(value)]="pin" mask [length]="4" ariaLabel="PIN" />',
  ].join('\n');

  protected readonly maskedTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pin-otp',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './pin-otp.component.html',",
    '})',
    'export class PinOtpComponent {',
    "  protected readonly pin = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly fourCode = [
    '<dm-otp [(value)]="code" [length]="4" size="lg" ariaLabel="One-time code" />',
  ].join('\n');

  protected readonly fourTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-otp-four',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './otp-four.component.html',",
    '})',
    'export class OtpFourComponent {',
    "  protected readonly code = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly variantsCode = [
    '<!-- bordered = elevated ("white") surface + border, like a classic input -->',
    '<dm-otp variant="bordered" [(value)]="a" ariaLabel="Bordered" />',
    '<dm-otp variant="faded" [(value)]="b" ariaLabel="Faded" />',
    '<dm-otp variant="underlined" [(value)]="c" ariaLabel="Underlined" />',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-otp-variants',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './otp-variants.component.html',",
    '})',
    'export class OtpVariantsComponent {',
    "  protected readonly a = signal<string>('');",
    "  protected readonly b = signal<string>('');",
    "  protected readonly c = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly separatedCode = [
    '<!-- groupSize inserts a dash after every N cells: 123 – 456 -->',
    '<dm-otp [(value)]="code" [length]="6" [groupSize]="3" variant="bordered"',
    '        ariaLabel="Verification code" />',
  ].join('\n');

  protected readonly separatedTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-otp-separated',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './otp-separated.component.html',",
    '})',
    'export class OtpSeparatedComponent {',
    "  protected readonly code = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-otp size="sm" [length]="4" [(value)]="a" ariaLabel="Small" />',
    '<dm-otp size="md" [length]="4" [(value)]="b" ariaLabel="Medium" />',
    '<dm-otp size="lg" [length]="4" [(value)]="c" ariaLabel="Large" />',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-otp-sizes',",
    '  imports: [DmOtpComponent],',
    "  templateUrl: './otp-sizes.component.html',",
    '})',
    'export class OtpSizesComponent {',
    "  protected readonly a = signal<string>('');",
    "  protected readonly b = signal<string>('');",
    "  protected readonly c = signal<string>('');",
    '}',
  ].join('\n');

  // Composition — email verification card, OTP as a Reactive FormControl
  // validated with a length requirement; the button reflects idle/loading/…
  protected readonly codeControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  });

  protected readonly verifyState = signal<DmButtonState>('idle');

  protected submitVerify(): void {
    if (this.verifyState() !== 'idle') {
      return;
    }
    this.codeControl.markAsTouched();
    if (this.codeControl.invalid) {
      return;
    }
    this.verifyState.set('loading');
    setTimeout(() => {
      this.verifyState.set('success');
      setTimeout(() => {
        this.verifyState.set('idle');
        this.codeControl.reset('');
      }, 1600);
    }, 1200);
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 24rem">',
    '  <form [formGroup]="form" (ngSubmit)="verify()" novalidate style="display: grid; gap: 1rem">',
    '    <div>',
    '      <strong style="display: block">Verify your email</strong>',
    '      <span style="color: var(--dm-fg-muted); font-size: 0.875rem">',
    '        Enter the 6-digit code we sent you.',
    '      </span>',
    '    </div>',
    '',
    '    <dm-otp formControlName="code" [length]="6" [groupSize]="3" variant="bordered"',
    '            ariaLabel="Verification code" (completed)="verify()" />',
    '    @if (form.controls.code.touched && form.controls.code.invalid) {',
    '      <dm-error>That code is not valid.</dm-error>',
    '    }',
    '',
    '    <dm-button type="submit" color="primary" style="width: 100%"',
    '               [state]="state()" loadingLabel="Verifying…" successLabel="Verified">',
    '      Verify',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmButtonComponent, DmButtonState, DmCardComponent, DmErrorComponent, DmOtpComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-verify-card',",
    '  imports: [ReactiveFormsModule, DmCardComponent, DmOtpComponent, DmErrorComponent, DmButtonComponent],',
    "  templateUrl: './verify-card.component.html',",
    '})',
    'export class VerifyCardComponent {',
    '  protected readonly form = new FormGroup({',
    '    code: new FormControl("", {',
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.minLength(6)],',
    '    }),',
    '  });',
    "  protected readonly state = signal<DmButtonState>('idle');",
    '',
    '  protected verify(): void {',
    '    this.form.markAllAsTouched();',
    '    if (this.form.invalid) return;',
    "    this.state.set('loading');",
    '    this.api.verify(this.form.getRawValue().code).subscribe({',
    "      next: () => this.state.set('success'),",
    "      error: () => this.state.set('error'),",
    '    });',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideOtpDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideOtpDefaults({ length: 4, mode: 'numeric' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'length', type: 'number', default: '6', description: api['length'] },
      { name: 'value', type: 'string', default: "''", description: api['value'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      {
        name: 'mode',
        type: "'numeric' | 'alphanumeric' | 'text'",
        default: "'numeric'",
        description: api['mode'],
      },
      {
        name: 'variant',
        type: "'flat' | 'bordered' | 'faded' | 'underlined'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'groupSize', type: 'number', default: '0', description: api['groupSize'] },
      { name: 'mask', type: 'boolean', default: 'false', description: api['mask'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'readonly', type: 'boolean', default: 'false', description: api['readonly'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'autoFocus', type: 'boolean', default: 'false', description: api['autoFocus'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'completed',
        type: 'OutputEmitterRef<string>',
        default: '—',
        description: api['completed'],
      },
    ];
  });
}
