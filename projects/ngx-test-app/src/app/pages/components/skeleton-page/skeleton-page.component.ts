import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmSkeletonAnimation,
  DmSkeletonComponent,
  DmSkeletonRounded,
  DmSkeletonVariant,
} from 'ngx-dmaster-ui';

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
  protected readonly basicCode = '<dm-skeleton />';

  protected readonly variantsCode = [
    '<dm-skeleton />',
    '<dm-skeleton variant="rectangular" height="6rem" />',
    '<dm-skeleton variant="rounded" rounded="lg" height="6rem" />',
    '<dm-skeleton variant="circular" [width]="56" [height]="56" />',
  ].join('\n');

  protected readonly animationsCode = [
    '<dm-skeleton animation="pulse" height="2.5rem" variant="rounded" />',
    '<dm-skeleton animation="wave" height="2.5rem" variant="rounded" />',
    '<dm-skeleton animation="none" height="2.5rem" variant="rounded" />',
  ].join('\n');

  protected readonly paragraphCode = '<dm-skeleton [count]="3" />';

  protected readonly cardCode = [
    '<div class="card">',
    '  <div class="card__header">',
    '    <dm-skeleton variant="circular" [width]="48" [height]="48" />',
    '    <div class="card__lines">',
    '      <dm-skeleton width="40%" />',
    '      <dm-skeleton width="65%" />',
    '    </div>',
    '  </div>',
    '  <dm-skeleton variant="rounded" height="9rem" animation="wave" />',
    '</div>',
  ].join('\n');

  protected readonly fluidCode =
    '<dm-skeleton variant="rounded" width="clamp(8rem, 60%, 24rem)" height="clamp(3rem, 8vw, 5rem)" />';

  protected readonly defaultsCode = [
    "import { provideSkeletonDefaults } from 'ngx-dmaster-ui';",
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
