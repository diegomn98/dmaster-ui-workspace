import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmButtonComponent, DmSpinnerComponent } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-spinner-page',
  imports: [
    DmSpinnerComponent,
    DmButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './spinner-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.spinner);

  protected readonly playground = signal<PropValues>({
    size: 'md',
    strokeWidth: 2.5,
    label: '',
  });

  protected readonly controls: PropControl[] = [
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
    { key: 'strokeWidth', label: 'strokeWidth', type: 'number', min: 1, max: 6, step: 0.5 },
    { key: 'label', label: 'label', type: 'text', placeholder: 'Loading results' },
  ];

  protected readonly pgSize = computed(() => this.playground()['size'] as string);
  protected readonly pgStroke = computed(() => Number(this.playground()['strokeWidth']) || 2.5);
  protected readonly pgLabel = computed(() => (this.playground()['label'] as string) || '');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgStroke() !== 2.5) {
      attrs.push(`[strokeWidth]="${this.pgStroke()}"`);
    }
    if (this.pgLabel()) {
      attrs.push(`label="${this.pgLabel()}"`);
    }
    return attrs.length > 0 ? `<dm-spinner ${attrs.join(' ')} />` : '<dm-spinner />';
  });

  protected readonly sizesCode = [
    '<dm-spinner size="sm" />',
    '<dm-spinner size="md" />',
    '<dm-spinner size="lg" />',
    '<dm-spinner [size]="40" />',
  ].join('\n');

  protected readonly inButtonCode = [
    '<!-- dm-button lo usa internamente -->',
    '<dm-button state="loading" loadingLabel="Saving…">Save</dm-button>',
    '',
    '<!-- hereda currentColor de cualquier contexto -->',
    '<span style="color: var(--dm-primary)"><dm-spinner /></span>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSpinnerDefaults } from '@dmaster/ui';",
    '',
    'providers: [provideSpinnerDefaults({ strokeWidth: 3 })]',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | number | string",
        default: "'md'",
        description: api['size'],
      },
      { name: 'strokeWidth', type: 'number', default: '2.5', description: api['strokeWidth'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
    ];
  });
}
