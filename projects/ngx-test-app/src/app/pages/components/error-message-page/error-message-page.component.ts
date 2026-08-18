import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmIconComponent,
  DmInputDirective,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-error-message-page',
  imports: [
    DmErrorComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmIconComponent,
    DmButtonComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './error-message-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessagePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.errorMessage);

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({ size: 'sm' });
  protected readonly controls: PropControl[] = [
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((v) => ({ label: v, value: v })),
    },
  ];
  protected readonly pgSize = computed(() => this.playground()['size'] as 'sm' | 'md');
  protected readonly playgroundCode = computed(() => {
    const attrs = this.pgSize() !== 'sm' ? ` size="${this.pgSize()}"` : '';
    return `<dm-error${attrs}>This field is required</dm-error>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicCode = '<dm-error>This field is required</dm-error>';
  protected readonly withIconCode = [
    '<dm-error>',
    '  <dm-icon name="warning" size="sm" />',
    '  This field is required',
    '</dm-error>',
  ].join('\n');
  protected readonly sizesCode = [
    '<dm-error size="sm">Small message</dm-error>',
    '<dm-error size="md">Medium message</dm-error>',
  ].join('\n');

  protected readonly formFieldCode = [
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

  // Live reactive-forms demo
  protected readonly email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected submitAttempted = signal(false);
  protected onSubmit(event: Event): void {
    // Only `[formControl]` is bound here (no `[formGroup]` on the <form>), so
    // no Angular forms directive claims the native `submit` event for us —
    // prevent the default navigation/reload ourselves.
    event.preventDefault();
    this.submitAttempted.set(true);
    this.email.markAsTouched();
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: api['size'] },
      { name: '(content)', type: 'projected', default: '—', description: api['content'] },
    ];
  });
}
