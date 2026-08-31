import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmCardComponent,
  DmIconComponent,
  DmSwitchComponent,
  DmTabComponent,
  DmTabPanelComponent,
  DmTabsColor,
  DmTabsComponent,
  DmTabsPlacement,
  DmTabsRadius,
  DmTabsSize,
  DmTabsVariant,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** Self-contained portrait (data URI) so the composition demo never hits the network. */
const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#6366f1"/><circle cx="24" cy="18" r="8" fill="#fff" opacity="0.92"/><path d="M8 46c0-9 7-15 16-15s16 6 16 15" fill="#fff" opacity="0.92"/></svg>`;

@Component({
  selector: 'app-tabs-page',
  imports: [
    DmTabsComponent,
    DmTabComponent,
    DmTabPanelComponent,
    DmIconComponent,
    DmCardComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmSwitchComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './tabs-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.tabs);

  // Playground
  protected readonly playground = signal<PropValues>({
    variant: 'underlined',
    color: 'primary',
    size: 'md',
    radius: 'full',
    placement: 'top',
    fullWidth: true,
    divider: true,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'solid', value: 'solid' },
        { label: 'bordered', value: 'bordered' },
        { label: 'light', value: 'light' },
        { label: 'underlined', value: 'underlined' },
        { label: 'segment', value: 'segment' },
      ],
    },
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
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: [
        { label: 'none', value: 'none' },
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' },
        { label: 'full', value: 'full' },
      ],
    },
    {
      key: 'placement',
      label: 'placement',
      type: 'select',
      options: [
        { label: 'top', value: 'top' },
        { label: 'start', value: 'start' },
      ],
    },
    { key: 'fullWidth', label: 'fullWidth', type: 'boolean' },
    { key: 'divider', label: 'divider', type: 'boolean' },
  ];

  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmTabsVariant);
  protected readonly pgColor = computed(() => this.playground()['color'] as DmTabsColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmTabsSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmTabsRadius);
  protected readonly pgPlacement = computed(
    () => this.playground()['placement'] as DmTabsPlacement,
  );
  protected readonly pgFullWidth = computed(() => this.playground()['fullWidth'] as boolean);
  protected readonly pgDivider = computed(() => this.playground()['divider'] as boolean);
  protected readonly pgSelected = signal<string>('photos');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgVariant() !== 'underlined') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgRadius() !== 'full') attrs.push(`radius="${this.pgRadius()}"`);
    if (this.pgPlacement() !== 'top') attrs.push(`placement="${this.pgPlacement()}"`);
    if (!this.pgFullWidth()) attrs.push('[fullWidth]="false"');
    if (!this.pgDivider()) attrs.push('[divider]="false"');
    attrs.push('[(selectedValue)]="tab"');
    return [
      `<dm-tabs ${attrs.join(' ')}>`,
      '  <dm-tab value="photos">Photos</dm-tab>',
      '  <dm-tab value="music">Music</dm-tab>',
      '  <dm-tab value="videos">Videos</dm-tab>',
      '  <dm-tab-panel value="photos">Photos content…</dm-tab-panel>',
      '  <dm-tab-panel value="music">Music content…</dm-tab-panel>',
      '  <dm-tab-panel value="videos">Videos content…</dm-tab-panel>',
      '</dm-tabs>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-tabs [(selectedValue)]="active">',
    '  <dm-tab value="photos">Photos</dm-tab>',
    '  <dm-tab value="music">Music</dm-tab>',
    '  <dm-tab value="videos">Videos</dm-tab>',
    '  <dm-tab-panel value="photos">Photos content…</dm-tab-panel>',
    '  <dm-tab-panel value="music">Music content…</dm-tab-panel>',
    '  <dm-tab-panel value="videos">Videos content…</dm-tab-panel>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly variantsCode = [
    '<dm-tabs variant="solid">…</dm-tabs>',
    '<dm-tabs variant="bordered">…</dm-tabs>',
    '<dm-tabs variant="light">…</dm-tabs>',
    '<dm-tabs variant="underlined">…</dm-tabs>',
    '<dm-tabs variant="segment" radius="full" [fullWidth]="false">…</dm-tabs>',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-tabs-variants',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './tabs-variants.component.html',",
    '})',
    'export class TabsVariantsComponent {}',
  ].join('\n');

  protected readonly segmentCode = [
    '<dm-tabs variant="segment" radius="full" [fullWidth]="false" [(selectedValue)]="view">',
    '  <dm-tab value="list">List</dm-tab>',
    '  <dm-tab value="grid">Grid</dm-tab>',
    '  <dm-tab value="map">Map</dm-tab>',
    '  <dm-tab-panel value="list">List view content…</dm-tab-panel>',
    '  <dm-tab-panel value="grid">Grid view content…</dm-tab-panel>',
    '  <dm-tab-panel value="map">Map view content…</dm-tab-panel>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly segmentTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-segment-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './segment-tabs.component.html',",
    '})',
    'export class SegmentTabsComponent {',
    "  protected readonly view = signal('list');",
    '}',
  ].join('\n');

  protected readonly segmentIconCode = [
    '<dm-tabs variant="segment" radius="full" [fullWidth]="false" [(selectedValue)]="view">',
    '  <dm-tab value="list">',
    '    <!-- Heroicon: list-bullet -->',
    '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    '         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
    '      <line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/>',
    '      <line x1="9" y1="18" x2="20" y2="18"/>',
    '      <circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    '    </svg>',
    '    <span>List</span>',
    '  </dm-tab>',
    '  <dm-tab value="grid">',
    '    <!-- Heroicon: squares-2x2 -->',
    '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    '         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
    '      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>',
    '      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    '    </svg>',
    '    <span>Grid</span>',
    '  </dm-tab>',
    '  <dm-tab value="map">',
    '    <!-- Heroicon: map-pin -->',
    '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    '         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
    '      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>',
    '      <circle cx="12" cy="10" r="3"/>',
    '    </svg>',
    '    <span>Map</span>',
    '  </dm-tab>',
    '  <dm-tab-panel value="list">List view content…</dm-tab-panel>',
    '  <dm-tab-panel value="grid">Grid view content…</dm-tab-panel>',
    '  <dm-tab-panel value="map">Map view content…</dm-tab-panel>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly segmentIconTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-segment-icon-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './segment-icon-tabs.component.html',",
    '})',
    'export class SegmentIconTabsComponent {',
    "  protected readonly view = signal('list');",
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-tabs color="primary">…</dm-tabs>',
    '<dm-tabs color="secondary">…</dm-tabs>',
    '<dm-tabs color="success">…</dm-tabs>',
    '<dm-tabs color="warning">…</dm-tabs>',
    '<dm-tabs color="danger">…</dm-tabs>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-tabs-colors',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './tabs-colors.component.html',",
    '})',
    'export class TabsColorsComponent {}',
  ].join('\n');

  protected readonly verticalCode = [
    '<dm-tabs placement="start" [(selectedValue)]="section">',
    '  <dm-tab value="account">Account</dm-tab>',
    '  <dm-tab value="billing">Billing</dm-tab>',
    '  <dm-tab value="security">Security</dm-tab>',
    '  <dm-tab-panel value="account">Account settings…</dm-tab-panel>',
    '  <dm-tab-panel value="billing">Billing details…</dm-tab-panel>',
    '  <dm-tab-panel value="security">Security options…</dm-tab-panel>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly verticalTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-vertical-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './vertical-tabs.component.html',",
    '})',
    'export class VerticalTabsComponent {',
    "  protected readonly section = signal('account');",
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideTabsDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideTabsDefaults({ variant: 'underlined', color: 'primary' }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly basicActive = signal<string>('photos');
  protected readonly variantSel1 = signal<string>('a');
  protected readonly variantSel2 = signal<string>('a');
  protected readonly variantSel3 = signal<string>('a');
  protected readonly variantSel4 = signal<string>('a');
  protected readonly variantSel5 = signal<string>('a');
  protected readonly segmentView = signal<string>('list');
  protected readonly segmentIconView = signal<string>('list');
  protected readonly colorPrimary = signal<string>('a');
  protected readonly colorSecondary = signal<string>('a');
  protected readonly colorSuccess = signal<string>('a');
  protected readonly colorWarning = signal<string>('a');
  protected readonly colorDanger = signal<string>('a');
  protected readonly section = signal<string>('account');
  protected readonly fullWidthSel = signal<string>('overview');
  protected readonly disabledSel = signal<string>('active');

  protected readonly fullWidthCode = [
    '<dm-tabs [fullWidth]="true" variant="light" color="primary" [(selectedValue)]="tab">',
    '  <dm-tab value="overview">Overview</dm-tab>',
    '  <dm-tab value="activity">Activity</dm-tab>',
    '  <dm-tab value="settings">Settings</dm-tab>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly fullWidthTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-full-width-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './full-width-tabs.component.html',",
    '})',
    'export class FullWidthTabsComponent {',
    "  protected readonly tab = signal('overview');",
    '}',
  ].join('\n');

  protected readonly disabledCode = [
    '<dm-tabs [(selectedValue)]="tab">',
    '  <dm-tab value="active">Active</dm-tab>',
    '  <dm-tab value="soon" [disabled]="true">Coming soon</dm-tab>',
    '  <dm-tab value="reports">Reports</dm-tab>',
    '</dm-tabs>',
  ].join('\n');

  protected readonly disabledTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-disabled-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './disabled-tabs.component.html',",
    '})',
    'export class DisabledTabsComponent {',
    "  protected readonly tab = signal('active');",
    '}',
  ].join('\n');

  // TS snippet for the basic example — shown in the demo-block "TS" tab.
  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmTabsComponent, DmTabComponent, DmTabPanelComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-media-tabs',",
    '  imports: [DmTabsComponent, DmTabComponent, DmTabPanelComponent],',
    "  templateUrl: './media-tabs.component.html',",
    '})',
    'export class MediaTabsComponent {',
    "  protected readonly active = signal('photos');",
    '}',
  ].join('\n');

  // Composition: profile card with tabbed sections
  protected readonly avatarSrc = `data:image/svg+xml;utf8,${encodeURIComponent(AVATAR_SVG)}`;
  protected readonly profileTab = signal<string>('overview');
  protected readonly emailNotifications = signal(true);
  protected readonly publicProfile = signal(false);

  protected readonly profileStats = [
    { label: 'Projects', value: '24' },
    { label: 'Followers', value: '1.2k' },
    { label: 'Commits', value: '3,418' },
  ];

  protected readonly profileActivity = [
    { initials: 'AL', text: 'Merged “Overlay primitives” into main', time: '2h ago' },
    { initials: 'GH', text: 'Grace Hopper reviewed your pull request', time: '5h ago' },
    { initials: 'AL', text: 'Published a new release', time: 'Yesterday' },
  ];

  protected readonly compositionCode = [
    '<!-- A profile section: card header (avatar + name + role badge) followed by',
    '     underlined tabs whose panels hold stats, an activity feed and settings. -->',
    '<dm-card padding="none" style="max-width: 26rem">',
    '  <header style="display: flex; align-items: center; gap: 0.875rem;',
    '                 padding: 1.25rem 1.25rem 1rem">',
    '    <dm-avatar [src]="avatar" alt="Ada Lovelace" size="lg" />',
    '    <div style="flex: 1; min-width: 0">',
    '      <div style="display: flex; align-items: center; gap: 0.5rem">',
    '        <strong>Ada Lovelace</strong>',
    '        <dm-badge color="primary" variant="flat" size="sm">Admin</dm-badge>',
    '      </div>',
    '      <p style="margin: 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">ada@example.com</p>',
    '    </div>',
    '  </header>',
    '',
    '  <div style="padding: 0 1.25rem 1.25rem">',
    '    <dm-tabs variant="underlined" color="primary" [(selectedValue)]="tab">',
    '      <dm-tab value="overview">Overview</dm-tab>',
    '      <dm-tab value="activity">Activity</dm-tab>',
    '      <dm-tab value="settings">Settings</dm-tab>',
    '',
    '      <dm-tab-panel value="overview">',
    '        <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));',
    '                    gap: 0.75rem; padding-top: 1rem">',
    '          @for (stat of stats; track stat.label) {',
    '            <div style="padding: 0.75rem; border-radius: var(--dm-radius-md);',
    '                        background: var(--dm-bg-muted)">',
    '              <p style="margin: 0; font-size: 0.75rem; color: var(--dm-fg-muted)">{{ stat.label }}</p>',
    '              <p style="margin: 0.125rem 0 0; font-size: 1.25rem; font-weight: 700">{{ stat.value }}</p>',
    '            </div>',
    '          }',
    '        </div>',
    '      </dm-tab-panel>',
    '',
    '      <dm-tab-panel value="activity">',
    '        <ul style="list-style: none; margin: 0; padding: 1rem 0 0; display: grid; gap: 0.875rem">',
    '          @for (item of activity; track item.text) {',
    '            <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem">',
    '              <dm-avatar [initials]="item.initials" size="sm" />',
    '              <span style="flex: 1; min-width: 0">{{ item.text }}</span>',
    '              <span style="font-size: 0.75rem; color: var(--dm-fg-muted)">{{ item.time }}</span>',
    '            </li>',
    '          }',
    '        </ul>',
    '      </dm-tab-panel>',
    '',
    '      <dm-tab-panel value="settings">',
    '        <div style="display: grid; gap: 1rem; padding-top: 1rem">',
    '          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '            <div>',
    '              <strong style="font-size: 0.875rem">Email notifications</strong>',
    '              <p style="margin: 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">',
    '                Weekly digest and mentions.',
    '              </p>',
    '            </div>',
    '            <dm-switch [(checked)]="emailNotifications" ariaLabel="Email notifications" />',
    '          </div>',
    '          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '            <div>',
    '              <strong style="font-size: 0.875rem">Public profile</strong>',
    '              <p style="margin: 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">',
    '                Visible to anyone with the link.',
    '              </p>',
    '            </div>',
    '            <dm-switch [(checked)]="publicProfile" ariaLabel="Public profile" />',
    '          </div>',
    '        </div>',
    '      </dm-tab-panel>',
    '    </dm-tabs>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmCardComponent,',
    '  DmSwitchComponent,',
    '  DmTabComponent,',
    '  DmTabPanelComponent,',
    '  DmTabsComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-profile-section',",
    '  imports: [',
    '    DmCardComponent,',
    '    DmAvatarComponent,',
    '    DmBadgeComponent,',
    '    DmSwitchComponent,',
    '    DmTabsComponent,',
    '    DmTabComponent,',
    '    DmTabPanelComponent,',
    '  ],',
    "  templateUrl: './profile-section.component.html',",
    '})',
    'export class ProfileSectionComponent {',
    "  protected readonly avatar = 'assets/ada.png';",
    "  protected readonly tab = signal('overview');",
    '  protected readonly emailNotifications = signal(true);',
    '  protected readonly publicProfile = signal(false);',
    '',
    '  protected readonly stats = [',
    "    { label: 'Projects', value: '24' },",
    "    { label: 'Followers', value: '1.2k' },",
    "    { label: 'Commits', value: '3,418' },",
    '  ];',
    '',
    '  protected readonly activity = [',
    "    { initials: 'AL', text: 'Merged “Overlay primitives” into main', time: '2h ago' },",
    "    { initials: 'GH', text: 'Grace Hopper reviewed your pull request', time: '5h ago' },",
    "    { initials: 'AL', text: 'Published a new release', time: 'Yesterday' },",
    '  ];',
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'selectedValue',
        type: 'string',
        default: 'first enabled',
        description: api['selectedValue'],
      },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'solid' | 'bordered' | 'light' | 'underlined' | 'segment'",
        default: "'solid'",
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'full'",
        description: api['radius'],
      },
      {
        name: 'placement',
        type: "'top' | 'start'",
        default: "'top'",
        description: api['placement'],
      },
      { name: 'fullWidth', type: 'boolean', default: 'true', description: api['fullWidth'] },
      { name: 'divider', type: 'boolean', default: 'true', description: api['divider'] },
      { name: 'lazy', type: 'boolean', default: 'false', description: api['lazy'] },
      { name: 'value (tab)', type: 'string', default: '—', description: api['tabValue'] },
      { name: 'value (panel)', type: 'string', default: '—', description: api['panelValue'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
    ];
  });
}
