import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmButtonComponent, DmCardComponent, DmSpinnerComponent } from '@dmaster/ui';

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
    DmCardComponent,
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

  protected readonly colorsCode = [
    '<!-- The spinner draws with currentColor, so it takes the color -->',
    '<!-- of whatever wraps it. No color input needed. -->',
    '<dm-spinner />                                        <!-- inherits text color -->',
    '<span style="color: var(--dm-primary)"><dm-spinner /></span>',
    '<span style="color: var(--dm-success)"><dm-spinner /></span>',
    '<span style="color: var(--dm-warning)"><dm-spinner /></span>',
    '<span style="color: var(--dm-danger)"><dm-spinner /></span>',
  ].join('\n');

  protected readonly strokeCode = [
    '<dm-spinner [strokeWidth]="1.5" size="lg" />   <!-- hairline -->',
    '<dm-spinner [strokeWidth]="2.5" size="lg" />   <!-- default -->',
    '<dm-spinner [strokeWidth]="4" size="lg" />     <!-- bold -->',
  ].join('\n');

  protected readonly withLabelCode = [
    '<!-- A visible label promotes it to role="status" + aria-label, -->',
    '<!-- so assistive tech announces the loading state. -->',
    '<div style="display: flex; align-items: center; gap: 0.625rem">',
    '  <dm-spinner label="Loading results" />',
    '  <span>Loading results…</span>',
    '</div>',
  ].join('\n');

  protected readonly inButtonCode = [
    '<!-- dm-button drives one internally through its loading state -->',
    '<dm-button state="loading" loadingLabel="Saving…">Save</dm-button>',
    '',
    '<!-- Or inline in a sentence — it flows with the text baseline -->',
    '<p>Syncing your files <dm-spinner size="sm" />…</p>',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- The canonical "panel is fetching" placeholder: a centered',
    '     spinner + message inside a card, swapped for content once ready. -->',
    '<dm-card style="width: 100%; max-width: 22rem">',
    '  <div style="display: grid; gap: 0.75rem; justify-items: center;',
    '              padding: 2rem 0; text-align: center">',
    '    <dm-spinner size="lg" label="Loading workspace" />',
    '    <p style="margin: 0; color: var(--dm-fg-muted)">Loading your workspace…</p>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmCardComponent, DmSpinnerComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-workspace',",
    '  imports: [DmCardComponent, DmSpinnerComponent],',
    '  template: `',
    '    @if (loading()) {',
    '      <dm-card>',
    '        <dm-spinner size="lg" label="Loading workspace" />',
    '        <p>Loading your workspace…</p>',
    '      </dm-card>',
    '    } @else {',
    '      <!-- real content -->',
    '    }',
    '  `,',
    '})',
    'export class WorkspaceComponent {',
    '  protected readonly loading = signal(true);',
    '',
    '  constructor() {',
    '    // flip to false once your data resolves',
    "    fetch('/api/workspace').then(() => this.loading.set(false));",
    '  }',
    '}',
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
