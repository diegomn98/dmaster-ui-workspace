import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
  DmTableCellDirective,
  DmTableColumn,
  DmTableComponent,
  DmTableDensity,
  DmTableKey,
  DmTableSelectionMode,
  DmTableVariant,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Away' | 'Invited';
  joined: string;
}

const MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@dmaster.io',
    role: 'Owner',
    status: 'Active',
    joined: '2019-04-01',
  },
  {
    id: 2,
    name: 'Alan Turing',
    email: 'alan@dmaster.io',
    role: 'Admin',
    status: 'Active',
    joined: '2020-01-14',
  },
  {
    id: 3,
    name: 'Grace Hopper',
    email: 'grace@dmaster.io',
    role: 'Editor',
    status: 'Away',
    joined: '2020-08-22',
  },
  {
    id: 4,
    name: 'Katherine Johnson',
    email: 'katherine@dmaster.io',
    role: 'Editor',
    status: 'Active',
    joined: '2021-03-05',
  },
  {
    id: 5,
    name: 'Linus Torvalds',
    email: 'linus@dmaster.io',
    role: 'Viewer',
    status: 'Invited',
    joined: '2022-11-30',
  },
  {
    id: 6,
    name: 'Margaret Hamilton',
    email: 'margaret@dmaster.io',
    role: 'Admin',
    status: 'Active',
    joined: '2019-09-17',
  },
  {
    id: 7,
    name: 'Dennis Ritchie',
    email: 'dennis@dmaster.io',
    role: 'Editor',
    status: 'Away',
    joined: '2021-06-11',
  },
  {
    id: 8,
    name: 'Barbara Liskov',
    email: 'barbara@dmaster.io',
    role: 'Viewer',
    status: 'Active',
    joined: '2023-02-08',
  },
  {
    id: 9,
    name: 'Tim Berners-Lee',
    email: 'tim@dmaster.io',
    role: 'Editor',
    status: 'Invited',
    joined: '2022-05-19',
  },
  {
    id: 10,
    name: 'Donald Knuth',
    email: 'donald@dmaster.io',
    role: 'Owner',
    status: 'Active',
    joined: '2018-12-03',
  },
  {
    id: 11,
    name: 'Radia Perlman',
    email: 'radia@dmaster.io',
    role: 'Admin',
    status: 'Away',
    joined: '2020-07-27',
  },
  {
    id: 12,
    name: 'Vint Cerf',
    email: 'vint@dmaster.io',
    role: 'Viewer',
    status: 'Active',
    joined: '2021-10-14',
  },
];

const FIRST_NAMES = [
  'Ada',
  'Alan',
  'Grace',
  'Katherine',
  'Linus',
  'Margaret',
  'Dennis',
  'Barbara',
  'Tim',
  'Donald',
  'Radia',
  'Vint',
];
const LAST_NAMES = [
  'Lovelace',
  'Turing',
  'Hopper',
  'Johnson',
  'Torvalds',
  'Hamilton',
  'Ritchie',
  'Liskov',
  'Berners-Lee',
  'Knuth',
  'Perlman',
  'Cerf',
];
const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const STATUSES: Member['status'][] = ['Active', 'Away', 'Invited'];

