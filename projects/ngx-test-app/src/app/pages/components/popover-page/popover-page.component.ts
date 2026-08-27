import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmButtonComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmPopoverComponent,
  DmPopoverPlacement,
  DmPopoverTriggerDirective,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

@Component({
  selector: 'app-popover-page',
  imports: [
    DmPopoverComponent,
    DmPopoverTriggerDirective,
    DmAvatarComponent,
    DmButtonComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './popover-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.popover);

  // Playground
  protected readonly playground = signal<PropValues>({
    placement: 'bottom',
    showArrow: true,
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'placement',
      label: 'placement',
      type: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
      ].map((value) => ({ label: value, value })),
    },
    { key: 'showArrow', label: 'showArrow', type: 'boolean' },
  ];

  protected readonly pgPlacement = computed(
    () => this.playground()['placement'] as DmPopoverPlacement,
  );
  protected readonly pgShowArrow = computed(() => this.playground()['showArrow'] as boolean);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgPlacement() !== 'bottom') {
      attrs.push(`placement="${this.pgPlacement()}"`);
    }
    if (!this.pgShowArrow()) {
      attrs.push('[showArrow]="false"');
    }
    const popAttrs = attrs.length ? ` ${attrs.join(' ')}` : '';
    return [
      '<dm-button [dmPopoverTrigger]="info" variant="bordered">Details</dm-button>',
      '',
      `<dm-popover #info${popAttrs} ariaLabel="Account details">`,
      '  <h3>Ada Lovelace</h3>',
      '  <p>ada@analytical.engine</p>',
      '</dm-popover>',
    ].join('\n');
  });

  // Demos
  protected readonly basicCode = [
    '<dm-button [dmPopoverTrigger]="info" variant="bordered">Details</dm-button>',
    '',
    '<dm-popover #info ariaLabel="Account details">',
    '  <h3>Ada Lovelace</h3>',
    '  <p>The first computer programmer.</p>',
    '</dm-popover>',
  ].join('\n');

  protected readonly basicTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-popover-basic',",
    '  imports: [DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective],',
    "  templateUrl: './popover-basic.component.html',",
    '})',
    'export class PopoverBasicComponent {}',
  ].join('\n');

  protected readonly placementsCode = [
    '<dm-button [dmPopoverTrigger]="pTop">top</dm-button>',
    '<dm-popover #pTop placement="top">Placed on top</dm-popover>',
    '',
    '<dm-button [dmPopoverTrigger]="pRight">right</dm-button>',
    '<dm-popover #pRight placement="right">Placed on the right</dm-popover>',
  ].join('\n');

  protected readonly placementsTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-popover-placements',",
    '  imports: [DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective],',
    "  templateUrl: './popover-placements.component.html',",
    '})',
    'export class PopoverPlacementsComponent {}',
  ].join('\n');

  protected readonly richCode = [
    '<dm-button [dmPopoverTrigger]="form" variant="bordered">Subscribe</dm-button>',
    '',
    '<dm-popover #form ariaLabel="Subscribe to the newsletter">',
    '  <dm-form-field label="Email">',
    '    <input dmInput type="email" placeholder="you@example.com" />',
    '  </dm-form-field>',
    '  <dm-button size="sm">Subscribe</dm-button>',
    '</dm-popover>',
  ].join('\n');

  protected readonly richTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmButtonComponent,',
    '  DmFormFieldComponent,',
    '  DmInputDirective,',
    '  DmPopoverComponent,',
    '  DmPopoverTriggerDirective,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-popover-form',",
    '  imports: [',
    '    DmButtonComponent,',
    '    DmFormFieldComponent,',
    '    DmInputDirective,',
    '    DmPopoverComponent,',
    '    DmPopoverTriggerDirective,',
    '  ],',
    "  templateUrl: './popover-form.component.html',",
    '})',
    'export class PopoverFormComponent {}',
  ].join('\n');

  protected readonly trapFocusCode = [
    '<dm-button [dmPopoverTrigger]="menu" variant="bordered">Actions</dm-button>',
    '',
    '<dm-popover #menu [trapFocus]="true" ariaLabel="Row actions">',
    '  <dm-button variant="light" size="sm">Edit</dm-button>',
    '  <dm-button variant="light" size="sm">Duplicate</dm-button>',
    '  <dm-button variant="light" size="sm" color="danger">Delete</dm-button>',
    '</dm-popover>',
  ].join('\n');

  protected readonly trapFocusTs = [
    "import { Component } from '@angular/core';",
    "import { DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-popover-actions',",
    '  imports: [DmButtonComponent, DmPopoverComponent, DmPopoverTriggerDirective],',
    "  templateUrl: './popover-actions.component.html',",
    '})',
    'export class PopoverActionsComponent {}',
  ].join('\n');

  // Composition: user hover-card
  protected readonly following = signal(false);

  protected toggleFollow(): void {
    this.following.update((value) => !value);
  }

  protected readonly compositionCode = [
    '<p>',
    '  Reviewed and approved by',
    '  <button type="button" [dmPopoverTrigger]="userCard" class="mention">',
    '    <dm-avatar initials="AL" size="1.25rem" alt="" />',
    '    @ada',
    '  </button>',
    '  · 2 hours ago',
    '</p>',
    '',
    '<dm-popover #userCard placement="bottom-start" ariaLabel="Ada Lovelace">',
    '  <div style="display: grid; gap: 0.75rem; width: 17rem">',
    '    <div style="display: flex; justify-content: space-between; gap: 0.75rem">',
    '      <dm-avatar initials="AL" size="lg" alt="Ada Lovelace" />',
    '      <dm-button',
    '        size="sm"',
    `        [color]="following() ? 'default' : 'primary'"`,
    `        [variant]="following() ? 'bordered' : 'solid'"`,
    '        (clicked)="toggleFollow()"',
    '      >',
    "        {{ following() ? 'Following' : 'Follow' }}",
    '      </dm-button>',
    '    </div>',
    '    <div>',
    '      <strong>Ada Lovelace</strong>',
    '      <span style="color: var(--dm-fg-muted)">@ada</span>',
    '    </div>',
    '    <p>Mathematician. Wrote the first algorithm meant to run on a machine.</p>',
    '    <p style="color: var(--dm-fg-muted)">',
    '      <strong>1,204</strong> followers · <strong>86</strong> following',
    '    </p>',
    '  </div>',
    '</dm-popover>',
  ].join('\n');

  protected readonly compositionTs = [
    'readonly following = signal(false);',
    '',
    'toggleFollow(): void {',
    '  this.following.update((value) => !value);',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { providePopoverDefaults } from '@dmaster/ui';",
    '',
    "providers: [providePopoverDefaults({ placement: 'top', showArrow: false })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'placement',
        type: "'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'",
        default: "'bottom'",
        description: api['placement'],
      },
      { name: 'showArrow', type: 'boolean', default: 'true', description: api['showArrow'] },
      { name: 'offset', type: 'number', default: '8', description: api['offset'] },
      { name: 'trapFocus', type: 'boolean', default: 'false', description: api['trapFocus'] },
      { name: 'ariaLabel', type: 'string', default: '—', description: api['ariaLabel'] },
      { name: 'opened', type: 'output<void>', default: '—', description: api['opened'] },
      { name: 'closed', type: 'output<void>', default: '—', description: api['closed'] },
      {
        name: 'dmPopoverTrigger',
        type: 'DmPopoverComponent',
        default: '—',
        description: api['dmPopoverTrigger'],
      },
    ];
  });
}
