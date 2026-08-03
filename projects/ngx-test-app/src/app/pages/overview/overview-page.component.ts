import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmLoadingButtonComponent,
  DmSkeletonComponent,
  DmSpinnerComponent,
  DmSwitchComponent,
} from 'ngx-dmaster-ui';

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
    DmLoadingButtonComponent,
    DmSwitchComponent,
    DmCheckboxComponent,
    DmFormFieldComponent,
    DmInputDirective,
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
        id: 'loading-button',
        name: nav.loadingButton,
        category: nav.buttons,
        route: '/components/loading-button',
      },
      { id: 'switch', name: nav.switch, category: nav.forms, route: '/components/switch' },
      { id: 'checkbox', name: nav.checkbox, category: nav.forms, route: '/components/checkbox' },
      {
        id: 'form-field',
        name: nav.formField,
        category: nav.forms,
        route: '/components/form-field',
      },
      { id: 'tooltip', name: nav.tooltip, category: nav.overlays, route: '/components/tooltip' },
      { id: 'dialog', name: nav.dialog, category: nav.overlays, route: '/components/dialog' },
      { id: 'toast', name: nav.toast, category: nav.overlays, route: '/components/toast' },
    ];
  });
}
