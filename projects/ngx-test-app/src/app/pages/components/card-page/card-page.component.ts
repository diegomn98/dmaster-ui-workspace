import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardAppearance,
  DmCardComponent,
  DmCardPadding,
  DmIconComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** Self-contained portrait (data URI) so demos never hit the network. */
const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#6366f1"/><circle cx="24" cy="18" r="8" fill="#fff" opacity="0.92"/><path d="M8 46c0-9 7-15 16-15s16 6 16 15" fill="#fff" opacity="0.92"/></svg>`;

@Component({
  selector: 'app-card-page',
  imports: [
    DmCardComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './card-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.card);

  /** Demo portrait for the sections and composition cards. */
  protected readonly avatarSrc = `data:image/svg+xml;utf8,${encodeURIComponent(AVATAR_SVG)}`;

  /** Feature list for the pricing composition. */
  protected readonly planFeatures = [
    'Unlimited projects',
    'Advanced analytics',
    'Priority support',
    'Custom domains',
  ];

  protected readonly playground = signal<PropValues>({
    appearance: 'elevated',
    padding: 'md',
    interactive: false,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'appearance',
      label: 'appearance',
      type: 'select',
      options: ['elevated', 'outlined', 'flat'].map((value) => ({ label: value, value })),
    },
    {
      key: 'padding',
      label: 'padding',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    { key: 'interactive', label: 'interactive', type: 'boolean' },
  ];

  protected readonly pgAppearance = computed(
    () => this.playground()['appearance'] as DmCardAppearance,
  );
  protected readonly pgPadding = computed(() => this.playground()['padding'] as DmCardPadding);
  protected readonly pgInteractive = computed(() => this.playground()['interactive'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgAppearance() !== 'elevated') {
      attrs.push(`appearance="${this.pgAppearance()}"`);
    }
    if (this.pgPadding() !== 'md') {
      attrs.push(`padding="${this.pgPadding()}"`);
    }
    if (this.pgInteractive()) {
      attrs.push('[interactive]="true"');
    }
    const open = attrs.length > 0 ? `<dm-card ${attrs.join(' ')}>` : '<dm-card>';
    return `${open}…</dm-card>`;
  });

  protected readonly appearancesCode = [
    '<!-- Three flat surface treatments; no gradients, no sheen. -->',
    '<dm-card>elevated — soft diffuse shadow</dm-card>',
    '<dm-card appearance="outlined">outlined — strong border</dm-card>',
    '<dm-card appearance="flat">flat — muted fill</dm-card>',
  ].join('\n');

  protected readonly appearancesTs = [
    "import { Component } from '@angular/core';",
    "import { DmCardComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-card-appearances',",
    '  imports: [DmCardComponent],',
    "  templateUrl: './card-appearances.component.html',",
    '})',
    'export class CardAppearancesComponent {}',
  ].join('\n');

  protected readonly paddingCode = [
    '<!-- Four padding steps. Use "none" when a child (media, a table,',
    '     a list) needs to bleed to the card edges. -->',
    '<dm-card padding="none">none</dm-card>',
    '<dm-card padding="sm">sm</dm-card>',
    '<dm-card padding="md">md</dm-card>',
    '<dm-card padding="lg">lg</dm-card>',
  ].join('\n');

  protected readonly paddingTs = [
    "import { Component } from '@angular/core';",
    "import { DmCardComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-card-padding',",
    '  imports: [DmCardComponent],',
    "  templateUrl: './card-padding.component.html',",
    '})',
    'export class CardPaddingComponent {}',
  ].join('\n');

  protected readonly interactiveCode = [
    '<!-- interactive adds the hover lift + press. Wrap the card in a',
    '     link or button so it gets real focus and click semantics. -->',
    '<a routerLink="/projects/42" style="text-decoration: none; color: inherit">',
    '  <dm-card [interactive]="true">…</dm-card>',
    '</a>',
  ].join('\n');

  protected readonly interactiveTs = [
    "import { Component } from '@angular/core';",
    "import { RouterLink } from '@angular/router';",
    "import { DmCardComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-card-interactive',",
    '  imports: [DmCardComponent, RouterLink],',
    "  templateUrl: './card-interactive.component.html',",
    '})',
    'export class CardInteractiveComponent {}',
  ].join('\n');

  protected readonly sectionsCode = [
    '<!-- padding="none" hands layout to inner sections divided by',
    '     hairline borders: header, scrollable body, footer actions. -->',
    '<dm-card padding="none" style="max-width: 24rem">',
    '  <header style="display: flex; align-items: center; gap: 0.75rem;',
    '                 padding: 1rem 1.25rem; border-bottom: 1px solid var(--dm-border)">',
    '    <dm-avatar [src]="avatar" alt="Ada Lovelace" />',
    '    <div style="flex: 1; min-width: 0">',
    '      <strong>Ada Lovelace</strong>',
    '      <p style="margin: 0; font-size: 0.8125rem; color: var(--dm-fg-muted)">2 hours ago</p>',
    '    </div>',
    '    <dm-badge color="success" variant="flat" size="sm">New</dm-badge>',
    '  </header>',
    '  <div style="padding: 1.25rem; color: var(--dm-fg-muted); font-size: 0.9375rem">',
    '    Shipped the new overlay primitives — tooltip, dialog and toast all',
    '    land in the next release. Take a look when you get a moment.',
    '  </div>',
    '  <footer style="display: flex; justify-content: flex-end; gap: 0.5rem;',
    '                 padding: 0.875rem 1.25rem; border-top: 1px solid var(--dm-border)">',
    '    <dm-button variant="ghost" size="sm">Dismiss</dm-button>',
    '    <dm-button color="primary" size="sm">Reply</dm-button>',
    '  </footer>',
    '</dm-card>',
  ].join('\n');

  protected readonly sectionsTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    "} from '@dmaster/ui';",
    '',
    'const AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#6366f1"/><circle cx="24" cy="18" r="8" fill="#fff" opacity="0.92"/><path d="M8 46c0-9 7-15 16-15s16 6 16 15" fill="#fff" opacity="0.92"/></svg>`;',
    '',
    '@Component({',
    "  selector: 'app-card-sections',",
    '  imports: [DmCardComponent, DmAvatarComponent, DmBadgeComponent, DmButtonComponent],',
    "  templateUrl: './card-sections.component.html',",
    '})',
    'export class CardSectionsComponent {',
    '  protected readonly avatar = `data:image/svg+xml;utf8,${encodeURIComponent(AVATAR_SVG)}`;',
    '}',
  ].join('\n');

  protected readonly mediaCode = [
    '<!-- A cover card: padding="none" lets a full-bleed banner sit flush',
    '     to the rounded corners, with padded content beneath it. -->',
    '<dm-card padding="none" style="max-width: 22rem; overflow: hidden">',
    '  <div style="height: 8rem; background:',
    '              linear-gradient(135deg, var(--dm-primary-hover), var(--dm-primary))"></div>',
    '  <div style="padding: 1.25rem; display: grid; gap: 0.5rem">',
    '    <div style="display: flex; align-items: center; gap: 0.5rem">',
    '      <h3 style="margin: 0; font-size: 1rem">Design tokens</h3>',
    '      <dm-badge color="primary" variant="flat" size="sm">Guide</dm-badge>',
    '    </div>',
    '    <p style="margin: 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '      How the semantic color, spacing and radius scales fit together.',
    '    </p>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly mediaTs = [
    "import { Component } from '@angular/core';",
    "import { DmBadgeComponent, DmCardComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-card-media',",
    '  imports: [DmCardComponent, DmBadgeComponent],',
    "  templateUrl: './card-media.component.html',",
    '})',
    'export class CardMediaComponent {}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A real pricing card: highlighted plan, price, a feature list with',
    '     check icons, and a full-width CTA — assembled from four primitives. -->',
    '<dm-card appearance="outlined" [interactive]="true"',
    '         style="max-width: 20rem; display: grid; gap: 1rem">',
    '  <div style="display: flex; align-items: center; justify-content: space-between">',
    '    <span style="font-weight: 600">Pro</span>',
    '    <dm-badge color="primary" variant="flat" size="sm">Most popular</dm-badge>',
    '  </div>',
    '',
    '  <div style="display: flex; align-items: baseline; gap: 0.25rem">',
    '    <span style="font-size: 2.25rem; font-weight: 700; letter-spacing: -0.02em">$19</span>',
    '    <span style="color: var(--dm-fg-muted)">/month</span>',
    '  </div>',
    '',
    '  <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 0.625rem">',
    '    @for (feature of features; track feature) {',
    '      <li style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.9375rem">',
    '        <dm-icon name="check" size="1.15em" style="color: var(--dm-success)" />',
    '        {{ feature }}',
    '      </li>',
    '    }',
    '  </ul>',
    '',
    '  <dm-button color="primary" style="width: 100%">Choose Pro</dm-button>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pricing-card',",
    '  imports: [DmCardComponent, DmBadgeComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './pricing-card.component.html',",
    '})',
    'export class PricingCardComponent {',
    '  protected readonly features = [',
    "    'Unlimited projects',",
    "    'Advanced analytics',",
    "    'Priority support',",
    "    'Custom domains',",
    '  ];',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideCardDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideCardDefaults({ appearance: 'outlined', padding: 'lg' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'appearance',
        type: "'elevated' | 'outlined' | 'flat'",
        default: "'elevated'",
        description: api['appearance'],
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['padding'],
      },
      { name: 'interactive', type: 'boolean', default: 'false', description: api['interactive'] },
    ];
  });
}
