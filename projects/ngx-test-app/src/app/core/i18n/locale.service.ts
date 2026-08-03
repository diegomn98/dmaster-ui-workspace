import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, computed, effect, inject, signal } from '@angular/core';

import { EN } from './translations.en';
import { ES } from './translations.es';
import { FR } from './translations.fr';
import { DashboardLocale, DashboardTranslations } from './translations.types';

const STORAGE_KEY = 'ngx-dmaster-locale';

export const TRANSLATIONS: Record<DashboardLocale, DashboardTranslations> = {
  en: EN,
  es: ES,
  fr: FR,
};

/**
 * i18n en runtime del dashboard. Inglés por defecto; la preferencia se
 * persiste en localStorage y `lang` de `<html>` se mantiene sincronizado.
 * Las páginas leen `t()` (computed) para obtener el diccionario activo
 * de forma reactiva y tipada.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  private readonly _locale = signal<DashboardLocale>(this.readInitialLocale());

  /** Idioma activo. */
  readonly locale: Signal<DashboardLocale> = this._locale.asReadonly();

  /** Diccionario activo, reactivo al cambio de idioma. */
  readonly t = computed<DashboardTranslations>(() => TRANSLATIONS[this._locale()]);

  constructor() {
    effect(() => {
      const locale = this._locale();
      this.document.documentElement.lang = locale;
      try {
        this.document.defaultView?.localStorage?.setItem(STORAGE_KEY, locale);
      } catch {
        // localStorage no disponible (modo privado, SSR…): la preferencia no persiste.
      }
    });
  }

  setLocale(locale: DashboardLocale): void {
    this._locale.set(locale);
  }

  private readInitialLocale(): DashboardLocale {
    try {
      const stored = this.document.defaultView?.localStorage?.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'es' || stored === 'fr') {
        return stored;
      }
    } catch {
      // Ignorado: caemos al idioma por defecto.
    }
    return 'en';
  }
}
