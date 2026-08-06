import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  DmRadioColor,
  DmRadioComponent,
  DmRadioGroupComponent,
  DmRadioOrientation,
  DmRadioSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-radio-group-page',
  imports: [
    DmRadioGroupComponent,
    DmRadioComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './radio-group-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioGroupPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.radioGroup);

  // Playground
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    size: 'md',
    orientation: 'vertical',
    disabled: false,
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
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'vertical', value: 'vertical' },
        { label: 'horizontal', value: 'horizontal' },
      ],
    },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmRadioColor);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmRadioSize);
  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmRadioOrientation,
  );
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] as boolean);
  protected readonly pgValue = signal<string>('free');

  protected readonly playgroundCode = computed(() => {
    const groupAttrs: string[] = [`name="plan"`];
    if (this.pgColor() !== 'primary') groupAttrs.push(`color="${this.pgColor()}"`);
    if (this.pgSize() !== 'md') groupAttrs.push(`size="${this.pgSize()}"`);
    if (this.pgOrientation() !== 'vertical') {
      groupAttrs.push(`orientation="${this.pgOrientation()}"`);
    }
    if (this.pgDisabled()) groupAttrs.push('[disabled]="true"');
    groupAttrs.push('[(value)]="selected"');
    return [
      `<dm-radio-group ${groupAttrs.join(' ')}>`,
      '  <dm-radio value="free">Free</dm-radio>',
      '  <dm-radio value="pro">Pro</dm-radio>',
      '  <dm-radio value="enterprise">Enterprise</dm-radio>',
      '</dm-radio-group>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-radio-group name="plan" [(value)]="plan">',
    '  <dm-radio value="free">Free</dm-radio>',
    '  <dm-radio value="pro">Pro</dm-radio>',
    '  <dm-radio value="enterprise">Enterprise</dm-radio>',
    '</dm-radio-group>',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-radio-group name="c" color="primary" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="secondary" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="success" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="warning" [(value)]="v">…</dm-radio-group>',
    '<dm-radio-group name="c" color="danger" [(value)]="v">…</dm-radio-group>',
  ].join('\n');

  protected readonly horizontalCode = [
    '<dm-radio-group name="side" orientation="horizontal" [(value)]="side">',
    '  <dm-radio value="left">Left</dm-radio>',
    '  <dm-radio value="center">Center</dm-radio>',
    '  <dm-radio value="right">Right</dm-radio>',
    '</dm-radio-group>',
  ].join('\n');

  protected readonly formsCode = [
    "import { FormControl, ReactiveFormsModule } from '@angular/forms';",
    '',
    "protected readonly ctrl = new FormControl<string>('medium');",
    '',
    '<dm-radio-group name="size" [formControl]="ctrl">',
    '  <dm-radio value="small">Small</dm-radio>',
    '  <dm-radio value="medium">Medium</dm-radio>',
    '  <dm-radio value="large">Large</dm-radio>',
    '</dm-radio-group>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideRadioDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideRadioDefaults({ color: 'success', size: 'lg' }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly plan = signal<string>('pro');
  protected readonly side = signal<string>('center');
  protected readonly colorPick = signal<string>('a');
  protected readonly sizeCtrl = new FormControl<string>('medium');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'name', type: 'string', default: '—', description: api['name'] },
      { name: 'value', type: 'string | null', default: 'null', description: api['value'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['size'],
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: api['orientation'],
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: api['disabled'],
      },
      { name: 'value (radio)', type: 'string', default: '—', description: api['radioValue'] },
    ];
  });
}
