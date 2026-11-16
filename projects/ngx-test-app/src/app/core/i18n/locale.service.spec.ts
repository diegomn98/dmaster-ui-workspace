import { DOCUMENT } from '@angular/common';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LocaleService } from './locale.service';
import { EN } from './translations.en';
import { ES } from './translations.es';
import { FR } from './translations.fr';

const STORAGE_KEY = 'ngx-dmaster-locale';

describe('LocaleService (lazy dictionaries)', () => {
  const setup = (stored?: string): LocaleService => {
    localStorage.clear();
    if (stored) localStorage.setItem(STORAGE_KEY, stored);
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    return TestBed.inject(LocaleService);
  };

  afterEach(() => localStorage.clear());

  it('starts in English with the eager EN dictionary and stamps <html lang>', () => {
    const service = setup();
    TestBed.tick();
    expect(service.locale()).toBe('en');
    expect(service.t()).toBe(EN);
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('en');
  });

  it('switches locale and dictionary together once the lazy chunk has loaded', async () => {
    const service = setup();
    const switching = service.setLocale('es');
    // Still English while the Spanish chunk downloads — never mixed.
    expect(service.locale()).toBe('en');
    expect(service.t()).toBe(EN);
    await switching;
    expect(service.locale()).toBe('es');
    expect(service.t()).toEqual(ES);
    TestBed.tick();
    expect(TestBed.inject(DOCUMENT).documentElement.lang).toBe('es');
  });

  it('persists the choice immediately, before the dictionary arrives', () => {
    const service = setup();
    void service.setLocale('fr');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
  });

  it('restores a persisted lazy locale on startup', async () => {
    const service = setup('fr');
    expect(service.locale()).toBe('en'); // first render = the prerendered English
    await vi.waitFor(() => expect(service.locale()).toBe('fr'));
    expect(service.t()).toEqual(FR);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('fr');
  });

  it('ignores an unknown persisted value', () => {
    const service = setup('de');
    expect(service.locale()).toBe('en');
    expect(service.t()).toBe(EN);
  });

  it('lets the last request win when switches overlap', async () => {
    const service = setup();
    const toSpanish = service.setLocale('es');
    const toFrench = service.setLocale('fr');
    await Promise.all([toSpanish, toFrench]);
    expect(service.locale()).toBe('fr');
    expect(service.t()).toEqual(FR);
  });

  it('goes back to the eager English even while a lazy locale is still loading', async () => {
    const service = setup();
    const pendingSpanish = service.setLocale('es'); // fresh service: not cached yet
    await service.setLocale('en'); // applies synchronously
    expect(service.locale()).toBe('en');
    await pendingSpanish; // the late Spanish dictionary must not win
    expect(service.locale()).toBe('en');
    expect(service.t()).toBe(EN);
  });

  it('preload() fetches a dictionary without activating it', async () => {
    const service = setup();
    service.preload('es');
    expect(service.locale()).toBe('en');
    // Switching afterwards reuses the same download and applies it.
    await service.setLocale('es');
    expect(service.t()).toEqual(ES);
  });
});
