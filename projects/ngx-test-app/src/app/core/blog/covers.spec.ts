import { EN } from '../i18n/translations.en';
import { ES } from '../i18n/translations.es';
import { FR } from '../i18n/translations.fr';
import {
  COVER_IMAGE,
  coverImagePath,
  coverImageUrl,
  CoveredReleaseKey,
  findCover,
  hasCover,
  RELEASE_COVERS,
  releaseHue,
} from './covers';
import { ReleaseArticleKey, RELEASES } from './releases';

const coveredKeys = Object.keys(RELEASE_COVERS) as CoveredReleaseKey[];

describe('release covers registry', () => {
  it('derives the series hue from the minor version (golden angle from brand blue)', () => {
    expect(releaseHue('v0.1')).toBe(255);
    expect(releaseHue('v0.2')).toBe(33);
    expect(releaseHue('v0.12')).toBe(328);
    expect(releaseHue('v0.13')).toBe(105);
  });

  it('only registers real releases, each with its series hue', () => {
    for (const key of coveredKeys) {
      const entry = RELEASES.find((r) => r.key === key);
      expect(entry, `${key} is not in RELEASES`).toBeDefined();
      expect(RELEASE_COVERS[key].hue, `${key} hue`).toBe(releaseHue(entry!.version));
    }
  });

  it('has an alt text for every cover in the three languages', () => {
    for (const dict of [EN, ES, FR]) {
      for (const key of coveredKeys) {
        expect(dict.blog.coverAlts[key].trim().length).toBeGreaterThan(40);
      }
    }
  });

  it('finds the cover of a covered release', () => {
    const v012 = RELEASES.find((r) => r.key === 'v012')!;
    expect(hasCover('v012')).toBe(true);
    expect(findCover(v012)).toBe(RELEASE_COVERS.v012);
  });

  it('falls back (undefined) for a release without an illustrated cover', () => {
    // Hoy todas las releases tienen portada: la siguiente puede salir sin ella
    // (la tarjeta cae a la generada), así que se prueba con una clave nueva.
    const next = { ...RELEASES[0], key: 'v013' as ReleaseArticleKey };
    expect(hasCover(next.key)).toBe(false);
    expect(findCover(next)).toBeUndefined();
  });

  it('gives every release with a cover its own motif component', () => {
    const motifs = coveredKeys.map((key) => RELEASE_COVERS[key].motif);
    expect(new Set(motifs).size).toBe(motifs.length);
  });

  it('points the og:image at the rendered JPEG, at 1.5x of the 1200×630 canvas', () => {
    const v012 = RELEASES.find((r) => r.key === 'v012')!;
    expect(coverImagePath(v012)).toBe('/blog/covers/v0-12.jpg');
    expect(coverImageUrl(v012)).toBe('https://dmasterui.com/blog/covers/v0-12.jpg');
    expect(COVER_IMAGE.width).toBe(1200 * COVER_IMAGE.scale);
    expect(COVER_IMAGE.height).toBe(630 * COVER_IMAGE.scale);
  });
});
