import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmNumberInputComponent } from '@dmaster/ui/number-input';
import { DmRatingComponent } from '@dmaster/ui/rating';
import { DmStepComponent, DmStepperComponent } from '@dmaster/ui/stepper';

/**
 * Portada de la v0.6 — «six components and a full WCAG AA audit».
 *
 * Una tarjeta de pedido hecha con tres de los componentes nuevos de la release
 * (`dm-stepper`, `dm-rating`, `dm-number-input`, reales y en neutro) y una lupa
 * de inspector encima: amplía el texto más débil de la tarjeta y lee su
 * contraste. La lectura es verdad: la tarjeta es `--dm-bg-elevated` (#2b2b32)
 * y el texto `--dm-fg-subtle` (#92929a), el par que la auditoría recalibró →
 * 4.55:1, AA. La lupa es una segunda copia de la tarjeta escalada ×2 alrededor
 * del centro del cristal y recortada en círculo.
 *
 * Composición: lupa sobre la UI, distinta del resto de la serie.
 */
@Component({
  selector: 'app-cover-v06',
  imports: [
    NgTemplateOutlet,
    DmNumberInputComponent,
    DmRatingComponent,
    DmStepComponent,
    DmStepperComponent,
  ],
  templateUrl: './cover-v06.component.html',
  styleUrl: './cover-v06.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV06Component {}
