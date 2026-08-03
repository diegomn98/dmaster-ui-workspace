import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CodeSnippetComponent } from '../code-snippet/code-snippet.component';

/**
 * Bloque de demo de la documentación viva: render en vivo arriba
 * (contenido proyectado) y snippet copiable debajo.
 */
@Component({
  selector: 'app-demo-block',
  imports: [CodeSnippetComponent],
  templateUrl: './demo-block.component.html',
  styleUrl: './demo-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoBlockComponent {
  /** Título del ejemplo. */
  readonly heading = input<string>('');

  /** Snippet mostrado bajo el render. Si está vacío, solo se muestra el render. */
  readonly code = input<string>('');

  /** Etiqueta de lenguaje del snippet. */
  readonly language = input<string>('html');
}
