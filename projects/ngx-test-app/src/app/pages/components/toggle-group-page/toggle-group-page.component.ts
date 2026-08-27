import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmCardComponent,
  DmIconComponent,
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
    DmCardComponent,
    DmIconComponent,
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

  // Demo signals
  protected readonly view = signal<unknown>('list');
  protected readonly range = signal<unknown>('week');
  protected readonly format = signal<unknown[]>(['bold']);
  protected readonly align = signal<unknown>('left');
  protected readonly colorView = signal<unknown>('grid');
  protected readonly sizeView = signal<unknown>('grid');
  protected readonly fullView = signal<unknown>('day');
  protected readonly vertView = signal<unknown>('list');

  // Demo code
  protected readonly singleCode = [
    '<dm-toggle-group [(value)]="view" ariaLabel="Layout">',
    '  <dm-toggle value="list">List</dm-toggle>',
    '  <dm-toggle value="grid">Grid</dm-toggle>',
    '  <dm-toggle value="table">Table</dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly singleTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-view-toggle',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './view-toggle.component.html',",
    '})',
    'export class ViewToggleComponent {',
    "  protected readonly view = signal('list');",
    '}',
  ].join('\n');

  protected readonly multipleCode = [
    '<!-- multiple → independent aria-pressed toggles, [(values)] is an array -->',
    '<dm-toggle-group multiple [(values)]="format" color="primary" ariaLabel="Text format">',
    '  <dm-toggle value="bold" ariaLabel="Bold"><strong>B</strong></dm-toggle>',
    '  <dm-toggle value="italic" ariaLabel="Italic"><em>I</em></dm-toggle>',
    '  <dm-toggle value="underline" ariaLabel="Underline"><u>U</u></dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly multipleTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-format-toggle',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './format-toggle.component.html',",
    '})',
    'export class FormatToggleComponent {',
    "  protected readonly format = signal(['bold']);",
    '}',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-toggle-group color="primary" [(value)]="view">…</dm-toggle-group>',
    '<dm-toggle-group color="success" [(value)]="view">…</dm-toggle-group>',
    '<dm-toggle-group color="danger" [(value)]="view">…</dm-toggle-group>',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-colors-demo',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './colors-demo.component.html',",
    '})',
    'export class ColorsDemoComponent {',
    "  protected readonly view = signal('grid');",
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-toggle-group size="sm" [(value)]="view">…</dm-toggle-group>',
    '<dm-toggle-group size="md" [(value)]="view">…</dm-toggle-group>',
    '<dm-toggle-group size="lg" [(value)]="view">…</dm-toggle-group>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-sizes-demo',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './sizes-demo.component.html',",
    '})',
    'export class SizesDemoComponent {',
    "  protected readonly view = signal('grid');",
    '}',
  ].join('\n');

  protected readonly fullWidthCode = [
    '<!-- fullWidth stretches the group; segments share the width equally -->',
    '<dm-toggle-group fullWidth [(value)]="range" ariaLabel="Range">',
    '  <dm-toggle value="day">Day</dm-toggle>',
    '  <dm-toggle value="week">Week</dm-toggle>',
    '  <dm-toggle value="month">Month</dm-toggle>',
    '</dm-toggle-group>',
  ].join('\n');

  protected readonly fullWidthTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-range-toggle',",
    '  imports: [DmToggleGroupComponent, DmToggleComponent],',
    "  templateUrl: './range-toggle.component.html',",
    '})',
    'export class RangeToggleComponent {',
    "  protected readonly range = signal('day');",
    '}',
  ].join('\n');

  // Composition — dashboard header whose range switcher (single) and a
  // toolbar of alignment toggles (single, icon-only) drive a live caption.
  protected readonly dashRange = signal<unknown>('week');
  protected readonly dashAlign = signal<unknown>('left');

  protected readonly rangeCaption = computed(() => {
    const labels = this.page().labels;
    const key = this.dashRange();
    return typeof key === 'string' ? labels[key] : '';
  });

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 30rem">',
    '  <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '    <strong>Analytics</strong>',
    '    <dm-toggle-group size="sm" [(value)]="range" ariaLabel="Range">',
    '      <dm-toggle value="day">Day</dm-toggle>',
    '      <dm-toggle value="week">Week</dm-toggle>',
    '      <dm-toggle value="month">Month</dm-toggle>',
    '    </dm-toggle-group>',
    '  </div>',
    '',
    '  <p style="color: var(--dm-fg-muted)">Showing data for {{ range() }}.</p>',
    '',
    '  <dm-toggle-group size="sm" color="primary" [(value)]="align" ariaLabel="Text align">',
    '    <dm-toggle value="left" ariaLabel="Align left"><dm-icon>format_align_left</dm-icon></dm-toggle>',
    '    <dm-toggle value="center" ariaLabel="Align center"><dm-icon>format_align_center</dm-icon></dm-toggle>',
    '    <dm-toggle value="right" ariaLabel="Align right"><dm-icon>format_align_right</dm-icon></dm-toggle>',
    '  </dm-toggle-group>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmCardComponent, DmIconComponent, DmToggleComponent, DmToggleGroupComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-analytics-header',",
    '  imports: [DmCardComponent, DmToggleGroupComponent, DmToggleComponent, DmIconComponent],',
    "  templateUrl: './analytics-header.component.html',",
    '})',
    'export class AnalyticsHeaderComponent {',
    "  protected readonly range = signal('week');",
    "  protected readonly align = signal('left');",
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
