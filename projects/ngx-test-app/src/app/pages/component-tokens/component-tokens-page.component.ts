import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DmButtonComponent } from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';

// ---------------------------------------------------------------------------
// Token data types
// ---------------------------------------------------------------------------

interface TokenEntry {
  token: string;
  fallback: string;
}

interface TokenGroup {
  component: string;
  tokens: TokenEntry[];
}

interface TokenCategory {
  labelKey: string;
  groups: TokenGroup[];
}

// ---------------------------------------------------------------------------
// Real token data extracted from component SCSS files
// ---------------------------------------------------------------------------

const PRIMITIVES: TokenGroup[] = [
  {
    component: 'Skeleton',
    tokens: [
      { token: '--dm-skeleton-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-skeleton-highlight', fallback: 'rgb(255 255 255 / 60%)' },
      { token: '--dm-skeleton-duration', fallback: '1.6s' },
      { token: '--dm-skeleton-gap', fallback: 'var(--dm-space-2)' },
      { token: '--dm-skeleton-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Spinner',
    tokens: [
      { token: '--dm-spinner-color', fallback: 'currentcolor' },
      { token: '--dm-spinner-duration', fallback: '2s' },
      { token: '--dm-spinner-track-opacity', fallback: '0.16' },
    ],
  },
  {
    component: 'Badge',
    tokens: [
      { token: '--dm-badge-dot-size', fallback: '0.5em' },
      { token: '--dm-badge-font-size', fallback: 'var(--dm-text-xs)' },
      { token: '--dm-badge-gap', fallback: '0.375em' },
      { token: '--dm-badge-padding', fallback: '0.1875rem 0.5625rem' },
      { token: '--dm-badge-radius', fallback: 'var(--dm-radius-full)' },
    ],
  },
  {
    component: 'Avatar',
    tokens: [
      { token: '--dm-avatar-bg', fallback: 'var(--dm-primary-subtle)' },
      { token: '--dm-avatar-border', fallback: 'var(--dm-border)' },
      { token: '--dm-avatar-fg', fallback: 'var(--dm-primary-text)' },
      { token: '--dm-avatar-icon-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-avatar-radius', fallback: 'var(--dm-radius-full)' },
    ],
  },
  {
    component: 'Icon',
    tokens: [
      { token: '--dm-icon-fill', fallback: '0' },
      { token: '--dm-icon-weight', fallback: '400' },
      { token: '--dm-icon-spin-duration', fallback: '1s' },
      { token: '--dm-icon-font', fallback: "'Material Symbols Outlined'" },
      { token: '--dm-icon-font-rounded', fallback: "'Material Symbols Rounded'" },
      { token: '--dm-icon-font-sharp', fallback: "'Material Symbols Sharp'" },
    ],
  },
  {
    component: 'Kbd',
    tokens: [
      { token: '--dm-kbd-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-kbd-border', fallback: 'var(--dm-border)' },
      { token: '--dm-kbd-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-kbd-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-kbd-gap', fallback: '0.25em' },
      { token: '--dm-kbd-padding', fallback: '0.4em' },
      { token: '--dm-kbd-radius', fallback: 'var(--dm-radius-sm)' },
      { token: '--dm-kbd-size', fallback: '1.5rem' },
    ],
  },
];

const LAYOUT: TokenGroup[] = [
  {
    component: 'Card',
    tokens: [
      { token: '--dm-card-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-card-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-card-padding', fallback: 'var(--dm-space-5)' },
      { token: '--dm-card-radius', fallback: 'var(--dm-radius-xl)' },
    ],
  },
  {
    component: 'Accordion',
    tokens: [
      { token: '--dm-accordion-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-accordion-border', fallback: 'var(--dm-border)' },
      { token: '--dm-accordion-divider', fallback: 'var(--dm-border)' },
      { token: '--dm-accordion-gap', fallback: 'var(--dm-space-3)' },
      { token: '--dm-accordion-icon-open', fallback: 'var(--dm-primary)' },
      { token: '--dm-accordion-icon-size', fallback: '1.25rem' },
      { token: '--dm-accordion-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-accordion-trigger-height', fallback: '3.5rem' },
      { token: '--dm-accordion-trigger-hover', fallback: 'var(--dm-bg-subtle)' },
      { token: '--dm-accordion-trigger-padding', fallback: 'var(--dm-space-4)' },
    ],
  },
  {
    component: 'Divider',
    tokens: [
      { token: '--dm-divider-color', fallback: 'var(--dm-border)' },
      { token: '--dm-divider-label-color', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-divider-label-gap', fallback: 'var(--dm-space-3)' },
      { token: '--dm-divider-thickness', fallback: '1px' },
    ],
  },
];

const FEEDBACK: TokenGroup[] = [
  {
    component: 'Progress',
    tokens: [
      { token: '--dm-progress-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-progress-gap', fallback: 'var(--dm-space-2)' },
      { token: '--dm-progress-label-color', fallback: 'var(--dm-fg)' },
      { token: '--dm-progress-radius', fallback: 'var(--dm-radius-full)' },
      { token: '--dm-progress-track', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-progress-track-height', fallback: '0.5rem' },
      { token: '--dm-progress-value-color', fallback: 'var(--dm-fg-muted)' },
    ],
  },
  {
    component: 'Alert',
    tokens: [
      { token: '--dm-alert-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-alert-gap', fallback: 'var(--dm-space-3)' },
      { token: '--dm-alert-icon-size', fallback: '2rem' },
      { token: '--dm-alert-padding', fallback: 'var(--dm-space-3)' },
      { token: '--dm-alert-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-alert-title-weight', fallback: 'var(--dm-font-semibold)' },
    ],
  },
];

const BUTTONS: TokenGroup[] = [
  {
    component: 'Button',
    tokens: [
      { token: '--dm-button-font-weight', fallback: 'var(--dm-font-medium)' },
      { token: '--dm-button-gap', fallback: 'var(--dm-space-2)' },
      { token: '--dm-button-height', fallback: '2.5rem' },
      { token: '--dm-button-min-width', fallback: '5rem' },
      { token: '--dm-button-padding-inline', fallback: '1rem' },
      { token: '--dm-button-radius', fallback: 'var(--dm-radius-full)' },
    ],
  },
  {
    component: 'Button group',
    tokens: [
      { token: '--dm-button-group-divider', fallback: 'color-mix(...)' },
      { token: '--dm-button-group-divider-inset', fallback: '15%' },
      { token: '--dm-button-group-divider-thickness', fallback: '1px' },
    ],
  },
];

const FORMS: TokenGroup[] = [
  {
    component: 'Switch',
    tokens: [
      { token: '--dm-switch-label-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-switch-thumb-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-switch-track-bg', fallback: 'var(--dm-default)' },
      { token: '--dm-switch-track-bg-checked', fallback: 'var(--dm-primary)' },
      { token: '--dm-switch-track-bg-checked-hover', fallback: 'var(--dm-primary-hover)' },
      { token: '--dm-switch-track-bg-hover', fallback: 'color-mix(...)' },
    ],
  },
  {
    component: 'Checkbox',
    tokens: [
      { token: '--dm-checkbox-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-checkbox-bg-checked', fallback: 'var(--dm-primary)' },
      { token: '--dm-checkbox-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-checkbox-border-checked', fallback: 'var(--dm-primary)' },
      { token: '--dm-checkbox-fg', fallback: 'var(--dm-primary-fg)' },
      { token: '--dm-checkbox-label-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-checkbox-radius', fallback: '0.3125rem' },
      { token: '--dm-checkbox-size', fallback: '1.125rem' },
    ],
  },
  {
    component: 'Radio group',
    tokens: [
      { token: '--dm-radio-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-radio-dot-size', fallback: '0.625rem' },
      { token: '--dm-radio-group-gap', fallback: 'var(--dm-space-3)' },
      { token: '--dm-radio-label-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-radio-size', fallback: '1.25rem' },
    ],
  },
  {
    component: 'Select',
    tokens: [
      { token: '--dm-select-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-select-bg-focus', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-select-border', fallback: 'var(--dm-border)' },
      { token: '--dm-select-chevron-color', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-select-height', fallback: '2.5rem' },
      { token: '--dm-select-placeholder-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-select-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Autocomplete',
    tokens: [
      { token: '--dm-autocomplete-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-autocomplete-bg-focus', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-autocomplete-border', fallback: 'var(--dm-border)' },
      { token: '--dm-autocomplete-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-autocomplete-height', fallback: '2.5rem' },
      { token: '--dm-autocomplete-icon-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-autocomplete-placeholder-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-autocomplete-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Search field',
    tokens: [
      { token: '--dm-search-field-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-search-field-bg-focus', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-search-field-border', fallback: 'var(--dm-border)' },
      { token: '--dm-search-field-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-search-field-height', fallback: '2.5rem' },
      { token: '--dm-search-field-icon-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-search-field-placeholder-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-search-field-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Date picker',
    tokens: [
      { token: '--dm-datepicker-day-radius', fallback: 'var(--dm-radius-full)' },
      { token: '--dm-datepicker-day-size', fallback: '2.25rem' },
      { token: '--dm-datepicker-height', fallback: '2.5rem' },
      { token: '--dm-datepicker-panel-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-datepicker-panel-border', fallback: 'var(--dm-border)' },
      { token: '--dm-datepicker-panel-padding', fallback: 'var(--dm-space-3)' },
      { token: '--dm-datepicker-panel-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-datepicker-panel-width', fallback: '17.5rem' },
      { token: '--dm-datepicker-trigger-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-datepicker-trigger-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-datepicker-trigger-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Color picker',
    tokens: [
      { token: '--dm-color-picker-height', fallback: '2.5rem' },
      { token: '--dm-color-picker-panel-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-color-picker-panel-border', fallback: 'var(--dm-border)' },
      { token: '--dm-color-picker-panel-padding', fallback: 'var(--dm-space-3)' },
      { token: '--dm-color-picker-panel-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-color-picker-panel-width', fallback: '15rem' },
      { token: '--dm-color-picker-sv-height', fallback: '9rem' },
      { token: '--dm-color-picker-trigger-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-color-picker-trigger-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-color-picker-trigger-radius', fallback: 'var(--dm-radius-md)' },
    ],
  },
  {
    component: 'Slider',
    tokens: [
      { token: '--dm-slider-bubble-bg', fallback: 'var(--dm-fg)' },
      { token: '--dm-slider-bubble-fg', fallback: 'var(--dm-bg)' },
      { token: '--dm-slider-bubble-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-slider-mark-bg', fallback: 'color-mix(...)' },
      { token: '--dm-slider-thumb-bg', fallback: 'var(--dm-bg)' },
      { token: '--dm-slider-thumb-border-width', fallback: '2px' },
      { token: '--dm-slider-track-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-slider-track-radius', fallback: 'var(--dm-radius-full)' },
    ],
  },
  {
    component: 'Rating',
    tokens: [
      { token: '--dm-rating-empty-color', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-rating-fill', fallback: 'var(--dm-warning)' },
      { token: '--dm-rating-star-gap', fallback: 'var(--dm-space-1)' },
      { token: '--dm-rating-star-size', fallback: '1.5rem' },
    ],
  },
  {
    component: 'File upload',
    tokens: [
      { token: '--dm-file-upload-bg', fallback: 'transparent' },
      { token: '--dm-file-upload-bg-active', fallback: 'var(--dm-primary-subtle)' },
      { token: '--dm-file-upload-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-file-upload-border-active', fallback: 'var(--dm-primary)' },
      { token: '--dm-file-upload-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-file-upload-item-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-file-upload-item-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-file-upload-radius', fallback: 'var(--dm-radius-lg)' },
    ],
  },
  {
    component: 'Number input',
    tokens: [
      { token: '--dm-number-input-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-number-input-bg-focus', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-number-input-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-number-input-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-number-input-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-number-input-step-fg', fallback: 'var(--dm-fg-muted)' },
    ],
  },
  {
    component: 'OTP input',
    tokens: [
      { token: '--dm-otp-cell-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-otp-cell-bg-focus', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-otp-cell-border', fallback: 'var(--dm-border)' },
      { token: '--dm-otp-cell-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-otp-cell-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-otp-cell-size', fallback: '2.5rem' },
    ],
  },
  {
    component: 'Toggle group',
    tokens: [
      { token: '--dm-toggle-border', fallback: 'var(--dm-border)' },
      { token: '--dm-toggle-inset', fallback: '0.1875rem' },
      { token: '--dm-toggle-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-toggle-segment-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-toggle-track-bg', fallback: 'var(--dm-bg-muted)' },
    ],
  },
  {
    component: 'Form field',
    tokens: [
      { token: '--dm-form-field-error-fg', fallback: 'var(--dm-danger)' },
      { token: '--dm-form-field-gap', fallback: 'var(--dm-space-1)' },
      { token: '--dm-form-field-hint-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-form-field-label-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-form-field-label-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-form-field-required-fg', fallback: 'color-mix(...)' },
    ],
  },
  {
    component: 'Error',
    tokens: [
      { token: '--dm-error-fg', fallback: 'var(--dm-danger-text)' },
      { token: '--dm-error-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-error-font-weight', fallback: 'var(--dm-font-medium)' },
      { token: '--dm-error-gap', fallback: '0.3em' },
    ],
  },
];

const NAVIGATION: TokenGroup[] = [
  {
    component: 'Tabs',
    tokens: [
      { token: '--dm-tabs-gap', fallback: 'var(--dm-space-4)' },
      { token: '--dm-tabs-indicator-bg', fallback: 'varies by variant' },
      { token: '--dm-tabs-indicator-thickness', fallback: '2.5px' },
      { token: '--dm-tabs-list-bg', fallback: 'var(--dm-bg-subtle)' },
      { token: '--dm-tabs-list-border', fallback: 'var(--dm-border)' },
      { token: '--dm-tabs-tab-bg-hover', fallback: 'var(--dm-default-subtle)' },
      { token: '--dm-tabs-tab-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-tabs-tab-fg-hover', fallback: 'var(--dm-fg)' },
      { token: '--dm-tabs-tab-fg-selected', fallback: 'var(--dm-fg)' },
    ],
  },
  {
    component: 'Breadcrumbs',
    tokens: [
      { token: '--dm-breadcrumbs-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-breadcrumbs-fg-active', fallback: 'var(--dm-fg)' },
      { token: '--dm-breadcrumbs-fg-disabled', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-breadcrumbs-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-breadcrumbs-gap', fallback: '0.5rem' },
      { token: '--dm-breadcrumbs-item-padding', fallback: '0.125rem 0.25rem' },
      { token: '--dm-breadcrumbs-item-radius', fallback: 'var(--dm-radius-sm)' },
      { token: '--dm-breadcrumbs-label-max-width', fallback: '9rem' },
      { token: '--dm-breadcrumbs-sep', fallback: 'var(--dm-fg-subtle)' },
    ],
  },
  {
    component: 'Pagination',
    tokens: [
      { token: '--dm-pagination-active-bg', fallback: 'varies by color' },
      { token: '--dm-pagination-active-fg', fallback: 'varies by color' },
      { token: '--dm-pagination-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-pagination-fg-hover', fallback: 'var(--dm-fg)' },
      { token: '--dm-pagination-gap', fallback: 'var(--dm-space-1)' },
      { token: '--dm-pagination-hover-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-pagination-item-size', fallback: 'varies by size' },
      { token: '--dm-pagination-radius', fallback: 'var(--dm-radius-lg)' },
    ],
  },
  {
    component: 'Stepper',
    tokens: [
      { token: '--dm-stepper-indicator-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-stepper-indicator-border', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-stepper-indicator-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-stepper-indicator-radius', fallback: 'var(--dm-radius-full)' },
      {
        token: '--dm-stepper-indicator-shadow-active',
        fallback: '0 0 0 0.25rem var(--dm-stepper-accent-soft)',
      },
      { token: '--dm-stepper-label-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-stepper-label-fg-active', fallback: 'var(--dm-fg)' },
      { token: '--dm-stepper-ind', fallback: '1.75rem' },
      { token: '--dm-stepper-ind-fs', fallback: 'var(--dm-text-sm)' },
    ],
  },
];

const DATA_DISPLAY: TokenGroup[] = [
  {
    component: 'Table',
    tokens: [
      { token: '--dm-table-bg', fallback: 'var(--dm-bg)' },
      { token: '--dm-table-border', fallback: 'var(--dm-border)' },
      { token: '--dm-table-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-table-header-bg', fallback: 'var(--dm-bg-subtle)' },
      { token: '--dm-table-header-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-table-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-table-row-bg-hover', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-table-row-bg-selected', fallback: 'var(--dm-primary-subtle)' },
      { token: '--dm-table-stripe-bg', fallback: 'var(--dm-bg-subtle)' },
    ],
  },
  {
    component: 'Tree',
    tokens: [
      { token: '--dm-tree-chevron-color', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-tree-disabled-fg', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-tree-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-tree-font-size', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-tree-guide', fallback: 'var(--dm-border)' },
      { token: '--dm-tree-hover-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-tree-indent', fallback: '1.5rem' },
      { token: '--dm-tree-row-height', fallback: '2.25rem' },
      { token: '--dm-tree-row-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-tree-selected-bg', fallback: 'var(--dm-primary-subtle)' },
      { token: '--dm-tree-selected-fg', fallback: 'var(--dm-primary-text)' },
    ],
  },
  {
    component: 'Timeline',
    tokens: [
      { token: '--dm-timeline-body-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-timeline-body-fs', fallback: 'var(--dm-text-sm)' },
      { token: '--dm-timeline-col', fallback: '10rem' },
      { token: '--dm-timeline-gap', fallback: 'var(--dm-space-4)' },
      { token: '--dm-timeline-line', fallback: 'var(--dm-border-strong)' },
      { token: '--dm-timeline-line-width', fallback: '0.125rem' },
      { token: '--dm-timeline-marker', fallback: '1.375rem' },
      { token: '--dm-timeline-marker-radius', fallback: 'var(--dm-radius-full)' },
      { token: '--dm-timeline-pulse', fallback: '1.8s' },
      { token: '--dm-timeline-surface', fallback: 'var(--dm-bg)' },
      { token: '--dm-timeline-time-fg', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-timeline-title-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-timeline-title-fs', fallback: 'var(--dm-text-sm)' },
    ],
  },
  {
    component: 'Empty state',
    tokens: [
      { token: '--dm-empty-state-description-color', fallback: 'var(--dm-fg-muted)' },
      { token: '--dm-empty-state-description-max-width', fallback: '36ch' },
      { token: '--dm-empty-state-gap', fallback: 'var(--dm-space-2)' },
      { token: '--dm-empty-state-icon-bg', fallback: 'var(--dm-bg-muted)' },
      { token: '--dm-empty-state-icon-fg', fallback: 'var(--dm-fg-subtle)' },
      { token: '--dm-empty-state-icon-radius', fallback: 'var(--dm-radius-full)' },
      { token: '--dm-empty-state-icon-size', fallback: '3.5rem' },
      { token: '--dm-empty-state-padding', fallback: 'var(--dm-space-8)' },
      { token: '--dm-empty-state-title-color', fallback: 'var(--dm-fg)' },
      { token: '--dm-empty-state-title-weight', fallback: 'var(--dm-font-semibold)' },
    ],
  },
];

const OVERLAYS: TokenGroup[] = [
  {
    component: 'Tooltip',
    tokens: [
      { token: '--dm-tooltip-bg', fallback: 'var(--dm-fg)' },
      { token: '--dm-tooltip-fg', fallback: 'var(--dm-bg)' },
      { token: '--dm-tooltip-max-width', fallback: '16rem' },
      { token: '--dm-tooltip-padding', fallback: '0.375rem 0.625rem' },
      { token: '--dm-tooltip-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-tooltip-shadow', fallback: 'var(--dm-shadow-md)' },
    ],
  },
  {
    component: 'Popover',
    tokens: [
      { token: '--dm-popover-arrow-size', fallback: '0.625rem' },
      { token: '--dm-popover-bg', fallback: 'var(--dm-bg)' },
      { token: '--dm-popover-border', fallback: 'var(--dm-border)' },
      { token: '--dm-popover-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-popover-max-width', fallback: '20rem' },
      { token: '--dm-popover-padding', fallback: '1rem' },
      { token: '--dm-popover-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-popover-shadow', fallback: 'var(--dm-shadow-lg)' },
    ],
  },
  {
    component: 'Menu',
    tokens: [
      { token: '--dm-menu-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-menu-border', fallback: 'var(--dm-border)' },
      { token: '--dm-menu-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-menu-item-active-bg', fallback: 'var(--dm-default-subtle)' },
      { token: '--dm-menu-item-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-menu-item-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-menu-max-height', fallback: 'min(24rem, calc(100dvh - 2rem))' },
      { token: '--dm-menu-max-width', fallback: '20rem' },
      { token: '--dm-menu-min-width', fallback: '12rem' },
      { token: '--dm-menu-padding', fallback: 'var(--dm-space-1)' },
      { token: '--dm-menu-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-menu-shadow', fallback: 'var(--dm-shadow-lg)' },
    ],
  },
  {
    component: 'Dialog',
    tokens: [
      { token: '--dm-dialog-backdrop-bg', fallback: 'rgb(0 0 0 / 50%)' },
      { token: '--dm-dialog-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-dialog-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-dialog-padding', fallback: 'var(--dm-space-6)' },
      { token: '--dm-dialog-radius', fallback: 'var(--dm-radius-xl)' },
      { token: '--dm-dialog-width-sm', fallback: '22rem' },
      { token: '--dm-dialog-width-md', fallback: '30rem' },
      { token: '--dm-dialog-width-lg', fallback: '42rem' },
    ],
  },
  {
    component: 'Drawer',
    tokens: [
      { token: '--dm-drawer-backdrop-bg', fallback: 'rgb(0 0 0 / 50%)' },
      { token: '--dm-drawer-bg', fallback: 'var(--dm-bg)' },
      { token: '--dm-drawer-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-drawer-padding', fallback: 'var(--dm-space-6)' },
      { token: '--dm-drawer-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-drawer-size-sm', fallback: '20rem' },
      { token: '--dm-drawer-size-md', fallback: '28rem' },
      { token: '--dm-drawer-size-lg', fallback: '36rem' },
    ],
  },
  {
    component: 'Toast',
    tokens: [
      { token: '--dm-toast-bg', fallback: 'color-mix(...)' },
      { token: '--dm-toast-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-toast-gap', fallback: 'var(--dm-space-3)' },
      { token: '--dm-toast-radius', fallback: 'var(--dm-radius-lg)' },
      { token: '--dm-toast-shadow', fallback: 'var(--dm-shadow-lg)' },
      { token: '--dm-toast-width', fallback: 'min(22rem, calc(100vw - 2rem))' },
    ],
  },
  {
    component: 'Command',
    tokens: [
      { token: '--dm-command-active-bg', fallback: 'var(--dm-default-subtle)' },
      { token: '--dm-command-active-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-command-bg', fallback: 'var(--dm-bg-elevated)' },
      { token: '--dm-command-border', fallback: 'var(--dm-border)' },
      { token: '--dm-command-divider-color', fallback: 'var(--dm-border)' },
      { token: '--dm-command-fg', fallback: 'var(--dm-fg)' },
      { token: '--dm-command-footer-bg', fallback: 'var(--dm-bg-subtle)' },
      { token: '--dm-command-max-height', fallback: 'min(70dvh, calc(100dvh - 4rem))' },
      { token: '--dm-command-option-radius', fallback: 'var(--dm-radius-md)' },
      { token: '--dm-command-radius', fallback: 'var(--dm-radius-xl)' },
      { token: '--dm-command-shadow', fallback: 'var(--dm-shadow-lg)' },
      { token: '--dm-command-width', fallback: 'min(40rem, 92vw)' },
    ],
  },
];

// ---------------------------------------------------------------------------
// All categories
// ---------------------------------------------------------------------------

const TOKEN_CATEGORIES: TokenCategory[] = [
  { labelKey: 'primitives', groups: PRIMITIVES },
  { labelKey: 'layout', groups: LAYOUT },
  { labelKey: 'feedback', groups: FEEDBACK },
  { labelKey: 'buttons', groups: BUTTONS },
  { labelKey: 'forms', groups: FORMS },
  { labelKey: 'navigation', groups: NAVIGATION },
  { labelKey: 'dataDisplay', groups: DATA_DISPLAY },
  { labelKey: 'overlays', groups: OVERLAYS },
];

@Component({
  selector: 'app-component-tokens-page',
  imports: [RouterLink, DmButtonComponent, CodeSnippetComponent],
  templateUrl: './component-tokens-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentTokensPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().componentTokens);
  protected readonly categories = TOKEN_CATEGORIES;

  // ---- Code snippets --------------------------------------------------------

  protected readonly patternCode = [
    '/* Component SCSS — consumed with verbatim fallback */',
    '.dm-button {',
    '  border-radius: var(--dm-button-radius, var(--dm-radius-full));',
    '  height: var(--dm-button-height, 2.5rem);',
    '  font-weight: var(--dm-button-font-weight, var(--dm-font-medium));',
    '}',
  ].join('\n');

  protected readonly globalOverrideCode = [
    '/* Global override — every button gets sharper corners */',
    ':root {',
    '  --dm-button-radius: var(--dm-radius-sm);',
    '}',
  ].join('\n');

  protected readonly scopedOverrideCode = [
    '/* Scoped override — only this section gets compact cards */',
    '.pricing-section {',
    '  --dm-card-padding: var(--dm-space-3);',
    '  --dm-card-radius: var(--dm-radius-md);',
    '}',
  ].join('\n');

  protected readonly overlayCode = [
    '/* Override overlay tokens via panelClass */',
    "this.dialog.open(MyComponent, { panelClass: 'compact-dialog' });",
    '',
    '/* In your global styles */',
    '.compact-dialog {',
    '  --dm-dialog-padding: var(--dm-space-3);',
    '  --dm-dialog-radius: var(--dm-radius-md);',
    '}',
  ].join('\n');

  protected readonly perThemeOverrideCode = [
    '/* Override tokens for a specific theme */',
    "[data-dm-theme='midnight'] {",
    '  --dm-card-bg: #111630;',
    '  --dm-card-shadow: var(--dm-shadow-lg);',
    '  --dm-switch-track-bg: #2a2e55;',
    '  --dm-table-header-bg: #161b3a;',
    '}',
  ].join('\n');

  /** Resolve category label from translation key */
  protected categoryLabel(key: string): string {
    const cats = this.page().referenceCategories as Record<string, string>;
    return cats[key] ?? key;
  }

  /** Total token count across all categories */
  protected readonly totalTokens = TOKEN_CATEGORIES.reduce(
    (sum, cat) => sum + cat.groups.reduce((s, g) => s + g.tokens.length, 0),
    0,
  );
}
