import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmButtonComponent, DmToastService, DmToastVariant } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-toast-page',
  imports: [
    DmButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './toast-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly toast = inject(DmToastService);
  protected readonly page = computed(() => this.i18n.t().pages.toast);

  protected readonly playground = signal<PropValues>({
    variant: 'success',
    duration: 4000,
    dismissible: true,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: ['neutral', 'success', 'warning', 'danger'].map((value) => ({
        label: value,
        value,
      })),
    },
    { key: 'duration', label: 'duration (ms)', type: 'number', min: 0, max: 10000, step: 500 },
    { key: 'dismissible', label: 'dismissible', type: 'boolean' },
  ];

  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmToastVariant);
  protected readonly pgDuration = computed(() => Number(this.playground()['duration']) || 0);
  protected readonly pgDismissible = computed(() => this.playground()['dismissible'] === true);

  protected show(): void {
    this.toast.show(this.page().labels['message'], {
      variant: this.pgVariant(),
      duration: this.pgDuration(),
      dismissible: this.pgDismissible(),
    });
  }

  protected showSticky(): void {
    this.toast.warning(this.page().labels['sticky'], { duration: 0 });
  }

  protected readonly playgroundCode = computed(() => {
    const options: string[] = [`variant: '${this.pgVariant()}'`];
    if (this.pgDuration() !== 4000) {
      options.push(`duration: ${this.pgDuration()}`);
    }
    if (!this.pgDismissible()) {
      options.push('dismissible: false');
    }
    return [
      'private readonly toast = inject(DmToastService);',
      '',
      `this.toast.show('…', { ${options.join(', ')} });`,
    ].join('\n');
  });

  protected readonly helpersCode = [
    "this.toast.success('Changes saved');",
    "this.toast.warning('Storage almost full');",
    "this.toast.danger('Something went wrong', { duration: 0 });",
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideToastDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideToastDefaults({ duration: 6000, dismissLabel: 'Cerrar' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'variant',
        type: "'neutral' | 'success' | 'warning' | 'danger'",
        default: "'neutral'",
        description: api['variant'],
      },
      { name: 'duration', type: 'number', default: '4000', description: api['duration'] },
      { name: 'dismissible', type: 'boolean', default: 'true', description: api['dismissible'] },
    ];
  });
}
