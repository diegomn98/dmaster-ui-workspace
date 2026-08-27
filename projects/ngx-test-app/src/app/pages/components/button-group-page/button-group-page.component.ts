import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonColor,
  DmButtonComponent,
  DmButtonGroupComponent,
  DmButtonGroupOrientation,
  DmButtonVariant,
  DmCardComponent,
  DmIconComponent,
  DmMenuComponent,
  DmMenuItemComponent,
  DmMenuTriggerDirective,
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
  selector: 'app-button-group-page',
  imports: [
    DmButtonGroupComponent,
    DmButtonComponent,
    DmIconComponent,
    DmCardComponent,
    DmMenuComponent,
    DmMenuItemComponent,
    DmMenuTriggerDirective,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './button-group-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupPageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly toast = inject(DmToastService);
  protected readonly page = computed(() => this.i18n.t().pages.buttonGroup);

  // Playground — group-level appearance cascades to the buttons.
  protected readonly playground = signal<PropValues>({
    color: 'default',
    variant: 'flat',
    size: 'md',
    orientation: 'horizontal',
    fullWidth: false,
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
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'solid', value: 'solid' },
        { label: 'flat', value: 'flat' },
        { label: 'faded', value: 'faded' },
        { label: 'bordered', value: 'bordered' },
        { label: 'light', value: 'light' },
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
        { label: 'horizontal', value: 'horizontal' },
        { label: 'vertical', value: 'vertical' },
      ],
    },
    { key: 'fullWidth', label: 'fullWidth', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmButtonColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmButtonVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmSize);
  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmButtonGroupOrientation,
  );
  protected readonly pgFullWidth = computed(() => this.playground()['fullWidth'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.playground()['color'] !== 'default')
      attrs.push(`color="${this.playground()['color']}"`);
    if (this.playground()['variant'] !== 'flat')
      attrs.push(`variant="${this.playground()['variant']}"`);
    if (this.playground()['size'] !== 'md') attrs.push(`size="${this.playground()['size']}"`);
    if (this.pgOrientation() !== 'horizontal') attrs.push(`orientation="${this.pgOrientation()}"`);
    if (this.pgFullWidth()) attrs.push('fullWidth');
    if (this.pgDisabled()) attrs.push('disabled');
    attrs.push('ariaLabel="Actions"');
    return [
      '<!-- color / variant / size set on the group cascade to every button -->',
      `<dm-button-group ${attrs.join(' ')}>`,
      '  <dm-button>Copy</dm-button>',
      '  <dm-button>Cut</dm-button>',
      '  <dm-button>Paste</dm-button>',
      '</dm-button-group>',
    ].join('\n');
  });

  // Demo code
  protected readonly attachedCode = [
    '<!-- variant set once on the group; a subtle seam separates the segments -->',
    '<dm-button-group variant="flat" ariaLabel="Editing">',
    '  <dm-button>Copy</dm-button>',
    '  <dm-button>Cut</dm-button>',
    '  <dm-button>Paste</dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly attachedTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-attached-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent],',
    "  templateUrl: './attached-demo.component.html',",
    '})',
    'export class AttachedDemoComponent {}',
  ].join('\n');

  protected readonly alignmentCode = [
    '<!-- Icon-only buttons still need their own ariaLabel -->',
    '<dm-button-group variant="bordered" ariaLabel="Text alignment">',
    '  <dm-button ariaLabel="Left"><dm-icon>format_align_left</dm-icon></dm-button>',
    '  <dm-button ariaLabel="Center"><dm-icon>format_align_center</dm-icon></dm-button>',
    '  <dm-button ariaLabel="Right"><dm-icon>format_align_right</dm-icon></dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly alignmentTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-alignment-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './alignment-demo.component.html',",
    '})',
    'export class AlignmentDemoComponent {}',
  ].join('\n');

  protected readonly solidCode = [
    '<!-- Solid fills read as one bar with 1px seams between the segments -->',
    '<dm-button-group color="primary" ariaLabel="Pager">',
    '  <dm-button ariaLabel="Previous"><dm-icon>chevron_left</dm-icon></dm-button>',
    '  <dm-button>Page 3</dm-button>',
    '  <dm-button ariaLabel="Next"><dm-icon>chevron_right</dm-icon></dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly solidTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pager-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './pager-demo.component.html',",
    '})',
    'export class PagerDemoComponent {}',
  ].join('\n');

  protected readonly overrideCode = [
    '<!-- The cascade is per-button overridable: the last one turns danger -->',
    '<dm-button-group variant="flat" ariaLabel="File actions">',
    '  <dm-button>Rename</dm-button>',
    '  <dm-button>Duplicate</dm-button>',
    '  <dm-button color="danger">Delete</dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly overrideTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-file-actions-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent],',
    "  templateUrl: './file-actions-demo.component.html',",
    '})',
    'export class FileActionsDemoComponent {}',
  ].join('\n');

  protected readonly verticalCode = [
    '<dm-button-group orientation="vertical" variant="bordered" ariaLabel="Zoom">',
    '  <dm-button ariaLabel="Zoom in"><dm-icon>add</dm-icon></dm-button>',
    '  <dm-button ariaLabel="Reset">100%</dm-button>',
    '  <dm-button ariaLabel="Zoom out"><dm-icon>remove</dm-icon></dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly verticalTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-zoom-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './zoom-demo.component.html',",
    '})',
    'export class ZoomDemoComponent {}',
  ].join('\n');

  protected readonly fullWidthCode = [
    '<dm-button-group fullWidth variant="flat" ariaLabel="Pagination">',
    '  <dm-button>Previous</dm-button>',
    '  <dm-button>Next</dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly fullWidthTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-full-width-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent],',
    "  templateUrl: './full-width-demo.component.html',",
    '})',
    'export class FullWidthDemoComponent {}',
  ].join('\n');

  protected readonly splitCode = [
    '<!-- Split button: the group sets the color once; the caret opens a menu -->',
    '<dm-button-group color="primary" ariaLabel="Save options">',
    '  <dm-button (clicked)="save()">Save</dm-button>',
    '  <dm-button ariaLabel="More save options" [dmMenuTrigger]="saveMenu">',
    '    <dm-icon>expand_more</dm-icon>',
    '  </dm-button>',
    '</dm-button-group>',
    '',
    '<dm-menu #saveMenu ariaLabel="Save options">',
    '  <dm-menu-item (selected)="saveAndClose()">Save and close</dm-menu-item>',
    '  <dm-menu-item (selected)="saveAsCopy()">Save as copy…</dm-menu-item>',
    '  <dm-menu-item (selected)="saveAsTemplate()">Save as template</dm-menu-item>',
    '</dm-menu>',
  ].join('\n');

  protected readonly splitTs = [
    "import { Component, inject } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmButtonGroupComponent,',
    '  DmIconComponent,',
    '  DmMenuComponent,',
    '  DmMenuItemComponent,',
    '  DmMenuTriggerDirective,',
    '  DmToastService,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-save-split',",
    '  imports: [',
    '    DmButtonGroupComponent,',
    '    DmButtonComponent,',
    '    DmIconComponent,',
    '    DmMenuComponent,',
    '    DmMenuItemComponent,',
    '    DmMenuTriggerDirective,',
    '  ],',
    "  templateUrl: './save-split.component.html',",
    '})',
    'export class SaveSplitComponent {',
    '  private readonly toast = inject(DmToastService);',
    '',
    '  save(): void {',
    "    this.toast.success('Saved');",
    '  }',
    '',
    '  saveAndClose(): void {',
    "    this.toast.show('Saved and closed');",
    '  }',
    '',
    '  saveAsCopy(): void {',
    "    this.toast.show('Saved as copy');",
    '  }',
    '',
    '  saveAsTemplate(): void {',
    "    this.toast.show('Saved as template');",
    '  }',
    '}',
  ].join('\n');

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 30rem">',
    '  <strong>Document</strong>',
    '',
    '  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.75rem">',
    '    <dm-button-group variant="flat" size="sm" ariaLabel="Text format">',
    '      <dm-button ariaLabel="Bold"><strong>B</strong></dm-button>',
    '      <dm-button ariaLabel="Italic"><em>I</em></dm-button>',
    '      <dm-button ariaLabel="Underline">U</dm-button>',
    '    </dm-button-group>',
    '',
    '    <dm-button-group variant="flat" size="sm" ariaLabel="Text alignment">',
    '      <dm-button ariaLabel="Left"><dm-icon>format_align_left</dm-icon></dm-button>',
    '      <dm-button ariaLabel="Center"><dm-icon>format_align_center</dm-icon></dm-button>',
    '      <dm-button ariaLabel="Right"><dm-icon>format_align_right</dm-icon></dm-button>',
    '    </dm-button-group>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmCardComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-editor-toolbar',",
    '  imports: [DmCardComponent, DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './editor-toolbar.component.html',",
    '})',
    'export class EditorToolbarComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideButtonGroupDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideButtonGroupDefaults({ orientation: 'vertical' }),",
    ']',
  ].join('\n');

  protected save(): void {
    this.toast.success(this.page().labels['savedToast']);
  }

  protected menuAction(labelKey: string): void {
    this.toast.show(this.page().labels[labelKey]);
  }

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: '—',
        description: api['color'],
      },
      {
        name: 'variant',
        type: "'solid' | 'flat' | 'faded' | 'bordered' | 'light' | 'ghost' | 'shadow'",
        default: '—',
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: '—', description: api['size'] },
      {
        name: 'radius',
        type: "'none' | 'sm' | 'md' | 'lg' | 'full'",
        default: '—',
        description: api['radius'],
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: api['orientation'],
      },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: api['fullWidth'] },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['groupAriaLabel'] },
    ];
  });
}
