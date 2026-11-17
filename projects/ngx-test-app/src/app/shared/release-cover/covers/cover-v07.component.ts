import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmIconComponent } from '@dmaster/ui/icon';
import { DmOtpComponent } from '@dmaster/ui/otp';
import { DmToggleComponent, DmToggleGroupComponent } from '@dmaster/ui/toggle-group';

/**
 * Portada de la v0.7 — «four new components and a surface ramp with real
 * contrast».
 *
 * Tres superficies anidadas, una dentro de otra, pintadas con los tokens reales
 * de la escala re-espaciada (`--dm-bg-subtle` → `--dm-bg-muted` →
 * `--dm-bg-elevated`), cada una rotulada con su nombre: los peldaños, que antes
 * estaban a ~1.02:1, ahora se distinguen. Dentro, dos de los componentes nuevos
 * reales: un `dm-toggle-group` neutro (a dónde enviar el código) y, en la
 * tarjeta, el `dm-otp` con el código recién pegado y repartido en sus seis
 * celdas (marcadas por el acento), con el badge «Pasted».
 *
 * Composición: marcos concéntricos, distinta del resto de la serie.
 */
@Component({
  selector: 'app-cover-v07',
  imports: [
    DmBadgeComponent,
    DmIconComponent,
    DmOtpComponent,
    DmToggleComponent,
    DmToggleGroupComponent,
  ],
  templateUrl: './cover-v07.component.html',
  styleUrl: './cover-v07.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV07Component {}
