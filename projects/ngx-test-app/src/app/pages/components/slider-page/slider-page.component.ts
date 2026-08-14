import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DmSliderColor, DmSliderComponent, DmSliderSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-slider-page',
  imports: [
    DmSliderComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './slider-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.slider);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    size: 'md',
    showValueLabel: true,
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
    { key: 'showValueLabel', label: 'showValueLabel', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmSliderColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSliderSize);
  protected readonly pgShowLabel = computed(() => this.playground()['showValueLabel'] as boolean);
  protected readonly pgValue = signal<number>(40);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgShowLabel()) attrs.push('[showValueLabel]="true"');
    attrs.push('ariaLabel="Volume"');
    attrs.push('[(value)]="volume"');
    return `<dm-slider ${attrs.join(' ')} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<dm-slider',
    '  [(value)]="volume"',
    '  [showValueLabel]="true"',
    '  ariaLabel="Volume"',
    '/>',
  ].join('\n');

  protected readonly marksCode = [
    '<dm-slider',
    '  [(value)]="level"',
    '  [step]="25"',
    '  [marks]="marks"',
    '  ariaLabel="Level"',
    '/>',
    '',
    'protected readonly marks = [',
    "  { value: 0, label: 'Low' },",
    '  { value: 25 },',
    '  { value: 50 },',
    '  { value: 75 },',
    "  { value: 100, label: 'High' },",
    '];',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-slider color="primary" [(value)]="v" ariaLabel="Primary" />',
    '<dm-slider color="secondary" [(value)]="v" ariaLabel="Secondary" />',
    '<dm-slider color="success" [(value)]="v" ariaLabel="Success" />',
    '<dm-slider color="warning" [(value)]="v" ariaLabel="Warning" />',
    '<dm-slider color="danger" [(value)]="v" ariaLabel="Danger" />',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-slider size="sm" [(value)]="v" ariaLabel="Small" />',
    '<dm-slider size="md" [(value)]="v" ariaLabel="Medium" />',
    '<dm-slider size="lg" [(value)]="v" ariaLabel="Large" />',
  ].join('\n');

  protected readonly formsCode = [
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    '',
    'protected readonly price = new FormControl(250, { nonNullable: true });',
    '',
    '<dm-slider [formControl]="price" [max]="1000" [step]="50" ariaLabel="Price" />',
    '<span>value: {{ price.value }}</span>',
  ].join('\n');

  protected readonly formatCode = [
    'protected readonly asCurrency = (v: number) => `$${v}`;',
    '',
    '<dm-slider',
    '  [(value)]="budget"',
    '  [max]="2000"',
    '  [step]="50"',
    '  [showValueLabel]="true"',
    '  [formatValue]="asCurrency"',
    '  ariaLabel="Budget"',
    '/>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSliderDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideSliderDefaults({ color: 'success', size: 'lg', showValueLabel: true }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly volume = signal<number>(60);
  protected readonly level = signal<number>(50);
  protected readonly colorValue = signal<number>(65);
  protected readonly sizeValue = signal<number>(45);
  protected readonly budget = signal<number>(750);
  protected readonly price = new FormControl(250, { nonNullable: true });

  protected readonly demoMarks = [
    { value: 0, label: 'Low' },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100, label: 'High' },
  ];

  protected readonly asCurrency = (v: number) => `$${v}`;

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'number', default: '0', description: api['value'] },
      { name: 'min', type: 'number', default: '0', description: api['min'] },
      { name: 'max', type: 'number', default: '100', description: api['max'] },
      { name: 'step', type: 'number', default: '1', description: api['step'] },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['size'],
      },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      {
        name: 'showValueLabel',
        type: 'boolean',
        default: 'false',
        description: api['showValueLabel'],
      },
      {
        name: 'formatValue',
        type: '(value: number) => string',
        default: 'String',
        description: api['formatValue'],
      },
      {
        name: 'marks',
        type: '{ value: number; label?: string }[] | null',
        default: 'null',
        description: api['marks'],
      },
      { name: 'ariaLabel', type: 'string', default: '—', description: api['ariaLabel'] },
    ];
  });
}
