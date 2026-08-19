import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmButtonComponent,
  DmCardComponent,
  DmPaginatedSelectColor,
  DmPaginatedSelectComponent,
  DmPaginatedSelectItem,
  DmPaginatedSelectLoadFn,
  DmPaginatedSelectRadius,
  DmPaginatedSelectVariant,
  DmSize,
} from '@dmaster/ui';
import { delay, of } from 'rxjs';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** Simulated remote dataset — 87 users, matched against the search string. */
const ALL_USERS: DmPaginatedSelectItem<string>[] = Array.from({ length: 87 }, (_, i) => {
  const first = ['Ada', 'Alan', 'Grace', 'Linus', 'Barbara', 'Donald', 'Rich', 'Ken', 'Bjarne'][
    i % 9
  ];
  const last = ['Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Liskov', 'Knuth', 'Stevens'][i % 7];
  return {
    value: `u-${i + 1}`,
    label: `${first} ${last} #${i + 1}`,
    description: `user-${(i + 1).toString().padStart(3, '0')}@example.com`,
  };
});

/** Self-contained colored avatar (data URI) — initials on a flat fill. */
function avatarSvg(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${color}"/><text x="24" y="30" font-family="system-ui, sans-serif" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const ROLES = ['Frontend engineer', 'Backend engineer', 'Tech lead', 'Product designer'];

interface DemoReviewer {
  name: string;
  role: string;
  src: string;
}

/** Derives a display profile (name, role, avatar) from a mock user id (`u-N`). */
function toReviewer(item: DmPaginatedSelectItem<string>): DemoReviewer {
  const index = Number(item.value.slice(2)) - 1;
  const name = item.label.replace(/\s#\d+$/, '');
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return {
    name,
    role: ROLES[index % ROLES.length],
    src: avatarSvg(initials, AVATAR_COLORS[index % AVATAR_COLORS.length]),
  };
}

const VARIANTS: DmPaginatedSelectVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmPaginatedSelectColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

@Component({
  selector: 'app-paginated-select-page',
  imports: [
    DmPaginatedSelectComponent,
    DmAvatarComponent,
    DmButtonComponent,
    DmCardComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './paginated-select-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatedSelectPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.paginatedSelect);
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;

  // ---- Shared loadFn (used by all demo instances) --------------------------
  protected readonly loadFn: DmPaginatedSelectLoadFn<string> = ({ page, pageSize, query }) => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? ALL_USERS.filter(
          (u) => u.label.toLowerCase().includes(q) || u.description?.toLowerCase().includes(q),
        )
      : ALL_USERS;
    const start = page * pageSize;
    const items = matched.slice(start, start + pageSize);
    return of({ items, total: matched.length }).pipe(delay(400));
  };

  // ---- Playground values ---------------------------------------------------
  protected readonly playgroundValue = signal<string | null>(null);

  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    searchable: true,
    loadMoreMode: 'infinite',
    disabled: false,
  });

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
    {
      key: 'loadMoreMode',
      label: 'loadMoreMode',
      type: 'select',
      options: ['infinite', 'button'].map((v) => ({ label: v, value: v })),
    },
    { key: 'searchable', label: 'searchable', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmPaginatedSelectColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmPaginatedSelectVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(
    () => this.playground()['radius'] as DmPaginatedSelectRadius,
  );
  protected readonly pgLoadMoreMode = computed(
    () => this.playground()['loadMoreMode'] as 'infinite' | 'button',
  );
  protected readonly pgSearchable = computed(() => this.playground()['searchable'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [
      'label="Assignee"',
      'placeholder="Pick a user"',
      '[loadFn]="loadFn"',
      '[(value)]="value"',
    ];
    if (this.pgLoadMoreMode() !== 'infinite') {
      attrs.push(`loadMoreMode="${this.pgLoadMoreMode()}"`);
    }
    if (this.pgSearchable()) {
      attrs.push('[searchable]="true"');
    }
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
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    return `<dm-paginated-select\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demo values ---------------------------------------------------------
  protected readonly buttonValue = signal<string | null>(null);
  protected readonly searchValue = signal<string | null>(null);
  protected readonly clearableValue = signal<string | null>(null);

  // ---- Composition: assign reviewer ----------------------------------------
  protected readonly reviewerValue = signal<string | null>(null);
  protected readonly reviewer = computed<DemoReviewer | null>(() => {
    const value = this.reviewerValue();
    const item = value ? ALL_USERS.find((u) => u.value === value) : undefined;
    return item ? toReviewer(item) : null;
  });

  // ---- Code snippets -------------------------------------------------------
  protected readonly loadFnCode = [
    '// Works directly with HttpClient — no wrappers needed.',
    'loadFn: DmPaginatedSelectLoadFn<User> = ({ page, pageSize, query }) =>',
    "  this.http.get<{ data: User[]; total: number }>('/api/users', {",
    '    params: { page, pageSize, query },',
    '  }).pipe(',
    '    map(res => ({ items: res.data.map(toItem), total: res.total })),',
    '  );',
  ].join('\n');

  protected readonly infiniteCode = [
    '<dm-paginated-select',
    '  label="Assignee"',
    '  [loadFn]="loadFn"',
    '  [searchable]="true"',
    '  [(value)]="userId"',
    '/>',
  ].join('\n');

  protected readonly buttonCode = [
    '<dm-paginated-select',
    '  loadMoreMode="button"',
    '  [loadFn]="loadFn"',
    '  [(value)]="userId"',
    '/>',
  ].join('\n');

  protected readonly clearableCode = [
    '<dm-paginated-select',
    '  [loadFn]="loadFn"',
    '  [(value)]="userId"',
    '  [clearable]="true"',
    '  [searchable]="true"',
    '/>',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- Assign reviewer: server-driven select + live preview + gated action. -->',
    '<dm-card style="max-width: 26rem">',
    '  <div style="display: flex; flex-direction: column; gap: 1rem">',
    '    <div>',
    '      <strong>Assign reviewer</strong>',
    '      <p class="muted">Pick a teammate to review this pull request.</p>',
    '    </div>',
    '',
    '    <dm-paginated-select',
    '      label="Reviewer"',
    '      placeholder="Pick a user"',
    '      [loadFn]="loadFn"',
    '      [(value)]="reviewerId"',
    '      [searchable]="true"',
    '      [clearable]="true"',
    '    />',
    '',
    '    <div class="reviewer-row">',
    '      @if (reviewer(); as user) {',
    '        <dm-avatar [src]="user.avatar" [alt]="user.name" />',
    '        <div style="flex: 1; min-width: 0">',
    '          <strong>{{ user.name }}</strong>',
    '          <span class="muted">{{ user.role }}</span>',
    '        </div>',
    '      } @else {',
    '        <span class="muted">No reviewer selected yet</span>',
    '      }',
    '    </div>',
    '',
    '    <div style="display: flex; justify-content: flex-end">',
    '      <dm-button color="primary" [disabled]="!reviewer()" (click)="assign()">',
    '        Assign',
    '      </dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, inject, signal } from '@angular/core';",
    "import { HttpClient } from '@angular/common/http';",
    "import { map } from 'rxjs';",
    'import {',
    '  DmAvatarComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmPaginatedSelectComponent,',
    '  DmPaginatedSelectLoadFn,',
    "} from '@dmaster/ui';",
    '',
    'interface User { id: string; name: string; role: string; avatar: string; }',
    '',
    '@Component({',
    "  selector: 'app-assign-reviewer',",
    '  imports: [',
    '    DmAvatarComponent,',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmPaginatedSelectComponent,',
    '  ],',
    "  templateUrl: './assign-reviewer.component.html',",
    '})',
    'export class AssignReviewerComponent {',
    '  private readonly http = inject(HttpClient);',
    '  /** Cache of every user seen so far — the picked one may live on any page. */',
    '  private readonly seen = new Map<string, User>();',
    '',
    '  protected readonly reviewerId = signal<string | null>(null);',
    '  protected readonly reviewer = computed(() => {',
    '    const id = this.reviewerId();',
    '    return id ? (this.seen.get(id) ?? null) : null;',
    '  });',
    '',
    '  protected readonly loadFn: DmPaginatedSelectLoadFn<string> = ({ page, pageSize, query }) =>',
    "    this.http.get<{ data: User[]; total: number }>('/api/users', {",
    '      params: { page, pageSize, query },',
    '    }).pipe(',
    '      map((res) => {',
    '        res.data.forEach((u) => this.seen.set(u.id, u));',
    '        return {',
    '          items: res.data.map((u) => ({ value: u.id, label: u.name, description: u.role })),',
    '          total: res.total,',
    '        };',
    '      }),',
    '    );',
    '',
    '  protected assign(): void {',
    "    this.http.post('/api/pull-requests/42/reviewers', { userId: this.reviewerId() }).subscribe();",
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { providePaginatedSelectDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  providePaginatedSelectDefaults({ variant: 'bordered', pageSize: 10 })",
    ']',
  ].join('\n');

  // ---- API table -----------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'loadFn',
        type: 'DmPaginatedSelectLoadFn<T>',
        default: '—',
        description: api['loadFn'],
      },
      { name: 'pageSize', type: 'number', default: '20', description: api['pageSize'] },
      { name: 'value', type: 'model<T | null>', default: 'null', description: api['value'] },
      {
        name: 'selectedItem',
        type: 'DmPaginatedSelectItem<T> | null',
        default: 'null',
        description: api['selectedItem'],
      },
      { name: 'searchable', type: 'boolean', default: 'false', description: api['searchable'] },
      {
        name: 'searchPlaceholder',
        type: 'string',
        default: "'Search…'",
        description: api['searchPlaceholder'],
      },
      {
        name: 'searchDebounceMs',
        type: 'number',
        default: '250',
        description: api['searchDebounceMs'],
      },
      {
        name: 'loadMoreMode',
        type: "'infinite' | 'button'",
        default: "'infinite'",
        description: api['loadMoreMode'],
      },
      {
        name: 'loadMoreLabel',
        type: 'string',
        default: "'Load more'",
        description: api['loadMoreLabel'],
      },
      {
        name: 'loadingLabel',
        type: 'string',
        default: "'Loading…'",
        description: api['loadingLabel'],
      },
      {
        name: 'emptyLabel',
        type: 'string',
        default: "'No results'",
        description: api['emptyLabel'],
      },
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
      { name: 'clearable', type: 'boolean', default: 'false', description: api['clearable'] },
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear'",
        description: api['clearAriaLabel'],
      },
    ];
  });
}
