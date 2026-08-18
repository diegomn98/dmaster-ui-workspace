import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  DmIconColor,
  DmIconComponent,
  DmIconFamily,
  DmIconSize,
  DmInputDirective,
} from '@dmaster/ui';
import { DM_ICON_NAMES } from '@dmaster/ui/icons';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** A category of the font-mode sample gallery. */
interface FontIconGroup {
  labelKey: string;
  icons: string[];
}

const FONT_ICON_GROUPS: FontIconGroup[] = [
  {
    labelKey: 'catGeneral',
    icons: ['home', 'search', 'settings', 'favorite', 'star', 'close', 'add', 'delete', 'edit'],
  },
  {
    labelKey: 'catCommunication',
    icons: ['mail', 'chat', 'call', 'send', 'share', 'notifications'],
  },
  { labelKey: 'catPeople', icons: ['account_circle', 'group', 'person', 'login', 'logout'] },
  {
    labelKey: 'catNavigation',
    icons: [
      'menu',
      'arrow_back',
      'arrow_forward',
      'expand_more',
      'dashboard',
      'more_vert',
      'bookmark',
      'visibility',
    ],
  },
  {
    labelKey: 'catFiles',
    icons: ['download', 'upload', 'folder', 'image', 'attach_file', 'cloud_upload'],
  },
  {
    labelKey: 'catStatus',
    icons: ['info', 'warning', 'error', 'help', 'verified', 'check_circle', 'lock', 'bolt'],
  },
  {
    labelKey: 'catPlaces',
    icons: [
      'calendar_month',
      'schedule',
      'location_on',
      'public',
      'language',
      'shopping_cart',
      'payments',
      'receipt_long',
    ],
  },
  {
    labelKey: 'catDev',
    icons: [
      'code',
      'terminal',
      'bug_report',
      'data_object',
      'rocket_launch',
      'palette',
      'lightbulb',
    ],
  },
];

const SIZE_OPTIONS = ['sm', 'md', 'lg'].map((value) => ({ label: value, value }));
const COLORS = ['none', 'default', 'primary', 'secondary', 'success', 'warning', 'danger'];
const COLOR_OPTIONS = COLORS.map((value) => ({ label: value, value }));
const MODE_CONTROL: PropControl = {
  key: 'mode',
  label: 'mode',
  type: 'select',
  options: [
    { label: 'registered svg', value: 'svg' },
    { label: 'font ligature', value: 'font' },
  ],
};

