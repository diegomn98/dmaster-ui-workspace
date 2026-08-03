import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmBadgeAppearance, DmBadgeComponent, DmBadgeSize, DmBadgeVariant } from 'ngx-dmaster-ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

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

  protected readonly playground = signal<PropValues>({
    variant: 'neutral',
    appearance: 'subtle',
    size: 'md',
    pill: false,
    dot: false,
    text: 'Badge',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger'].map((value) => ({
        label: value,
        value,
      })),
    },
    {
      key: 'appearance',
      label: 'appearance',
      type: 'select',
      options: ['subtle', 'solid', 'outline'].map((value) => ({ label: value, value })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((value) => ({ label: value, value })),
    },
    { key: 'pill', label: 'pill', type: 'boolean' },
    { key: 'dot', label: 'dot', type: 'boolean' },
    { key: 'text', label: 'text', type: 'text', placeholder: 'Badge' },
  ];

  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmBadgeVariant);
  protected readonly pgAppearance = computed(
    () => this.playground()['appearance'] as DmBadgeAppearance,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmBadgeSize);
  protected readonly pgPill = computed(() => this.playground()['pill'] === true);
  protected readonly pgDot = computed(() => this.playground()['dot'] === true);
  protected readonly pgText = computed(() => (this.playground()['text'] as string) || 'Badge');

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgVariant() !== 'neutral') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgAppearance() !== 'subtle') {
      attrs.push(`appearance="${this.pgAppearance()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgPill()) {
      attrs.push('[pill]="true"');
    }
    if (this.pgDot()) {
      attrs.push('[dot]="true"');
    }
    const open = attrs.length > 0 ? `<dm-badge ${attrs.join(' ')}>` : '<dm-badge>';
    return `${open}${this.pgText()}</dm-badge>`;
  });

  protected readonly variantsCode = [
    '<dm-badge>Neutral</dm-badge>',
    '<dm-badge variant="primary">Primary</dm-badge>',
    '<dm-badge variant="success">Success</dm-badge>',
    '<dm-badge variant="warning">Warning</dm-badge>',
    '<dm-badge variant="danger">Danger</dm-badge>',
  ].join('\n');

  protected readonly appearancesCode = [
    '<dm-badge variant="primary">subtle</dm-badge>',
    '<dm-badge variant="primary" appearance="solid">solid</dm-badge>',
    '<dm-badge variant="primary" appearance="outline">outline</dm-badge>',
  ].join('\n');

  protected readonly dotCode = [
    '<dm-badge variant="success" [dot]="true">Active</dm-badge>',
    '<dm-badge variant="warning" [dot]="true">Degraded</dm-badge>',
    '<dm-badge variant="danger" [dot]="true" [pill]="true">Down</dm-badge>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideBadgeDefaults } from 'ngx-dmaster-ui';",
    '',
    "providers: [provideBadgeDefaults({ appearance: 'outline' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'variant',
        type: "'neutral' | 'primary' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: api['variant'],
      },
      {
        name: 'appearance',
        type: "'subtle' | 'solid' | 'outline'",
        default: "'subtle'",
        description: api['appearance'],
      },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
      { name: 'pill', type: 'boolean', default: 'false', description: api['pill'] },
      { name: 'dot', type: 'boolean', default: 'false', description: api['dot'] },
    ];
  });
}
