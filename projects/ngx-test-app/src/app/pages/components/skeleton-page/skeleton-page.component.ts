import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmButtonComponent,
  DmCardComponent,
  DmSkeletonAnimation,
  DmSkeletonComponent,
  DmSkeletonRounded,
  DmSkeletonVariant,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-skeleton-page',
  imports: [
    DmSkeletonComponent,
    DmCardComponent,
    DmButtonComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './skeleton-page.component.html',
  styleUrl: './skeleton-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonPageComponent {
  protected readonly i18n = inject(LocaleService);

  // ---- Playground ----------------------------------------------------------
  protected readonly playground = signal<PropValues>({
    variant: 'text',
    animation: 'pulse',
    rounded: 'md',
    width: '',
    height: '',
    count: 1,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'variant',
      label: 'variant',
      type: 'select',
      options: [
        { label: 'text', value: 'text' },
        { label: 'rectangular', value: 'rectangular' },
        { label: 'circular', value: 'circular' },
        { label: 'rounded', value: 'rounded' },
      ],
    },
    {
      key: 'animation',
      label: 'animation',
      type: 'select',
      options: [
        { label: 'pulse', value: 'pulse' },
        { label: 'wave', value: 'wave' },
        { label: 'none', value: 'none' },
      ],
    },
    {
      key: 'rounded',
      label: 'rounded (variant="rounded")',
      type: 'select',
      options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' },
        { label: 'full', value: 'full' },
      ],
    },
    { key: 'width', label: 'width', type: 'text', placeholder: '100%, 12rem, clamp(...)' },
    { key: 'height', label: 'height', type: 'text', placeholder: '1em, 6rem, 48px…' },
    { key: 'count', label: 'count', type: 'number', min: 1, max: 8, step: 1 },
  ];

  protected readonly pgVariant = computed(() => this.playground()['variant'] as DmSkeletonVariant);
  protected readonly pgAnimation = computed(
    () => this.playground()['animation'] as DmSkeletonAnimation,
  );
  protected readonly pgRounded = computed(() => this.playground()['rounded'] as DmSkeletonRounded);
  protected readonly pgWidth = computed(() => (this.playground()['width'] as string) || null);
  protected readonly pgHeight = computed(() => (this.playground()['height'] as string) || null);
  protected readonly pgCount = computed(() => Math.max(1, Number(this.playground()['count']) || 1));

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgVariant() !== 'text') {
      attrs.push(`variant="${this.pgVariant()}"`);
    }
    if (this.pgVariant() === 'rounded' && this.pgRounded() !== 'md') {
      attrs.push(`rounded="${this.pgRounded()}"`);
    }
    if (this.pgWidth()) {
      attrs.push(`width="${this.pgWidth()}"`);
    }
    if (this.pgHeight()) {
      attrs.push(`height="${this.pgHeight()}"`);
    }
    if (this.pgAnimation() !== 'pulse') {
      attrs.push(`animation="${this.pgAnimation()}"`);
    }
    if (this.pgCount() > 1) {
      attrs.push(`[count]="${this.pgCount()}"`);
    }
    return attrs.length > 0 ? `<dm-skeleton ${attrs.join(' ')} />` : '<dm-skeleton />';
  });

  // ---- Snippets de los ejemplos --------------------------------------------
  protected readonly basicCode = [
    '<!-- Profile card loading state -->',
    '<div class="card">',
    '  <div class="card__header">',
    '    <dm-skeleton variant="circular" [width]="44" [height]="44" />',
    '    <div class="card__info">',
    '      <dm-skeleton width="45%" />',
    '      <dm-skeleton width="65%" />',
    '    </div>',
    '  </div>',
    '  <dm-skeleton [count]="3" />',
    '  <dm-skeleton width="30%" />',
    '</div>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-profile-card-skeleton',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './profile-card-skeleton.component.html',",
    '})',
    'export class ProfileCardSkeletonComponent {}',
  ].join('\n');

  protected readonly variantsCode = [
    '<dm-skeleton />',
    '<dm-skeleton variant="rounded" rounded="lg" height="5rem" />',
    '<dm-skeleton variant="rectangular" height="5rem" />',
    '<dm-skeleton variant="circular" [width]="48" [height]="48" />',
  ].join('\n');

  protected readonly variantsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-skeleton-variants',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './skeleton-variants.component.html',",
    '})',
    'export class SkeletonVariantsComponent {}',
  ].join('\n');

  protected readonly animationsCode = [
    '<!-- pulse (default) -->',
    '<dm-skeleton animation="pulse" height="4.5rem" variant="rounded" rounded="lg" />',
    '',
    '<!-- wave shimmer -->',
    '<dm-skeleton animation="wave" height="4.5rem" variant="rounded" rounded="lg" />',
    '',
    '<!-- static, no animation -->',
    '<dm-skeleton animation="none" height="4.5rem" variant="rounded" rounded="lg" />',
  ].join('\n');

  protected readonly animationsTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-skeleton-animations',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './skeleton-animations.component.html',",
    '})',
    'export class SkeletonAnimationsComponent {}',
  ].join('\n');

  protected readonly paragraphCode = [
    '<!-- Article / blog card loading state -->',
    '<div class="article-card">',
    '  <dm-skeleton variant="rounded" rounded="lg" height="9rem" animation="wave" />',
    '  <dm-skeleton width="75%" />',
    '  <dm-skeleton [count]="3" />',
    '</div>',
  ].join('\n');

  protected readonly paragraphTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-article-card-skeleton',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './article-card-skeleton.component.html',",
    '})',
    'export class ArticleCardSkeletonComponent {}',
  ].join('\n');

  protected readonly cardCode = [
    '<!-- Dashboard metric cards grid -->',
    '@for (metric of [1, 2, 3, 4]; track metric) {',
    '  <div class="metric-card">',
    '    <dm-skeleton variant="circular" [width]="32" [height]="32" />',
    '    <dm-skeleton width="60%" />',
    '    <dm-skeleton width="40%" />',
    '  </div>',
    '}',
  ].join('\n');

  protected readonly cardTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-metric-grid-skeleton',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './metric-grid-skeleton.component.html',",
    '})',
    'export class MetricGridSkeletonComponent {}',
  ].join('\n');

  protected readonly fluidCode = [
    '<!-- List / feed loading state -->',
    '@for (item of items; track item) {',
    '  <div class="list-item">',
    '    <dm-skeleton variant="rounded" rounded="md" [width]="44" [height]="44" />',
    '    <div class="list-item__body">',
    '      <dm-skeleton width="48%" />',
    '      <dm-skeleton width="65%" />',
    '    </div>',
    '  </div>',
    '}',
  ].join('\n');

  protected readonly fluidTs = [
    "import { Component } from '@angular/core';",
    "import { DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-list-skeleton',",
    '  imports: [DmSkeletonComponent],',
    "  templateUrl: './list-skeleton.component.html',",
    '})',
    'export class ListSkeletonComponent {',
    '  // one placeholder row per pending item',
    '  protected readonly items = [1, 2, 3, 4];',
    '}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- The canonical "content is loading" state: a skeleton that mirrors',
    "     the real card's shape one-to-one, so nothing shifts when the data",
    '     resolves and the placeholder is swapped for the real content. -->',
    '@if (loading()) {',
    '  <dm-card style="max-width: 20rem">',
    '    <div style="display: grid; gap: 1rem">',
    '      <div style="display: flex; align-items: center; gap: 0.875rem">',
    '        <dm-skeleton variant="circular" [width]="48" [height]="48" />',
    '        <div style="flex: 1; display: grid; gap: 0.5rem">',
    '          <dm-skeleton width="55%" />',
    '          <dm-skeleton width="35%" />',
    '        </div>',
    '      </div>',
    '      <dm-skeleton variant="rounded" rounded="lg" height="5rem" animation="wave" />',
    '      <dm-skeleton variant="rounded" rounded="full" [width]="104" height="2.25rem" />',
    '    </div>',
    '  </dm-card>',
    '} @else {',
    '  <!-- the real profile card, identical shape -->',
    '  <app-profile-card [user]="user()" />',
    '}',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmCardComponent, DmSkeletonComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-profile-card',",
    '  imports: [DmCardComponent, DmSkeletonComponent],',
    "  templateUrl: './profile-card.component.html',",
    '})',
    'export class ProfileCardComponent {',
    '  protected readonly loading = signal(true);',
    '  protected readonly user = signal<User | null>(null);',
    '',
    '  constructor() {',
    '    // Because the skeleton matches the real card box for box, the',
    '    // layout stays put the instant the data lands — no reflow jank.',
    "    fetch('/api/me')",
    '      .then((r) => r.json())',
    '      .then((user) => {',
    '        this.user.set(user);',
    '        this.loading.set(false);',
    '      });',
    '  }',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideSkeletonDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideSkeletonDefaults({ animation: 'wave', rounded: 'lg' }),",
    ']',
  ].join('\n');

  // ---- API -----------------------------------------------------------------
  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.i18n.t().skeletonPage.api;
    return [
      {
        name: 'variant',
        type: "'text' | 'rectangular' | 'circular' | 'rounded'",
        default: "'text'",
        description: api.variant,
      },
      {
        name: 'width',
        type: 'string | number | null',
        default: 'null',
        description: api.width,
      },
      {
        name: 'height',
        type: 'string | number | null',
        default: 'null',
        description: api.height,
      },
      {
        name: 'animation',
        type: "'pulse' | 'wave' | 'none'",
        default: "'pulse'",
        description: api.animation,
      },
      {
        name: 'rounded',
        type: "'sm' | 'md' | 'lg' | 'full'",
        default: "'md'",
        description: api.rounded,
      },
      {
        name: 'count',
        type: 'number',
        default: '1',
        description: api.count,
      },
    ];
  });
}
