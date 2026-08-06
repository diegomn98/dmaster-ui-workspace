import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmSelectColor,
  DmSelectComponent,
  DmSelectItem,
  DmSelectRadius,
  DmSelectVariant,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const PETS: DmSelectItem<string>[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog', description: "Man's best friend" },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'fish', label: 'Fish', disabled: true },
  { value: 'hamster', label: 'Hamster' },
  { value: 'parrot', label: 'Parrot' },
];

const VARIANTS: DmSelectVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmSelectColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];

@Component({
  selector: 'app-select-page',
  imports: [
    DmSelectComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './select-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.select);
  protected readonly pets = PETS;
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    disabled: false,
    required: false,
  });

  protected readonly playgroundValue = signal<string | null>(null);

  protected readonly controls: PropControl[] = [
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: COLORS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: VARIANTS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((v) => ({ label: v, value: v })),
    },
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'].map((v) => ({ label: v, value: v })),
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmSelectColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmSelectVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmSelectRadius);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [
      'label="Pet"',
      'placeholder="Pick a pet"',
      '[items]="pets"',
      '[(value)]="pet"',
    ];
    if (this.pgColor() !== 'default') {
      attrs.push(`color="${this.pgColor()}"`);
    }
    if (this.pgVariant() !== 'flat') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgRadius() !== 'md') {
      attrs.push(`radius="${this.pgRadius()}"`);
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-select\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly clearableValue = signal<string | null>('dog');

  protected readonly clearableCode = [
    '<dm-select',
    '  label="Pet"',
    '  placeholder="Pick a pet"',
    '  [items]="pets"',
    '  [(value)]="selected"',
    '  [clearable]="true"',
    '/>',
  ].join('\n');

  protected readonly basicCode = [
    '<dm-select label="Pet" placeholder="Pick a pet" [items]="pets" [(value)]="pet" />',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-select variant="${v}" label="${v}" placeholder="Pick one" [items]="pets" />`,
  ).join('\n');

  protected readonly colorsCode = COLORS.map(
    (c) => `<dm-select color="${c}" label="${c}" placeholder="Pick one" [items]="pets" />`,
  ).join('\n');

  protected readonly formsCode = [
    'control = new FormControl<string | null>(null);',
    '',
    '<dm-select label="Pet" placeholder="Pick a pet" [items]="pets" [formControl]="control" />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSelectDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSelectDefaults({ variant: 'bordered' })]",
  ].join('\n');

  // Reactive Forms demo
  protected readonly formControl = new FormControl<string | null>('dog');
  protected readonly formValue = signal<string | null>('dog');
  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formValue.set(v));
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'items', type: 'DmSelectItem<T>[]', default: '[]', description: api['items'] },
      { name: 'value', type: 'model<T | null>', default: 'null', description: api['value'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
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
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      { name: 'clearable', type: 'boolean', default: 'false', description: api['clearable'] },
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear'",
        description: api['clearAriaLabel'],
      },
    ];
  });
}
