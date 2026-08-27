import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmErrorComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

interface DemoTask {
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-checkbox-page',
  imports: [
    DmCheckboxComponent,
    DmErrorComponent,
    DmButtonComponent,
    DmBadgeComponent,
    DmCardComponent,
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

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    checked: false,
    indeterminate: false,
    disabled: false,
    size: 'md',
  });

  protected readonly controls: PropControl[] = [
    { key: 'checked', label: 'checked', type: 'boolean' },
    { key: 'indeterminate', label: 'indeterminate', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
      ],
    },
  ];

  protected readonly pgChecked = computed(() => this.playground()['checked'] === true);
  protected readonly pgIndeterminate = computed(() => this.playground()['indeterminate'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgSize = computed(() => this.playground()['size'] as 'sm' | 'md');

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
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    return `<dm-checkbox ${attrs.join(' ')}>${this.page().labels['terms']}</dm-checkbox>`;
  });

  // ---- Basic ---------------------------------------------------------------
  protected readonly basicTerms = signal(true);
  protected readonly basicUpdates = signal(false);

  protected readonly basicCode = [
    '<dm-checkbox [(checked)]="terms">Accept the terms and conditions</dm-checkbox>',
    '<dm-checkbox [(checked)]="updates">Email me about product updates</dm-checkbox>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmCheckboxComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-basic-demo',",
    '  imports: [DmCheckboxComponent],',
    "  templateUrl: './checkbox-basic-demo.component.html',",
    '})',
    'export class CheckboxBasicDemoComponent {',
    '  protected readonly terms = signal(true);',
    '  protected readonly updates = signal(false);',
    '}',
  ].join('\n');

  // ---- Sizes ---------------------------------------------------------------
  protected readonly sizesCode = [
    '<dm-checkbox size="sm" [checked]="true">Small — dense rows and filters</dm-checkbox>',
    '<dm-checkbox [checked]="true">Medium — the default for forms</dm-checkbox>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmCheckboxComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-sizes-demo',",
    '  imports: [DmCheckboxComponent],',
    "  templateUrl: './checkbox-sizes-demo.component.html',",
    '})',
    'export class CheckboxSizesDemoComponent {}',
  ].join('\n');

  // ---- Indeterminate (select all) ------------------------------------------
  protected readonly optionA = signal(true);
  protected readonly optionB = signal(false);
  protected readonly optionC = signal(false);
  protected readonly allSelected = computed(
    () => this.optionA() && this.optionB() && this.optionC(),
  );
  protected readonly someSelected = computed(
    () => (this.optionA() || this.optionB() || this.optionC()) && !this.allSelected(),
  );

  protected toggleAll(checked: boolean): void {
    this.optionA.set(checked);
    this.optionB.set(checked);
    this.optionC.set(checked);
  }

  protected readonly indeterminateCode = [
    '<dm-checkbox',
    '  [checked]="allSelected()"',
    '  [indeterminate]="someSelected()"',
    '  (checkedChange)="toggleAll($event)"',
    '>',
    '  Select all',
    '</dm-checkbox>',
    '<dm-checkbox [(checked)]="chrome">Chrome</dm-checkbox>',
    '<dm-checkbox [(checked)]="firefox">Firefox</dm-checkbox>',
    '<dm-checkbox [(checked)]="safari">Safari</dm-checkbox>',
  ].join('\n');

  protected readonly indeterminateTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmCheckboxComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-browser-picker',",
    '  imports: [DmCheckboxComponent],',
    "  templateUrl: './browser-picker.component.html',",
    '})',
    'export class BrowserPickerComponent {',
    '  protected readonly chrome = signal(true);',
    '  protected readonly firefox = signal(false);',
    '  protected readonly safari = signal(false);',
    '',
    '  protected readonly allSelected = computed(',
    '    () => this.chrome() && this.firefox() && this.safari(),',
    '  );',
    '',
    '  // "mixed" while only part of the group is checked',
    '  protected readonly someSelected = computed(',
    '    () => (this.chrome() || this.firefox() || this.safari()) && !this.allSelected(),',
    '  );',
    '',
    '  protected toggleAll(checked: boolean): void {',
    '    this.chrome.set(checked);',
    '    this.firefox.set(checked);',
    '    this.safari.set(checked);',
    '  }',
    '}',
  ].join('\n');

  // ---- Disabled states -----------------------------------------------------
  protected readonly statesCode = [
    '<dm-checkbox [disabled]="true">Disabled</dm-checkbox>',
    '<dm-checkbox [disabled]="true" [checked]="true">Disabled checked</dm-checkbox>',
    '<dm-checkbox [disabled]="true" [indeterminate]="true">Disabled indeterminate</dm-checkbox>',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component } from '@angular/core';",
    "import { DmCheckboxComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-checkbox-states-demo',",
    '  imports: [DmCheckboxComponent],',
    "  templateUrl: './checkbox-states-demo.component.html',",
    '})',
    'export class CheckboxStatesDemoComponent {}',
  ].join('\n');

  // ---- Reactive forms + validation -----------------------------------------
  protected readonly termsControl = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
  protected readonly termsError = signal(false);
  protected readonly termsOk = signal(false);

  protected submitTerms(): void {
    this.termsControl.markAsTouched();
    const invalid = this.termsControl.invalid;
    this.termsError.set(invalid);
    this.termsOk.set(!invalid);
  }

  protected readonly formsCode = [
    '<dm-checkbox [formControl]="terms">I agree to the Terms of Service</dm-checkbox>',
    '',
    '@if (termsError()) {',
    '  <dm-error>Please accept the terms to continue</dm-error>',
    '}',
    '',
    '<dm-button size="sm" (clicked)="submit()">Create account</dm-button>',
  ].join('\n');

  protected readonly formsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmButtonComponent, DmCheckboxComponent, DmErrorComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-consent',",
    '  imports: [DmCheckboxComponent, DmErrorComponent, DmButtonComponent, ReactiveFormsModule],',
    "  templateUrl: './consent.component.html',",
    '})',
    'export class ConsentComponent {',
    '  // requiredTrue = "must be checked" — the canonical consent validator',
    '  protected readonly terms = new FormControl(false, {',
    '    nonNullable: true,',
    '    validators: [Validators.requiredTrue],',
    '  });',
    '  protected readonly termsError = signal(false);',
    '',
    '  protected submit(): void {',
    '    this.terms.markAsTouched();',
    '    this.termsError.set(this.terms.invalid);',
    '    if (this.terms.valid) {',
    '      // create the account…',
    '    }',
    '  }',
    '}',
  ].join('\n');

  // ---- Composition: task list ----------------------------------------------
  protected readonly tasks = signal<DemoTask[]>([
    { label: 'Review pull request #142', done: true },
    { label: 'Update the changelog', done: true },
    { label: 'Ship v0.3.0 to npm', done: false },
    { label: 'Write the release notes', done: false },
  ]);

  protected readonly doneCount = computed(() => this.tasks().filter((task) => task.done).length);
  protected readonly allDone = computed(() => this.doneCount() === this.tasks().length);

  protected toggleTask(index: number, done: boolean): void {
    this.tasks.update((tasks) => tasks.map((task, i) => (i === index ? { ...task, done } : task)));
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 24rem">',
    '  <div style="display: grid; gap: 0.875rem">',
    '    <div style="display: flex; align-items: center; justify-content: space-between">',
    '      <strong>Today</strong>',
    '      <dm-badge [color]="allDone() ? \'success\' : \'default\'" variant="flat" size="sm">',
    '        {{ doneCount() }}/{{ tasks().length }} done',
    '      </dm-badge>',
    '    </div>',
    '    @for (task of tasks(); track task.label; let i = $index) {',
    '      <dm-checkbox [checked]="task.done" (checkedChange)="toggleTask(i, $event)">',
    '        <span',
    '          [style.color]="task.done ? \'var(--dm-fg-muted)\' : null"',
    '          [style.text-decoration]="task.done ? \'line-through\' : null"',
    '        >',
    '          {{ task.label }}',
    '        </span>',
    '      </dm-checkbox>',
    '    }',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmBadgeComponent, DmCardComponent, DmCheckboxComponent } from '@dmaster/ui';",
    '',
    'interface Task {',
    '  label: string;',
    '  done: boolean;',
    '}',
    '',
    '@Component({',
    "  selector: 'app-task-list',",
    '  imports: [DmCardComponent, DmBadgeComponent, DmCheckboxComponent],',
    "  templateUrl: './task-list.component.html',",
    '})',
    'export class TaskListComponent {',
    '  protected readonly tasks = signal<Task[]>([',
    "    { label: 'Review pull request #142', done: true },",
    "    { label: 'Update the changelog', done: true },",
    "    { label: 'Ship v0.3.0 to npm', done: false },",
    "    { label: 'Write the release notes', done: false },",
    '  ]);',
    '',
    '  protected readonly doneCount = computed(',
    '    () => this.tasks().filter((task) => task.done).length,',
    '  );',
    '  protected readonly allDone = computed(',
    '    () => this.doneCount() === this.tasks().length,',
    '  );',
    '',
    '  protected toggleTask(index: number, done: boolean): void {',
    '    this.tasks.update((tasks) =>',
    '      tasks.map((task, i) => (i === index ? { ...task, done } : task)),',
    '    );',
    '  }',
    '}',
  ].join('\n');

  // ---- Global defaults -----------------------------------------------------
  protected readonly defaultsCode = [
    "import { provideCheckboxDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideCheckboxDefaults({ size: 'sm' })]",
  ].join('\n');

  // ---- API -----------------------------------------------------------------
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
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
      { name: 'inputId', type: 'string', default: "''", description: api['inputId'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
