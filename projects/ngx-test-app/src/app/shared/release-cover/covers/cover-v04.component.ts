import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Celda del calendario (agosto de 2026, semana empezando en lunes). */
interface DayCell {
  readonly key: string;
  readonly day: number | null;
}

/** Agosto de 2026 empieza en sábado: 5 huecos con la semana en lunes. */
function augustCells(): DayCell[] {
  const cells: DayCell[] = [];
  for (let i = 0; i < 5; i++) cells.push({ key: `pad-${i}`, day: null });
  for (let d = 1; d <= 31; d++) cells.push({ key: `d-${d}`, day: d });
  return cells;
}

/** Muestras predefinidas del panel (en tinte apagado: no compiten con el foco). */
const SWATCHES = ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#64748b', '#e4e4e7'];

/**
 * Portada de la v0.4 — «the field family grows: date picker, color picker».
 *
 * Los dos campos pesados de la release como dos paneles de pie, en ángulo: al
 * frente, el panel del `dm-color-picker` (área S/V, tono, alfa, hex y
 * muestras) eligiendo justo el acento de esta portada, `#b98fde`; detrás,
 * desenfocado, el calendario del `dm-date-picker` con el día de la release
 * (18 de agosto de 2026) marcado. Réplicas fieles: ambos paneles son overlays
 * del CDK. El tono del área S/V es el HSV del acento (272°) y los tiradores
 * están donde ese color cae.
 *
 * Composición: dos piezas en ángulo con profundidad de campo; distinta del
 * resto de la serie.
 */
@Component({
  selector: 'app-cover-v04',
  templateUrl: './cover-v04.component.html',
  styleUrl: './cover-v04.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV04Component {
  protected readonly weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  protected readonly cells = augustCells();
  protected readonly swatches = SWATCHES;
}
