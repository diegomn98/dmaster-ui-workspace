import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DmSelectComponent, DmSelectItem, ThemeService } from '@dmaster/ui';
import { filter } from 'rxjs';

import { LocaleService } from '../../core/i18n/locale.service';
import { TocService } from '../../core/toc/toc.service';
import { DashboardLocale } from '../../core/i18n/translations.types';
import { PalettePickerComponent } from '../palette-picker/palette-picker.component';
import { TocComponent } from '../toc/toc.component';

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    DmSelectComponent,
    PalettePickerComponent,
    TocComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(LocaleService);
  private readonly toc = inject(TocService);
  private readonly router = inject(Router);

  protected readonly sidebarOpen = signal(false);

  ngOnInit(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      setTimeout(() => this.toc.scan(), 80);
    });
  }

  protected readonly locales: DmSelectItem<DashboardLocale>[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
  ];

  protected readonly sections = computed<NavSection[]>(() => {
    const t = this.i18n.t();
    return [
      {
        label: t.shell.nav.intro,
        items: [
          { label: t.shell.nav.home, path: '/' },
          { label: t.shell.nav.gettingStarted, path: '/getting-started' },
          { label: t.shell.nav.overview, path: '/components' },
        ],
      },
      {
        label: t.shell.nav.primitives,
        items: [
          { label: t.shell.nav.skeleton, path: '/components/skeleton' },
          { label: t.shell.nav.spinner, path: '/components/spinner' },
          { label: t.shell.nav.badge, path: '/components/badge' },
          { label: t.shell.nav.avatar, path: '/components/avatar' },
        ],
      },
      {
        label: t.shell.nav.layout,
        items: [
          { label: t.shell.nav.card, path: '/components/card' },
          { label: t.shell.nav.accordion, path: '/components/accordion' },
        ],
      },
      {
        label: t.shell.nav.buttons,
        items: [{ label: t.shell.nav.button, path: '/components/button' }],
      },
      {
        label: t.shell.nav.forms,
        items: [
          { label: t.shell.nav.switch, path: '/components/switch' },
          { label: t.shell.nav.checkbox, path: '/components/checkbox' },
          { label: t.shell.nav.radioGroup, path: '/components/radio-group' },
          { label: t.shell.nav.select, path: '/components/select' },
          { label: t.shell.nav.paginatedSelect, path: '/components/paginated-select' },
          { label: t.shell.nav.formField, path: '/components/form-field' },
        ],
      },
      {
        label: t.shell.nav.navigation,
        items: [{ label: t.shell.nav.tabs, path: '/components/tabs' }],
      },
      {
        label: t.shell.nav.dataDisplay,
        items: [{ label: t.shell.nav.table, path: '/components/table' }],
      },
      {
        label: t.shell.nav.overlays,
        items: [
          { label: t.shell.nav.tooltip, path: '/components/tooltip' },
          { label: t.shell.nav.dialog, path: '/components/dialog' },
          { label: t.shell.nav.toast, path: '/components/toast' },
        ],
      },
    ];
  });

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected onLocaleChange(locale: DashboardLocale | null): void {
    if (locale) {
      this.i18n.setLocale(locale);
    }
  }
}
