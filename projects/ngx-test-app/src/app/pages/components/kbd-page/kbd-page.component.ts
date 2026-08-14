import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmKbdComponent, DmKbdKey, DmKbdSize } from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const MODIFIERS: (DmKbdKey | 'none')[] = ['none', 'command', 'shift', 'ctrl', 'option', 'alt'];

@Component({
  selector: 'app-kbd-page',
  imports: [
    DmKbdComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './kbd-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.kbd);

  // Named-key array references for the combo demos (avoids template literals).
  protected readonly comboPalette: DmKbdKey[] = ['shift', 'command'];

  // Playground
  protected readonly playground = signal<PropValues>({
    modifier: 'command',
    letter: 'K',
    size: 'md',
  });

  protected readonly controls: PropControl[] = [
    {
      key: 'modifier',
      label: 'modifier',
      type: 'select',
      options: MODIFIERS.map((value) => ({ label: value, value })),
    },
    { key: 'letter', label: 'letter', type: 'text', placeholder: 'K' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgModifier = computed(
    () => this.playground()['modifier'] as DmKbdKey | 'none',
  );
  protected readonly pgLetter = computed(() => (this.playground()['letter'] as string) ?? '');
  protected readonly pgSize = computed(() => this.playground()['size'] as DmKbdSize);
  protected readonly pgKeys = computed<DmKbdKey | undefined>(() => {
    const modifier = this.pgModifier();
    return modifier === 'none' ? undefined : modifier;
  });

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgModifier() !== 'none') {
      attrs.push(`keys="${this.pgModifier()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    const open = attrs.length > 0 ? `<dm-kbd ${attrs.join(' ')}>` : '<dm-kbd>';
    return `${open}${this.pgLetter()}</dm-kbd>`;
  });

  // Demos
  protected readonly singleCode = [
    '<dm-kbd keys="command"></dm-kbd>',
    '<dm-kbd keys="shift"></dm-kbd>',
    '<dm-kbd keys="escape"></dm-kbd>',
    '<dm-kbd keys="enter"></dm-kbd>',
    '<dm-kbd keys="backspace"></dm-kbd>',
  ].join('\n');

  protected readonly combosCode = [
    '<dm-kbd keys="command">K</dm-kbd>',
    "<dm-kbd [keys]=\"['shift', 'command']\">P</dm-kbd>",
    '<dm-kbd keys="ctrl">C</dm-kbd>',
  ].join('\n');

  protected readonly lettersCode = [
    '<dm-kbd>Ctrl</dm-kbd>',
    '<dm-kbd>Enter</dm-kbd>',
    '<dm-kbd>A</dm-kbd>',
  ].join('\n');

  protected readonly sizesCode = [
    '<dm-kbd keys="command" size="sm">K</dm-kbd>',
    '<dm-kbd keys="command" size="md">K</dm-kbd>',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideKbdDefaults } from '@dmaster/ui';",
    '',
    "providers: [provideKbdDefaults({ size: 'sm' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      {
        name: 'keys',
        type: 'DmKbdKey | DmKbdKey[] | undefined',
        default: 'undefined',
        description: api['keys'],
      },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: api['size'] },
    ];
  });
}
