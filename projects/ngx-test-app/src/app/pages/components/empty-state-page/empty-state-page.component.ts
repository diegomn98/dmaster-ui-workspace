import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmDividerComponent,
  DmEmptyStateComponent,
  DmEmptyStateSize,
  DmIconComponent,
  DmSearchFieldComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface DemoMember {
  initials: string;
  name: string;
  roleKey: string;
  color: 'primary' | 'secondary' | 'success';
}

@Component({
  selector: 'app-empty-state-page',
  imports: [
    DmEmptyStateComponent,
    DmButtonComponent,
    DmIconComponent,
    DmCardComponent,
    DmDividerComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmSearchFieldComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './empty-state-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStatePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.emptyState);

  // Playground
  protected readonly playground = signal<PropValues>({
    title: 'No projects yet',
    description: 'Create your first project to get started.',
    size: 'md',
    hideIcon: false,
  });

  protected readonly controls: PropControl[] = [
    { key: 'title', label: 'title', type: 'text', placeholder: 'No projects yet' },
    { key: 'description', label: 'description', type: 'text', placeholder: 'Create your first…' },
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
    { key: 'hideIcon', label: 'hideIcon', type: 'boolean' },
  ];

  protected readonly pgTitle = computed(() => String(this.playground()['title'] ?? ''));
  protected readonly pgDescription = computed(() => String(this.playground()['description'] ?? ''));
  protected readonly pgSize = computed(() => this.playground()['size'] as DmEmptyStateSize);
  protected readonly pgHideIcon = computed(() => this.playground()['hideIcon'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgTitle()) attrs.push(`title="${this.pgTitle()}"`);
    if (this.pgDescription()) attrs.push(`description="${this.pgDescription()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgHideIcon()) attrs.push('hideIcon');
    return `<dm-empty-state ${attrs.join(' ')} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<dm-empty-state',
    '  title="Your inbox is empty"',
    '  description="Messages you receive will show up here."',
    '/>',
  ].join('\n');

  protected readonly actionsCode = [
    '<!-- Everything projected into the default slot lands in the centered actions row -->',
    '<dm-empty-state title="No projects yet" description="Create your first project to get started.">',
    '  <dm-button color="primary">New project</dm-button>',
    '  <dm-button variant="bordered">Import</dm-button>',
    '</dm-empty-state>',
  ].join('\n');

  protected readonly customIconCode = [
    '<!-- dmEmptyStateIcon replaces the built-in inbox glyph (dm-icon, <svg>, an image…) -->',
    '<dm-empty-state title="No results" description="Try a different search term or clear the filters.">',
    '  <dm-icon dmEmptyStateIcon>search_off</dm-icon>',
    '  <dm-button variant="flat">Clear filters</dm-button>',
    '</dm-empty-state>',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-empty-state size="sm" title="No notifications" />',
    '<dm-empty-state size="md" title="No notifications" />',
    '<dm-empty-state size="lg" title="No notifications" />',
  ].join('\n');

  protected readonly noIconCode = [
    '<!-- hideIcon removes the icon area for compact, text-only placeholders -->',
    '<dm-empty-state',
    '  hideIcon',
    '  title="No results"',
    '  description="Try a different search term or clear the filters."',
    '/>',
  ].join('\n');

  protected readonly inContextCode = [
    '<!-- Inside a card, list or table body: the empty state fills the content area -->',
    '<dm-card>',
    '  <strong>Documents</strong>',
    '  <dm-divider style="margin: 0.75rem 0" />',
    '  <dm-empty-state',
    '    size="sm"',
    '    title="No files uploaded"',
    '    description="Drag files anywhere in this panel to upload them."',
    '  />',
    '</dm-card>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideEmptyStateDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideEmptyStateDefaults({ size: 'lg' }),",
    ']',
  ].join('\n');

  // Composition — team panel whose member list empties when the search
  // matches nobody; the empty state offers to clear the query.
  protected readonly members: DemoMember[] = [
    { initials: 'AR', name: 'Ana Ruiz', roleKey: 'role1', color: 'primary' },
    { initials: 'LM', name: 'Léa Martin', roleKey: 'role2', color: 'secondary' },
    { initials: 'JP', name: 'Jon Pérez', roleKey: 'role3', color: 'success' },
  ];

  protected readonly memberQuery = signal('');

  protected readonly filteredMembers = computed(() => {
    const query = this.memberQuery().trim().toLowerCase();
    if (!query) {
      return this.members;
    }
    return this.members.filter((member) => member.name.toLowerCase().includes(query));
  });

  protected clearMemberQuery(): void {
    this.memberQuery.set('');
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem">',
    '    <strong>Team members</strong>',
    '    <dm-button size="sm" variant="flat">Invite member</dm-button>',
    '  </div>',
    '',
    '  <dm-search-field [(value)]="query" placeholder="Search members…"',
    '                   ariaLabel="Search members" style="margin-top: 0.75rem" />',
    '',
    '  <dm-divider style="margin: 0.75rem 0" />',
    '',
    '  @for (member of filtered(); track member.name) {',
    '    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0">',
    '      <dm-avatar [initials]="member.initials" size="sm" />',
    '      <span style="flex: 1">{{ member.name }}</span>',
    '      <dm-badge variant="flat" [color]="member.color">{{ member.role }}</dm-badge>',
    '    </div>',
    '  } @empty {',
    '    <dm-empty-state size="sm" title="No members found"',
    '                    description="Nobody matches your search.">',
    '      <dm-icon dmEmptyStateIcon>person_search</dm-icon>',
    '      <dm-button size="sm" variant="flat" (click)="clear()">Clear search</dm-button>',
    '    </dm-empty-state>',
    '  }',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmAvatarComponent, DmBadgeComponent, DmButtonComponent, DmCardComponent,',
    '  DmDividerComponent, DmEmptyStateComponent, DmIconComponent, DmSearchFieldComponent,',
    "} from '@dmaster/ui';",
    '',
    'const MEMBERS = [',
    "  { initials: 'AR', name: 'Ana Ruiz', role: 'Design', color: 'primary' },",
    "  { initials: 'LM', name: 'Léa Martin', role: 'Engineering', color: 'secondary' },",
    "  { initials: 'JP', name: 'Jon Pérez', role: 'Product', color: 'success' },",
    '] as const;',
    '',
    '@Component({',
    "  selector: 'app-team-panel',",
    '  imports: [',
    '    DmCardComponent, DmSearchFieldComponent, DmDividerComponent, DmAvatarComponent,',
    '    DmBadgeComponent, DmEmptyStateComponent, DmIconComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './team-panel.component.html',",
    '})',
    'export class TeamPanelComponent {',
    "  protected readonly query = signal('');",
    '',
    '  protected readonly filtered = computed(() => {',
    '    const q = this.query().trim().toLowerCase();',
    '    return q ? MEMBERS.filter((m) => m.name.toLowerCase().includes(q)) : MEMBERS;',
    '  });',
    '',
    "  protected clear(): void { this.query.set(''); }",
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'title', type: 'string', default: '—', description: api['title'] },
      { name: 'description', type: 'string', default: '—', description: api['description'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      { name: 'hideIcon', type: 'boolean', default: 'false', description: api['hideIcon'] },
    ];
  });
}
