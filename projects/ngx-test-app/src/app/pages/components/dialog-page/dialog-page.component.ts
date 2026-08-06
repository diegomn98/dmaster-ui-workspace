import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DIALOG_DATA, DialogRef, DmDialogService, DmButtonComponent, DmSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface ConfirmDialogData {
  title: string;
  body: string;
  cancel: string;
  confirm: string;
}

@Component({
  imports: [DmButtonComponent],
  template: `
    <div class="confirm-dialog">
      <h2 class="confirm-dialog__title">{{ data.title }}</h2>
      <p class="confirm-dialog__body">{{ data.body }}</p>
      <div class="confirm-dialog__actions">
        <dm-button color="default" variant="light" (clicked)="ref.close('cancel')">
          {{ data.cancel }}
        </dm-button>
        <dm-button color="danger" (clicked)="ref.close('confirm')">
          {{ data.confirm }}
        </dm-button>
      </div>
    </div>
  `,
  styles: `
    .confirm-dialog {
      display: grid;
      gap: var(--dm-space-4);
    }

    .confirm-dialog__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }

    .confirm-dialog__body {
      margin: 0;
      font-size: var(--dm-text-sm);
      line-height: var(--dm-leading-relaxed);
      color: var(--dm-fg-muted);
    }

    .confirm-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  protected readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<string>>(DialogRef);
}

@Component({
  selector: 'app-dialog-page',
  imports: [DmButtonComponent, ApiTableComponent, CodeSnippetComponent, PropSignalComponent],
  templateUrl: './dialog-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly dialog = inject(DmDialogService);
  protected readonly page = computed(() => this.i18n.t().pages.dialog);

  protected readonly playground = signal<PropValues>({
    size: 'md',
    disableClose: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    { key: 'disableClose', label: 'disableClose', type: 'boolean' },
  ];

  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgDisableClose = computed(() => this.playground()['disableClose'] === true);

  protected readonly lastResult = signal<string>('—');

  protected open(): void {
    const labels = this.page().labels;
    const ref = this.dialog.open<string, ConfirmDialogData, ConfirmDialogComponent>(
      ConfirmDialogComponent,
      {
        size: this.pgSize(),
        disableClose: this.pgDisableClose(),
        ariaLabel: labels['demoTitle'],
        data: {
          title: labels['demoTitle'],
          body: labels['demoBody'],
          cancel: labels['cancel'],
          confirm: labels['confirm'],
        },
      },
    );
    ref.closed.subscribe((result) => this.lastResult.set(result ?? '—'));
  }

  protected readonly playgroundCode = computed(() => {
    const options: string[] = [];
    if (this.pgSize() !== 'md') {
      options.push(`size: '${this.pgSize()}'`);
    }
    if (this.pgDisableClose()) {
      options.push('disableClose: true');
    }
    const config = options.length > 0 ? `, { ${options.join(', ')} }` : '';
    return [
      'private readonly dialog = inject(DmDialogService);',
      '',
      `const ref = this.dialog.open(ConfirmDialogComponent${config});`,
      'ref.closed.subscribe((result) => …);',
    ].join('\n');
  });

  protected readonly contentCode = [
    'export class ConfirmDialogComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject(DialogRef);',
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'data', type: 'D', description: api['data'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      { name: 'disableClose', type: 'boolean', default: 'false', description: api['disableClose'] },
      { name: 'ariaLabel', type: 'string', description: api['ariaLabel'] },
    ];
  });
}
