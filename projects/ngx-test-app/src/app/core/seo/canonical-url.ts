import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { SITE_ORIGIN } from '../site';

/**
 * Canonical absolute URL for a router path: no query string, no fragment and
 * NO trailing slash (except the root, which is always `/`). It is the single
 * shape the whole site uses: sitemap.xml, routerLinks, og:url, canonical, and
 * the host (wrangler.toml `html_handling = "drop-trailing-slash"` + the 301 in
 * public/_redirects send /route/ to /route).
 */
export function canonicalUrl(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return `${SITE_ORIGIN}${pathname || '/'}`;
}

/**
 * Keeps `<link rel="canonical">` and `og:url` pointing at the CURRENT route.
 * index.html only carries the home page's values, so without this every
 * prerendered page (components, /blog, /roadmap…) declared the home page as
 * its canonical. It runs on every NavigationEnd, so the prerender bakes the
 * right URL into each page's HTML (crawlers don't run JS) and client-side
 * navigation keeps it in sync.
 *
 * Pages that set richer meta (SocialMetaService.apply() on blog articles) pass
 * the same canonicalUrl(); their reset() runs while the old route is being
 * torn down, BEFORE the next NavigationEnd, so this always writes last.
 *
 * Writes the DOM directly (not through SocialMetaService) so that service stays
 * out of the initial chunk.
 */
export function provideCanonicalUrl(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const document = inject(DOCUMENT);
    const subscription = inject(Router).events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        applyCanonicalUrl(document, canonicalUrl(event.urlAfterRedirects));
      }
    });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
  });
}

function applyCanonicalUrl(document: Document, url: string): void {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);

  let og = document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (!og) {
    og = document.createElement('meta');
    og.setAttribute('property', 'og:url');
    document.head.appendChild(og);
  }
  og.setAttribute('content', url);
}
