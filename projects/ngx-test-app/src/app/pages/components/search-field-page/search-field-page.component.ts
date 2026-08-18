import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmSearchFieldColor,
  DmSearchFieldComponent,
  DmSearchFieldRadius,
  DmSearchFieldVariant,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const VARIANTS: DmSearchFieldVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmSearchFieldColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

@Component({
  selector: 'app-search-field-page',
  imports: [
    DmSearchFieldComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './search-field-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.searchField);
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    clearable: true,
    disabled: false,
    required: false,
  });

  protected readonly playgroundValue = signal<string>('');

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
    { key: 'clearable', label: 'clearable', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmSearchFieldColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmSearchFieldVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmSearchFieldRadius);
  protected readonly pgClearable = computed(() => this.playground()['clearable'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['label="Search"', 'placeholder="Search…"', '[(value)]="query"'];
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
    if (!this.pgClearable()) {
      attrs.push('[clearable]="false"');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-search-field\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicCode = [
    '<dm-search-field label="Search" placeholder="Search…" [(value)]="query" />',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-search-field variant="${v}" [label]="'${v}'" placeholder="Search…" />`,
  ).join('\n');

  protected readonly colorsCode = COLORS.map(
    (c) => `<dm-search-field color="${c}" [label]="'${c}'" value="query" />`,
  ).join('\n');

  protected readonly sizesCode = ['sm', 'md', 'lg']
    .map((s) => `<dm-search-field size="${s}" placeholder="Search…" />`)
    .join('\n');

  protected readonly eventsCode = [
    '<dm-search-field',
    '  label="Search"',
    '  placeholder="Type and press Enter…"',
    '  [(value)]="query"',
    '  (searchSubmit)="onSubmit($event)"',
    '  (cleared)="onCleared()"',
    '/>',
  ].join('\n');

  protected readonly formsCode = [
    'control = new FormControl("", { nonNullable: true });',
    '',
    '<dm-search-field label="Search" placeholder="Search…" [formControl]="control" />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSearchFieldDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSearchFieldDefaults({ variant: 'bordered', radius: 'md' })]",
  ].join('\n');

  // Controlled + events demo state
  protected readonly eventsValue = signal<string>('');
  protected readonly lastEvent = signal<string>('—');

  protected onSubmit(value: string): void {
    this.lastEvent.set(`search: "${value}"`);
  }

  protected onCleared(): void {
    this.lastEvent.set('cleared');
  }

  // Reactive Forms demo
  protected readonly formControl = new FormControl<string>('components', { nonNullable: true });
  protected readonly formValue = signal<string>('components');
  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formValue.set(v ?? ''));
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'model<string>', default: "''", description: api['value'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'readOnly', type: 'boolean', default: 'false', description: api['readOnly'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'clearable', type: 'boolean', default: 'true', description: api['clearable'] },
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
      { name: 'name', type: 'string', default: "''", description: api['name'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear search'",
        description: api['clearAriaLabel'],
      },
      {
        name: 'searchSubmit',
        type: 'output<string>',
        default: '—',
        description: api['search'],
      },
      { name: 'cleared', type: 'output<void>', default: '—', description: api['cleared'] },
    ];
  });
}
