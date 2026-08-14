import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmPaginationColor, DmPaginationComponent, DmSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-pagination-page',
  imports: [
    DmPaginationComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './pagination-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.pagination);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    size: 'md',
    siblingCount: 1,
    showControls: true,
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
    { key: 'siblingCount', label: 'siblingCount', type: 'number', min: 0, max: 3, step: 1 },
    { key: 'showControls', label: 'showControls', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmPaginationColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgSiblings = computed(() => Number(this.playground()['siblingCount']));
  protected readonly pgShowControls = computed(() => this.playground()['showControls'] as boolean);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] as boolean);
  protected readonly pgPage = signal<number>(5);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['[totalPages]="10"'];
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgSiblings() !== 1) attrs.push(`[siblingCount]="${this.pgSiblings()}"`);
    if (!this.pgShowControls()) attrs.push('[showControls]="false"');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    attrs.push('[(page)]="page"');
    return `<dm-pagination ${attrs.join(' ')} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<dm-pagination [totalPages]="10" [(page)]="page" />',
    '<span>Page {{ page() }}</span>',
  ].join('\n');

  protected readonly windowCode = [
    '<dm-pagination',
    '  [totalPages]="20"',
    '  [siblingCount]="2"',
    '  [boundaryCount]="2"',
    '  [(page)]="page" />',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-pagination size="sm" [totalPages]="8" [(page)]="page" />',
    '<dm-pagination size="md" [totalPages]="8" [(page)]="page" />',
    '<dm-pagination size="lg" [totalPages]="8" [(page)]="page" />',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-pagination color="primary" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="secondary" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="success" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="warning" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="danger" [totalPages]="6" [(page)]="page" />',
  ].join('\n');

  protected readonly noControlsCode = [
    '<dm-pagination [totalPages]="8" [showControls]="false" [(page)]="page" />',
  ].join('\n');

  protected readonly disabledCode = [
    '<dm-pagination [totalPages]="8" [disabled]="true" [(page)]="page" />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { providePaginationDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    '  providePaginationDefaults({',
    "    ariaLabel: 'Paginación',",
    "    prevLabel: 'Página anterior',",
    "    nextLabel: 'Página siguiente',",
    '    pageAriaLabel: (page) => `Página ${page}`,',
    '  }),',
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly basicPage = signal<number>(1);
  protected readonly windowPage = signal<number>(8);
  protected readonly sizePage = signal<number>(2);
  protected readonly colorPage = signal<number>(3);
  protected readonly noControlsPage = signal<number>(2);
  protected readonly disabledPage = signal<number>(2);

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'page', type: 'number', default: '1', description: api['page'] },
      {
        name: 'totalPages',
        type: 'number',
        default: '— (required)',
        description: api['totalPages'],
      },
      { name: 'siblingCount', type: 'number', default: '1', description: api['siblingCount'] },
      { name: 'boundaryCount', type: 'number', default: '1', description: api['boundaryCount'] },
      { name: 'showControls', type: 'boolean', default: 'true', description: api['showControls'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "'Pagination'",
        description: api['ariaLabel'],
      },
      {
        name: 'prevLabel',
        type: 'string',
        default: "'Previous page'",
        description: api['prevLabel'],
      },
      { name: 'nextLabel', type: 'string', default: "'Next page'", description: api['nextLabel'] },
      {
        name: 'pageAriaLabel',
        type: '(page: number) => string',
        default: '`Page ${page}`',
        description: api['pageAriaLabel'],
      },
      {
        name: 'pageChange',
        type: 'OutputEmitterRef<number>',
        default: '—',
        description: api['pageChange'],
      },
    ];
  });
}
