import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmSelectComponent,
  DmSelectItem,
  DmStepComponent,
  DmStepperColor,
  DmStepperComponent,
  DmStepperOrientation,
  DmStepperSize,
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
  selector: 'app-stepper-page',
  imports: [
    DmStepperComponent,
    DmStepComponent,
    DmButtonComponent,
    DmCardComponent,
    DmBadgeComponent,
    DmCheckboxComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmErrorComponent,
    DmSelectComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './stepper-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.stepper);

  // ---- Playground ---------------------------------------------------------

  protected readonly playground = signal<PropValues>({
    orientation: 'horizontal',
    color: 'primary',
    size: 'md',
    linear: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
      ],
    },
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: [
        { label: 'default', value: 'default' },
        { label: 'primary', value: 'primary' },
        { label: 'secondary', value: 'secondary' },
        { label: 'success', value: 'success' },
        { label: 'warning', value: 'warning' },
        { label: 'danger', value: 'danger' },
      ],
    },
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
    { key: 'linear', label: 'linear', type: 'boolean' },
  ];

  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmStepperOrientation,
  );
  protected readonly pgColor = computed(() => this.playground()['color'] as DmStepperColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmStepperSize);
  protected readonly pgLinear = computed(() => this.playground()['linear'] === true);
  /** Step 1 is completed, step 2 active — so `linear` visibly locks step 3. */
  protected readonly pgActive = signal(1);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgOrientation() !== 'horizontal') {
      attrs.push(`orientation="${this.pgOrientation()}"`);
    }
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgLinear()) attrs.push('linear');
    attrs.push('[(activeStep)]="step"');
    return [
      `<dm-stepper ${attrs.join(' ')}>`,
      '  <dm-step label="Account" completed>Account panel…</dm-step>',
      '  <dm-step label="Shipping">Shipping panel…</dm-step>',
      '  <dm-step label="Payment">Payment panel…</dm-step>',
      '</dm-stepper>',
    ].join('\n');
  });

  // ---- Basic --------------------------------------------------------------

  protected readonly basicActive = signal(0);

  protected readonly basicCode = [
    '<dm-stepper [(activeStep)]="step">',
    '  <dm-step label="Account">Create your account or sign in to continue.</dm-step>',
    '  <dm-step label="Shipping">Where should we send your order?</dm-step>',
    '  <dm-step label="Payment">Choose how you want to pay.</dm-step>',
    '</dm-stepper>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmStepperComponent, DmStepComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-checkout-steps',",
    '  imports: [DmStepperComponent, DmStepComponent],',
    "  templateUrl: './checkout-steps.component.html',",
    '})',
    'export class CheckoutStepsComponent {',
    '  protected readonly step = signal(0);',
    '}',
  ].join('\n');

  // ---- Vertical -----------------------------------------------------------

  protected readonly verticalActive = signal(1);

  protected readonly verticalCode = [
    '<dm-stepper orientation="vertical" color="success" [(activeStep)]="step">',
    '  <dm-step label="Order placed" completed>',
    '    We received your order and sent a confirmation email.',
    '  </dm-step>',
    '  <dm-step label="Out for delivery">',
    '    The courier picked up your parcel this morning.',
    '  </dm-step>',
    '  <dm-step label="Delivered">Left with the concierge. Enjoy!</dm-step>',
    '</dm-stepper>',
  ].join('\n');

  protected readonly verticalTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmStepperComponent, DmStepComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-delivery-status',",
    '  imports: [DmStepperComponent, DmStepComponent],',
    "  templateUrl: './delivery-status.component.html',",
    '})',
    'export class DeliveryStatusComponent {',
    '  protected readonly step = signal(1);',
    '}',
  ].join('\n');

  // ---- Linear (gated) with Next / Back --------------------------------------

  protected readonly linearActive = signal(0);
  protected readonly profileDone = signal(false);
  protected readonly prefsDone = signal(false);

  /** Next is enabled only while the active step is marked complete. */
  protected readonly canAdvance = computed(() => {
    switch (this.linearActive()) {
      case 0:
        return this.profileDone();
      case 1:
        return this.prefsDone();
      default:
        return false;
    }
  });

  protected readonly linearCode = [
    '<!-- linear: a step further ahead is selectable only once every step',
    '     before it is completed. Going back is always allowed. -->',
    '<dm-stepper #wizard [(activeStep)]="step" linear ariaLabel="Onboarding steps">',
    '  <dm-step label="Profile" [completed]="profileDone()">',
    '    <p>Tell us a bit about yourself…</p>',
    '    <dm-checkbox [(checked)]="profileDone" ariaLabel="Mark this step as complete" />',
    '  </dm-step>',
    '  <dm-step label="Preferences" [completed]="prefsDone()">',
    '    <p>Pick your notification and privacy preferences…</p>',
    '    <dm-checkbox [(checked)]="prefsDone" ariaLabel="Mark this step as complete" />',
    '  </dm-step>',
    '  <dm-step label="Review">Everything looks good.</dm-step>',
    '</dm-stepper>',
    '',
    '<!-- Drive progression from your own buttons -->',
    '<dm-button variant="bordered" [disabled]="step() === 0" (clicked)="wizard.previous()">',
    '  Back',
    '</dm-button>',
    '<dm-button color="primary" [disabled]="!canAdvance()" (clicked)="wizard.next()">',
    '  Next',
    '</dm-button>',
  ].join('\n');

  protected readonly linearTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmButtonComponent, DmCheckboxComponent, DmStepComponent, DmStepperComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-onboarding',",
    '  imports: [DmStepperComponent, DmStepComponent, DmButtonComponent, DmCheckboxComponent],',
    "  templateUrl: './onboarding.component.html',",
    '})',
    'export class OnboardingComponent {',
    '  protected readonly step = signal(0);',
    '  protected readonly profileDone = signal(false);',
    '  protected readonly prefsDone = signal(false);',
    '',
    '  protected readonly canAdvance = computed(() =>',
    '    this.step() === 0 ? this.profileDone() : this.step() === 1 ? this.prefsDone() : false,',
    '  );',
    '}',
  ].join('\n');

  // ---- States -------------------------------------------------------------

  protected readonly statesActive = signal(2);

  protected readonly statesCode = [
    '<dm-stepper [(activeStep)]="step">',
    '  <dm-step label="Completed" completed>…</dm-step>',
    '  <dm-step label="Needs attention" error>…</dm-step>',
    '  <dm-step label="In progress">…</dm-step>',
    '  <dm-step label="Optional step" optional optionalLabel="Optional">…</dm-step>',
    '  <dm-step label="Unavailable" disabled>…</dm-step>',
    '</dm-stepper>',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmStepperComponent, DmStepComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-step-states',",
    '  imports: [DmStepperComponent, DmStepComponent],',
    "  templateUrl: './step-states.component.html',",
    '})',
    'export class StepStatesComponent {',
    '  protected readonly step = signal(2);',
    '}',
  ].join('\n');

  // ---- Colors -------------------------------------------------------------

  protected readonly colors: DmStepperColor[] = [
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'danger',
  ];

  protected readonly colorsCode = [
    '<dm-stepper color="default" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper color="primary" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper color="secondary" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper color="success" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper color="warning" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper color="danger" [activeStep]="1">…</dm-stepper>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmStepperColor, DmStepperComponent, DmStepComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-stepper-colors',",
    '  imports: [DmStepperComponent, DmStepComponent],',
    "  templateUrl: './stepper-colors.component.html',",
    '})',
    'export class StepperColorsComponent {',
    '  protected readonly colors: DmStepperColor[] = [',
    "    'default', 'primary', 'secondary', 'success', 'warning', 'danger',",
    '  ];',
    '}',
  ].join('\n');

  // ---- Sizes --------------------------------------------------------------

  protected readonly sizes: DmStepperSize[] = ['sm', 'md', 'lg'];

  protected readonly sizesCode = [
    '<dm-stepper size="sm" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper size="md" [activeStep]="1">…</dm-stepper>',
    '<dm-stepper size="lg" [activeStep]="1">…</dm-stepper>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmStepperSize, DmStepperComponent, DmStepComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-stepper-sizes',",
    '  imports: [DmStepperComponent, DmStepComponent],',
    "  templateUrl: './stepper-sizes.component.html',",
    '})',
    'export class StepperSizesComponent {',
    "  protected readonly sizes: DmStepperSize[] = ['sm', 'md', 'lg'];",
    '}',
  ].join('\n');

  // ---- Global defaults ----------------------------------------------------

  protected readonly defaultsCode = [
    "import { provideStepperDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideStepperDefaults({ orientation: 'vertical', color: 'success' }),",
    ']',
  ].join('\n');

  // ---- Composition: checkout wizard (Reactive Forms + dm-error gating) ----

  protected readonly checkoutActive = signal(0);
  protected readonly placingOrder = signal(false);

  protected readonly checkoutForm = new FormGroup({
    account: new FormGroup({
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
      }),
    }),
    shipping: new FormGroup({
      address: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      city: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      country: new FormControl<string | null>(null, { validators: [Validators.required] }),
    }),
    payment: new FormGroup({
      method: new FormControl<string | null>(null, { validators: [Validators.required] }),
      terms: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    }),
  });

  protected readonly countries = computed<DmSelectItem<string>[]>(() => {
    const l = this.page().labels;
    return [
      { value: 'es', label: l['countryEs'] },
      { value: 'fr', label: l['countryFr'] },
      { value: 'de', label: l['countryDe'] },
      { value: 'it', label: l['countryIt'] },
    ];
  });

  protected readonly paymentMethods = computed<DmSelectItem<string>[]>(() => {
    const l = this.page().labels;
    return [
      { value: 'card', label: l['payCard'] },
      { value: 'paypal', label: l['payPaypal'] },
      { value: 'transfer', label: l['payTransfer'] },
    ];
  });

  /** Resolves the visible label of a select value for the review summary. */
  protected labelOf(items: DmSelectItem<string>[], value: string | null): string {
    return items.find((i) => i.value === value)?.label ?? '—';
  }

  /**
   * "Next" marks the active group as touched (so every `<dm-error>` shows)
   * and only advances when that group is valid. The stepper's own `linear`
   * gating additionally blocks clicking a later header directly.
   */
  protected checkoutNext(stepper: DmStepperComponent): void {
    const groups = [
      this.checkoutForm.controls.account,
      this.checkoutForm.controls.shipping,
      this.checkoutForm.controls.payment,
    ];
    const current = groups[this.checkoutActive()];
    if (current) {
      current.markAllAsTouched();
      if (current.invalid) {
        return;
      }
    }
    stepper.next();
  }

  protected placeOrder(): void {
    if (this.placingOrder()) {
      return;
    }
    this.placingOrder.set(true);
    setTimeout(() => this.placingOrder.set(false), 1000);
  }

  protected readonly compositionCode = [
    '<!-- A linear checkout wizard: each step is a nested FormGroup. The step is',
    '     `completed` when its group is valid; "Next" marks the group touched so',
    '     the <dm-error>s show, and only advances when it is valid. -->',
    '<dm-card style="max-width: 36rem">',
    '  <form [formGroup]="form" style="display: grid; gap: 1.25rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Checkout</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        Three quick steps — your cart is saved.',
    '      </p>',
    '    </div>',
    '',
    '    <dm-stepper #checkout [(activeStep)]="step" linear ariaLabel="Checkout steps">',
    '      <dm-step label="Account" [completed]="form.controls.account.valid">',
    '        <div formGroupName="account" style="display: grid; gap: 1rem; padding-top: 0.5rem">',
    '          <dm-form-field label="Full name" [required]="true">',
    '            <input dmInput type="text" formControlName="name" autocomplete="name" />',
    '            @if (form.controls.account.controls.name.touched &&',
    '                 form.controls.account.controls.name.hasError("required")) {',
    '              <dm-error>Your name is required.</dm-error>',
    '            }',
    '          </dm-form-field>',
    '          <dm-form-field label="Email" [required]="true">',
    '            <input dmInput type="email" formControlName="email" autocomplete="email" />',
    '            @if (form.controls.account.controls.email.touched &&',
    '                 form.controls.account.controls.email.hasError("required")) {',
    '              <dm-error>Email is required.</dm-error>',
    '            } @else if (form.controls.account.controls.email.touched &&',
    '                        form.controls.account.controls.email.hasError("pattern")) {',
    '              <dm-error>Enter a valid email address.</dm-error>',
    '            }',
    '          </dm-form-field>',
    '        </div>',
    '      </dm-step>',
    '',
    '      <dm-step label="Shipping" [completed]="form.controls.shipping.valid">',
    '        <div formGroupName="shipping" style="display: grid; gap: 1rem; padding-top: 0.5rem">',
    '          <dm-form-field label="Street address" [required]="true">',
    '            <input dmInput type="text" formControlName="address" autocomplete="street-address" />',
    '            @if (form.controls.shipping.controls.address.touched &&',
    '                 form.controls.shipping.controls.address.hasError("required")) {',
    '              <dm-error>Address is required.</dm-error>',
    '            }',
    '          </dm-form-field>',
    '          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">',
    '            <dm-form-field label="City" [required]="true">',
    '              <input dmInput type="text" formControlName="city" autocomplete="address-level2" />',
    '              @if (form.controls.shipping.controls.city.touched &&',
    '                   form.controls.shipping.controls.city.hasError("required")) {',
    '                <dm-error>City is required.</dm-error>',
    '              }',
    '            </dm-form-field>',
    '            <div style="display: grid; gap: 0.375rem">',
    '              <dm-select label="Country" placeholder="Select a country" [items]="countries"',
    '                         [required]="true" formControlName="country" />',
    '              @if (form.controls.shipping.controls.country.touched &&',
    '                   form.controls.shipping.controls.country.hasError("required")) {',
    '                <dm-error>Pick a country.</dm-error>',
    '              }',
    '            </div>',
    '          </div>',
    '        </div>',
    '      </dm-step>',
    '',
    '      <dm-step label="Payment" [completed]="form.controls.payment.valid">',
    '        <div formGroupName="payment" style="display: grid; gap: 1rem; padding-top: 0.5rem">',
    '          <div style="display: grid; gap: 0.375rem">',
    '            <dm-select label="Payment method" placeholder="Choose a method"',
    '                       [items]="paymentMethods" [required]="true" formControlName="method" />',
    '            @if (form.controls.payment.controls.method.touched &&',
    '                 form.controls.payment.controls.method.hasError("required")) {',
    '              <dm-error>Choose a payment method.</dm-error>',
    '            }',
    '          </div>',
    '          <div style="display: grid; gap: 0.375rem">',
    '            <div style="display: flex; align-items: center; gap: 0.5rem">',
    '              <dm-checkbox formControlName="terms" ariaLabel="I agree to the terms" />',
    '              <span style="font-size: 0.875rem">I agree to the terms and the refund policy.</span>',
    '            </div>',
    '            @if (form.controls.payment.controls.terms.touched &&',
    '                 form.controls.payment.controls.terms.hasError("required")) {',
    '              <dm-error>You must accept the terms to continue.</dm-error>',
    '            }',
    '          </div>',
    '        </div>',
    '      </dm-step>',
    '',
    '      <dm-step label="Review">',
    '        <dl style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; margin: 0.5rem 0 0">',
    '          <dt style="color: var(--dm-fg-muted)">Ship to</dt>',
    '          <dd style="margin: 0">',
    '            {{ form.value.account?.name }} · {{ form.value.shipping?.address }},',
    '            {{ form.value.shipping?.city }} ({{ countryLabel() }})',
    '          </dd>',
    '          <dt style="color: var(--dm-fg-muted)">Pay with</dt>',
    '          <dd style="margin: 0">{{ paymentLabel() }}</dd>',
    '          <dt style="color: var(--dm-fg-muted)">Total</dt>',
    '          <dd style="margin: 0"><dm-badge color="success" variant="flat">€ 148.00</dm-badge></dd>',
    '        </dl>',
    '      </dm-step>',
    '    </dm-stepper>',
    '',
    '    <div style="display: flex; justify-content: flex-end; gap: 0.5rem">',
    '      <dm-button variant="bordered" [disabled]="step() === 0" (clicked)="checkout.previous()">',
    '        Back',
    '      </dm-button>',
    '      @if (step() < 3) {',
    '        <dm-button color="primary" (clicked)="next(checkout)">Next</dm-button>',
    '      } @else {',
    '        <dm-button color="primary" [loading]="loading()"',
    '                   loadingLabel="Placing order…" (clicked)="placeOrder()">',
    '          Place order',
    '        </dm-button>',
    '      }',
    '    </div>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmBadgeComponent, DmButtonComponent, DmCardComponent,',
    '  DmCheckboxComponent, DmErrorComponent, DmFormFieldComponent, DmInputDirective,',
    '  DmSelectComponent, DmSelectItem, DmStepComponent, DmStepperComponent,',
    "} from '@dmaster/ui';",
    '',
    'const EMAIL_PATTERN = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;',
    '',
    '@Component({',
    "  selector: 'app-checkout-wizard',",
    '  imports: [',
    '    ReactiveFormsModule, DmCardComponent, DmStepperComponent, DmStepComponent,',
    '    DmFormFieldComponent, DmInputDirective, DmErrorComponent, DmSelectComponent,',
    '    DmCheckboxComponent, DmButtonComponent, DmBadgeComponent,',
    '  ],',
    "  templateUrl: './checkout-wizard.component.html',",
    '})',
    'export class CheckoutWizardComponent {',
    '  protected readonly step = signal(0);',
    '  protected readonly loading = signal(false);',
    '',
    '  protected readonly countries: DmSelectItem<string>[] = [',
    "    { value: 'es', label: 'Spain' },",
    "    { value: 'fr', label: 'France' },",
    "    { value: 'de', label: 'Germany' },",
    "    { value: 'it', label: 'Italy' },",
    '  ];',
    '  protected readonly paymentMethods: DmSelectItem<string>[] = [',
    "    { value: 'card', label: 'Credit card' },",
    "    { value: 'paypal', label: 'PayPal' },",
    "    { value: 'transfer', label: 'Bank transfer' },",
    '  ];',
    '',
    '  protected readonly form = new FormGroup({',
    '    account: new FormGroup({',
    "      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),",
    "      email: new FormControl('', {",
    '        nonNullable: true,',
    '        validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],',
    '      }),',
    '    }),',
    '    shipping: new FormGroup({',
    "      address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),",
    "      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),",
    '      country: new FormControl<string | null>(null, { validators: [Validators.required] }),',
    '    }),',
    '    payment: new FormGroup({',
    '      method: new FormControl<string | null>(null, { validators: [Validators.required] }),',
    '      terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),',
    '    }),',
    '  });',
    '',
    '  protected countryLabel(): string {',
    '    const v = this.form.controls.shipping.controls.country.value;',
    "    return this.countries.find((c) => c.value === v)?.label ?? '—';",
    '  }',
    '',
    '  protected paymentLabel(): string {',
    '    const v = this.form.controls.payment.controls.method.value;',
    "    return this.paymentMethods.find((m) => m.value === v)?.label ?? '—';",
    '  }',
    '',
    '  /** Mark the active group touched; advance only when it is valid. */',
    '  protected next(stepper: DmStepperComponent): void {',
    '    const groups = [',
    '      this.form.controls.account,',
    '      this.form.controls.shipping,',
    '      this.form.controls.payment,',
    '    ];',
    '    const current = groups[this.step()];',
    '    current?.markAllAsTouched();',
    '    if (current?.invalid) return;',
    '    stepper.next();',
    '  }',
    '',
    '  protected placeOrder(): void {',
    '    this.loading.set(true);',
    '    setTimeout(() => this.loading.set(false), 1000);',
    '  }',
    '}',
  ].join('\n');

  // ---- API ----------------------------------------------------------------

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'activeStep', type: 'number', default: '0', description: api['activeStep'] },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: api['orientation'],
      },
      { name: 'linear', type: 'boolean', default: 'false', description: api['linear'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'ng-template[dmStepIndicator]',
        type: 'projected template',
        default: '—',
        description: api['indicatorTemplate'],
      },
      { name: 'stepCount', type: 'Signal<number>', description: api['stepCount'] },
      { name: 'next()', type: 'method', description: api['next'] },
      { name: 'previous()', type: 'method', description: api['previous'] },
      { name: 'select(index)', type: 'method', description: api['select'] },
      { name: 'label (step)', type: 'string', default: "''", description: api['label'] },
      { name: 'optional (step)', type: 'boolean', default: 'false', description: api['optional'] },
      {
        name: 'optionalLabel (step)',
        type: 'string',
        default: "'Optional'",
        description: api['optionalLabel'],
      },
      {
        name: 'completed (step)',
        type: 'boolean',
        default: 'false',
        description: api['completed'],
      },
      { name: 'error (step)', type: 'boolean', default: 'false', description: api['error'] },
      { name: 'disabled (step)', type: 'boolean', default: 'false', description: api['disabled'] },
    ];
  });
}
