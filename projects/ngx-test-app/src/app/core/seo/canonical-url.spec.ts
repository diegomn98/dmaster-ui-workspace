import { DOCUMENT } from '@angular/common';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { canonicalUrl, provideCanonicalUrl } from './canonical-url';

@Component({ template: '' })
class BlankComponent {}

describe('canonicalUrl', () => {
  it('keeps the root as a single slash', () => {
    expect(canonicalUrl('/')).toBe('https://dmasterui.com/');
    expect(canonicalUrl('')).toBe('https://dmasterui.com/');
  });

  it('drops the trailing slash of every other route', () => {
    expect(canonicalUrl('/blog')).toBe('https://dmasterui.com/blog');
    expect(canonicalUrl('/blog/v0-3/')).toBe('https://dmasterui.com/blog/v0-3');
    expect(canonicalUrl('/blog/v0-3//')).toBe('https://dmasterui.com/blog/v0-3');
  });

  it('drops the query string and the fragment', () => {
    expect(canonicalUrl('/components/button?tab=ts#api')).toBe(
      'https://dmasterui.com/components/button',
    );
    expect(canonicalUrl('/components/button/#api')).toBe('https://dmasterui.com/components/button');
    expect(canonicalUrl('/?lang=es')).toBe('https://dmasterui.com/');
  });
});

describe('provideCanonicalUrl', () => {
  let doc: Document;
  let router: Router;

  const canonical = () =>
    doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  const ogUrl = () =>
    doc.head.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null;

  const clearHead = () =>
    doc.head
      .querySelectorAll('link[rel="canonical"], meta[property="og:url"]')
      .forEach((el) => el.remove());

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: '', component: BlankComponent },
          { path: 'blog', component: BlankComponent },
          { path: 'blog/:slug', component: BlankComponent },
          { path: '**', redirectTo: '' },
        ]),
        provideCanonicalUrl(),
      ],
    });
    doc = TestBed.inject(DOCUMENT);
    clearHead();
    // What index.html ships: the home page's values.
    const link = doc.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', 'https://dmasterui.com/');
    const meta = doc.createElement('meta');
    meta.setAttribute('property', 'og:url');
    meta.setAttribute('content', 'https://dmasterui.com/');
    doc.head.append(link, meta);
    router = TestBed.inject(Router);
  });

  afterEach(() => clearHead());

  it('points canonical and og:url at the current route, without slash, query or fragment', async () => {
    await router.navigateByUrl('/blog/v0-3?ref=x#top');
    expect(canonical()).toBe('https://dmasterui.com/blog/v0-3');
    expect(ogUrl()).toBe('https://dmasterui.com/blog/v0-3');

    await router.navigateByUrl('/blog');
    expect(canonical()).toBe('https://dmasterui.com/blog');
    expect(ogUrl()).toBe('https://dmasterui.com/blog');
  });

  it('uses the URL after redirects', async () => {
    await router.navigateByUrl('/blog');
    await router.navigateByUrl('/does-not-exist');
    expect(canonical()).toBe('https://dmasterui.com/');
    expect(ogUrl()).toBe('https://dmasterui.com/');
  });

  it('creates the tags when the document has none', async () => {
    clearHead();
    await router.navigateByUrl('/blog');
    expect(canonical()).toBe('https://dmasterui.com/blog');
    expect(ogUrl()).toBe('https://dmasterui.com/blog');
  });
});
