import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { DmTabComponent, DmTabsComponent } from '@dmaster/ui';
import { LocaleService } from '../../core/i18n/locale.service';
import { CodeSnippetComponent } from '../code-snippet/code-snippet.component';

interface Snippet {
  key: string;
  label: string;
  code: string;
  language: string;
}

@Component({
  selector: 'app-demo-block',
  imports: [CodeSnippetComponent, DmTabsComponent, DmTabComponent],
  templateUrl: './demo-block.component.html',
  styleUrl: './demo-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoBlockComponent {
  protected readonly i18n = inject(LocaleService);

  readonly heading = input<string>('');
  readonly code = input<string>('');
  readonly language = input<string>('html');
  readonly ts = input<string>('');
  readonly scss = input<string>('');
  readonly initialView = input<'preview' | 'code'>('preview');

  /** Snippets disponibles, en orden HTML → TS → SCSS. */
  protected readonly snippets = computed<Snippet[]>(() => {
    const list: Snippet[] = [];
    const multi = !!(this.ts() || this.scss());
    if (this.code()) {
      list.push({
        key: 'code',
        label: multi ? this.language().toUpperCase() : this.i18n.t().shared.codeLabel,
        code: this.code(),
        language: this.language(),
      });
    }
    if (this.ts()) {
      list.push({ key: 'ts', label: 'TS', code: this.ts(), language: 'ts' });
    }
    if (this.scss()) {
      list.push({ key: 'scss', label: 'SCSS', code: this.scss(), language: 'scss' });
    }
    return list;
  });

  protected readonly hasCode = computed(() => this.snippets().length > 0);

  /** Pestaña activa: 'preview' o 'code'. Ligada al dm-tabs segment switch. */
  protected readonly activeTab = signal<string>('preview');

  /** Archivo activo dentro del panel de código. */
  protected readonly activeFile = signal<string>('');

  protected readonly activeSnippet = computed<Snippet | undefined>(() => {
    const key = this.activeFile() || this.snippets()[0]?.key;
    return this.snippets().find((s) => s.key === key);
  });

  constructor() {
    queueMicrotask(() => {
      if (this.initialView() === 'code' && this.snippets().length > 0) {
        this.activeTab.set('code');
        this.activeFile.set(this.snippets()[0].key);
      }
    });
  }

  protected onTabChange(value: string | undefined): void {
    const v = value ?? 'preview';
    if (v === 'code' && !this.activeFile() && this.snippets().length > 0) {
      this.activeFile.set(this.snippets()[0].key);
    }
    this.activeTab.set(v);
  }

  protected setFile(key: string): void {
    this.activeFile.set(key);
  }
}
