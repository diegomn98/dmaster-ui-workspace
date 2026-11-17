import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';

import { htmlToText, SocialMetaService, truncate } from './social-meta.service';

describe('SocialMetaService', () => {
  let service: SocialMetaService;
  let meta: Meta;
  let canonical: HTMLLinkElement;

  const content = (selector: string): string | null =>
    meta.getTag(selector)?.getAttribute('content') ?? null;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    service = TestBed.inject(SocialMetaService);
    meta = TestBed.inject(Meta);
    const doc = TestBed.inject(DOCUMENT);
    // The site defaults that index.html ships.
    meta.updateTag({ property: 'og:title', content: 'Site title' });
    meta.updateTag({ property: 'og:image', content: 'https://dmasterui.com/social-preview.png' });
    meta.updateTag({ name: 'description', content: 'Site description' });
    canonical = doc.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://dmasterui.com/';
    doc.head.appendChild(canonical);
  });

  afterEach(() => {
    canonical.remove();
    for (const sel of [
      "property='og:title'",
      "property='og:image'",
      "name='description'",
      "property='og:image:alt'",
      "property='article:published_time'",
    ]) {
      meta.removeTag(sel);
    }
  });

  it('applies a page’s title, description, url, image and canonical', () => {
    service.apply({
      title: 'One entry point per component',
      description: 'Plain description',
      url: 'https://dmasterui.com/blog/v0-12',
      type: 'article',
      publishedTime: '2026-11-16',
      image: {
        url: 'https://dmasterui.com/blog/covers/v0-12.jpg',
        alt: 'Alt',
        width: 1800,
        height: 945,
      },
    });
    expect(content("property='og:title'")).toBe('One entry point per component');
    expect(content("name='twitter:title'")).toBe('One entry point per component');
    expect(content("name='description'")).toBe('Plain description');
    expect(content("property='og:type'")).toBe('article');
    expect(content("property='article:published_time'")).toBe('2026-11-16');
    expect(content("property='og:image'")).toBe('https://dmasterui.com/blog/covers/v0-12.jpg');
    expect(content("property='og:image:width'")).toBe('1800');
    expect(content("name='twitter:image'")).toBe('https://dmasterui.com/blog/covers/v0-12.jpg');
    expect(canonical.getAttribute('href')).toBe('https://dmasterui.com/blog/v0-12');
  });

  it('keeps the site image when the page has none', () => {
    service.apply({ title: 'T', description: 'D', url: 'https://dmasterui.com/blog/v0-9' });
    expect(content("property='og:image'")).toBe('https://dmasterui.com/social-preview.png');
  });

  it('restores the site defaults on reset and drops tags the site does not have', () => {
    service.apply({
      title: 'T',
      description: 'D',
      url: 'https://dmasterui.com/blog/v0-12',
      publishedTime: '2026-11-16',
      image: { url: 'https://x/cover.jpg', alt: 'A', width: 1800, height: 945 },
    });
    service.reset();
    expect(content("property='og:title'")).toBe('Site title');
    expect(content("name='description'")).toBe('Site description');
    expect(content("property='og:image'")).toBe('https://dmasterui.com/social-preview.png');
    expect(meta.getTag("property='article:published_time'")).toBeNull();
    expect(meta.getTag("property='og:image:alt'")).toBeNull();
    expect(canonical.getAttribute('href')).toBe('https://dmasterui.com/');
  });
});

describe('SocialMetaService.noIndex', () => {
  it('adds robots noindex and removes it on reset (the site has none)', () => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const service = TestBed.inject(SocialMetaService);
    const meta = TestBed.inject(Meta);
    service.noIndex();
    expect(meta.getTag("name='robots'")?.getAttribute('content')).toBe('noindex');
    service.reset();
    expect(meta.getTag("name='robots'")).toBeNull();
  });
});

describe('htmlToText / truncate', () => {
  it('strips inline markup and decodes entities', () => {
    expect(htmlToText('the <code>dm-copy-button</code> &amp; <code>&lt;svg&gt;</code>')).toBe(
      'the dm-copy-button & <svg>',
    );
  });

  it('truncates on a word boundary with an ellipsis', () => {
    expect(truncate('short', 200)).toBe('short');
    expect(truncate('one two three four', 12)).toBe('one two…');
  });
});
