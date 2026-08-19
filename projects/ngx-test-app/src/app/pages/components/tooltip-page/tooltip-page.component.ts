import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmDividerComponent,
  DmIconComponent,
  DmTooltipDirective,
  DmTooltipPosition,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-tooltip-page',
  imports: [
    DmTooltipDirective,
    DmButtonComponent,
    DmIconComponent,
    DmBadgeComponent,
    DmAvatarComponent,
    DmCardComponent,
    DmDividerComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './tooltip-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.tooltip);

  protected readonly playground = signal<PropValues>({
    text: 'Copy to clipboard',
    position: 'top',
  });

  protected readonly controls: PropControl[] = [
    { key: 'text', label: 'dmTooltip', type: 'text', placeholder: 'Copy to clipboard' },
    {
      key: 'position',
      label: 'dmTooltipPosition',
      type: 'select',
      options: ['top', 'bottom', 'left', 'right'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgText = computed(
    () => (this.playground()['text'] as string) || 'Copy to clipboard',
  );
  protected readonly pgPosition = computed(
    () => this.playground()['position'] as DmTooltipPosition,
  );

  protected readonly playgroundCode = computed(() => {
    const position = this.pgPosition() !== 'top' ? ` dmTooltipPosition="${this.pgPosition()}"` : '';
    return `<button dmTooltip="${this.pgText()}"${position}>…</button>`;
  });

  /** Conditional demo: the tooltip text follows (and disables with) app state. */
  protected readonly favorite = signal(false);

  protected readonly basicCode = [
    '<!-- Any element works: buttons, links, plain elements. Hover shows it',
    '     after a short delay; keyboard focus shows it immediately. -->',
    '<dm-button dmTooltip="Save your changes (⌘S)">Save</dm-button>',
    '<dm-button variant="bordered" dmTooltip="Discard all edits since last save">',
    '  Discard',
    '</dm-button>',
    '<a href="/docs" dmTooltip="Opens the docs in a new tab">Documentation</a>',
  ].join('\n');

  protected readonly positionsCode = [
    '<button dmTooltip="Top">top</button>',
    '<button dmTooltip="Bottom" dmTooltipPosition="bottom">bottom</button>',
    '<button dmTooltip="Left" dmTooltipPosition="left">left</button>',
    '<button dmTooltip="Right" dmTooltipPosition="right">right</button>',
  ].join('\n');

  protected readonly iconButtonsCode = [
    '<!-- The canonical use: an icon-only button has no visible text, so the',
    '     tooltip names the action for sighted users while the icon label',
    '     (aria-label) names it for assistive tech. Keep both in sync. -->',
    '<dm-button variant="ghost" dmTooltip="Edit">',
    '  <dm-icon name="edit" label="Edit" />',
    '</dm-button>',
    '<dm-button variant="ghost" dmTooltip="Copy link">',
    '  <dm-icon name="copy" label="Copy link" />',
    '</dm-button>',
    '<dm-button variant="ghost" dmTooltip="Download">',
    '  <dm-icon name="download" label="Download" />',
    '</dm-button>',
    '<dm-button variant="ghost" dmTooltip="Add to favorites">',
    '  <dm-icon name="star" label="Add to favorites" />',
    '</dm-button>',
    '<dm-button color="danger" variant="flat" dmTooltip="Delete permanently">',
    '  <dm-icon name="trash" label="Delete permanently" />',
    '</dm-button>',
  ].join('\n');

  protected readonly conditionalCode = [
    '<!-- Bind the text to state: it updates live, and an empty string',
    '     switches the tooltip off entirely (nothing renders, no aria-describedby). -->',
    '<dm-button',
    '  variant="ghost"',
    "  [dmTooltip]=\"favorite() ? 'Remove from favorites' : 'Add to favorites'\"",
    '>',
    '  <dm-icon name="star" [fill]="favorite()" [color]="favorite() ? \'warning\' : \'\'" />',
    '</dm-button>',
    '',
    '<!-- Disabled action → no tooltip (empty text) -->',
    '<dm-button',
    '  variant="ghost"',
    "  [dmTooltip]=\"favorite() ? 'Share this item' : ''\"",
    '  [disabled]="!favorite()"',
    '>',
    '  <dm-icon name="external-link" label="Share this item" />',
    '</dm-button>',
  ].join('\n');

  protected readonly conditionalTs = [
    "import { Component, signal } from '@angular/core';",
    "import { DmButtonComponent, DmIconComponent, DmTooltipDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-favorite-toggle',",
    '  imports: [DmButtonComponent, DmIconComponent, DmTooltipDirective],',
    "  templateUrl: './favorite-toggle.component.html',",
    '})',
    'export class FavoriteToggleComponent {',
    '  protected readonly favorite = signal(false);',
    '',
    '  toggle(): void {',
    '    this.favorite.update((value) => !value);',
    '  }',
    '}',
  ].join('\n');

  protected readonly onContentCode = [
    '<!-- Non-interactive hosts (text, badges, avatars) need tabindex="0" so',
    '     keyboard users can reach the tooltip too. -->',
    '',
    '<!-- Truncated text: the tooltip reveals the full value -->',
    '<span',
    '  tabindex="0"',
    '  dmTooltip="quarterly-financial-report-2026-final-v3.pdf"',
    '  style="display: inline-block; max-width: 11rem; overflow: hidden;',
    '         text-overflow: ellipsis; white-space: nowrap"',
    '>',
    '  quarterly-financial-report-2026-final-v3.pdf',
    '</span>',
    '',
    '<!-- Status badges: the tooltip explains the state -->',
    '<dm-badge color="success" variant="flat" tabindex="0" dmTooltip="Deployed 4 minutes ago">',
    '  Live',
    '</dm-badge>',
    '<dm-badge color="warning" variant="dot" tabindex="0" dmTooltip="3 checks still running">',
    '  Pending',
    '</dm-badge>',
    '',
    '<!-- Avatar stack: the tooltip names each person -->',
    '<dm-avatar initials="DM" size="sm" tabindex="0" dmTooltip="Diego Maestro — owner" />',
    '<dm-avatar initials="AL" size="sm" tabindex="0" dmTooltip="Ana López — reviewer" />',
    '<dm-avatar initials="+3" size="sm" tabindex="0" dmTooltip="Marc, Sofía and Iris" />',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- An editor toolbar: a row of icon-only ghost buttons, each named by',
    '     its tooltip (with the shortcut), grouped by vertical dividers. -->',
    '<dm-card style="width: 100%; max-width: 32rem">',
    '  <div class="toolbar">',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Bold (⌘B)">',
    '      <dm-icon name="edit" label="Bold" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Code block">',
    '      <dm-icon name="code" label="Code block" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Insert link (⌘K)">',
    '      <dm-icon name="external-link" label="Insert link" />',
    '    </dm-button>',
    '',
    '    <dm-divider orientation="vertical" style="height: 1.25rem; margin-inline: 0.375rem" />',
    '',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Copy as Markdown">',
    '      <dm-icon name="clipboard" label="Copy as Markdown" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Upload image">',
    '      <dm-icon name="upload" label="Upload image" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Insert emoji">',
    '      <dm-icon name="sparkles" label="Insert emoji" />',
    '    </dm-button>',
    '',
    '    <dm-divider orientation="vertical" style="height: 1.25rem; margin-inline: 0.375rem" />',
    '',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Undo (⌘Z)">',
    '      <dm-icon name="arrow-left" label="Undo" />',
    '    </dm-button>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="Redo (⇧⌘Z)">',
    '      <dm-icon name="arrow-right" label="Redo" />',
    '    </dm-button>',
    '',
    '    <span style="flex: 1"></span>',
    '    <dm-button variant="ghost" size="sm" dmTooltip="More actions" dmTooltipPosition="left">',
    '      <dm-icon name="more-horizontal" label="More actions" />',
    '    </dm-button>',
    '  </div>',
    '',
    '  <p class="doc-title">Release notes — v0.5</p>',
    '  <p class="doc-body">Tooltips name every icon-only control in the toolbar…</p>',
    '',
    '  <div class="doc-footer">',
    '    <dm-badge variant="flat" size="sm" tabindex="0" dmTooltip="Autosaved 12 seconds ago">',
    '      Saved',
    '    </dm-badge>',
    '    <dm-button color="primary" size="sm" dmTooltip="Publish to everyone (⌘⏎)">',
    '      <dm-icon name="check" size="1.15em" /> Publish',
    '    </dm-button>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    '  DmDividerComponent,',
    '  DmIconComponent,',
    '  DmTooltipDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-editor-toolbar',",
    '  imports: [',
    '    DmBadgeComponent,',
    '    DmButtonComponent,',
    '    DmCardComponent,',
    '    DmDividerComponent,',
    '    DmIconComponent,',
    '    DmTooltipDirective,',
    '  ],',
    "  templateUrl: './editor-toolbar.component.html',",
    '  styles: `',
    '    .toolbar {',
    '      display: flex;',
    '      align-items: center;',
    '      flex-wrap: wrap;',
    '      gap: 0.125rem;',
    '      padding: 0.25rem;',
    '      border-radius: var(--dm-radius-md);',
    '      background: var(--dm-bg-muted);',
    '    }',
    '    .doc-footer {',
    '      display: flex;',
    '      justify-content: space-between;',
    '      align-items: center;',
    '      margin-top: 1rem;',
    '    }',
    '  `,',
    '})',
    'export class EditorToolbarComponent {}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideTooltipDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideTooltipDefaults({ position: 'bottom', showDelay: 150 })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'dmTooltip', type: 'string', description: api['dmTooltip'] },
      {
        name: 'dmTooltipPosition',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
        description: api['dmTooltipPosition'],
      },
      { name: 'showDelay', type: 'number', default: '300', description: api['showDelay'] },
      { name: 'hideDelay', type: 'number', default: '100', description: api['hideDelay'] },
    ];
  });
}
