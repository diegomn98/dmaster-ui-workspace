import {
  ApplicationConfig,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { DM_DATE_LOCALE, provideDmasterIcons, provideDmasterUI } from '@dmaster/ui';
import { DM_ICONS } from '@dmaster/ui/icons';

import { routes } from './app.routes';
import { LocaleService } from './core/i18n/locale.service';
import { provideFaviconTheme } from './core/theme/favicon-theme';
import { provideThemePersistence } from './core/theme/theme-persistence';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding(),
    ),
    provideDmasterUI({
      theme: 'auto',
      density: 'comfortable',
    }),
    provideDmasterIcons(DM_ICONS),
    // Reactive app-wide date locale: every dm-date-picker follows the live
    // language selector without per-instance [locale] plumbing.
    { provide: DM_DATE_LOCALE, useFactory: () => inject(LocaleService).locale },
    provideThemePersistence(),
    provideFaviconTheme(),
  ],
};
