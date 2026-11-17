import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmBadgeComponent } from '@dmaster/ui/badge';
import { DmButtonComponent } from '@dmaster/ui/button';

/**
 * Portada de la v0.1 — «the initial public surface: 18 components and a theme
 * system».
 *
 * Una lámina de especificación del lenguaje visual que nació con la primera
 * release y aún define la librería: en el centro, un `dm-button` real en
 * píldora, grande (sus propios tokens públicos, sin escalar), con las líneas de
 * construcción del radio `full` y la cota de su altura (`3rem`); alrededor, tres
 * fichas: el relleno plano (`--dm-primary`), el tema por atributo
 * (`data-dm-theme`: light / dark / auto) y el press elástico (`scale(0.97)` con
 * la curva real de `--dm-ease-snappy`).
 *
 * Composición: lámina técnica con un héroe y anotaciones alrededor; distinta
 * del resto de la serie.
 */
@Component({
  selector: 'app-cover-v01',
  imports: [DmBadgeComponent, DmButtonComponent],
  templateUrl: './cover-v01.component.html',
  styleUrl: './cover-v01.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV01Component {}