/** Deterministically synthesize a large dataset for the virtual-scroll demo. */
function generateMembers(count: number): Member[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7) % LAST_NAMES.length];
    const n = i + 1;
    return {
      id: n,
      name: `${first} ${last} #${n}`,
      email: `${first.toLowerCase()}.${n}@dmaster.io`,
      role: ROLES[i % ROLES.length],
      status: STATUSES[i % STATUSES.length],
      joined: `20${18 + (i % 8)}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
    };
  });
}

@Component({
  selector: 'app-table-page',
  imports: [
    DmTableComponent,
    DmTableCellDirective,
    DmButtonComponent,
    DmCardComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './table-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.table);

  protected readonly members = signal<Member[]>(MEMBERS);
  protected readonly bigData = signal<Member[]>(generateMembers(1000));
  protected readonly byId = (row: Member) => row.id;

  protected readonly columns: DmTableColumn<Member>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status', sortable: true, align: 'center' },
    { key: 'joined', header: 'Joined', sortable: true, align: 'end' },
  ];

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    density: 'comfortable',
    variant: 'default',
    selectionMode: 'multiple',
    searchable: true,
    pageSize: 5,
    hover: true,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'density',
      label: 'density',
      type: 'select',
      options: [
        { label: 'compact', value: 'compact' },
        { label: 'comfortable', value: 'comfortable' },
        { label: 'spacious', value: 'spacious' },
      ],
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'default', value: 'default' },
        { label: 'striped', value: 'striped' },
        { label: 'bordered', value: 'bordered' },
      ],
    },
    {
      key: 'selectionMode',
      label: 'selectionMode',
      type: 'select',
      options: [
        { label: 'none', value: 'none' },
        { label: 'single', value: 'single' },
        { label: 'multiple', value: 'multiple' },
      ],
    },
    { key: 'searchable', label: 'searchable', type: 'boolean' },
    { key: 'pageSize', label: 'pageSize', type: 'number', min: 0, max: 12, step: 1 },
    { key: 'hover', label: 'hover', type: 'boolean' },
  ];

  protected readonly pgDensity = computed(() => this.playground()['density'] as DmTableDensity);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmTableVariant);
  protected readonly pgSelection = computed(
    () => this.playground()['selectionMode'] as DmTableSelectionMode,
  );
  protected readonly pgSearchable = computed(() => this.playground()['searchable'] as boolean);
  protected readonly pgPageSize = computed(() => Number(this.playground()['pageSize']) || 0);
  protected readonly pgHover = computed(() => this.playground()['hover'] as boolean);

  protected readonly pgSelected = signal<DmTableKey[]>([2, 4]);

  protected readonly playgroundCode = computed(() => {
    const attrs = ['[columns]="columns"', '[data]="members()"', '[rowKey]="byId"'];
    if (this.pgSelection() !== 'none') {
      attrs.push(`selectionMode="${this.pgSelection()}"`, '[(selectedKeys)]="selected"');
    }
    if (this.pgSearchable()) attrs.push('[searchable]="true"');
    if (this.pgPageSize() > 0) attrs.push(`[pageSize]="${this.pgPageSize()}"`);
    if (this.pgDensity() !== 'comfortable') attrs.push(`density="${this.pgDensity()}"`);
    if (this.pgVariant() !== 'default') attrs.push(`variant="${this.pgVariant()}"`);
    if (!this.pgHover()) attrs.push('[hover]="false"');
    return `<dm-table\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Full-featured demo --------------------------------------------------
  protected readonly selected = signal<DmTableKey[]>([]);
  protected readonly selectedNames = computed(() => {
    const set = new Set(this.selected());
    return this.members()
      .filter((m) => set.has(m.id))
      .map((m) => m.name.split(' ')[0])
      .join(', ');
  });

  protected readonly fullCode = [
    '<dm-table',
    '  [columns]="columns"',
    '  [data]="members()"',
    '  [rowKey]="byId"',
    '  selectionMode="multiple"',
    '  [searchable]="true"',
    '  [pageSize]="5"',
    '  [(selectedKeys)]="selected"',
    '  caption="Team members"',
    '>',
    '  <dm-button dmTableActions size="sm" variant="flat" color="primary">Invite</dm-button>',
    '</dm-table>',
    '',
    '<p>',
    '  @if (selectedNames()) {',
    '    Selected: {{ selectedNames() }}',
    '  } @else {',
    '    Nothing selected',
    '  }',
    '</p>',
  ].join('\n');

  protected readonly fullTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmTableColumn,',
    '  DmTableComponent,',
    '  DmTableKey,',
    "} from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  email: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '  joined: string;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-members-table',",
    '  imports: [DmTableComponent, DmButtonComponent],',
    "  templateUrl: './members-table.component.html',",
    '})',
    'export class MembersTableComponent {',
    '  protected readonly members = signal<Member[]>([...]);',
    '  protected readonly selected = signal<DmTableKey[]>([]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name', sortable: true },",
    "    { key: 'email', header: 'Email', sortable: true },",
    "    { key: 'role', header: 'Role', sortable: true },",
    "    { key: 'status', header: 'Status', sortable: true, align: 'center' },",
    "    { key: 'joined', header: 'Joined', sortable: true, align: 'end' },",
    '  ];',
    '',
    '  // First names of the currently selected rows, for the readout.',
    '  protected readonly selectedNames = computed(() => {',
    '    const set = new Set(this.selected());',
    '    return this.members()',
    '      .filter((m) => set.has(m.id))',
    "      .map((m) => m.name.split(' ')[0])",
    "      .join(', ');",
    '  });',
    '}',
  ].join('\n');

  // ---- Custom cells demo (dmTableCell templates) ---------------------------
  protected statusColor(status: Member['status']): 'success' | 'warning' | 'default' {
    if (status === 'Active') return 'success';
    if (status === 'Away') return 'warning';
    return 'default';
  }

  protected readonly customCellsCode = [
    '<!-- One ng-template[dmTableCell] per column key; the rest render plain. -->',
    '<dm-table [columns]="columns" [data]="members()" [rowKey]="byId" [pageSize]="5">',
    '  <ng-template dmTableCell="name" let-row>',
    '    <span style="display: inline-flex; align-items: center; gap: 0.5rem">',
    '      <dm-avatar [initials]="initials(row.name)" [alt]="row.name" size="1.75rem" />',
    '      {{ row.name }}',
    '    </span>',
    '  </ng-template>',
    '',
    '  <ng-template dmTableCell="status" let-row>',
    '    <dm-badge [color]="statusColor(row.status)" variant="flat" size="sm">',
    '      {{ row.status }}',
    '    </dm-badge>',
    '  </ng-template>',
    '</dm-table>',
  ].join('\n');

  protected readonly customCellsTs = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmTableCellDirective,',
    '  DmTableColumn,',
    '  DmTableComponent,',
    "} from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  email: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '  joined: string;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-rich-cells-table',",
    '  imports: [DmTableComponent, DmTableCellDirective, DmAvatarComponent, DmBadgeComponent],',
    "  templateUrl: './rich-cells-table.component.html',",
    '})',
    'export class RichCellsTableComponent {',
    '  protected readonly members = signal<Member[]>([...]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  // Search and sort still read the column key — templates only change rendering.',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name', sortable: true },",
    "    { key: 'email', header: 'Email', sortable: true },",
    "    { key: 'status', header: 'Status', sortable: true, align: 'center' },",
    '  ];',
    '',
    "  protected statusColor(status: Member['status']): 'success' | 'warning' | 'default' {",
    "    if (status === 'Active') return 'success';",
    "    if (status === 'Away') return 'warning';",
    "    return 'default';",
    '  }',
    '',
    '  protected initials(name: string): string {',
    '    return name',
    "      .split(' ')",
    '      .map((part) => part[0])',
    "      .join('')",
    '      .slice(0, 2);',
    '  }',
    '}',
  ].join('\n');

  // ---- Selection demo ------------------------------------------------------
  protected readonly selectedSingle = signal<DmTableKey[]>([]);
  protected readonly selectionCode = [
    '// selectionMode: "single" | "multiple"',
    '// selectionChange emits the selected ROWS; selectedKeys is two-way.',
    '<dm-table',
    '  [columns]="columns"',
    '  [data]="members()"',
    '  [rowKey]="byId"',
    '  selectionMode="single"',
    '  [(selectedKeys)]="selected"',
    '  (selectionChange)="onSelect($event)" />',
  ].join('\n');

  protected readonly selectionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent, DmTableKey } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '}',
    '',
    '@Component({',
    "  selector: 'app-single-select-table',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './single-select-table.component.html',",
    '})',
    'export class SingleSelectTableComponent {',
    '  protected readonly members = signal<Member[]>([...]);',
    '  protected readonly selected = signal<DmTableKey[]>([]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name' },",
    "    { key: 'role', header: 'Role' },",
    "    { key: 'status', header: 'Status', align: 'center' },",
    '  ];',
    '',
    '  // selectionChange emits the selected rows; selectedKeys stays in sync.',
    '  protected onSelect(rows: Member[]): void {',
    '    // React to the selection change (e.g. enable a bulk action).',
    '  }',
    '}',
  ].join('\n');

  // ---- Pagination demo -----------------------------------------------------
  protected readonly paginationCode = [
    '<dm-table',
    '  [columns]="columns"',
    '  [data]="members()"',
    '  [rowKey]="byId"',
    '  [pageSize]="5"',
    '  [pageSizeOptions]="[5, 10, 25]" />',
  ].join('\n');

  protected readonly paginationTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  email: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '  joined: string;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-paginated-table',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './paginated-table.component.html',",
    '})',
    'export class PaginatedTableComponent {',
    '  protected readonly members = signal<Member[]>([...]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name', sortable: true },",
    "    { key: 'email', header: 'Email', sortable: true },",
    "    { key: 'role', header: 'Role', sortable: true },",
    "    { key: 'status', header: 'Status', sortable: true, align: 'center' },",
    "    { key: 'joined', header: 'Joined', sortable: true, align: 'end' },",
    '  ];',
    '}',
  ].join('\n');

  // ---- Virtual scroll demo -------------------------------------------------
  protected readonly virtualSelected = signal<DmTableKey[]>([]);
  protected readonly virtualScrollCode = [
    '// 1,000 rows, but only the visible slice is ever in the DOM.',
    'protected readonly bigData = signal<Member[]>(generateMembers(1000));',
    '',
    '<dm-table',
    '  virtualScroll',
    '  [rowHeight]="44"',
    '  viewportHeight="24rem"',
    '  [columns]="columns"',
    '  [data]="bigData()"',
    '  [rowKey]="byId"',
    '  selectionMode="multiple"',
    '  [searchable]="true"',
    '  [(selectedKeys)]="selected"',
    '  caption="1,000 members" />',
  ].join('\n');

  protected readonly virtualScrollTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent, DmTableKey } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  email: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '  joined: string;',
    '}',
    '',
    '// Deterministically synthesize a large dataset.',
    'function generateMembers(count: number): Member[] {',
    '  return Array.from({ length: count }, (_, i) => ({',
    '    id: i + 1,',
    '    name: `Member #${i + 1}`,',
    '    email: `member${i + 1}@dmaster.io`,',
    "    role: 'Viewer',",
    "    status: 'Active',",
    "    joined: '2020-01-01',",
    '  }));',
    '}',
    '',
    '@Component({',
    "  selector: 'app-virtual-table',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './virtual-table.component.html',",
    '})',
    'export class VirtualTableComponent {',
    '  // 1,000 rows, but only the visible slice is ever in the DOM.',
    '  protected readonly bigData = signal<Member[]>(generateMembers(1000));',
    '  protected readonly selected = signal<DmTableKey[]>([]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name', sortable: true },",
    "    { key: 'email', header: 'Email', sortable: true },",
    "    { key: 'role', header: 'Role', sortable: true },",
    "    { key: 'status', header: 'Status', sortable: true, align: 'center' },",
    "    { key: 'joined', header: 'Joined', sortable: true, align: 'end' },",
    '  ];',
    '}',
  ].join('\n');

  // ---- Densities / variants ------------------------------------------------
  protected readonly densitiesCode = [
    '<dm-table [columns]="cols" [data]="rows" density="compact" />',
    '<dm-table [columns]="cols" [data]="rows" density="comfortable" />',
    '<dm-table [columns]="cols" [data]="rows" density="spacious" />',
  ].join('\n');

  protected readonly densitiesTs = [
    "import { Component } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '}',
    '',
    '@Component({',
    "  selector: 'app-density-tables',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './density-tables.component.html',",
    '})',
    'export class DensityTablesComponent {',
    '  protected readonly cols: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name' },",
    "    { key: 'role', header: 'Role' },",
    "    { key: 'status', header: 'Status', align: 'center' },",
    '  ];',
    '',
    '  protected readonly rows: Member[] = [',
    "    { id: 1, name: 'Ada Lovelace', role: 'Engineer',  status: 'Active'  },",
    "    { id: 2, name: 'Alan Turing',  role: 'Architect', status: 'Away'    },",
    "    { id: 3, name: 'Grace Hopper', role: 'Manager',   status: 'Invited' },",
    '  ];',
    '}',
  ].join('\n');

  protected readonly variantsCode = [
    '<dm-table [columns]="cols" [data]="rows" variant="default" />',
    '<dm-table [columns]="cols" [data]="rows" variant="striped" />',
    '<dm-table [columns]="cols" [data]="rows" variant="bordered" />',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '}',
    '',
    '@Component({',
    "  selector: 'app-variant-tables',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './variant-tables.component.html',",
    '})',
    'export class VariantTablesComponent {',
    '  protected readonly cols: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name' },",
    "    { key: 'role', header: 'Role' },",
    "    { key: 'status', header: 'Status', align: 'center' },",
    '  ];',
    '',
    '  protected readonly rows: Member[] = [',
    "    { id: 1, name: 'Ada Lovelace', role: 'Engineer',  status: 'Active'  },",
    "    { id: 2, name: 'Alan Turing',  role: 'Architect', status: 'Away'    },",
    "    { id: 3, name: 'Grace Hopper', role: 'Manager',   status: 'Invited' },",
    '  ];',
    '}',
  ].join('\n');

  // ---- States demo ---------------------------------------------------------
  protected readonly loadingDemo = signal(false);
  protected readonly statesCode = [
    '// loading shows skeleton rows; empty data shows the empty state.',
    '<dm-table [columns]="cols" [data]="rows" [loading]="loading()" />',
    '<dm-table [columns]="cols" [data]="[]" emptyText="No members yet" />',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTableColumn, DmTableComponent } from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '}',
    '',
    '@Component({',
    "  selector: 'app-table-states',",
    '  imports: [DmTableComponent],',
    "  templateUrl: './table-states.component.html',",
    '})',
    'export class TableStatesComponent {',
    '  protected readonly loading = signal(false);',
    '',
    '  protected readonly cols: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name' },",
    "    { key: 'role', header: 'Role' },",
    "    { key: 'status', header: 'Status', align: 'center' },",
    '  ];',
    '  protected readonly rows: Member[] = [',
    "    { id: 1, name: 'Ada Lovelace', role: 'Engineer',  status: 'Active'  },",
    "    { id: 2, name: 'Alan Turing',  role: 'Architect', status: 'Away'    },",
    "    { id: 3, name: 'Grace Hopper', role: 'Manager',   status: 'Invited' },",
    '  ];',
    '',
    '  protected toggleLoading(): void {',
    '    this.loading.update((v) => !v);',
    '  }',
    '}',
  ].join('\n');

  protected toggleLoading(): void {
    this.loadingDemo.update((v) => !v);
  }

  // ---- Composition: team members admin panel -------------------------------
  protected readonly teamMembers = signal<Member[]>(MEMBERS);
  protected readonly teamSelected = signal<DmTableKey[]>([1, 3]);

  protected readonly teamSelectedRows = computed(() => {
    const set = new Set(this.teamSelected());
    return this.teamMembers().filter((m) => set.has(m.id));
  });

  protected readonly statusCounts = computed(() => {
    const counts = { active: 0, away: 0, invited: 0 };
    for (const m of this.teamMembers()) {
      if (m.status === 'Active') counts.active++;
      else if (m.status === 'Away') counts.away++;
      else counts.invited++;
    }
    return counts;
  });

  protected initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  protected invite(): void {
    this.teamMembers.update((rows) => {
      const id = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
      return [
        ...rows,
        {
          id,
          name: `New teammate #${id}`,
          email: `member${id}@dmaster.io`,
          role: 'Viewer',
          status: 'Invited',
          joined: new Date().toISOString().slice(0, 10),
        },
      ];
    });
  }

  protected removeSelected(): void {
    const remove = new Set(this.teamSelected());
    this.teamMembers.update((rows) => rows.filter((r) => !remove.has(r.id)));
    this.teamSelected.set([]);
  }

  protected readonly compositionCode = [
    '<!-- Admin panel: card header + table + selection tray. -->',
    '<dm-card padding="none">',
    '  <!-- Header: title, count, status summary and primary action -->',
    '  <div class="panel__header">',
    '    <div>',
    '      <strong>Team members</strong>',
    '      <span class="muted">{{ members().length }} members</span>',
    '      <p class="muted">Manage who has access to this workspace.</p>',
    '    </div>',
    '    <dm-badge color="success" variant="dot" size="sm">{{ counts().active }} active</dm-badge>',
    '    <dm-badge color="warning" variant="dot" size="sm">{{ counts().away }} away</dm-badge>',
    '    <dm-badge variant="dot" size="sm">{{ counts().invited }} invited</dm-badge>',
    '    <dm-button size="sm" color="primary" (clicked)="invite()">',
    '      <dm-icon name="plus" size="1.15em" /> Invite',
    '    </dm-button>',
    '  </div>',
    '',
    '  <!-- Table: search + multi-select + pagination -->',
    '  <dm-table',
    '    [columns]="columns"',
    '    [data]="members()"',
    '    [rowKey]="byId"',
    '    selectionMode="multiple"',
    '    [searchable]="true"',
    '    [pageSize]="5"',
    '    [(selectedKeys)]="selected"',
    '    caption="Team members" />',
    '',
    '  <!-- Selection tray: avatar chips + bulk actions -->',
    '  <div class="panel__tray">',
    '    @if (selectedRows().length > 0) {',
    '      <strong>{{ selectedRows().length }} selected</strong>',
    '      @for (m of selectedRows(); track m.id) {',
    '        <span class="chip">',
    '          <dm-avatar [initials]="initials(m.name)" [alt]="m.name" size="1.5rem" />',
    "          {{ m.name.split(' ')[0] }}",
    '        </span>',
    '      }',
    '      <dm-button size="sm" variant="light" (clicked)="selected.set([])">Clear</dm-button>',
    '      <dm-button size="sm" color="danger" variant="flat" (clicked)="removeSelected()">',
    '        <dm-icon name="trash" size="1.15em" /> Remove',
    '      </dm-button>',
    '    } @else {',
    '      <span class="muted">No rows selected</span>',
    '    }',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    '  DmTableColumn,',
    '  DmTableComponent,',
    '  DmTableKey,',
    "} from '@dmaster/ui';",
    '',
    'interface Member {',
    '  id: number;',
    '  name: string;',
    '  email: string;',
    '  role: string;',
    "  status: 'Active' | 'Away' | 'Invited';",
    '  joined: string;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-team-panel',",
    '  imports: [',
    '    DmTableComponent,',
    '    DmCardComponent,',
    '    DmAvatarComponent,',
    '    DmBadgeComponent,',
    '    DmButtonComponent,',
    '    DmIconComponent,',
    '  ],',
    "  templateUrl: './team-panel.component.html',",
    '})',
    'export class TeamPanelComponent {',
    '  protected readonly members = signal<Member[]>([...]);',
    '  protected readonly selected = signal<DmTableKey[]>([]);',
    '  protected readonly byId = (row: Member) => row.id;',
    '',
    '  protected readonly columns: DmTableColumn<Member>[] = [',
    "    { key: 'name', header: 'Name', sortable: true },",
    "    { key: 'email', header: 'Email', sortable: true },",
    "    { key: 'role', header: 'Role', sortable: true },",
    "    { key: 'status', header: 'Status', sortable: true, align: 'center' },",
    "    { key: 'joined', header: 'Joined', sortable: true, align: 'end' },",
    '  ];',
    '',
    '  // Selected ROWS derived from the two-way selectedKeys model.',
    '  protected readonly selectedRows = computed(() => {',
    '    const set = new Set(this.selected());',
    '    return this.members().filter((m) => set.has(m.id));',
    '  });',
    '',
    '  protected readonly counts = computed(() => ({',
    "    active: this.members().filter((m) => m.status === 'Active').length,",
    "    away: this.members().filter((m) => m.status === 'Away').length,",
    "    invited: this.members().filter((m) => m.status === 'Invited').length,",
    '  }));',
    '',
    '  protected initials(name: string): string {',
    "    return name.split(' ').slice(0, 2).map((p) => p[0]).join('');",
    '  }',
    '',
    '  protected invite(): void {',
    "    this.members.update((rows) => [...rows, { id: Date.now(), name: 'New teammate', status: 'Invited', /* … */ }]);",
    '  }',
    '',
    '  protected removeSelected(): void {',
    '    const remove = new Set(this.selected());',
    '    this.members.update((rows) => rows.filter((r) => !remove.has(r.id)));',
    '    this.selected.set([]);',
    '  }',
    '}',
  ].join('\n');

  // Small dataset for the compact density/variant demos.
  protected readonly fewMembers = computed(() => this.members().slice(0, 4));
  protected readonly fewColumns: DmTableColumn<Member>[] = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status', align: 'center' },
  ];

  // ---- Defaults ------------------------------------------------------------
  protected readonly defaultsCode = [
    "import { provideTableDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideTableDefaults({ density: 'compact', pageSize: 10, pageSizeOptions: [10, 25, 50] }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'columns', type: 'DmTableColumn<T>[]', default: '—', description: api['columns'] },
      { name: 'data', type: 'T[]', default: '—', description: api['data'] },
      {
        name: 'rowKey',
        type: '(row, i) => string | number',
        default: 'index',
        description: api['rowKey'],
      },
      { name: 'searchable', type: 'boolean', default: 'false', description: api['searchable'] },
      { name: 'searchTerm', type: 'string', default: "''", description: api['searchTerm'] },
      {
        name: 'selectionMode',
        type: "'none' | 'single' | 'multiple'",
        default: "'none'",
        description: api['selectionMode'],
      },
      {
        name: 'selectedKeys',
        type: '(string | number)[]',
        default: '[]',
        description: api['selectedKeys'],
      },
      { name: 'pageSize', type: 'number', default: '0', description: api['pageSize'] },
      { name: 'page', type: 'number', default: '1', description: api['page'] },
      {
        name: 'pageSizeOptions',
        type: 'number[]',
        default: '[10, 25, 50]',
        description: api['pageSizeOptions'],
      },
      { name: 'loading', type: 'boolean', default: 'false', description: api['loading'] },
      {
        name: 'virtualScroll',
        type: 'boolean',
        default: 'false',
        description: api['virtualScroll'],
      },
      { name: 'rowHeight', type: 'number', default: '44', description: api['rowHeight'] },
      {
        name: 'viewportHeight',
        type: 'string',
        default: "'24rem'",
        description: api['viewportHeight'],
      },
      {
        name: 'density',
        type: "'compact' | 'comfortable' | 'spacious'",
        default: "'comfortable'",
        description: api['density'],
      },
      {
        name: 'variant',
        type: "'default' | 'striped' | 'bordered'",
        default: "'default'",
        description: api['variant'],
      },
      { name: 'hover', type: 'boolean', default: 'true', description: api['hover'] },
      { name: 'sticky', type: 'boolean', default: 'false', description: api['sticky'] },
      { name: 'caption', type: 'string', default: "''", description: api['caption'] },
      {
        name: 'sortState',
        type: 'DmTableSortState | null',
        default: 'null',
        description: api['sortState'],
      },
      {
        name: 'manualProcessing',
        type: 'boolean',
        default: 'false',
        description: api['manualProcessing'],
      },
      {
        name: 'rowClick',
        type: 'output<{row, index}>',
        default: '—',
        description: api['rowClick'],
      },
      {
        name: 'selectionChange',
        type: 'output<T[]>',
        default: '—',
        description: api['selectionChange'],
      },
      {
        name: 'sortChange',
        type: 'output<DmTableSortState | null>',
        default: '—',
        description: api['sortChange'],
      },
      {
        name: 'pageChange',
        type: 'output<DmTablePageState>',
        default: '—',
        description: api['pageChange'],
      },
      {
        name: 'searchChange',
        type: 'output<string>',
        default: '—',
        description: api['searchChange'],
      },
      {
        name: 'dmTableCell',
        type: 'ng-template[dmTableCell="key"]',
        default: '—',
        description: api['cellTemplate'],
      },
      {
        name: 'dmTableEmpty',
        type: 'ng-template[dmTableEmpty]',
        default: '—',
        description: api['emptyTemplate'],
      },
    ];
  });
}
