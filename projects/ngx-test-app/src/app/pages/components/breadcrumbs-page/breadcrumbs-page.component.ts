import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmBadgeComponent,
  DmBreadcrumbItemComponent,
  DmBreadcrumbsComponent,
  DmBreadcrumbsSize,
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-breadcrumbs-page',
  imports: [
    DmBreadcrumbsComponent,
    DmBreadcrumbItemComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './breadcrumbs-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.breadcrumbs);

  // Playground
  protected readonly playground = signal<PropValues>({
    size: 'md',
    separator: '',
  });

  protected readonly controls: PropControl[] = [
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
    { key: 'separator', label: 'separator', type: 'text', placeholder: '/' },
  ];

  protected readonly pgSize = computed(() => this.playground()['size'] as DmBreadcrumbsSize);
  protected readonly pgSeparator = computed(() => this.playground()['separator'] as string);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgSeparator()) attrs.push(`separator="${this.pgSeparator()}"`);
    const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    return [
      `<dm-breadcrumbs${attrStr}>`,
      '  <dm-breadcrumb-item href="/">Home</dm-breadcrumb-item>',
      '  <dm-breadcrumb-item href="/library">Library</dm-breadcrumb-item>',
      '  <dm-breadcrumb-item>Data</dm-breadcrumb-item>',
      '</dm-breadcrumbs>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-breadcrumbs ariaLabel="Breadcrumb">',
    '  <dm-breadcrumb-item href="/">Home</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/library">Library</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item>Data</dm-breadcrumb-item>',
    '</dm-breadcrumbs>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-breadcrumbs-basic',",
    '  imports: [DmBreadcrumbsComponent, DmBreadcrumbItemComponent],',
    "  templateUrl: './breadcrumbs-basic.component.html',",
    '})',
    'export class BreadcrumbsBasicComponent {}',
  ].join('\n');

  protected readonly separatorCode = [
    '<dm-breadcrumbs separator="/">',
    '  <dm-breadcrumb-item href="/">Home</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/docs">Docs</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item>Breadcrumbs</dm-breadcrumb-item>',
    '</dm-breadcrumbs>',
  ].join('\n');

  protected readonly separatorTs = [
    "import { Component } from '@angular/core';",
    "import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-breadcrumbs-separator',",
    '  imports: [DmBreadcrumbsComponent, DmBreadcrumbItemComponent],',
    "  templateUrl: './breadcrumbs-separator.component.html',",
    '})',
    'export class BreadcrumbsSeparatorComponent {}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-breadcrumbs size="sm">…</dm-breadcrumbs>',
    '<dm-breadcrumbs size="md">…</dm-breadcrumbs>',
    '<dm-breadcrumbs size="lg">…</dm-breadcrumbs>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-breadcrumbs-sizes',",
    '  imports: [DmBreadcrumbsComponent, DmBreadcrumbItemComponent],',
    "  templateUrl: './breadcrumbs-sizes.component.html',",
    '})',
    'export class BreadcrumbsSizesComponent {}',
  ].join('\n');

  protected readonly disabledCode = [
    '<dm-breadcrumbs>',
    '  <dm-breadcrumb-item href="/">Home</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/admin" [disabled]="true">Admin</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item>Users</dm-breadcrumb-item>',
    '</dm-breadcrumbs>',
  ].join('\n');

  protected readonly disabledTs = [
    "import { Component } from '@angular/core';",
    "import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-breadcrumbs-disabled',",
    '  imports: [DmBreadcrumbsComponent, DmBreadcrumbItemComponent],',
    "  templateUrl: './breadcrumbs-disabled.component.html',",
    '})',
    'export class BreadcrumbsDisabledComponent {}',
  ].join('\n');

  protected readonly collapseCode = [
    '<dm-breadcrumbs [maxItems]="4" [itemsBeforeCollapse]="1" [itemsAfterCollapse]="2">',
    '  <dm-breadcrumb-item href="/">Home</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/a">Section</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/a/b">Category</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item href="/a/b/c">Subcategory</dm-breadcrumb-item>',
    '  <dm-breadcrumb-item>Item</dm-breadcrumb-item>',
    '</dm-breadcrumbs>',
  ].join('\n');

  protected readonly collapseTs = [
    "import { Component } from '@angular/core';",
    "import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-breadcrumbs-collapse',",
    '  imports: [DmBreadcrumbsComponent, DmBreadcrumbItemComponent],',
    "  templateUrl: './breadcrumbs-collapse.component.html',",
    '})',
    'export class BreadcrumbsCollapseComponent {}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A page header: breadcrumb trail on top, then title + status -->',
    '<!-- badge and description on the left, actions cluster on the right. -->',
    '<dm-card style="max-width: 40rem">',
    '  <dm-breadcrumbs size="sm" ariaLabel="Page location">',
    '    <dm-breadcrumb-item href="/">',
    '      <span style="display: inline-flex; align-items: center; gap: 0.35rem">',
    '        <dm-icon name="home" size="1em" /> Home',
    '      </span>',
    '    </dm-breadcrumb-item>',
    '    <dm-breadcrumb-item href="/projects">Projects</dm-breadcrumb-item>',
    '    <dm-breadcrumb-item>Design system</dm-breadcrumb-item>',
    '  </dm-breadcrumbs>',
    '',
    '  <div class="page-header">',
    '    <div class="page-header__text">',
    '      <h1>Design system <dm-badge color="warning" variant="flat" size="sm">Draft</dm-badge></h1>',
    '      <p class="muted">Tokens, components and guidelines shared across every product surface.</p>',
    '    </div>',
    '    <div class="page-header__actions">',
    '      <dm-button variant="bordered" color="default">',
    '        <dm-icon name="external-link" size="1.15em" /> Share',
    '      </dm-button>',
    '      <dm-button color="primary">',
    '        <dm-icon name="check" size="1.15em" /> Publish',
    '      </dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmBreadcrumbItemComponent,',
    '  DmBreadcrumbsComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-page-header',",
    '  imports: [',
    '    DmBadgeComponent,',
    '    DmBreadcrumbItemComponent,',
    '    DmBreadcrumbsComponent,',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmIconComponent,',
    '  ],',
    "  templateUrl: './page-header.component.html',",
    '})',
    'export class PageHeaderComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideBreadcrumbsDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideBreadcrumbsDefaults({ ariaLabel: 'You are here', size: 'lg' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'separator', type: 'string', default: "'' (chevron)", description: api['separator'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "'Breadcrumbs'",
        description: api['ariaLabel'],
      },
      { name: 'maxItems', type: 'number | null', default: 'null', description: api['maxItems'] },
      {
        name: 'itemsBeforeCollapse',
        type: 'number',
        default: '1',
        description: api['itemsBeforeCollapse'],
      },
      {
        name: 'itemsAfterCollapse',
        type: 'number',
        default: '2',
        description: api['itemsAfterCollapse'],
      },
      { name: 'href (item)', type: 'string', default: '—', description: api['href'] },
      { name: 'disabled (item)', type: 'boolean', default: 'false', description: api['disabled'] },
    ];
  });
}
