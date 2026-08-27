import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DmBadgeComponent, DmIconComponent } from '@dmaster/ui';

import {
  BlogCategory,
  CATEGORY_GLYPHS,
  findRelease,
  RELEASES,
  RELEASES_REPO_URL,
} from '../../../core/blog/releases';
import { BlogArticleTranslations } from '../../../core/i18n/translations.types';
import { LocaleService } from '../../../core/i18n/locale.service';
import { SiteTopbarComponent } from '../../../shared/site-topbar/site-topbar.component';

/**
 * /blog/:slug — detalle de una release del build log. La metadata sale de
 * core/blog/releases.ts y el contenido (título, entradilla, "qué salió") de
 * `blog.articles` en los diccionarios. Un slug desconocido redirige al índice.
 */
@Component({
  selector: 'app-blog-article-page',
  imports: [RouterLink, DmBadgeComponent, DmIconComponent, SiteTopbarComponent],
  templateUrl: './blog-article-page.component.html',
  styleUrl: './blog-article-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogArticlePageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly router = inject(Router);

  /** Slug de la ruta (withComponentInputBinding del router). */
  readonly slug = input.required<string>();

  /** Entrada de release; slug desconocido → índice. */
  protected readonly entry = computed(() => {
    const found = findRelease(this.slug());
    if (!found) {
      // Navegación fuera del ciclo de render (computed no debe tener efectos
      // visibles, pero un redirect ante URL inválida es el fallback correcto).
      void this.router.navigate(['/blog']);
    }
    return found ?? RELEASES[0];
  });

  /** Contenido del artículo en el idioma activo. */
  protected readonly article = computed<BlogArticleTranslations>(
    () => this.i18n.t().blog.articles[this.entry().key],
  );

  protected readonly glyph = computed(() => CATEGORY_GLYPHS[this.entry().category]);

  /** URLs a GitHub (release tag + changelog). */
  protected readonly releaseUrl = computed(
    () => `${RELEASES_REPO_URL}/releases/tag/${this.entry().tag}`,
  );
  protected readonly changelogUrl = `${RELEASES_REPO_URL}/blob/main/projects/ngx-dmaster-ui/CHANGELOG.md`;

  /** Navegación entre releases (RELEASES está ordenado: más nueva primero). */
  protected readonly newer = computed(() => {
    const i = RELEASES.indexOf(this.entry());
    return i > 0 ? RELEASES[i - 1] : undefined;
  });
  protected readonly older = computed(() => {
    const i = RELEASES.indexOf(this.entry());
    return i >= 0 && i < RELEASES.length - 1 ? RELEASES[i + 1] : undefined;
  });

  protected categoryLabel(category: BlogCategory): string {
    return this.i18n.t().blog.categories[category];
  }

  /** Título del artículo vecino (para los enlaces prev/next). */
  protected articleTitle(key: (typeof RELEASES)[number]['key']): string {
    return this.i18n.t().blog.articles[key].title;
  }
}
