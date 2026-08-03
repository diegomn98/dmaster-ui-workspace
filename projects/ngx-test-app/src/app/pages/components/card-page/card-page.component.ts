import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmBadgeComponent, DmCardAppearance, DmCardComponent, DmCardPadding } from 'ngx-dmaster-ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-card-page',
  imports: [
    DmCardComponent,
    DmBadgeComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './card-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.card);

  protected readonly playground = signal<PropValues>({
    appearance: 'elevated',
    padding: 'md',
    interactive: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'appearance',
      label: 'appearance',
      type: 'select',
      options: ['elevated', 'outlined', 'flat'].map((value) => ({ label: value, value })),
    },
    {
      key: 'padding',
      label: 'padding',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    { key: 'interactive', label: 'interactive', type: 'boolean' },
  ];

  protected readonly pgAppearance = computed(
    () => this.playground()['appearance'] as DmCardAppearance,
  );
  protected readonly pgPadding = computed(() => this.playground()['padding'] as DmCardPadding);
  protected readonly pgInteractive = computed(() => this.playground()['interactive'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgAppearance() !== 'elevated') {
      attrs.push(`appearance="${this.pgAppearance()}"`);
    }
    if (this.pgPadding() !== 'md') {
      attrs.push(`padding="${this.pgPadding()}"`);
    }
    if (this.pgInteractive()) {
      attrs.push('[interactive]="true"');
    }
    const open = attrs.length > 0 ? `<dm-card ${attrs.join(' ')}>` : '<dm-card>';
    return `${open}…</dm-card>`;
  });

  protected readonly appearancesCode = [
    '<dm-card>elevated</dm-card>',
    '<dm-card appearance="outlined">outlined</dm-card>',
    '<dm-card appearance="flat">flat</dm-card>',
  ].join('\n');

  protected readonly interactiveCode = '<dm-card [interactive]="true">…</dm-card>';

  protected readonly defaultsCode = [
    "import { provideCardDefaults } from 'ngx-dmaster-ui';",
    '',
    "providers: [provideCardDefaults({ appearance: 'outlined', padding: 'lg' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'appearance',
        type: "'elevated' | 'outlined' | 'flat'",
        default: "'elevated'",
        description: api['appearance'],
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['padding'],
      },
      { name: 'interactive', type: 'boolean', default: 'false', description: api['interactive'] },
    ];
  });
}
