import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmButtonComponent } from '@dmaster/ui/button';
import { DmSwitchComponent } from '@dmaster/ui/switch';

/** Una lámina del abanico: un tema precompilado real de @dmaster/ui/themes/*. */
interface Blade {
  readonly name: string;
  /** Primario oscuro del tema (scripts/themes.manifest.mjs). */
  readonly color: string;
  readonly angle: number;
}

/** Los nueve temas, en el orden del manifiesto (rodean el círculo cromático). */
const THEMES: readonly (readonly [string, string])[] = [
  ['ocean', '#22d3ee'],
  ['cobalt', '#3b6fe6'],
  ['iris', '#5b54e8'],
  ['grape', '#9333ea'],
  ['rose', '#e11d48'],
  ['ember', '#dc2626'],
  ['sunset', '#f97316'],
  ['forest', '#22c55e'],
  ['slate', '#556173'],
];

/** Lámina elegida: el tono de la v0.10 (53°) es el de Sunset. */
const PICKED = 'sunset';
const SPREAD = 14;

/**
 * Portada de la v0.10 — «prebuilt themes».
 *
 * Un abanico de muestras de pintura con los nueve temas reales de
 * `@dmaster/ui/themes/*`, girando sobre su remache. Las láminas llevan su color
 * en tinte apagado (son datos, no decoración: la portada sigue teniendo un solo
 * foco) y la elegida, Sunset, sale del abanico con el acento de la release y
 * componentes reales recoloreados encima: «pick one during ng add and your app
 * recolors». La anotación es el comando real.
 *
 * Composición: abanico radial, distinto del resto de la serie.
 */
@Component({
  selector: 'app-cover-v010',
  imports: [DmBadgeComponent, DmButtonComponent, DmSwitchComponent],
  templateUrl: './cover-v010.component.html',
  styleUrl: './cover-v010.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV010Component {
  protected readonly blades: readonly Blade[] = THEMES.map(([name, color], i) => ({
    name,
    color,
    angle: (i - (THEMES.length - 1) / 2) * SPREAD,
  }));

  protected readonly picked = PICKED;
}
