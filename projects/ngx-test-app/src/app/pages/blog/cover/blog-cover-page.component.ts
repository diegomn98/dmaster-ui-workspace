import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';

import { findCover } from '../../../core/blog/covers';
import { findRelease } from '../../../core/blog/releases';
import { LocaleService } from '../../../core/i18n/locale.service';
import { SocialMetaService } from '../../../core/seo/social-meta.service';
import { ReleaseCoverComponent } from '../../../shared/release-cover/release-cover.component';

/**
 * /blog/:slug/cover — la portada de una release a tamaño completo (1200×630),
 * con sus esquinas: es la fuente de la og:image (`npm run covers` la captura a
 * public/blog/covers/<slug>.jpg) y la vista de referencia para diseñarla.
 * `noindex`: no es una página de contenido. Slug sin portada → su artículo.
 */
@Component({
  selector: 'app-blog-cover-page',
  imports: [ReleaseCoverComponent],
  templateUrl: './blog-cover-page.component.html',
  styleUrl: './blog-cover-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogCoverPageComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly router = inject(Router);

  /** Slug de la ruta (withComponentInputBinding del router). */
  readonly slug = input.required<string>();

  protected readonly entry = computed(() => findRelease(this.slug()));
  protected readonly cover = computed(() => {
    const entry = this.entry();
    const cover = entry && findCover(entry);
    if (!cover) {
      void this.router.navigate(entry ? ['/blog', entry.slug] : ['/blog']);
    }
    return cover;
  });

  protected readonly label = computed(() => {
    const entry = this.entry();
    const alts = this.i18n.t().blog.coverAlts as Partial<Record<string, string>>;
    return (entry && alts[entry.key]) ?? '';
  });

  protected readonly title = computed(() => {
    const entry = this.entry();
    return entry ? this.i18n.t().blog.articles[entry.key].title : '';
  });

  constructor() {
    const social = inject(SocialMetaService);
    social.noIndex();
    inject(DestroyRef).onDestroy(() => social.reset());
  }
}
