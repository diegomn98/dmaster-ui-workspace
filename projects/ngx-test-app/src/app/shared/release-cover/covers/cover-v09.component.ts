import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmCopyButtonComponent, DmCopyIconDirective } from '@dmaster/ui/copy-button';

/**
 * Portada de la v0.9 — «a copy-to-clipboard button and directive».
 *
 * Un macro: el campo de una clave de API tan cerca que el lienzo lo corta y
 * solo cabe el final de la clave, con el `dm-copy-button` real recién pulsado
 * («Copied», el check, en acento) y el cursor todavía encima, en el centro de su
 * onda. Profundidad de campo escalonada: la clave se desenfoca por tramos hacia
 * lo lejano (`filter: blur` en hojas) y una máscara disuelve el extremo del
 * campo — sin `backdrop-filter`, que dentro de una tarjeta escalada muestrea
 * mal el fondo (bloques claros). El estado «copiado» se pinta proyectando el check
 * como `dmCopyIcon` y la etiqueta como `copyLabel` (la portada no hace clic).
 *
 * Composición: primer plano extremo cortado por el encuadre; distinta del resto
 * de la serie.
 */
@Component({
  selector: 'app-cover-v09',
  imports: [DmCopyButtonComponent, DmCopyIconDirective],
  templateUrl: './cover-v09.component.html',
  styleUrl: './cover-v09.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV09Component {
  protected readonly key = 'dm_live_7Hq2c4Xb9KfE';

  /** La clave por tramos, de lejos (más desenfoque) a cerca (nítido). */
  protected readonly keySegments = [
    { text: 'dm_live_', blur: 4 },
    { text: '7Hq2', blur: 2.2 },
    { text: 'c4Xb', blur: 0.8 },
    { text: '9KfE', blur: 0 },
  ];
}
