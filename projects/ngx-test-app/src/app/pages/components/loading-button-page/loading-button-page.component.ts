import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  DmLoadingButtonComponent,
  DmLoadingButtonState,
  DmLoadingButtonVariant,
  DmSize,
} from 'ngx-dmaster-ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-loading-button-page',
  imports: [
    DmLoadingButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './loading-button-page.component.html',
  styleUrl: './loading-button-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingButtonPageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private demoTimers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    this.destroyRef.onDestroy(() => this.demoTimers.forEach(clearTimeout));
  }

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    variant: 'primary',
    size: 'md',
    state: 'idle',
    disabled: false,
    label: 'Save changes',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'primary', value: 'primary' },
        { label: 'secondary', value: 'secondary' },
        { label: 'outline', value: 'outline' },
        { label: 'ghost', value: 'ghost' },
        { label: 'danger', value: 'danger' },
      ],
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' },
      ],
    },
    {
      key: 'state',
      label: 'state',
      type: 'select',
      options: [
        { label: 'idle', value: 'idle' },
        { label: 'loading', value: 'loading' },
        { label: 'success', value: 'success' },
        { label: 'error', value: 'error' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
    { key: 'label', label: 'label', type: 'text', placeholder: 'Save changes' },
  ];

  protected readonly pgVariant = computed(
    () => this.playground()['variant'] as DmLoadingButtonVariant,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgState = computed(() => this.playground()['state'] as DmLoadingButtonState);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgLabel = computed(
    () => (this.playground()['label'] as string) || 'Save changes',
  );

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgVariant() !== 'primary') {
      attrs.push(`variant="${this.pgVariant()}"`);
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
    const open =
      attrs.length > 0 ? `<dm-loading-button ${attrs.join(' ')}>` : '<dm-loading-button>';
    return `${open}${this.pgLabel()}</dm-loading-button>`;
  });

  // ---- Demo async ----------------------------------------------------------
  protected readonly demoState = signal<DmLoadingButtonState>('idle');

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
  protected readonly variantsCode = [
    '<dm-loading-button>Primary</dm-loading-button>',
    '<dm-loading-button variant="secondary">Secondary</dm-loading-button>',
    '<dm-loading-button variant="outline">Outline</dm-loading-button>',
    '<dm-loading-button variant="ghost">Ghost</dm-loading-button>',
    '<dm-loading-button variant="danger">Danger</dm-loading-button>',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-loading-button size="sm">Small</dm-loading-button>',
    '<dm-loading-button size="md">Medium</dm-loading-button>',
    '<dm-loading-button size="lg">Large</dm-loading-button>',
  ].join('\n');

  protected readonly statesCode = [
    '<dm-loading-button>Idle</dm-loading-button>',
    '<dm-loading-button state="loading" loadingLabel="Saving…">Saving</dm-loading-button>',
    '<dm-loading-button state="success" successLabel="Saved">Saved</dm-loading-button>',
    '<dm-loading-button variant="danger" state="error" errorLabel="Failed">Failed</dm-loading-button>',
    '<dm-loading-button [disabled]="true">Disabled</dm-loading-button>',
  ].join('\n');

  protected readonly asyncCode = [
    '// component.ts',
    "state = signal<DmLoadingButtonState>('idle');",
    '',
    'save(): void {',
    "  this.state.set('loading');",
    '  this.api.save().subscribe({',
    "    next: () => this.state.set('success'),",
    "    error: () => this.state.set('error'),",
    '  });',
    '}',
    '',
    '<!-- component.html -->',
    '<dm-loading-button [state]="state()" loadingLabel="Saving…" (clicked)="save()">',
    '  Save changes',
    '</dm-loading-button>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideLoadingButtonDefaults } from 'ngx-dmaster-ui';",
    '',
    'providers: [',
    "  provideLoadingButtonDefaults({ variant: 'outline', size: 'lg' }),",
    ']',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.i18n.t().loadingButtonPage.api;
    return [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'",
        default: "'primary'",
        description: api.variant,
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
