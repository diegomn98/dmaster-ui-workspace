import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
  DmTableColumn,
  DmTableComponent,
  DmToggleComponent,
  DmToggleGroupColor,
  DmToggleGroupComponent,
  DmToggleGroupOrientation,
  DmToggleGroupSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-toggle-group-page',
  imports: [
    DmToggleGroupComponent,
    DmToggleComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DmTableComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './toggle-group-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.toggleGroup);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'default',
    size: 'md',
    orientation: 'horizontal',
    fullWidth: false,
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
    {
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
      ],
    },
    { key: 'fullWidth', label: 'fullWidth', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmToggleGroupColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmToggleGroupSize);
  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmToggleGroupOrientation,
  );
  protected readonly pgFullWidth = computed(() => this.playground()['fullWidth'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgValue = signal<unknown>('list');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'default') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgOrientation() !== 'horizontal') attrs.push(`orientation="${this.pgOrientation()}"`);
    if (this.pgFullWidth()) attrs.push('fullWidth');
    if (this.pgDisabled()) attrs.push('disabled');
    attrs.push('[(value)]="view"');
    attrs.push('ariaLabel="Layout"');
    return [
      `<dm-toggle-group ${attrs.join(' ')}>`,
      '  <dm-toggle value="list">List</dm-toggle>',
      '  <dm-toggle value="grid">Grid</dm-toggle>',
      '  <dm-toggle value="table">Table</dm-toggle>',
      '</dm-toggle-group>',
    ].join('\n');
  });

  // ---- Demo state ----------------------------------------------------------
  protected readonly view = signal<unknown>('list');
  protected readonly format = signal<unknown[]>(['bold']);
  protected readonly iconView = signal<unknown>('grid');
  protected readonly align = signal<unknown>('left');
  protected readonly colorView = signal<unknown>('grid');
  protected readonly sizeView = signal<unknown>('grid');
  protected readonly fullView = signal<unknown>('week');
  protected readonly sortView = signal<unknown>('newest');

  /** People rendered by the live view switcher. */
  protected readonly people = [
    { name: 'Ada Lovelace', role: 'Owner', initials: 'AL' },
    { name: 'Alan Turing', role: 'Admin', initials: 'AT' },
    { name: 'Grace Hopper', role: 'Editor', initials: 'GH' },
    { name: 'Katherine Johnson', role: 'Editor', initials: 'KJ' },
    { name: 'Linus Torvalds', role: 'Viewer', initials: 'LT' },
    { name: 'Margaret Hamilton', role: 'Admin', initials: 'MH' },
  ];
  protected readonly byName = (p: { name: string }) => p.name;
  protected readonly peopleColumns = computed<DmTableColumn<{ name: string; role: string }>[]>(
    () => [
      { key: 'name', header: this.page().labels['name'], nowrap: true },
      { key: 'role', header: this.page().labels['role'] },
    ],
  );

  protected readonly bold = computed(() => this.format().includes('bold'));
  protected readonly italic = computed(() => this.format().includes('italic'));
  protected readonly underline = computed(() => this.format().includes('underline'));

  // ---- Demo code -------------------------------------------------------------
  protected readonly singleCode = [
    '<!-- One thumb glides between segments; arrows move AND select -->',
    '<dm-toggle-group [(value)]="view" ariaLabel="Layout">',
    '  <dm-toggle value="list">List</dm-toggle>',
    '  <dm-toggle value="grid">Grid</dm-toggle>',
    '  <dm-toggle value="table">Table</dm-toggle>',
    '</dm-toggle-group>',
    '',
    '@switch (view()) {',
    '  @case (\'grid\') { <app-people-grid [people]="people" /> }',
    '  @case (\'table\') { <dm-table density="compact" [columns]="columns" [data]="people" /> }',
    '  @default { <app-people-list [people]="people" /> }',
    '}',
  ].join('\n');

  protected readonly singleTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-view-switcher',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './view-switcher.component.html',",
    '})',
    'export class ViewSwitcherComponent {',
    "  protected readonly view = signal<'list' | 'grid' | 'table'>('list');",
    '  protected readonly people = [/* … */];',
    '}',
  ].join('\n');

  protected readonly multipleCode = [
    '<!-- multiple: independent aria-pressed toggles, [(values)] is an array -->',
    '<dm-toggle-group multiple [(values)]="format" color="primary" ariaLabel="Text format">',
    '  <dm-toggle value="bold" ariaLabel="Bold"><strong>B</strong></dm-toggle>',
    '  <dm-toggle value="italic" ariaLabel="Italic"><em>I</em></dm-toggle>',
    '  <dm-toggle value="underline" ariaLabel="Underline"><u>U</u></dm-toggle>',
    '</dm-toggle-group>',
    '',
    '<p',
    '  [style.font-weight]="bold() ? 700 : 400"',
    "  [style.font-style]=\"italic() ? 'italic' : 'normal'\"",
    "  [style.text-decoration]=\"underline() ? 'underline' : 'none'\"",
    '>',
    '  The quick brown fox jumps over the lazy dog.',
    '</p>',
  ].join('\n');

  protected readonly multipleTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-format-toolbar',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './format-toolbar.component.html',",
    '})',
    'export class FormatToolbarComponent {',
    "  protected readonly format = signal<string[]>(['bold']);",
    "  protected readonly bold = computed(() => this.format().includes('bold'));",
    "  protected readonly italic = computed(() => this.format().includes('italic'));",
    "  protected readonly underline = computed(() => this.format().includes('underline'));",
    '}',
  ].join('\n');

  protected readonly iconsCode = [
    '<!-- Icon + label: the icon inherits the segment color -->',
    '<dm-toggle-group [(value)]="view" ariaLabel="Layout">',
    '  <dm-toggle value="list"><dm-icon size="1.125rem">view_list</dm-icon> List</dm-toggle>',
    '  <dm-toggle value="grid"><dm-icon size="1.125rem">grid_view</dm-icon> Grid</dm-toggle>',
    '  <dm-toggle value="board"><dm-icon size="1.125rem">view_kanban</dm-icon> Board</dm-toggle>',
    '</dm-toggle-group>',
    '',
    '<!-- Icon-only: every segment needs an ariaLabel -->',
    '<dm-toggle-group color="primary" [(value)]="align" ariaLabel="Text align">',
    '  <dm-toggle value="left" ariaLabel="Align left"><dm-icon size="1.125rem">format_align_left</dm-icon></dm-toggle>',
    '  <dm-toggle value="center" ariaLabel="Align center"><dm-icon size="1.125rem">format_align_center</dm-icon></dm-toggle>',
    '  <dm-toggle value="right" ariaLabel="Align right"><dm-icon size="1.125rem">format_align_right</dm-icon></dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly iconsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-icon-toggles',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent, DmIconComponent],',
    "  templateUrl: './icon-toggles.component.html',",
    '})',
    'export class IconTogglesComponent {',
    "  protected readonly view = signal('grid');",
    "  protected readonly align = signal('left');",
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-toggle-group color="primary" [(value)]="view" ariaLabel="Primary">…</dm-toggle-group>',
    '<dm-toggle-group color="success" [(value)]="view" ariaLabel="Success">…</dm-toggle-group>',
    '<dm-toggle-group color="danger" [(value)]="view" ariaLabel="Danger">…</dm-toggle-group>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-toggle-colors',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './toggle-colors.component.html',",
    '})',
    'export class ToggleColorsComponent {',
    "  protected readonly view = signal('grid');",
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<!-- 32 / 40 / 48px outer — flush with a button or a field of the same size -->',
    '<dm-toggle-group size="sm" [(value)]="view" ariaLabel="Layout">…</dm-toggle-group>',
    '<dm-button size="sm" variant="bordered">Export</dm-button>',
    '',
    '<dm-toggle-group size="md" [(value)]="view" ariaLabel="Layout">…</dm-toggle-group>',
    '<dm-button size="md" variant="bordered">Export</dm-button>',
    '',
    '<dm-toggle-group size="lg" [(value)]="view" ariaLabel="Layout">…</dm-toggle-group>',
    '<dm-button size="lg" variant="bordered">Export</dm-button>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent, DmButtonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-toggle-sizes',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent, DmButtonComponent],',
    "  templateUrl: './toggle-sizes.component.html',",
    '})',
    'export class ToggleSizesComponent {',
    "  protected readonly view = signal('grid');",
    '}',
  ].join('\n');

  protected readonly layoutCode = [
    '<!-- fullWidth: the group fills its container, segments share the width -->',
    '<dm-toggle-group fullWidth [(value)]="range" ariaLabel="Range">',
    '  <dm-toggle value="day">Day</dm-toggle>',
    '  <dm-toggle value="week">Week</dm-toggle>',
    '  <dm-toggle value="month">Month</dm-toggle>',
    '</dm-toggle-group>',
    '',
    '<!-- vertical: the thumb slides up and down instead -->',
    '<dm-toggle-group orientation="vertical" [(value)]="sort" ariaLabel="Sort by">',
    '  <dm-toggle value="newest">Newest</dm-toggle>',
    '  <dm-toggle value="oldest">Oldest</dm-toggle>',
    '  <dm-toggle value="popular">Popular</dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly layoutTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-toggle-layouts',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './toggle-layouts.component.html',",
    '})',
    'export class ToggleLayoutsComponent {',
    "  protected readonly range = signal('week');",
    "  protected readonly sort = signal('newest');",
    '}',
  ].join('\n');

  // ---- Composition: pricing with a billing-period switch ------------------
  protected readonly billing = signal<unknown>('monthly');
  protected readonly currentPlan = 'starter';
  protected readonly plans = [
    {
      key: 'starter',
      nameKey: 'planStarter',
      descKey: 'planStarterDesc',
      monthly: 9,
      popular: false,
    },
    { key: 'pro', nameKey: 'planPro', descKey: 'planProDesc', monthly: 19, popular: true },
    { key: 'team', nameKey: 'planTeam', descKey: 'planTeamDesc', monthly: 39, popular: false },
  ];

  /** Yearly billing takes 20% off the monthly price. */
  protected price(monthly: number): string {
    return `$${this.billing() === 'yearly' ? Math.round(monthly * 0.8) : monthly}`;
  }

  protected readonly compositionCode = [
    '<dm-card>',
    '  <div class="pricing__head">',
    '    <strong>Choose a plan</strong>',
    '    <dm-toggle-group size="sm" [(value)]="billing" ariaLabel="Billing">',
    '      <dm-toggle value="monthly">Monthly</dm-toggle>',
    '      <dm-toggle value="yearly">Yearly <span class="pricing__save">−20%</span></dm-toggle>',
    '    </dm-toggle-group>',
    '  </div>',
    '',
    '  <div class="pricing__grid">',
    '    @for (p of plans; track p.key) {',
    '      <div class="pricing__plan" [class.pricing__plan--popular]="p.popular">',
    '        <strong>{{ p.name }}</strong>',
    '        @if (p.popular) {',
    '          <dm-badge color="primary" variant="flat" size="sm">Most popular</dm-badge>',
    '        }',
    '        <p class="pricing__price">{{ price(p.monthly) }}<span>/mo</span></p>',
    "        <p class=\"muted\">{{ billing() === 'yearly' ? 'billed yearly' : 'billed monthly' }}</p>",
    '        <p class="muted">{{ p.description }}</p>',
    '        <dm-button',
    '          size="sm"',
    "          [color]=\"p.popular ? 'primary' : 'default'\"",
    "          [variant]=\"p.popular ? 'solid' : 'bordered'\"",
    '          [disabled]="p.key === currentPlan"',
    '        >',
    "          {{ p.key === currentPlan ? 'Current plan' : 'Upgrade' }}",
    '        </dm-button>',
    '      </div>',
    '    }',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmToggleComponent,',
    '  DmToggleGroupComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pricing',",
    '  imports: [',
    '    DmCardComponent,',
    '    DmToggleGroupComponent,',
    '    DmToggleComponent,',
    '    DmBadgeComponent,',
    '    DmButtonComponent,',
    '  ],',
    "  templateUrl: './pricing.component.html',",
    '})',
    'export class PricingComponent {',
    "  protected readonly billing = signal<'monthly' | 'yearly'>('monthly');",
    "  protected readonly currentPlan = 'starter';",
    '  protected readonly plans = [',
    "    { key: 'starter', name: 'Starter', description: 'For side projects', monthly: 9, popular: false },",
    "    { key: 'pro', name: 'Pro', description: 'For growing teams', monthly: 19, popular: true },",
    "    { key: 'team', name: 'Team', description: 'For whole companies', monthly: 39, popular: false },",
    '  ];',
    '',
    '  // Yearly billing takes 20% off the monthly price.',
    '  protected price(monthly: number): string {',
    "    return `$${this.billing() === 'yearly' ? Math.round(monthly * 0.8) : monthly}`;",
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideToggleGroupDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideToggleGroupDefaults({ color: 'primary', size: 'lg' }),",
    ']',
  ].join('\n');

  protected readonly formCode = [
    '<dm-toggle-group [formControl]="view" ariaLabel="Layout">',
    '  <dm-toggle value="list">List</dm-toggle>',
    '  <dm-toggle value="grid">Grid</dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly formTs = [
    "import { Component } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-form-toggle',",
    '  imports: [ReactiveFormsModule, DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './form-toggle.component.html',",
    '})',
    'export class FormToggleComponent {',
    "  protected readonly view = new FormControl('grid');",
    '}',
  ].join('\n');

  protected readonly formView = new FormControl<string>('grid');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'multiple', type: 'boolean', default: 'false', description: api['multiple'] },
      { name: 'value', type: 'unknown', default: 'null', description: api['value'] },
      { name: 'values', type: 'unknown[]', default: '[]', description: api['values'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: api['orientation'],
      },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: api['fullWidth'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['groupAriaLabel'] },
      {
        name: 'dm-toggle · value',
        type: 'unknown',
        default: '—',
        description: api['toggleValue'],
      },
      {
        name: 'dm-toggle · disabled',
        type: 'boolean',
        default: 'false',
        description: api['toggleDisabled'],
      },
      {
        name: 'dm-toggle · ariaLabel',
        type: 'string',
        default: "''",
        description: api['toggleAriaLabel'],
      },
    ];
  });
}
