import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

/** Meta sociales de una página concreta (un artículo del blog, p. ej.). */
export interface SocialMeta {
  readonly title: string;
  /** Texto plano (sin HTML). */
  readonly description: string;
  /** URL absoluta de la página (og:url + canonical). */
  readonly url: string;
  readonly type?: 'website' | 'article';
  /** Fecha ISO de publicación (article:published_time). */
  readonly publishedTime?: string;
  /** Imagen absoluta (1.91:1); sin ella se queda la del sitio. */
  readonly image?: {
    readonly url: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
}

type MetaKey = readonly ['name' | 'property', string];

/** Meta que gestiona el servicio (las de index.html + las propias de artículo). */
const MANAGED: readonly MetaKey[] = [
  ['name', 'description'],
  ['property', 'og:type'],
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:url'],
  ['property', 'og:image'],
  ['property', 'og:image:width'],
  ['property', 'og:image:height'],
  ['property', 'og:image:alt'],
  ['property', 'article:published_time'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
  ['name', 'robots'],
];

/**
 * Meta tags sociales por página. index.html trae las del sitio (og:*,
 * twitter:*, canonical); una página que necesite las suyas llama a `apply()`
 * — en el prerender quedan horneadas en su HTML, que es lo que leen los
 * crawlers (no ejecutan JS) — y a `reset()` al destruirse, que devuelve las
 * del sitio para la siguiente ruta de la navegación en cliente.
 *
 * canonical y og:url de CADA ruta los pone `provideCanonicalUrl()`
 * (canonical-url.ts) en cada NavigationEnd — después del `reset()` de la ruta
 * saliente — así que aquí solo cuentan para las páginas que llaman a `apply()`,
 * y deben pasar `canonicalUrl(...)` para que coincidan.
 *
 * Toca el DOM vía `inject(DOCUMENT)` (SSR-safe) y NO usa `Meta` de
 * @angular/platform-browser a propósito: ese módulo ya va en el chunk inicial
 * y usar `Meta` desde una ruta diferida metía su código (~1,6 kB) en el
 * arranque (esbuild reparte por módulo, no por clase).
 */
@Injectable({ providedIn: 'root' })
export class SocialMetaService {
  private readonly document = inject(DOCUMENT);

  /** Estado de index.html, capturado en la primera escritura. */
  private defaults: { tags: (string | null)[]; canonical: string | null } | null = null;

  apply(page: SocialMeta): void {
    this.snapshotOnce();
    this.set(['name', 'description'], page.description);
    this.set(['property', 'og:type'], page.type ?? 'website');
    this.set(['property', 'og:title'], page.title);
    this.set(['property', 'og:description'], page.description);
    this.set(['property', 'og:url'], page.url);
    this.set(['name', 'twitter:title'], page.title);
    this.set(['name', 'twitter:description'], page.description);
    if (page.publishedTime) {
      this.set(['property', 'article:published_time'], page.publishedTime);
    }
    if (page.image) {
      this.set(['property', 'og:image'], page.image.url);
      this.set(['property', 'og:image:width'], String(page.image.width));
      this.set(['property', 'og:image:height'], String(page.image.height));
      this.set(['property', 'og:image:alt'], page.image.alt);
      this.set(['name', 'twitter:image'], page.image.url);
    }
    this.canonical()?.setAttribute('href', page.url);
  }

  /** `<meta name="robots" content="noindex">` (p. ej. el lienzo de portada). */
  noIndex(): void {
    this.snapshotOnce();
    this.set(['name', 'robots'], 'noindex');
  }

  /** Vuelve a las meta del sitio (index.html). */
  reset(): void {
    if (!this.defaults) return;
    const { tags, canonical } = this.defaults;
    MANAGED.forEach((key, i) => {
      const content = tags[i];
      if (content === null) this.find(key)?.remove();
      else this.set(key, content);
    });
    if (canonical !== null) this.canonical()?.setAttribute('href', canonical);
    this.defaults = null;
  }

  private snapshotOnce(): void {
    this.defaults ??= {
      tags: MANAGED.map((key) => this.find(key)?.getAttribute('content') ?? null),
      canonical: this.canonical()?.getAttribute('href') ?? null,
    };
  }

  private find([attr, key]: MetaKey): HTMLMetaElement | null {
    return this.document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  }

  private set(meta: MetaKey, content: string): void {
    let el = this.find(meta);
    if (!el) {
      el = this.document.createElement('meta');
      el.setAttribute(meta[0], meta[1]);
      this.document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  private canonical(): HTMLLinkElement | null {
    return this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  }
}

/** HTML inline de una entradilla → texto plano para meta (sin etiquetas). */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Recorta en un límite de palabra (las descripciones sociales se truncan solas). */
export function truncate(text: string, max = 200): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '')}…`;
}
