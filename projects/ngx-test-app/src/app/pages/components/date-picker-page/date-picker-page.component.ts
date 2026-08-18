import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmDatePickerColor,
  DmDatePickerComponent,
  DmDatePickerRadius,
  DmDatePickerVariant,
  DmErrorComponent,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const VARIANTS: DmDatePickerVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmDatePickerColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

/** `new Date()` once, at construction — avoids re-evaluating in the template. */
function today(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

@Component({
  selector: 'app-date-picker-page',
  imports: [
    DmDatePickerComponent,
    DmErrorComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './date-picker-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.datePicker);
  protected readonly colors = COLORS;

  /** Locale of the live dashboard — feeds the localized demos. */
  protected readonly activeLocale = computed(() => this.i18n.locale());

  protected readonly today = today();
  protected readonly minDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  protected readonly maxDate = new Date(this.today.getFullYear(), this.today.getMonth() + 2, 0);

  /** Disable weekends for the constraints demo. */
  protected readonly noWeekends = (d: Date): boolean => d.getDay() === 0 || d.getDay() === 6;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    clearable: true,
    showTodayButton: true,
    disabled: false,
    required: false,
  });

  protected readonly playgroundValue = signal<Date | null>(null);

  protected readonly controls: PropControl[] = [
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: COLORS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: VARIANTS.map((v) => ({ label: v, value: v })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((v) => ({ label: v, value: v })),
    },
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'].map((v) => ({ label: v, value: v })),
    },
    { key: 'clearable', label: 'clearable', type: 'boolean' },
    { key: 'showTodayButton', label: 'showTodayButton', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmDatePickerColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmDatePickerVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmDatePickerRadius);
  protected readonly pgClearable = computed(() => this.playground()['clearable'] === true);
  protected readonly pgShowToday = computed(() => this.playground()['showTodayButton'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['label="Start date"', '[(value)]="date"'];
    if (this.pgColor() !== 'default') {
      attrs.push(`color="${this.pgColor()}"`);
    }
    if (this.pgVariant() !== 'flat') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgRadius() !== 'md') {
      attrs.push(`radius="${this.pgRadius()}"`);
    }
    if (this.pgClearable()) {
      attrs.push('[clearable]="true"');
    }
    if (!this.pgShowToday()) {
      attrs.push('[showTodayButton]="false"');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-date-picker\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicValue = signal<Date | null>(null);
  protected readonly localizedEsValue = signal<Date | null>(this.today);
  protected readonly localizedFrValue = signal<Date | null>(this.today);
  protected readonly constraintsValue = signal<Date | null>(null);
  protected readonly formControl = new FormControl<Date | null>(null);
  protected readonly formValue = computed(() => this.formControlValue());
  private readonly formControlValue = signal<Date | null>(null);

  protected readonly basicCode = [
    '<dm-date-picker label="Start date" [(value)]="date" [clearable]="true" />',
  ].join('\n');

  protected readonly localizedCode = [
    '<!-- Names, digits AND the week convention follow the locale: -->',
    '<!-- es/fr start on Monday, en-US on Sunday, ar-EG on Saturday. -->',
    '<dm-date-picker label="Fecha" locale="es" [(value)]="date" />',
    '<dm-date-picker label="Date" locale="fr" [(value)]="date" />',
  ].join('\n');

  protected readonly constraintsCode = [
    'min = new Date();               // no past dates',
    'max = /* +2 months */;',
    'noWeekends = (d: Date) => d.getDay() === 0 || d.getDay() === 6;',
    '',
    '<dm-date-picker',
    '  label="Appointment"',
    '  [(value)]="date"',
    '  [min]="min"',
    '  [max]="max"',
    '  [isDateDisabled]="noWeekends"',
    '/>',
  ].join('\n');

  protected readonly sizesCode = ['sm', 'md', 'lg']
    .map((s) => `<dm-date-picker size="${s}" label="${s}" />`)
    .join('\n');

  protected readonly formsCode = [
    'control = new FormControl<Date | null>(null);',
    '',
    '<dm-date-picker label="Date" [formControl]="control" />',
  ].join('\n');

  // Validation with the standalone <dm-error>.
  protected readonly requiredDate = new FormControl<Date | null>(null, {
    validators: [Validators.required],
  });

  protected readonly validationCode = [
    'date = new FormControl<Date | null>(null, [Validators.required]);',
    '',
    '<dm-date-picker label="Start date" [formControl]="date" [required]="true" />',
    '@if (date.touched && date.hasError("required")) {',
    '  <dm-error>Please choose a date</dm-error>',
    '}',
  ].join('\n');

  protected readonly globalLocaleCode = [
    "import { provideDateLocale } from '@dmaster/ui';",
    '',
    '// Static — every dm-date-picker uses this locale:',
    "provideDateLocale('es')",
    '',
    '// Reactive — pass a Signal<string> and they switch language live',
    '// (this is how the pickers on this page follow the header selector):',
    'provideDateLocale(inject(LocaleService).locale)',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideDatePickerDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideDatePickerDefaults({ firstDayOfWeek: 1, variant: 'bordered' })",
    ']',
  ].join('\n');

  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formControlValue.set(v ?? null));
  }

  protected format(date: Date | null): string {
    return date
      ? new Intl.DateTimeFormat(this.activeLocale(), { dateStyle: 'medium' }).format(date)
      : '—';
  }

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'model<Date | null>', default: 'null', description: api['value'] },
      { name: 'min', type: 'Date | null', default: 'null', description: api['min'] },
      { name: 'max', type: 'Date | null', default: 'null', description: api['max'] },
      {
        name: 'isDateDisabled',
        type: '(date: Date) => boolean',
        default: 'null',
        description: api['isDateDisabled'],
      },
      {
        name: 'firstDayOfWeek',
        type: "0…6 | 'auto'",
        default: "'auto'",
        description: api['firstDayOfWeek'],
      },
      { name: 'locale', type: 'string', default: 'runtime', description: api['locale'] },
      {
        name: 'displayFormat',
        type: 'Intl.DateTimeFormatOptions',
        default: '{ y, m, d }',
        description: api['displayFormat'],
      },
      {
        name: 'weekdayFormat',
        type: "'narrow' | 'short'",
        default: "'short'",
        description: api['weekdayFormat'],
      },
      {
        name: 'showTodayButton',
        type: 'boolean',
        default: 'true',
        description: api['showTodayButton'],
      },
      {
        name: 'closeOnSelect',
        type: 'boolean',
        default: 'true',
        description: api['closeOnSelect'],
      },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'clearable', type: 'boolean', default: 'false', description: api['clearable'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'flat' | 'bordered' | 'faded' | 'underlined'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api['radius'],
      },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
    ];
  });
}
