import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DmSwitchComponent, DmSwitchSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-switch-page',
  imports: [
    DmSwitchComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './switch-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.switch);

  protected readonly playground = signal<PropValues>({
    checked: false,
    disabled: false,
    size: 'md',
  });

  protected readonly controls: PropControl[] = [
    { key: 'checked', label: 'checked', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgChecked = computed(() => this.playground()['checked'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSwitchSize);

  protected patchChecked(checked: boolean): void {
    this.playground.update((values) => ({ ...values, checked }));
  }

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['[(checked)]="enabled"'];
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    return `<dm-switch ${attrs.join(' ')}>${this.page().labels['notifications']}</dm-switch>`;
  });

  // Demo reactive forms
  protected readonly formControl = new FormControl(true, { nonNullable: true });
  protected readonly formValue = signal(true);

  constructor() {
    this.formControl.valueChanges.subscribe((value) => this.formValue.set(value));
  }

  protected readonly withLabelCode = [
    '<dm-switch [(checked)]="notifications">Email notifications</dm-switch>',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-switch size="sm" [checked]="true" ariaLabel="Small" />',
    '<dm-switch size="md" [checked]="true" ariaLabel="Medium" />',
  ].join('\n');

  protected readonly formsCode = [
    'control = new FormControl(true, { nonNullable: true });',
    '',
    '<dm-switch [formControl]="control">Email notifications</dm-switch>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSwitchDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSwitchDefaults({ size: 'sm' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'checked', type: 'model<boolean>', default: 'false', description: api['checked'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
      { name: 'inputId', type: 'string', default: "''", description: api['inputId'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
