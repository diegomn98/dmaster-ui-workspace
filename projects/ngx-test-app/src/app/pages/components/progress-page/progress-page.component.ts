import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmProgressColor, DmProgressComponent, DmProgressSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-progress-page',
  imports: [
    DmProgressComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './progress-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.progress);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    size: 'md',
    showValueLabel: true,
    striped: false,
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
    { key: 'striped', label: 'striped', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmProgressColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmProgressSize);
  protected readonly pgShowLabel = computed(() => this.playground()['showValueLabel'] as boolean);
  protected readonly pgStriped = computed(() => this.playground()['striped'] as boolean);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['[value]="64"', 'label="Uploading"'];
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgShowLabel()) attrs.push('[showValueLabel]="true"');
    if (this.pgStriped()) attrs.push('[striped]="true"');
    return `<dm-progress ${attrs.join(' ')} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<dm-progress [value]="64" label="Uploading assets" [showValueLabel]="true" />',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-progress [value]="40" color="primary" />',
    '<dm-progress [value]="55" color="secondary" />',
    '<dm-progress [value]="70" color="success" />',
    '<dm-progress [value]="60" color="warning" />',
    '<dm-progress [value]="35" color="danger" />',
    '<dm-progress [value]="50" color="default" />',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-progress [value]="60" size="sm" />',
    '<dm-progress [value]="60" size="md" />',
    '<dm-progress [value]="60" size="lg" />',
  ].join('\n');

  protected readonly indeterminateCode = [
    '<!-- Omit value (or pass null) to render the indeterminate sweep -->',
    '<dm-progress label="Syncing" ariaLabel="Syncing your library" />',
  ].join('\n');

  protected readonly stripedCode = [
    '<dm-progress [value]="70" color="warning" [striped]="true" [showValueLabel]="true" />',
  ].join('\n');

  protected readonly formatCode = [
    'protected readonly gbFormat = (value: number, max: number): string =>',
    '  `${value} GB of ${max} GB`;',
    '',
    '<dm-progress',
    '  [value]="48"',
    '  [max]="64"',
    '  label="Storage"',
    '  [showValueLabel]="true"',
    '  [formatValue]="gbFormat"',
    '/>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideProgressDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideProgressDefaults({ color: 'success', size: 'lg' }),",
    ']',
  ].join('\n');

  protected readonly gbFormat = (value: number, max: number): string => `${value} GB of ${max} GB`;

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'number | null', default: 'null', description: api['value'] },
      { name: 'max', type: 'number', default: '100', description: api['max'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      {
        name: 'showValueLabel',
        type: 'boolean',
        default: 'false',
        description: api['showValueLabel'],
      },
      {
        name: 'formatValue',
        type: '(value: number, max: number) => string',
        default: 'percentage',
        description: api['formatValue'],
      },
      { name: 'striped', type: 'boolean', default: 'false', description: api['striped'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
