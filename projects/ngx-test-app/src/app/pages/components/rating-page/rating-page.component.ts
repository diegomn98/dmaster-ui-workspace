import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmAvatarComponent,
  DmButtonComponent,
  DmButtonState,
  DmCardComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmRatingColor,
  DmRatingComponent,
  DmRatingSize,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-rating-page',
  imports: [
    DmRatingComponent,
    DmCardComponent,
    DmAvatarComponent,
    DmButtonComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmErrorComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './rating-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.rating);

  // Playground
  protected readonly playground = signal<PropValues>({
    max: 5,
    allowHalf: false,
    readonly: false,
    size: 'md',
    color: 'warning',
  });

  protected readonly controls: PropControl[] = [
    { key: 'max', label: 'max', type: 'number', min: 1, max: 10, step: 1 },
    { key: 'allowHalf', label: 'allowHalf', type: 'boolean' },
    { key: 'readonly', label: 'readonly', type: 'boolean' },
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

  protected readonly pgMax = computed(() => Number(this.playground()['max']) || 5);
  protected readonly pgAllowHalf = computed(() => this.playground()['allowHalf'] === true);
  protected readonly pgReadonly = computed(() => this.playground()['readonly'] === true);
  protected readonly pgSize = computed(() => this.playground()['size'] as DmRatingSize);
  protected readonly pgColor = computed(() => this.playground()['color'] as DmRatingColor);
  protected readonly pgValue = signal<number>(3);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgMax() !== 5) attrs.push(`[max]="${this.pgMax()}"`);
    if (this.pgAllowHalf()) attrs.push('allowHalf');
    if (this.pgReadonly()) attrs.push('readonly');
    if (this.pgSize() !== 'md') attrs.push(`size="${this.pgSize()}"`);
    if (this.pgColor() !== 'warning') attrs.push(`color="${this.pgColor()}"`);
    attrs.push('ariaLabel="Rate this product"');
    attrs.push('[(value)]="score"');
    return `<dm-rating ${attrs.join(' ')} />`;
  });

  // Demos
  protected readonly basicCode = [
    '<dm-rating [(value)]="score" ariaLabel="Rate this product" />',
    '<span>value: {{ score() }}</span>',
    '',
    'protected readonly score = signal(3);',
  ].join('\n');

  protected readonly halfCode = [
    '<!-- Half-star precision: hover the left half of a star, or step by 0.5 with the arrows -->',
    '<dm-rating [(value)]="quality" allowHalf ariaLabel="Quality" />',
    '<span>value: {{ quality() }}</span>',
  ].join('\n');

  protected readonly readonlyCode = [
    '<!-- readonly renders fractional fills exactly (3.7 → 70% of the 4th star) -->',
    '<div style="display: flex; align-items: center; gap: 0.75rem">',
    '  <strong style="font-size: 2rem">3.7</strong>',
    '  <div>',
    '    <dm-rating [value]="3.7" readonly ariaLabel="Average rating: 3.7 of 5" />',
    '    <span style="color: var(--dm-fg-muted)">1,284 reviews</span>',
    '  </div>',
    '</div>',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-rating size="sm" [(value)]="v" ariaLabel="Small" />',
    '<dm-rating size="md" [(value)]="v" ariaLabel="Medium" />',
    '<dm-rating size="lg" [(value)]="v" ariaLabel="Large" />',
  ].join('\n');

  protected readonly colorsCode = [
    '<dm-rating color="default" [(value)]="v" ariaLabel="Default" />',
    '<dm-rating color="primary" [(value)]="v" ariaLabel="Primary" />',
    '<dm-rating color="secondary" [(value)]="v" ariaLabel="Secondary" />',
    '<dm-rating color="success" [(value)]="v" ariaLabel="Success" />',
    '<dm-rating color="warning" [(value)]="v" ariaLabel="Warning" />',
    '<dm-rating color="danger" [(value)]="v" ariaLabel="Danger" />',
  ].join('\n');

  protected readonly characterCode = [
    '<!-- Any glyph works: it is rendered twice (empty + filled layer) and clipped by the value -->',
    '<dm-rating [(value)]="love" character="❤" color="danger" allowHalf ariaLabel="Favourite" />',
    '<dm-rating [(value)]="spice" character="🌶" [max]="3" ariaLabel="Spiciness" />',
    '<dm-rating [(value)]="level" character="●" color="primary" size="sm" ariaLabel="Level" />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideRatingDefaults } from '@dmaster/ui';",
    '',
    'providers: [',
    "  provideRatingDefaults({ max: 10, color: 'primary', allowHalf: true }),",
    ']',
  ].join('\n');

  // Signals for demos
  protected readonly score = signal<number>(3);
  protected readonly quality = signal<number>(3.5);
  protected readonly sizeValue = signal<number>(4);
  protected readonly colorValue = signal<number>(4);
  protected readonly love = signal<number>(2.5);
  protected readonly spice = signal<number>(2);
  protected readonly level = signal<number>(3);

  // Composition — product review card. The rating is a Reactive FormControl
  // validated with Validators.min(1); the review text is optional.
  protected readonly reviewForm = new FormGroup({
    score: new FormControl<number>(0, { nonNullable: true, validators: Validators.min(1) }),
    review: new FormControl<string>('', { nonNullable: true }),
  });

  /** Live mirror of the score control, used for the descriptive hint. */
  protected readonly reviewScore = toSignal(this.reviewForm.controls.score.valueChanges, {
    initialValue: this.reviewForm.controls.score.value,
  });

  /** "Poor" … "Excellent" for the picked score (rounded up), or the tap prompt. */
  protected readonly reviewHint = computed(() => {
    const labels = this.page().labels;
    const picked = Math.ceil(this.reviewScore());
    return picked > 0 ? labels[`rate${picked}`] : labels['tapToRate'];
  });

  protected readonly reviewState = signal<DmButtonState>('idle');

  protected submitReview(): void {
    if (this.reviewState() !== 'idle') {
      return;
    }
    this.reviewForm.markAllAsTouched();
    if (this.reviewForm.invalid) {
      return;
    }
    this.reviewState.set('loading');
    setTimeout(() => {
      this.reviewState.set('success');
      setTimeout(() => {
        this.reviewState.set('idle');
        this.reviewForm.reset({ score: 0, review: '' });
      }, 1600);
    }, 1200);
  }

  protected readonly compositionCode = [
    '<dm-card style="width: 100%; max-width: 26rem">',
    '  <form [formGroup]="form" (ngSubmit)="submit()" novalidate style="display: grid; gap: 1rem">',
    '    <div style="display: flex; align-items: center; gap: 0.75rem">',
    '      <dm-avatar initials="AX" shape="square" />',
    '      <div style="flex: 1; min-width: 0">',
    '        <strong style="display: block">Aurora X1 Headphones</strong>',
    '        <span style="color: var(--dm-fg-muted); font-size: 0.8125rem">',
    '          Order #48213 · Delivered Aug 12',
    '        </span>',
    '      </div>',
    '    </div>',
    '',
    '    <div style="display: grid; gap: 0.375rem">',
    '      <span style="font-weight: 500">Your rating</span>',
    '      <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap">',
    '        <dm-rating formControlName="score" size="lg" ariaLabel="Your rating" />',
    '        <span style="color: var(--dm-fg-muted); font-size: 0.875rem">{{ hint() }}</span>',
    '      </div>',
    '      @if (form.controls.score.touched && form.controls.score.hasError("min")) {',
    '        <dm-error>Please pick a rating.</dm-error>',
    '      }',
    '    </div>',
    '',
    '    <dm-form-field label="Your review" hint="Optional">',
    '      <textarea dmInput rows="3" formControlName="review"',
    '                placeholder="What did you like or dislike?"></textarea>',
    '    </dm-form-field>',
    '',
    '    <dm-button type="submit" color="primary" style="width: 100%"',
    '               [state]="state()" loadingLabel="Posting…" successLabel="Review posted">',
    '      Post review',
    '    </dm-button>',
    '  </form>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component, computed, signal } from '@angular/core';",
    "import { toSignal } from '@angular/core/rxjs-interop';",
    "import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';",
    'import {',
    '  DmAvatarComponent, DmButtonComponent, DmButtonState, DmCardComponent,',
    '  DmErrorComponent, DmFormFieldComponent, DmInputDirective, DmRatingComponent,',
    "} from '@dmaster/ui';",
    '',
    "const HINTS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'];",
    '',
    '@Component({',
    "  selector: 'app-review-card',",
    '  imports: [',
    '    ReactiveFormsModule, DmCardComponent, DmAvatarComponent, DmRatingComponent,',
    '    DmFormFieldComponent, DmInputDirective, DmErrorComponent, DmButtonComponent,',
    '  ],',
    "  templateUrl: './review-card.component.html',",
    '})',
    'export class ReviewCardComponent {',
    '  protected readonly form = new FormGroup({',
    '    score: new FormControl(0, { nonNullable: true, validators: Validators.min(1) }),',
    "    review: new FormControl('', { nonNullable: true }),",
    '  });',
    '',
    '  private readonly score = toSignal(this.form.controls.score.valueChanges, { initialValue: 0 });',
    '  protected readonly hint = computed(() =>',
    "    this.score() > 0 ? HINTS[Math.ceil(this.score()) - 1] : 'Tap a star to rate',",
    '  );',
    '',
    "  protected readonly state = signal<DmButtonState>('idle');",
    '',
    '  protected submit(): void {',
    '    this.form.markAllAsTouched();',
    '    if (this.form.invalid) return;',
    "    this.state.set('loading');",
    '    this.api.postReview(this.form.getRawValue()).subscribe({',
    "      next: () => this.state.set('success'),",
    "      error: () => this.state.set('error'),",
    '    });',
    '  }',
    '}',
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'value', type: 'number', default: '0', description: api['value'] },
      { name: 'max', type: 'number', default: '5', description: api['max'] },
      { name: 'allowHalf', type: 'boolean', default: 'false', description: api['allowHalf'] },
      { name: 'readonly', type: 'boolean', default: 'false', description: api['readonly'] },
      { name: 'disabled', type: 'boolean', default: 'false', description: api['disabled'] },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: api['size'],
      },
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'warning'",
        description: api['color'],
      },
      { name: 'ariaLabel', type: 'string', default: "''", description: api['ariaLabel'] },
      { name: 'character', type: 'string', default: "''", description: api['character'] },
      {
        name: 'rateChange',
        type: 'OutputEmitterRef<number>',
        default: '—',
        description: api['rateChange'],
      },
    ];
  });
}
