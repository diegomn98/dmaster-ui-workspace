import { RenderMode, ServerRoute } from '@angular/ssr';

import { hasCover } from './core/blog/covers';
import { RELEASES } from './core/blog/releases';

/**
 * Todas las rutas del dashboard son estáticas: se prerenderizan en build
 * (outputMode "static") para que crawlers y previews sociales reciban HTML
 * completo sin ejecutar JavaScript. Las rutas parametrizadas del blog enumeran
 * sus slugs desde RELEASES (única fuente de verdad); la de portada, solo los
 * que tienen portada ilustrada (RELEASE_COVERS).
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'blog/:slug/cover',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () =>
      Promise.resolve(RELEASES.filter(({ key }) => hasCover(key)).map(({ slug }) => ({ slug }))),
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve(RELEASES.map(({ slug }) => ({ slug }))),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
