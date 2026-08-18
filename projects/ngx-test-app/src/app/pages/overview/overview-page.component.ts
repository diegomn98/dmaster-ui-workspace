import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DmAlertComponent,
  DmAvatarComponent,
  DmBadgeComponent,
  DmBreadcrumbItemComponent,
  DmBreadcrumbsComponent,
  DmButtonComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmColorPickerComponent,
  DmDatePickerComponent,
  DmDividerComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmIconComponent,
  DmInputDirective,
  DmKbdComponent,
  DmPaginationComponent,
  DmProgressComponent,
  DmRadioComponent,
  DmRadioGroupComponent,
  DmSearchFieldComponent,
  DmSelectComponent,
  DmSelectItem,
  DmSkeletonComponent,
  DmSliderComponent,
  DmSpinnerComponent,
  DmSwitchComponent,
  DmTabComponent,
  DmTabPanelComponent,
  DmTableColumn,
  DmTableComponent,
  DmTabsComponent,
} from '@dmaster/ui';

import { CATEGORY_ORDER, CategoryKey, COMPONENT_REGISTRY } from '../../core/component-registry';
import { LocaleService } from '../../core/i18n/locale.service';

interface OverviewTile {
  id: string;
  name: string;
  categoryKey: CategoryKey;
  category: string;
  route: string;
}

interface OverviewSection {
  key: CategoryKey;
  name: string;
  tiles: OverviewTile[];
}

interface OverviewStat {
  value: string;
  label: string;
}

/**
 * Escaparate de la librería: un tile por componente con un preview EN VIVO
 * (los overlays usan mocks estáticos), agrupado en secciones por categoría
 * (patrón HeroUI/MUI). REGLA: todo componente nuevo de la librería añade aquí
 * su entrada en `COMPONENT_REGISTRY` (core/component-registry.ts) — esa lista
 * es también la fuente del stat "N components" de la Home.
 */
@Component({
  selector: 'app-overview-page',
  imports: [
    RouterLink,
    DmSkeletonComponent,
    DmSpinnerComponent,
    DmBadgeComponent,
    DmAvatarComponent,
    DmCardComponent,
    DmButtonComponent,
    DmSwitchComponent,
    DmCheckboxComponent,
    DmFormFieldComponent,
    DmIconComponent,
    DmInputDirective,
    DmKbdComponent,
    DmRadioGroupComponent,
    DmRadioComponent,
    DmSearchFieldComponent,
    DmDatePickerComponent,
    DmColorPickerComponent,
    DmErrorComponent,
    DmSelectComponent,
    DmTabsComponent,
    DmTabComponent,
    DmTabPanelComponent,
    DmTableComponent,
    DmDividerComponent,
    DmProgressComponent,
    DmAlertComponent,
    DmPaginationComponent,
    DmSliderComponent,
    DmBreadcrumbsComponent,
    DmBreadcrumbItemComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.overview);

  private readonly destroyRef = inject(DestroyRef);
  protected readonly installCmd = 'npm i @dmaster/ui';
  protected readonly copied = signal(false);
  private copyTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.copyTimer));
  }

  protected async copyInstall(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.installCmd);
      this.copied.set(true);
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context / permissions): no-op.
    }
  }

  protected readonly tiles = computed<OverviewTile[]>(() => {
    const nav = this.i18n.t().shell.nav;
    return COMPONENT_REGISTRY.map((entry) => ({
      id: entry.id,
      name: nav[entry.navKey],
      categoryKey: entry.categoryKey,
      category: nav[entry.categoryKey],
      route: `/components/${entry.id}`,
    }));
  });

  /** Tiles grouped by category, honoring `CATEGORY_ORDER`; empty groups dropped. */
  protected readonly sections = computed<OverviewSection[]>(() => {
    const nav = this.i18n.t().shell.nav;
    const all = this.tiles();
    return CATEGORY_ORDER.map((key) => ({
      key,
      name: nav[key],
      tiles: all.filter((tile) => tile.categoryKey === key),
    })).filter((section) => section.tiles.length > 0);
  });

  protected readonly stats = computed<OverviewStat[]>(() => {
    const labels = this.page().labels;
    return [
      { value: `${this.tiles().length}`, label: labels['count'] ?? 'components' },
      { value: `${this.sections().length}`, label: labels['categories'] ?? 'categories' },
      { value: '100%', label: labels['tests'] ?? 'tests passing' },
      { value: '0', label: labels['deps'] ?? 'runtime deps' },
    ];
  });

  // Data for the mini table preview
  protected readonly miniTableColumns: DmTableColumn<{ name: string; role: string }>[] = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
  ];
  protected readonly miniTableData = [
    { name: 'Ada', role: 'Owner' },
    { name: 'Alan', role: 'Admin' },
  ];

  // Real dm-select preview data
  protected readonly ovSelectItems: DmSelectItem<string>[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ];

  // Signals for interactive mini-previews (bounded inside inert containers)
  protected readonly ovRadio = signal<string>('pro');
  protected readonly ovTab = signal<string>('a');
  protected readonly ovPage = signal<number>(2);
  protected readonly ovSlider = signal<number>(60);
  protected readonly ovSelect = signal<string>('angular');
  protected readonly ovSearch = signal<string>('components');
  protected readonly ovDate = signal<Date | null>(new Date());
  protected readonly ovColor = signal<string>('#338ef7');
}
