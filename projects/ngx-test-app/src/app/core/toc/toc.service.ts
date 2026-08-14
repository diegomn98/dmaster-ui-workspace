import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

@Injectable({ providedIn: 'root' })
export class TocService {
  private readonly document = inject(DOCUMENT);
  private readonly _entries = signal<TocEntry[]>([]);
  private readonly _activeId = signal<string>('');
  private cleanup: (() => void) | null = null;

  readonly entries = this._entries.asReadonly();
  readonly activeId = this._activeId.asReadonly();

  scan(): void {
    this.clear();

    // Sin window (SSR/prerender) no hay scroll que observar; el TOC se
    // reconstruye en el cliente tras la hidratación de la navegación.
    const win = this.document.defaultView;
    if (!win) {
      return;
    }

    const headings = Array.from(
      this.document.querySelectorAll('main h2[id], main h3[id]'),
    ) as HTMLElement[];

    this._entries.set(
      headings.map((h) => ({
        id: h.id,
        text: h.textContent?.trim() ?? '',
        level: (h.tagName === 'H2' ? 2 : 3) as 2 | 3,
      })),
    );

    if (headings.length === 0) {
      this._activeId.set('');
      return;
    }

    const OFFSET = 120;

    const updateActive = (): void => {
      // When scrolled to the bottom, the last section is active. A short final
      // section can never reach the top offset (the page runs out of scroll),
      // so without this the last TOC entry could never light up.
      const doc = this.document.documentElement;
      const atBottom = win.scrollY > 0 && win.scrollY + win.innerHeight >= doc.scrollHeight - 2;
      if (atBottom) {
        this._activeId.set(headings[headings.length - 1].id);
        return;
      }

      let activeId = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= OFFSET) {
          activeId = h.id;
        }
      }
      this._activeId.set(activeId);
    };

    win.addEventListener('scroll', updateActive, { passive: true });
    this.cleanup = () => win.removeEventListener('scroll', updateActive);

    updateActive();
  }

  clear(): void {
    this.cleanup?.();
    this.cleanup = null;
    this._entries.set([]);
    this._activeId.set('');
  }
}
