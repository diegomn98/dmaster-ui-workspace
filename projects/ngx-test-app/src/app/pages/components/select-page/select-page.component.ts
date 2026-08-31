import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmButtonComponent,
  DmCardComponent,
  DmErrorComponent,
  DmSelectColor,
  DmSelectComponent,
  DmSelectItem,
  DmSelectLoadFn,
  DmSelectOptionDirective,
  DmSelectOptionOrGroup,
  DmSelectRadius,
  DmSelectVariant,
  DmSize,
} from '@dmaster/ui';
import { delay, of } from 'rxjs';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const PETS: DmSelectItem<string>[] = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog', description: "Man's best friend" },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'fish', label: 'Fish', disabled: true },
  { value: 'hamster', label: 'Hamster' },
  { value: 'parrot', label: 'Parrot' },
];

const GROUPED_PETS: DmSelectOptionOrGroup<string>[] = [
  {
    label: 'Mammals',
    items: [
      { value: 'cat', label: 'Cat' },
      { value: 'dog', label: 'Dog' },
      { value: 'rabbit', label: 'Rabbit' },
      { value: 'hamster', label: 'Hamster' },
    ],
  },
  {
    label: 'Others',
    items: [
      { value: 'fish', label: 'Fish' },
      { value: 'parrot', label: 'Parrot' },
      { value: 'turtle', label: 'Turtle' },
    ],
  },
];

const COUNTRIES: DmSelectItem<string>[] = [
  { value: 'es', label: 'Spain' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'pt', label: 'Portugal' },
];

const ROLES: DmSelectOptionOrGroup<string>[] = [
  {
    label: 'Engineering',
    items: [
      { value: 'frontend', label: 'Frontend engineer' },
      { value: 'backend', label: 'Backend engineer' },
      { value: 'devops', label: 'DevOps engineer' },
    ],
  },
  {
    label: 'Design',
    items: [
      { value: 'product-designer', label: 'Product designer' },
      { value: 'ux-researcher', label: 'UX researcher' },
    ],
  },
];

/** Status options for the custom option template demo (dot color per value). */
const STATUSES: DmSelectItem<string>[] = [
  { value: 'operational', label: 'Operational', description: 'All systems normal' },
  { value: 'degraded', label: 'Degraded', description: 'Partial outage in one region' },
  { value: 'maintenance', label: 'Maintenance', description: 'Planned downtime in progress' },
  { value: 'offline', label: 'Offline', description: 'Major outage' },
];

const STATUS_COLORS: Record<string, string> = {
  operational: 'var(--dm-success)',
  degraded: 'var(--dm-warning)',
  maintenance: 'var(--dm-primary)',
  offline: 'var(--dm-danger)',
};

const TEAMS: DmSelectItem<string>[] = [
  { value: 'platform', label: 'Platform' },
  { value: 'design-system', label: 'Design System' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'web', label: 'Web' },
  { value: 'qa', label: 'QA' },
];

const VARIANTS: DmSelectVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmSelectColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];

/** Simulated remote dataset for the async demos — 87 users matched by query. */
const ALL_USERS: DmSelectItem<string>[] = Array.from({ length: 87 }, (_, i) => {
  const first = ['Ada', 'Alan', 'Grace', 'Linus', 'Barbara', 'Donald', 'Rich', 'Ken', 'Bjarne'][
    i % 9
  ];
  const last = ['Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Liskov', 'Knuth', 'Stevens'][i % 7];
  return {
    value: `u-${i + 1}`,
    label: `${first} ${last} #${i + 1}`,
    description: `user-${(i + 1).toString().padStart(3, '0')}@example.com`,
  };
});

