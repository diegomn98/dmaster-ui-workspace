import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { DmSelectComponent, DmSelectItem, DmSwitchComponent } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { PropControl, PropControlOption, PropValues } from './prop-signal.types';

/**
 * Panel de controles interactivos para variar los inputs de un componente
 * en vivo. El estado viaja por el model `values`, pensado para enlazarse
 * con un signal de la página: `[(values)]="playground"`.
 */
@Component({
  selector: 'app-prop-signal',
  imports: [DmSelectComponent, DmSwitchComponent],
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

  /** `PropControlOption` is a subset of `DmSelectItem`, so a straight cast works. */
  protected toSelectItems(options: PropControlOption[] | undefined): DmSelectItem<string>[] {
    return (options ?? []) as DmSelectItem<string>[];
  }

  protected onSelectValue(key: string, value: string | null): void {
    if (value !== null) {
      this.set(key, value);
    }
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
