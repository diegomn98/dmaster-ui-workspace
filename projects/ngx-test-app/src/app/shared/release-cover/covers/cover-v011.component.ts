import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Portada de la v0.11 — «toasts that wait for you».
 *
 * La pila de `DmToastService` en perspectiva, como un objeto en el espacio: el
 * toast más reciente («Report exported», el único con acento) tiene el cursor
 * encima y su temporizador se ha quedado congelado a medias; detrás, un
 * `loading()` en curso y uno informativo, y al fondo la cola (`maxVisible`)
 * asomando con su «+2 queued». Esquemático pero fiel al toast real (superficie
 * elevada, icono en círculo, acción en píldora): el contenedor real es un
 * overlay del CDK y no se puede pintar en línea.
 *
 * Composición: cola que retrocede en profundidad (giro en Y), distinta del resto
 * de la serie. Pila, cursor y anotación viven en la zona segura.
 */
@Component({
  selector: 'app-cover-v011',
  templateUrl: './cover-v011.component.html',
  styleUrl: './cover-v011.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV011Component {}
