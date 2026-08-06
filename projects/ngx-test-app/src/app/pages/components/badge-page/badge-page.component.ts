import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmBadgeColor,
  DmBadgeComponent,
  DmBadgeRadius,
  DmBadgeSize,
  DmBadgeVariant,
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

  protected readonly colorsCode = COLORS.map((c) => `<dm-badge color="${c}">${c}</dm-badge>`).join(
    '\n',
  );

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-badge color="primary" variant="${v}">${v}</dm-badge>`,
  ).join('\n');

  protected readonly dotCode = [
    '<dm-badge color="success" variant="dot">Active</dm-badge>',
    '<dm-badge color="warning" variant="dot">Degraded</dm-badge>',
    '<dm-badge color="danger" variant="dot">Down</dm-badge>',
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
