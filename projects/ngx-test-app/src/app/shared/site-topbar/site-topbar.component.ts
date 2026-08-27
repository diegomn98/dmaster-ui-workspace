import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmIconComponent, ThemeService } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { PalettePickerComponent } from '../../layout/palette-picker/palette-picker.component';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';

/**
 * Top bar compartido de las páginas full-bleed que viven FUERA del shell
 * (roadmap, blog, detalle de blog). En escritorio: logo + nav inline +
 * acciones. En móvil (< sm): fila limpia logo + theme + hamburguesa, y el
 * resto (nav + paleta + idioma + GitHub) vive en un panel desplegable.
 * `active` marca el link con aria-current.
 * (La landing conserva su top bar propio: su SCSS está acoplado al hero.)
 */
@Component({
  selector: 'app-site-topbar',
  imports: [RouterLink, DmIconComponent, PalettePickerComponent, LangSwitchComponent],
  templateUrl: './site-topbar.component.html',
  styleUrl: './site-topbar.component.scss',
  host: {
    '(keydown.escape)': 'closeMenu()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteTopbarComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly theme = inject(ThemeService);

  /** Qué link de la nav está activo. */
  readonly active = input<'roadmap' | 'blog' | null>(null);

  /** Menú móvil (disclosure bajo el header). */
  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
