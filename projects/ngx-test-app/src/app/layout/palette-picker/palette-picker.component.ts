import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DmIconComponent } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { PALETTE_PRESETS } from '../../core/palette/palette';
import { PaletteService } from '../../core/palette/palette.service';

@Component({
  selector: 'app-palette-picker',
  imports: [OverlayModule, DmIconComponent],
  templateUrl: './palette-picker.component.html',
  styleUrl: './palette-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PalettePickerComponent {
  protected readonly palette = inject(PaletteService);
  protected readonly i18n = inject(LocaleService);
  protected readonly presets = PALETTE_PRESETS;
  protected readonly open = signal(false);

  protected readonly isCustom = computed(() => this.palette.current() !== 'default');
  protected readonly activePreset = computed(() =>
    this.presets.find((p) => p.key === this.palette.current()),
  );

  protected toggle(): void {
    this.open.update((v) => !v);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected pick(key: string): void {
    this.palette.setPalette(key);
    // Do NOT close — users often want to try several presets in a row.
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) this.close();
  }
}
