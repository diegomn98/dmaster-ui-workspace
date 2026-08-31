import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmAutocompleteColor,
  DmAutocompleteComponent,
  DmAutocompleteOption,
  DmAutocompleteRadius,
  DmAutocompleteVariant,
  DmButtonComponent,
  DmCardComponent,
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

const FRUITS: DmAutocompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blackberry', label: 'Blackberry' },
  { value: 'blueberry', label: 'Blueberry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach', description: 'In season now' },
  { value: 'pear', label: 'Pear' },
  { value: 'strawberry', label: 'Strawberry' },
];

const CITIES: DmAutocompleteOption[] = [
  { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },
  { value: 'barcelona', label: 'Barcelona', description: 'Spain' },
  { value: 'berlin', label: 'Berlin', description: 'Germany' },
  { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
  { value: 'london', label: 'London', description: 'United Kingdom' },
  { value: 'madrid', label: 'Madrid', description: 'Spain' },
  { value: 'new-york', label: 'New York', description: 'United States' },
  { value: 'paris', label: 'Paris', description: 'France' },
  { value: 'rome', label: 'Rome', description: 'Italy' },
  { value: 'tokyo', label: 'Tokyo', description: 'Japan' },
];

const VARIANTS: DmAutocompleteVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmAutocompleteColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

@Component({
  selector: 'app-autocomplete-page',
  imports: [
    DmAutocompleteComponent,
    DmButtonComponent,
    DmCardComponent,
    DmErrorComponent,
    DmFormFieldComponent,
    DmInputDirective,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './autocomplete-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompletePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.autocomplete);
  protected readonly fruits = FRUITS;
  protected readonly cities = CITIES;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    clearable: true,
    openOnFocus: false,
    disabled: false,
  });

  protected readonly playgroundValue = signal<string>('');

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
    { key: 'openOnFocus', label: 'openOnFocus', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmAutocompleteColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmAutocompleteVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmAutocompleteRadius);
  protected readonly pgClearable = computed(() => this.playground()['clearable'] === true);
  protected readonly pgOpenOnFocus = computed(() => this.playground()['openOnFocus'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [
      'label="Fruit"',
      'placeholder="Type…"',
      '[options]="fruits"',
      '[(value)]="fruit"',
    ];
    if (this.pgColor() !== 'default') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgVariant() !== 'flat') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgRadius() !== 'md') attrs.push(`radius="${this.pgRadius()}"`);
    if (!this.pgClearable()) attrs.push('[clearable]="false"');
    if (this.pgOpenOnFocus()) attrs.push('openOnFocus');
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    return `<dm-autocomplete\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicValue = signal<string>('');
  protected readonly openOnFocusValue = signal<string>('');
  protected readonly eventsValue = signal<string>('');
  protected readonly lastSelected = signal<string>('—');

  protected readonly basicCode = [
    '<dm-autocomplete',
    '  label="Fruit"',
    '  placeholder="Type to search…"',
    '  noResultsLabel="No matches"',
    '  [options]="fruits"',
    '  [(value)]="fruit"',
    '/>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmAutocompleteComponent, DmAutocompleteOption } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-basic-autocomplete',",
    '  imports: [DmAutocompleteComponent],',
    "  templateUrl: './basic-autocomplete.component.html',",
    '})',
    'export class BasicAutocompleteComponent {',
    '  fruits: DmAutocompleteOption[] = [',
    "    { value: 'apple', label: 'Apple' },",
    "    { value: 'apricot', label: 'Apricot' },",
    "    { value: 'banana', label: 'Banana' },",
    "    { value: 'blackberry', label: 'Blackberry' },",
    "    { value: 'blueberry', label: 'Blueberry' },",
    "    { value: 'cherry', label: 'Cherry' },",
    "    { value: 'grape', label: 'Grape' },",
    "    { value: 'mango', label: 'Mango' },",
    "    { value: 'orange', label: 'Orange' },",
    "    { value: 'peach', label: 'Peach', description: 'In season now' },",
    "    { value: 'pear', label: 'Pear' },",
    "    { value: 'strawberry', label: 'Strawberry' },",
    '  ];',
    "  fruit = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly openOnFocusCode = [
    '<dm-autocomplete',
    '  label="Fruit"',
    '  placeholder="Type to search…"',
    '  openOnFocus',
    '  [options]="fruits"',
    '  [(value)]="fruit"',
    '/>',
  ].join('\n');

  protected readonly openOnFocusTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmAutocompleteComponent, DmAutocompleteOption } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-open-on-focus',",
    '  imports: [DmAutocompleteComponent],',
    "  templateUrl: './open-on-focus.component.html',",
    '})',
    'export class OpenOnFocusComponent {',
    '  fruits: DmAutocompleteOption[] = [',
    "    { value: 'apple', label: 'Apple' },",
    "    { value: 'apricot', label: 'Apricot' },",
    "    { value: 'banana', label: 'Banana' },",
    '    // …',
    '  ];',
    "  fruit = signal<string>('');",
    '}',
  ].join('\n');

  protected readonly eventsCode = [
    '<dm-autocomplete',
    '  label="Fruit"',
    '  placeholder="Type to search…"',
    '  [options]="fruits"',
    '  [(value)]="fruit"',
    '  (optionSelected)="onSelected($event)"',
    '/>',
  ].join('\n');

  protected readonly eventsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmAutocompleteComponent, DmAutocompleteOption } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-autocomplete-events',",
    '  imports: [DmAutocompleteComponent],',
    "  templateUrl: './autocomplete-events.component.html',",
    '})',
    'export class AutocompleteEventsComponent {',
    '  fruits: DmAutocompleteOption[] = [',
    "    { value: 'apple', label: 'Apple' },",
    "    { value: 'banana', label: 'Banana' },",
    '    // …',
    '  ];',
    "  fruit = signal<string>('');",
    "  lastSelected = signal<string>('—');",
    '',
    '  onSelected(option: DmAutocompleteOption): void {',
    '    this.lastSelected.set(`${option.label} (${option.value})`);',
    '  }',
    '}',
  ].join('\n');

  protected readonly formsCode = [
    '<dm-autocomplete',
    '  label="Fruit"',
    '  placeholder="Type to search…"',
    '  [options]="fruits"',
    '  [formControl]="control"',
    '/>',
    '<p>Value: {{ formValue() }}</p>',
  ].join('\n');

  protected readonly formsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    "import { DmAutocompleteComponent, DmAutocompleteOption } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-autocomplete-forms',",
    '  imports: [DmAutocompleteComponent, ReactiveFormsModule],',
    "  templateUrl: './autocomplete-forms.component.html',",
    '})',
    'export class AutocompleteFormsComponent {',
    '  fruits: DmAutocompleteOption[] = [',
    "    { value: 'apple', label: 'Apple' },",
    "    { value: 'banana', label: 'Banana' },",
    '    // …',
    '  ];',
    "  control = new FormControl<string>('', { nonNullable: true });",
    "  formValue = signal<string>('');",
    '',
    '  constructor() {',
    '    this.control.valueChanges.subscribe((v) => this.formValue.set(v));',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideAutocompleteDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideAutocompleteDefaults({ variant: 'bordered' })]",
  ].join('\n');

  protected onSelected(option: DmAutocompleteOption): void {
    this.lastSelected.set(`${option.label} (${option.value})`);
  }

  // Reactive Forms demo
  protected readonly formControl = new FormControl<string>('', { nonNullable: true });
  protected readonly formValue = signal<string>('');
  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formValue.set(v));
  }

  // ---- Validation with <dm-error> -----------------------------------------
  protected readonly requiredControl = new FormControl<string>('', {
    nonNullable: true,
    validators: Validators.required,
  });

  protected readonly validationCode = [
    '<!-- dm-autocomplete has no error slot: render <dm-error> right below it',
    '     (a role="alert" line, so it is announced the moment it appears). -->',
    '<div style="display: grid; gap: 0.375rem">',
    '  <dm-autocomplete',
    '    label="City"',
    '    placeholder="Start typing a city…"',
    '    noResultsLabel="No matches"',
    '    [options]="cities"',
    '    [required]="true"',
    '    [formControl]="city"',
    '  />',
    "  @if (city.touched && city.hasError('required')) {",
    '    <dm-error>Enter a city to continue</dm-error>',
    '  }',
    '</div>',
  ].join('\n');

  protected readonly validationTs = [
    "import { Component } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmAutocompleteComponent, DmErrorComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [DmAutocompleteComponent, DmErrorComponent, ReactiveFormsModule],',
    '  templateUrl: …,',
    '})',
    'export class CityFormComponent {',
    "  city = new FormControl<string>('', { nonNullable: true, validators: Validators.required });",
    '}',
  ].join('\n');

  // ---- Composition: ship-to address card ------------------------------------
  protected readonly shipForm = new FormGroup({
    city: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    street: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
  });
  protected readonly continuing = signal(false);

  protected continueShipping(): void {
    if (this.continuing()) {
      return;
    }
    this.shipForm.markAllAsTouched();
    if (this.shipForm.invalid) {
      return;
    }
    this.continuing.set(true);
    setTimeout(() => {
      this.continuing.set(false);
      this.shipForm.reset({ city: '', street: '' });
    }, 1200);
  }

  protected readonly compositionCode = [
    '<!-- Ship-to step: a city autocomplete (options carry the country as',
    '     description) + a street form-field, each guarded by <dm-error>,',
    '     and a stateful Continue button. -->',
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <form [formGroup]="form" (ngSubmit)="continue()" novalidate style="display: grid; gap: 1rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Ship to</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        Where should we send your order?',
    '      </p>',
    '    </div>',
    '',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <dm-autocomplete label="City" placeholder="Start typing a city…" noResultsLabel="No matches"',
    '                       openOnFocus [options]="cities" [required]="true" formControlName="city" />',
    "      @if (form.controls.city.touched && form.controls.city.hasError('required')) {",
    '        <dm-error>Enter a city to continue</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <dm-form-field label="Street address" [required]="true">',
    '      <input dmInput type="text" placeholder="221B Baker Street" autocomplete="street-address"',
    '             formControlName="street" />',
    "      @if (form.controls.street.touched && form.controls.street.hasError('required')) {",
    '        <dm-error>Street address is required</dm-error>',
    '      }',
    '    </dm-form-field>',
    '',
    '    <dm-button type="submit" color="primary" style="width: 100%"',
    '               [loading]="loading()" loadingLabel="Checking address…">',
    '      Continue',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmAutocompleteComponent,',
    '  DmAutocompleteOption,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmErrorComponent,',
    '  DmFormFieldComponent,',
    '  DmInputDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [',
    '    DmCardComponent,',
    '    DmAutocompleteComponent,',
    '    DmFormFieldComponent,',
    '    DmInputDirective,',
    '    DmErrorComponent,',
    '    DmButtonComponent,',
    '    ReactiveFormsModule,',
    '  ],',
    '  templateUrl: …,',
    '})',
    'export class ShipToComponent {',
    '  cities: DmAutocompleteOption[] = [',
    "    { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },",
    "    { value: 'barcelona', label: 'Barcelona', description: 'Spain' },",
    "    { value: 'berlin', label: 'Berlin', description: 'Germany' },",
    '    …',
    '  ];',
    '',
    '  form = new FormGroup({',
    "    city: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),",
    "    street: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),",
    '  });',
    '  loading = signal(false);',
    '',
    '  continue(): void {',
    '    this.form.markAllAsTouched();',
    '    if (this.form.invalid) return;',
    '    this.loading.set(true);',
    '    this.api.validateAddress(this.form.getRawValue()).subscribe({',
    '      next: () => this.loading.set(false),',
    '      error: () => this.loading.set(false),',
    '    });',
    '  }',
    '}',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'options',
        type: 'DmAutocompleteOption[]',
        default: '[]',
        description: api['options'],
      },
      { name: 'value', type: 'model<string>', default: "''", description: api['value'] },
      {
        name: 'optionSelected',
        type: 'output<DmAutocompleteOption>',
        default: '—',
        description: api['optionSelected'],
      },
      { name: 'openChange', type: 'output<boolean>', default: '—', description: api['openChange'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'clearable', type: 'boolean', default: 'true', description: api['clearable'] },
      { name: 'openOnFocus', type: 'boolean', default: 'false', description: api['openOnFocus'] },
      { name: 'filter', type: 'boolean', default: 'true', description: api['filter'] },
      {
        name: 'filterFn',
        type: '((option, query) => boolean) | null',
        default: 'null',
        description: api['filterFn'],
      },
      { name: 'noResultsLabel', type: 'string', default: "''", description: api['noResultsLabel'] },
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
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear'",
        description: api['clearAriaLabel'],
      },
      {
        name: 'dmAutocompleteOption',
        type: 'ng-template[dmAutocompleteOption]',
        default: '—',
        description: api['optionTemplate'],
      },
    ];
  });
}
