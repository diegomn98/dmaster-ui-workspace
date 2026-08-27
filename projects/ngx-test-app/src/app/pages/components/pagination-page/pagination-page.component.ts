import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmBadgeColor,
  DmBadgeComponent,
  DmCardComponent,
  DmPaginationColor,
  DmPaginationComponent,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface DemoArticle {
  id: number;
  title: string;
  excerpt: string;
  tag: string;
  tagColor: DmBadgeColor;
}

const ARTICLE_TOPICS: { title: string; excerpt: string; tag: string; tagColor: DmBadgeColor }[] = [
  {
    title: 'Getting started with signals',
    excerpt: 'Reactive state without zone.js in ten minutes.',
    tag: 'Angular',
    tagColor: 'primary',
  },
  {
    title: 'Designing accessible pagers',
    excerpt: 'Why nav landmarks and aria-current matter.',
    tag: 'A11y',
    tagColor: 'success',
  },
  {
    title: 'Theming with CSS custom properties',
    excerpt: 'Semantic tokens that follow light and dark modes.',
    tag: 'Design',
    tagColor: 'secondary',
  },
  {
    title: 'Server-driven lists with rxResource',
    excerpt: 'Fetch a page at a time and keep the UI responsive.',
    tag: 'Data',
    tagColor: 'warning',
  },
  {
    title: 'Testing components with Vitest',
    excerpt: 'Fast, headless specs for a zoneless library.',
    tag: 'Testing',
    tagColor: 'danger',
  },
  {
    title: 'Container queries in practice',
    excerpt: 'Let components adapt to the space they get.',
    tag: 'CSS',
    tagColor: 'default',
  },
];

const ARTICLES: DemoArticle[] = Array.from({ length: 23 }, (_, i) => {
  const t = ARTICLE_TOPICS[i % ARTICLE_TOPICS.length];
  const round = Math.floor(i / ARTICLE_TOPICS.length);
  return {
    id: i + 1,
    title: round === 0 ? t.title : `${t.title} — part ${round + 1}`,
    excerpt: t.excerpt,
    tag: t.tag,
    tagColor: t.tagColor,
  };
});

const ARTICLE_PAGE_SIZE = 5;

