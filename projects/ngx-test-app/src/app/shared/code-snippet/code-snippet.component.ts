import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

import { LocaleService } from '../../core/i18n/locale.service';

/**
 * Bloque de código copiable. Sin resaltado de sintaxis (cero dependencias):
 * monospace + scroll horizontal controlado en pantallas estrechas.
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

  protected readonly copied = signal(false);

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
