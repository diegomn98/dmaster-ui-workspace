import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonComponent,
  DmCardComponent,
  DmCommandComponent,
  DmCommandItem,
  DmIconComponent,
  DmKbdComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-command-page',
  imports: [
    DmButtonComponent,
    DmCardComponent,
    DmCommandComponent,
    DmIconComponent,
    DmKbdComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './command-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.command);

  /** Shared command set used across the demos. */
  protected readonly items: DmCommandItem[] = [
    {
      id: 'new-file',
      label: 'New File',
      group: 'File',
      shortcut: '⌘N',
      keywords: ['create', 'add'],
    },
    { id: 'open-file', label: 'Open File…', group: 'File', shortcut: '⌘O' },
    { id: 'save', label: 'Save', group: 'File', shortcut: '⌘S' },
    { id: 'copy', label: 'Copy', group: 'Edit', shortcut: '⌘C' },
    { id: 'paste', label: 'Paste', group: 'Edit', shortcut: '⌘V' },
    { id: 'find', label: 'Find in Files', group: 'Edit', shortcut: '⌘⇧F', keywords: ['search'] },
    { id: 'toggle-theme', label: 'Toggle Theme', group: 'General' },
    { id: 'settings', label: 'Open Settings', group: 'General', shortcut: '⌘,' },
  ];

  /** Simpler set (no shortcuts) for the basic example. */
  protected readonly basicItems: DmCommandItem[] = [
    { id: 'dashboard', label: 'Go to Dashboard', group: 'Navigation' },
    { id: 'projects', label: 'Go to Projects', group: 'Navigation' },
    { id: 'invite', label: 'Invite teammate', group: 'Actions' },
    { id: 'new-doc', label: 'New document', group: 'Actions' },
  ];

  // Open state per demo (the palette is declared once per instance).
  protected readonly pgOpen = signal(false);
  protected readonly basicOpen = signal(false);
  protected readonly shortcutsOpen = signal(false);
  protected readonly emptyOpen = signal(false);

  protected readonly lastAction = signal<string>('—');
  protected onSelect(item: DmCommandItem): void {
    this.lastAction.set(item.label);
  }

  // Composition: app top-bar
  protected readonly appOpen = signal(false);
  protected readonly appAction = signal<string>('—');

  protected readonly appItems = computed<DmCommandItem[]>(() => {
    const labels = this.page().labels;
    return [
      {
        id: 'dashboard',
        label: labels['navDashboard'],
        group: labels['groupNavigation'],
        shortcut: 'G D',
        keywords: ['home'],
      },
      {
        id: 'projects',
        label: labels['navProjects'],
        group: labels['groupNavigation'],
        shortcut: 'G P',
      },
      {
        id: 'settings',
        label: labels['navSettings'],
        group: labels['groupNavigation'],
        shortcut: '⌘,',
      },
      {
        id: 'new-project',
        label: labels['actionNewProject'],
        group: labels['groupActions'],
        shortcut: '⌘N',
        keywords: ['create'],
      },
      {
        id: 'invite',
        label: labels['actionInvite'],
        group: labels['groupActions'],
        keywords: ['team', 'member'],
      },
      { id: 'theme-light', label: labels['themeLight'], group: labels['groupTheme'] },
      { id: 'theme-dark', label: labels['themeDark'], group: labels['groupTheme'] },
    ];
  });

  protected onAppSelect(item: DmCommandItem): void {
    this.appAction.set(item.label);
  }

  protected readonly compositionCode = [
    '<dm-card padding="sm">',
    '  <div style="display: flex; align-items: center; gap: 0.75rem">',
    '    <span class="brand">Acme</span>',
    '',
    '    <dm-button variant="bordered" size="sm" radius="md" style="flex: 1" (clicked)="open.set(true)">',
    '      <span style="display: flex; align-items: center; gap: 0.5rem; width: 100%; color: var(--dm-fg-muted)">',
    '        <dm-icon name="search" size="1rem" />',
    '        <span style="flex: 1; text-align: start">Search…</span>',
    '        <dm-kbd size="sm" keys="command">K</dm-kbd>',
    '      </span>',
    '    </dm-button>',
    '  </div>',
    '</dm-card>',
    '',
    '<dm-command [items]="commands" [(open)]="open" (selected)="run($event)" />',
    '',
    '<p>Last action: {{ lastAction() }}</p>',
  ].join('\n');

  protected readonly compositionTs = [
    'readonly open = signal(false);',
    "readonly lastAction = signal('—');",
    '',
    'readonly commands: DmCommandItem[] = [',
    "  { id: 'dashboard', label: 'Dashboard', group: 'Navigation', shortcut: 'G D' },",
    "  { id: 'projects', label: 'Projects', group: 'Navigation', shortcut: 'G P' },",
    "  { id: 'settings', label: 'Settings', group: 'Navigation', shortcut: '⌘,' },",
    "  { id: 'new-project', label: 'New project', group: 'Actions', shortcut: '⌘N', keywords: ['create'] },",
    "  { id: 'invite', label: 'Invite member', group: 'Actions', keywords: ['team'] },",
    "  { id: 'theme-light', label: 'Light', group: 'Theme' },",
    "  { id: 'theme-dark', label: 'Dark', group: 'Theme' },",
    '];',
    '',
    'run(item: DmCommandItem): void {',
    '  this.lastAction.set(item.label);',
    '}',
  ].join('\n');

  // Playground
  protected readonly playground = signal<PropValues>({ hotkey: 'mod+k' });

  protected readonly controls: PropControl[] = [
    {
      key: 'hotkey',
      label: 'hotkey',
      type: 'select',
      options: [
        { label: 'mod+k', value: 'mod+k' },
        { label: 'mod+p', value: 'mod+p' },
        { label: 'disabled', value: '' },
      ],
    },
  ];

  protected readonly pgHotkey = computed(() => this.playground()['hotkey'] as string);

  protected readonly playgroundCode = computed(() => {
    const hotkey = this.pgHotkey();
    const hotkeyAttr = hotkey === 'mod+k' ? '' : ` hotkey="${hotkey}"`;
    return [
      '<dm-button (clicked)="open.set(true)">Open palette</dm-button>',
      '',
      `<dm-command [items]="commands" [(open)]="open"${hotkeyAttr} (selected)="run($event)" />`,
    ].join('\n');
  });

  protected readonly basicCode = [
    '<dm-button variant="flat" (clicked)="open.set(true)">Open</dm-button>',
    '',
    '<dm-command [items]="commands" [(open)]="open" (selected)="run($event)" />',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmCommandComponent, DmCommandItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-basic-command-demo',",
    '  imports: [DmButtonComponent, DmCommandComponent],',
    "  templateUrl: './basic-command-demo.component.html',",
    '})',
    'export class BasicCommandDemoComponent {',
    '  readonly open = signal(false);',
    "  readonly lastAction = signal('—');",
    '',
    '  readonly commands: DmCommandItem[] = [',
    "    { id: 'dashboard', label: 'Go to Dashboard', group: 'Navigation' },",
    "    { id: 'projects', label: 'Go to Projects', group: 'Navigation' },",
    "    { id: 'invite', label: 'Invite teammate', group: 'Actions' },",
    "    { id: 'new-doc', label: 'New document', group: 'Actions' },",
    '  ];',
    '',
    '  run(item: DmCommandItem): void {',
    '    this.lastAction.set(item.label);',
    '  }',
    '}',
  ].join('\n');

  protected readonly shortcutsCode = [
    '<dm-button variant="flat" (clicked)="open.set(true)">Open</dm-button>',
    '',
    '<dm-command [items]="commands" [(open)]="open" (selected)="run($event)" />',
  ].join('\n');

  protected readonly shortcutsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmCommandComponent, DmCommandItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-shortcuts-command-demo',",
    '  imports: [DmButtonComponent, DmCommandComponent],',
    "  templateUrl: './shortcuts-command-demo.component.html',",
    '})',
    'export class ShortcutsCommandDemoComponent {',
    '  readonly open = signal(false);',
    "  readonly lastAction = signal('—');",
    '',
    '  readonly commands: DmCommandItem[] = [',
    "    { id: 'save', label: 'Save', group: 'File', shortcut: '⌘S' },",
    "    { id: 'find', label: 'Find in Files', group: 'Edit', shortcut: '⌘⇧F', keywords: ['search'] },",
    '  ];',
    '',
    '  run(item: DmCommandItem): void {',
    '    this.lastAction.set(item.label);',
    '  }',
    '}',
  ].join('\n');

  protected readonly emptyCode = [
    '<dm-command',
    '  [items]="commands"',
    '  [(open)]="open"',
    '  emptyLabel="Nothing matches — try another term"',
    '  (selected)="run($event)"',
    '/>',
  ].join('\n');

  protected readonly emptyTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmCommandComponent, DmCommandItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-empty-command-demo',",
    '  imports: [DmCommandComponent],',
    "  templateUrl: './empty-command-demo.component.html',",
    '})',
    'export class EmptyCommandDemoComponent {',
    '  readonly open = signal(false);',
    "  readonly lastAction = signal('—');",
    '',
    '  readonly commands: DmCommandItem[] = [',
    "    { id: 'new-file', label: 'New File', group: 'File', shortcut: '⌘N', keywords: ['create', 'add'] },",
    "    { id: 'open-file', label: 'Open File…', group: 'File', shortcut: '⌘O' },",
    "    { id: 'save', label: 'Save', group: 'File', shortcut: '⌘S' },",
    "    { id: 'copy', label: 'Copy', group: 'Edit', shortcut: '⌘C' },",
    "    { id: 'paste', label: 'Paste', group: 'Edit', shortcut: '⌘V' },",
    "    { id: 'find', label: 'Find in Files', group: 'Edit', shortcut: '⌘⇧F', keywords: ['search'] },",
    "    { id: 'toggle-theme', label: 'Toggle Theme', group: 'General' },",
    "    { id: 'settings', label: 'Open Settings', group: 'General', shortcut: '⌘,' },",
    '  ];',
    '',
    '  run(item: DmCommandItem): void {',
    '    this.lastAction.set(item.label);',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideCommandDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideCommandDefaults({ hotkey: 'mod+p', placeholder: 'Jump to…' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'items', type: 'DmCommandItem[]', default: '—', description: api['items'] },
      { name: 'open', type: 'model<boolean>', default: 'false', description: api['open'] },
      { name: 'hotkey', type: 'string', default: "'mod+k'", description: api['hotkey'] },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Search…'",
        description: api['placeholder'],
      },
      {
        name: 'emptyLabel',
        type: 'string',
        default: "'No results found'",
        description: api['emptyLabel'],
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "'Command palette'",
        description: api['ariaLabel'],
      },
      {
        name: 'selected',
        type: 'output<DmCommandItem>',
        default: '—',
        description: api['selected'],
      },
      { name: 'shortcut (item)', type: 'string', default: '—', description: api['shortcut'] },
      { name: 'group (item)', type: 'string', default: '—', description: api['group'] },
      { name: 'keywords (item)', type: 'string[]', default: '—', description: api['keywords'] },
      {
        name: 'disabled (item)',
        type: 'boolean',
        default: 'false',
        description: api['itemDisabled'],
      },
    ];
  });
}
