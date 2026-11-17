import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmAvatarComponent } from '@dmaster/ui/avatar';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmButtonComponent } from '@dmaster/ui/button';
import { DmCheckboxComponent } from '@dmaster/ui/checkbox';
import { DmKbdComponent } from '@dmaster/ui/kbd';
import { DmProgressComponent } from '@dmaster/ui/progress';
import { DmSliderComponent } from '@dmaster/ui/slider';
import { DmSwitchComponent } from '@dmaster/ui/switch';
import { DmToggleComponent, DmToggleGroupComponent } from '@dmaster/ui/toggle-group';

/** Baldosa fantasma del anillo exterior: un entry point real, sin contenido. */
interface GhostTile {
  readonly row: number;
  readonly col: number;
  readonly name: string;
}

/** Nombres reales de entry points para el anillo (5×5 menos el núcleo 3×3). */
const RING_NAMES = [
  'menu',
  'dialog',
  'table',
  'tabs',
  'select',
  'tree',
  'otp',
  'stepper',
  'popover',
  'rating',
  'command',
  'tooltip',
  'card',
  'chip',
  'drawer',
  'toast',
];

function ringTiles(): GhostTile[] {
  const tiles: GhostTile[] = [];
  let i = 0;
  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
      if (row === 1 || row === 5 || col === 1 || col === 5) {
        tiles.push({ row, col, name: RING_NAMES[i++] });
      }
    }
  }
  return tiles;
}

/**
 * Portada de la v0.12 — «One entry point per component».
 *
 * El paquete despiezado en isométrico: un campo de baldosas, una por entry
 * point (el núcleo con su componente real dentro; el anillo exterior, con
 * nombres reales, se desvanece — son 46). `/toggle-group` sale flotando con el
 * acento y deja su hueco vacío, con líneas de despiece: un componente que solo
 * usa una ruta diferida ya no viaja en el bundle inicial. La release no trae
 * componentes nuevos ⇒ se ilustra el concepto.
 *
 * Composición: el núcleo + la pieza que sale + la anotación viven en la zona
 * segura (560×420); el anillo fantasma la desborda a propósito — se ve en las
 * tarjetas panorámicas y en la og:image, y se recorta en la destacada.
 */
@Component({
  selector: 'app-cover-v012',
  imports: [
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCheckboxComponent,
    DmKbdComponent,
    DmProgressComponent,
    DmSliderComponent,
    DmSwitchComponent,
    DmToggleComponent,
    DmToggleGroupComponent,
  ],
  templateUrl: './cover-v012.component.html',
  styleUrl: './cover-v012.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV012Component {
  protected readonly ring = ringTiles();
}
