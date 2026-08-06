import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LocaleService } from '../../core/i18n/locale.service';
import { TocService } from '../../core/toc/toc.service';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrl: './toc.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocComponent {
  protected readonly toc = inject(TocService);
  protected readonly i18n = inject(LocaleService);

  protected scrollTo(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    history.pushState(null, '', `#${id}`);
  }
}
