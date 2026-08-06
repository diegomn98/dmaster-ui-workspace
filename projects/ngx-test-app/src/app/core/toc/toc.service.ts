import { Injectable, signal } from '@angular/core';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

@Injectable({ providedIn: 'root' })
export class TocService {
  private readonly _entries = signal<TocEntry[]>([]);
  private readonly _activeId = signal<string>('');
  private cleanup: (() => void) | null = null;

  readonly entries = this._entries.asReadonly();
  readonly activeId = this._activeId.asReadonly();

  scan(): void {
    this.clear();

    const headings = Array.from(
      document.querySelectorAll('main h2[id], main h3[id]'),
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
      let activeId = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= OFFSET) {
          activeId = h.id;
        }
      }
      this._activeId.set(activeId);
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    this.cleanup = () => window.removeEventListener('scroll', updateActive);

    updateActive();
  }

  clear(): void {
    this.cleanup?.();
    this.cleanup = null;
    this._entries.set([]);
    this._activeId.set('');
  }
}
