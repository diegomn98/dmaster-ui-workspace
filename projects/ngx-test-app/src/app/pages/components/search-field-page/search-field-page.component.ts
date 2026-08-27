import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmAvatarComponent,
  DmCardComponent,
  DmSearchFieldColor,
  DmSearchFieldComponent,
  DmSearchFieldRadius,
  DmSearchFieldVariant,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const VARIANTS: DmSearchFieldVariant[] = ['flat', 'bordered', 'faded', 'underlined'];
const COLORS: DmSearchFieldColor[] = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
];

/** Self-contained colored avatar (data URI) — initials on a flat fill. */
function avatarSvg(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${color}"/><text x="24" y="30" font-family="system-ui, sans-serif" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface DemoContact {
  name: string;
  email: string;
  initials: string;
  color: string;
  src: string;
}

@Component({
  selector: 'app-search-field-page',
  imports: [
    DmSearchFieldComponent,
    DmAvatarComponent,
    DmCardComponent,
    ReactiveFormsModule,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './search-field-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.searchField);
  protected readonly variants = VARIANTS;
  protected readonly colors = COLORS;

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    radius: 'md',
    clearable: true,
    disabled: false,
    required: false,
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
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'required', label: 'required', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmSearchFieldColor);
  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmSearchFieldVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmSearchFieldRadius);
  protected readonly pgClearable = computed(() => this.playground()['clearable'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgRequired = computed(() => this.playground()['required'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['label="Search"', 'placeholder="Search…"', '[(value)]="query"'];
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
    if (!this.pgClearable()) {
      attrs.push('[clearable]="false"');
    }
    if (this.pgDisabled()) {
      attrs.push('[disabled]="true"');
    }
    if (this.pgRequired()) {
      attrs.push('[required]="true"');
    }
    return `<dm-search-field\n  ${attrs.join('\n  ')}\n/>`;
  });

  // ---- Demos ---------------------------------------------------------------
  protected readonly basicCode = [
    '<dm-search-field label="Search" placeholder="Search…" [(value)]="query" />',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-basic-search',",
    '  imports: [DmSearchFieldComponent],',
    "  templateUrl: './basic-search.component.html',",
    '})',
    'export class BasicSearchComponent {',
    "  protected readonly query = signal('');",
    '}',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-search-field variant="${v}" [label]="'${v}'" placeholder="Search…" />`,
  ).join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-search-variants',",
    '  imports: [DmSearchFieldComponent],',
    "  templateUrl: './search-variants.component.html',",
    '})',
    'export class SearchVariantsComponent {}',
  ].join('\n');

  protected readonly colorsCode = COLORS.map(
    (c) => `<dm-search-field color="${c}" [label]="'${c}'" value="query" />`,
  ).join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-search-colors',",
    '  imports: [DmSearchFieldComponent],',
    "  templateUrl: './search-colors.component.html',",
    '})',
    'export class SearchColorsComponent {}',
  ].join('\n');

  protected readonly sizesCode = ['sm', 'md', 'lg']
    .map((s) => `<dm-search-field size="${s}" placeholder="Search…" />`)
    .join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-search-sizes',",
    '  imports: [DmSearchFieldComponent],',
    "  templateUrl: './search-sizes.component.html',",
    '})',
    'export class SearchSizesComponent {}',
  ].join('\n');

  protected readonly eventsCode = [
    '<dm-search-field',
    '  label="Search"',
    '  placeholder="Type and press Enter…"',
    '  [(value)]="query"',
    '  (searchSubmit)="onSubmit($event)"',
    '  (cleared)="onCleared()"',
    '/>',
  ].join('\n');

  protected readonly eventsTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-search-events',",
    '  imports: [DmSearchFieldComponent],',
    "  templateUrl: './search-events.component.html',",
    '})',
    'export class SearchEventsComponent {',
    "  protected readonly query = signal('');",
    "  protected readonly lastEvent = signal('—');",
    '',
    '  protected onSubmit(value: string): void {',
    '    this.lastEvent.set(`search: "${value}"`);',
    '  }',
    '',
    '  protected onCleared(): void {',
    "    this.lastEvent.set('cleared');",
    '  }',
    '}',
  ].join('\n');

  protected readonly formsCode = [
    '<dm-search-field label="Search" placeholder="Search…" [formControl]="control" />',
  ].join('\n');

  protected readonly formsTs = [
    "import { Component } from '@angular/core';",
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    "import { DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-search-forms',",
    '  imports: [DmSearchFieldComponent, ReactiveFormsModule],',
    "  templateUrl: './search-forms.component.html',",
    '})',
    'export class SearchFormsComponent {',
    "  protected readonly control = new FormControl('', { nonNullable: true });",
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSearchFieldDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideSearchFieldDefaults({ variant: 'bordered', radius: 'md' })]",
  ].join('\n');

  // Controlled + events demo state
  protected readonly eventsValue = signal<string>('');
  protected readonly lastEvent = signal<string>('—');

  protected onSubmit(value: string): void {
    this.lastEvent.set(`search: "${value}"`);
  }

  protected onCleared(): void {
    this.lastEvent.set('cleared');
  }

  // Reactive Forms demo
  protected readonly formControl = new FormControl<string>('components', { nonNullable: true });
  protected readonly formValue = signal<string>('components');
  constructor() {
    this.formControl.valueChanges.subscribe((v) => this.formValue.set(v ?? ''));
  }

  // ---- Composition: searchable contact list --------------------------------
  protected readonly contacts: DemoContact[] = [
    { name: 'Ada Lovelace', email: 'ada@dmaster.io', initials: 'AL', color: '#6366f1' },
    { name: 'Grace Hopper', email: 'grace@dmaster.io', initials: 'GH', color: '#0ea5e9' },
    { name: 'Alan Turing', email: 'alan@dmaster.io', initials: 'AT', color: '#10b981' },
    { name: 'Katherine Johnson', email: 'katherine@dmaster.io', initials: 'KJ', color: '#f59e0b' },
    { name: 'Linus Torvalds', email: 'linus@dmaster.io', initials: 'LT', color: '#ef4444' },
  ].map((c) => ({ ...c, src: avatarSvg(c.initials, c.color) }));

  protected readonly contactQuery = signal<string>('');

  protected readonly filteredContacts = computed<DemoContact[]>(() => {
    const q = this.contactQuery().trim().toLowerCase();
    if (!q) {
      return this.contacts;
    }
    return this.contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    );
  });

  protected readonly compositionCode = [
    '<!-- A searchable contact list: field on top, rows filtered live below. -->',
    '<dm-card style="max-width: 24rem">',
    '  <dm-search-field',
    '    ariaLabel="Search contacts"',
    '    placeholder="Search by name or email…"',
    '    size="sm"',
    '    [(value)]="query"',
    '  />',
    '  <ul class="contacts">',
    '    @for (c of filtered(); track c.email) {',
    '      <li class="contacts__row">',
    '        <dm-avatar [src]="c.src" [alt]="c.name" size="sm" />',
    '        <div>',
    '          <div>{{ c.name }}</div>',
    '          <div class="muted">{{ c.email }}</div>',
    '        </div>',
    '      </li>',
    '    } @empty {',
    '      <li class="contacts__empty">No matches for “{{ query() }}”</li>',
    '    }',
    '  </ul>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmAvatarComponent, DmCardComponent, DmSearchFieldComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-contact-list',",
    '  imports: [DmAvatarComponent, DmCardComponent, DmSearchFieldComponent],',
    "  templateUrl: './contact-list.component.html',",
    '})',
    'export class ContactListComponent {',
    '  protected readonly contacts = [',
    "    { name: 'Ada Lovelace', email: 'ada@dmaster.io', src: '/u/ada.png' },",
    "    { name: 'Grace Hopper', email: 'grace@dmaster.io', src: '/u/grace.png' },",
    "    { name: 'Alan Turing', email: 'alan@dmaster.io', src: '/u/alan.png' },",
    '  ];',
    '',
    "  protected readonly query = signal('');",
    '',
    '  protected readonly filtered = computed(() => {',
    '    const q = this.query().trim().toLowerCase();',
    '    if (!q) return this.contacts;',
    '    return this.contacts.filter(',
    '      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),',
    '    );',
    '  });',
    '}',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'model<string>', default: "''", description: api['value'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
      { name: 'placeholder', type: 'string', default: "''", description: api['placeholder'] },
      { name: 'description', type: 'string', default: "''", description: api['description'] },
      { name: 'error', type: 'string', default: "''", description: api['error'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'readOnly', type: 'boolean', default: 'false', description: api['readOnly'] },
      { name: 'required', type: 'boolean', default: 'false', description: api['required'] },
      { name: 'clearable', type: 'boolean', default: 'true', description: api['clearable'] },
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
      { name: 'name', type: 'string', default: "''", description: api['name'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'clearAriaLabel',
        type: 'string',
        default: "'Clear search'",
        description: api['clearAriaLabel'],
      },
      {
        name: 'searchSubmit',
        type: 'output<string>',
        default: '—',
        description: api['search'],
      },
      { name: 'cleared', type: 'output<void>', default: '—', description: api['cleared'] },
    ];
  });
}
