import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
  DmProgressColor,
  DmProgressComponent,
  DmProgressSize,
} from '@dmaster/ui';

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
    DmCardComponent,
    DmButtonComponent,
    DmIconComponent,
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

  // Composition — live "uploading a file" card. Drives the bar with a signal
  // ticked by a browser-only timer (afterNextRender never runs during prerender,
  // so the SSR pass stays static and window is never touched).
  protected readonly uploadPct = signal(0);
  protected readonly uploadDone = computed(() => this.uploadPct() >= 100);
  protected readonly uploadColor = computed<DmProgressColor>(() =>
    this.uploadDone() ? 'success' : 'primary',
  );

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 24rem">',
    '  <div style="display: flex; align-items: center; gap: 0.875rem">',
    '    <span class="file-tile"><dm-icon name="upload" size="1.25rem" /></span>',
    '    <div style="flex: 1; min-width: 0">',
    '      <strong>annual-report-2026.pdf</strong>',
    '      <p style="margin: 0.1rem 0 0; color: var(--dm-fg-muted)">12.4 MB</p>',
    '    </div>',
    '    @if (!done()) {',
    '      <dm-button size="sm" variant="light" color="default"',
    '        aria-label="Cancel upload" (click)="cancel()">',
    '        <dm-icon name="x" size="1.1rem" />',
    '      </dm-button>',
    '    } @else {',
    '      <dm-icon name="check-circle" size="1.4rem" style="color: var(--dm-success)" />',
    '    }',
    '  </div>',
    '',
    '  <dm-progress',
    '    style="margin-top: 1rem"',
    '    [value]="progress()"',
    "    [color]=\"done() ? 'success' : 'primary'\"",
    "    [ariaLabel]=\"done() ? 'Upload complete' : 'Uploading annual-report-2026.pdf'\"",
    '  />',
    '',
    '  <div style="display: flex; justify-content: space-between; margin-top: 0.55rem">',
    '    <span style="color: var(--dm-fg-muted)">',
    "      {{ done() ? 'Upload complete' : 'Uploading…' }}",
    '    </span>',
    '    <span style="font-variant-numeric: tabular-nums">{{ progress() }}%</span>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { afterNextRender, Component, computed, signal } from '@angular/core';",
    "import { DmButtonComponent, DmCardComponent, DmIconComponent, DmProgressComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-upload-card',",
    '  imports: [DmCardComponent, DmProgressComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './upload-card.component.html',",
    '})',
    'export class UploadCardComponent {',
    '  protected readonly progress = signal(0);',
    '  protected readonly done = computed(() => this.progress() >= 100);',
    '',
    '  private timer?: ReturnType<typeof setInterval>;',
    '',
    '  constructor() {',
    '    // afterNextRender only runs in the browser — the prerender stays static.',
    '    afterNextRender(() => {',
    '      this.timer = setInterval(() => {',
    '        this.progress.update((p) => (p >= 100 ? 0 : Math.min(p + 4, 100)));',
    '      }, 450);',
    '    });',
    '  }',
    '',
    '  protected cancel(): void {',
    '    clearInterval(this.timer);',
    '    this.progress.set(0);',
    '  }',
    '}',
  ].join('\n');

  constructor() {
    // Loop the demo bar so the page always shows motion (browser only).
    afterNextRender(() => {
      setInterval(() => {
        this.uploadPct.update((p) => (p >= 100 ? 0 : Math.min(p + 4, 100)));
      }, 450);
    });
  }

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
