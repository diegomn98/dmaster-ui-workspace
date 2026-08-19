import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonComponent,
  DmCardComponent,
  DmDividerComponent,
  DmDividerLabelPlacement,
  DmDividerOrientation,
  DmFormFieldComponent,
  DmInputDirective,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-divider-page',
  imports: [
    DmDividerComponent,
    DmCardComponent,
    DmButtonComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './divider-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DividerPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.divider);

  // Playground
  protected readonly playground = signal<PropValues>({
    orientation: 'horizontal',
    labelPlacement: 'center',
    label: 'OR',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
      ],
    },
    {
      key: 'labelPlacement',
      label: 'labelPlacement',
      type: 'select',
      options: [
        { label: 'start', value: 'start' },
        { label: 'center', value: 'center' },
        { label: 'end', value: 'end' },
      ],
    },
    { key: 'label', label: 'label', type: 'text', placeholder: 'OR' },
  ];

  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmDividerOrientation,
  );
  protected readonly pgLabelPlacement = computed(
    () => this.playground()['labelPlacement'] as DmDividerLabelPlacement,
  );
  protected readonly pgLabel = computed(() => this.playground()['label'] as string);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgOrientation() !== 'horizontal') {
      attrs.push(`orientation="${this.pgOrientation()}"`);
    }
    if (this.pgLabelPlacement() !== 'center') {
      attrs.push(`labelPlacement="${this.pgLabelPlacement()}"`);
    }
    const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    return this.pgLabel()
      ? `<dm-divider${attrStr}>${this.pgLabel()}</dm-divider>`
      : `<dm-divider${attrStr} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<p>Flat fills, generous radii, soft shadows.</p>',
    '<dm-divider />',
    '<p>Semantic tokens for every color in both themes.</p>',
  ].join('\n');

  protected readonly withLabelCode = [
    '<dm-divider labelPlacement="start">Start</dm-divider>',
    '<dm-divider>Center</dm-divider>',
    '<dm-divider labelPlacement="end">End</dm-divider>',
  ].join('\n');

  protected readonly verticalCode = [
    '<div style="display: flex; align-items: center; gap: 1rem; height: 1.5rem">',
    '  <span>Blog</span>',
    '  <dm-divider orientation="vertical" />',
    '  <span>Docs</span>',
    '  <dm-divider orientation="vertical" />',
    '  <span>Changelog</span>',
    '</div>',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A labelled divider is the canonical "OR" seam on a sign-in card:',
    '     it splits the social button from the email/password path. -->',
    '<dm-card style="width: 100%; max-width: 22rem">',
    '  <div style="display: grid; gap: 1rem">',
    '    <div style="display: grid; gap: 0.25rem">',
    '      <p style="margin: 0; font-size: 1.125rem; font-weight: 650">Sign in to Acme</p>',
    '      <p style="margin: 0; color: var(--dm-fg-muted)">',
    '        Welcome back — pick up where you left off.',
    '      </p>',
    '    </div>',
    '',
    '    <dm-button variant="bordered" style="width: 100%">Continue with Google</dm-button>',
    '',
    '    <dm-divider>OR</dm-divider>',
    '',
    '    <dm-form-field label="Email">',
    '      <input dmInput type="email" placeholder="you@acme.com" />',
    '    </dm-form-field>',
    '    <dm-form-field label="Password">',
    '      <input dmInput type="password" placeholder="••••••••" />',
    '    </dm-form-field>',
    '',
    '    <dm-button color="primary" style="width: 100%">Sign in</dm-button>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmDividerComponent,',
    '  DmFormFieldComponent,',
    '  DmInputDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-sign-in',",
    '  imports: [',
    '    DmCardComponent,',
    '    DmButtonComponent,',
    '    DmDividerComponent,',
    '    DmFormFieldComponent,',
    '    DmInputDirective,',
    '  ],',
    '  template: `',
    '    <dm-card style="max-width: 22rem">',
    '      <dm-button variant="bordered">Continue with Google</dm-button>',
    '',
    '      <!-- The label turns a plain rule into a labelled "OR" seam -->',
    '      <dm-divider>OR</dm-divider>',
    '',
    '      <dm-form-field label="Email">',
    '        <input dmInput type="email" placeholder="you@acme.com" />',
    '      </dm-form-field>',
    '      <dm-form-field label="Password">',
    '        <input dmInput type="password" />',
    '      </dm-form-field>',
    '',
    '      <dm-button color="primary">Sign in</dm-button>',
    '    </dm-card>',
    '  `,',
    '})',
    'export class SignInComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideDividerDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideDividerDefaults({ labelPlacement: 'start' }),",
    ']',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: api['orientation'],
      },
      {
        name: 'labelPlacement',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
        description: api['labelPlacement'],
      },
      { name: 'ng-content', type: '—', default: '—', description: api['content'] },
    ];
  });
}
