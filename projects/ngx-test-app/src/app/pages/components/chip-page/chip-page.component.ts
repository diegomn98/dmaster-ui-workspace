import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmButtonComponent,
  DmCardComponent,
  DmChipColor,
  DmChipComponent,
  DmChipSetComponent,
  DmChipSize,
  DmChipVariant,
  DmIconComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const COLORS: DmChipColor[] = ['default', 'primary', 'secondary', 'success', 'warning', 'danger'];
const VARIANTS: DmChipVariant[] = ['solid', 'flat', 'bordered', 'light', 'shadow'];

@Component({
  selector: 'app-chip-page',
  imports: [
    DmChipComponent,
    DmChipSetComponent,
    DmAvatarComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './chip-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.chip);

  protected readonly colors = COLORS;
  protected readonly variants = VARIANTS;

  // ── Playground ────────────────────────────────────────────────────────────
  protected readonly playground = signal<PropValues>({
    color: 'primary',
    variant: 'flat',
    size: 'md',
    removable: false,
    selectable: false,
    disabled: false,
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
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    { key: 'removable', label: 'removable', type: 'boolean' },
    { key: 'selectable', label: 'selectable', type: 'boolean' },
    { key: 'disabled', label: 'disabled', type: 'boolean' },
  ];

  protected readonly pgColor = computed(() => this.playground()['color'] as DmChipColor);
  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmChipVariant);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmChipSize);
  protected readonly pgRemovable = computed(() => this.playground()['removable'] === true);
  protected readonly pgSelectable = computed(() => this.playground()['selectable'] === true);
  protected readonly pgDisabled = computed(() => this.playground()['disabled'] === true);
  protected readonly pgSelected = signal(false);

  // Removal collapses the chip permanently; keep the playground usable by
  // re-mounting a fresh chip on the next microtask after (removed).
  protected readonly pgAlive = signal(true);
  protected onPlaygroundRemoved(): void {
    this.pgAlive.set(false);
    queueMicrotask(() => this.pgAlive.set(true));
  }

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgColor() !== 'default') attrs.push(`color="${this.pgColor()}"`);
    if (this.pgVariant() !== 'flat') attrs.push(`variant="${this.pgVariant()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgRemovable()) attrs.push('removable');
    if (this.pgSelectable()) attrs.push('selectable [(selected)]="on"');
    if (this.pgDisabled()) attrs.push('disabled');
    const open = attrs.length > 0 ? `<dm-chip ${attrs.join(' ')}>` : '<dm-chip>';
    return `${open}Chip</dm-chip>`;
  });

  // ── Input / tag chips ───────────────────────────────────────────────────────
  protected readonly tags = signal<string[]>(['Angular', 'Signals', 'TypeScript', 'Zoneless']);
  protected removeTag(tag: string): void {
    this.tags.update((list) => list.filter((t) => t !== tag));
  }
  protected resetTags(): void {
    this.tags.set(['Angular', 'Signals', 'TypeScript', 'Zoneless']);
  }

  protected readonly inputCode = [
    '<dm-chip-set ariaLabel="Tags">',
    '  @for (tag of tags(); track tag) {',
    '    <dm-chip removable (removed)="removeTag(tag)">{{ tag }}</dm-chip>',
    '  }',
    '</dm-chip-set>',
  ].join('\n');

  protected readonly inputTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmChipComponent, DmChipSetComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-tag-chips',",
    '  imports: [DmChipComponent, DmChipSetComponent],',
    "  templateUrl: './tag-chips.component.html',",
    '})',
    'export class TagChipsComponent {',
    "  protected readonly tags = signal(['Angular', 'Signals', 'TypeScript', 'Zoneless']);",
    '',
    '  protected removeTag(tag: string): void {',
    '    this.tags.update((list) => list.filter((t) => t !== tag));',
    '  }',
    '}',
  ].join('\n');

  // ── Filter chips ────────────────────────────────────────────────────────────
  protected readonly filterItems: { value: string; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'sale', label: 'On sale' },
    { value: 'stock', label: 'In stock' },
    { value: 'free', label: 'Free shipping' },
  ];
  protected readonly filters = signal<unknown[]>(['new']);
  protected readonly selectedFiltersText = computed(() => {
    const labels = this.page().labels;
    const values = this.filters() as string[];
    return values.length > 0
      ? `${labels['selectedNote']} ${values.join(', ')}`
      : `${labels['selectedNote']} ${labels['none']}`;
  });

  protected readonly filterCode = [
    '<dm-chip-set selection="multiple" [(values)]="filters" ariaLabel="Product filters">',
    '  <dm-chip selectable value="new" color="primary">New</dm-chip>',
    '  <dm-chip selectable value="sale" color="primary">On sale</dm-chip>',
    '  <dm-chip selectable value="stock" color="primary">In stock</dm-chip>',
    '  <dm-chip selectable value="free" color="primary">Free shipping</dm-chip>',
    '</dm-chip-set>',
  ].join('\n');

  protected readonly filterTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmChipComponent, DmChipSetComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-filter-chips',",
    '  imports: [DmChipComponent, DmChipSetComponent],',
    "  templateUrl: './filter-chips.component.html',",
    '})',
    'export class FilterChipsComponent {',
    "  protected readonly filters = signal<string[]>(['new']);",
    '}',
  ].join('\n');

  // ── Action chips ────────────────────────────────────────────────────────────
  // Action chips drive a live tag set: added chips animate in, removed ones
  // collapse — the demo shows the motion contract of dm-chip.
  private readonly tagPool = ['Design', 'Frontend', 'Review', 'Urgent', 'Docs', 'Bug', 'Idea'];
  protected readonly added = signal<string[]>([]);
  protected readonly pool = computed(() => this.tagPool.filter((t) => !this.added().includes(t)));
  protected addTag(): void {
    const next = this.pool()[0];
    if (next) {
      this.added.update((list) => [...list, next]);
    }
  }
  protected dropAdded(tag: string): void {
    this.added.update((list) => list.filter((t) => t !== tag));
  }
  protected clearTags(): void {
    this.added.set([]);
  }

  protected readonly actionCode = [
    '<dm-chip-set ariaLabel="Actions">',
    '  <dm-chip clickable color="primary" [disabled]="pool().length === 0" (chipClick)="addTag()">',
    '    <dm-icon dm-chip-leading name="plus" size="sm" />Add tag',
    '  </dm-chip>',
    '  <dm-chip clickable [disabled]="added().length === 0" (chipClick)="clearTags()">',
    '    <dm-icon dm-chip-leading name="trash" size="sm" />Clear all',
    '  </dm-chip>',
    '</dm-chip-set>',
    '',
    '<dm-chip-set ariaLabel="Tags">',
    '  @for (tag of added(); track tag) {',
    '    <dm-chip removable color="secondary" (removed)="drop(tag)">{{ tag }}</dm-chip>',
    '  }',
    '</dm-chip-set>',
  ].join('\n');

  protected readonly actionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { DmChipComponent, DmChipSetComponent, DmIconComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-action-chips',",
    '  imports: [DmChipComponent, DmChipSetComponent, DmIconComponent],',
    "  templateUrl: './action-chips.component.html',",
    '})',
    'export class ActionChipsComponent {',
    "  private readonly all = ['Design', 'Frontend', 'Review', 'Urgent', 'Docs'];",
    '  protected readonly added = signal<string[]>([]);',
    '  protected readonly pool = computed(() => this.all.filter((t) => !this.added().includes(t)));',
    '',
    '  protected addTag(): void {',
    '    const next = this.pool()[0];',
    '    if (next) this.added.update((list) => [...list, next]);',
    '  }',
    '',
    '  protected drop(tag: string): void {',
    '    this.added.update((list) => list.filter((t) => t !== tag));',
    '  }',
    '',
    '  protected clearTags(): void {',
    '    this.added.set([]);',
    '  }',
    '}',
  ].join('\n');

  // ── Colors & variants ───────────────────────────────────────────────────────
  protected readonly colorsCode = [
    '@for (c of colors; track c) {',
    '  <dm-chip [color]="c">{{ c }}</dm-chip>',
    '}',
  ].join('\n');

  protected readonly colorsTs = [
    "import { Component } from '@angular/core';",
    "import { DmChipColor, DmChipComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-chip-colors',",
    '  imports: [DmChipComponent],',
    "  templateUrl: './chip-colors.component.html',",
    '})',
    'export class ChipColorsComponent {',
    '  protected readonly colors: DmChipColor[] = [',
    "    'default', 'primary', 'secondary', 'success', 'warning', 'danger',",
    '  ];',
    '}',
  ].join('\n');

  protected readonly variantsCode = [
    '@for (v of variants; track v) {',
    '  <dm-chip color="primary" [variant]="v">{{ v }}</dm-chip>',
    '}',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmChipComponent, DmChipVariant } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-chip-variants',",
    '  imports: [DmChipComponent],',
    "  templateUrl: './chip-variants.component.html',",
    '})',
    'export class ChipVariantsComponent {',
    '  protected readonly variants: DmChipVariant[] = [',
    "    'solid', 'flat', 'bordered', 'light', 'shadow',",
    '  ];',
    '}',
  ].join('\n');

  // ── Sizes & radius ──────────────────────────────────────────────────────────
  protected readonly sizesCode = [
    '<!-- Three sizes -->',
    '<dm-chip color="primary" size="sm">sm</dm-chip>',
    '<dm-chip color="primary" size="md">md</dm-chip>',
    '<dm-chip color="primary" size="lg">lg</dm-chip>',
    '',
    '<!-- Radius scale — full (pill) is the default -->',
    '<dm-chip color="primary" radius="sm">sm</dm-chip>',
    '<dm-chip color="primary" radius="md">md</dm-chip>',
    '<dm-chip color="primary" radius="lg">lg</dm-chip>',
    '<dm-chip color="primary" radius="full">full</dm-chip>',
  ].join('\n');

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmChipComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-chip-sizes',",
    '  imports: [DmChipComponent],',
    "  templateUrl: './chip-sizes.component.html',",
    '})',
    'export class ChipSizesComponent {}',
  ].join('\n');

  // ── Composition ─────────────────────────────────────────────────────────────
  protected readonly compositionCode = [
    '<!-- A team-member card: chips carry the person’s skills as real UI. -->',
    '<dm-card style="max-width: 26rem">',
    '  <div style="display: flex; align-items: center; gap: 0.75rem">',
    '    <dm-avatar initials="DM" color="primary" />',
    '    <div style="flex: 1; min-width: 0">',
    '      <strong>Diego Maestro</strong>',
    '      <p class="muted">Design Engineer</p>',
    '    </div>',
    '    <dm-button size="sm" variant="bordered">Follow</dm-button>',
    '  </div>',
    '',
    '  <p class="muted">Skills</p>',
    '  <dm-chip-set ariaLabel="Skills">',
    '    <dm-chip size="sm" color="primary">Angular</dm-chip>',
    '    <dm-chip size="sm">TypeScript</dm-chip>',
    '    <dm-chip size="sm">RxJS</dm-chip>',
    '    <dm-chip size="sm">CSS</dm-chip>',
    '    <dm-chip size="sm">a11y</dm-chip>',
    '  </dm-chip-set>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmChipComponent,',
    '  DmChipSetComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-member-card',",
    '  imports: [',
    '    DmAvatarComponent,',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmChipComponent,',
    '    DmChipSetComponent,',
    '  ],',
    "  templateUrl: './member-card.component.html',",
    '})',
    'export class MemberCardComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideChipDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideChipDefaults({ variant: 'bordered', radius: 'md' })]",
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
        type: "'solid' | 'flat' | 'bordered' | 'light' | 'shadow'",
        default: "'flat'",
        description: api['variant'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'radius',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'full'",
        description: api['radius'],
      },
      { name: 'removable', type: 'boolean', default: 'false', description: api['removable'] },
      { name: 'selectable', type: 'boolean', default: 'false', description: api['selectable'] },
      { name: 'clickable', type: 'boolean', default: 'false', description: api['clickable'] },
      { name: 'selected', type: 'boolean (model)', default: 'false', description: api['selected'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      { name: 'removeLabel', type: 'string', default: "'Remove'", description: api['removeLabel'] },
    ];
  });
}
