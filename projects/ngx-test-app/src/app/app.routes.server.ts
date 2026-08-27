import { RenderMode, ServerRoute } from '@angular/ssr';

import { RELEASES } from './core/blog/releases';

/**
 * Todas las rutas del dashboard son estáticas: se prerenderizan en build
 * (outputMode "static") para que crawlers y previews sociales reciban HTML
 * completo sin ejecutar JavaScript. La ruta parametrizada del blog enumera
 * sus slugs desde RELEASES (única fuente de verdad).
 */
export const serverRoutes: ServerRoute[] = [
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