@Component({
  selector: 'app-pagination-page',
  imports: [
    DmPaginationComponent,
    DmCardComponent,
    DmBadgeComponent,
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

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-basic',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-basic.component.html',",
    '})',
    'export class PaginationBasicComponent {',
    '  protected readonly page = signal(1);',
    '}',
  ].join('\n');

  protected readonly windowCode = [
    '<dm-pagination',
    '  [totalPages]="20"',
    '  [siblingCount]="2"',
    '  [boundaryCount]="2"',
    '  [(page)]="page" />',
  ].join('\n');

  protected readonly windowTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-window',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-window.component.html',",
    '})',
    'export class PaginationWindowComponent {',
    '  protected readonly page = signal(8);',
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-pagination size="sm" [totalPages]="8" [(page)]="page" />',
    '<dm-pagination size="md" [totalPages]="8" [(page)]="page" />',
    '<dm-pagination size="lg" [totalPages]="8" [(page)]="page" />',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-sizes',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-sizes.component.html',",
    '})',
    'export class PaginationSizesComponent {',
    '  protected readonly page = signal(2);',
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-pagination color="primary" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="secondary" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="success" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="warning" [totalPages]="6" [(page)]="page" />',
    '<dm-pagination color="danger" [totalPages]="6" [(page)]="page" />',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-colors',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-colors.component.html',",
    '})',
    'export class PaginationColorsComponent {',
    '  protected readonly page = signal(3);',
    '}',
  ].join('\n');

  protected readonly noControlsCode = [
    '<dm-pagination [totalPages]="8" [showControls]="false" [(page)]="page" />',
  ].join('\n');

  protected readonly noControlsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-no-controls',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-no-controls.component.html',",
    '})',
    'export class PaginationNoControlsComponent {',
    '  protected readonly page = signal(2);',
    '}',
  ].join('\n');

  protected readonly disabledCode = [
    '<dm-pagination [totalPages]="8" [disabled]="true" [(page)]="page" />',
  ].join('\n');

  protected readonly disabledTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmPaginationComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pagination-disabled',",
    '  imports: [DmPaginationComponent],',
    "  templateUrl: './pagination-disabled.component.html',",
    '})',
    'export class PaginationDisabledComponent {',
    '  protected readonly page = signal(2);',
    '}',
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

  // ---- Composition: paginated article list ---------------------------------
  protected readonly articles = ARTICLES;
  protected readonly articlePage = signal<number>(1);
  protected readonly articleTotalPages = computed(() =>
    Math.max(1, Math.ceil(this.articles.length / ARTICLE_PAGE_SIZE)),
  );
  protected readonly pagedArticles = computed<DemoArticle[]>(() => {
    const start = (this.articlePage() - 1) * ARTICLE_PAGE_SIZE;
    return this.articles.slice(start, start + ARTICLE_PAGE_SIZE);
  });
  protected readonly articleRangeStart = computed(
    () => (this.articlePage() - 1) * ARTICLE_PAGE_SIZE + 1,
  );
  protected readonly articleRangeEnd = computed(() =>
    Math.min(this.articlePage() * ARTICLE_PAGE_SIZE, this.articles.length),
  );

  protected readonly compositionCode = [
    '<!-- A paginated article list: header with range, 5 rows per page, pager in the footer. -->',
    '<dm-card padding="none" style="max-width: 32rem">',
    '  <header class="articles__head">',
    '    <strong>Articles</strong>',
    '    <span class="muted">Showing {{ rangeStart() }}–{{ rangeEnd() }} of {{ articles.length }}</span>',
    '  </header>',
    '  <ul class="articles">',
    '    @for (a of paged(); track a.id) {',
    '      <li class="articles__row">',
    '        <div>',
    '          <div>{{ a.title }}</div>',
    '          <div class="muted">{{ a.excerpt }}</div>',
    '        </div>',
    '        <dm-badge [color]="a.tagColor" variant="flat" size="sm">{{ a.tag }}</dm-badge>',
    '      </li>',
    '    }',
    '  </ul>',
    '  <footer class="articles__foot">',
    '    <dm-pagination size="sm" [totalPages]="totalPages()" [(page)]="page" />',
    '  </footer>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmBadgeComponent, DmCardComponent, DmPaginationComponent } from '@dmaster/ui';",
    '',
    'const PAGE_SIZE = 5;',
    '',
    '@Component({',
    "  selector: 'app-article-list',",
    '  imports: [DmBadgeComponent, DmCardComponent, DmPaginationComponent],',
    "  templateUrl: './article-list.component.html',",
    '})',
    'export class ArticleListComponent {',
    '  protected readonly articles = [',
    "    { id: 1, title: 'Getting started with signals', excerpt: '…', tag: 'Angular', tagColor: 'primary' },",
    "    { id: 2, title: 'Designing accessible pagers', excerpt: '…', tag: 'A11y', tagColor: 'success' },",
    '    // … 23 items in total',
    '  ];',
    '',
    '  protected readonly page = signal(1);',
    '',
    '  protected readonly totalPages = computed(() =>',
    '    Math.max(1, Math.ceil(this.articles.length / PAGE_SIZE)),',
    '  );',
    '',
    '  protected readonly paged = computed(() => {',
    '    const start = (this.page() - 1) * PAGE_SIZE;',
    '    return this.articles.slice(start, start + PAGE_SIZE);',
    '  });',
    '',
    '  protected readonly rangeStart = computed(() => (this.page() - 1) * PAGE_SIZE + 1);',
    '  protected readonly rangeEnd = computed(() =>',
    '    Math.min(this.page() * PAGE_SIZE, this.articles.length),',
    '  );',
    '}',
  ].join('\n');

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
