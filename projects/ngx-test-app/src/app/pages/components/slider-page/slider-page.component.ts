import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmCardComponent,
  DmIconComponent,
  DmSliderColor,
  DmSliderComponent,
  DmSliderSize,
} from '@dmaster/ui';

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
    DmCardComponent,
    DmIconComponent,
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

  // Composition — settings panel card. Each row is a signal-driven slider with a
  // leading icon, muted description and a right-aligned live readout.
  protected readonly brightness = signal<number>(72);
  protected readonly notifVolume = signal<number>(45);
  protected readonly textSize = signal<number>(16);

  protected readonly settingRows = computed(() => {
    const labels = this.page().labels;
    return [
      {
        key: 'brightness' as const,
        icon: 'sun',
        label: labels['brightness'],
        description: labels['brightnessDesc'],
        min: 0,
        max: 100,
        step: 1,
        value: this.brightness(),
        display: `${this.brightness()}%`,
      },
      {
        key: 'notifVolume' as const,
        icon: 'bell',
        label: labels['notifVolume'],
        description: labels['notifVolumeDesc'],
        min: 0,
        max: 100,
        step: 5,
        value: this.notifVolume(),
        display: `${this.notifVolume()}%`,
      },
      {
        key: 'textSize' as const,
        icon: 'eye',
        label: labels['textSize'],
        description: labels['textSizeDesc'],
        min: 12,
        max: 24,
        step: 1,
        value: this.textSize(),
        display: `${this.textSize()}px`,
      },
    ];
  });

  protected setSetting(key: 'brightness' | 'notifVolume' | 'textSize', value: number): void {
    this[key].set(value);
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem">',
    '    <span class="settings-tile"><dm-icon name="zap" size="1.25rem" /></span>',
    '    <div>',
    '      <strong>Quick settings</strong>',
    '      <p style="margin: 0.1rem 0 0; color: var(--dm-fg-muted)">Changes apply instantly</p>',
    '    </div>',
    '  </div>',
    '',
    '  <div style="display: grid; gap: 1.25rem">',
    '    @for (row of rows(); track row.key) {',
    '      <div style="display: grid; gap: 0.5rem">',
    '        <div style="display: flex; align-items: center; gap: 0.625rem">',
    '          <dm-icon [name]="row.icon" size="1.125rem" style="color: var(--dm-fg-muted)" />',
    '          <div style="flex: 1; min-width: 0">',
    '            <span style="display: block; font-weight: 500">{{ row.label }}</span>',
    '            <span style="color: var(--dm-fg-muted); font-size: 0.8125rem">{{ row.description }}</span>',
    '          </div>',
    '          <span style="font-variant-numeric: tabular-nums; font-weight: 600; color: var(--dm-primary)">',
    '            {{ row.display }}',
    '          </span>',
    '        </div>',
    '        <dm-slider',
    '          size="sm"',
    '          [min]="row.min"',
    '          [max]="row.max"',
    '          [step]="row.step"',
    '          [value]="row.value"',
    '          (valueChange)="set(row.key, $event)"',
    '          [ariaLabel]="row.label"',
    '        />',
    '      </div>',
    '    }',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmCardComponent, DmIconComponent, DmSliderComponent } from '@dmaster/ui';",
    '',
    "type SettingKey = 'brightness' | 'volume' | 'textSize';",
    '',
    '@Component({',
    "  selector: 'app-quick-settings',",
    '  imports: [DmCardComponent, DmSliderComponent, DmIconComponent],',
    "  templateUrl: './quick-settings.component.html',",
    '})',
    'export class QuickSettingsComponent {',
    '  protected readonly brightness = signal(72);',
    '  protected readonly volume = signal(45);',
    '  protected readonly textSize = signal(16);',
    '',
    '  protected readonly rows = computed(() => [',
    "    { key: 'brightness' as const, icon: 'sun', label: 'Brightness',",
    "      description: 'Screen brightness', min: 0, max: 100, step: 1,",
    '      value: this.brightness(), display: `${this.brightness()}%` },',
    "    { key: 'volume' as const, icon: 'bell', label: 'Notifications',",
    "      description: 'Alert volume', min: 0, max: 100, step: 5,",
    '      value: this.volume(), display: `${this.volume()}%` },',
    "    { key: 'textSize' as const, icon: 'eye', label: 'Text size',",
    "      description: 'Base font size', min: 12, max: 24, step: 1,",
    '      value: this.textSize(), display: `${this.textSize()}px` },',
    '  ]);',
    '',
    '  protected set(key: SettingKey, value: number): void {',
    '    this[key].set(value);',
    '  }',
    '}',
  ].join('\n');

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
