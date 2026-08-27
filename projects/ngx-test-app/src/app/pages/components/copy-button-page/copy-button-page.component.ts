import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonColor,
  DmButtonVariant,
  DmCardComponent,
  DmCopyButtonComponent,
  DmCopyToClipboardDirective,
  DmIconComponent,
  DmSize,
  DmToastService,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-copy-button-page',
  imports: [
    DmCopyButtonComponent,
    DmCopyToClipboardDirective,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './copy-button-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyButtonPageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly toast = inject(DmToastService);
  protected readonly page = computed(() => this.i18n.t().pages.copyButton);

  // Playground — appearance knobs plus a toggle for the visible label form.
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    withLabel: false,
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
        { label: 'solid', value: 'solid' },
        { label: 'flat', value: 'flat' },
        { label: 'faded', value: 'faded' },
        { label: 'bordered', value: 'bordered' },
        { label: 'light', value: 'light' },
        { label: 'ghost', value: 'ghost' },
        { label: 'shadow', value: 'shadow' },
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
    { key: 'withLabel', label: 'withLabel', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmButtonColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmButtonVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgWithLabel = computed(() => this.playground()['withLabel'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = ['value="dm_a1B2c3D4e5"'];
    if (this.playground()['color'] !== 'default')
      attrs.push(`color="${this.playground()['color']}"`);
    if (this.playground()['variant'] !== 'flat')
      attrs.push(`variant="${this.playground()['variant']}"`);
    if (this.playground()['size'] !== 'md') attrs.push(`size="${this.playground()['size']}"`);
    if (this.pgWithLabel()) {
      attrs.push('copyLabel="Copy"', 'copiedLabel="Copied!"');
    } else {
      attrs.push('ariaLabel="Copy API key"');
    }
    return `<dm-copy-button ${attrs.join(' ')} />`;
  });

  // Demo code — Basic (icon-only next to the value it copies).
  protected readonly basicCode = [
    '<div style="display: flex; align-items: center; gap: 0.75rem">',
    '  <code>dm_a1B2c3D4e5</code>',
    '  <dm-copy-button value="dm_a1B2c3D4e5" ariaLabel="Copy API key" />',
    '</div>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmCopyButtonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-copy-basic',",
    '  imports: [DmCopyButtonComponent],',
    "  templateUrl: './copy-basic.component.html',",
    '})',
    'export class CopyBasicComponent {}',
  ].join('\n');

  // With a visible label — the check + copiedLabel show for resetDelay ms.
  protected readonly labelCode = [
    '<!-- copyLabel becomes copiedLabel while the check is showing -->',
    '<dm-copy-button',
    '  value="https://dmasterui.com"',
    '  variant="bordered"',
    '  copyLabel="Copy"',
    '  copiedLabel="Copied!"',
    '  copiedAriaLabel="Link copied"',
    '/>',
  ].join('\n');

  // Colors and variants — same surface as dm-button.
  protected readonly variantsCode = [
    '<!-- color × variant is forwarded straight to the inner dm-button -->',
    '<dm-copy-button value="primary" color="primary" ariaLabel="Copy value" />',
    '<dm-copy-button value="success" color="success" ariaLabel="Copy value" />',
    '<dm-copy-button value="danger" color="danger" ariaLabel="Copy value" />',
    '',
    '<dm-copy-button value="solid" variant="solid" color="primary" ariaLabel="Copy value" />',
    '<dm-copy-button value="bordered" variant="bordered" ariaLabel="Copy value" />',
    '<dm-copy-button value="light" variant="light" ariaLabel="Copy value" />',
  ].join('\n');

  // Sizes.
  protected readonly sizesCode = [
    '<dm-copy-button value="Small" size="sm" ariaLabel="Copy value" />',
    '<dm-copy-button value="Medium" size="md" ariaLabel="Copy value" />',
    '<dm-copy-button value="Large" size="lg" ariaLabel="Copy value" />',
  ].join('\n');

  // The dmCopyToClipboard directive on a plain button.
  protected readonly directiveCode = [
    '<!-- Add copy behaviour to any button you already have -->',
    '<button type="button" [dmCopyToClipboard]="code" #cp="dmCopyToClipboard">',
    "  <dm-icon aria-hidden=\"true\">{{ cp.isCopied() ? 'check' : 'content_copy' }}</dm-icon>",
    "  {{ cp.isCopied() ? 'Copied!' : 'Copy' }}",
    '</button>',
  ].join('\n');

  protected readonly directiveTs = [
    "import { Component } from '@angular/core';",
    "import { DmCopyToClipboardDirective, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-copy-directive',",
    '  imports: [DmCopyToClipboardDirective, DmIconComponent],',
    "  templateUrl: './copy-directive.component.html',",
    '})',
    'export class CopyDirectiveComponent {',
    "  protected readonly code = 'WELCOME25';",
    '}',
  ].join('\n');

  // Composition — a credentials card with copy buttons per row.
  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 32rem">',
    '  <strong>API credentials</strong>',
    '  <p style="color: var(--dm-fg-muted); margin: 0.25rem 0 1rem">',
    '    Keep these secret. Copy them straight into your .env file.',
    '  </p>',
    '',
    '  <div class="cred-row">',
    '    <code>sk_test_dmaster_ui_1a2b3c4d</code>',
    '    <dm-copy-button',
    '      value="sk_test_dmaster_ui_1a2b3c4d"',
    '      variant="light"',
    '      size="sm"',
    '      ariaLabel="Copy API key"',
    '      copiedAriaLabel="API key copied"',
    '      (copied)="onCopied()"',
    '    />',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, inject } from '@angular/core';",
    "import { DmCardComponent, DmCopyButtonComponent, DmToastService } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-credentials-card',",
    '  imports: [DmCardComponent, DmCopyButtonComponent],',
    "  templateUrl: './credentials-card.component.html',",
    '})',
    'export class CredentialsCardComponent {',
    '  private readonly toast = inject(DmToastService);',
    '',
    '  onCopied(): void {',
    "    this.toast.success('Copied to clipboard');",
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideCopyButtonDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideCopyButtonDefaults({ variant: 'bordered', resetDelay: 1200 }),",
    ']',
  ].join('\n');

  protected onCopied(): void {
    this.toast.success(this.page().labels['copiedToast']);
  }

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'string', default: '— (required)', description: api['value'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'default'",
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'solid' | 'flat' | 'faded' | 'bordered' | 'light' | 'ghost' | 'shadow'",
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
      { name: 'resetDelay', type: 'number', default: '2000', description: api['resetDelay'] },
      { name: 'copyLabel', type: 'string', default: "''", description: api['copyLabel'] },
      { name: 'copiedLabel', type: 'string', default: "''", description: api['copiedLabel'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      {
        name: 'copiedAriaLabel',
        type: 'string',
        default: "''",
        description: api['copiedAriaLabel'],
      },
      { name: 'copied', type: 'output<string>', default: '—', description: api['copied'] },
      { name: 'copyError', type: 'output<unknown>', default: '—', description: api['copyError'] },
      {
        name: '[dmCopyToClipboard]',
        type: 'directive',
        default: '—',
        description: api['directive'],
      },
    ];
  });
}
