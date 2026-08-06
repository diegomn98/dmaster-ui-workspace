import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
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

@Component({
  selector: 'app-tabs-page',
  imports: [
    DmTabsComponent,
    DmTabComponent,
    DmTabPanelComponent,
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

  protected readonly colorsCode = [
    '<dm-tabs color="primary">…</dm-tabs>',
    '<dm-tabs color="secondary">…</dm-tabs>',
    '<dm-tabs color="success">…</dm-tabs>',
    '<dm-tabs color="warning">…</dm-tabs>',
    '<dm-tabs color="danger">…</dm-tabs>',
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

  protected readonly disabledCode = [
    '<dm-tabs [(selectedValue)]="tab">',
    '  <dm-tab value="active">Active</dm-tab>',
    '  <dm-tab value="soon" [disabled]="true">Coming soon</dm-tab>',
    '  <dm-tab value="reports">Reports</dm-tab>',
    '</dm-tabs>',
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
      { name: 'value (tab)', type: 'string', default: '—', description: api['tabValue'] },
      { name: 'value (panel)', type: 'string', default: '—', description: api['panelValue'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
    ];
  });
}
