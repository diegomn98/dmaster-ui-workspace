import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { DmSwitchComponent } from 'ngx-dmaster-ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { PropControl, PropValues } from './prop-signal.types';

/**
 * Panel de controles interactivos para variar los inputs de un componente
 * en vivo. El estado viaja por el model `values`, pensado para enlazarse
 * con un signal de la página: `[(values)]="playground"`.
 */
@Component({
  selector: 'app-prop-signal',
  imports: [DmSwitchComponent],
  templateUrl: './prop-signal.component.html',
  styleUrl: './prop-signal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropSignalComponent {
  protected readonly i18n = inject(LocaleService);

  /** Controles a renderizar. */
  readonly controls = input.required<PropControl[]>();

  /** Estado clave → valor. Two-way: `[(values)]`. */
  readonly values = model.required<PropValues>();

  protected set(key: string, value: string | number | boolean): void {
    this.values.update((current) => ({ ...current, [key]: value }));
  }

  protected str(key: string): string {
    return String(this.values()[key] ?? '');
  }

  protected num(key: string): number {
    return Number(this.values()[key] ?? 0);
  }

  protected bool(key: string): boolean {
    return this.values()[key] === true;
  }

  protected onSelect(key: string, event: Event): void {
    this.set(key, (event.target as HTMLSelectElement).value);
  }

  protected onNumber(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (!Number.isNaN(value)) {
      this.set(key, value);
    }
  }

  protected onText(key: string, event: Event): void {
    this.set(key, (event.target as HTMLInputElement).value);
  }
}
