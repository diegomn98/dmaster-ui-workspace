import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmKbdComponent,
  DmSwitchComponent,
  DmTreeComponent,
  DmTreeNode,
  DmTreeSelectionMode,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** Payload carried by the org-chart nodes of the composition demo. */
interface OrgMeta {
  kind: 'department' | 'team' | 'person';
  role?: string;
  email?: string;
}

/** Project file explorer — used by the playground and most simple demos. */
const FILES: DmTreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'src/app',
        label: 'app',
        children: [
          { id: 'src/app/app.component.ts', label: 'app.component.ts' },
          { id: 'src/app/app.routes.ts', label: 'app.routes.ts' },
          {
            id: 'src/app/pages',
            label: 'pages',
            children: [
              { id: 'src/app/pages/home.ts', label: 'home.ts' },
              { id: 'src/app/pages/about.ts', label: 'about.ts' },
            ],
          },
        ],
      },
      { id: 'src/main.ts', label: 'main.ts' },
      { id: 'src/styles.scss', label: 'styles.scss' },
    ],
  },
  {
    id: 'public',
    label: 'public',
    children: [
      { id: 'public/favicon.svg', label: 'favicon.svg' },
      { id: 'public/logo.png', label: 'logo.png' },
    ],
  },
  { id: 'package.json', label: 'package.json' },
  { id: 'README.md', label: 'README.md' },
];

/** Workspace settings sections — some are locked (disabled). */
const SETTINGS: DmTreeNode[] = [
  {
    id: 'general',
    label: 'General',
    children: [
      { id: 'general/profile', label: 'Profile' },
      { id: 'general/appearance', label: 'Appearance' },
      { id: 'general/notifications', label: 'Notifications' },
    ],
  },
  {
    id: 'workspace',
    label: 'Workspace',
    children: [
      { id: 'workspace/members', label: 'Members' },
      { id: 'workspace/billing', label: 'Billing (admins only)', disabled: true },
      { id: 'workspace/integrations', label: 'Integrations' },
    ],
  },
  { id: 'audit', label: 'Audit log (enterprise)', disabled: true },
];