@Component({
  selector: 'app-select-page',
  imports: [
    DmSelectComponent,
    DmSelectOptionDirective,
    DmButtonComponent,
    DmCardComponent,
    DmErrorComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './select-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.select);
  protected readonly pets = PETS;
  protected readonly groupedPets = GROUPED_PETS;
  protected readonly countries = COUNTRIES;
  protected readonly roles = ROLES;
  protected readonly teams = TEAMS;
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;
  protected readonly statuses = STATUSES;
  protected readonly statusColors = STATUS_COLORS;

  // ---- Multiple / filter / groups demos ------------------------------------
  protected readonly multipleValues = signal<string[]>(['dog', 'rabbit']);
  protected readonly filterableValue = signal<string | null>(null);
  protected readonly groupedValue = signal<string | null>(null);
  protected readonly multiFilterValues = signal<string[]>([]);

  protected readonly multipleCode = [
    '<dm-select',
    '  label="Pets"',
    '  placeholder="Pick some"',
    '  multiple',
    '  clearable',
    '  [items]="pets"',
    '  [(values)]="selected"',
    '/>',
  ].join('\n');

  protected readonly multipleTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-multi-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './multi-select.component.html',",
    '})',
    'export class MultiSelectComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    "  protected readonly selected = signal<string[]>(['dog', 'rabbit']);",
    '}',
  ].join('\n');

  protected readonly filterableCode = [
    '<dm-select',
    '  label="Pet"',
    '  placeholder="Pick a pet"',
    '  filterable',
    '  filterPlaceholder="Search…"',
    '  noResultsLabel="No matches"',
    '  [items]="pets"',
    '  [(value)]="pet"',
    '/>',
  ].join('\n');

  protected readonly filterableTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-filterable-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './filterable-select.component.html',",
    '})',
    'export class FilterableSelectComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    '  protected readonly pet = signal<string | null>(null);',
    '}',
  ].join('\n');

  protected readonly groupedCode = [
    '<dm-select',
    '  label="Pet"',
    '  placeholder="Pick a pet"',
    '  [items]="groups"',
    '  [(value)]="pet"',
    '/>',
  ].join('\n');

  protected readonly groupedTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectOptionOrGroup } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-grouped-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './grouped-select.component.html',",
    '})',
    'export class GroupedSelectComponent {',
    '  protected readonly groups: DmSelectOptionOrGroup<string>[] = [',
    '    {',
    "      label: 'Mammals',",
    '      items: [',
    "        { value: 'cat', label: 'Cat' },",
    "        { value: 'dog', label: 'Dog' },",
    "        { value: 'rabbit', label: 'Rabbit' },",
    "        { value: 'hamster', label: 'Hamster' },",
    '      ],',
    '    },',
    '    {',
    "      label: 'Others',",
    '      items: [',
    "        { value: 'fish', label: 'Fish' },",
    "        { value: 'parrot', label: 'Parrot' },",
    "        { value: 'turtle', label: 'Turtle' },",
    '      ],',
    '    },',
    '  ];',
    '  protected readonly pet = signal<string | null>(null);',
    '}',
  ].join('\n');

  protected readonly multiFilterCode = [
    '<dm-select',
    '  label="Pets"',
    '  multiple',
    '  filterable',
    '  selectAllLabel="Select all"',
    '  clearAllLabel="Clear"',
    '  [items]="groups"',
    '  [(values)]="selected"',
    '/>',
  ].join('\n');

  protected readonly multiFilterTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectOptionOrGroup } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-multi-filter-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './multi-filter-select.component.html',",
    '})',
    'export class MultiFilterSelectComponent {',
    '  protected readonly groups: DmSelectOptionOrGroup<string>[] = [',
    '    {',
    "      label: 'Mammals',",
    '      items: [',
    "        { value: 'cat', label: 'Cat' },",
    "        { value: 'dog', label: 'Dog' },",
    "        { value: 'rabbit', label: 'Rabbit' },",
    "        { value: 'hamster', label: 'Hamster' },",
    '      ],',
    '    },',
    '    {',
    "      label: 'Others',",
    '      items: [',
    "        { value: 'fish', label: 'Fish' },",
    "        { value: 'parrot', label: 'Parrot' },",
    "        { value: 'turtle', label: 'Turtle' },",
    '      ],',
    '    },',
    '  ];',
    '  protected readonly selected = signal<string[]>([]);',
    '}',
  ].join('\n');

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    disabled: false,
    required: false,
  });

  protected readonly playgroundValue = signal<string | null>(null);

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
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmSelectColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmSelectVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmSelectRadius);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [
      'label="Pet"',
      'placeholder="Pick a pet"',
      '[items]="pets"',
      '[(value)]="pet"',
    ];
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
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-select\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Custom option template demo -----------------------------------------
  protected readonly optionTemplateValue = signal<string | null>('operational');

  protected readonly optionTemplateCode = [
    '<dm-select label="Status" placeholder="Pick a status" [items]="statuses" [(value)]="status">',
    '  <ng-template dmSelectOption let-item>',
    '    <span style="display: flex; align-items: center; gap: 0.5rem">',
    '      <span',
    '        style="width: 0.5rem; height: 0.5rem; border-radius: 999px; flex: none"',
    '        [style.background]="dotColors[item.value]"',
    '      ></span>',
    '      <span style="display: grid; min-width: 0">',
    '        <span>{{ item.label }}</span>',
    '        <span style="font-size: 0.75rem; color: var(--dm-fg-muted)">',
    '          {{ item.description }}',
    '        </span>',
    '      </span>',
    '    </span>',
    '  </ng-template>',
    '</dm-select>',
  ].join('\n');

  protected readonly optionTemplateTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem, DmSelectOptionDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-status-select',",
    '  imports: [DmSelectComponent, DmSelectOptionDirective],',
    "  templateUrl: './status-select.component.html',",
    '})',
    'export class StatusSelectComponent {',
    '  protected readonly statuses: DmSelectItem<string>[] = [',
    "    { value: 'operational', label: 'Operational', description: 'All systems normal' },",
    "    { value: 'degraded', label: 'Degraded', description: 'Partial outage in one region' },",
    "    { value: 'maintenance', label: 'Maintenance', description: 'Planned downtime in progress' },",
    "    { value: 'offline', label: 'Offline', description: 'Major outage' },",
    '  ];',
    '  protected readonly dotColors: Record<string, string> = {',
    "    operational: 'var(--dm-success)',",
    "    degraded: 'var(--dm-warning)',",
    "    maintenance: 'var(--dm-primary)',",
    "    offline: 'var(--dm-danger)',",
    '  };',
    "  protected readonly status = signal<string | null>('operational');",
    '}',
  ].join('\n');

  // ---- Async (server-driven) demos -----------------------------------------
  protected readonly asyncValue = signal<string | null>(null);
  protected readonly asyncButtonValue = signal<string | null>(null);

  /** Shared loadFn for the async demos: filters + slices the mock dataset. */
  protected readonly loadFn: DmSelectLoadFn<string> = ({ page, pageSize, query }) => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? ALL_USERS.filter(
          (u) => u.label.toLowerCase().includes(q) || u.description?.toLowerCase().includes(q),
        )
      : ALL_USERS;
    const start = page * pageSize;
    return of({ items: matched.slice(start, start + pageSize), total: matched.length }).pipe(
      delay(400),
    );
  };

  protected readonly asyncCode = [
    '<dm-select',
    '  label="Assignee"',
    '  placeholder="Pick a user"',
    '  filterable',
    '  clearable',
    '  [loadFn]="loadUsers"',
    '  [(value)]="userId"',
    '/>',
  ].join('\n');

  protected readonly asyncButtonCode = [
    '<dm-select',
    '  loadMoreMode="button"',
    '  loadMoreLabel="Load more"',
    '  [loadFn]="loadUsers"',
    '  [(value)]="userId"',
    '/>',
  ].join('\n');

  /** Full TS for the async demos — the loadFn is HttpClient-native. */
  protected readonly asyncTs = [
    "import { Component, inject, signal } from '@angular/core';",
    "import { HttpClient } from '@angular/common/http';",
    "import { map } from 'rxjs';",
    "import { DmSelectComponent, DmSelectLoadFn } from '@dmaster/ui';",
    '',
    'interface User { id: string; name: string; email: string; }',
    '',
    '@Component({',
    "  selector: 'app-assignee',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './assignee.component.html',",
    '})',
    'export class AssigneeComponent {',
    '  private readonly http = inject(HttpClient);',
    '  protected readonly userId = signal<string | null>(null);',
    '',
    '  // Works directly with HttpClient — rxResource cancels stale requests',
    '  // and the component pages, searches and caches labels on its own.',
    '  protected readonly loadUsers: DmSelectLoadFn<string> = ({ page, pageSize, query }) =>',
    "    this.http.get<{ data: User[]; total: number }>('/api/users', {",
    '      params: { page, pageSize, query },',
    '    }).pipe(',
    '      map((res) => ({',
    '        items: res.data.map((u) => ({ value: u.id, label: u.name, description: u.email })),',
    '        total: res.total,',
    '      })),',
    '    );',
    '}',
  ].join('\n');

  // ---- Demos ---------------------------------------------------------------
  protected readonly clearableValue = signal<string | null>('dog');

  protected readonly clearableCode = [
    '<dm-select',
    '  label="Pet"',
    '  placeholder="Pick a pet"',
    '  [items]="pets"',
    '  [(value)]="selected"',
    '  [clearable]="true"',
    '/>',
  ].join('\n');

  protected readonly clearableTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-clearable-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './clearable-select.component.html',",
    '})',
    'export class ClearableSelectComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    "  protected readonly selected = signal<string | null>('dog');",
    '}',
  ].join('\n');

  protected readonly basicCode = [
    '<dm-select label="Pet" placeholder="Pick a pet" [items]="pets" [(value)]="pet" />',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pet-select',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './pet-select.component.html',",
    '})',
    'export class PetSelectComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    '  protected readonly pet = signal<string | null>(null);',
    '}',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-select variant="${v}" label="${v}" placeholder="Pick one" [items]="pets" />`,
  ).join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-select-variants',",
    '  imports: [DmSelectComponent],',
    "  templateUrl: './select-variants.component.html',",
    '})',
    'export class SelectVariantsComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    '}',
  ].join('\n');

  protected readonly colorsCode = COLORS.map(
    (c) => `<dm-select color="${c}" label="${c}" placeholder="Pick one" [items]="pets" />`,
  ).join('\n');

  protected readonly formsCode = [
    '<dm-select',
    '  ariaLabel="Pet"',
    '  placeholder="Pick a pet"',
    '  [items]="pets"',
    '  [formControl]="control"',
    '/>',
    "<p>Value: {{ value() ?? '—' }}</p>",
  ].join('\n');

  protected readonly formsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    "import { DmSelectComponent, DmSelectItem } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pet-form',",
    '  imports: [DmSelectComponent, ReactiveFormsModule],',
    "  templateUrl: './pet-form.component.html',",
    '})',
    'export class PetFormComponent {',
    '  protected readonly pets: DmSelectItem<string>[] = [',
    "    { value: 'cat', label: 'Cat' },",
    "    { value: 'dog', label: 'Dog', description: \"Man's best friend\" },",
    "    { value: 'rabbit', label: 'Rabbit' },",
    "    { value: 'fish', label: 'Fish', disabled: true },",
    "    { value: 'hamster', label: 'Hamster' },",
    "    { value: 'parrot', label: 'Parrot' },",
    '  ];',
    "  protected readonly control = new FormControl<string | null>('dog');",
    "  protected readonly value = signal<string | null>('dog');",
    '',
    '  constructor() {',
    '    this.control.valueChanges.subscribe((v) => this.value.set(v));',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSelectDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSelectDefaults({ variant: 'bordered' })]",
  ].join('\n');

  // Reactive Forms demo
  protected readonly formControl = new FormControl<string | null>('dog');
  protected readonly formValue = signal<string | null>('dog');
  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formValue.set(v));
  }

  // ---- Validation with <dm-error> -----------------------------------------
  protected readonly requiredControl = new FormControl<string | null>(null, Validators.required);

  protected readonly validationCode = [
    '<!-- dm-select has no error slot: render <dm-error> right below it',
    '     (a role="alert" line, so it is announced the moment it appears). -->',
    '<div style="display: grid; gap: 0.375rem">',
    '  <dm-select',
    '    label="Pet"',
    '    placeholder="Pick a pet"',
    '    [items]="pets"',
    '    [required]="true"',
    '    [clearable]="true"',
    '    [formControl]="pet"',
    '  />',
    "  @if (pet.touched && pet.hasError('required')) {",
    '    <dm-error>Pick a pet to continue</dm-error>',
    '  }',
    '</div>',
  ].join('\n');

  protected readonly validationTs = [
    "import { Component } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';",
    "import { DmErrorComponent, DmSelectComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [DmSelectComponent, DmErrorComponent, ReactiveFormsModule],',
    '  templateUrl: …,',
    '})',
    'export class PetFormComponent {',
    '  pet = new FormControl<string | null>(null, Validators.required);',
    '}',
  ].join('\n');

  // ---- Composition: invite a team member ------------------------------------
  protected readonly inviteForm = new FormGroup({
    role: new FormControl<string | null>(null, Validators.required),
    teams: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
  });
  protected readonly inviting = signal(false);

  protected sendInvite(): void {
    if (this.inviting()) {
      return;
    }
    this.inviteForm.markAllAsTouched();
    if (this.inviteForm.invalid) {
      return;
    }
    this.inviting.set(true);
    setTimeout(() => {
      this.inviting.set(false);
      this.inviteForm.reset({ role: null, teams: [] });
    }, 1200);
  }

  protected readonly compositionCode = [
    '<!-- Invite flow: a grouped single select (role) + a multi-select with',
    '     chips (teams), each guarded by <dm-error>, and a stateful submit. -->',
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <form [formGroup]="form" (ngSubmit)="send()" novalidate style="display: grid; gap: 1rem">',
    '    <div>',
    '      <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Invite a team member</h3>',
    '      <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '        Choose a role and the teams they will join.',
    '      </p>',
    '    </div>',
    '',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <dm-select label="Role" placeholder="Pick a role" [items]="roles" [required]="true"',
    '                 formControlName="role" />',
    "      @if (form.controls.role.touched && form.controls.role.hasError('required')) {",
    '        <dm-error>A role is required</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <dm-select label="Teams" placeholder="Pick teams" description="They get access on day one."',
    '                 multiple [clearable]="true" [items]="teams" [required]="true"',
    '                 formControlName="teams" />',
    "      @if (form.controls.teams.touched && form.controls.teams.hasError('required')) {",
    '        <dm-error>Pick at least one team</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <dm-button type="submit" color="primary" style="width: 100%"',
    '               [loading]="loading()" loadingLabel="Sending…">',
    '      Send invite',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmErrorComponent,',
    '  DmSelectComponent,',
    '  DmSelectItem,',
    '  DmSelectOptionOrGroup,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [',
    '    DmCardComponent,',
    '    DmSelectComponent,',
    '    DmErrorComponent,',
    '    DmButtonComponent,',
    '    ReactiveFormsModule,',
    '  ],',
    '  templateUrl: …,',
    '})',
    'export class InviteMemberComponent {',
    '  roles: DmSelectOptionOrGroup<string>[] = [',
    "    { label: 'Engineering', items: [{ value: 'frontend', label: 'Frontend engineer' }, …] },",
    "    { label: 'Design', items: [{ value: 'product-designer', label: 'Product designer' }, …] },",
    '  ];',
    '  teams: DmSelectItem<string>[] = [',
    "    { value: 'platform', label: 'Platform' },",
    "    { value: 'design-system', label: 'Design System' },",
    '    …',
    '  ];',
    '',
    '  form = new FormGroup({',
    '    role: new FormControl<string | null>(null, Validators.required),',
    '    teams: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),',
    '  });',
    '  loading = signal(false);',
    '',
    '  send(): void {',
    '    this.form.markAllAsTouched();',
    '    if (this.form.invalid) return;',
    '    this.loading.set(true);',
    '    this.api.invite(this.form.getRawValue()).subscribe({',
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
        name: 'items',
        type: 'DmSelectOptionOrGroup<T>[]',
        default: '[]',
        description: api['items'],
      },
      { name: 'multiple', type: 'boolean', default: 'false', description: api['multiple'] },
      { name: 'value', type: 'model<T | null>', default: 'null', description: api['value'] },
      { name: 'values', type: 'model<T[]>', default: '[]', description: api['values'] },
      {
        name: 'compareWith',
        type: '(a: T, b: T) => boolean',
        default: '===',
        description: api['compareWith'],
      },
      { name: 'filterable', type: 'boolean', default: 'false', description: api['filterable'] },
      {
        name: 'filterPlaceholder',
        type: 'string',
        default: "''",
        description: api['filterPlaceholder'],
      },
      { name: 'noResultsLabel', type: 'string', default: "''", description: api['noResultsLabel'] },
      { name: 'selectAllLabel', type: 'string', default: "''", description: api['selectAllLabel'] },
      { name: 'clearAllLabel', type: 'string', default: "''", description: api['clearAllLabel'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
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
      { name: 'clearable', type: 'boolean', default: 'false', description: api['clearable'] },
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear'",
        description: api['clearAriaLabel'],
      },
      {
        name: 'filterClearAriaLabel',
        type: 'string',
        default: "'Clear'",
        description: api['filterClearAriaLabel'],
      },
      {
        name: 'dmSelectOption',
        type: 'TemplateRef<DmSelectOptionContext<T>>',
        description: api['optionTemplate'],
      },
      {
        name: 'loadFn',
        type: 'DmSelectLoadFn<T> | null',
        default: 'null',
        description: api['loadFn'],
      },
      { name: 'pageSize', type: 'number', default: '20', description: api['pageSize'] },
      {
        name: 'searchDebounceMs',
        type: 'number',
        default: '250',
        description: api['searchDebounceMs'],
      },
      {
        name: 'loadMoreMode',
        type: "'infinite' | 'button'",
        default: "'infinite'",
        description: api['loadMoreMode'],
      },
      {
        name: 'loadMoreLabel',
        type: 'string',
        default: "'Load more'",
        description: api['loadMoreLabel'],
      },
      {
        name: 'loadingLabel',
        type: 'string',
        default: "'Loading…'",
        description: api['loadingLabel'],
      },
      {
        name: 'selectedItems',
        type: 'DmSelectItem<T>[]',
        default: '[]',
        description: api['selectedItems'],
      },
    ];
  });
}
