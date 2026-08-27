import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmIconComponent } from '@dmaster/ui';

import {
  BlogCategory,
  CATEGORY_GLYPHS,
  RELEASES,
  RELEASES_REPO_URL,
  ReleaseEntry,
} from '../../core/blog/releases';
import { LocaleService } from '../../core/i18n/locale.service';
import { RevealDirective } from '../../shared/reveal.directive';
import { SiteTopbarComponent } from '../../shared/site-topbar/site-topbar.component';

/** Un tile del índice: metadata de la release + textos del idioma activo. */
interface BlogTile {
  readonly entry: ReleaseEntry;
  readonly glyph: string;
  readonly title: string;
  readonly lead: string;
}

/** Un chip de la barra de filtros. */
interface FilterChip {
  readonly key: BlogCategory | 'all';
  readonly label: string;
  readonly count: number;
}

/** Orden estable de categorías en la barra de filtros. */
const CATEGORY_ORDER: BlogCategory[] = [
  'a11y',
  'performance',
  'testing',
  'architecture',
  'release',
];

/**
 * /blog — índice del build log al estilo de los blogs de producto:
 * barra de filtros por categoría con contadores, un post destacado
 * grande y un grid uniforme de tarjetas, cada una con una PORTADA generada
 * (gradiente del color de la categoría + versión + glifo — sin fotos falsas).
 * Data-driven: un artículo por release (core/blog/releases.ts + i18n).
 */
@Component({
  selector: 'app-blog-page',
  imports: [RouterLink, DmIconComponent, RevealDirective, SiteTopbarComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPageComponent {
  protected readonly i18n = inject(LocaleService);

  /** Página de releases (legible) — CTA principal del footer. */
  protected readonly releasesUrl = `${RELEASES_REPO_URL}/releases`;

  /** Feed Atom real: GitHub publica las releases del repo como Atom. */
  protected readonly rssUrl = `${RELEASES_REPO_URL}/releases.atom`;

  /** Categoría activa del filtro. */
  protected readonly activeCategory = signal<BlogCategory | 'all'>('all');

  /** Todos los tiles (recalcula al cambiar de idioma). */
  private readonly allTiles = computed<BlogTile[]>(() => {
    const articles = this.i18n.t().blog.articles;
    return RELEASES.map((entry) => ({
      entry,
      glyph: CATEGORY_GLYPHS[entry.category],
      title: articles[entry.key].title,
      lead: articles[entry.key].lead,
    }));
  });

  /** Chips de filtro: "Todas" + solo las categorías con posts, con su contador. */
  protected readonly filters = computed<FilterChip[]>(() => {
    const t = this.i18n.t().blog;
    const counts = new Map<BlogCategory, number>();
    for (const { category } of RELEASES) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    const present = CATEGORY_ORDER.filter((c) => counts.has(c)).map<FilterChip>((c) => ({
      key: c,
      label: t.categories[c],
      count: counts.get(c) ?? 0,
    }));
    return [{ key: 'all', label: t.filterAll, count: RELEASES.length }, ...present];
  });

  /** Destacado = release actual; solo cuando el filtro es "Todas". */
  protected readonly featured = computed<BlogTile | null>(() =>
    this.activeCategory() === 'all' ? this.allTiles()[0] : null,
  );

  /** Grid: el resto (filtro "Todas") o todas las que casan con la categoría. */
  protected readonly gridTiles = computed<BlogTile[]>(() => {
    const cat = this.activeCategory();
    if (cat === 'all') {
      return this.allTiles().slice(1);
    }
    return this.allTiles().filter((tile) => tile.entry.category === cat);
  });

  protected setCategory(key: BlogCategory | 'all'): void {
    this.activeCategory.set(key);
  }

  protected categoryLabel(category: BlogCategory): string {
    return this.i18n.t().blog.categories[category];
  }
}
