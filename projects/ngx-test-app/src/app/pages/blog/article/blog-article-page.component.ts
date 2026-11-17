import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmIconComponent } from '@dmaster/ui/icon';

import { COVER_IMAGE, coverImageUrl, findCover } from '../../../core/blog/covers';
import {
  BlogCategory,
  CATEGORY_GLYPHS,
  findRelease,
  RELEASES,
  RELEASES_REPO_URL,
} from '../../../core/blog/releases';
import { BlogArticleTranslations } from '../../../core/i18n/translations.types';
import { LocaleService } from '../../../core/i18n/locale.service';
import { canonicalUrl } from '../../../core/seo/canonical-url';
import { htmlToText, SocialMetaService, truncate } from '../../../core/seo/social-meta.service';
import { ReleaseCoverComponent } from '../../../shared/release-cover/release-cover.component';
import { SiteTopbarComponent } from '../../../shared/site-topbar/site-topbar.component';

/**
 * /blog/:slug — detalle de una release del build log. La metadata sale de
 * core/blog/releases.ts y el contenido (título, entradilla, "qué salió") de
 * `blog.articles` en los diccionarios. Un slug desconocido redirige al índice.
 *
 * Hero: la portada ilustrada de la release si la tiene (core/blog/covers.ts,
 * recorte 12:5 + badge de versión) o la generada de siempre. Meta sociales por
 * artículo (título, entradilla, URL canónica y, con portada, su PNG 1200×630
 * como og:image): quedan horneadas en el HTML prerenderizado.
 */
@Component({
  selector: 'app-blog-article-page',
  imports: [
    RouterLink,
    DmBadgeComponent,
    DmIconComponent,
    ReleaseCoverComponent,
    SiteTopbarComponent,
  ],
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

  /** Portada ilustrada (o `undefined` → la generada) y su texto alternativo. */
  protected readonly cover = computed(() => findCover(this.entry()));
  protected readonly coverAlt = computed(() => {
    const alts: Partial<Record<string, string>> = this.i18n.t().blog.coverAlts;
    return alts[this.entry().key] ?? '';
  });

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

  constructor() {
    const social = inject(SocialMetaService);
    effect(() => {
      const entry = this.entry();
      const article = this.article();
      social.apply({
        title: article.title,
        description: truncate(htmlToText(article.lead)),
        url: canonicalUrl(`/blog/${entry.slug}`),
        type: 'article',
        publishedTime: entry.date,
        image: this.cover()
          ? {
              url: coverImageUrl(entry),
              alt: this.coverAlt(),
              width: COVER_IMAGE.width,
              height: COVER_IMAGE.height,
            }
          : undefined,
      });
    });
    inject(DestroyRef).onDestroy(() => social.reset());
  }

  protected categoryLabel(category: BlogCategory): string {
    return this.i18n.t().blog.categories[category];
  }

  /** Título del artículo vecino (para los enlaces prev/next). */
  protected articleTitle(key: (typeof RELEASES)[number]['key']): string {
    return this.i18n.t().blog.articles[key].title;
  }
}
