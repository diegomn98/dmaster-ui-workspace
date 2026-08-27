import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DmIconComponent, DmSelectComponent, DmSelectItem } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { DashboardLocale } from '../../core/i18n/translations.types';

/**
 * Selector de idioma responsive, compartido por el top bar (landing/roadmap/
 * blog) y el shell de docs. En escritorio: el `dm-select` completo. En móvil:
 * un icono globo que abre un menú flotante con los idiomas (el select ocupa
 * demasiado). El offset vertical del scrim lo fija el host con la custom
 * property `--lang-scrim-top` (alto de su header; 4rem por defecto).
 */
@Component({
  selector: 'app-lang-switch',
  imports: [DmSelectComponent, DmIconComponent],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
  host: {
    '(keydown.escape)': 'close()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitchComponent {
  protected readonly i18n = inject(LocaleService);

  /** Menú compacto (solo móvil). */
  protected readonly open = signal(false);

  protected readonly locales: DmSelectItem<DashboardLocale>[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
  ];

  protected toggle(): void {
    this.open.update((o) => !o);
  }

  protected close(): void {
    this.open.set(false);
  }

  /** Desde el dm-select de escritorio. */
  protected onChange(locale: DashboardLocale | null): void {
    if (locale) {
      this.i18n.setLocale(locale);
    }
  }

  /** Desde una opción del menú móvil. */
  protected pick(locale: DashboardLocale): void {
    this.i18n.setLocale(locale);
    this.close();
  }
}
