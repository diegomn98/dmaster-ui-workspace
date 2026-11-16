import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmAlertComponent } from '@dmaster/ui/alert';
import { DmAutocompleteComponent, DmAutocompleteOption } from '@dmaster/ui/autocomplete';
import { DmAvatarComponent } from '@dmaster/ui/avatar';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmChipComponent } from '@dmaster/ui/chip';
import { DmBreadcrumbItemComponent, DmBreadcrumbsComponent } from '@dmaster/ui/breadcrumbs';
import { DmButtonComponent } from '@dmaster/ui/button';
import { DmButtonGroupComponent } from '@dmaster/ui/button-group';
import { DmCardComponent } from '@dmaster/ui/card';
import { DmCheckboxComponent } from '@dmaster/ui/checkbox';
import { DmColorPickerComponent } from '@dmaster/ui/color-picker';
import { DmCopyButtonComponent } from '@dmaster/ui/copy-button';
import { DmDatePickerComponent } from '@dmaster/ui/date-picker';
import { DmDividerComponent } from '@dmaster/ui/divider';
import { DmErrorComponent } from '@dmaster/ui/error';
import { DmFormFieldComponent, DmInputDirective } from '@dmaster/ui/form-field';
import { DmIconComponent } from '@dmaster/ui/icon';
import { DmKbdComponent } from '@dmaster/ui/kbd';
import { DmPaginationComponent } from '@dmaster/ui/pagination';
import { DmProgressComponent } from '@dmaster/ui/progress';
import { DmRadioComponent, DmRadioGroupComponent } from '@dmaster/ui/radio-group';
import { DmSearchFieldComponent } from '@dmaster/ui/search-field';
import { DmSelectComponent, DmSelectItem } from '@dmaster/ui/select';
import { DmTreeNode, DmTreeComponent } from '@dmaster/ui/tree';
import { DmSkeletonComponent } from '@dmaster/ui/skeleton';
import { DmSliderComponent } from '@dmaster/ui/slider';
import { DmRatingComponent } from '@dmaster/ui/rating';
import { DmStepperComponent, DmStepComponent } from '@dmaster/ui/stepper';
import { DmEmptyStateComponent } from '@dmaster/ui/empty-state';
import { DmToggleGroupComponent, DmToggleComponent } from '@dmaster/ui/toggle-group';
import { DmOtpComponent } from '@dmaster/ui/otp';
import { DmFileUploadComponent } from '@dmaster/ui/file-upload';
import { DmNumberInputComponent } from '@dmaster/ui/number-input';
import { DmTimelineComponent, DmTimelineItemComponent } from '@dmaster/ui/timeline';
import { DmSpinnerComponent } from '@dmaster/ui/spinner';
import { DmSwitchComponent } from '@dmaster/ui/switch';
import { DmTabComponent, DmTabPanelComponent, DmTabsComponent } from '@dmaster/ui/tabs';
import { DmTableColumn, DmTableComponent } from '@dmaster/ui/table';

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
 * (los overlays usan mocks estáticos), agrupado en secciones por categoría.
 * REGLA: todo componente nuevo de la librería añade aquí
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
    DmChipComponent,
    DmAvatarComponent,
    DmCardComponent,
    DmButtonComponent,
    DmCopyButtonComponent,
    DmButtonGroupComponent,
    DmSwitchComponent,
    DmCheckboxComponent,
    DmFormFieldComponent,
    DmIconComponent,
    DmInputDirective,
    DmKbdComponent,
    DmRadioGroupComponent,
    DmRadioComponent,
    DmSearchFieldComponent,
    DmAutocompleteComponent,
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
    DmRatingComponent,
    DmStepperComponent,
    DmStepComponent,
    DmTreeComponent,
    DmEmptyStateComponent,
    DmToggleGroupComponent,
    DmToggleComponent,
    DmOtpComponent,
    DmFileUploadComponent,
    DmNumberInputComponent,
    DmTimelineComponent,
    DmTimelineItemComponent,
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

  // The recommended install — same command shown on the home and getting-started
  // pages. Copied via the library's own dm-copy-button (dogfooding).
  protected readonly installCmd = 'ng add @dmaster/ui';

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

  // Real dm-autocomplete preview data
  protected readonly ovAutoOptions: DmAutocompleteOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'grape', label: 'Grape' },
  ];
  protected readonly ovTreeNodes: DmTreeNode[] = [
    {
      id: 'src',
      label: 'src',
      children: [
        { id: 'app', label: 'app' },
        { id: 'assets', label: 'assets' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ];
  protected readonly ovAuto = signal<string>('');

  // Signals for interactive mini-previews (bounded inside inert containers)
  protected readonly ovRadio = signal<string>('pro');
  protected readonly ovTab = signal<string>('a');
  protected readonly ovPage = signal<number>(2);
  protected readonly ovSlider = signal<number>(60);
  protected readonly ovSelect = signal<string>('angular');
  protected readonly ovSearch = signal<string>('components');
  protected readonly ovDate = signal<Date | null>(new Date());
  protected readonly ovColor = signal<string>('#338ef7');
  protected readonly ovToggleView = signal<string>('grid');
  protected readonly ovOtp = signal<string>('12');
}
