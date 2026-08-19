import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAlertColor,
  DmAlertComponent,
  DmAlertVariant,
  DmButtonComponent,
  DmCardComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-alert-page',
  imports: [
    DmAlertComponent,
    DmButtonComponent,
    DmCardComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './alert-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.alert);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'success',
    variant: 'flat',
    dismissible: false,
    hideIcon: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: [
        { label: 'default', value: 'default' },
        { label: 'primary', value: 'primary' },
        { label: 'secondary', value: 'secondary' },
        { label: 'success', value: 'success' },
        { label: 'warning', value: 'warning' },
        { label: 'danger', value: 'danger' },
      ],
    },
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'flat', value: 'flat' },
        { label: 'faded', value: 'faded' },
        { label: 'solid', value: 'solid' },
        { label: 'bordered', value: 'bordered' },
      ],
    },
    { key: 'dismissible', label: 'dismissible', type: 'boolean' },
    { key: 'hideIcon', label: 'hideIcon', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmAlertColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmAlertVariant);
  protected readonly pgDismissible = computed(() => this.playground()['dismissible'] as boolean);
  protected readonly pgHideIcon = computed(() => this.playground()['hideIcon'] as boolean);

  // El playground recrea la alerta con un @if cuando se descarta (patrón del README).
  protected readonly pgVisible = signal(true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'default') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgVariant() !== 'flat') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgDismissible()) attrs.push('[dismissible]="true"');
    if (this.pgHideIcon()) attrs.push('[hideIcon]="true"');
    return [
      '<dm-alert',
      ...attrs.map((attr) => `  ${attr}`),
      '  title="Payment received"',
      '  description="We emailed the receipt to your inbox."',
      '/>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-alert title="Heads up" description="A new version is available." />',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-alert color="default" title="Default" description="Neutral information." />',
    '<dm-alert color="primary" title="Primary" description="A new version is available." />',
    '<dm-alert color="secondary" title="Secondary" description="Scheduled maintenance tonight." />',
    '<dm-alert color="success" title="Success" description="Your changes were saved." />',
    '<dm-alert color="warning" title="Warning" description="Your trial ends in 3 days." />',
    '<dm-alert color="danger" title="Danger" description="The payment could not be processed." />',
  ].join('\n');

  protected readonly variantsCode = [
    '<dm-alert variant="flat" color="primary" title="Flat" description="Soft tinted fill." />',
    '<dm-alert variant="faded" color="primary" title="Faded" description="Tinted fill plus a colored border." />',
    '<dm-alert variant="solid" color="primary" title="Solid" description="Full color fill." />',
    '<dm-alert variant="bordered" color="primary" title="Bordered" description="Transparent with a colored border." />',
  ].join('\n');

  protected readonly descriptionCode = [
    '<dm-alert',
    '  color="warning"',
    '  title="Storage almost full"',
    '  description="You have used 92% of your quota. Uploads may start to fail until you free',
    '    some space or upgrade your plan. Files in the trash still count towards the limit."',
    '/>',
    '',
    '<!-- Free body content renders below the description -->',
    '<dm-alert color="primary" title="Custom body" description="Structured content is welcome.">',
    '  <p>Anything projected inside renders in the content column.</p>',
    '</dm-alert>',
  ].join('\n');

  protected readonly dismissibleCode = [
    '@if (alertVisible()) {',
    '  <dm-alert',
    '    color="success"',
    '    title="Profile updated"',
    '    description="Your changes were saved."',
    '    [dismissible]="true"',
    '    (closed)="alertVisible.set(false)"',
    '  />',
    '} @else {',
    '  <dm-button size="sm" variant="flat" (clicked)="alertVisible.set(true)">Show alert</dm-button>',
    '}',
  ].join('\n');

  protected readonly actionCode = [
    '<dm-alert color="danger" variant="faded" title="Message deleted" [dismissible]="true">',
    '  <dm-button dmAlertAction size="sm" variant="light" color="danger">Undo</dm-button>',
    '</dm-alert>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideAlertDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideAlertDefaults({ variant: 'faded', dismissLabel: 'Cerrar' }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly demoDismissed = signal(false);

  // Composition: a real billing panel driven by state.
  protected readonly billingSaved = signal(false);
  protected readonly cardExpiring = signal(true);

  protected readonly compositionCode = [
    '<!-- Alerts doing real work inside a billing panel. -->',
    '<dm-card style="width: 100%; max-width: 30rem">',
    '  <div style="display: grid; gap: 1rem">',
    '    <div style="display: flex; align-items: baseline; justify-content: space-between">',
    '      <h3 style="margin: 0; font-size: 1.05rem">Billing</h3>',
    '      <span style="color: var(--dm-fg-muted); font-size: 0.85rem">Pro · $24/mo</span>',
    '    </div>',
    '',
    '    <!-- Success confirmation appears only after saving. -->',
    '    @if (billingSaved()) {',
    '      <dm-alert',
    '        color="success"',
    '        title="Changes saved"',
    '        description="Your billing details were updated."',
    '        [dismissible]="true"',
    '        (closed)="billingSaved.set(false)"',
    '      />',
    '    }',
    '',
    '    <!-- Warning with an inline action to fix the problem. -->',
    '    @if (cardExpiring()) {',
    '      <dm-alert',
    '        color="warning"',
    '        variant="faded"',
    '        title="Card expiring soon"',
    '        description="Visa ending 4242 expires next month. Update it to avoid a failed charge."',
    '      >',
    '        <dm-button',
    '          dmAlertAction',
    '          size="sm"',
    '          variant="flat"',
    '          color="warning"',
    '          (clicked)="cardExpiring.set(false)"',
    '        >',
    '          Update card',
    '        </dm-button>',
    '      </dm-alert>',
    '    }',
    '',
    '    <div style="display: flex; justify-content: flex-end; gap: 0.5rem">',
    '      <dm-button size="sm" variant="light">Cancel</dm-button>',
    '      <dm-button size="sm" (clicked)="billingSaved.set(true)">Save changes</dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { ChangeDetectionStrategy, Component, signal } from '@angular/core';",
    "import { DmAlertComponent, DmButtonComponent, DmCardComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-billing-panel',",
    '  imports: [DmAlertComponent, DmButtonComponent, DmCardComponent],',
    "  templateUrl: './billing-panel.component.html',",
    '  changeDetection: ChangeDetectionStrategy.OnPush,',
    '})',
    'export class BillingPanelComponent {',
    '  // A save confirmation and a card-expiry warning, each toggled independently.',
    '  protected readonly billingSaved = signal(false);',
    '  protected readonly cardExpiring = signal(true);',
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'flat' | 'faded' | 'solid' | 'bordered'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'title', type: 'string', default: '—', description: api['title'] },
      { name: 'description', type: 'string', default: '—', description: api['description'] },
      { name: 'hideIcon', type: 'boolean', default: 'false', description: api['hideIcon'] },
      { name: 'dismissible', type: 'boolean', default: 'false', description: api['dismissible'] },
      {
        name: 'dismissLabel',
        type: 'string',
        default: "'Dismiss'",
        description: api['dismissLabel'],
      },
      {
        name: 'closed',
        type: 'OutputEmitterRef<void>',
        default: '—',
        description: api['closed'],
      },
    ];
  });
}
