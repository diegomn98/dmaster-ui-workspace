import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmCheckboxComponent } from '@dmaster/ui/checkbox';

/** Opción del panel abierto (filtradas por «vit»). */
interface Option {
  readonly match: string;
  readonly rest: string;
  readonly checked: boolean;
  readonly active?: boolean;
}

/**
 * Portada de la v0.5 — «autocomplete, multiple select and honest bundle
 * numbers».
 *
 * `dm-select` en modo `multiple filterable`, abierto: el filtro con «vit»
 * escrito, un grupo de opciones con la coincidencia resaltada y casillas
 * (`dm-checkbox` reales), y el cursor marcando «Vitest», que acaba de aparecer
 * como chip en el trigger (el único con acento; los demás chips son
 * `dm-badge` neutros, como los del select real). El panel real es un overlay
 * del CDK: aquí es una réplica fiel, con componentes reales dentro.
 *
 * Composición: trigger + panel desplegado de frente, con el chip nuevo como
 * foco; distinta del resto de la serie.
 */
@Component({
  selector: 'app-cover-v05',
  imports: [DmBadgeComponent, DmCheckboxComponent],
  templateUrl: './cover-v05.component.html',
  styleUrl: './cover-v05.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV05Component {
  protected readonly options: readonly Option[] = [
    { match: 'Vit', rest: 'e', checked: true },
    { match: 'Vit', rest: 'est', checked: true, active: true },
    { match: 'Vit', rest: 'ePress', checked: false },
  ];
}
