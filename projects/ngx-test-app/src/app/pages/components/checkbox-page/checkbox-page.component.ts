import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DmCheckboxComponent } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-checkbox-page',
  imports: [
    DmCheckboxComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './checkbox-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.checkbox);

  protected readonly playground = signal<PropValues>({
    checked: false,
    indeterminate: false,
    disabled: false,
  });

  protected readonly controls: PropControl[] = [
    { key: 'checked', label: 'checked', type: 'boolean' },
    { key: 'indeterminate', label: 'indeterminate', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgChecked = computed(() => this.playground()['checked'] === true);
  protected readonly pgIndeterminate = computed(() => this.playground()['indeterminate'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected patchChecked(checked: boolean): void {
    this.playground.update((values) => ({ ...values, checked }));
  }

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['[(checked)]="accepted"'];
    if (this.pgIndeterminate()) {
      attrs.push('[indeterminate]="true"');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    return `<dm-checkbox ${attrs.join(' ')}>${this.page().labels['terms']}</dm-checkbox>`;
  });

  // Demo select-all con indeterminado real
  protected readonly optionA = signal(true);
  protected readonly optionB = signal(false);
  protected readonly allSelected = computed(() => this.optionA() && this.optionB());
  protected readonly someSelected = computed(
    () => (this.optionA() || this.optionB()) && !this.allSelected(),
  );

  protected toggleAll(checked: boolean): void {
    this.optionA.set(checked);
    this.optionB.set(checked);
  }

  // Demo reactive forms
  protected readonly formControl = new FormControl(false, { nonNullable: true });
  protected readonly formValue = signal(false);

  constructor() {
    this.formControl.valueChanges.subscribe((value) => this.formValue.set(value));
  }

  protected readonly basicCode =
    '<dm-checkbox [(checked)]="accepted">Accept the terms and conditions</dm-checkbox>';

  protected readonly indeterminateCode = [
    '<dm-checkbox',
    '  [checked]="allSelected()"',
    '  [indeterminate]="someSelected()"',
    '  (checkedChange)="toggleAll($event)"',
    '>',
    '  Select all',
    '</dm-checkbox>',
    '<dm-checkbox [(checked)]="optionA">Option A</dm-checkbox>',
    '<dm-checkbox [(checked)]="optionB">Option B</dm-checkbox>',
  ].join('\n');

  protected readonly formsCode = [
    'control = new FormControl(false, { nonNullable: true });',
    '',
    '<dm-checkbox [formControl]="control">Accept the terms</dm-checkbox>',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'checked', type: 'model<boolean>', default: 'false', description: api['checked'] },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: api['indeterminate'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'inputId', type: 'string', default: "''", description: api['inputId'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
