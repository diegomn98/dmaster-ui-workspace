import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeColor,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmIconComponent,
  DmTimelineAlign,
  DmTimelineColor,
  DmTimelineComponent,
  DmTimelineItemComponent,
  DmTimelineItemState,
  DmTimelineMarkerDirective,
  DmTimelineOrientation,
  DmTimelineSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

/** One step of the order-tracking composition. Copy is resolved from i18n by key. */
interface OrderStep {
  titleKey: string;
  bodyKey: string;
  datetime: string;
}

@Component({
  selector: 'app-timeline-page',
  imports: [
    DmTimelineComponent,
    DmTimelineItemComponent,
    DmTimelineMarkerDirective,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmIconComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './timeline-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelinePageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.timeline);

  // ---- Locale-aware date formatting (Intl, no date lib) -------------------

  private readonly dayFmt = computed(
    () => new Intl.DateTimeFormat(this.i18n.locale(), { month: 'short', day: 'numeric' }),
  );
  private readonly stampFmt = computed(
    () =>
      new Intl.DateTimeFormat(this.i18n.locale(), {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  );

  /** "Mar 3" in the active locale. */
  protected day(iso: string): string {
    return this.dayFmt().format(new Date(iso));
  }

  /** "Mar 3, 09:12" in the active locale. */
  protected stamp(iso: string): string {
    return this.stampFmt().format(new Date(iso));
  }

  // ---- Playground ---------------------------------------------------------

  protected readonly playground = signal<PropValues>({
    orientation: 'vertical',
    align: 'start',
    size: 'md',
    color: 'primary',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'orientation',
      label: 'orientation',
      type: 'select',
      options: [
        { label: 'vertical', value: 'vertical' },
        { label: 'horizontal', value: 'horizontal' },
      ],
    },
    {
      key: 'align',
      label: 'align',
      type: 'select',
      options: [
        { label: 'start', value: 'start' },
        { label: 'alternate', value: 'alternate' },
      ],
    },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: [
        { label: 'sm', value: 'sm' },
        { label: 'md', value: 'md' },
        { label: 'lg', value: 'lg' },
      ],
    },
    {
      key: 'color',
      label: 'color',
      type: 'select',
      options: [
        { label: 'default', value: 'default' },
        { label: 'primary', value: 'primary' },
        { label: 'secondary', value: 'secondary' },
        { label: 'success', value: 'success' },
        { label: 'warning', value: 'warning' },
        { label: 'danger', value: 'danger' },
      ],
    },
  ];

  protected readonly pgOrientation = computed(
    () => this.playground()['orientation'] as DmTimelineOrientation,
  );
  protected readonly pgAlign = computed(() => this.playground()['align'] as DmTimelineAlign);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmTimelineSize);
  protected readonly pgColor = computed(() => this.playground()['color'] as DmTimelineColor);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgOrientation() !== 'vertical') {
      attrs.push(`orientation="${this.pgOrientation()}"`);
    }
    if (this.pgAlign() !== 'start') attrs.push(`align="${this.pgAlign()}"`);
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgColor() !== 'primary') attrs.push(`color="${this.pgColor()}"`);
    attrs.push('ariaLabel="Order history"');
    return [
      `<dm-timeline ${attrs.join(' ')}>`,
      '  <dm-timeline-item title="Order placed" time="Mar 3" datetime="2026-03-03" state="completed">',
      '    We received your order and sent a confirmation email.',
      '  </dm-timeline-item>',
      '  <dm-timeline-item title="Shipped" time="Mar 4" datetime="2026-03-04" state="completed">',
      '    Handed to the carrier. Tracking number ES-7731-4821.',
      '  </dm-timeline-item>',
      '  <dm-timeline-item title="Out for delivery" time="Mar 5" datetime="2026-03-05" state="active">',
      '    The courier is on the way.',
      '  </dm-timeline-item>',
      '  <dm-timeline-item title="Delivered" variant="outlined" />',
      '</dm-timeline>',
    ].join('\n');
  });

  // ---- Basic: order tracking with <time datetime> --------------------------

  protected readonly basicCode = [
    '<dm-timeline ariaLabel="Order history">',
    '  <dm-timeline-item title="Order placed" time="Mar 3" datetime="2026-03-03" state="completed">',
    '    We received your order and sent a confirmation email.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Shipped" time="Mar 4" datetime="2026-03-04" state="completed">',
    '    Handed to the carrier. Tracking number ES-7731-4821.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Out for delivery" time="Mar 5" datetime="2026-03-05" state="active">',
    '    The courier is on the way.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Delivered" variant="outlined" />',
    '</dm-timeline>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmTimelineComponent, DmTimelineItemComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-order-history',",
    '  imports: [DmTimelineComponent, DmTimelineItemComponent],',
    "  templateUrl: './order-history.component.html',",
    '})',
    'export class OrderHistoryComponent {}',
  ].join('\n');

  // ---- States: CI pipeline ------------------------------------------------

  protected readonly statesCode = [
    '<!-- completed → check glyph + accented connector; active → pulsing ring;',
    '     error → warning glyph in danger; default → plain dot. -->',
    '<dm-timeline ariaLabel="Pipeline run #512">',
    '  <dm-timeline-item title="Checkout" time="10:02" state="completed">main @ 3c24fc0</dm-timeline-item>',
    '  <dm-timeline-item title="Build" time="10:03" state="completed">Compiled in 42 s.</dm-timeline-item>',
    '  <dm-timeline-item title="Lint" time="10:04" state="error">3 warnings promoted to errors.</dm-timeline-item>',
    '  <dm-timeline-item title="Tests" time="10:04" state="active">Running 148 specs…</dm-timeline-item>',
    '  <dm-timeline-item title="Deploy">Waiting for the previous jobs.</dm-timeline-item>',
    '</dm-timeline>',
  ].join('\n');

  // ---- Outlined variant + per-item colors: incident -------------------------

  protected readonly outlinedCode = [
    '<!-- `variant="outlined"` fills the marker with the surface and draws an accent ring;',
    '     each item may override the timeline color. -->',
    '<dm-timeline ariaLabel="Incident #2093" color="default">',
    '  <dm-timeline-item title="Incident opened" time="08:12" variant="outlined" color="danger" state="completed">',
    '    Error rate above 5 % on the checkout API.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Investigating" time="08:20" variant="outlined" color="warning" state="completed">',
    '    On-call engineer paged; rollback under evaluation.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Fix deployed" time="09:05" variant="outlined" color="primary" state="completed">',
    '    Hotfix 2.4.1 rolled out to every region.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="Resolved" time="09:40" variant="outlined" color="success" state="active">',
    '    Error rate back to baseline. Post-mortem scheduled.',
    '  </dm-timeline-item>',
    '</dm-timeline>',
  ].join('\n');

  // ---- Custom markers: activity feed ---------------------------------------

  protected readonly markersCode = [
    '<!-- Any projected element with `dmTimelineMarker` replaces the default dot. -->',
    '<dm-timeline ariaLabel="Activity feed" size="lg">',
    '  <dm-timeline-item title="Ana commented" time="2 hours ago">',
    '    <dm-avatar dmTimelineMarker initials="AG" size="sm" />',
    '    Looks good to me — ship it!',
    '  </dm-timeline-item>',
    '',
    '  <dm-timeline-item title="Deploy succeeded" time="4 hours ago">',
    '    <span dmTimelineMarker class="feed-icon feed-icon--success"><dm-icon name="zap" size="1rem" /></span>',
    '    Preview environment is live.',
    '  </dm-timeline-item>',
    '',
    '  <dm-timeline-item title="Lucas pushed 3 commits" time="Yesterday">',
    '    <dm-avatar dmTimelineMarker initials="LM" size="sm" />',
    '    feat(timeline): custom markers',
    '  </dm-timeline-item>',
    '',
    '  <dm-timeline-item title="New star" time="3 days ago">',
    '    <span dmTimelineMarker class="feed-icon feed-icon--warning"><dm-icon name="star" size="1rem" /></span>',
    '    The repository reached 1 000 stars.',
    '  </dm-timeline-item>',
    '</dm-timeline>',
  ].join('\n');

  protected readonly markersTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmAvatarComponent, DmIconComponent,',
    '  DmTimelineComponent, DmTimelineItemComponent, DmTimelineMarkerDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-activity-feed',",
    '  imports: [',
    '    DmTimelineComponent, DmTimelineItemComponent, DmTimelineMarkerDirective,',
    '    DmAvatarComponent, DmIconComponent,',
    '  ],',
    "  templateUrl: './activity-feed.component.html',",
    '  styles: `',
    '    .feed-icon {',
    '      display: inline-grid; place-items: center;',
    '      width: 1.75rem; height: 1.75rem; border-radius: 999px;',
    '    }',
    '    .feed-icon--success { background: var(--dm-success-subtle); color: var(--dm-success); }',
    '    .feed-icon--warning { background: var(--dm-warning-subtle); color: var(--dm-warning); }',
    '  `,',
    '})',
    'export class ActivityFeedComponent {}',
  ].join('\n');

  // ---- Alternate alignment: milestones -------------------------------------

  protected readonly alternateCode = [
    '<!-- Centers the rail and zig-zags the content from the `md` breakpoint up;',
    '     narrower viewports fall back to `start`. -->',
    '<dm-timeline align="alternate" ariaLabel="Project milestones">',
    '  <dm-timeline-item title="v1.0 — First release" time="Jan 2025" datetime="2025-01" state="completed">',
    '    Buttons, forms and overlays.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="v1.5 — Dark mode" time="Jun 2025" datetime="2025-06" state="completed">',
    '    Semantic tokens across both themes.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="v2.0 — Data display" time="Mar 2026" datetime="2026-03" state="active">',
    '    Table, tree and timeline.',
    '  </dm-timeline-item>',
    '  <dm-timeline-item title="v3.0 — Signal Forms" time="2027" datetime="2027" variant="outlined">',
    '    Planned for next year.',
    '  </dm-timeline-item>',
    '</dm-timeline>',
  ].join('\n');

  // ---- Horizontal: release roadmap -----------------------------------------

  protected readonly horizontalCode = [
    '<!-- One column per item; scrolls sideways when they no longer fit.',
    '     Tune the minimum column width with --dm-timeline-col. -->',
    '<dm-timeline orientation="horizontal" color="success" ariaLabel="Release roadmap"',
    '             style="--dm-timeline-col: 11rem">',
    '  <dm-timeline-item title="Plan" time="Q1 2026" state="completed">Scope and design.</dm-timeline-item>',
    '  <dm-timeline-item title="Build" time="Q2 2026" state="completed">Core components.</dm-timeline-item>',
    '  <dm-timeline-item title="Beta" time="Q3 2026" state="active">Early adopters testing.</dm-timeline-item>',
    '  <dm-timeline-item title="GA" time="Q4 2026" variant="outlined">Public release.</dm-timeline-item>',
    '</dm-timeline>',
  ].join('\n');

  // ---- Global defaults ----------------------------------------------------

  protected readonly defaultsCode = [
    "import { provideTimelineDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideTimelineDefaults({ color: 'success', variant: 'outlined', size: 'sm' }),",
    ']',
  ].join('\n');

  // ---- Composition: Order #4821 tracking card ------------------------------

  protected readonly orderSteps: OrderStep[] = [
    { titleKey: 'placed', bodyKey: 'placedBody', datetime: '2026-03-03T09:12:00' },
    { titleKey: 'packed', bodyKey: 'packedBody', datetime: '2026-03-03T16:40:00' },
    { titleKey: 'shipped', bodyKey: 'shippedBody', datetime: '2026-03-04T08:05:00' },
    { titleKey: 'outForDelivery', bodyKey: 'outForDeliveryBody', datetime: '2026-03-05T07:30:00' },
    { titleKey: 'delivered', bodyKey: 'deliveredBody', datetime: '2026-03-05T13:15:00' },
  ];

  /** Index of the step currently in progress. */
  protected readonly orderActive = signal(2);

  protected readonly isDelivered = computed(() => this.orderActive() >= this.orderSteps.length - 1);

  protected stepState(index: number): DmTimelineItemState {
    const active = this.orderActive();
    if (index < active || (index === active && this.isDelivered())) return 'completed';
    if (index === active) return 'active';
    return 'default';
  }

  /** Status chip: color + label key derived from the active step. */
  protected readonly orderStatus = computed<{ color: DmBadgeColor; key: string }>(() => {
    switch (this.orderActive()) {
      case 0:
      case 1:
        return { color: 'warning', key: 'statusProcessing' };
      case 2:
        return { color: 'primary', key: 'statusShipped' };
      case 3:
        return { color: 'primary', key: 'statusOutForDelivery' };
      default:
        return { color: 'success', key: 'statusDelivered' };
    }
  });

  /** "Estimated delivery Mar 5" until delivered, then "Delivered on Mar 5, 13:15". */
  protected readonly orderEta = computed(() => {
    const last = this.orderSteps[this.orderSteps.length - 1];
    const l = this.page().labels;
    return this.isDelivered()
      ? `${l['deliveredPrefix']} ${this.stamp(last.datetime)}`
      : `${l['etaPrefix']} ${this.day(last.datetime)}`;
  });

  protected advanceOrder(): void {
    if (!this.isDelivered()) {
      this.orderActive.update((i) => i + 1);
    }
  }

  protected resetOrder(): void {
    this.orderActive.set(0);
  }

  protected readonly compositionCode = [
    '<!-- Order tracking card: a vertical timeline whose states derive from the',
    '     active step signal. "Advance" moves the active state forward. -->',
    '<dm-card style="max-width: 30rem">',
    '  <div style="display: grid; gap: 1.25rem">',
    '    <div style="display: flex; justify-content: space-between; gap: 1rem; align-items: start">',
    '      <div>',
    '        <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700">Order #4821</h3>',
    '        <p style="margin: 0.25rem 0 0; font-size: 0.875rem; color: var(--dm-fg-muted)">',
    '          3 items · Ships to Madrid',
    '        </p>',
    '      </div>',
    '      <div style="display: grid; justify-items: end; gap: 0.375rem">',
    '        <dm-badge [color]="status().color" variant="flat">{{ status().label }}</dm-badge>',
    '        <span style="font-size: 0.75rem; color: var(--dm-fg-muted)">{{ eta() }}</span>',
    '      </div>',
    '    </div>',
    '',
    '    <dm-timeline ariaLabel="Order #4821 history" color="success">',
    '      @for (step of steps; track step.title; let i = $index) {',
    '        <dm-timeline-item',
    '          [title]="step.title"',
    '          [time]="i <= active() ? stamp(step.datetime) : \'\'"',
    '          [datetime]="step.datetime"',
    '          [state]="stateOf(i)"',
    "          [variant]=\"i > active() ? 'outlined' : 'solid'\"",
    '        >',
    '          {{ i <= active() ? step.body : "Pending" }}',
    '        </dm-timeline-item>',
    '      }',
    '    </dm-timeline>',
    '',
    '    <div style="display: flex; justify-content: flex-end; gap: 0.5rem; flex-wrap: wrap">',
    '      <dm-button variant="light" (clicked)="reset()">Reset</dm-button>',
    '      <dm-button variant="ghost" (clicked)="track()">Track package</dm-button>',
    '      <dm-button color="primary" [disabled]="delivered()" (clicked)="advance()">Advance</dm-button>',
    '    </div>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    'import {',
    '  DmBadgeColor, DmBadgeComponent, DmButtonComponent, DmCardComponent,',
    '  DmTimelineComponent, DmTimelineItemComponent, DmTimelineItemState,',
    "} from '@dmaster/ui';",
    '',
    'interface OrderStep { title: string; body: string; datetime: string }',
    '',
    '@Component({',
    "  selector: 'app-order-tracking',",
    '  imports: [',
    '    DmCardComponent, DmBadgeComponent, DmButtonComponent,',
    '    DmTimelineComponent, DmTimelineItemComponent,',
    '  ],',
    "  templateUrl: './order-tracking.component.html',",
    '})',
    'export class OrderTrackingComponent {',
    '  protected readonly steps: OrderStep[] = [',
    "    { title: 'Order placed', body: 'We received your order and payment.', datetime: '2026-03-03T09:12:00' },",
    "    { title: 'Packed', body: 'Your items were packed at our Madrid warehouse.', datetime: '2026-03-03T16:40:00' },",
    "    { title: 'Shipped', body: 'Handed to the carrier. Tracking number ES-7731-4821.', datetime: '2026-03-04T08:05:00' },",
    "    { title: 'Out for delivery', body: 'The courier is on the way — expect a call.', datetime: '2026-03-05T07:30:00' },",
    "    { title: 'Delivered', body: 'Left with the concierge.', datetime: '2026-03-05T13:15:00' },",
    '  ];',
    '',
    '  protected readonly active = signal(2);',
    '  protected readonly delivered = computed(() => this.active() >= this.steps.length - 1);',
    '',
    '  protected readonly status = computed<{ color: DmBadgeColor; label: string }>(() => {',
    '    switch (this.active()) {',
    "      case 0: case 1: return { color: 'warning', label: 'Processing' };",
    "      case 2: return { color: 'primary', label: 'Shipped' };",
    "      case 3: return { color: 'primary', label: 'Out for delivery' };",
    "      default: return { color: 'success', label: 'Delivered' };",
    '    }',
    '  });',
    '',
    "  private readonly fmt = new Intl.DateTimeFormat('en', {",
    "    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',",
    '  });',
    '',
    '  protected readonly eta = computed(() => {',
    '    const last = this.steps[this.steps.length - 1];',
    '    return this.delivered()',
    '      ? `Delivered on ${this.stamp(last.datetime)}`',
    '      : `Estimated delivery ${this.stamp(last.datetime)}`;',
    '  });',
    '',
    '  protected stamp(iso: string): string {',
    '    return this.fmt.format(new Date(iso));',
    '  }',
    '',
    '  protected stateOf(i: number): DmTimelineItemState {',
    '    const a = this.active();',
    "    if (i < a || (i === a && this.delivered())) return 'completed';",
    "    return i === a ? 'active' : 'default';",
    '  }',
    '',
    '  protected advance(): void {',
    '    if (!this.delivered()) this.active.update((i) => i + 1);',
    '  }',
    '',
    '  protected reset(): void {',
    '    this.active.set(0);',
    '  }',
    '',
    '  protected track(): void {',
    "    window.open('https://carrier.example/track/ES-7731-4821', '_blank', 'noopener');",
    '  }',
    '}',
  ].join('\n');

  // ---- API ----------------------------------------------------------------

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: api['orientation'],
      },
      {
        name: 'align',
        type: "'start' | 'alternate'",
        default: "'start'",
        description: api['align'],
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: api['size'] },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      { name: 'itemCount', type: 'Signal<number>', description: api['itemCount'] },
      { name: 'title (item)', type: 'string', default: "''", description: api['title'] },
      { name: 'time (item)', type: 'string', default: "''", description: api['time'] },
      { name: 'datetime (item)', type: 'string', default: "''", description: api['datetime'] },
      {
        name: 'color (item)',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: 'inherits',
        description: api['itemColor'],
      },
      {
        name: 'variant (item)',
        type: "'solid' | 'outlined'",
        default: "'solid'",
        description: api['variant'],
      },
      {
        name: 'state (item)',
        type: "'default' | 'active' | 'completed' | 'error'",
        default: "'default'",
        description: api['state'],
      },
      { name: 'index (item)', type: 'Signal<number>', description: api['index'] },
      { name: 'isLast (item)', type: 'Signal<boolean>', description: api['isLast'] },
      { name: 'dmTimelineMarker', type: 'directive', description: api['marker'] },
    ];
  });
}
