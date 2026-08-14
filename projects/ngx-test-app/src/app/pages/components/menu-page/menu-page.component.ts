import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonComponent,
  DmMenuComponent,
  DmMenuDividerComponent,
  DmMenuItemComponent,
  DmMenuPlacement,
  DmMenuSectionComponent,
  DmMenuTriggerDirective,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-menu-page',
  imports: [
    DmButtonComponent,
    DmMenuComponent,
    DmMenuTriggerDirective,
    DmMenuItemComponent,
    DmMenuSectionComponent,
    DmMenuDividerComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './menu-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.menu);

  /** Last activated item, echoed in the demos so the wiring is visible. */
  protected readonly lastAction = signal<string>('—');
  protected act(label: string): void {
    this.lastAction.set(label);
  }

  // Playground
  protected readonly playground = signal<PropValues>({
    placement: 'bottom-start',
    closeOnSelect: true,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'placement',
      label: 'placement',
      type: 'select',
      options: [
        { label: 'bottom-start', value: 'bottom-start' },
        { label: 'bottom-end', value: 'bottom-end' },
        { label: 'top-start', value: 'top-start' },
        { label: 'top-end', value: 'top-end' },
      ],
    },
    { key: 'closeOnSelect', label: 'closeOnSelect', type: 'boolean' },
  ];

  protected readonly pgPlacement = computed(
    () => this.playground()['placement'] as DmMenuPlacement,
  );
  protected readonly pgCloseOnSelect = computed(
    () => this.playground()['closeOnSelect'] as boolean,
  );

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgPlacement() !== 'bottom-start') attrs.push(`placement="${this.pgPlacement()}"`);
    if (!this.pgCloseOnSelect()) attrs.push('[closeOnSelect]="false"');
    const menuTag = attrs.length ? `<dm-menu #menu ${attrs.join(' ')}>` : '<dm-menu #menu>';
    return [
      '<dm-button [dmMenuTrigger]="menu" variant="flat">Actions</dm-button>',
      menuTag,
      '  <dm-menu-item (selected)="onEdit()">Edit</dm-menu-item>',
      '  <dm-menu-item (selected)="onDuplicate()">Duplicate</dm-menu-item>',
      '  <dm-menu-item (selected)="onArchive()">Archive</dm-menu-item>',
      '</dm-menu>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-button [dmMenuTrigger]="menu" variant="flat">Actions</dm-button>',
    '',
    '<dm-menu #menu ariaLabel="Actions">',
    '  <dm-menu-item (selected)="edit()">Edit</dm-menu-item>',
    '  <dm-menu-item (selected)="duplicate()">Duplicate</dm-menu-item>',
    '  <dm-menu-item (selected)="archive()">Archive</dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly iconsCode = [
    '<dm-menu #menu ariaLabel="Edit">',
    '  <dm-menu-item shortcut="⌘C" (selected)="copy()">',
    '    <svg dmMenuItemStart viewBox="0 0 24 24">…</svg>',
    '    Copy',
    '  </dm-menu-item>',
    '  <dm-menu-item shortcut="⌘V" (selected)="paste()">',
    '    <svg dmMenuItemStart viewBox="0 0 24 24">…</svg>',
    '    Paste',
    '  </dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly sectionsCode = [
    '<dm-menu #menu>',
    '  <dm-menu-section heading="Account">',
    '    <dm-menu-item (selected)="profile()">Profile</dm-menu-item>',
    '    <dm-menu-item (selected)="settings()">Settings</dm-menu-item>',
    '  </dm-menu-section>',
    '  <dm-menu-divider />',
    '  <dm-menu-item (selected)="signOut()">Sign out</dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly dangerCode = [
    '<dm-menu #menu>',
    '  <dm-menu-item (selected)="rename()">Rename</dm-menu-item>',
    '  <dm-menu-divider />',
    '  <dm-menu-item color="danger" shortcut="⌫" (selected)="remove()">',
    '    Delete',
    '  </dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly persistentCode = [
    '<dm-menu #menu [closeOnSelect]="false">',
    '  <dm-menu-item (selected)="toggleBold()">Bold</dm-menu-item>',
    '  <dm-menu-item (selected)="toggleItalic()">Italic</dm-menu-item>',
    '  <dm-menu-item (selected)="toggleUnderline()">Underline</dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideMenuDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideMenuDefaults({ placement: 'bottom-end', closeOnSelect: false }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'dmMenuTrigger',
        type: 'DmMenuComponent',
        default: '—',
        description: api['trigger'],
      },
      {
        name: 'placement',
        type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'",
        default: "'bottom-start'",
        description: api['placement'],
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        default: 'true',
        description: api['closeOnSelect'],
      },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      { name: 'opened / closed', type: 'output<void>', default: '—', description: api['events'] },
      {
        name: 'disabled (item)',
        type: 'boolean',
        default: 'false',
        description: api['itemDisabled'],
      },
      {
        name: 'color (item)',
        type: "'default' | 'danger'",
        default: "'default'",
        description: api['itemColor'],
      },
      { name: 'shortcut (item)', type: 'string', default: '—', description: api['shortcut'] },
      { name: 'selected (item)', type: 'output<void>', default: '—', description: api['selected'] },
      {
        name: 'heading (section)',
        type: 'string',
        default: "''",
        description: api['sectionHeading'],
      },
    ];
  });
}
