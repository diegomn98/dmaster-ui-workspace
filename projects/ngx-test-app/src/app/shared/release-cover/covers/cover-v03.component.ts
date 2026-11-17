import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DmIconComponent } from '@dmaster/ui/icon';
import { DmKbdComponent } from '@dmaster/ui/kbd';

/** Fila de la paleta (filtrada por «theme»). */
interface Action {
  readonly icon: string;
  readonly label: string;
  readonly active?: boolean;
  readonly shortcut?: string;
}

/**
 * Portada de la v0.3 — «eleven components in one release: overlays, feedback,
 * ⌘K».
 *
 * Tres planos de profundidad: al fondo, la app desenfocada bajo el velo del
 * overlay; en medio, la paleta de `dm-command` abierta con «theme» escrito, un
 * grupo de acciones y «Dark theme» activa (el foco, con el acento); delante, en
 * primer plano y físicas, las teclas ⌘ y K que la abrieron. La paleta es una
 * réplica fiel (el componente es un overlay del CDK) con `dm-kbd` e iconos
 * reales dentro.
 *
 * Composición: capas en profundidad (fondo / overlay / primer plano); distinta
 * del resto de la serie.
 */
@Component({
  selector: 'app-cover-v03',
  imports: [DmIconComponent, DmKbdComponent],
  templateUrl: './cover-v03.component.html',
  styleUrl: './cover-v03.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV03Component {
  protected readonly appearance: readonly Action[] = [
    { icon: 'moon', label: 'Dark theme', active: true },
    { icon: 'sun', label: 'Light theme' },
    { icon: 'smartphone', label: 'Match system theme' },
  ];
}
