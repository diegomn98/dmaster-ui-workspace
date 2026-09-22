import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmBadgeComponent,
  DmButtonColor,
  DmButtonComponent,
  DmButtonGroupComponent,
  DmButtonGroupOrientation,
  DmButtonState,
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

type TextAlign = 'left' | 'center' | 'right' | 'justify';

@Component({
  selector: 'app-button-group-page',
  imports: [
    DmButtonGroupComponent,
    DmButtonComponent,
    DmIconComponent,
    DmCardComponent,
    DmBadgeComponent,
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

  // ---- Live demo state -----------------------------------------------------

  /** Alignment toolbar: each press re-aligns the sample paragraph. */
  protected readonly align = signal<TextAlign>('left');

  /** Pager: bounded, so the edge segments show per-button `disabled` inside the bar. */
  protected readonly pagerTotal = 8;
  protected readonly pagerPage = signal(3);

  /** Vertical zoom bar driving the sample tile. */
  protected readonly zoom = signal(100);

  /** Full-width pager. */
  protected readonly fwTotal = 5;
  protected readonly fwPage = signal(2);

  /** Split button: the main action runs the button's own loading → success machine. */
  protected readonly saveState = signal<DmButtonState>('idle');

  /** Composition — photo editor. */
  protected readonly rotation = signal(0);
  protected readonly photoScale = signal(100);
  protected readonly flipX = signal(false);
  protected readonly flipY = signal(false);

  protected readonly photoTransform = computed(() => {
    const s = this.photoScale() / 100;
    const sx = this.flipX() ? -s : s;
    const sy = this.flipY() ? -s : s;
    return `rotate(${this.rotation()}deg) scale(${sx}, ${sy})`;
  });

  protected readonly rotationLabel = computed(() => ((this.rotation() % 360) + 360) % 360);

  protected pagerGo(delta: number): void {
    this.pagerPage.update((p) => Math.min(this.pagerTotal, Math.max(1, p + delta)));
  }

  protected zoomBy(delta: number): void {
    this.zoom.update((z) => Math.min(200, Math.max(50, z + delta)));
  }

  protected fwGo(delta: number): void {
    this.fwPage.update((p) => Math.min(this.fwTotal, Math.max(1, p + delta)));
  }

  protected save(): void {
    if (this.saveState() !== 'idle') return;
    this.saveState.set('loading');
    setTimeout(() => {
      this.saveState.set('success');
      this.toast.success(this.page().labels['savedToast']);
      setTimeout(() => this.saveState.set('idle'), 1200);
    }, 900);
  }

  protected notify(labelKey: string): void {
    this.toast.show(this.page().labels[labelKey]);
  }

  protected rotate(deg: number): void {
    this.rotation.update((r) => r + deg);
  }

  protected photoZoom(delta: number): void {
    this.photoScale.update((s) => Math.min(200, Math.max(50, s + delta)));
  }

  protected flip(axis: 'x' | 'y'): void {
    (axis === 'x' ? this.flipX : this.flipY).update((v) => !v);
  }

  protected resetPhoto(): void {
    // Unwind to the nearest full turn so the reset animates the short way round.
    this.rotation.update((r) => r - this.rotationLabel());
    this.photoScale.set(100);
    this.flipX.set(false);
    this.flipY.set(false);
  }

  // ---- Demo code -----------------------------------------------------------

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
    '<!-- Glyph-only segments take `iconOnly` (square) and their own ariaLabel -->',
    '<dm-button-group variant="bordered" ariaLabel="Text alignment">',
    '  <dm-button iconOnly ariaLabel="Left" (clicked)="align.set(\'left\')">',
    '    <dm-icon>format_align_left</dm-icon>',
    '  </dm-button>',
    '  <dm-button iconOnly ariaLabel="Center" (clicked)="align.set(\'center\')">',
    '    <dm-icon>format_align_center</dm-icon>',
    '  </dm-button>',
    '  <dm-button iconOnly ariaLabel="Right" (clicked)="align.set(\'right\')">',
    '    <dm-icon>format_align_right</dm-icon>',
    '  </dm-button>',
    '  <dm-button iconOnly ariaLabel="Justify" (clicked)="align.set(\'justify\')">',
    '    <dm-icon>format_align_justify</dm-icon>',
    '  </dm-button>',
    '</dm-button-group>',
    '',
    '<p [style.text-align]="align()">…</p>',
  ].join('\n');

  protected readonly alignmentTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-alignment-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './alignment-demo.component.html',",
    '})',
    'export class AlignmentDemoComponent {',
    "  readonly align = signal<'left' | 'center' | 'right' | 'justify'>('left');",
    '}',
  ].join('\n');

  protected readonly solidCode = [
    '<!-- Solid fills read as one bar; the edge segments disable at the bounds -->',
    '<dm-button-group color="primary" ariaLabel="Pager">',
    '  <dm-button iconOnly ariaLabel="Previous" [disabled]="page() === 1" (clicked)="go(-1)">',
    '    <dm-icon>chevron_left</dm-icon>',
    '  </dm-button>',
    '  <dm-button>Page {{ page() }}</dm-button>',
    '  <dm-button iconOnly ariaLabel="Next" [disabled]="page() === total" (clicked)="go(1)">',
    '    <dm-icon>chevron_right</dm-icon>',
    '  </dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly solidTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-pager-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './pager-demo.component.html',",
    '})',
    'export class PagerDemoComponent {',
    '  readonly total = 8;',
    '  readonly page = signal(3);',
    '',
    '  go(delta: number): void {',
    '    this.page.update((p) => Math.min(this.total, Math.max(1, p + delta)));',
    '  }',
    '}',
  ].join('\n');

  protected readonly overrideCode = [
    '<!-- The cascade is per-button overridable: the last one turns danger -->',
    '<dm-button-group variant="flat" ariaLabel="File actions">',
    '  <dm-button (clicked)="rename()">Rename</dm-button>',
    '  <dm-button (clicked)="duplicate()">Duplicate</dm-button>',
    '  <dm-button color="danger" (clicked)="remove()">Delete</dm-button>',
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
    'export class FileActionsDemoComponent {',
    '  rename(): void {}',
    '  duplicate(): void {}',
    '  remove(): void {}',
    '}',
  ].join('\n');

  protected readonly verticalCode = [
    '<dm-button-group orientation="vertical" variant="bordered" ariaLabel="Zoom">',
    '  <dm-button iconOnly ariaLabel="Zoom in" [disabled]="zoom() >= 200" (clicked)="zoomBy(25)">',
    '    <dm-icon>add</dm-icon>',
    '  </dm-button>',
    '  <dm-button [ariaLabel]="\'Reset (\' + zoom() + \'%)\'" (clicked)="zoom.set(100)">',
    '    {{ zoom() }}%',
    '  </dm-button>',
    '  <dm-button iconOnly ariaLabel="Zoom out" [disabled]="zoom() <= 50" (clicked)="zoomBy(-25)">',
    '    <dm-icon>remove</dm-icon>',
    '  </dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly verticalTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-zoom-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent, DmIconComponent],',
    "  templateUrl: './zoom-demo.component.html',",
    '})',
    'export class ZoomDemoComponent {',
    '  readonly zoom = signal(100);',
    '',
    '  zoomBy(delta: number): void {',
    '    this.zoom.update((z) => Math.min(200, Math.max(50, z + delta)));',
    '  }',
    '}',
  ].join('\n');

  protected readonly fullWidthCode = [
    '<dm-button-group fullWidth variant="flat" ariaLabel="Pagination">',
    '  <dm-button [disabled]="page() === 1" (clicked)="go(-1)">Previous</dm-button>',
    '  <dm-button [disabled]="page() === total" (clicked)="go(1)">Next</dm-button>',
    '</dm-button-group>',
  ].join('\n');

  protected readonly fullWidthTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmButtonGroupComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-full-width-demo',",
    '  imports: [DmButtonGroupComponent, DmButtonComponent],',
    "  templateUrl: './full-width-demo.component.html',",
    '})',
    'export class FullWidthDemoComponent {',
    '  readonly total = 5;',
    '  readonly page = signal(2);',
    '',
    '  go(delta: number): void {',
    '    this.page.update((p) => Math.min(this.total, Math.max(1, p + delta)));',
    '  }',
    '}',
  ].join('\n');

  protected readonly splitCode = [
    '<!-- Split button: the main action runs the button state machine; the caret',
    '     is iconOnly (square) and flips while its menu is open -->',
    '<dm-button-group color="primary" ariaLabel="Save options">',
    '  <dm-button [state]="saveState()" loadingLabel="Saving…" successLabel="Saved" (clicked)="save()">',
    '    Save',
    '  </dm-button>',
    '  <dm-button iconOnly ariaLabel="More save options" [dmMenuTrigger]="saveMenu">',
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
    "import { Component, inject, signal } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmButtonGroupComponent,',
    '  DmButtonState,',
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
    "  readonly saveState = signal<DmButtonState>('idle');",
    '',
    '  save(): void {',
    "    this.saveState.set('loading');",
    '    this.api.save().subscribe(() => {',
    "      this.saveState.set('success');",
    "      this.toast.success('Saved');",
    "      setTimeout(() => this.saveState.set('idle'), 1200);",
    '    });',
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
    '  <header style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem">',
    '    <div>',
    '      <strong>Photo</strong>',
    '      <p style="margin: 0.125rem 0 0; color: var(--dm-fg-muted)">Every segment is an action with a visible result.</p>',
    '    </div>',
    '    <dm-badge variant="flat" size="sm">{{ rotation() }}° · {{ scale() }}%</dm-badge>',
    '  </header>',
    '',
    '  <div class="stage">',
    '    <dm-icon size="5rem" color="primary" [style.transform]="transform()">landscape</dm-icon>',
    '  </div>',
    '',
    '  <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center">',
    '    <dm-button-group variant="flat" size="sm" ariaLabel="Rotate">',
    '      <dm-button iconOnly ariaLabel="Rotate left" (clicked)="rotate(-90)">',
    '        <dm-icon>rotate_left</dm-icon>',
    '      </dm-button>',
    '      <dm-button iconOnly ariaLabel="Rotate right" (clicked)="rotate(90)">',
    '        <dm-icon>rotate_right</dm-icon>',
    '      </dm-button>',
    '    </dm-button-group>',
    '',
    '    <dm-button-group variant="flat" size="sm" ariaLabel="Zoom">',
    '      <dm-button iconOnly ariaLabel="Zoom out" [disabled]="scale() <= 50" (clicked)="zoom(-25)">',
    '        <dm-icon>remove</dm-icon>',
    '      </dm-button>',
    '      <dm-button [ariaLabel]="\'Reset (\' + scale() + \'%)\'" (clicked)="reset()">{{ scale() }}%</dm-button>',
    '      <dm-button iconOnly ariaLabel="Zoom in" [disabled]="scale() >= 200" (clicked)="zoom(25)">',
    '        <dm-icon>add</dm-icon>',
    '      </dm-button>',
    '    </dm-button-group>',
    '',
    '    <dm-button-group variant="flat" size="sm" ariaLabel="Flip">',
    '      <dm-button iconOnly ariaLabel="Flip horizontally" (clicked)="flip(\'x\')">',
    '        <dm-icon>flip</dm-icon>',
    '      </dm-button>',
    '      <dm-button iconOnly ariaLabel="Flip vertically" (clicked)="flip(\'y\')">',
    '        <dm-icon style="transform: rotate(90deg)">flip</dm-icon>',
    '      </dm-button>',
    '    </dm-button-group>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmButtonGroupComponent,',
    '  DmCardComponent,',
    '  DmIconComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-photo-editor',",
    '  imports: [',
    '    DmCardComponent,',
    '    DmBadgeComponent,',
    '    DmButtonGroupComponent,',
    '    DmButtonComponent,',
    '    DmIconComponent,',
    '  ],',
    "  templateUrl: './photo-editor.component.html',",
    '  styles: `',
    '    .stage {',
    '      display: grid;',
    '      place-items: center;',
    '      height: 11rem;',
    '      margin-block: 0.875rem;',
    '      border-radius: var(--dm-radius-lg);',
    '      background: var(--dm-bg-muted);',
    '      overflow: hidden;',
    '    }',
    '    .stage dm-icon {',
    '      transition: transform var(--dm-duration-slow) var(--dm-ease-snappy);',
    '    }',
    '  `,',
    '})',
    'export class PhotoEditorComponent {',
    '  readonly rotation = signal(0);',
    '  readonly scale = signal(100);',
    '  readonly flipX = signal(false);',
    '  readonly flipY = signal(false);',
    '',
    '  readonly transform = computed(() => {',
    '    const s = this.scale() / 100;',
    '    const sx = this.flipX() ? -s : s;',
    '    const sy = this.flipY() ? -s : s;',
    '    return `rotate(${this.rotation()}deg) scale(${sx}, ${sy})`;',
    '  });',
    '',
    '  rotate(deg: number): void {',
    '    this.rotation.update((r) => r + deg);',
    '  }',
    '',
    '  zoom(delta: number): void {',
    '    this.scale.update((s) => Math.min(200, Math.max(50, s + delta)));',
    '  }',
    '',
    "  flip(axis: 'x' | 'y'): void {",
    "    (axis === 'x' ? this.flipX : this.flipY).update((v) => !v);",
    '  }',
    '',
    '  reset(): void {',
    '    this.rotation.set(0);',
    '    this.scale.set(100);',
    '    this.flipX.set(false);',
    '    this.flipY.set(false);',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideButtonGroupDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideButtonGroupDefaults({ orientation: 'vertical' }),",
    ']',
  ].join('\n');

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
