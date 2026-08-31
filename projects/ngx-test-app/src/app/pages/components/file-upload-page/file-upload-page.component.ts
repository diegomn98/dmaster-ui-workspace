import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  DmAlertComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmErrorComponent,
  DmFileRejection,
  DmFileUploadComponent,
  DmFileUploadMessages,
  DmFormFieldComponent,
  DmInputDirective,
  DmSelectComponent,
  DmSelectItem,
  formatFileSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** Size cap used by the "size limit" demo — small enough that a real pick trips it. */
const LIMIT_DEMO_MAX_SIZE = 200_000;

/** Size cap used by the support-ticket composition (5 MB). */
const TICKET_MAX_SIZE = 5 * 1024 * 1024;

/** Reactive Forms validator: the control must hold at least `min` files. */
function minFiles(min: number): ValidatorFn {
  return (control: AbstractControl<File[] | null>): ValidationErrors | null => {
    const count = control.value?.length ?? 0;
    return count >= min ? null : { minFiles: { required: min, actual: count } };
  };
}

@Component({
  selector: 'app-file-upload-page',
  imports: [
    DmFileUploadComponent,
    DmAlertComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmErrorComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmSelectComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './file-upload-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.fileUpload);
  private readonly destroyRef = inject(DestroyRef);

  /** Localised rejection copy, shared by every demo on the page. */
  protected readonly messages = computed<DmFileUploadMessages>(() => ({
    type: this.page().labels['rejectType'],
    size: this.page().labels['rejectSize'],
    count: this.page().labels['rejectCount'],
  }));

  // ---- Usage ---------------------------------------------------------------
  protected readonly usageFiles = signal<File[]>([]);

  protected readonly usageCode = [
    '<dm-file-upload [(files)]="files" />',
    '',
    '// files = signal<File[]>([]);',
  ].join('\n');

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    multiple: true,
    maxFiles: 3,
    accept: 'any',
    disabled: false,
  });

  protected readonly playgroundFiles = signal<File[]>([]);

  protected readonly controls: PropControl[] = [
    { key: 'multiple', label: 'multiple', type: 'boolean' },
    { key: 'maxFiles', label: 'maxFiles', type: 'number', min: 1, max: 10, step: 1 },
    {
      key: 'accept',
      label: 'accept',
      type: 'select',
      options: [
        { label: '(any)', value: 'any' },
        { label: 'image/*', value: 'image/*' },
        { label: '.pdf', value: '.pdf' },
        { label: 'image/*,.pdf', value: 'image/*,.pdf' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgMultiple = computed(() => this.playground()['multiple'] === true);
  protected readonly pgMaxFiles = computed(() => Number(this.playground()['maxFiles']) || 3);
  protected readonly pgAccept = computed(() => {
    const accept = this.playground()['accept'] as string;
    return accept === 'any' ? '' : accept;
  });
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgMultiple()) {
      attrs.push('multiple');
      attrs.push(`[maxFiles]="${this.pgMaxFiles()}"`);
    }
    if (this.pgAccept()) {
      attrs.push(`accept="${this.pgAccept()}"`);
    }
    if (this.pgDisabled()) {
      attrs.push('disabled');
    }
    attrs.push('[(files)]="files"');
    return `<dm-file-upload\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demo: basic (single) ------------------------------------------------
  protected readonly basicFiles = signal<File[]>([]);

  protected readonly basicCode = [
    '<!-- Single file (default): picking again replaces the previous one. -->',
    '<dm-file-upload',
    '  label="Drag & drop a file here, or click to browse"',
    '  [(files)]="files"',
    '/>',
    '',
    '// files = signal<File[]>([]);',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmFileUploadComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-single-upload',",
    '  imports: [DmFileUploadComponent],',
    "  templateUrl: './single-upload.component.html',",
    '})',
    'export class SingleUploadComponent {',
    '  protected readonly files = signal<File[]>([]);',
    '}',
  ].join('\n');

  // ---- Demo: multiple with list -------------------------------------------
  protected readonly multipleFiles = signal<File[]>([]);
  protected readonly multipleTotal = computed(() =>
    formatFileSize(this.multipleFiles().reduce((sum, file) => sum + file.size, 0)),
  );

  protected readonly multipleCode = [
    '<dm-file-upload',
    '  multiple',
    '  label="Drop files here, or click to browse"',
    '  hint="Any type · no size limit"',
    '  [(files)]="files"',
    '  (filesAdded)="onAdded($event)"',
    '  (fileRemoved)="onRemoved($event)"',
    '/>',
    '',
    '<!-- Summarise the selection with the exported helper -->',
    '<p>{{ files().length }} files · {{ total() }}</p>',
    '',
    "// import { formatFileSize } from '@dmaster/ui';",
    '// total = computed(() => formatFileSize(files().reduce((s, f) => s + f.size, 0)));',
  ].join('\n');

  protected readonly multipleTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmFileUploadComponent, formatFileSize } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-multiple-upload',",
    '  imports: [DmFileUploadComponent],',
    "  templateUrl: './multiple-upload.component.html',",
    '})',
    'export class MultipleUploadComponent {',
    '  protected readonly files = signal<File[]>([]);',
    '  protected readonly total = computed(() =>',
    '    formatFileSize(this.files().reduce((sum, file) => sum + file.size, 0)),',
    '  );',
    '}',
  ].join('\n');

  // ---- Demo: images with thumbnails ---------------------------------------
  protected readonly imageFiles = signal<File[]>([]);

  protected readonly imagesCode = [
    '<!-- Images get an object-URL thumbnail (revoked on removal / destroy). -->',
    '<dm-file-upload',
    '  multiple',
    '  accept="image/*"',
    '  label="Drop images here, or click to browse"',
    '  hint="PNG, JPG, GIF, WebP…"',
    '  [(files)]="images"',
    '/>',
  ].join('\n');

  protected readonly imagesTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmFileUploadComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-image-upload',",
    '  imports: [DmFileUploadComponent],',
    "  templateUrl: './image-upload.component.html',",
    '})',
    'export class ImageUploadComponent {',
    '  protected readonly images = signal<File[]>([]);',
    '}',
  ].join('\n');

  // ---- Demo: size limit + rejection ---------------------------------------
  protected readonly limitFiles = signal<File[]>([]);
  protected readonly lastRejection = signal<DmFileRejection | null>(null);
  protected readonly limitMaxSizeLabel = formatFileSize(LIMIT_DEMO_MAX_SIZE);
  protected readonly limitMaxSize = LIMIT_DEMO_MAX_SIZE;

  protected readonly lastRejectionText = computed(() => {
    const rejection = this.lastRejection();
    if (!rejection) {
      return '';
    }
    const reason = this.messages()[rejection.reason];
    const size = formatFileSize(rejection.file.size);
    return `${rejection.file.name} (${size}) — ${reason}`;
  });

  protected onRejected(rejection: DmFileRejection): void {
    this.lastRejection.set(rejection);
  }

  protected readonly limitCode = [
    '<!-- maxSize is in bytes; accept + maxFiles are enforced too.',
    '     Each refused file emits (fileRejected) with a reason. -->',
    '<dm-file-upload',
    '  multiple',
    '  accept="image/*,.pdf"',
    '  [maxSize]="200_000"',
    '  [maxFiles]="2"',
    '  hint="PNG, JPG or PDF · up to 195 KB · max 2 files"',
    "  [messages]=\"{ type: 'Type not allowed', size: 'Too large', count: 'Too many files' }\"",
    '  [(files)]="files"',
    '  (fileRejected)="lastRejection.set($event)"',
    '/>',
    '',
    '@if (lastRejection(); as r) {',
    '  <dm-alert color="danger" variant="flat" [dismissible]="true" (closed)="lastRejection.set(null)">',
    '    {{ r.file.name }} — {{ r.reason }}',
    '  </dm-alert>',
    '}',
  ].join('\n');

  protected readonly limitTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmAlertComponent, DmFileRejection, DmFileUploadComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-limited-upload',",
    '  imports: [DmFileUploadComponent, DmAlertComponent],',
    "  templateUrl: './limited-upload.component.html',",
    '})',
    'export class LimitedUploadComponent {',
    '  protected readonly files = signal<File[]>([]);',
    '  protected readonly lastRejection = signal<DmFileRejection | null>(null);',
    '}',
  ].join('\n');

  // ---- Demo: upload progress simulation -----------------------------------
  protected readonly progressFiles = signal<File[]>([]);
  protected readonly progressMap = signal<Record<string, number> | null>(null);
  protected readonly uploadState = signal<DmButtonState>('idle');
  private uploadTimer: ReturnType<typeof setInterval> | undefined;
  private readonly demoTimers: ReturnType<typeof setTimeout>[] = [];

  protected readonly progressDone = computed(() => {
    const map = this.progressMap();
    const files = this.progressFiles();
    return !!map && files.length > 0 && files.every((file) => (map[file.name] ?? 0) >= 100);
  });

  protected simulateUpload(): void {
    if (this.uploadState() === 'loading' || this.progressFiles().length === 0) {
      return;
    }
    this.stopUpload();
    this.uploadState.set('loading');
    const initial: Record<string, number> = {};
    for (const file of this.progressFiles()) {
      initial[file.name] = 0;
    }
    this.progressMap.set(initial);

    // Each file advances at a slightly different pace so the bars feel real.
    this.uploadTimer = setInterval(() => {
      const files = this.progressFiles();
      let allDone = true;
      this.progressMap.update((current) => {
        const next: Record<string, number> = { ...(current ?? {}) };
        files.forEach((file, index) => {
          const step = 6 + ((index * 5) % 9);
          const value = Math.min(100, (next[file.name] ?? 0) + step);
          next[file.name] = value;
          if (value < 100) {
            allDone = false;
          }
        });
        return next;
      });
      if (allDone) {
        this.stopUpload();
        this.uploadState.set('success');
        this.demoTimers.push(setTimeout(() => this.uploadState.set('idle'), 1400));
      }
    }, 220);
  }

  protected resetUpload(): void {
    this.stopUpload();
    this.progressMap.set(null);
    this.uploadState.set('idle');
  }

  protected onProgressFilesChange(files: File[]): void {
    this.progressFiles.set(files);
    // Drop progress entries of files that are no longer selected.
    this.progressMap.update((current) => {
      if (!current) {
        return current;
      }
      const next: Record<string, number> = {};
      for (const file of files) {
        if (current[file.name] !== undefined) {
          next[file.name] = current[file.name];
        }
      }
      return next;
    });
  }

  private stopUpload(): void {
    if (this.uploadTimer !== undefined) {
      clearInterval(this.uploadTimer);
      this.uploadTimer = undefined;
    }
  }

  protected readonly progressCode = [
    '<!-- Feed live progress back in (0–100, keyed by file name). -->',
    '<dm-file-upload',
    '  multiple',
    '  label="Drop files to upload"',
    '  [(files)]="files"',
    '  [progress]="progress()"',
    '/>',
    '',
    '<dm-button',
    '  color="primary"',
    '  [state]="state()"',
    '  [disabled]="files().length === 0"',
    '  loadingLabel="Uploading…"',
    '  successLabel="Uploaded"',
    '  (clicked)="upload()"',
    '>',
    '  Upload',
    '</dm-button>',
  ].join('\n');

  protected readonly progressTs = [
    "import { Component, DestroyRef, inject, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonState, DmFileUploadComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-uploader',",
    '  imports: [DmFileUploadComponent, DmButtonComponent],',
    "  templateUrl: './uploader.component.html',",
    '})',
    'export class UploaderComponent {',
    '  protected readonly files = signal<File[]>([]);',
    '  protected readonly progress = signal<Record<string, number> | null>(null);',
    "  protected readonly state = signal<DmButtonState>('idle');",
    '  private timer?: ReturnType<typeof setInterval>;',
    '',
    '  constructor() {',
    '    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));',
    '  }',
    '',
    '  protected upload(): void {',
    "    this.state.set('loading');",
    '    this.progress.set(Object.fromEntries(this.files().map((f) => [f.name, 0])));',
    '    // Replace with your real transport (HttpClient reportProgress, XHR, tus…)',
    '    this.timer = setInterval(() => {',
    '      this.progress.update((map) => {',
    '        const next = { ...map };',
    '        for (const f of this.files()) next[f.name] = Math.min(100, (next[f.name] ?? 0) + 8);',
    '        return next;',
    '      });',
    '      if (this.files().every((f) => (this.progress()?.[f.name] ?? 0) >= 100)) {',
    '        clearInterval(this.timer);',
    "        this.state.set('success');",
    '      }',
    '    }, 200);',
    '  }',
    '}',
  ].join('\n');

  // ---- Demo: disabled -----------------------------------------------------
  protected readonly disabledFiles = signal<File[]>([]);

  protected readonly disabledCode = [
    '<!-- disabled: no click, no drop, no remove (remove buttons are disabled too). -->',
    '<dm-file-upload disabled label="Uploads are locked" hint="Contact an admin to unlock." />',
    '',
    '<!-- Disabled with an existing selection: the list is read-only. -->',
    '<dm-file-upload disabled [files]="existing" />',
  ].join('\n');

  protected readonly disabledTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmFileUploadComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-locked-upload',",
    '  imports: [DmFileUploadComponent],',
    "  templateUrl: './locked-upload.component.html',",
    '})',
    'export class LockedUploadComponent {',
    '  // A pre-populated selection to show the read-only disabled state.',
    '  protected readonly existing = signal<File[]>([]);',
    '}',
  ].join('\n');

  // ---- Demo: global defaults ----------------------------------------------
  protected readonly defaultsCode = [
    "import { provideFileUploadDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    '  provideFileUploadDefaults({ multiple: true, maxSize: 5 * 1024 * 1024, maxFiles: 10 }),',
    ']',
  ].join('\n');

  // ---- Composition: support ticket ----------------------------------------
  protected readonly ticketCategories = computed<DmSelectItem<string>[]>(() => {
    const labels = this.page().labels;
    return [
      { value: 'bug', label: labels['categoryBug'] },
      { value: 'billing', label: labels['categoryBilling'] },
      { value: 'feature', label: labels['categoryFeature'] },
      { value: 'other', label: labels['categoryOther'] },
    ];
  });

  protected readonly ticketMaxSize = TICKET_MAX_SIZE;
  protected readonly ticketMaxSizeLabel = formatFileSize(TICKET_MAX_SIZE);

  protected readonly ticketForm = new FormGroup({
    subject: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<string | null>(null, { validators: [Validators.required] }),
    message: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20)],
    }),
    attachments: new FormControl<File[]>([], {
      nonNullable: true,
      validators: [minFiles(1)],
    }),
  });

  protected readonly ticketState = signal<DmButtonState>('idle');
  protected readonly ticketSubmitted = signal<number | null>(null);

  protected onTicketFiles(files: File[]): void {
    const control = this.ticketForm.controls.attachments;
    control.setValue(files);
    control.markAsTouched();
  }

  protected submitTicket(): void {
    if (this.ticketState() !== 'idle') {
      return;
    }
    this.ticketForm.markAllAsTouched();
    if (this.ticketForm.invalid) {
      return;
    }
    this.ticketState.set('loading');
    this.demoTimers.push(
      setTimeout(() => {
        this.ticketState.set('success');
        this.ticketSubmitted.set(this.ticketForm.controls.attachments.value.length);
        this.demoTimers.push(
          setTimeout(() => {
            this.ticketForm.reset();
            this.ticketState.set('idle');
          }, 1400),
        );
      }, 1200),
    );
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 28rem">',
    '  <form [formGroup]="form" (ngSubmit)="submit()" novalidate style="display: grid; gap: 1rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Submit a support ticket</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        We usually answer within one business day.',
    '      </p>',
    '    </div>',
    '',
    '    <dm-form-field label="Subject" [required]="true">',
    '      <input dmInput type="text" formControlName="subject" placeholder="Short summary" />',
    '      @if (form.controls.subject.touched && form.controls.subject.hasError("required")) {',
    '        <dm-error>A subject is required.</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <dm-select',
    '        label="Category"',
    '        placeholder="Pick a category"',
    '        [items]="categories"',
    '        [required]="true"',
    '        formControlName="category"',
    '      />',
    '      @if (form.controls.category.touched && form.controls.category.hasError("required")) {',
    '        <dm-error>Pick a category.</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <dm-form-field label="Message" hint="At least 20 characters." [required]="true">',
    '      <textarea dmInput rows="4" formControlName="message"></textarea>',
    '      @if (form.controls.message.touched && form.controls.message.hasError("required")) {',
    '        <dm-error>Describe the problem.</dm-error>',
    '      } @else if (form.controls.message.touched && form.controls.message.hasError("minlength")) {',
    '        <dm-error>Please add a few more details (20+ characters).</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <!-- dm-file-upload is controlled, not a CVA: bridge it to the FormControl -->',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <span style="font-size: 0.875rem; font-weight: 500">Attachments *</span>',
    '      <dm-file-upload',
    '        multiple',
    '        accept="image/*,.pdf"',
    '        [maxFiles]="3"',
    '        [maxSize]="5 * 1024 * 1024"',
    '        label="Drop screenshots or a PDF here, or click to browse"',
    '        hint="PNG, JPG or PDF · up to 5 MB each · max 3 files"',
    '        [files]="form.controls.attachments.value"',
    '        (filesChange)="onFiles($event)"',
    '      />',
    '      @if (form.controls.attachments.touched && form.controls.attachments.hasError("minFiles")) {',
    '        <dm-error>Attach at least one screenshot or document.</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <dm-button',
    '      type="submit"',
    '      color="primary"',
    '      style="width: 100%"',
    '      [state]="state()"',
    '      loadingLabel="Sending…"',
    '      successLabel="Ticket sent"',
    '    >',
    '      Send ticket',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { HttpClient } from '@angular/common/http';",
    "import { Component, inject, signal } from '@angular/core';",
    'import {',
    '  AbstractControl, FormControl, FormGroup, ReactiveFormsModule,',
    '  ValidationErrors, ValidatorFn, Validators,',
    "} from '@angular/forms';",
    'import {',
    '  DmButtonComponent, DmButtonState, DmCardComponent, DmErrorComponent,',
    '  DmFileUploadComponent, DmFormFieldComponent, DmInputDirective,',
    '  DmSelectComponent, DmSelectItem,',
    "} from '@dmaster/ui';",
    '',
    '/** The control must hold at least `min` files. */',
    'function minFiles(min: number): ValidatorFn {',
    '  return (control: AbstractControl<File[] | null>): ValidationErrors | null =>',
    '    (control.value?.length ?? 0) >= min ? null : { minFiles: { required: min } };',
    '}',
    '',
    '@Component({',
    "  selector: 'app-support-ticket',",
    '  imports: [',
    '    ReactiveFormsModule, DmCardComponent, DmFormFieldComponent, DmInputDirective,',
    '    DmSelectComponent, DmFileUploadComponent, DmErrorComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './support-ticket.component.html',",
    '})',
    'export class SupportTicketComponent {',
    '  private readonly http = inject(HttpClient);',
    '',
    '  protected readonly categories: DmSelectItem<string>[] = [',
    "    { value: 'bug', label: 'Bug report' },",
    "    { value: 'billing', label: 'Billing' },",
    "    { value: 'feature', label: 'Feature request' },",
    "    { value: 'other', label: 'Something else' },",
    '  ];',
    '',
    '  protected readonly form = new FormGroup({',
    "    subject: new FormControl('', { nonNullable: true, validators: [Validators.required] }),",
    '    category: new FormControl<string | null>(null, { validators: [Validators.required] }),',
    "    message: new FormControl('', {",
    '      nonNullable: true,',
    '      validators: [Validators.required, Validators.minLength(20)],',
    '    }),',
    '    attachments: new FormControl<File[]>([], { nonNullable: true, validators: [minFiles(1)] }),',
    '  });',
    '',
    "  protected readonly state = signal<DmButtonState>('idle');",
    '',
    '  protected onFiles(files: File[]): void {',
    '    this.form.controls.attachments.setValue(files);',
    '    this.form.controls.attachments.markAsTouched();',
    '  }',
    '',
    '  protected submit(): void {',
    '    this.form.markAllAsTouched();',
    '    if (this.form.invalid) return;',
    "    this.state.set('loading');",
    '    // Send as multipart/form-data',
    '    const body = new FormData();',
    "    body.append('subject', this.form.controls.subject.value);",
    "    body.append('category', this.form.controls.category.value ?? '');",
    "    body.append('message', this.form.controls.message.value);",
    "    for (const file of this.form.controls.attachments.value) body.append('files', file);",
    "    this.http.post('/api/tickets', body).subscribe({",
    "      next: () => { this.state.set('success'); this.form.reset(); },",
    "      error: () => this.state.set('error'),",
    '    });',
    '  }',
    '}',
  ].join('\n');

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.stopUpload();
      this.demoTimers.forEach(clearTimeout);
    });

    // Sample files for the disabled/progress demos — `File` only exists in the
    // browser, so build them after the first render (the prerender stays static).
    afterNextRender(() => {
      this.disabledFiles.set([
        new File([new Uint8Array(18_432)], 'contract-2026.pdf', { type: 'application/pdf' }),
        new File([new Uint8Array(4_096)], 'notes.txt', { type: 'text/plain' }),
      ]);
      // Pre-seed the progress demo so "Simulate upload" has something to run on
      // without the visitor having to pick files first.
      this.progressFiles.set([
        new File([new Uint8Array(2_400_000)], 'annual-report.pdf', { type: 'application/pdf' }),
        new File([new Uint8Array(680_000)], 'balance-sheet.xlsx', {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        new File([new Uint8Array(128_000)], 'cover-letter.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }),
      ]);
    });
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'files', type: 'model<File[]>', default: '[]', description: api['files'] },
      { name: 'multiple', type: 'boolean', default: 'false', description: api['multiple'] },
      { name: 'accept', type: 'string', default: "''", description: api['accept'] },
      { name: 'maxSize', type: 'number | null', default: 'null', description: api['maxSize'] },
      { name: 'maxFiles', type: 'number | null', default: 'null', description: api['maxFiles'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      { name: 'label', type: 'string', default: 'generic fallback', description: api['label'] },
      { name: 'hint', type: 'string', default: "''", description: api['hint'] },
      {
        name: 'removeLabel',
        type: 'string',
        default: "'Remove'",
        description: api['removeLabel'],
      },
      {
        name: 'messages',
        type: 'DmFileUploadMessages',
        default: 'generic English',
        description: api['messages'],
      },
      {
        name: 'progress',
        type: 'Record<string, number> | null',
        default: 'null',
        description: api['progress'],
      },
      {
        name: 'filesChange',
        type: 'output<File[]>',
        default: '—',
        description: api['filesChange'],
      },
      { name: 'filesAdded', type: 'output<File[]>', default: '—', description: api['filesAdded'] },
      {
        name: 'fileRejected',
        type: 'output<DmFileRejection>',
        default: '—',
        description: api['fileRejected'],
      },
      { name: 'fileRemoved', type: 'output<File>', default: '—', description: api['fileRemoved'] },
      {
        name: 'dmDropzoneContent',
        type: 'directive',
        default: '—',
        description: api['dropzoneSlot'],
      },
      {
        name: 'formatFileSize()',
        type: '(bytes: number) => string',
        default: '—',
        description: api['formatFileSize'],
      },
    ];
  });
}
