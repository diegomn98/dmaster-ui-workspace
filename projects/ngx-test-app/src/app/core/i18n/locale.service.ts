import { DOCUMENT } from '@angular/common';
import { Injectable, Signal, effect, inject, signal } from '@angular/core';

import { EN } from './translations.en';
import { DashboardLocale, DashboardTranslations } from './translations.types';

const STORAGE_KEY = 'ngx-dmaster-locale';

type LazyLocale = Exclude<DashboardLocale, 'en'>;

/**
 * Diccionarios cargados EN DIFERIDO. Solo el inglés (idioma por defecto y el
 * que hornea el prerender estático) va en el bundle inicial; es/fr son chunks
 * propios que se descargan la primera vez que se eligen — o al arrancar, si son
 * el idioma persistido. Motivo: cada diccionario pesa ~190 kB de fuente y los
 * tres juntos llevaron el bundle inicial a 1,09 MB con el presupuesto de error
 * en 1,1 MB (`angular.json` → budgets). Cada idioma sigue tipado contra
 * `DashboardTranslations`: si a uno le falta una clave, no compila.
 */
const LOADERS: Record<LazyLocale, () => Promise<DashboardTranslations>> = {
  es: () => import('./translations.es').then((m) => m.ES),
  fr: () => import('./translations.fr').then((m) => m.FR),
};

/**
 * i18n en runtime del dashboard. Inglés por defecto; la preferencia se
 * persiste en localStorage y `lang` de `<html>` se mantiene sincronizado.
 * Las páginas leen `t()` para obtener el diccionario activo de forma reactiva
 * y tipada.
 *
 * `locale()` y `t()` cambian A LA VEZ, cuando el diccionario pedido ya está
 * disponible: nunca se ve texto de un idioma con fechas/números (`Intl`) de
 * otro. Mientras se descarga un idioma se sigue mostrando el actual; si se
 * piden varios seguidos, gana el último; si la descarga falla (sin red), se
 * queda el actual.
 */
@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly document = inject(DOCUMENT);

  /** Diccionarios ya descargados (el inglés siempre). */
  private readonly dictionaries = new Map<DashboardLocale, DashboardTranslations>([['en', EN]]);
  /** Descargas en curso, para no pedir dos veces el mismo chunk. */
  private readonly inflight = new Map<LazyLocale, Promise<DashboardTranslations>>();
  /** Último idioma pedido: es el que gana si llegan varias peticiones. */
  private requested: DashboardLocale = 'en';

  private readonly _locale = signal<DashboardLocale>('en');
  private readonly _dictionary = signal<DashboardTranslations>(EN);

  /** Idioma activo (siempre el del diccionario que devuelve `t()`). */
  readonly locale: Signal<DashboardLocale> = this._locale.asReadonly();

  /** Diccionario activo, reactivo al cambio de idioma. */
  readonly t: Signal<DashboardTranslations> = this._dictionary.asReadonly();

  constructor() {
    effect(() => {
      this.document.documentElement.lang = this._locale();
    });
    // En el servidor (prerender) no hay localStorage: siempre inglés.
    const stored = this.readStoredLocale();
    if (stored && stored !== 'en') {
      void this.switchTo(stored);
    }
  }

  /**
   * Cambia de idioma. La preferencia se guarda YA (aunque el diccionario aún se
   * esté descargando), así que cerrar la pestaña a mitad no la pierde. La
   * promesa se resuelve cuando el idioma está aplicado (o descartado).
   */
  setLocale(locale: DashboardLocale): Promise<void> {
    try {
      this.document.defaultView?.localStorage?.setItem(STORAGE_KEY, locale);
    } catch {
      // localStorage no disponible (modo privado, SSR…): la preferencia no persiste.
    }
    return this.switchTo(locale);
  }

  /**
   * Descarga un idioma sin activarlo — p. ej. cuando el puntero o el foco llegan
   * al selector —, para que el cambio posterior sea instantáneo.
   */
  preload(locale: DashboardLocale): void {
    if (locale !== 'en' && !this.dictionaries.has(locale)) {
      this.load(locale).catch(() => undefined);
    }
  }

  private async switchTo(locale: DashboardLocale): Promise<void> {
    this.requested = locale;
    let dictionary = this.dictionaries.get(locale);
    if (!dictionary) {
      try {
        dictionary = await this.load(locale as LazyLocale);
      } catch {
        // Chunk no disponible (sin red…): seguimos en el idioma actual.
        if (this.requested === locale) this.requested = this._locale();
        return;
      }
    }
    if (this.requested !== locale) return; // llegó otra petición mientras tanto
    this._dictionary.set(dictionary);
    this._locale.set(locale);
  }

  private load(locale: LazyLocale): Promise<DashboardTranslations> {
    let pending = this.inflight.get(locale);
    if (!pending) {
      pending = LOADERS[locale]()
        .then((dictionary) => {
          this.dictionaries.set(locale, dictionary);
          return dictionary;
        })
        .finally(() => this.inflight.delete(locale));
      this.inflight.set(locale, pending);
    }
    return pending;
  }

  private readStoredLocale(): DashboardLocale | null {
    try {
      const stored = this.document.defaultView?.localStorage?.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'es' || stored === 'fr') {
        return stored;
      }
    } catch {
      // Ignorado: caemos al idioma por defecto.
    }
    return null;
  }
}
