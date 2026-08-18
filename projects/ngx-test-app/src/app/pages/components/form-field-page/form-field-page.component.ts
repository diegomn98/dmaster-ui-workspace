import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DmErrorComponent, DmFormFieldComponent, DmInputDirective } from '@dmaster/ui';

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

  // Demo de validación en vivo: el error aparece al salir del campo.
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

  protected readonly basicCode = [
    '<dm-form-field label="Email" hint="We never share your email." [required]="true">',
    '  <input dmInput type="email" placeholder="you@example.com" />',
    '</dm-form-field>',
  ].join('\n');

  protected readonly errorCode = [
    '<dm-form-field label="Email" [error]="emailError()">',
    '  <input dmInput type="email" (input)="…" (blur)="touched.set(true)" />',
    '</dm-form-field>',
  ].join('\n');

  // Projected <dm-error> slot (mat-error-style) with Reactive Forms.
  protected readonly emailControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected readonly slotErrorCode = [
    'email = new FormControl("", [Validators.required, Validators.email]);',
    '',
    '<dm-form-field label="Email">',
    '  <input dmInput type="email" [formControl]="email" />',
    '  @if (email.touched && email.hasError("required")) {',
    '    <dm-error>Email is required</dm-error>',
    '  } @else if (email.touched && email.hasError("email")) {',
    '    <dm-error>Enter a valid email address</dm-error>',
    '  }',
    '</dm-form-field>',
  ].join('\n');

  protected readonly textareaCode = [
    '<dm-form-field label="Message" hint="Markdown supported">',
    '  <textarea dmInput rows="4"></textarea>',
    '</dm-form-field>',
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
