import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  effect,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { DmTheme, ThemeService } from '@dmaster/ui';

const STORAGE_KEY = 'ngx-dmaster-theme';
const THEMES: readonly DmTheme[] = ['light', 'dark', 'auto'];

/**
 * Persiste la preferencia de tema del usuario en localStorage y la restaura al
 * arrancar. El script inline de index.html lee la MISMA clave antes del primer
 * paint para evitar el flash de tema equivocado; aquí solo se re-sincroniza el
 * estado de ThemeService y se escriben los cambios posteriores.
 */
@Injectable({ providedIn: 'root' })
export class ThemePersistenceService {
  private readonly document = inject(DOCUMENT);
  private readonly theme = inject(ThemeService);

  constructor() {
    const stored = this.read();
    if (stored) {
      this.theme.setTheme(stored);
    }

    effect(() => {
      const value = this.theme.theme();
      try {
        this.document.defaultView?.localStorage?.setItem(STORAGE_KEY, value);
      } catch {
        /* localStorage no disponible (SSR, modo privado): no se persiste */
      }
    });
  }

  private read(): DmTheme | null {
    try {
      const stored = this.document.defaultView?.localStorage?.getItem(STORAGE_KEY);
      return stored && (THEMES as readonly string[]).includes(stored) ? (stored as DmTheme) : null;
    } catch {
      return null;
    }
  }
}

/** Arranca la persistencia de tema con la app (leer antes del primer render). */
export function provideThemePersistence(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => inject(ThemePersistenceService));
}
