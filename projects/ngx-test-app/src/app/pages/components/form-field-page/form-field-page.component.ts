import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmCardComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmIconComponent,
  DmInputDirective,
  DmSelectComponent,
  DmSelectItem,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-form-field-page',
  imports: [
    DmFormFieldComponent,
    DmInputDirective,
    DmErrorComponent,
    DmCardComponent,
    DmButtonComponent,
    DmIconComponent,
    DmSelectComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './form-field-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.formField);

  protected readonly playground = signal<PropValues>({
    label: 'Email',
    hint: '',
    error: '',
    required: false,
  });

  protected readonly controls: PropControl[] = [
    { key: 'label', label: 'label', type: 'text', placeholder: 'Email' },
    { key: 'hint', label: 'hint', type: 'text', placeholder: 'Help text' },
    { key: 'error', label: 'error', type: 'text', placeholder: 'Error text' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgLabel = computed(() => (this.playground()['label'] as string) || '');
  protected readonly pgHint = computed(() => (this.playground()['hint'] as string) || '');
  protected readonly pgError = computed(() => (this.playground()['error'] as string) || '');
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgLabel()) {
      attrs.push(`label="${this.pgLabel()}"`);
    }
    if (this.pgHint()) {
      attrs.push(`hint="${this.pgHint()}"`);
    }
    if (this.pgError()) {
      attrs.push(`[error]="'${this.pgError()}'"`);
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return [
      `<dm-form-field ${attrs.join(' ')}>`,
      '  <input dmInput type="email" />',
      '</dm-form-field>',
    ].join('\n');
  });

  // --- Basic ---------------------------------------------------------------

  protected readonly basicCode = [
    '<dm-form-field label="Email" hint="We never share your email." [required]="true">',
    '  <input dmInput type="email" placeholder="you@example.com" />',
    '</dm-form-field>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmFormFieldComponent, DmInputDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-basic-field',",
    '  imports: [DmFormFieldComponent, DmInputDirective],',
    "  templateUrl: './basic-field.component.html',",
    '})',
    'export class BasicFieldComponent {}',
  ].join('\n');

  // --- Input types ---------------------------------------------------------

  /**
   * A native `<select>` only themes its closed state via `dmInput` — the
   * open dropdown is rendered by the browser/OS and can't be styled. For a
   * fully themed dropdown, use the real `dm-select` component instead; it is
   * a self-contained field (own label, no `dmInput`/`dm-form-field` needed).
   */
  protected readonly countryOptions: DmSelectItem<string>[] = [
    { value: 'es', label: 'Spain' },
    { value: 'fr', label: 'France' },
    { value: 'de', label: 'Germany' },
  ];
  protected readonly countryValue = signal<string | null>('es');

  /** Show/hide toggle for the two password demos (input-types + signup). */
  protected readonly passwordVisible = signal(false);
  protected readonly signupPasswordVisible = signal(false);

  protected readonly typesCode = [
    '<!-- dmInput styles any native input or textarea. -->',
    '<dm-form-field label="Full name">',
    '  <input dmInput type="text" placeholder="Ada Lovelace" />',
    '</dm-form-field>',
    '',
    "<!-- Trailing show/hide toggle: dm-form-field's control is a positioning",
    '     context, so an absolutely-positioned button works as-is. -->',
    '<dm-form-field label="Password" hint="At least 8 characters.">',
    '  <input',
    '    dmInput',
    "    [type]=\"visible() ? 'text' : 'password'\"",
    '    autocomplete="new-password"',
    '    style="padding-right: 2.25rem"',
    '  />',
    '  <button',
    '    type="button"',
    "    [attr.aria-label]=\"visible() ? 'Hide password' : 'Show password'\"",
    '    (click)="visible.set(!visible())"',
    '  >',
    '    <dm-icon [name]="visible() ? \'eye-off\' : \'eye\'" size="1.1rem" />',
    '  </button>',
    '</dm-form-field>',
    '',
    '<dm-form-field label="Quantity">',
    '  <input dmInput type="number" min="1" max="99" value="2" />',
    '</dm-form-field>',
    '',
    '<!-- Not dmInput: dm-select is the themed answer for dropdowns. -->',
    '<dm-select label="Country" [items]="countryOptions" [(value)]="country" />',
    '',
    '<dm-form-field label="Message" hint="Markdown supported.">',
    '  <textarea dmInput rows="4"></textarea>',
    '</dm-form-field>',
  ].join('\n');

  protected readonly typesTs = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  DmFormFieldComponent, DmInputDirective,',
    '  DmIconComponent, DmSelectComponent, DmSelectItem,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-field-types',",
    '  imports: [',
    '    DmFormFieldComponent, DmInputDirective,',
    '    DmIconComponent, DmSelectComponent,',
    '  ],',
    "  templateUrl: './field-types.component.html',",
    '})',
    'export class FieldTypesComponent {',
    '  protected readonly visible = signal(false);',
    '',
    '  protected readonly countryOptions: DmSelectItem<string>[] = [',
    "    { value: 'es', label: 'Spain' },",
    "    { value: 'fr', label: 'France' },",
    "    { value: 'de', label: 'Germany' },",
    '  ];',
    "  protected readonly country = signal<string | null>('es');",
    '}',
  ].join('\n');

  // --- States (disabled / readonly) ---------------------------------------

  protected readonly statesCode = [
    '<!-- disabled: skipped by keyboard, excluded from form submission -->',
    '<dm-form-field label="Disabled">',
    '  <input dmInput type="text" value="dm_user" disabled />',
    '</dm-form-field>',
    '',
    '<!-- readonly: focusable and announced, but not editable -->',
    '<dm-form-field label="Read-only" hint="Assigned automatically.">',
    '  <input dmInput type="text" value="ACC-2041-XK" readonly />',
    '</dm-form-field>',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component } from '@angular/core';",
    "import { DmFormFieldComponent, DmInputDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-field-states',",
    '  imports: [DmFormFieldComponent, DmInputDirective],',
    "  templateUrl: './field-states.component.html',",
    '})',
    'export class FieldStatesComponent {}',
  ].join('\n');

  // --- Error as an input (live: the error appears on blur) -----------------

  protected readonly email = signal('');
  protected readonly emailTouched = signal(false);
  protected readonly emailError = computed(() =>
    this.emailTouched() && !EMAIL_PATTERN.test(this.email())
      ? this.page().labels['emailError']
      : '',
  );

  protected onEmailInput(event: Event): void {
    this.email.set((event.target as HTMLInputElement).value);
  }

  protected readonly errorCode = [
    '<!-- You own the display logic: pass a string, non-empty = error state -->',
    '<dm-form-field label="Email" [error]="emailError()">',
    '  <input dmInput type="email" (input)="…" (blur)="touched.set(true)" />',
    '</dm-form-field>',
  ].join('\n');

  protected readonly errorTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmFormFieldComponent, DmInputDirective } from '@dmaster/ui';",
    '',
    'const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
    '',
    '@Component({',
    "  selector: 'app-field-error',",
    '  imports: [DmFormFieldComponent, DmInputDirective],',
    "  templateUrl: './field-error.component.html',",
    '})',
    'export class FieldErrorComponent {',
    "  protected readonly email = signal('');",
    '  protected readonly touched = signal(false);',
    '',
    '  protected readonly emailError = computed(() =>',
    '    this.touched() && !EMAIL_PATTERN.test(this.email())',
    "      ? 'Enter a valid email address.'",
    "      : '',",
    '  );',
    '',
    '  protected onInput(event: Event): void {',
    '    this.email.set((event.target as HTMLInputElement).value);',
    '  }',
    '}',
  ].join('\n');

  // --- Reactive Forms + projected <dm-error> -------------------------------

  protected readonly emailControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
  });

  protected readonly slotErrorCode = [
    '<!-- One message per validation error. dm-form-field wires the input’s',
    '     aria-invalid + aria-describedby to whichever <dm-error> is shown. -->',
    '<dm-form-field label="Email">',
    '  <input dmInput type="email" [formControl]="email" />',
    '  @if (email.touched && email.hasError("required")) {',
    '    <dm-error>Email is required.</dm-error>',
    '  } @else if (email.touched && email.hasError("pattern")) {',
    '    <dm-error>Enter a valid email address.</dm-error>',
    '  }',
    '</dm-form-field>',
  ].join('\n');

  protected readonly slotErrorTs = [
    "import { FormControl, Validators } from '@angular/forms';",
    '',
    'const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
    '',
    "email = new FormControl('', {",
    '  nonNullable: true,',
    '  validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],',
    '});',
  ].join('\n');

  // --- Composition: signup card --------------------------------------------

  protected readonly signupForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 24rem">',
    '  <form [formGroup]="form" style="display: grid; gap: 1rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Create your account</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        Start your free trial. No credit card required.',
    '      </p>',
    '    </div>',
    '',
    '    <dm-form-field label="Full name" [required]="true">',
    '      <input dmInput type="text" formControlName="name" autocomplete="name" />',
    '      @if (form.controls.name.touched && form.controls.name.hasError("required")) {',
    '        <dm-error>Your name is required.</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-form-field label="Email" [required]="true">',
    '      <input dmInput type="email" formControlName="email" autocomplete="email" />',
    '      @if (form.controls.email.touched && form.controls.email.hasError("required")) {',
    '        <dm-error>Email is required.</dm-error>',
    '      } @else if (form.controls.email.touched && form.controls.email.hasError("pattern")) {',
    '        <dm-error>Enter a valid email address.</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-form-field label="Password" hint="At least 8 characters." [required]="true">',
    '      <input',
    '        dmInput',
    "        [type]=\"passwordVisible() ? 'text' : 'password'\"",
    '        formControlName="password"',
    '        autocomplete="new-password"',
    '        style="padding-right: 2.25rem"',
    '      />',
    '      <button',
    '        type="button"',
    "        [attr.aria-label]=\"passwordVisible() ? 'Hide password' : 'Show password'\"",
    '        (click)="passwordVisible.set(!passwordVisible())"',
    '      >',
    '        <dm-icon [name]="passwordVisible() ? \'eye-off\' : \'eye\'" size="1.1rem" />',
    '      </button>',
    '      @if (form.controls.password.touched && form.controls.password.hasError("required")) {',
    '        <dm-error>Password is required.</dm-error>',
    '      } @else if (form.controls.password.touched && form.controls.password.hasError("minlength")) {',
    '        <dm-error>Password must be at least 8 characters.</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-button color="primary" style="width: 100%" [disabled]="form.invalid">',
    '      Create account',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmButtonComponent, DmCardComponent, DmErrorComponent,',
    '  DmFormFieldComponent, DmIconComponent, DmInputDirective,',
    "} from '@dmaster/ui';",
    '',
    'const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
    '',
    '@Component({',
    "  selector: 'app-signup-card',",
    '  imports: [',
    '    ReactiveFormsModule, DmCardComponent, DmFormFieldComponent,',
    '    DmInputDirective, DmIconComponent, DmErrorComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './signup-card.component.html',",
    '})',
    'export class SignupCardComponent {',
    '  protected readonly passwordVisible = signal(false);',
    '',
    '  protected readonly form = new FormGroup({',
    "    name: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required],',
    '    }),',
    "    email: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],',
    '    }),',
    "    password: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.minLength(8)],',
    '    }),',
    '  });',
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'hint', type: 'string', default: "''", description: api['hint'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'dmInput', type: 'Directive', description: api['dmInput'] },
    ];
  });
}
