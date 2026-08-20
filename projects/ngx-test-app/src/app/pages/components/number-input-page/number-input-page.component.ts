import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmErrorComponent,
  DmKbdComponent,
  DmNumberInputColor,
  DmNumberInputComponent,
  DmNumberInputRadius,
  DmNumberInputVariant,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const VARIANTS: DmNumberInputVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmNumberInputColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];
const SIZES: DmSize[] = ['sm', 'md', 'lg'];

/** Self-contained colored thumbnail (data URI) — initials on a flat fill. */
function thumbSvg(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="10" fill="${color}"/><text x="24" y="30" font-family="system-ui, sans-serif" font-size="17" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface CartProduct {
  id: string;
  /** Key into `page().labels` for the localized product name. */
  nameKey: string;
  price: number;
  stock: number;
  initialQty: number;
  src: string;
}

const CART_PRODUCTS: CartProduct[] = [
  {
    id: 'hp',
    nameKey: 'cartItem1',
    price: 89.9,
    stock: 5,
    initialQty: 1,
    initials: 'HP',
    color: '#6366f1',
  },
  {
    id: 'kb',
    nameKey: 'cartItem2',
    price: 129,
    stock: 2,
    initialQty: 1,
    initials: 'KB',
    color: '#0ea5e9',
  },
  {
    id: 'hub',
    nameKey: 'cartItem3',
    price: 39.5,
    stock: 12,
    initialQty: 2,
    initials: 'HB',
    color: '#10b981',
  },
].map(({ initials, color, ...p }) => ({ ...p, src: thumbSvg(initials, color) }));

const FREE_SHIPPING_FROM = 100;
const SHIPPING_FEE = 4.9;

@Component({
  selector: 'app-number-input-page',
  imports: [
    DmNumberInputComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmErrorComponent,
    DmKbdComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './number-input-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberInputPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.numberInput);
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;
  protected readonly sizes = SIZES;

  /** BCP-47 locale matching the dashboard language — drives the Intl demos. */
  protected readonly demoLocale = computed(
    () => ({ en: 'en-IE', es: 'es-ES', fr: 'fr-FR' })[this.i18n.locale()],
  );

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    size: 'md',
    variant: 'flat',
    color: 'default',
    radius: 'md',
    step: 1,
    hideControls: false,
    disabled: false,
  });

  protected readonly playgroundValue = signal<number | null>(4);

  protected readonly controls: PropControl[] = [
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: SIZES.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: VARIANTS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: COLORS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'].map((v) => ({ label: v, value: v })),
    },
    { key: 'step', label: 'step', type: 'number', min: 0.01, max: 100, step: 1 },
    { key: 'hideControls', label: 'hideControls', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmNumberInputVariant,
  );
  protected readonly pgColor = computed(() => this.playground()['color'] as DmNumberInputColor);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmNumberInputRadius);
  protected readonly pgStep = computed(() => {
    const raw = Number(this.playground()['step']);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  });
  protected readonly pgHideControls = computed(() => this.playground()['hideControls'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['label="Quantity"', '[(value)]="qty"', '[min]="0"', '[max]="100"'];
    if (this.pgStep() !== 1) {
      attrs.push(`[step]="${this.pgStep()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgVariant() !== 'flat') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgColor() !== 'default') {
      attrs.push(`color="${this.pgColor()}"`);
    }
    if (this.pgRadius() !== 'md') {
      attrs.push(`radius="${this.pgRadius()}"`);
    }
    if (this.pgHideControls()) {
      attrs.push('hideControls');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    return `<dm-number-input\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicValue = signal<number | null>(2);
  protected readonly lastCommit = signal<string>('—');

  protected onCommit(value: number | null): void {
    this.lastCommit.set(value === null ? 'null' : String(value));
  }

  protected readonly basicCode = [
    '<dm-number-input',
    '  label="Quantity"',
    '  description="Use the buttons or the arrow keys."',
    '  [(value)]="qty"',
    '  (valueCommit)="onCommit($event)"',
    '/>',
    '<span>value: {{ qty() }}</span>',
  ].join('\n');

  protected readonly rangeValue = signal<number | null>(25);

  protected readonly rangeCode = [
    '<!-- Typed values are clamped to [0, 100] and rounded to the step on blur / Enter. -->',
    '<dm-number-input',
    '  label="Discount (%)"',
    '  [(value)]="discount"',
    '  [min]="0"',
    '  [max]="100"',
    '  [step]="5"',
    '/>',
  ].join('\n');

  protected readonly hoursValue = signal<number | null>(7.5);
  protected readonly weightValue = signal<number | null>(72.4);

  protected readonly decimalsCode = [
    '<!-- precision defaults to the decimals in `step`: 0.25 → 2 decimals -->',
    '<dm-number-input label="Hours logged" [(value)]="hours" [min]="0" [max]="24" [step]="0.25" />',
    '',
    '<!-- or pin it explicitly: step 0.1, but the committed value keeps 2 decimals -->',
    '<dm-number-input label="Weight (kg)" [(value)]="weight" [min]="0" [step]="0.1" [precision]="2" />',
  ].join('\n');

  protected readonly priceValue = signal<number | null>(1299.5);
  protected readonly budgetValue = signal<number | null>(2500);
  protected readonly distanceValue = signal<number | null>(42.2);

  protected readonly eurFormat: Intl.NumberFormatOptions = { style: 'currency', currency: 'EUR' };
  protected readonly usdFormat: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  };
  protected readonly kmFormat: Intl.NumberFormatOptions = {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
  };

  protected readonly formatCode = [
    '<!-- The model always holds the raw number; `formatOptions` only affects the blurred display. -->',
    '<dm-number-input',
    '  label="Price"',
    '  [(value)]="price"',
    '  [step]="0.5"',
    "  [formatOptions]=\"{ style: 'currency', currency: 'EUR' }\"",
    '  locale="es-ES"',
    '/>',
    '',
    '<dm-number-input',
    '  label="Budget"',
    '  [(value)]="budget"',
    '  [step]="100"',
    "  [formatOptions]=\"{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }\"",
    '  locale="en-US"',
    '/>',
    '',
    '<dm-number-input',
    '  label="Distance"',
    '  [(value)]="distance"',
    '  [step]="0.1"',
    "  [formatOptions]=\"{ style: 'unit', unit: 'kilometer' }\"",
    '/>',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-number-input variant="${v}" label="${v}" [value]="10" />`,
  ).join('\n');

  protected readonly sizesCode = SIZES.map(
    (s) => `<dm-number-input size="${s}" ariaLabel="${s}" [value]="10" />`,
  ).join('\n');

  protected readonly yearValue = signal<number | null>(2026);

  protected readonly keyboardCode = [
    '<!-- No −/+ buttons; the whole keyboard map still works. -->',
    '<dm-number-input',
    '  label="Year"',
    '  hideControls',
    '  [(value)]="year"',
    '  [min]="1900"',
    '  [max]="2100"',
    '/>',
  ].join('\n');

  protected readonly statesCode = [
    '<dm-number-input label="Disabled" [value]="3" [disabled]="true" />',
    '<dm-number-input label="Read-only" [value]="3" [readonly]="true" />',
    '<dm-number-input label="Required" [required]="true" placeholder="0" />',
    '<dm-number-input label="Seats" [value]="12" [max]="10" error="Only 10 seats are available." />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideNumberInputDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    '  provideNumberInputDefaults({',
    "    variant: 'bordered',",
    "    size: 'sm',",
    "    decrementLabel: 'Disminuir',",
    "    incrementLabel: 'Aumentar',",
    '  }),',
    ']',
  ].join('\n');

  // ---- Composition: shopping cart ------------------------------------------
  protected readonly cart = CART_PRODUCTS;

  protected readonly qtyControls = new FormArray<FormControl<number>>(
    CART_PRODUCTS.map(
      (p) =>
        new FormControl<number>(p.initialQty, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(1), Validators.max(p.stock)],
        }),
    ),
  );

  /** Mirror of the FormArray value as a signal, so the totals recompute in zoneless mode. */
  protected readonly quantities = signal<number[]>(CART_PRODUCTS.map((p) => p.initialQty));

  protected readonly checkoutState = signal<DmButtonState>('idle');

  constructor() {
    this.qtyControls.valueChanges.subscribe((values) =>
      this.quantities.set(values.map((v) => (typeof v === 'number' ? v : 0))),
    );
  }

  protected readonly currency = computed(
    () => new Intl.NumberFormat(this.demoLocale(), { style: 'currency', currency: 'EUR' }),
  );

  protected readonly lineTotals = computed(() =>
    this.cart.map((p, i) => (this.quantities()[i] ?? 0) * p.price),
  );

  protected readonly itemCount = computed(() => this.quantities().reduce((a, b) => a + b, 0));

  protected readonly subtotal = computed(() => this.lineTotals().reduce((a, b) => a + b, 0));

  protected readonly shipping = computed(() =>
    this.subtotal() >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE,
  );

  protected readonly total = computed(() => this.subtotal() + this.shipping());

  protected money(value: number): string {
    return this.currency().format(value);
  }

  protected qtyErrorId(index: number): string {
    return `cart-qty-error-${index}`;
  }

  protected checkout(): void {
    if (this.checkoutState() !== 'idle') {
      return;
    }
    this.qtyControls.markAllAsTouched();
    if (this.qtyControls.invalid) {
      return;
    }
    this.checkoutState.set('loading');
    setTimeout(() => {
      this.checkoutState.set('success');
      setTimeout(() => this.checkoutState.set('idle'), 1600);
    }, 1200);
  }

  protected readonly compositionCode = [
    '<!-- A cart: one quantity spinbutton per line, live subtotals, stock validation with <dm-error>. -->',
    '<dm-card style="max-width: 28rem">',
    '  <header style="display: flex; justify-content: space-between; align-items: baseline">',
    '    <strong>Your cart</strong>',
    '    <dm-badge color="primary" variant="flat" size="sm">{{ itemCount() }} items</dm-badge>',
    '  </header>',
    '',
    '  @for (p of cart; track p.id; let i = $index) {',
    '    <div class="cart__row">',
    '      <dm-avatar [src]="p.src" [alt]="p.name" size="sm" shape="rounded" />',
    '      <div style="flex: 1; min-width: 0">',
    '        <div>{{ p.name }}</div>',
    '        <small class="muted">{{ money(p.price) }} each · {{ p.stock }} in stock</small>',
    '      </div>',
    '      <dm-number-input',
    '        size="sm"',
    '        [min]="1"',
    '        [max]="99"',
    '        [formControl]="qty.at(i)"',
    '        [ariaLabel]="\'Quantity: \' + p.name"',
    "        [ariaDescribedby]=\"qty.at(i).hasError('max') ? 'qty-error-' + i : ''\"",
    '        style="width: 6.5rem"',
    '      />',
    '      <strong class="cart__line">{{ money(lineTotals()[i]) }}</strong>',
    '    </div>',
    "    @if (qty.at(i).hasError('max')) {",
    '      <dm-error [id]="\'qty-error-\' + i">Only {{ p.stock }} left in stock.</dm-error>',
    '    }',
    '  }',
    '',
    '  <dl class="cart__totals">',
    '    <dt>Subtotal</dt><dd>{{ money(subtotal()) }}</dd>',
    "    <dt>Shipping</dt><dd>{{ shipping() === 0 ? 'Free' : money(shipping()) }}</dd>",
    '    <dt>Total</dt><dd>{{ money(total()) }}</dd>',
    '  </dl>',
    '',
    '  <dm-button',
    '    color="primary"',
    '    style="width: 100%"',
    '    [state]="state()"',
    '    [disabled]="qty.invalid"',
    '    loadingLabel="Processing…"',
    '    successLabel="Order placed"',
    '    (clicked)="checkout()"',
    '  >',
    '    Checkout',
    '  </dm-button>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmButtonState,',
    '  DmCardComponent,',
    '  DmErrorComponent,',
    '  DmNumberInputComponent,',
    "} from '@dmaster/ui';",
    '',
    'const PRODUCTS = [',
    "  { id: 'hp', name: 'Wireless headphones', price: 89.9, stock: 5, qty: 1, src: '/img/hp.png' },",
    "  { id: 'kb', name: 'Mechanical keyboard', price: 129, stock: 2, qty: 1, src: '/img/kb.png' },",
    "  { id: 'hub', name: 'USB-C hub', price: 39.5, stock: 12, qty: 2, src: '/img/hub.png' },",
    '];',
    '',
    '@Component({',
    "  selector: 'app-cart',",
    '  imports: [',
    '    ReactiveFormsModule,',
    '    DmAvatarComponent,',
    '    DmBadgeComponent,',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmErrorComponent,',
    '    DmNumberInputComponent,',
    '  ],',
    "  templateUrl: './cart.component.html',",
    '})',
    'export class CartComponent {',
    '  readonly cart = PRODUCTS;',
    '',
    '  // One FormControl<number> per line; stock is enforced by Validators.max.',
    '  readonly qty = new FormArray<FormControl<number>>(',
    '    PRODUCTS.map(',
    '      (p) =>',
    '        new FormControl(p.qty, {',
    '          nonNullable: true,',
    '          validators: [Validators.required, Validators.min(1), Validators.max(p.stock)],',
    '        }),',
    '    ),',
    '  );',
    '',
    '  // Mirror the FormArray into a signal so the totals recompute (zoneless-friendly).',
    '  private readonly quantities = signal(PRODUCTS.map((p) => p.qty));',
    "  private readonly fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });",
    '',
    '  readonly lineTotals = computed(() => this.cart.map((p, i) => this.quantities()[i] * p.price));',
    '  readonly itemCount = computed(() => this.quantities().reduce((a, b) => a + b, 0));',
    '  readonly subtotal = computed(() => this.lineTotals().reduce((a, b) => a + b, 0));',
    '  readonly shipping = computed(() => (this.subtotal() >= 100 ? 0 : 4.9));',
    '  readonly total = computed(() => this.subtotal() + this.shipping());',
    "  readonly state = signal<DmButtonState>('idle');",
    '',
    '  constructor() {',
    '    this.qty.valueChanges.subscribe((v) => this.quantities.set(v.map((n) => n ?? 0)));',
    '  }',
    '',
    '  money(value: number): string {',
    '    return this.fmt.format(value);',
    '  }',
    '',
    '  checkout(): void {',
    '    this.qty.markAllAsTouched();',
    "    if (this.qty.invalid || this.state() !== 'idle') return;",
    "    this.state.set('loading');",
    '    setTimeout(() => {',
    "      this.state.set('success');",
    "      setTimeout(() => this.state.set('idle'), 1600);",
    '    }, 1200);',
    '  }',
    '}',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'model<number | null>', default: 'null', description: api['value'] },
      { name: 'min', type: 'number | null', default: 'null', description: api['min'] },
      { name: 'max', type: 'number | null', default: 'null', description: api['max'] },
      { name: 'step', type: 'number', default: '1', description: api['step'] },
      { name: 'precision', type: 'number | null', default: 'null', description: api['precision'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'readonly', type: 'boolean', default: 'false', description: api['readonly'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      {
        name: 'hideControls',
        type: 'boolean',
        default: 'false',
        description: api['hideControls'],
      },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'flat' | 'bordered' | 'faded' | 'underlined'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api['radius'],
      },
      {
        name: 'formatOptions',
        type: 'Intl.NumberFormatOptions | null',
        default: 'null',
        description: api['formatOptions'],
      },
      {
        name: 'locale',
        type: 'string | undefined',
        default: 'undefined',
        description: api['locale'],
      },
      { name: 'name', type: 'string', default: "''", description: api['name'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'ariaDescribedby',
        type: 'string',
        default: "''",
        description: api['ariaDescribedby'],
      },
      {
        name: 'decrementLabel',
        type: 'string',
        default: "'Decrease'",
        description: api['decrementLabel'],
      },
      {
        name: 'incrementLabel',
        type: 'string',
        default: "'Increase'",
        description: api['incrementLabel'],
      },
      {
        name: 'valueCommit',
        type: 'output<number | null>',
        default: '—',
        description: api['valueCommit'],
      },
    ];
  });
}
