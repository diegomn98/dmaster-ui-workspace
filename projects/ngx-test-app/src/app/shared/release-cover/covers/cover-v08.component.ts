import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmButtonComponent } from '@dmaster/ui/button';
import { DmCheckboxComponent } from '@dmaster/ui/checkbox';
import { DmSwitchComponent } from '@dmaster/ui/switch';

/** Tokens derivados de `--dm-primary` que pinta el grafo (nombres reales). */
const DERIVED = ['hover', 'text', 'subtle'] as const;

/** Tokens públicos por componente (de las tablas «Design tokens» de los README). */
const TOKENS_START = [
  '--dm-button-radius',
  '--dm-card-bg',
  '--dm-tooltip-radius',
  '--dm-menu-bg',
  '--dm-checkbox-bg',
  '--dm-tabs-list-border',
  '--dm-badge-dot-size',
];
const TOKENS_END = [
  '--dm-switch-track-bg-checked',
  '--dm-table-header-bg',
  '--dm-select-bg-focus',
  '--dm-button-font-weight',
  '--dm-table-row-bg-selected',
  '--dm-toast-radius',
];

/**
 * Portada de la v0.8 — «real theming».
 *
 * Un grafo de derivación de izquierda a derecha: UN override, `--dm-primary`
 * (el acento de la release), alimenta `-hover`, `-text` y `-subtle`, que
 * recolorean componentes reales. Las muestras de los nodos derivados usan los
 * tokens de verdad: la cascada OKLCH de `_themes.scss` los re-deriva dentro de
 * la portada a partir de su `--dm-primary`, así que el dibujo no miente. A los
 * lados, desvaneciéndose, nombres reales de los ~300 tokens por componente.
 *
 * Composición: diagrama de flujo con conectores, distinto del resto de la serie.
 */
@Component({
  selector: 'app-cover-v08',
  imports: [DmBadgeComponent, DmButtonComponent, DmCheckboxComponent, DmSwitchComponent],
  templateUrl: './cover-v08.component.html',
  styleUrl: './cover-v08.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV08Component {
  protected readonly derived = DERIVED;
  protected readonly tokensStart = TOKENS_START;
  protected readonly tokensEnd = TOKENS_END;
}
