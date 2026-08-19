import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAccordionComponent,
  DmAccordionItemComponent,
  DmAccordionVariant,
  DmCardComponent,
  DmIconComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-accordion-page',
  imports: [
    DmAccordionComponent,
    DmAccordionItemComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './accordion-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.accordion);

  // Playground
  protected readonly playground = signal<PropValues>({
    variant: 'light',
    selectionMode: 'single',
    disabled: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'light', value: 'light' },
        { label: 'bordered', value: 'bordered' },
        { label: 'shadow', value: 'shadow' },
        { label: 'splitted', value: 'splitted' },
      ],
    },
    {
      key: 'selectionMode',
      label: 'selectionMode',
      type: 'select',
      options: [
        { label: 'single', value: 'single' },
        { label: 'multiple', value: 'multiple' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmAccordionVariant);
  protected readonly pgMode = computed(
    () => this.playground()['selectionMode'] as 'single' | 'multiple',
  );
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] as boolean);
  protected readonly pgExpanded = signal<string[]>(['features']);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgVariant() !== 'light') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgMode() !== 'single') attrs.push(`selectionMode="${this.pgMode()}"`);
    if (this.pgDisabled()) attrs.push('[disabled]="true"');
    return [
      `<dm-accordion${attrs.length ? ' ' + attrs.join(' ') : ''}>`,
      '  <dm-accordion-item value="features" title="Features">',
      '    Signals-first, zoneless-ready, flat and pill-radius styling.',
      '  </dm-accordion-item>',
      '  <dm-accordion-item value="a11y" title="Accessibility">',
      '    ARIA-compliant, full keyboard navigation.',
      '  </dm-accordion-item>',
      '  <dm-accordion-item value="theming" title="Theming">',
      '    Override any --dm-* token to re-skin.',
      '  </dm-accordion-item>',
      '</dm-accordion>',
    ].join('\n');
  });

  // ---- Snippets ------------------------------------------------------------ //
  protected readonly singleCode = [
    '<dm-accordion selectionMode="single">',
    '  <dm-accordion-item value="plan" title="Can I change my plan later?">',
    '    Upgrade or downgrade anytime — changes are prorated.',
    '  </dm-accordion-item>',
    '  <dm-accordion-item value="trial" title="Do you offer a free trial?">',
    '    Every paid plan starts with a 14-day trial. No card required.',
    '  </dm-accordion-item>',
    '  <dm-accordion-item value="refund" title="What\'s your refund policy?">',
    '    Full refund within 30 days, no questions asked.',
    '  </dm-accordion-item>',
    '</dm-accordion>',
  ].join('\n');

  protected readonly singleTs = [
    "import { Component } from '@angular/core';",
    "import { DmAccordionComponent, DmAccordionItemComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [DmAccordionComponent, DmAccordionItemComponent],',
    '  template: `...`, // paste the HTML above',
    '})',
    'export class FaqComponent {}',
  ].join('\n');

  protected readonly multipleCode = [
    '<dm-accordion selectionMode="multiple" [(expandedValues)]="open">',
    '  <dm-accordion-item value="a" title="Alpha">…</dm-accordion-item>',
    '  <dm-accordion-item value="b" title="Beta">…</dm-accordion-item>',
    '  <dm-accordion-item value="c" title="Charlie">…</dm-accordion-item>',
    '</dm-accordion>',
  ].join('\n');

  protected readonly multipleTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmAccordionComponent, DmAccordionItemComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    '  imports: [DmAccordionComponent, DmAccordionItemComponent],',
    '  template: `...`,',
    '})',
    'export class MultiAccordionComponent {',
    "  open = signal<string[]>(['a', 'c']);",
    '}',
  ].join('\n');

  protected readonly variantsCode = [
    '<dm-accordion variant="light" />    <!-- default -->',
    '<dm-accordion variant="bordered" />',
    '<dm-accordion variant="shadow" />',
    '<dm-accordion variant="splitted" />',
  ].join('\n');

  protected readonly disabledCode = [
    '<dm-accordion>',
    '  <dm-accordion-item value="a" title="Enabled">…</dm-accordion-item>',
    '  <dm-accordion-item value="b" title="Disabled" [disabled]="true">',
    '    You cannot open this item.',
    '  </dm-accordion-item>',
    '</dm-accordion>',
  ].join('\n');

  protected readonly iconCode = [
    '<dm-accordion variant="splitted">',
    '  <dm-accordion-item value="downloads" title="Downloads">',
    '    <!-- [dm-accordion-icon]: must be width="1em" height="1em" (inherits font-size) -->',
    '    <svg dm-accordion-icon width="1em" height="1em" viewBox="0 0 24 24"',
    '         fill="none" stroke="currentColor" stroke-width="2"',
    '         stroke-linecap="round" stroke-linejoin="round">',
    '      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
    '      <polyline points="7 10 12 15 17 10"/>',
    '      <line x1="12" y1="15" x2="12" y2="3"/>',
    '    </svg>',
    '    Get the desktop app and CLI to keep working offline.',
    '  </dm-accordion-item>',
    '  <dm-accordion-item value="preferences" title="Preferences">',
    '    <svg dm-accordion-icon width="1em" height="1em" viewBox="0 0 24 24"',
    '         fill="none" stroke="currentColor" stroke-width="2"',
    '         stroke-linecap="round" stroke-linejoin="round">',
    '      <circle cx="12" cy="12" r="3"/>',
    '      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>',
    '    </svg>',
    '    Fine-tune notifications, appearance and keyboard shortcuts.',
    '  </dm-accordion-item>',
    '  <dm-accordion-item value="region" title="Language &amp; region">',
    '    <svg dm-accordion-icon width="1em" height="1em" viewBox="0 0 24 24"',
    '         fill="none" stroke="currentColor" stroke-width="2"',
    '         stroke-linecap="round" stroke-linejoin="round">',
    '      <circle cx="12" cy="12" r="10"/>',
    '      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    '    </svg>',
    '    Choose your locale, currency and time zone.',
    '  </dm-accordion-item>',
    '</dm-accordion>',
  ].join('\n');

  // ---- Composition: a real Help Center FAQ card --------------------------- //
  protected readonly compositionCode = [
    '<!-- A real help/FAQ surface: an accordion sitting flush inside a card,',
    '     each header carrying a leading icon and a muted answer. -->',
    '<dm-card padding="none" style="width: 100%; max-width: 34rem">',
    '  <div style="display: flex; align-items: center; gap: 0.75rem;',
    '              padding: 1.25rem 1.25rem 1rem; border-bottom: 1px solid var(--dm-border)">',
    '    <span style="display: inline-flex; align-items: center; justify-content: center;',
    '                 width: 2.5rem; height: 2.5rem; border-radius: var(--dm-radius-md);',
    '                 background: var(--dm-primary-subtle); color: var(--dm-primary)">',
    '      <dm-icon name="sparkles" size="1.25rem" />',
    '    </span>',
    '    <div>',
    '      <strong style="display: block; font-size: 1.0625rem">Help Center</strong>',
    '      <span style="color: var(--dm-fg-muted); font-size: 0.875rem">',
    '        Answers to the questions we hear most',
    '      </span>',
    '    </div>',
    '  </div>',
    '',
    '  <dm-accordion variant="light" selectionMode="single" [(expandedValues)]="faqOpen"',
    '                style="padding: 0.25rem 0.5rem 0.5rem">',
    '    <dm-accordion-item value="invite" title="How do I invite my team?">',
    '      <dm-icon dm-accordion-icon name="user" size="1em" />',
    '      <span style="color: var(--dm-fg-muted)">',
    '        Open <strong style="color: var(--dm-fg)">Settings → Members</strong>, paste a list',
    '        of emails and pick a role. Invites expire after 7 days.',
    '      </span>',
    '    </dm-accordion-item>',
    '    <dm-accordion-item value="security" title="Is my data encrypted?">',
    '      <dm-icon dm-accordion-icon name="shield-check" size="1em" />',
    '      <span style="color: var(--dm-fg-muted)">',
    '        Everything is encrypted in transit (TLS 1.3) and at rest (AES-256). We are',
    '        SOC 2 Type II certified and never sell your data.',
    '      </span>',
    '    </dm-accordion-item>',
    '    <dm-accordion-item value="billing" title="Can I change plans or cancel anytime?">',
    '      <dm-icon dm-accordion-icon name="refresh" size="1em" />',
    '      <span style="color: var(--dm-fg-muted)">',
    '        Yes — upgrade, downgrade or cancel from the billing page. Changes are',
    '        prorated to the day, no lock-in.',
    '      </span>',
    '    </dm-accordion-item>',
    '    <dm-accordion-item value="support" title="How do I reach support?">',
    '      <dm-icon dm-accordion-icon name="mail" size="1em" />',
    '      <span style="color: var(--dm-fg-muted)">',
    '        Email <strong style="color: var(--dm-fg)">help@dmaster.io</strong> or use the',
    '        in-app chat. Paid plans get a reply within one business day.',
    '      </span>',
    '    </dm-accordion-item>',
    '  </dm-accordion>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    'import {',
    '  DmAccordionComponent,',
    '  DmAccordionItemComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-help-faq',",
    '  imports: [',
    '    DmCardComponent,',
    '    DmAccordionComponent,',
    '    DmAccordionItemComponent,',
    '    DmIconComponent,',
    '  ],',
    '  template: `...`, // paste the HTML above',
    '})',
    'export class HelpFaqComponent {',
    '  // First question opens by default; single mode keeps one panel at a time.',
    "  protected readonly faqOpen = signal<string[]>(['invite']);",
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideAccordionDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideAccordionDefaults({ variant: 'splitted', selectionMode: 'multiple' }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly multipleOpen = signal<string[]>(['a', 'c']);
  protected readonly faqOpen = signal<string[]>(['invite']);

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'selectionMode',
        type: "'single' | 'multiple'",
        default: "'single'",
        description: api['selectionMode'],
      },
      {
        name: 'expandedValues',
        type: 'string[]',
        default: '[]',
        description: api['expandedValues'],
      },
      {
        name: 'variant',
        type: "'light' | 'bordered' | 'shadow' | 'splitted'",
        default: "'light'",
        description: api['variant'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'value (item)', type: 'string', default: '—', description: api['value'] },
      { name: 'title (item)', type: 'string', default: "''", description: api['title'] },
      { name: 'subtitle (item)', type: 'string', default: "''", description: api['subtitle'] },
      {
        name: '[dm-accordion-icon]',
        type: 'content slot',
        default: '—',
        description: api['icon'],
      },
    ];
  });
}
