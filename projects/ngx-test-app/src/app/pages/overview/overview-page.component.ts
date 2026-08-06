import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DmAccordionComponent,
  DmAccordionItemComponent,
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmRadioComponent,
  DmRadioGroupComponent,
  DmSkeletonComponent,
  DmSpinnerComponent,
  DmSwitchComponent,
  DmTabComponent,
  DmTabPanelComponent,
  DmTableColumn,
  DmTableComponent,
  DmTabsComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';

interface OverviewTile {
  id: string;
  name: string;
  category: string;
  route: string;
}

/**
 * Escaparate de la librería: un tile por componente con un preview EN VIVO
 * (los overlays usan mocks estáticos). REGLA: todo componente nuevo de la
 * librería añade aquí su tile.
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
    DmInputDirective,
    DmAccordionComponent,
    DmAccordionItemComponent,
    DmRadioGroupComponent,
    DmRadioComponent,
    DmTabsComponent,
    DmTabComponent,
    DmTabPanelComponent,
    DmTableComponent,
  ],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.overview);

  protected readonly tiles = computed<OverviewTile[]>(() => {
    const nav = this.i18n.t().shell.nav;
    return [
      {
        id: 'skeleton',
        name: nav.skeleton,
        category: nav.primitives,
        route: '/components/skeleton',
      },
      { id: 'spinner', name: nav.spinner, category: nav.primitives, route: '/components/spinner' },
      { id: 'badge', name: nav.badge, category: nav.primitives, route: '/components/badge' },
      { id: 'avatar', name: nav.avatar, category: nav.primitives, route: '/components/avatar' },
      { id: 'card', name: nav.card, category: nav.layout, route: '/components/card' },
      {
        id: 'accordion',
        name: nav.accordion,
        category: nav.layout,
        route: '/components/accordion',
      },
      {
        id: 'button',
        name: nav.button,
        category: nav.buttons,
        route: '/components/button',
      },
      { id: 'switch', name: nav.switch, category: nav.forms, route: '/components/switch' },
      { id: 'checkbox', name: nav.checkbox, category: nav.forms, route: '/components/checkbox' },
      {
        id: 'radio-group',
        name: nav.radioGroup,
        category: nav.forms,
        route: '/components/radio-group',
      },
      { id: 'select', name: nav.select, category: nav.forms, route: '/components/select' },
      {
        id: 'paginated-select',
        name: nav.paginatedSelect,
        category: nav.forms,
        route: '/components/paginated-select',
      },
      {
        id: 'form-field',
        name: nav.formField,
        category: nav.forms,
        route: '/components/form-field',
      },
      { id: 'tabs', name: nav.tabs, category: nav.navigation, route: '/components/tabs' },
      { id: 'table', name: nav.table, category: nav.dataDisplay, route: '/components/table' },
      { id: 'tooltip', name: nav.tooltip, category: nav.overlays, route: '/components/tooltip' },
      { id: 'dialog', name: nav.dialog, category: nav.overlays, route: '/components/dialog' },
      { id: 'toast', name: nav.toast, category: nav.overlays, route: '/components/toast' },
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

  // Signals for interactive mini-previews (bounded inside inert containers)
  protected readonly ovRadio = signal<string>('a');
  protected readonly ovTab = signal<string>('a');
}
