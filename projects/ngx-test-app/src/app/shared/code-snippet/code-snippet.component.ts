import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import { LocaleService } from '../../core/i18n/locale.service';
import { highlight } from './syntax-highlight';

/**
 * Bloque de código copiable. Syntax highlight naive por regex (cero deps):
 * strings, tags/attrs (HTML), keywords (TS/JS), comentarios.
 * Encaja en la paleta HeroUI del resto de la librería.
 */
@Component({
  selector: 'app-code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSnippetComponent {
  protected readonly i18n = inject(LocaleService);
  private readonly destroyRef = inject(DestroyRef);
  private resetTimer: ReturnType<typeof setTimeout> | undefined;

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

  protected readonly copied = signal(false);

  /** Clave de lenguaje normalizada para el atributo data-lang y el highlight. */
  protected readonly langKey = computed(() => this.language().toLowerCase());

  /** HTML resaltado (memoizado por firma código+lang). */
  protected readonly highlighted = computed(() => highlight(this.code(), this.langKey()));

  constructor() {
    this.destroyRef.onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => this.copied.set(false), 2000);
    } catch {
      // Clipboard no disponible (permisos/contexto inseguro): no-op.
    }
  }
}
