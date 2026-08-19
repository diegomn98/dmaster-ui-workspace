import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmSwitchComponent,
  DmToastRef,
  DmToastService,
  DmToastVariant,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface SettingsSnapshot {
  emailAlerts: boolean;
  weeklyDigest: boolean;
}

@Component({
  selector: 'app-toast-page',
  imports: [
    DmButtonComponent,
    DmCardComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmSwitchComponent,
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

  // Playground
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

  // Demo: variant helpers
  protected readonly helpersCode = [
    'private readonly toast = inject(DmToastService);',
    '',
    "this.toast.show('Draft autosaved');               // neutral (default)",
    "this.toast.success('Changes saved');",
    "this.toast.warning('Storage almost full');",
    "this.toast.danger('Something went wrong');",
  ].join('\n');

  // Demo: duration
  protected showShort(): void {
    this.toast.success(this.page().labels['shortMessage'], { duration: 1500 });
  }

  protected showDefault(): void {
    this.toast.success(this.page().labels['message']);
  }

  protected showSticky(): void {
    this.toast.warning(this.page().labels['sticky'], { duration: 0 });
  }

  protected readonly durationCode = [
    "this.toast.success('Copied to clipboard', { duration: 1500 }); // short",
    "this.toast.success('Changes saved');                           // default: 4000 ms",
    "this.toast.warning('Sticky toast (duration 0)', { duration: 0 }); // stays until dismissed",
  ].join('\n');

  // Demo: dismissible
  protected showDismissible(): void {
    this.toast.show(this.page().labels['withDismissMessage'], { dismissible: true });
  }

  protected showNotDismissible(): void {
    this.toast.show(this.page().labels['noDismissMessage'], { dismissible: false, duration: 2500 });
  }

  protected readonly dismissibleCode = [
    '// Dismiss button shown (default). Screen readers get its aria-label (dismissLabel).',
    "this.toast.show('You can close me', { dismissible: true });",
    '',
    '// No dismiss button: auto-dismiss only. Keep the duration short.',
    "this.toast.show('I go away on my own', { dismissible: false, duration: 2500 });",
  ].join('\n');

  // Demo: programmatic control (DmToastRef + dismissAll)
  private uploadRef: DmToastRef | null = null;
  protected readonly uploading = signal(false);

  protected startUpload(): void {
    this.uploadRef?.dismiss();
    this.uploadRef = this.toast.show(this.page().labels['uploadingMessage'], {
      duration: 0,
      dismissible: false,
    });
    this.uploading.set(true);
  }

  protected finishUpload(): void {
    this.uploadRef?.dismiss();
    this.uploadRef = null;
    this.uploading.set(false);
    this.toast.success(this.page().labels['uploadedMessage']);
  }

  protected dismissAll(): void {
    this.uploadRef = null;
    this.uploading.set(false);
    this.toast.dismissAll();
  }

  protected readonly programmaticCode = [
    '// show() and its helpers return a DmToastRef: keep it to close the toast yourself.',
    'private uploadRef: DmToastRef | null = null;',
    '',
    'startUpload(): void {',
    "  this.uploadRef = this.toast.show('Uploading photos…', { duration: 0, dismissible: false });",
    '}',
    '',
    'finishUpload(): void {',
    '  this.uploadRef?.dismiss();',
    "  this.toast.success('12 photos uploaded');",
    '}',
    '',
    '// Clear the whole queue at once (e.g. on route change).',
    'this.toast.dismissAll();',
  ].join('\n');

  // Demo: queue / stacking
  protected fireMany(): void {
    this.toast.show(this.page().labels['queueFirst']);
    this.toast.success(this.page().labels['queueSecond']);
    this.toast.warning(this.page().labels['queueThird'], { duration: 6000 });
  }

  protected readonly queueCode = [
    '// Toasts stack bottom-right in call order; each one keeps its own timer.',
    "this.toast.show('Syncing library…');",
    "this.toast.success('3 files imported');",
    "this.toast.warning('2 duplicates skipped', { duration: 6000 });",
  ].join('\n');

  // Composition: a settings card that saves and confirms via toast (with undo).
  protected readonly emailAlerts = signal(true);
  protected readonly weeklyDigest = signal(false);
  protected readonly saveState = signal<DmButtonState>('idle');
  // Last committed values (what the "server" holds) and the snapshot Undo restores.
  private committed: SettingsSnapshot = { emailAlerts: true, weeklyDigest: false };
  private readonly lastSaved = signal<SettingsSnapshot | null>(null);
  protected readonly canUndo = computed(() => this.lastSaved() !== null);

  protected saveSettings(): void {
    if (this.saveState() !== 'idle') {
      return;
    }
    const previous = this.committed;
    const next: SettingsSnapshot = {
      emailAlerts: this.emailAlerts(),
      weeklyDigest: this.weeklyDigest(),
    };
    this.saveState.set('loading');
    setTimeout(() => {
      this.committed = next;
      this.lastSaved.set(previous);
      this.saveState.set('success');
      this.toast.success('Settings saved');
      setTimeout(() => this.saveState.set('idle'), 1500);
    }, 900);
  }

  protected undoSettings(): void {
    const previous = this.lastSaved();
    if (!previous) {
      return;
    }
    this.emailAlerts.set(previous.emailAlerts);
    this.weeklyDigest.set(previous.weeklyDigest);
    this.committed = previous;
    this.lastSaved.set(null);
    this.toast.show('Changes reverted', { variant: 'neutral' });
  }

  protected readonly compositionCode = [
    '<!-- A settings card: Save goes loading → success and confirms with a toast. -->',
    '<dm-card style="width: 100%; max-width: 28rem">',
    '  <div style="display: grid; gap: 1rem">',
    '    <div style="display: flex; align-items: baseline; justify-content: space-between">',
    '      <h3 style="margin: 0; font-size: 1.05rem">Notifications</h3>',
    '      <span style="color: var(--dm-fg-muted); font-size: 0.85rem">Workspace · Acme</span>',
    '    </div>',
    '',
    '    <dm-form-field label="Display name">',
    '      <input dmInput type="text" value="Ada Lovelace" />',
    '    </dm-form-field>',
    '',
    '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '      <span>Email alerts</span>',
    '      <dm-switch [(checked)]="emailAlerts" ariaLabel="Email alerts" />',
    '    </div>',
    '    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">',
    '      <span>Weekly digest</span>',
    '      <dm-switch [(checked)]="weeklyDigest" ariaLabel="Weekly digest" />',
    '    </div>',
    '',
    '    <div style="display: flex; justify-content: flex-end; gap: 0.5rem">',
    '      @if (canUndo()) {',
    '        <dm-button size="sm" variant="light" (clicked)="undoSettings()">Undo</dm-button>',
    '      }',
    '      <dm-button',
    '        size="sm"',
    '        [state]="saveState()"',
    '        loadingLabel="Saving settings"',
    '        successLabel="Settings saved"',
    '        (clicked)="saveSettings()"',
    '      >',
    '        Save',
    '      </dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmButtonState,',
    '  DmCardComponent,',
    '  DmFormFieldComponent,',
    '  DmInputDirective,',
    '  DmSwitchComponent,',
    '  DmToastService,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-notification-settings',",
    '  imports: [',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmFormFieldComponent,',
    '    DmInputDirective,',
    '    DmSwitchComponent,',
    '  ],',
    "  templateUrl: './notification-settings.component.html',",
    '  changeDetection: ChangeDetectionStrategy.OnPush,',
    '})',
    'export class NotificationSettingsComponent {',
    '  private readonly toast = inject(DmToastService);',
    '',
    '  protected readonly emailAlerts = signal(true);',
    '  protected readonly weeklyDigest = signal(false);',
    "  protected readonly saveState = signal<DmButtonState>('idle');",
    '',
    '  // Last committed values and the snapshot Undo restores.',
    '  private committed = { emailAlerts: true, weeklyDigest: false };',
    '  private readonly lastSaved = signal<typeof this.committed | null>(null);',
    '  protected readonly canUndo = computed(() => this.lastSaved() !== null);',
    '',
    '  saveSettings(): void {',
    "    if (this.saveState() !== 'idle') return;",
    '    const previous = this.committed;',
    '    const next = { emailAlerts: this.emailAlerts(), weeklyDigest: this.weeklyDigest() };',
    "    this.saveState.set('loading');",
    '',
    '    // Replace the timeout with your real request.',
    '    setTimeout(() => {',
    '      this.committed = next;',
    '      this.lastSaved.set(previous);',
    "      this.saveState.set('success');",
    "      this.toast.success('Settings saved');",
    "      setTimeout(() => this.saveState.set('idle'), 1500);",
    '    }, 900);',
    '  }',
    '',
    '  undoSettings(): void {',
    '    const previous = this.lastSaved();',
    '    if (!previous) return;',
    '    this.emailAlerts.set(previous.emailAlerts);',
    '    this.weeklyDigest.set(previous.weeklyDigest);',
    '    this.committed = previous;',
    '    this.lastSaved.set(null);',
    "    this.toast.show('Changes reverted', { variant: 'neutral' });",
    '  }',
    '}',
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
