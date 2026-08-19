import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DIALOG_DATA,
  DialogRef,
  DmDrawerService,
  DmDrawerPlacement,
  DmDrawerSize,
  DmButtonComponent,
  DmCardComponent,
  DmDividerComponent,
  DmSwitchComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface SettingsDrawerData {
  title: string;
  notifications: string;
  compact: string;
  save: string;
  close: string;
}

@Component({
  imports: [DmButtonComponent, DmSwitchComponent],
  template: `
    <div class="settings-drawer">
      <h2 class="settings-drawer__title">{{ data.title }}</h2>
      <div class="settings-drawer__body">
        <dm-switch [(checked)]="notifications">{{ data.notifications }}</dm-switch>
        <dm-switch [(checked)]="compact">{{ data.compact }}</dm-switch>
      </div>
      <div class="settings-drawer__actions">
        <dm-button color="default" variant="light" (clicked)="ref.close()">
          {{ data.close }}
        </dm-button>
        <dm-button color="primary" (clicked)="ref.close('saved')">
          {{ data.save }}
        </dm-button>
      </div>
    </div>
  `,
  styles: `
    .settings-drawer {
      display: flex;
      flex-direction: column;
      gap: var(--dm-space-5);
      height: 100%;
    }

    .settings-drawer__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }

    .settings-drawer__body {
      display: flex;
      flex-direction: column;
      gap: var(--dm-space-4);
      flex: 1;
    }

    .settings-drawer__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDrawerComponent {
  protected readonly data = inject<SettingsDrawerData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<string>>(DialogRef);
  protected readonly notifications = signal(true);
  protected readonly compact = signal(false);
}

/* Composition: shopping-cart drawer ------------------------------------ */

interface CartLine {
  name: string;
  meta: string;
  qty: number;
  price: number;
}

interface CartDrawerData {
  title: string;
  lines: CartLine[];
  subtotal: string;
  shippingNote: string;
  checkout: string;
  continueShopping: string;
}

@Component({
  imports: [DmButtonComponent, DmDividerComponent],
  template: `
    <div class="cart">
      <h2 class="cart__title">{{ data.title }}</h2>
      <ul class="cart__lines">
        @for (line of data.lines; track line.name) {
          <li class="cart__line">
            <div class="cart__thumb" aria-hidden="true">{{ line.name.charAt(0) }}</div>
            <div class="cart__info">
              <span class="cart__name">{{ line.name }}</span>
              <span class="cart__meta">{{ line.meta }} · ×{{ line.qty }}</span>
            </div>
            <span class="cart__price">{{ format(line.price * line.qty) }}</span>
          </li>
        }
      </ul>
      <dm-divider />
      <div class="cart__subtotal">
        <span>{{ data.subtotal }}</span>
        <strong>{{ format(subtotal) }}</strong>
      </div>
      <p class="cart__note">{{ data.shippingNote }}</p>
      <div class="cart__actions">
        <dm-button color="primary" size="lg" (clicked)="ref.close('checkout')">
          {{ data.checkout }}
        </dm-button>
        <dm-button color="default" variant="light" (clicked)="ref.close()">
          {{ data.continueShopping }}
        </dm-button>
      </div>
    </div>
  `,
  styles: `
    .cart {
      display: flex;
      flex-direction: column;
      gap: var(--dm-space-4);
      height: 100%;
    }
    .cart__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }
    .cart__lines {
      display: grid;
      gap: var(--dm-space-3);
      margin: 0;
      padding: 0;
      list-style: none;
      flex: 1;
    }
    .cart__line {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: var(--dm-space-3);
    }
    .cart__thumb {
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--dm-radius-md);
      background: var(--dm-primary-subtle);
      color: var(--dm-primary);
      font-weight: var(--dm-font-semibold);
    }
    .cart__info {
      display: grid;
      gap: 0.125rem;
      min-width: 0;
    }
    .cart__name {
      font-weight: var(--dm-font-medium);
    }
    .cart__meta,
    .cart__note {
      margin: 0;
      font-size: var(--dm-text-sm);
      color: var(--dm-fg-muted);
    }
    .cart__price {
      font-variant-numeric: tabular-nums;
    }
    .cart__subtotal {
      display: flex;
      justify-content: space-between;
      font-size: var(--dm-text-base);
    }
    .cart__actions {
      display: grid;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawerComponent {
  protected readonly data = inject<CartDrawerData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<string>>(DialogRef);
  protected readonly subtotal = this.data.lines.reduce(
    (sum, line) => sum + line.price * line.qty,
    0,
  );

  protected format(value: number): string {
    return `$${value.toFixed(2)}`;
  }
}

@Component({
  selector: 'app-drawer-page',
  imports: [
    DmButtonComponent,
    DmCardComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    DemoBlockComponent,
    PropSignalComponent,
  ],
  templateUrl: './drawer-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly drawer = inject(DmDrawerService);
  protected readonly page = computed(() => this.i18n.t().pages.drawer);

  protected readonly playground = signal<PropValues>({
    placement: 'right',
    size: 'md',
    backdrop: true,
    disableClose: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'placement',
      label: 'placement',
      type: 'select',
      options: ['left', 'right', 'top', 'bottom'].map((value) => ({ label: value, value })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg', 'full'].map((value) => ({ label: value, value })),
    },
    { key: 'backdrop', label: 'backdrop', type: 'boolean' },
    { key: 'disableClose', label: 'disableClose', type: 'boolean' },
  ];

  protected readonly pgPlacement = computed(
    () => this.playground()['placement'] as DmDrawerPlacement,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmDrawerSize);
  protected readonly pgBackdrop = computed(() => this.playground()['backdrop'] !== false);
  protected readonly pgDisableClose = computed(() => this.playground()['disableClose'] === true);

  protected readonly lastResult = signal<string>('—');

  protected open(overrides: { placement?: DmDrawerPlacement; size?: DmDrawerSize } = {}): void {
    const labels = this.page().labels;
    const ref = this.drawer.open<string, SettingsDrawerData, SettingsDrawerComponent>(
      SettingsDrawerComponent,
      {
        placement: overrides.placement ?? this.pgPlacement(),
        size: overrides.size ?? this.pgSize(),
        backdrop: this.pgBackdrop(),
        disableClose: this.pgDisableClose(),
        ariaLabel: labels['title'],
        data: {
          title: labels['title'],
          notifications: labels['notifications'],
          compact: labels['compact'],
          save: labels['save'],
          close: labels['close'],
        },
      },
    );
    ref.closed.subscribe((result) => this.lastResult.set(result ?? '—'));
  }

  protected openPersistent(): void {
    const labels = this.page().labels;
    this.drawer.open<string, SettingsDrawerData, SettingsDrawerComponent>(SettingsDrawerComponent, {
      placement: 'right',
      disableClose: true,
      ariaLabel: labels['title'],
      data: {
        title: labels['title'],
        notifications: labels['notifications'],
        compact: labels['compact'],
        save: labels['save'],
        close: labels['close'],
      },
    });
  }

  /* Composition: shopping cart */
  protected readonly cartCount = signal(0);
  protected readonly cartResult = signal<string>('—');

  protected openCart(): void {
    const labels = this.page().labels;
    this.cartCount.update((count) => count + 1);
    const ref = this.drawer.open<string, CartDrawerData, CartDrawerComponent>(CartDrawerComponent, {
      placement: 'right',
      size: 'sm',
      ariaLabel: labels['cartTitle'],
      data: {
        title: labels['cartTitle'],
        lines: [
          {
            name: labels['cartProduct'],
            meta: labels['cartProductMeta'],
            qty: this.cartCount(),
            price: 29,
          },
          { name: 'Icon pack', meta: 'SVG · 53 icons', qty: 1, price: 12 },
          { name: 'Figma kit', meta: 'Community file', qty: 1, price: 0 },
        ],
        subtotal: labels['subtotal'],
        shippingNote: labels['shippingNote'],
        checkout: labels['checkout'],
        continueShopping: labels['continueShopping'],
      },
    });
    ref.closed.subscribe((result) => {
      if (result === 'checkout') {
        this.cartResult.set(labels['checkoutDone']);
        this.cartCount.set(0);
      } else {
        this.cartResult.set(labels['cartKept']);
      }
    });
  }

  protected readonly compositionCode = [
    '<dm-card style="max-width: 20rem">',
    '  <div style="display: grid; gap: 0.875rem">',
    '    <div class="product__image" aria-hidden="true">dm.</div>',
    '    <strong>Design system license</strong>',
    '    <span style="color: var(--dm-fg-muted)">Unlimited projects · 1 seat</span>',
    '    <div style="display: flex; justify-content: space-between; align-items: center">',
    '      <span>$29.00</span>',
    '      <dm-button color="primary" size="sm" (clicked)="openCart()">Add to cart</dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    '@Component({',
    '  imports: [DmButtonComponent, DmDividerComponent],',
    '  template: `',
    '    <h2>{{ data.title }}</h2>',
    '    <ul>',
    '      @for (line of data.lines; track line.name) {',
    '        <li>{{ line.name }} ×{{ line.qty }} — {{ format(line.price * line.qty) }}</li>',
    '      }',
    '    </ul>',
    '    <dm-divider />',
    '    <div>Subtotal <strong>{{ format(subtotal) }}</strong></div>',
    '    <dm-button color="primary" size="lg" (clicked)="ref.close(\'checkout\')">Checkout</dm-button>',
    '    <dm-button variant="light" (clicked)="ref.close()">Continue shopping</dm-button>',
    '  `,',
    '})',
    'export class CartDrawerComponent {',
    '  protected readonly data = inject<CartDrawerData>(DIALOG_DATA);',
    '  protected readonly ref = inject<DialogRef<string>>(DialogRef);',
    '  protected readonly subtotal = this.data.lines.reduce((s, l) => s + l.price * l.qty, 0);',
    '',
    '  format(value: number): string {',
    '    return `$${value.toFixed(2)}`;',
    '  }',
    '}',
    '',
    '// caller',
    'private readonly drawer = inject(DmDrawerService);',
    '',
    'openCart(): void {',
    '  const ref = this.drawer.open<string>(CartDrawerComponent, {',
    "    placement: 'right',",
    "    size: 'sm',",
    "    ariaLabel: 'Your cart',",
    "    data: { title: 'Your cart', lines: this.cart(), /* … */ },",
    '  });',
    "  ref.closed.subscribe((result) => { if (result === 'checkout') { /* go to checkout */ } });",
    '}',
  ].join('\n');

  protected readonly playgroundCode = computed(() => {
    const options: string[] = [];
    if (this.pgPlacement() !== 'right') {
      options.push(`placement: '${this.pgPlacement()}'`);
    }
    if (this.pgSize() !== 'md') {
      options.push(`size: '${this.pgSize()}'`);
    }
    if (!this.pgBackdrop()) {
      options.push('backdrop: false');
    }
    if (this.pgDisableClose()) {
      options.push('disableClose: true');
    }
    const config = options.length > 0 ? `, { ${options.join(', ')} }` : '';
    return [
      'private readonly drawer = inject(DmDrawerService);',
      '',
      `const ref = this.drawer.open(SettingsDrawerComponent${config});`,
      'ref.closed.subscribe((result) => …);',
    ].join('\n');
  });

  protected readonly contentCode = [
    'export class SettingsDrawerComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject(DialogRef);',
    '',
    '  save(): void {',
    "    this.ref.close('saved');",
    '  }',
    '}',
  ].join('\n');

  protected readonly placementsCode = [
    "this.drawer.open(SettingsDrawerComponent, { placement: 'left' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'right' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'top' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'bottom' });",
  ].join('\n');

  protected readonly sizesCode = [
    "this.drawer.open(SettingsDrawerComponent, { size: 'sm' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'md' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'lg' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'full' });",
  ].join('\n');

  protected readonly persistentCode = [
    '// disableClose: closes only through a control inside the drawer.',
    'this.drawer.open(SettingsDrawerComponent, { disableClose: true });',
    '',
    '// inside the drawer component:',
    'private readonly ref = inject(DialogRef);',
    'close(): void {',
    '  this.ref.close();',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideDrawerDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideDrawerDefaults({ placement: 'left', size: 'lg' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'data', type: 'D', default: '—', description: api['data'] },
      {
        name: 'placement',
        type: "'left' | 'right' | 'top' | 'bottom'",
        default: "'right'",
        description: api['placement'],
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api['size'],
      },
      { name: 'backdrop', type: 'boolean', default: 'true', description: api['backdrop'] },
      { name: 'disableClose', type: 'boolean', default: 'false', description: api['disableClose'] },
      { name: 'ariaLabel', type: 'string', default: '—', description: api['ariaLabel'] },
    ];
  });
}
