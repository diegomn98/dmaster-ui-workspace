/**
 * ÚNICA fuente de verdad de los artículos de release del blog.
 * La consumen: el índice /blog, el detalle /blog/:slug, las rutas de servidor
 * (prerender de cada slug) y el rail del roadmap (enlaces a los detalles).
 *
 * Nueva release ⇒ añadir la entrada AQUÍ (primera posición, kind 'featured';
 * la anterior featured pasa a 'std' o 'wide') + su artículo en `blog.articles`
 * de los 3 diccionarios + la URL en sitemap.xml. Ver la regla de sincronización
 * por release en CLAUDE.md.
 */

export type BlogCategory = 'a11y' | 'performance' | 'testing' | 'architecture' | 'release';

/** Glifo-marca-de-agua por categoría (el lenguaje ✓▲●◆■ de los tiles). */
export const CATEGORY_GLYPHS: Record<BlogCategory, string> = {
  a11y: '✓',
  performance: '▲',
  testing: '●',
  architecture: '◆',
  release: '■',
};

/** Clave del artículo en `DashboardTranslations['blog']['articles']`. */
export type ReleaseArticleKey =
  'v010' | 'v09' | 'v08' | 'v07' | 'v06' | 'v05' | 'v04' | 'v03' | 'v02' | 'v01';

export interface ReleaseEntry {
  /** Segmento de URL: /blog/<slug>. */
  readonly slug: string;
  /** Versión mostrada (rail del roadmap, chips). */
  readonly version: string;
  /** Tag real de GitHub para el enlace a la release. */
  readonly tag: string;
  /** Fecha real de publicación (CHANGELOG). */
  readonly date: string;
  readonly minutes: number;
  readonly category: BlogCategory;
  /** Tamaño del tile en el bento del índice. */
  readonly kind: 'featured' | 'wide' | 'std';
  /** Clave i18n del artículo. */
  readonly key: ReleaseArticleKey;
}

/** Orden: la release actual primero (featured), luego descendente. */
export const RELEASES: ReleaseEntry[] = [
  {
    slug: 'v0-10',
    version: 'v0.10',
    tag: 'v0.10.2',
    date: '2026-08-31',
    minutes: 4,
    category: 'release',
    kind: 'featured',
    key: 'v010',
  },
  {
    slug: 'v0-9',
    version: 'v0.9',
    tag: 'v0.9.0',
    date: '2026-08-27',
    minutes: 3,
    category: 'release',
    kind: 'wide',
    key: 'v09',
  },
  {
    slug: 'v0-8',
    version: 'v0.8',
    tag: 'v0.8.0',
    date: '2026-08-27',
    minutes: 6,
    category: 'architecture',
    kind: 'wide',
    key: 'v08',
  },
  {
    slug: 'v0-7',
    version: 'v0.7',
    tag: 'v0.7.0',
    date: '2026-08-21',
    minutes: 5,
    category: 'a11y',
    kind: 'wide',
    key: 'v07',
  },
  {
    slug: 'v0-6',
    version: 'v0.6',
    tag: 'v0.6.0',
    date: '2026-08-20',
    minutes: 6,
    category: 'a11y',
    kind: 'wide',
    key: 'v06',
  },
  {
    slug: 'v0-5',
    version: 'v0.5',
    tag: 'v0.5.0',
    date: '2026-08-19',
    minutes: 5,
    category: 'performance',
    kind: 'std',
    key: 'v05',
  },
  {
    slug: 'v0-4',
    version: 'v0.4',
    tag: 'v0.4.1',
    date: '2026-08-18',
    minutes: 5,
    category: 'architecture',
    kind: 'std',
    key: 'v04',
  },
  {
    slug: 'v0-3',
    version: 'v0.3',
    tag: 'v0.3.0',
    date: '2026-08-14',
    minutes: 5,
    category: 'architecture',
    kind: 'std',
    key: 'v03',
  },
  {
    slug: 'v0-2',
    version: 'v0.2',
    tag: 'v0.2.0',
    date: '2026-08-13',
    minutes: 4,
    category: 'release',
    kind: 'std',
    key: 'v02',
  },
  {
    slug: 'v0-1',
    version: 'v0.1',
    tag: 'v0.1.2',
    date: '2026-08-13',
    minutes: 5,
    category: 'architecture',
    kind: 'wide',
    key: 'v01',
  },
];

export const RELEASES_REPO_URL = 'https://github.com/diegomn98/dmaster-ui-workspace';

/** Busca una entrada por slug (para el detalle y el roadmap). */
export function findRelease(slug: string): ReleaseEntry | undefined {
  return RELEASES.find((r) => r.slug === slug);
}
