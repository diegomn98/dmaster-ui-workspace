import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmBadgeColor,
  DmBadgeComponent,
  DmBadgeRadius,
  DmBadgeSize,
  DmBadgeVariant,
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

const COLORS: DmBadgeColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
const VARIANTS: DmBadgeVariant[] = ['solid', 'flat', 'bordered', 'light', 'dot', 'shadow'];

@Component({
  selector: 'app-badge-page',
  imports: [
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './badge-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.badge);

  protected readonly colors = COLORS;
  protected readonly variants = VARIANTS;

  protected readonly playground = signal<PropValues>({
    color: 'primary',
    variant: 'flat',
    size: 'md',
    radius: 'full',
    text: 'Badge',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: COLORS.map((value) => ({ label: value, value })),
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: VARIANTS.map((value) => ({ label: value, value })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((value) => ({ label: value, value })),
    },
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: ['sm', 'md', 'lg', 'full'].map((value) => ({ label: value, value })),
    },
    { key: 'text', label: 'text', type: 'text', placeholder: 'Badge' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmBadgeColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmBadgeVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmBadgeSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmBadgeRadius);
  protected readonly pgText = computed(() => (this.playground()['text'] as string) || 'Badge');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'default') {
      attrs.push(`color="${this.pgColor()}"`);
    }
    if (this.pgVariant() !== 'flat') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgRadius() !== 'full') {
      attrs.push(`radius="${this.pgRadius()}"`);
    }
    const open = attrs.length > 0 ? `<dm-badge ${attrs.join(' ')}>` : '<dm-badge>';
    return `${open}${this.pgText()}</dm-badge>`;
  });

  // Match the live preview: data-driven with @for so the class actually needs
  // the `colors` array. HTML + TS tell the same story now.
  protected readonly colorsCode = [
    '@for (c of colors; track c) {',
    '  <dm-badge [color]="c">{{ c }}</dm-badge>',
    '}',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeColor, DmBadgeComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-badge-colors',",
    '  imports: [DmBadgeComponent],',
    "  templateUrl: './badge-colors.component.html',",
    '})',
    'export class BadgeColorsComponent {',
    '  protected readonly colors: DmBadgeColor[] = [',
    "    'default', 'primary', 'secondary', 'success', 'warning', 'danger',",
    '  ];',
    '}',
  ].join('\n');

  protected readonly variantsCode = [
    '@for (v of variants; track v) {',
    '  <dm-badge color="primary" [variant]="v">{{ v }}</dm-badge>',
    '}',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeComponent, DmBadgeVariant } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-badge-variants',",
    '  imports: [DmBadgeComponent],',
    "  templateUrl: './badge-variants.component.html',",
    '})',
    'export class BadgeVariantsComponent {',
    '  protected readonly variants: DmBadgeVariant[] = [',
    "    'solid', 'flat', 'bordered', 'light', 'dot', 'shadow',",
    '  ];',
    '}',
  ].join('\n');

  protected readonly sizesRadiusCode = [
    '<!-- Two sizes -->',
    '<dm-badge color="primary" size="sm">sm</dm-badge>',
    '<dm-badge color="primary" size="md">md</dm-badge>',
    '',
    '<!-- Radius scale — full (pill) is the default -->',
    '<dm-badge color="primary" radius="sm">sm</dm-badge>',
    '<dm-badge color="primary" radius="md">md</dm-badge>',
    '<dm-badge color="primary" radius="lg">lg</dm-badge>',
    '<dm-badge color="primary" radius="full">full</dm-badge>',
  ].join('\n');

  protected readonly sizesRadiusTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-badge-sizes',",
    '  imports: [DmBadgeComponent],',
    "  templateUrl: './badge-sizes.component.html',",
    '})',
    'export class BadgeSizesComponent {}',
  ].join('\n');

  protected readonly dotCode = [
    '<dm-badge color="success" variant="dot">Active</dm-badge>',
    '<dm-badge color="warning" variant="dot">Degraded</dm-badge>',
    '<dm-badge color="danger" variant="dot">Down</dm-badge>',
  ].join('\n');

  protected readonly dotTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-badge-status',",
    '  imports: [DmBadgeComponent],',
    "  templateUrl: './badge-status.component.html',",
    '})',
    'export class BadgeStatusComponent {}',
  ].join('\n');

  protected readonly withIconCode = [
    "<!-- Project a dm-icon before the text; the badge's own gap spaces it. -->",
    '<dm-badge color="success" variant="flat">',
    '  <dm-icon name="check-circle" size="1em" />Verified',
    '</dm-badge>',
    '<dm-badge color="primary" variant="solid">',
    '  <dm-icon name="zap" size="1em" />Pro',
    '</dm-badge>',
    '<dm-badge color="warning" variant="flat">',
    '  <dm-icon name="star" size="1em" />Featured',
    '</dm-badge>',
    '<dm-badge color="secondary" variant="bordered">',
    '  <dm-icon name="shield-check" size="1em" />Secure',
    '</dm-badge>',
  ].join('\n');

  protected readonly withIconTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-badge-with-icon',",
    '  imports: [DmBadgeComponent, DmIconComponent],',
    "  templateUrl: './badge-with-icon.component.html',",
    '})',
    'export class BadgeWithIconComponent {}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A project card: badges carry the plan, live status, tags and counts. -->',
    '<dm-card style="max-width: 26rem">',
    '  <div style="display: flex; align-items: flex-start; gap: 0.75rem">',
    '    <dm-icon name="box" size="lg" style="color: var(--dm-primary)" />',
    '    <div style="flex: 1; min-width: 0">',
    '      <div style="display: flex; align-items: center; gap: 0.5rem">',
    '        <strong>Design System</strong>',
    '        <dm-badge color="primary" variant="flat" size="sm">Pro</dm-badge>',
    '      </div>',
    '      <p class="muted">&#64;dmaster/ui · updated 2h ago</p>',
    '    </div>',
    '    <dm-badge color="success" variant="dot" size="sm">Deployed</dm-badge>',
    '  </div>',
    '',
    '  <div style="display: flex; flex-wrap: wrap; gap: 0.375rem">',
    '    <dm-badge variant="bordered" size="sm">angular</dm-badge>',
    '    <dm-badge variant="bordered" size="sm">typescript</dm-badge>',
    '    <dm-badge variant="bordered" size="sm">a11y</dm-badge>',
    '  </div>',
    '',
    '  <div style="display: flex; align-items: center; gap: 0.5rem">',
    '    <dm-badge color="danger" variant="flat" size="sm">',
    '      <dm-icon name="warning" size="1em" />3 issues',
    '    </dm-badge>',
    '    <dm-badge color="secondary" variant="flat" size="sm">',
    '      <dm-icon name="star" size="1em" />128',
    '    </dm-badge>',
    '    <dm-button size="sm" variant="bordered">View</dm-button>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  // Static composition — the template hardcodes real copy for a project card,
  // so no page state is needed. The class body is empty on purpose.
  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-project-card',",
    '  imports: [DmBadgeComponent, DmButtonComponent, DmCardComponent, DmIconComponent],',
    "  templateUrl: './project-card.component.html',",
    '})',
    'export class ProjectCardComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideBadgeDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideBadgeDefaults({ variant: 'bordered' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'solid' | 'flat' | 'bordered' | 'light' | 'dot' | 'shadow'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
      {
        name: 'radius',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'full'",
        description: api['radius'],
      },
    ];
  });
}
