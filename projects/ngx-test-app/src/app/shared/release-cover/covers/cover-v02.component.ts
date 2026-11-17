import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Portada de la v0.2 — «packaging done right: ng add, exports and SSR safety».
 *
 * La release no trae componentes: es empaquetado. La portada lo cuenta con lo
 * que ve quien instala: un terminal en perspectiva de tres cuartos con
 * `ng add @dmaster/ui` recién ejecutado — instala el CDK, registra los estilos
 * del overlay, conecta la hoja global — y la última línea, «ready», en acento.
 * Delante, flotando a distintas profundidades, lo que el paquete trae ahora:
 * el subpath `./styles/*`, el CSS precompilado y servicios seguros en SSR.
 *
 * Composición: ventana en perspectiva con piezas flotando delante; distinta del
 * resto de la serie.
 */
@Component({
  selector: 'app-cover-v02',
  templateUrl: './cover-v02.component.html',
  styleUrl: './cover-v02.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverV02Component {}
