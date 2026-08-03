import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { LocaleService } from '../../core/i18n/locale.service';
import { ApiTableRow } from './api-table.types';

/** Tabla de `@Input` / `@Output` con scroll horizontal controlado en móvil. */
@Component({
  selector: 'app-api-table',
  templateUrl: './api-table.component.html',
  styleUrl: './api-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiTableComponent {
  protected readonly i18n = inject(LocaleService);

  /** Filas a mostrar. */
  readonly rows = input.required<ApiTableRow[]>();

  /** Caption accesible de la tabla. */
  readonly caption = input<string>('API');
}
