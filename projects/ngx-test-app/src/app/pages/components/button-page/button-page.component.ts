import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  DmButtonColor,
  DmButtonComponent,
  DmButtonRadius,
  DmButtonState,
  DmButtonVariant,
  DmCardComponent,
  DmIconComponent,
  DmSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const COLORS: DmButtonColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
const VARIANTS: DmButtonVariant[] = [
  'solid',
  'flat',
  'faded',
  'bordered',
  'light',
  'ghost',
  'shadow',
];

@Component({
  selector: 'app-button-page',
  imports: [
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './button-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private demoTimers: ReturnType<typeof setTimeout>[] = [];

  protected readonly colors = COLORS;
  protected readonly variants = VARIANTS;

  constructor() {
    this.destroyRef.onDestroy(() => this.demoTimers.forEach(clearTimeout));
  }

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    variant: 'solid',
    radius: 'full',
    size: 'md',
    state: 'idle',
    disabled: false,
    label: 'Save changes',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: COLORS.map((value) => ({ label: value, value })),
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: VARIANTS.map((value) => ({ label: value, value })),
    },
    {
      key: 'radius',
      label: 'radius',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'].map((value) => ({ label: value, value })),
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    {
      key: 'state',
      label: 'state',
      type: 'select',
      options: ['idle', 'loading', 'success', 'error'].map((value) => ({ label: value, value })),
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'label', label: 'label', type: 'text', placeholder: 'Save changes' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmButtonColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmButtonVariant);
  protected readonly pgRadius = computed(() => this.playground()['radius'] as DmButtonRadius);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgState = computed(() => this.playground()['state'] as DmButtonState);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgLabel = computed(
    () => (this.playground()['label'] as string) || 'Save changes',
  );

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'primary') {
      attrs.push(`color="${this.pgColor()}"`);
    }
    if (this.pgVariant() !== 'solid') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgRadius() !== 'full') {
      attrs.push(`radius="${this.pgRadius()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgState() !== 'idle') {
      attrs.push(`state="${this.pgState()}"`);
    }
    if (this.pgDisabled()) {
      attrs.push(`[disabled]="true"`);
    }
    const open = attrs.length > 0 ? `<dm-button ${attrs.join(' ')}>` : '<dm-button>';
    return `${open}${this.pgLabel()}</dm-button>`;
  });

  // ---- Demo async ----------------------------------------------------------
  protected readonly demoState = signal<DmButtonState>('idle');

  protected runAsyncDemo(): void {
    if (this.demoState() !== 'idle') {
      return;
    }
    this.demoState.set('loading');
    this.demoTimers.push(
      setTimeout(() => {
        this.demoState.set('success');
        this.demoTimers.push(setTimeout(() => this.demoState.set('idle'), 1200));
      }, 1500),
    );
  }

  // ---- Snippets ------------------------------------------------------------
  protected readonly colorsCode = COLORS.map(
    (c) => `<dm-button color="${c}">${c}</dm-button>`,
  ).join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonColor, DmButtonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-button-colors',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './button-colors.component.html',",
    '})',
    'export class ButtonColorsComponent {',
    "  readonly colors: DmButtonColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];",
    '}',
  ].join('\n');

  protected readonly variantsCode = VARIANTS.map(
    (v) => `<dm-button variant="${v}">${v}</dm-button>`,
  ).join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonVariant } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-button-variants',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './button-variants.component.html',",
    '})',
    'export class ButtonVariantsComponent {',
    "  readonly variants: DmButtonVariant[] = ['solid', 'flat', 'faded', 'bordered', 'light', 'ghost', 'shadow'];",
    '}',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-button size="sm">Small</dm-button>',
    '<dm-button size="md">Medium</dm-button>',
    '<dm-button size="lg">Large</dm-button>',
    '<dm-button radius="full">Pill</dm-button>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-button-sizes',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './button-sizes.component.html',",
    '})',
    'export class ButtonSizesComponent {}',
  ].join('\n');

  protected readonly statesCode = [
    '<dm-button>Idle</dm-button>',
    '<dm-button state="loading" loadingLabel="Saving…">Saving</dm-button>',
    '<dm-button state="success" successLabel="Saved">Saved</dm-button>',
    '<dm-button color="danger" state="error" errorLabel="Failed">Failed</dm-button>',
    '<dm-button [disabled]="true">Disabled</dm-button>',
  ].join('\n');

  protected readonly statesTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-button-states',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './button-states.component.html',",
    '})',
    'export class ButtonStatesComponent {}',
  ].join('\n');

  protected readonly asyncCode = [
    '<dm-button [state]="state()" loadingLabel="Saving…" (clicked)="save()">',
    '  Save changes',
    '</dm-button>',
  ].join('\n');

  protected readonly asyncTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonState } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-async-button',",
    '  imports: [DmButtonComponent],',
    "  templateUrl: './async-button.component.html',",
    '})',
    'export class AsyncButtonComponent {',
    "  readonly state = signal<DmButtonState>('idle');",
    '',
    '  save(): void {',
    "    this.state.set('loading');",
    '    this.api.save().subscribe({',
    "      next: () => this.state.set('success'),",
    "      error: () => this.state.set('error'),",
    '    });',
    '  }',
    '}',
  ].join('\n');

  protected readonly iconButtonsCode = [
    '<!-- Leading icon + label: both project into the button. -->',
    '<dm-button variant="flat">',
    '  <dm-icon name="download" size="1.15em" /> Download',
    '</dm-button>',
    '<dm-button color="primary">',
    '  <dm-icon name="plus" size="1.15em" /> New file',
    '</dm-button>',
    '',
    '<!-- Icon-only: `label` on dm-icon names the button for AT. -->',
    '<dm-button variant="ghost"><dm-icon name="edit" label="Edit" /></dm-button>',
    '<dm-button variant="ghost"><dm-icon name="copy" label="Duplicate" /></dm-button>',
    '<dm-button color="danger" variant="flat">',
    '  <dm-icon name="trash" label="Delete" />',
    '</dm-button>',
  ].join('\n');

  protected readonly iconButtonsTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-icon-buttons',",
    '  imports: [DmButtonComponent, DmIconComponent],',
    "  templateUrl: './icon-buttons.component.html',",
    '})',
    'export class IconButtonsComponent {}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A document card: an icon-button toolbar up top, then a -->',
    '<!-- Cancel / Publish action bar in the footer. -->',
    '<dm-card style="max-width: 30rem">',
    '  <div style="display: flex; align-items: center; gap: 0.75rem">',
    '    <strong style="flex: 1; min-width: 0">Release notes</strong>',
    '    <dm-button variant="ghost" size="sm">',
    '      <dm-icon name="star" label="Star" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm">',
    '      <dm-icon name="copy" label="Duplicate" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm">',
    '      <dm-icon name="more-horizontal" label="More actions" />',
    '    </dm-button>',
    '  </div>',
    '',
    '  <p class="muted">Ship the color × variant button API…</p>',
    '',
    '  <div class="card-actions">',
    '    <dm-button variant="ghost">Cancel</dm-button>',
    '    <dm-button color="primary">',
    '      <dm-icon name="check" size="1.15em" /> Publish',
    '    </dm-button>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-note-card',",
    '  imports: [DmButtonComponent, DmCardComponent, DmIconComponent],',
    "  templateUrl: './note-card.component.html',",
    '})',
    'export class NoteCardComponent {',
    '  save(): void {',
    '    // persist the note…',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideButtonDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideButtonDefaults({ variant: 'flat', radius: 'lg' }),",
    ']',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.i18n.t().buttonPage.api;
    return [
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api.color,
      },
      {
        name: 'variant',
        type: "'solid' | 'flat' | 'faded' | 'bordered' | 'light' | 'ghost' | 'shadow'",
        default: "'solid'",
        description: api.variant,
      },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api.radius,
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api.size },
      {
        name: 'state',
        type: "'idle' | 'loading' | 'success' | 'error'",
        default: "'idle'",
        description: api.state,
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api.disabled },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        default: "'button'",
        description: api.type,
      },
      { name: 'loadingLabel', type: 'string', default: "''", description: api.loadingLabel },
      { name: 'successLabel', type: 'string', default: "''", description: api.successLabel },
      { name: 'errorLabel', type: 'string', default: "''", description: api.errorLabel },
      { name: 'clicked', type: 'output<MouseEvent>', description: api.clicked },
    ];
  });
}
