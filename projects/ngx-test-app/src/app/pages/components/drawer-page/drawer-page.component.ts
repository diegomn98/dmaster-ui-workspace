import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DIALOG_DATA,
  DialogRef,
  DmDrawerService,
  DmDrawerPlacement,
  DmDrawerSize,
  DmButtonComponent,
  DmSwitchComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface SettingsDrawerData {
  title: string;
  notifications: string;
  compact: string;
  save: string;
  close: string;
}

@Component({
  imports: [DmButtonComponent, DmSwitchComponent],
  template: `
    <div class="settings-drawer">
      <h2 class="settings-drawer__title">{{ data.title }}</h2>
      <div class="settings-drawer__body">
        <dm-switch [(checked)]="notifications">{{ data.notifications }}</dm-switch>
        <dm-switch [(checked)]="compact">{{ data.compact }}</dm-switch>
      </div>
      <div class="settings-drawer__actions">
        <dm-button color="default" variant="light" (clicked)="ref.close()">
          {{ data.close }}
        </dm-button>
        <dm-button color="primary" (clicked)="ref.close('saved')">
          {{ data.save }}
        </dm-button>
      </div>
    </div>
  `,
  styles: `
    .settings-drawer {
      display: flex;
      flex-direction: column;
      gap: var(--dm-space-5);
      height: 100%;
    }

    .settings-drawer__title {
      margin: 0;
      font-size: var(--dm-text-lg);
      font-weight: var(--dm-font-semibold);
      letter-spacing: -0.01em;
    }

    .settings-drawer__body {
      display: flex;
      flex-direction: column;
      gap: var(--dm-space-4);
      flex: 1;
    }

    .settings-drawer__actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--dm-space-2);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDrawerComponent {
  protected readonly data = inject<SettingsDrawerData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<string>>(DialogRef);
  protected readonly notifications = signal(true);
  protected readonly compact = signal(false);
}

@Component({
  selector: 'app-drawer-page',
  imports: [
    DmButtonComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    DemoBlockComponent,
    PropSignalComponent,
  ],
  templateUrl: './drawer-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly drawer = inject(DmDrawerService);
  protected readonly page = computed(() => this.i18n.t().pages.drawer);

  protected readonly playground = signal<PropValues>({
    placement: 'right',
    size: 'md',
    backdrop: true,
    disableClose: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'placement',
      label: 'placement',
      type: 'select',
      options: ['left', 'right', 'top', 'bottom'].map((value) => ({ label: value, value })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg', 'full'].map((value) => ({ label: value, value })),
    },
    { key: 'backdrop', label: 'backdrop', type: 'boolean' },
    { key: 'disableClose', label: 'disableClose', type: 'boolean' },
  ];

  protected readonly pgPlacement = computed(
    () => this.playground()['placement'] as DmDrawerPlacement,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmDrawerSize);
  protected readonly pgBackdrop = computed(() => this.playground()['backdrop'] !== false);
  protected readonly pgDisableClose = computed(() => this.playground()['disableClose'] === true);

  protected readonly lastResult = signal<string>('—');

  protected open(overrides: { placement?: DmDrawerPlacement; size?: DmDrawerSize } = {}): void {
    const labels = this.page().labels;
    const ref = this.drawer.open<string, SettingsDrawerData, SettingsDrawerComponent>(
      SettingsDrawerComponent,
      {
        placement: overrides.placement ?? this.pgPlacement(),
        size: overrides.size ?? this.pgSize(),
        backdrop: this.pgBackdrop(),
        disableClose: this.pgDisableClose(),
        ariaLabel: labels['title'],
        data: {
          title: labels['title'],
          notifications: labels['notifications'],
          compact: labels['compact'],
          save: labels['save'],
          close: labels['close'],
        },
      },
    );
    ref.closed.subscribe((result) => this.lastResult.set(result ?? '—'));
  }

  protected openPersistent(): void {
    const labels = this.page().labels;
    this.drawer.open<string, SettingsDrawerData, SettingsDrawerComponent>(SettingsDrawerComponent, {
      placement: 'right',
      disableClose: true,
      ariaLabel: labels['title'],
      data: {
        title: labels['title'],
        notifications: labels['notifications'],
        compact: labels['compact'],
        save: labels['save'],
        close: labels['close'],
      },
    });
  }

  protected readonly playgroundCode = computed(() => {
    const options: string[] = [];
    if (this.pgPlacement() !== 'right') {
      options.push(`placement: '${this.pgPlacement()}'`);
    }
    if (this.pgSize() !== 'md') {
      options.push(`size: '${this.pgSize()}'`);
    }
    if (!this.pgBackdrop()) {
      options.push('backdrop: false');
    }
    if (this.pgDisableClose()) {
      options.push('disableClose: true');
    }
    const config = options.length > 0 ? `, { ${options.join(', ')} }` : '';
    return [
      'private readonly drawer = inject(DmDrawerService);',
      '',
      `const ref = this.drawer.open(SettingsDrawerComponent${config});`,
      'ref.closed.subscribe((result) => …);',
    ].join('\n');
  });

  protected readonly contentCode = [
    'export class SettingsDrawerComponent {',
    '  protected readonly data = inject(DIALOG_DATA);',
    '  protected readonly ref = inject(DialogRef);',
    '',
    '  save(): void {',
    "    this.ref.close('saved');",
    '  }',
    '}',
  ].join('\n');

  protected readonly placementsCode = [
    "this.drawer.open(SettingsDrawerComponent, { placement: 'left' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'right' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'top' });",
    "this.drawer.open(SettingsDrawerComponent, { placement: 'bottom' });",
  ].join('\n');

  protected readonly sizesCode = [
    "this.drawer.open(SettingsDrawerComponent, { size: 'sm' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'md' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'lg' });",
    "this.drawer.open(SettingsDrawerComponent, { size: 'full' });",
  ].join('\n');

  protected readonly persistentCode = [
    '// disableClose: closes only through a control inside the drawer.',
    'this.drawer.open(SettingsDrawerComponent, { disableClose: true });',
    '',
    '// inside the drawer component:',
    'private readonly ref = inject(DialogRef);',
    'close(): void {',
    '  this.ref.close();',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideDrawerDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideDrawerDefaults({ placement: 'left', size: 'lg' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'data', type: 'D', default: '—', description: api['data'] },
      {
        name: 'placement',
        type: "'left' | 'right' | 'top' | 'bottom'",
        default: "'right'",
        description: api['placement'],
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api['size'],
      },
      { name: 'backdrop', type: 'boolean', default: 'true', description: api['backdrop'] },
      { name: 'disableClose', type: 'boolean', default: 'false', description: api['disableClose'] },
      { name: 'ariaLabel', type: 'string', default: '—', description: api['ariaLabel'] },
    ];
  });
}