@Component({
  selector: 'app-icon-page',
  imports: [
    DmIconComponent,
    DmInputDirective,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './icon-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.icon);
  private readonly destroyRef = inject(DestroyRef);
  private copyResetTimer: ReturnType<typeof setTimeout> | undefined;

  /** The curated SVG set, for its gallery and the playground picker. */
  protected readonly iconNames = DM_ICON_NAMES;
  /** A sample of font-icon names, grouped, for the font-mode gallery. */
  protected readonly fontIconGroups = FONT_ICON_GROUPS;

  // ---- Playground (mode-aware: registered SVG vs font ligature) -----------
  protected readonly playground = signal<PropValues>({
    mode: 'svg',
    name: 'sparkles',
    content: 'home',
    size: 'md',
    color: 'none',
    fill: false,
    weight: 400,
    family: 'outlined',
    spin: false,
  });

  private readonly svgControls: PropControl[] = [
    MODE_CONTROL,
    {
      key: 'name',
      label: 'name',
      type: 'select',
      options: DM_ICON_NAMES.map((v) => ({ label: v, value: v })),
    },
    { key: 'size', label: 'size', type: 'select', options: SIZE_OPTIONS },
    { key: 'color', label: 'color', type: 'select', options: COLOR_OPTIONS },
    { key: 'spin', label: 'spin', type: 'boolean' },
  ];

  private readonly fontControls: PropControl[] = [
    MODE_CONTROL,
    { key: 'content', label: 'content', type: 'text', placeholder: 'home' },
    { key: 'size', label: 'size', type: 'select', options: SIZE_OPTIONS },
    { key: 'color', label: 'color', type: 'select', options: COLOR_OPTIONS },
    { key: 'fill', label: 'fill', type: 'boolean' },
    { key: 'weight', label: 'weight', type: 'number', min: 100, max: 700, step: 100 },
    {
      key: 'family',
      label: 'family',
      type: 'select',
      options: ['outlined', 'rounded', 'sharp'].map((value) => ({ label: value, value })),
    },
    { key: 'spin', label: 'spin', type: 'boolean' },
  ];

  protected readonly pgMode = computed(() => this.playground()['mode'] as 'svg' | 'font');
  protected readonly controls = computed(() =>
    this.pgMode() === 'font' ? this.fontControls : this.svgControls,
  );

  protected readonly pgName = computed(() => this.playground()['name'] as string);
  protected readonly pgContent = computed(() => (this.playground()['content'] as string) || 'home');
  protected readonly pgSize = computed(() => this.playground()['size'] as DmIconSize);
  protected readonly pgColor = computed(() => {
    const color = this.playground()['color'] as string;
    return color === 'none' ? '' : (color as DmIconColor);
  });
  protected readonly pgFill = computed(() => this.playground()['fill'] as boolean);
  protected readonly pgWeight = computed(() => this.playground()['weight'] as number);
  protected readonly pgFamily = computed(() => this.playground()['family'] as DmIconFamily);
  protected readonly pgSpin = computed(() => this.playground()['spin'] as boolean);

  protected readonly playgroundCode = computed(() => {
    const size = this.pgSize();
    const color = this.pgColor();
    const spin = this.pgSpin();

    if (this.pgMode() === 'font') {
      const attrs: string[] = [];
      if (size !== 'md') attrs.push(`size="${size}"`);
      if (color) attrs.push(`color="${color}"`);
      if (this.pgFill()) attrs.push('[fill]="true"');
      if (this.pgWeight() !== 400) attrs.push(`[weight]="${this.pgWeight()}"`);
      if (this.pgFamily() !== 'outlined') attrs.push(`family="${this.pgFamily()}"`);
      if (spin) attrs.push('[spin]="true"');
      const attrStr = attrs.length ? ` ${attrs.join(' ')}` : '';
      return `<dm-icon${attrStr}>${this.pgContent()}</dm-icon>`;
    }

    const attrs = [`name="${this.pgName()}"`];
    if (size !== 'md') attrs.push(`size="${size}"`);
    if (color) attrs.push(`color="${color}"`);
    if (spin) attrs.push('[spin]="true"');
    return `<dm-icon ${attrs.join(' ')} />`;
  });

  // ---- Searchable galleries -------------------------------------------------
  protected readonly fontQuery = signal('');
  protected readonly iconQuery = signal('');

  // Font gallery view controls (live fill / family toggles)
  protected readonly galleryFill = signal(false);
  protected readonly galleryFamily = signal<DmIconFamily>('outlined');

  protected readonly filteredFontGroups = computed(() => {
    const q = this.fontQuery().trim().toLowerCase();
    if (!q) return FONT_ICON_GROUPS;
    return FONT_ICON_GROUPS.map((group) => ({
      ...group,
      icons: group.icons.filter((name) => name.replace(/_/g, ' ').includes(q)),
    })).filter((group) => group.icons.length > 0);
  });

  protected readonly fontTotalCount = FONT_ICON_GROUPS.reduce(
    (sum, group) => sum + group.icons.length,
    0,
  );

  protected readonly fontResultCount = computed(() =>
    this.filteredFontGroups().reduce((sum, group) => sum + group.icons.length, 0),
  );

  protected readonly filteredIconNames = computed(() => {
    const q = this.iconQuery().trim().toLowerCase();
    if (!q) return DM_ICON_NAMES;
    return DM_ICON_NAMES.filter((name) => name.includes(q));
  });

  protected onFontQuery(event: Event): void {
    this.fontQuery.set((event.target as HTMLInputElement).value);
  }

  protected onIconQuery(event: Event): void {
    this.iconQuery.set((event.target as HTMLInputElement).value);
  }

  protected toggleGalleryFill(): void {
    this.galleryFill.update((v) => !v);
  }

  protected setGalleryFamily(family: DmIconFamily): void {
    this.galleryFamily.set(family);
  }

  // ---- Click-to-copy ---------------------------------------------------------
  protected readonly copiedKey = signal('');

  protected copyFontIcon(name: string): void {
    // Reflects the gallery's current fill/family toggles (when non-default)
    // in the copied snippet, so the user doesn't have to add them by hand.
    const attrs: string[] = [];
    if (this.galleryFill()) attrs.push('[fill]="true"');
    if (this.galleryFamily() !== 'outlined') attrs.push(`family="${this.galleryFamily()}"`);
    const attrStr = attrs.length ? ` ${attrs.join(' ')}` : '';
    void this.copySnippet(`font:${name}`, `<dm-icon${attrStr}>${name}</dm-icon>`);
  }

  protected copySvgIcon(name: string): void {
    void this.copySnippet(`svg:${name}`, `<dm-icon name="${name}" />`);
  }

  private async copySnippet(key: string, snippet: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(snippet);
      this.copiedKey.set(key);
      clearTimeout(this.copyResetTimer);
      this.copyResetTimer = setTimeout(() => this.copiedKey.set(''), 1600);
    } catch {
      // Clipboard unavailable (permissions/insecure context): no-op.
    }
  }

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.copyResetTimer));
  }

  // ---- Demos -----------------------------------------------------------------
  protected readonly fontUsageCode = [
    '<!-- Any icon-font name as the content -->',
    '<dm-icon>home</dm-icon>',
    '<dm-icon>rocket_launch</dm-icon>',
    '<dm-icon>favorite</dm-icon>',
  ].join('\n');

  protected readonly stylesCode = [
    '<dm-icon>favorite</dm-icon>              <!-- outlined (default) -->',
    '<dm-icon [fill]="true">favorite</dm-icon>  <!-- filled -->',
    '<dm-icon family="rounded">favorite</dm-icon>',
    '<dm-icon family="sharp">favorite</dm-icon>',
    '<dm-icon [weight]="700">favorite</dm-icon> <!-- bolder -->',
  ].join('\n');

  protected readonly colorCode = [
    '<!-- A semantic token… -->',
    '<dm-icon name="heart" color="danger" />',
    '<dm-icon name="star" color="warning" />',
    '<!-- …or any CSS color -->',
    '<dm-icon name="bell" color="#8b5cf6" />',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-icon name="sparkles" size="sm" />',
    '<dm-icon name="sparkles" size="md" />',
    '<dm-icon name="sparkles" size="lg" />',
    '<dm-icon name="sparkles" size="2.5rem" />',
  ].join('\n');

  protected readonly spinCode = '<dm-icon name="refresh" [spin]="true" />';

  protected readonly projectedCode = [
    '<dm-icon size="lg" label="Verified">',
    '  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none"',
    '       stroke="currentColor" stroke-width="2">',
    '    <path d="M20 6 9 17l-5-5" />',
    '  </svg>',
    '</dm-icon>',
  ].join('\n');

  protected readonly fontSetupCode = [
    '<!-- index.html — load the icon font once -->',
    '<link rel="stylesheet"',
    '  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />',
  ].join('\n');

  protected readonly registerCode = [
    "import { provideDmasterIcons } from '@dmaster/ui';",
    "import { DM_ICONS } from '@dmaster/ui/icons';",
    '',
    '// app.config.ts',
    'providers: [',
    '  provideDmasterIcons(DM_ICONS),                 // the curated set',
    "  provideDmasterIcons({ brand: '<svg …></svg>' }), // plus your own",
    ']',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideIconDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideIconDefaults({ size: 'sm', weight: 500 })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'name', type: 'string', default: "''", description: api['name'] },
      { name: 'size', type: 'DmIconSize', default: "'md'", description: api['size'] },
      { name: 'color', type: 'DmIconColor', default: "''", description: api['color'] },
      { name: 'fill', type: 'boolean', default: 'false', description: api['fill'] },
      { name: 'weight', type: 'number', default: '400', description: api['weight'] },
      {
        name: 'family',
        type: "'outlined' | 'rounded' | 'sharp'",
        default: "'outlined'",
        description: api['family'],
      },
      { name: 'spin', type: 'boolean', default: 'false', description: api['spin'] },
      { name: 'label', type: 'string', default: "''", description: api['label'] },
    ];
  });
}
