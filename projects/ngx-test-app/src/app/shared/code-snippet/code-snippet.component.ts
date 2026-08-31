import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DmCopyButtonComponent } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { highlight } from './syntax-highlight';

/**
 * Bloque de código copiable. Syntax highlight naive por regex (cero deps):
 * strings, tags/attrs (HTML), keywords (TS/JS), comentarios.
 * El botón de copiar dogfoodea `dm-copy-button` (escritura al portapapeles
 * SSR-safe + feedback de check incluidos), en vez de reimplementarlo a mano.
 */
@Component({
  selector: 'app-code-snippet',
  imports: [DmCopyButtonComponent],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSnippetComponent {
  protected readonly i18n = inject(LocaleService);

  /** Código a mostrar, tal cual (respeta saltos de línea e indentación). */
  readonly code = input.required<string>();

  /** Etiqueta del lenguaje mostrada en la esquina (`html`, `ts`, `bash`…). */
  readonly language = input<string>('');

  /**
   * Modo integrado: sin card propia (borde/sombra/barra). El copiar flota
   * sobre el código. Lo usa `app-demo-block` para que el código respire dentro
   * de su propia superficie en vez de anidar dos tarjetas.
   */
  readonly flat = input(false);

  /** Clave de lenguaje normalizada para el atributo data-lang y el highlight. */
  protected readonly langKey = computed(() => this.language().toLowerCase());

  /** HTML resaltado (memoizado por firma código+lang). */
  protected readonly highlighted = computed(() => highlight(this.code(), this.langKey()));
}
