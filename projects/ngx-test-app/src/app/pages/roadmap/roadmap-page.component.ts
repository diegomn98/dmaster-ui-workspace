import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmIconComponent } from '@dmaster/ui';

import { findRelease } from '../../core/blog/releases';
import { COMPONENT_REGISTRY } from '../../core/component-registry';
import { LocaleService } from '../../core/i18n/locale.service';
import { LIB_VERSION } from '../../core/version';
import { RevealDirective } from '../../shared/reveal.directive';
import { SiteTopbarComponent } from '../../shared/site-topbar/site-topbar.component';

/** A shipped release card in the "Shipped" column. Links to its /blog/:slug. */
interface ShippedCard {
  readonly version: string;
  readonly slug: string;
  readonly caption: string;
  readonly date: string;
  readonly isNow: boolean;
}

/** A goal toward 1.0 in the "In progress" column. */
interface FocusCard {
  readonly title: string;
  readonly desc: string;
  readonly status: 'doing' | 'queued';
}

/** A card in the "Next" column (coming after 1.0). */
interface NextItem {
  readonly title: string;
  readonly desc: string;
  readonly category: string;
  readonly color: 'primary' | 'secondary' | 'default';
}

const RELEASES_URL = 'https://github.com/diegomn98/dmaster-ui-workspace/releases';
const CHANGELOG_URL =
  'https://github.com/diegomn98/dmaster-ui-workspace/blob/main/projects/ngx-dmaster-ui/CHANGELOG.md';

/**
 * /roadmap — página full-bleed FUERA del shell de docs (como la landing y el
 * blog). Tablero de 3 columnas — Shipped / In progress / Next — data-driven:
 * en cada release se toca `shipped` (el hito nuevo, la versión "Now" se deriva
 * de LIB_VERSION), `focusItems` (mover de doing→shipped) y `nextItems` (sacar
 * lo ya publicado). Ver la regla de sincronización del roadmap en CLAUDE.md.
 */
@Component({
  selector: 'app-roadmap-page',
  imports: [RouterLink, DmIconComponent, RevealDirective, SiteTopbarComponent],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapPageComponent {
  protected readonly i18n = inject(LocaleService);

  protected readonly changelogUrl = CHANGELOG_URL;
  protected readonly releasesUrl = RELEASES_URL;

  /** The "Now" milestone always reflects the real published version. */
  private readonly currentVersion = `v${LIB_VERSION.split('.').slice(0, 2).join('.')}`;

  /** Column 1 — shipped milestones, newest first (dates from the release log). */
  protected readonly shipped = computed<ShippedCard[]>(() => {
    const t = this.i18n.t().roadmap;
    const rows: Omit<ShippedCard, 'date'>[] = [
      { version: this.currentVersion, slug: 'v0-10', caption: t.rail.themes, isNow: true },
      { version: 'v0.9', slug: 'v0-9', caption: t.rail.copy, isNow: false },
      { version: 'v0.8', slug: 'v0-8', caption: t.rail.theming, isNow: false },
      { version: 'v0.7', slug: 'v0-7', caption: t.rail.current, isNow: false },
      { version: 'v0.6', slug: 'v0-6', caption: t.rail.catalogue, isNow: false },
      { version: 'v0.4', slug: 'v0-4', caption: t.rail.forms, isNow: false },
      { version: 'v0.1', slug: 'v0-1', caption: t.rail.foundations, isNow: false },
    ];
    return rows.map((r) => ({ ...r, date: findRelease(r.slug)?.date ?? '' }));
  });

  /** Live component total — never hand-maintained (see CLAUDE.md doc-sync rule). */
  private readonly componentCount = COMPONENT_REGISTRY.length;

  /** Column 2 — the three goals between here and a stable 1.0. */
  protected readonly focusItems = computed<FocusCard[]>(() => {
    const f = this.i18n.t().roadmap.focusItems;
    return [
      {
        title: f.freezeTitle,
        desc: f.freezeDesc.replace('{count}', String(this.componentCount)),
        status: 'doing',
      },
      { title: f.deprecationTitle, desc: f.deprecationDesc, status: 'queued' },
      { title: f.docsTitle, desc: f.docsDesc, status: 'queued' },
    ];
  });

  /** Quality gates (shipped & enforced) — the mini-card under the Shipped column. */
  protected readonly gates = computed<string[]>(() => {
    const g = this.i18n.t().roadmap.gates;
    return [g.a11y, g.visual, g.consumer, g.provenance];
  });

  /** Column 3 — coming after 1.0 (recalcula al cambiar de idioma). */
  protected readonly nextItems = computed<NextItem[]>(() => {
    const t = this.i18n.t().roadmap;
    return [
      {
        title: t.next.signalFormsTitle,
        desc: t.next.signalFormsDesc,
        category: t.catForms,
        color: 'primary',
      },
      { title: t.next.tagsTitle, desc: t.next.tagsDesc, category: t.catForms, color: 'primary' },
      {
        title: t.next.textareaTitle,
        desc: t.next.textareaDesc,
        category: t.catForms,
        color: 'primary',
      },
      {
        title: t.next.contextMenuTitle,
        desc: t.next.contextMenuDesc,
        category: t.catOverlay,
        color: 'secondary',
      },
      {
        title: t.next.scrollAreaTitle,
        desc: t.next.scrollAreaDesc,
        category: t.catLayout,
        color: 'default',
      },
      {
        title: t.next.splitterTitle,
        desc: t.next.splitterDesc,
        category: t.catLayout,
        color: 'default',
      },
      {
        title: t.next.themeBuilderTitle,
        desc: t.next.themeBuilderDesc,
        category: t.catDx,
        color: 'secondary',
      },
    ];
  });
}
