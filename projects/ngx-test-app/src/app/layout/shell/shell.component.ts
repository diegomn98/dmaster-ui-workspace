import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from 'ngx-dmaster-ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { DashboardLocale } from '../../core/i18n/translations.types';

interface NavItem {
  label: string;
  path: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

interface LocaleOption {
  value: DashboardLocale;
  label: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly i18n = inject(LocaleService);

  protected readonly sidebarOpen = signal(false);

  protected readonly locales: LocaleOption[] = [
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
        items: [{ label: t.shell.nav.card, path: '/components/card' }],
      },
      {
        label: t.shell.nav.buttons,
        items: [{ label: t.shell.nav.loadingButton, path: '/components/loading-button' }],
      },
      {
        label: t.shell.nav.forms,
        items: [
          { label: t.shell.nav.switch, path: '/components/switch' },
          { label: t.shell.nav.checkbox, path: '/components/checkbox' },
          { label: t.shell.nav.formField, path: '/components/form-field' },
        ],
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

  protected onLocaleChange(event: Event): void {
    this.i18n.setLocale((event.target as HTMLSelectElement).value as DashboardLocale);
  }
}
