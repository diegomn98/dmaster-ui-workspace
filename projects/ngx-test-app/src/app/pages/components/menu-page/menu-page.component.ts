import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
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

/** Self-contained colored avatar (data URI) — initials on a flat fill. */
function avatarSvg(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${color}"/><text x="24" y="30" font-family="system-ui, sans-serif" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

@Component({
  selector: 'app-menu-page',
  imports: [
    DmAvatarComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
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

  /** Demo user for the app-header composition (self-contained avatar, no network). */
  protected readonly user = {
    name: 'Ada Lovelace',
    email: 'ada@dmaster.io',
    src: avatarSvg('AL', '#6366f1'),
  };

  protected readonly compositionCode = [
    '<!-- App top bar: brand left, avatar button right → user menu. -->',
    '<dm-card>',
    '  <div style="display: flex; align-items: center; justify-content: space-between">',
    '    <strong>Acme</strong>',
    '',
    '    <button type="button" class="avatar-btn" [dmMenuTrigger]="userMenu" aria-label="Account">',
    '      <dm-avatar [src]="user.src" [alt]="user.name" />',
    '    </button>',
    '',
    '    <dm-menu #userMenu placement="bottom-end" ariaLabel="Account">',
    '      <!-- Non-interactive header: identity at a glance -->',
    '      <div class="menu-user">',
    '        <dm-avatar [src]="user.src" [alt]="user.name" size="sm" />',
    '        <div>',
    '          <div class="menu-user__name">{{ user.name }}</div>',
    '          <div class="menu-user__email">{{ user.email }}</div>',
    '        </div>',
    '      </div>',
    '      <dm-menu-divider />',
    '      <dm-menu-item (selected)="profile()">',
    '        <dm-icon dmMenuItemStart name="user" size="1rem" />',
    '        Profile',
    '      </dm-menu-item>',
    '      <dm-menu-item shortcut="⌘," (selected)="settings()">',
    '        <dm-icon dmMenuItemStart name="settings" size="1rem" />',
    '        Settings',
    '      </dm-menu-item>',
    '      <dm-menu-item (selected)="billing()">',
    '        <dm-icon dmMenuItemStart name="clipboard" size="1rem" />',
    '        Billing',
    '      </dm-menu-item>',
    '      <dm-menu-divider />',
    '      <dm-menu-item color="danger" (selected)="signOut()">',
    '        <dm-icon dmMenuItemStart name="arrow-right" size="1rem" />',
    '        Sign out',
    '      </dm-menu-item>',
    '    </dm-menu>',
    '  </div>',
    '</dm-card>',
    '',
    '/* .avatar-btn { padding: 0; border: 0; border-radius: 50%; background: none; cursor: pointer } */',
    '/* .menu-user { display: flex; align-items: center; gap: .75rem; padding: .5rem .75rem } */',
    '/* .menu-user__email { font-size: .75rem; color: var(--dm-fg-muted) } */',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, inject } from '@angular/core';",
    "import { Router } from '@angular/router';",
    'import {',
    '  DmAvatarComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    '  DmMenuComponent,',
    '  DmMenuDividerComponent,',
    '  DmMenuItemComponent,',
    '  DmMenuTriggerDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-header',",
    '  imports: [',
    '    DmAvatarComponent,',
    '    DmCardComponent,',
    '    DmIconComponent,',
    '    DmMenuComponent,',
    '    DmMenuDividerComponent,',
    '    DmMenuItemComponent,',
    '    DmMenuTriggerDirective,',
    '  ],',
    "  templateUrl: './header.component.html',",
    '})',
    'export class HeaderComponent {',
    '  private readonly router = inject(Router);',
    '  private readonly auth = inject(AuthService);',
    '',
    "  protected readonly user = { name: 'Ada Lovelace', email: 'ada@dmaster.io', src: '/u/ada.png' };",
    '',
    "  protected profile(): void { this.router.navigate(['/profile']); }",
    "  protected settings(): void { this.router.navigate(['/settings']); }",
    "  protected billing(): void { this.router.navigate(['/billing']); }",
    '  protected signOut(): void { this.auth.signOut(); }',
    '}',
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
