import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmCardComponent,
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
    DmCardComponent,
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

  // ---- Basic ---------------------------------------------------------------
  protected readonly basicCode = '<dm-error>This field is required</dm-error>';

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmErrorComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-error-basic',",
    '  imports: [DmErrorComponent],',
    "  templateUrl: './error-basic.component.html',",
    '})',
    'export class ErrorBasicComponent {}',
  ].join('\n');

  // ---- With an icon --------------------------------------------------------
  protected readonly withIconCode = [
    '<!-- No built-in icon: project any icon and the flex host aligns it. -->',
    '<dm-error>',
    '  <dm-icon name="warning" size="sm" />',
    '  This field is required',
    '</dm-error>',
  ].join('\n');

  protected readonly withIconTs = [
    "import { Component } from '@angular/core';",
    "import { DmErrorComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-error-with-icon',",
    '  imports: [DmErrorComponent, DmIconComponent],',
    "  templateUrl: './error-with-icon.component.html',",
    '})',
    'export class ErrorWithIconComponent {}',
  ].join('\n');

  // ---- Sizes ---------------------------------------------------------------
  protected readonly sizesCode = [
    '<dm-error size="sm">Small message</dm-error>',
    '<dm-error size="md">Medium message</dm-error>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmErrorComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-error-sizes',",
    '  imports: [DmErrorComponent],',
    "  templateUrl: './error-sizes.component.html',",
    '})',
    'export class ErrorSizesComponent {}',
  ].join('\n');

  // ---- Inside a form field (live) ------------------------------------------
  protected readonly formFieldCode = [
    '<form (submit)="onSubmit($event)">',
    '  <dm-form-field label="Email">',
    '    <input dmInput type="email" [formControl]="email" placeholder="you@example.com" />',
    "    @if (email.touched && email.hasError('required')) {",
    '      <dm-error>Email is required</dm-error>',
    "    } @else if (email.touched && email.hasError('email')) {",
    '      <dm-error>Enter a valid email address</dm-error>',
    '    }',
    '  </dm-form-field>',
    '  <dm-button type="submit" size="sm">Submit</dm-button>',
    '</form>',
  ].join('\n');

  protected readonly formFieldTs = [
    "import { FormControl, Validators } from '@angular/forms';",
    '',
    "email = new FormControl('', {",
    '  nonNullable: true,',
    '  validators: [Validators.required, Validators.email],',
    '});',
    '',
    'onSubmit(event: Event): void {',
    '  event.preventDefault();',
    '  this.email.markAsTouched(); // reveals the error on an empty submit',
    '}',
  ].join('\n');

  protected readonly email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  protected onSubmit(event: Event): void {
    // Only `[formControl]` is bound here (no `[formGroup]` on the <form>), so
    // no Angular forms directive claims the native `submit` event for us —
    // prevent the default navigation/reload ourselves.
    event.preventDefault();
    this.email.markAsTouched();
  }

  // ---- Per-error messages (live) -------------------------------------------
  protected readonly perErrorCode = [
    '<!-- One <dm-error> per validator: the @if / @else chain decides -->',
    '<!-- which single message is visible, in priority order. -->',
    '<dm-form-field label="Username" hint="4+ characters — lowercase, digits, - or _">',
    '  <input dmInput [formControl]="username" placeholder="e.g. ada-lovelace" />',
    "  @if (username.touched && username.hasError('required')) {",
    '    <dm-error>A username is required</dm-error>',
    "  } @else if (username.touched && username.hasError('minlength')) {",
    '    <dm-error>Use at least 4 characters</dm-error>',
    "  } @else if (username.touched && username.hasError('pattern')) {",
    '    <dm-error>Only lowercase letters, digits, - and _</dm-error>',
    '  }',
    '</dm-form-field>',
  ].join('\n');

  protected readonly perErrorTs = [
    "import { FormControl, Validators } from '@angular/forms';",
    '',
    "username = new FormControl('', {",
    '  nonNullable: true,',
    '  validators: [',
    '    Validators.required,',
    '    Validators.minLength(4),',
    '    Validators.pattern(/^[a-z0-9_-]+$/),',
    '  ],',
    '});',
  ].join('\n');

  protected readonly username = new FormControl<string>('J@', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4), Validators.pattern(/^[a-z0-9_-]+$/)],
  });

  // ---- Composition: checkout form with errors ------------------------------
  protected readonly compositionCode = [
    '<!-- A checkout card in a real "form with errors" state: each invalid -->',
    '<!-- field explains itself and the submit stays disabled until valid. -->',
    '<dm-card style="width: 100%; max-width: 24rem">',
    '  <form [formGroup]="checkout" (ngSubmit)="pay()"',
    '        style="display: grid; gap: 1rem">',
    '    <h3 style="margin: 0">Payment details</h3>',
    '',
    '    <dm-form-field label="Cardholder name" [required]="true">',
    '      <input dmInput formControlName="holder" placeholder="Ada Lovelace" />',
    "      @if (co.holder.touched && co.holder.hasError('required')) {",
    '        <dm-error><dm-icon name="warning" size="sm" />Cardholder name is required</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-form-field label="Card number" [required]="true">',
    '      <input dmInput formControlName="number" placeholder="4242 4242 4242 4242"',
    '             inputmode="numeric" />',
    "      @if (co.number.touched && co.number.hasError('required')) {",
    '        <dm-error>A card number is required</dm-error>',
    "      } @else if (co.number.touched && co.number.hasError('pattern')) {",
    '        <dm-error>Enter 16 digits as 4 groups of 4</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-form-field label="CVC" [required]="true" style="max-width: 8rem">',
    '      <input dmInput formControlName="cvc" placeholder="123" inputmode="numeric" />',
    "      @if (co.cvc.touched && co.cvc.hasError('required')) {",
    '        <dm-error>Required</dm-error>',
    "      } @else if (co.cvc.touched && co.cvc.hasError('pattern')) {",
    '        <dm-error>3–4 digits</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-button type="submit" [disabled]="checkout.invalid">Pay now</dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmButtonComponent, DmCardComponent, DmErrorComponent,',
    '  DmFormFieldComponent, DmIconComponent, DmInputDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-checkout',",
    '  imports: [',
    '    ReactiveFormsModule, DmCardComponent, DmFormFieldComponent,',
    '    DmInputDirective, DmErrorComponent, DmIconComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './checkout.component.html',",
    '})',
    'export class CheckoutComponent {',
    '  protected readonly checkout = new FormGroup({',
    "    holder: new FormControl('', { nonNullable: true, validators: [Validators.required] }),",
    "    number: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.pattern(/^(?:\\d{4} ){3}\\d{4}$/)],',
    '    }),',
    "    cvc: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.pattern(/^\\d{3,4}$/)],',
    '    }),',
    '  });',
    '',
    '  // Convenience alias for the template.',
    '  protected readonly co = this.checkout.controls;',
    '',
    '  protected pay(): void {',
    '    this.checkout.markAllAsTouched(); // reveal every remaining error',
    '    if (this.checkout.valid) {',
    '      // charge the card…',
    '    }',
    '  }',
    '}',
  ].join('\n');

  protected readonly checkout = new FormGroup({
    holder: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    number: new FormControl<string>('4242 4242 42', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^(?:\d{4} ){3}\d{4}$/)],
    }),
    cvc: new FormControl<string>('12', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\d{3,4}$/)],
    }),
  });

  /** Convenience alias for the template. */
  protected readonly co = this.checkout.controls;

  constructor() {
    // Seed the composition preview in a realistic "submitted with errors"
    // state so every message is visible without any interaction.
    this.checkout.markAllAsTouched();
    this.username.markAsTouched();
  }

  protected pay(): void {
    this.checkout.markAllAsTouched();
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
