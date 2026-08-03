import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmLoadingButtonComponent, DmTooltipDirective, DmTooltipPosition } from 'ngx-dmaster-ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-tooltip-page',
  imports: [
    DmTooltipDirective,
    DmLoadingButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './tooltip-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.tooltip);

  protected readonly playground = signal<PropValues>({
    text: 'Copy to clipboard',
    position: 'top',
  });

  protected readonly controls: PropControl[] = [
    { key: 'text', label: 'dmTooltip', type: 'text', placeholder: 'Copy to clipboard' },
    {
      key: 'position',
      label: 'dmTooltipPosition',
      type: 'select',
      options: ['top', 'bottom', 'left', 'right'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgText = computed(
    () => (this.playground()['text'] as string) || 'Copy to clipboard',
  );
  protected readonly pgPosition = computed(
    () => this.playground()['position'] as DmTooltipPosition,
  );

  protected readonly playgroundCode = computed(() => {
    const position = this.pgPosition() !== 'top' ? ` dmTooltipPosition="${this.pgPosition()}"` : '';
    return `<button dmTooltip="${this.pgText()}"${position}>…</button>`;
  });

  protected readonly positionsCode = [
    '<button dmTooltip="Top">top</button>',
    '<button dmTooltip="Bottom" dmTooltipPosition="bottom">bottom</button>',
    '<button dmTooltip="Left" dmTooltipPosition="left">left</button>',
    '<button dmTooltip="Right" dmTooltipPosition="right">right</button>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideTooltipDefaults } from 'ngx-dmaster-ui';",
    '',
    "providers: [provideTooltipDefaults({ position: 'bottom', showDelay: 150 })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'dmTooltip', type: 'string', description: api['dmTooltip'] },
      {
        name: 'dmTooltipPosition',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
        description: api['dmTooltipPosition'],
      },
      { name: 'showDelay', type: 'number', default: '300', description: api['showDelay'] },
      { name: 'hideDelay', type: 'number', default: '100', description: api['hideDelay'] },
    ];
  });
}
