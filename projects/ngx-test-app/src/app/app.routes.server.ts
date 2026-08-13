import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Todas las rutas del dashboard son estáticas: se prerenderizan en build
 * (outputMode "static") para que crawlers y previews sociales reciban HTML
 * completo sin ejecutar JavaScript.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