/** Org chart: departments → teams → people. */
const ORG: DmTreeNode[] = [
  {
    id: 'eng',
    label: 'Engineering',
    data: { kind: 'department' } satisfies OrgMeta,
    children: [
      {
        id: 'eng/platform',
        label: 'Platform',
        data: { kind: 'team' } satisfies OrgMeta,
        children: [
          {
            id: 'eng/platform/ada',
            label: 'Ada Lovelace',
            data: { kind: 'person', role: 'Staff engineer', email: 'ada@dmaster.io' },
          },
          {
            id: 'eng/platform/alan',
            label: 'Alan Turing',
            data: { kind: 'person', role: 'Backend engineer', email: 'alan@dmaster.io' },
          },
        ],
      },
      {
        id: 'eng/frontend',
        label: 'Frontend',
        data: { kind: 'team' } satisfies OrgMeta,
        children: [
          {
            id: 'eng/frontend/grace',
            label: 'Grace Hopper',
            data: { kind: 'person', role: 'Frontend lead', email: 'grace@dmaster.io' },
          },
          {
            id: 'eng/frontend/margaret',
            label: 'Margaret Hamilton',
            data: { kind: 'person', role: 'UI engineer', email: 'margaret@dmaster.io' },
          },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Design',
    data: { kind: 'department' } satisfies OrgMeta,
    children: [
      {
        id: 'design/product',
        label: 'Product design',
        data: { kind: 'team' } satisfies OrgMeta,
        children: [
          {
            id: 'design/product/barbara',
            label: 'Barbara Liskov',
            data: { kind: 'person', role: 'Product designer', email: 'barbara@dmaster.io' },
          },
          {
            id: 'design/product/radia',
            label: 'Radia Perlman',
            data: { kind: 'person', role: 'UX researcher', email: 'radia@dmaster.io' },
          },
        ],
      },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    data: { kind: 'department' } satisfies OrgMeta,
    children: [
      {
        id: 'sales/emea',
        label: 'EMEA',
        data: { kind: 'team' } satisfies OrgMeta,
        children: [
          {
            id: 'sales/emea/tim',
            label: 'Tim Berners-Lee',
            data: { kind: 'person', role: 'Account executive', email: 'tim@dmaster.io' },
          },
        ],
      },
    ],
  },
];

/** Count the people under a node (leaf nodes of kind `person`). */
function countPeople(node: DmTreeNode): number {
  if (!node.children?.length) return (node.data as OrgMeta | undefined)?.kind === 'person' ? 1 : 0;
  return node.children.reduce((sum, child) => sum + countPeople(child), 0);
}

@Component({
  selector: 'app-tree-page',
  imports: [
    DmTreeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmSwitchComponent,
    DmKbdComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './tree-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.tree);

  protected readonly files = FILES;
  protected readonly settings = SETTINGS;
  protected readonly org = ORG;

  // ---- Usage ---------------------------------------------------------------
  protected readonly basicCode = [
    'nodes: DmTreeNode[] = [',
    "  { id: 'src', label: 'src', children: [{ id: 'main', label: 'main.ts' }] },",
    "  { id: 'readme', label: 'README.md' },",
    '];',
    '',
    '<dm-tree [nodes]="nodes" [(selectedIds)]="selected" ariaLabel="Project files" />',
  ].join('\n');

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    selectionMode: 'single',
    showGuides: false,
    expandOnSelect: false,
  });

  protected readonly controls: PropControl[] = [
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
    { key: 'showGuides', label: 'showGuides', type: 'boolean' },
    { key: 'expandOnSelect', label: 'expandOnSelect', type: 'boolean' },
  ];

  protected readonly pgSelectionMode = computed(
    () => this.playground()['selectionMode'] as DmTreeSelectionMode,
  );
  protected readonly pgShowGuides = computed(() => this.playground()['showGuides'] as boolean);
  protected readonly pgExpandOnSelect = computed(
    () => this.playground()['expandOnSelect'] as boolean,
  );

  protected readonly pgSelected = signal<string[]>(['src/main.ts']);
  protected readonly pgExpanded = signal<string[]>(['src', 'src/app']);

  protected readonly playgroundCode = computed(() => {
    const attrs = ['[nodes]="nodes"', '[(selectedIds)]="selected"', '[(expandedIds)]="expanded"'];
    if (this.pgSelectionMode() !== 'single') {
      attrs.push(`selectionMode="${this.pgSelectionMode()}"`);
    }
    if (this.pgShowGuides()) attrs.push('showGuides');
    if (this.pgExpandOnSelect()) attrs.push('expandOnSelect');
    attrs.push('ariaLabel="Project files"');
    return `<dm-tree\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- File explorer (single selection) ------------------------------------
  protected readonly explorerSelected = signal<string[]>([]);
  protected readonly explorerExpanded = signal<string[]>(['src']);
  protected readonly explorerCode = [
    '// `nodes` is the full hierarchy; the tree derives the visible rows from expandedIds.',
    'protected readonly selected = signal<string[]>([]);',
    "protected readonly expanded = signal<string[]>(['src']);",
    '',
    '<dm-tree',
    '  [nodes]="files"',
    '  [(selectedIds)]="selected"',
    '  [(expandedIds)]="expanded"',
    '  ariaLabel="Project files"',
    '  (nodeSelect)="open($event)" />',
  ].join('\n');

  // ---- Multiple selection --------------------------------------------------
  protected readonly multiSelected = signal<string[]>(['src/main.ts', 'public/favicon.svg']);
  protected readonly multiExpanded = signal<string[]>(['src', 'public']);
  protected readonly multiSelectedLabels = computed(() => {
    const set = new Set(this.multiSelected());
    const out: string[] = [];
    const walk = (list: DmTreeNode[]): void => {
      for (const n of list) {
        if (set.has(n.id)) out.push(n.label);
        if (n.children) walk(n.children);
      }
    };
    walk(this.files);
    return out.join(', ');
  });
  protected readonly multipleCode = [
    '// Clicking toggles each node in/out of selectedIds; aria-multiselectable is set.',
    '<dm-tree',
    '  [nodes]="files"',
    '  selectionMode="multiple"',
    '  [(selectedIds)]="selected"',
    '  [(expandedIds)]="expanded"',
    '  ariaLabel="Project files" />',
    '',
    '<p>Selected: {{ selected().join(", ") }}</p>',
  ].join('\n');

  // ---- Controlled expansion ------------------------------------------------
  protected readonly ctrlTree = viewChild.required<DmTreeComponent>('ctrlTree');
  protected readonly ctrlExpanded = signal<string[]>(['src']);
  protected readonly ctrlSelected = signal<string[]>([]);

  protected expandAll(): void {
    this.ctrlTree().expandAll();
  }

  protected collapseAll(): void {
    this.ctrlTree().collapseAll();
  }

  protected readonly controlledCode = [
    '// expandedIds is a two-way model — drive it yourself or call the helpers.',
    "protected readonly tree = viewChild.required<DmTreeComponent>('tree');",
    "protected readonly expanded = signal<string[]>(['src']);",
    '',
    '<dm-button size="sm" variant="bordered" (clicked)="tree().expandAll()">Expand all</dm-button>',
    '<dm-button size="sm" variant="bordered" (clicked)="tree().collapseAll()">Collapse all</dm-button>',
    '',
    '<dm-tree #tree [nodes]="files" [(expandedIds)]="expanded" ariaLabel="Project files" />',
    '<p>{{ expanded().length }} expanded</p>',
  ].join('\n');

  // ---- Guides --------------------------------------------------------------
  protected readonly guidesExpanded = signal<string[]>(['src', 'src/app', 'src/app/pages']);
  protected readonly guidesCode = [
    '<!-- Connector guide lines trace each level’s indentation (boolean attribute). -->',
    '<dm-tree [nodes]="files" [(expandedIds)]="expanded" ariaLabel="Without guides" />',
    '<dm-tree [nodes]="files" [(expandedIds)]="expanded" showGuides ariaLabel="With guides" />',
    '',
    '// Or app-wide: provideTreeDefaults({ showGuides: true })',
  ].join('\n');

  // ---- Disabled nodes ------------------------------------------------------
  protected readonly disabledSelected = signal<string[]>(['general/profile']);
  protected readonly disabledExpanded = signal<string[]>(['general', 'workspace']);
  protected readonly disabledCode = [
    '// Disabled nodes stay focusable (aria-disabled) but never become selected.',
    'nodes: DmTreeNode[] = [',
    "  { id: 'workspace', label: 'Workspace', children: [",
    "    { id: 'members', label: 'Members' },",
    "    { id: 'billing', label: 'Billing (admins only)', disabled: true },",
    '  ] },',
    "  { id: 'audit', label: 'Audit log (enterprise)', disabled: true },",
    '];',
    '',
    '<dm-tree [nodes]="nodes" [(selectedIds)]="selected" ariaLabel="Settings" />',
  ].join('\n');

  // ---- Keyboard ------------------------------------------------------------
  protected readonly keyboardExpanded = signal<string[]>(['src']);
  protected readonly keyboardSelected = signal<string[]>([]);
  protected readonly keyboardCode = [
    '<!-- Nothing to wire: the tree owns the full WAI-ARIA keyboard model. -->',
    '<dm-tree [nodes]="files" [(expandedIds)]="expanded" ariaLabel="Project files" />',
    '',
    '// ↑ / ↓        move focus between visible nodes (roving tabindex)',
    '// →            expand a collapsed parent, then move to its first child',
    '// ←            collapse an expanded parent, then move to the parent',
    '// Home / End   jump to the first / last visible node',
    '// Enter/Space  select (and toggle a parent)',
    '// *            expand every expandable sibling',
  ].join('\n');

  // ---- Composition: access control panel -----------------------------------
  protected readonly orgSelected = signal<string[]>(['eng/frontend']);
  protected readonly orgExpanded = signal<string[]>(['eng', 'eng/frontend']);
  protected readonly grantAccess = signal(true);
  protected readonly saveState = signal<DmButtonState>('idle');

  /** The selected org nodes, resolved from `selectedIds`, in tree order. */
  protected readonly orgSelectedNodes = computed(() => {
    const set = new Set(this.orgSelected());
    const out: DmTreeNode[] = [];
    const walk = (list: DmTreeNode[]): void => {
      for (const n of list) {
        if (set.has(n.id)) out.push(n);
        if (n.children) walk(n.children);
      }
    };
    walk(this.org);
    return out;
  });

  /** Total people covered by the current selection (unique). */
  protected readonly orgPeopleCount = computed(() => {
    const ids = new Set<string>();
    const collect = (node: DmTreeNode): void => {
      if (!node.children?.length) {
        if (this.meta(node).kind === 'person') ids.add(node.id);
        return;
      }
      node.children.forEach(collect);
    };
    this.orgSelectedNodes().forEach(collect);
    return ids.size;
  });

  protected meta(node: DmTreeNode): OrgMeta {
    return (node.data as OrgMeta | undefined) ?? { kind: 'person' };
  }

  protected peopleIn(node: DmTreeNode): number {
    return countPeople(node);
  }

  protected kindColor(kind: OrgMeta['kind']): 'primary' | 'secondary' | 'default' {
    if (kind === 'department') return 'primary';
    if (kind === 'team') return 'secondary';
    return 'default';
  }

  protected kindLabel(kind: OrgMeta['kind']): string {
    const labels = this.page().labels;
    if (kind === 'department') return labels['typeDepartment'];
    if (kind === 'team') return labels['typeTeam'];
    return labels['typePerson'];
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  protected save(): void {
    if (this.saveState() !== 'idle') return;
    this.saveState.set('loading');
    setTimeout(() => {
      this.saveState.set('success');
      setTimeout(() => this.saveState.set('idle'), 1500);
    }, 900);
  }

  protected readonly compositionCode = [
    '<!-- Access control: org tree (multiple) on the left, detail pane on the right. -->',
    '<dm-card padding="none">',
    '  <div class="panel__header">',
    '    <strong>Access control</strong>',
    '    <p class="muted">Pick departments, teams or people and grant them access.</p>',
    '    <dm-badge color="primary" variant="flat" size="sm">{{ people() }} people</dm-badge>',
    '  </div>',
    '',
    '  <div class="panel__body">',
    '    <!-- Left: the org chart -->',
    '    <dm-tree',
    '      [nodes]="org"',
    '      selectionMode="multiple"',
    '      [(selectedIds)]="selected"',
    '      [(expandedIds)]="expanded"',
    '      showGuides',
    '      ariaLabel="Organization" />',
    '',
    '    <!-- Right: detail pane for the selected nodes -->',
    '    <aside class="panel__detail">',
    '      @if (selectedNodes().length > 0) {',
    '        @for (node of selectedNodes(); track node.id) {',
    '          <div class="row">',
    '            <dm-avatar [initials]="initials(node.label)" [alt]="node.label" size="sm" />',
    '            <div>',
    '              <strong>{{ node.label }}</strong>',
    '              <span class="muted">{{ meta(node).role ?? peopleIn(node) + " members" }}</span>',
    '            </div>',
    '            <dm-badge [color]="kindColor(meta(node).kind)" variant="flat" size="sm">',
    '              {{ kindLabel(meta(node).kind) }}',
    '            </dm-badge>',
    '          </div>',
    '        }',
    '',
    '        <div class="grant">',
    '          <div>',
    '            <strong>Grant access</strong>',
    '            <span class="muted">Selected members can view and edit this project.</span>',
    '          </div>',
    '          <dm-switch [(checked)]="grant" ariaLabel="Grant access" />',
    '        </div>',
    '',
    '        <dm-button color="primary" size="sm" [state]="saveState()"',
    '                   loadingLabel="Saving…" successLabel="Saved!" (clicked)="save()">',
    '          Save changes',
    '        </dm-button>',
    '      } @else {',
    '        <p class="muted">Select a department, team or person to see its details.</p>',
    '      }',
    '    </aside>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmButtonState,',
    '  DmCardComponent,',
    '  DmSwitchComponent,',
    '  DmTreeComponent,',
    '  DmTreeNode,',
    "} from '@dmaster/ui';",
    '',
    "interface OrgMeta { kind: 'department' | 'team' | 'person'; role?: string; }",
    '',
    '@Component({',
    "  selector: 'app-access-panel',",
    '  imports: [',
    '    DmTreeComponent,',
    '    DmCardComponent,',
    '    DmAvatarComponent,',
    '    DmBadgeComponent,',
    '    DmSwitchComponent,',
    '    DmButtonComponent,',
    '  ],',
    "  templateUrl: './access-panel.component.html',",
    '})',
    'export class AccessPanelComponent {',
    '  // departments → teams → people; `data` carries the kind/role payload.',
    '  protected readonly org: DmTreeNode[] = [',
    "    { id: 'eng', label: 'Engineering', data: { kind: 'department' }, children: [",
    "      { id: 'eng/frontend', label: 'Frontend', data: { kind: 'team' }, children: [",
    "        { id: 'eng/frontend/grace', label: 'Grace Hopper', data: { kind: 'person', role: 'Frontend lead' } },",
    '      ] },',
    '    ] },',
    '    /* … */',
    '  ];',
    '',
    "  protected readonly selected = signal<string[]>(['eng/frontend']);",
    "  protected readonly expanded = signal<string[]>(['eng', 'eng/frontend']);",
    '  protected readonly grant = signal(true);',
    "  protected readonly saveState = signal<DmButtonState>('idle');",
    '',
    '  // Resolve the selected NODES from the two-way selectedIds model.',
    '  protected readonly selectedNodes = computed(() => {',
    '    const set = new Set(this.selected());',
    '    const out: DmTreeNode[] = [];',
    '    const walk = (list: DmTreeNode[]) => {',
    '      for (const n of list) {',
    '        if (set.has(n.id)) out.push(n);',
    '        if (n.children) walk(n.children);',
    '      }',
    '    };',
    '    walk(this.org);',
    '    return out;',
    '  });',
    '',
    '  protected meta(node: DmTreeNode): OrgMeta {',
    "    return (node.data as OrgMeta | undefined) ?? { kind: 'person' };",
    '  }',
    '',
    '  protected save(): void {',
    "    this.saveState.set('loading');",
    "    setTimeout(() => this.saveState.set('success'), 900);",
    '  }',
    '}',
  ].join('\n');

  // ---- Defaults ------------------------------------------------------------
  protected readonly defaultsCode = [
    "import { provideTreeDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideTreeDefaults({ selectionMode: 'multiple', showGuides: true, expandOnSelect: true }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'nodes', type: 'DmTreeNode[]', default: '[]', description: api['nodes'] },
      {
        name: 'selectionMode',
        type: "'none' | 'single' | 'multiple'",
        default: "'single'",
        description: api['selectionMode'],
      },
      {
        name: 'selectedIds',
        type: 'string[]',
        default: '[]',
        description: api['selectedIds'],
      },
      {
        name: 'expandedIds',
        type: 'string[]',
        default: '[]',
        description: api['expandedIds'],
      },
      {
        name: 'expandOnSelect',
        type: 'boolean',
        default: 'false',
        description: api['expandOnSelect'],
      },
      { name: 'showGuides', type: 'boolean', default: 'false', description: api['showGuides'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'ariaLabelledby',
        type: 'string',
        default: "''",
        description: api['ariaLabelledby'],
      },
      {
        name: 'nodeSelect',
        type: 'output<DmTreeNode>',
        default: '—',
        description: api['nodeSelect'],
      },
      {
        name: 'nodeToggle',
        type: 'output<DmTreeNode>',
        default: '—',
        description: api['nodeToggle'],
      },
      { name: 'expandAll()', type: 'method', default: '—', description: api['expandAll'] },
      { name: 'collapseAll()', type: 'method', default: '—', description: api['collapseAll'] },
    ];
  });
}
