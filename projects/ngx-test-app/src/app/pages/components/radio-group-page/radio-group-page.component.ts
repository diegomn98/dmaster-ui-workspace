import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmErrorComponent,
  DmRadioColor,
  DmRadioComponent,
  DmRadioGroupComponent,
  DmRadioOrientation,
  DmRadioSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface PlanOption {
  id: string;
  name: string;
  descKey: string;
  price: string;
  recommended?: boolean;
}

@Component({
  selector: 'app-radio-group-page',
  imports: [
    DmRadioGroupComponent,
    DmRadioComponent,
    DmErrorComponent,
    DmCardComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './radio-group-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.radioGroup);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    size: 'md',
    orientation: 'vertical',
    disabled: false,
  });

  protected readonly controls: PropControl[] = [
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
    {
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'vertical', value: 'vertical' },
        { label: 'horizontal', value: 'horizontal' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmRadioColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmRadioSize);
  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmRadioOrientation,
  );
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] as boolean);
  protected readonly pgValue = signal<string>('free');

  protected readonly playgroundCode = computed(() => {
    const groupAttrs: string[] = [`name="plan"`];
    if (this.pgColor() !== 'primary') groupAttrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') groupAttrs.push(`size="${this.pgSize()}"`);
    if (this.pgOrientation() !== 'vertical') {
      groupAttrs.push(`orientation="${this.pgOrientation()}"`);
    }
    if (this.pgDisabled()) groupAttrs.push('[disabled]="true"');
    groupAttrs.push('[(value)]="selected"');
    return [
      `<dm-radio-group ${groupAttrs.join(' ')}>`,
      '  <dm-radio value="free">Free</dm-radio>',
      '  <dm-radio value="pro">Pro</dm-radio>',
      '  <dm-radio value="enterprise">Enterprise</dm-radio>',
      '</dm-radio-group>',
    ].join('\n');
  });

  // ─── Demo state ────────────────────────────────────────────────────────────
  protected readonly plan = signal<string>('pro');
  protected readonly side = signal<string>('center');
  protected readonly colorPick = signal<string>('a');
  protected readonly sizePick = signal<string>('a');
  protected readonly delivery = signal<string>('standard');

  // Reactive Forms + <dm-error>: nothing selected until the user picks.
  protected readonly shippingCtrl = new FormControl<string | null>(null, Validators.required);

  protected submitShipping(): void {
    this.shippingCtrl.markAsTouched();
  }

  protected resetShipping(): void {
    this.shippingCtrl.reset(null);
  }

  // Composition: plan-selection card.
  protected readonly plans: PlanOption[] = [
    { id: 'free', name: 'Free', descKey: 'planFreeDesc', price: '€0' },
    { id: 'pro', name: 'Pro', descKey: 'planProDesc', price: '€12', recommended: true },
    { id: 'team', name: 'Team', descKey: 'planTeamDesc', price: '€39' },
  ];
  protected readonly selectedPlan = signal<string>('pro');
  protected readonly selectedPlanName = computed(
    () => this.plans.find((p) => p.id === this.selectedPlan())?.name ?? '—',
  );

  // ─── Snippets ──────────────────────────────────────────────────────────────
  protected readonly basicCode = [
    '<dm-radio-group name="plan" [(value)]="plan">',
    '  <dm-radio value="free">Free</dm-radio>',
    '  <dm-radio value="pro">Pro</dm-radio>',
    '  <dm-radio value="enterprise">Enterprise</dm-radio>',
    '</dm-radio-group>',
    '',
    '<span>Selected: {{ plan() }}</span>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmRadioGroupComponent, DmRadioComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-plan-select',",
    '  imports: [DmRadioGroupComponent, DmRadioComponent],',
    "  templateUrl: './plan-select.component.html',",
    '})',
    'export class PlanSelectComponent {',
    "  protected readonly plan = signal<string>('pro');",
    '}',
  ].join('\n');

  protected readonly orientationCode = [
    '<!-- vertical (default) -->',
    '<dm-radio-group name="side" [(value)]="side">',
    '  <dm-radio value="left">Left</dm-radio>',
    '  <dm-radio value="center">Center</dm-radio>',
    '  <dm-radio value="right">Right</dm-radio>',
    '</dm-radio-group>',
    '',
    '<!-- horizontal -->',
    '<dm-radio-group name="side" orientation="horizontal" [(value)]="side">',
    '  <dm-radio value="left">Left</dm-radio>',
    '  <dm-radio value="center">Center</dm-radio>',
    '  <dm-radio value="right">Right</dm-radio>',
    '</dm-radio-group>',
  ].join('\n');

  protected readonly orientationTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmRadioGroupComponent, DmRadioComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-alignment',",
    '  imports: [DmRadioGroupComponent, DmRadioComponent],',
    "  templateUrl: './alignment.component.html',",
    '})',
    'export class AlignmentComponent {',
    "  protected readonly side = signal<string>('center');",
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-radio-group name="c" color="default" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="primary" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="secondary" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="success" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="warning" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="danger" [(value)]="v">…</dm-radio-group>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmRadioGroupComponent, DmRadioComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-radio-colors',",
    '  imports: [DmRadioGroupComponent, DmRadioComponent],',
    "  templateUrl: './radio-colors.component.html',",
    '})',
    'export class RadioColorsComponent {',
    "  protected readonly v = signal<string>('a');",
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-radio-group name="s" size="sm" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="s" size="md" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="s" size="lg" [(value)]="v">…</dm-radio-group>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmRadioGroupComponent, DmRadioComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-radio-sizes',",
    '  imports: [DmRadioGroupComponent, DmRadioComponent],',
    "  templateUrl: './radio-sizes.component.html',",
    '})',
    'export class RadioSizesComponent {',
    "  protected readonly v = signal<string>('a');",
    '}',
  ].join('\n');

  protected readonly disabledCode = [
    '<!-- a single option -->',
    '<dm-radio-group name="delivery" [(value)]="delivery">',
    '  <dm-radio value="standard">Standard</dm-radio>',
    '  <dm-radio value="priority">Priority</dm-radio>',
    '  <dm-radio value="overnight" [disabled]="true">Overnight (unavailable)</dm-radio>',
    '</dm-radio-group>',
    '',
    '<!-- the whole group -->',
    '<dm-radio-group name="delivery" [disabled]="true" [value]="\'priority\'">',
    '  <dm-radio value="standard">Standard</dm-radio>',
    '  <dm-radio value="priority">Priority</dm-radio>',
    '  <dm-radio value="overnight">Overnight</dm-radio>',
    '</dm-radio-group>',
  ].join('\n');

  protected readonly disabledTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmRadioGroupComponent, DmRadioComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-delivery-options',",
    '  imports: [DmRadioGroupComponent, DmRadioComponent],',
    "  templateUrl: './delivery-options.component.html',",
    '})',
    'export class DeliveryOptionsComponent {',
    "  protected readonly delivery = signal<string>('standard');",
    '}',
  ].join('\n');

  protected readonly formsCode = [
    '<dm-radio-group name="shipping" [formControl]="shipping" ariaLabel="Shipping method">',
    '  <dm-radio value="standard">Standard (3–5 days)</dm-radio>',
    '  <dm-radio value="express">Express (1–2 days)</dm-radio>',
    '  <dm-radio value="pickup">Store pickup</dm-radio>',
    '</dm-radio-group>',
    '',
    '@if (shipping.touched && shipping.hasError("required")) {',
    '  <dm-error>Choose a shipping method to continue.</dm-error>',
    '}',
    '',
    '<dm-button color="primary" (clicked)="submit()">Continue</dm-button>',
  ].join('\n');

  protected readonly formsTs = [
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmRadioGroupComponent, DmRadioComponent, DmErrorComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [ReactiveFormsModule, DmRadioGroupComponent, DmRadioComponent, DmErrorComponent],',
    '  …',
    '})',
    'export class CheckoutComponent {',
    '  // Starts empty so "required" is meaningful — the error only shows once touched.',
    '  protected readonly shipping = new FormControl<string | null>(null, Validators.required);',
    '',
    '  protected submit(): void {',
    '    this.shipping.markAsTouched();',
    '    if (this.shipping.valid) { /* … */ }',
    '  }',
    '}',
  ].join('\n');

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <div style="display: grid; gap: 1rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Choose your plan</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        Switch or cancel at any time.',
    '      </p>',
    '    </div>',
    '',
    '    <dm-radio-group name="plan" ariaLabel="Choose your plan" [(value)]="selected"',
    '                    style="display: grid; gap: 0.625rem">',
    '      @for (p of plans; track p.id) {',
    '        <!-- The dm-radio host IS the tile: click anywhere selects, keyboard + focus ring intact -->',
    '        <dm-radio',
    '          [value]="p.id"',
    '          style="display: grid; padding: 0.875rem 5.5rem 0.875rem 1rem;',
    '                 border: 2px solid; border-radius: var(--dm-radius-md)"',
    "          [style.border-color]=\"selected() === p.id ? 'var(--dm-primary)' : 'var(--dm-border)'\"",
    "          [style.background-color]=\"selected() === p.id ? 'var(--dm-primary-subtle)' : 'transparent'\"",
    '        >',
    '          <span style="display: grid; gap: 0.125rem">',
    '            <span style="display: flex; align-items: center; gap: 0.5rem; font-weight: 600">',
    '              {{ p.name }}',
    '              @if (p.recommended) {',
    '                <dm-badge color="primary" variant="flat" size="sm">Recommended</dm-badge>',
    '              }',
    '            </span>',
    '            <span style="font-size: 0.8125rem; color: var(--dm-fg-muted)">{{ p.description }}</span>',
    '          </span>',
    '          <!-- dm-radio is position: relative, so the price pins to the tile edge -->',
    '          <span style="position: absolute; inset-inline-end: 1rem; top: 50%; transform: translateY(-50%)">',
    '            <span style="font-size: 1.125rem; font-weight: 700">{{ p.price }}</span>',
    '            <span style="font-size: 0.75rem; color: var(--dm-fg-muted)">/mo</span>',
    '          </span>',
    '        </dm-radio>',
    '      }',
    '    </dm-radio-group>',
    '',
    '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '      <span style="font-size: 0.8125rem; color: var(--dm-fg-muted)">',
    '        Selected: <strong>{{ selectedName() }}</strong>',
    '      </span>',
    '      <dm-button color="primary">Continue</dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmBadgeComponent, DmButtonComponent, DmCardComponent,',
    '  DmRadioComponent, DmRadioGroupComponent,',
    "} from '@dmaster/ui';",
    '',
    'interface Plan {',
    '  id: string;',
    '  name: string;',
    '  description: string;',
    '  price: string;',
    '  recommended?: boolean;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-plan-picker',",
    '  imports: [',
    '    DmRadioGroupComponent, DmRadioComponent, DmCardComponent,',
    '    DmBadgeComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './plan-picker.component.html',",
    '})',
    'export class PlanPickerComponent {',
    '  protected readonly plans: Plan[] = [',
    "    { id: 'free', name: 'Free', description: 'For side projects. 1 seat.', price: '€0' },",
    "    { id: 'pro', name: 'Pro', description: 'Unlimited projects. 5 seats.', price: '€12', recommended: true },",
    "    { id: 'team', name: 'Team', description: 'SSO, audit log. Unlimited seats.', price: '€39' },",
    '  ];',
    '',
    "  protected readonly selected = signal('pro');",
    '  protected readonly selectedName = computed(',
    "    () => this.plans.find((p) => p.id === this.selected())?.name ?? '—',",
    '  );',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideRadioDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideRadioDefaults({ color: 'success', size: 'lg' }),",
    ']',
  ].join('\n');

  // ─── API ───────────────────────────────────────────────────────────────────
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'name', type: 'string', default: '—', description: api['name'] },
      { name: 'value', type: 'string | null', default: 'null', description: api['value'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['size'],
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: api['orientation'],
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: api['disabled'],
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        description: api['ariaLabel'],
      },
      { name: 'value (radio)', type: 'string', default: '—', description: api['radioValue'] },
      {
        name: 'disabled (radio)',
        type: 'boolean',
        default: 'false',
        description: api['radioDisabled'],
      },
    ];
  });
}
