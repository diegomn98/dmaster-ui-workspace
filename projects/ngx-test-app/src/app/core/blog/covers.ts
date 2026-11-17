import { Type } from '@angular/core';

import { CoverV01Component } from '../../shared/release-cover/covers/cover-v01.component';
import { CoverV02Component } from '../../shared/release-cover/covers/cover-v02.component';
import { CoverV03Component } from '../../shared/release-cover/covers/cover-v03.component';
import { CoverV04Component } from '../../shared/release-cover/covers/cover-v04.component';
import { CoverV05Component } from '../../shared/release-cover/covers/cover-v05.component';
import { CoverV06Component } from '../../shared/release-cover/covers/cover-v06.component';
import { CoverV07Component } from '../../shared/release-cover/covers/cover-v07.component';
import { CoverV08Component } from '../../shared/release-cover/covers/cover-v08.component';
import { CoverV09Component } from '../../shared/release-cover/covers/cover-v09.component';
import { CoverV010Component } from '../../shared/release-cover/covers/cover-v010.component';
import { CoverV011Component } from '../../shared/release-cover/covers/cover-v011.component';
import { CoverV012Component } from '../../shared/release-cover/covers/cover-v012.component';
import { SITE_ORIGIN } from '../site';
import { ReleaseArticleKey, ReleaseEntry } from './releases';

/**
 * Registro versión → portada ilustrada del blog. Guía de diseño completa en
 * docs/release-covers.md (lienzo 1200×630, zona segura, paleta, capas).
 *
 * Una release SIN entrada aquí conserva la portada generada de siempre
 * (versión + glifo de categoría). Nueva portada ⇒
 *   1. su motivo en shared/release-cover/covers/cover-vXYZ.component.*;
 *   2. la entrada aquí, con el tono de la serie (`releaseHue`, lo blinda el spec);
 *   3. su texto alternativo en `blog.coverAlts` de los 3 diccionarios (TypeScript
 *      falla si falta: la clave sale de este registro);
 *   4. `npm run covers` tras `npm run build:app` → JPEG en
 *      public/blog/covers/<slug>.jpg (la og:image del artículo; se versiona).
 */
export interface ReleaseCover {
  /** Tono OKLCH del acento. Luminosidad y croma son fijos para toda la serie. */
  readonly hue: number;
  /** Escena central de la portada (vive en la zona segura del lienzo). */
  readonly motif: Type<unknown>;
}

export const RELEASE_COVERS = {
  v012: { hue: 328, motif: CoverV012Component },
  v011: { hue: 190, motif: CoverV011Component },
  v010: { hue: 53, motif: CoverV010Component },
  v09: { hue: 275, motif: CoverV09Component },
  v08: { hue: 138, motif: CoverV08Component },
  v07: { hue: 0, motif: CoverV07Component },
  v06: { hue: 223, motif: CoverV06Component },
  v05: { hue: 85, motif: CoverV05Component },
  v04: { hue: 308, motif: CoverV04Component },
  v03: { hue: 170, motif: CoverV03Component },
  v02: { hue: 33, motif: CoverV02Component },
  v01: { hue: 255, motif: CoverV01Component },
} as const satisfies Partial<Record<ReleaseArticleKey, ReleaseCover>>;

/** Releases con portada ilustrada (claves de `blog.coverAlts`). */
export type CoveredReleaseKey = keyof typeof RELEASE_COVERS;

/** Acento de la serie: OKLCH con L y C fijos; solo cambia el tono. */
export const COVER_ACCENT_LIGHTNESS = '72%';
export const COVER_ACCENT_CHROMA = 0.12;

/**
 * Tono de la serie para una versión `v0.N`: ángulo áureo desde el azul de marca
 * (v0.1 = 255°, cada release +137.5°). Reparte los tonos sin repetirse nunca y
 * deja releases contiguas lejos en el círculo cromático.
 */
export function releaseHue(version: string): number {
  const minor = Number(/^v\d+\.(\d+)/.exec(version)?.[1] ?? 1);
  return Math.round((255 + 137.5 * (minor - 1)) % 360);
}

export function hasCover(key: ReleaseArticleKey): key is CoveredReleaseKey {
  return key in RELEASE_COVERS;
}

/** Portada de una release, o `undefined` si conserva la generada. */
export function findCover(entry: ReleaseEntry): ReleaseCover | undefined {
  return hasCover(entry.key) ? RELEASE_COVERS[entry.key] : undefined;
}

/**
 * og:image de una portada: el lienzo 1200×630 renderizado a 1.5x (nítido en
 * feeds retina) como JPEG q90 (~100 kB; en PNG el grano lo lleva a ~1,3 MB).
 * Lo escribe scripts/render-release-covers.mjs — si cambia, cambiar ambos.
 */
export const COVER_IMAGE = { width: 1800, height: 945, scale: 1.5 } as const;

/** Ruta pública de la og:image de la portada (relativa al origen). */
export function coverImagePath(entry: ReleaseEntry): string {
  return `/blog/covers/${entry.slug}.jpg`;
}

/** URL absoluta de la og:image (og:image / twitter:image). */
export function coverImageUrl(entry: ReleaseEntry): string {
  return `${SITE_ORIGIN}${coverImagePath(entry)}`;
}
