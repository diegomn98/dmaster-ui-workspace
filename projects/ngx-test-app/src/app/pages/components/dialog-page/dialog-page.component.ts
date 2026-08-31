import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DIALOG_DATA,
  DialogRef,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmDialogService,
  DmErrorComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/* ------------------------------------------------------------------ */
/* Dialog contents (small standalone components used by the demos)     */
/* ------------------------------------------------------------------ */

interface InfoDialogData {
  title: string;
  body: string;
  close: string;
}

@Component({
  imports: [DmButtonComponent],
  template: `
    <div class="dlg">
      <h2 class="dlg__title">{{ data.title }}</h2>
      <p class="dlg__body">{{ data.body }}</p>
      <div class="dlg__actions">
        <dm-button color="primary" (clicked)="ref.close()">{{ data.close }}</dm-button>
      </div>
    </div>
  `,
  styles: `
    .dlg {
      display: grid;
      gap: var(--dm-space-4);
    }
    .dlg__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }
    .dlg__body {
      margin: 0;
      font-size: var(--dm-text-sm);
      line-height: var(--dm-leading-relaxed);
      color: var(--dm-fg-muted);
    }
    .dlg__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoDialogComponent {
  protected readonly data = inject<InfoDialogData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<void>>(DialogRef);
}

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

interface FormDialogData {
  title: string;
  label: string;
  placeholder: string;
  required: string;
  cancel: string;
  save: string;
}

@Component({
  imports: [
    ReactiveFormsModule,
    DmButtonComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmErrorComponent,
  ],
  template: `
    <form class="form-dialog" (submit)="save($event)" novalidate>
      <h2 class="form-dialog__title">{{ data.title }}</h2>
      <dm-form-field [label]="data.label" [required]="true">
        <input dmInput type="text" [placeholder]="data.placeholder" [formControl]="name" />
        @if (name.touched && name.hasError('required')) {
          <dm-error>{{ data.required }}</dm-error>
        }
      </dm-form-field>
      <div class="form-dialog__actions">
        <dm-button type="button" color="default" variant="light" (clicked)="ref.close()">
          {{ data.cancel }}
        </dm-button>
        <dm-button type="submit" color="primary">{{ data.save }}</dm-button>
      </div>
    </form>
  `,
  styles: `
    .form-dialog {
      display: grid;
      gap: var(--dm-space-4);
    }
    .form-dialog__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }
    .form-dialog__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDialogComponent {
  protected readonly data = inject<FormDialogData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<string>>(DialogRef);
  protected readonly name = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected save(event: Event): void {
    event.preventDefault();
    this.name.markAsTouched();
    if (this.name.valid) {
      this.ref.close(this.name.value.trim());
    }
  }
}

/* ------------------------------------------------------------------ */
/* Docs page                                                           */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-dialog-page',
  imports: [
    DmButtonComponent,
    DmBadgeComponent,
    DmCardComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    DemoBlockComponent,
    PropSignalComponent,
  ],
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
  protected readonly confirmResult = signal<string>('—');
  protected readonly confirmHelperResult = signal<string>('—');
  protected readonly formResult = signal<string>('—');
  protected readonly projectDeleted = signal(false);

  private confirmData(): ConfirmDialogData {
    const labels = this.page().labels;
    return {
      title: labels['demoTitle'],
      body: labels['demoBody'],
      cancel: labels['cancel'],
      confirm: labels['confirm'],
    };
  }

  private infoData(): InfoDialogData {
    const labels = this.page().labels;
    return { title: labels['basicTitle'], body: labels['basicBody'], close: labels['close'] };
  }

  /* Playground */
  protected open(): void {
    const labels = this.page().labels;
    const ref = this.dialog.open<string, ConfirmDialogData, ConfirmDialogComponent>(
      ConfirmDialogComponent,
      {
        size: this.pgSize(),
        disableClose: this.pgDisableClose(),
        ariaLabel: labels['demoTitle'],
        data: this.confirmData(),
      },
    );
    ref.closed.subscribe((result) => this.lastResult.set(result ?? '—'));
  }

  /* Basic + sizes */
  protected openBasic(size: DmSize = 'md'): void {
    this.dialog.open<void, InfoDialogData, InfoDialogComponent>(InfoDialogComponent, {
      size,
      ariaLabel: this.page().labels['basicTitle'],
      data: this.infoData(),
    });
  }

  /* Confirm */
  protected openConfirm(): void {
    const ref = this.dialog.open<string, ConfirmDialogData, ConfirmDialogComponent>(
      ConfirmDialogComponent,
      { ariaLabel: this.page().labels['demoTitle'], data: this.confirmData() },
    );
    ref.closed.subscribe((result) => this.confirmResult.set(result ?? 'dismissed'));
  }

  /* Confirm helper */
  protected async openConfirmHelper(): Promise<void> {
    const labels = this.page().labels;
    const confirmed = await this.dialog.confirm({
      title: labels['confirmHelperTitle'],
      message: labels['confirmHelperMessage'],
      confirmLabel: labels['confirm'],
      cancelLabel: labels['cancel'],
      color: 'danger',
      size: 'sm',
    });
    this.confirmHelperResult.set(String(confirmed));
  }

  /* Form */
  protected openForm(): void {
    const labels = this.page().labels;
    const ref = this.dialog.open<string, FormDialogData, FormDialogComponent>(FormDialogComponent, {
      ariaLabel: labels['formTitle'],
      data: {
        title: labels['formTitle'],
        label: labels['formNameLabel'],
        placeholder: labels['formNamePlaceholder'],
        required: labels['formNameRequired'],
        cancel: labels['cancel'],
        save: labels['save'],
      },
    });
    ref.closed.subscribe((result) => this.formResult.set(result ?? '—'));
  }

  /* Persistent */
  protected openPersistent(): void {
    const labels = this.page().labels;
    this.dialog.open<void, InfoDialogData, InfoDialogComponent>(InfoDialogComponent, {
      disableClose: true,
      ariaLabel: labels['persistentTitle'],
      data: {
        title: labels['persistentTitle'],
        body: labels['persistentBody'],
        close: labels['close'],
      },
    });
  }

  /* Composition */
  protected deleteProject(): void {
    const labels = this.page().labels;
    const ref = this.dialog.open<string, ConfirmDialogData, ConfirmDialogComponent>(
      ConfirmDialogComponent,
      {
        size: 'sm',
        ariaLabel: labels['projectDeleteTitle'],
        data: {
          title: labels['projectDeleteTitle'],
          body: labels['projectDeleteBody'],
          cancel: labels['cancel'],
          confirm: labels['confirm'],
        },
      },
    );
    ref.closed.subscribe((result) => {
      if (result === 'confirm') {
        this.projectDeleted.set(true);
      }
    });
  }

  protected restoreProject(): void {
    this.projectDeleted.set(false);
  }

  /* ---------------------------------------------------------------- */
  /* Snippets                                                          */
  /* ---------------------------------------------------------------- */

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

  protected readonly basicCode = [
    '<h2>{{ data.title }}</h2>',
    '<p>{{ data.body }}</p>',
    '<dm-button color="primary" (clicked)="ref.close()">{{ data.close }}</dm-button>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, inject } from '@angular/core';",
    "import { DIALOG_DATA, DialogRef, DmButtonComponent, DmDialogService } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-info-dialog',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './info-dialog.component.html',",
    '})',
    'export class InfoDialogComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject(DialogRef);',
    '}',
    '',
    '// open it from any host component',
    'private readonly dialog = inject(DmDialogService);',
    'this.dialog.open(InfoDialogComponent, {',
    "  data: { title: 'Welcome', body: '…', close: 'Close' },",
    '});',
  ].join('\n');

  protected readonly confirmCode = [
    '<h2>{{ data.title }}</h2>',
    '<p>{{ data.body }}</p>',
    '<div class="confirm-dialog__actions">',
    '  <dm-button color="default" variant="light" (clicked)="ref.close(\'cancel\')">',
    '    {{ data.cancel }}',
    '  </dm-button>',
    '  <dm-button color="danger" (clicked)="ref.close(\'confirm\')">',
    '    {{ data.confirm }}',
    '  </dm-button>',
    '</div>',
  ].join('\n');

  protected readonly confirmTs = [
    "import { Component, inject, signal } from '@angular/core';",
    "import { DIALOG_DATA, DialogRef, DmButtonComponent, DmDialogService } from '@dmaster/ui';",
    '',
    '// content component: resolves with a string',
    '@Component({',
    "  selector: 'app-confirm-dialog',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './confirm-dialog.component.html',",
    '})',
    'export class ConfirmDialogComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject<DialogRef<string>>(DialogRef);',
    '}',
    '',
    '// caller',
    'private readonly dialog = inject(DmDialogService);',
    "readonly confirmResult = signal('—');",
    '',
    'openConfirm(): void {',
    '  const ref = this.dialog.open<string>(ConfirmDialogComponent, {',
    "    ariaLabel: 'Delete component?',",
    "    data: { title: 'Delete component?', body: '…', cancel: 'Cancel', confirm: 'Delete' },",
    '  });',
    "  ref.closed.subscribe((result) => this.confirmResult.set(result ?? 'dismissed'));",
    '}',
  ].join('\n');

  protected readonly confirmHelperCode = [
    '<dm-button color="danger" variant="flat" (clicked)="deleteFile()">Delete file</dm-button>',
    '<span>Result: {{ lastResult() }}</span>',
  ].join('\n');

  protected readonly confirmHelperTs = [
    "import { Component, inject, signal } from '@angular/core';",
    "import { DmButtonComponent, DmDialogService } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-confirm-helper',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './confirm-helper.component.html',",
    '})',
    'export class ConfirmHelperComponent {',
    '  private readonly dialog = inject(DmDialogService);',
    "  readonly lastResult = signal('—');",
    '',
    '  async deleteFile(): Promise<void> {',
    '    // No content component to write: confirm() resolves true on confirm,',
    '    // false on cancel, Escape or backdrop click. All labels are yours.',
    '    const confirmed = await this.dialog.confirm({',
    "      title: 'Delete this file?',",
    "      message: 'This action cannot be undone.',",
    "      confirmLabel: 'Delete',",
    "      cancelLabel: 'Cancel',",
    "      color: 'danger',",
    '    });',
    '    this.lastResult.set(String(confirmed));',
    '  }',
    '}',
  ].join('\n');

  protected readonly formCode = [
    '<form (submit)="save($event)" novalidate>',
    '  <dm-form-field [label]="data.label" [required]="true">',
    '    <input dmInput type="text" [placeholder]="data.placeholder" [formControl]="name" />',
    "    @if (name.touched && name.hasError('required')) {",
    '      <dm-error>{{ data.required }}</dm-error>',
    '    }',
    '  </dm-form-field>',
    '  <div class="form-dialog__actions">',
    '    <dm-button type="button" color="default" variant="light" (clicked)="ref.close()">',
    '      {{ data.cancel }}',
    '    </dm-button>',
    '    <dm-button type="submit" color="primary">{{ data.save }}</dm-button>',
    '  </div>',
    '</form>',
  ].join('\n');

  protected readonly formTs = [
    "import { Component, inject } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DIALOG_DATA,',
    '  DialogRef,',
    '  DmButtonComponent,',
    '  DmErrorComponent,',
    '  DmFormFieldComponent,',
    '  DmInputDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-form-dialog',",
    '  imports: [ReactiveFormsModule, DmButtonComponent, DmFormFieldComponent, DmInputDirective, DmErrorComponent],',
    "  templateUrl: './form-dialog.component.html',",
    '})',
    'export class FormDialogComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject<DialogRef<string>>(DialogRef);',
    "  protected readonly name = new FormControl('', { nonNullable: true, validators: [Validators.required] });",
    '',
    '  save(event: Event): void {',
    '    event.preventDefault();',
    '    this.name.markAsTouched();',
    '    if (this.name.valid) this.ref.close(this.name.value.trim());',
    '  }',
    '}',
    '',
    '// caller',
    'this.dialog.open<string>(FormDialogComponent).closed.subscribe((name) => …);',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-button variant="flat" (clicked)="openBasic(\'sm\')">Small</dm-button>',
    '<dm-button variant="flat" (clicked)="openBasic(\'md\')">Medium</dm-button>',
    '<dm-button variant="flat" (clicked)="openBasic(\'lg\')">Large</dm-button>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component, inject } from '@angular/core';",
    "import { DmButtonComponent, DmDialogService, DmSize } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-dialog-sizes',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './dialog-sizes.component.html',",
    '})',
    'export class DialogSizesComponent {',
    '  private readonly dialog = inject(DmDialogService);',
    '',
    "  openBasic(size: DmSize = 'md'): void {",
    '    // sm → 22rem · md → 30rem (default) · lg → 42rem',
    '    this.dialog.open(InfoDialogComponent, {',
    '      size,',
    "      ariaLabel: 'Welcome',",
    "      data: { title: 'Welcome', body: '…', close: 'Close' },",
    '    });',
    '  }',
    '}',
  ].join('\n');

  protected readonly persistentCode = [
    '<dm-button color="secondary" (clicked)="openPersistent()">',
    '  Open persistent dialog',
    '</dm-button>',
  ].join('\n');

  protected readonly persistentTs = [
    "import { Component, inject } from '@angular/core';",
    "import { DmButtonComponent, DmDialogService } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-dialog-persistent',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './dialog-persistent.component.html',",
    '})',
    'export class DialogPersistentComponent {',
    '  private readonly dialog = inject(DmDialogService);',
    '',
    '  openPersistent(): void {',
    '    // disableClose: Escape and backdrop click are ignored;',
    '    // the dialog closes only through a control inside it.',
    '    this.dialog.open(InfoDialogComponent, {',
    '      disableClose: true,',
    "      ariaLabel: 'Session expiring',",
    "      data: { title: 'Session expiring', body: '…', close: 'Stay signed in' },",
    '    });',
    '  }',
    '}',
  ].join('\n');

  protected readonly compositionCode = [
    '<dm-card style="max-width: 24rem">',
    '  <div style="display: grid; gap: 0.75rem">',
    '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem">',
    '      <strong>Design system v2</strong>',
    '      @if (deleted()) {',
    '        <dm-badge color="danger" variant="flat">Deleted</dm-badge>',
    '      } @else {',
    '        <dm-badge color="success" variant="flat">Active</dm-badge>',
    '      }',
    '    </div>',
    '    <p style="margin: 0; color: var(--dm-fg-muted); font-size: 0.875rem">',
    '      Updated 2 days ago · 3 members',
    '    </p>',
    '    <div style="display: flex; justify-content: flex-end; gap: 0.5rem">',
    '      @if (deleted()) {',
    '        <dm-button size="sm" variant="flat" (clicked)="restore()">Restore</dm-button>',
    '      } @else {',
    '        <dm-button size="sm" color="danger" variant="flat" (clicked)="remove()">Delete</dm-button>',
    '      }',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    'private readonly dialog = inject(DmDialogService);',
    'readonly deleted = signal(false);',
    '',
    'remove(): void {',
    '  const ref = this.dialog.open<string>(ConfirmDialogComponent, {',
    "    size: 'sm',",
    "    ariaLabel: 'Delete project?',",
    '    data: {',
    "      title: 'Delete project?',",
    "      body: 'The project and its history will be removed.',",
    "      cancel: 'Cancel',",
    "      confirm: 'Delete',",
    '    },',
    '  });',
    '  ref.closed.subscribe((result) => {',
    "    if (result === 'confirm') this.deleted.set(true);",
    '  });',
    '}',
    '',
    'restore(): void {',
    '  this.deleted.set(false);',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideDialogDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideDialogDefaults({ size: 'lg', disableClose: true }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'open()',
        type: 'ComponentType<C> | TemplateRef<C>',
        description: api['openTemplate'],
      },
      {
        name: 'confirm()',
        type: 'DmConfirmOptions → Promise<boolean>',
        description: api['confirm'],
      },
      { name: 'data', type: 'D', description: api['data'] },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      { name: 'disableClose', type: 'boolean', default: 'false', description: api['disableClose'] },
      { name: 'ariaLabel', type: 'string', description: api['ariaLabel'] },
    ];
  });
}
