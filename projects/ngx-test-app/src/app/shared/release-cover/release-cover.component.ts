import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  Type,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

/**
 * Portada ilustrada de una release del blog — el marco común de la serie.
 *
 * Pinta un lienzo FIJO de 1200×630 (el mismo que sale como og:image) con el
 * fondo, la atmósfera (glow del acento, retícula de puntos, grano, viñeta) y las
 * dos esquinas (firma + versión/fecha). El motivo de cada release va en el
 * centro, por `motif` (componente) o por proyección.
 *
 * Se escala como `object-fit: cover`: el host toma el tamaño que le dé su
 * contenedor (necesita ancho y alto definidos) y el lienzo se escala hasta
 * cubrirlo, centrado. Así la misma imagen recorta bien en la tarjeta destacada
 * (casi cuadrada) y en las panorámicas, y las esquinas quedan fuera del recorte.
 * Guía completa: docs/release-covers.md.
 *
 * Siempre oscura: el host estampa `data-dm-theme="dark"`, de modo que los
 * componentes reales de la librería que use el motivo se pintan con los tokens
 * oscuros aunque el sitio esté en claro, y su `--dm-primary` es el acento.
 * Estática y accesible: `role="img"` + `aria-label`; el motivo es `inert`.
 */
@Component({
  selector: 'app-release-cover',
  templateUrl: './release-cover.component.html',
  styleUrl: './release-cover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'img',
    'data-dm-theme': 'dark',
    '[attr.aria-label]': 'label()',
    '[style.--dm-cover-hue]': 'hue()',
  },
})
export class ReleaseCoverComponent {
  /** Versión mostrada en la esquina (p. ej. `v0.12`). */
  readonly version = input.required<string>();
  /** Fecha ISO de la release (`2026-11-16`). */
  readonly date = input.required<string>();
  /** Tono OKLCH del acento de la release (ver RELEASE_COVERS). */
  readonly hue = input.required<number>();
  /** Descripción accesible de la ilustración. */
  readonly label = input.required<string>();
  /** Escena central; alternativa a proyectar contenido. */
  readonly motif = input<Type<unknown> | null>(null);

  private readonly motifHost = viewChild('motifHost', { read: ViewContainerRef });

  constructor() {
    // ViewContainerRef de @angular/core y no NgComponentOutlet: el chunk
    // inicial ya lleva el módulo de @angular/common, y usar NgComponentOutlet
    // desde esta ruta diferida metía su código (~2,5 kB) en el arranque.
    effect(() => {
      const host = this.motifHost();
      const motif = this.motif();
      if (!host) return;
      host.clear();
      if (motif) host.createComponent(motif);
    });
  }
}
