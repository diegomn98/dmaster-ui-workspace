import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmColorPickerColor,
  DmColorPickerComponent,
  DmColorPickerRadius,
  DmColorPickerVariant,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const VARIANTS: DmColorPickerVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmColorPickerColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

const BRAND_SWATCHES = [
  '#338ef7',
  '#7828c8',
  '#17c964',
  '#f5a524',
  '#f31260',
  '#06b6d4',
  '#111827',
  '#f4f4f5',
];

@Component({
  selector: 'app-color-picker-page',
  imports: [
    DmColorPickerComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './color-picker-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorPickerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.colorPicker);
  protected readonly brandSwatches = BRAND_SWATCHES;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    showAlpha: false,
    clearable: true,
    disabled: false,
    required: false,
  });
  protected readonly playgroundValue = signal<string | null>('#338ef7');

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
    { key: 'showAlpha', label: 'showAlpha', type: 'boolean' },
    { key: 'clearable', label: 'clearable', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmColorPickerColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmColorPickerVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmColorPickerRadius);
  protected readonly pgShowAlpha = computed(() => this.playground()['showAlpha'] === true);
  protected readonly pgClearable = computed(() => this.playground()['clearable'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['label="Brand color"', '[(value)]="color"'];
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
    if (this.pgShowAlpha()) {
      attrs.push('[showAlpha]="true"');
    }
    if (this.pgClearable()) {
      attrs.push('[clearable]="true"');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-color-picker\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicValue = signal<string | null>('#7828c8');
  protected readonly alphaValue = signal<string | null>('#338ef7cc');
  protected readonly swatchesValue = signal<string | null>('#17c964');
  protected readonly formControl = new FormControl<string | null>('#f31260');
  protected readonly formValue = computed(() => this.formControlValue());
  private readonly formControlValue = signal<string | null>('#f31260');

  protected readonly basicCode =
    '<dm-color-picker label="Brand color" [(value)]="color" [clearable]="true" />';
  protected readonly alphaCode =
    '<dm-color-picker label="Overlay" [(value)]="color" [showAlpha]="true" />';
  protected readonly swatchesCode = [
    "swatches = ['#338ef7', '#7828c8', '#17c964', '#f5a524', '#f31260'];",
    '',
    '<dm-color-picker label="Accent" [(value)]="color" [swatches]="swatches" />',
  ].join('\n');
  protected readonly sizesCode = ['sm', 'md', 'lg']
    .map((s) => `<dm-color-picker size="${s}" label="${s}" />`)
    .join('\n');
  protected readonly formsCode = [
    'control = new FormControl<string | null>("#f31260");',
    '',
    '<dm-color-picker label="Color" [formControl]="control" />',
  ].join('\n');
  protected readonly defaultsCode = [
    "import { provideColorPickerDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideColorPickerDefaults({ showAlpha: true, variant: 'bordered' })",
    ']',
  ].join('\n');

  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formControlValue.set(v ?? null));
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'model<string | null>', default: 'null', description: api['value'] },
      { name: 'showAlpha', type: 'boolean', default: 'false', description: api['showAlpha'] },
      { name: 'swatches', type: 'string[]', default: '(palette)', description: api['swatches'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'clearable', type: 'boolean', default: 'false', description: api['clearable'] },
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
    ];
  });
}
