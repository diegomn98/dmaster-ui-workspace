import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DmAvatarComponent, DmAvatarShape } from 'ngx-dmaster-ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const DEMO_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#6366f1"/><circle cx="24" cy="18" r="8" fill="#fff" opacity="0.92"/><path d="M8 46c0-9 7-15 16-15s16 6 16 15" fill="#fff" opacity="0.92"/></svg>`;

@Component({
  selector: 'app-avatar-page',
  imports: [
    DmAvatarComponent,
    DemoBlockComponent,
    ApiTableComponent,
    CodeSnippetComponent,
    PropSignalComponent,
  ],
  templateUrl: './avatar-page.component.html',
  host: { class: 'docs-page' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPageComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly page = computed(() => this.i18n.t().pages.avatar);

  /** Imagen de demo autocontenida (data URI): sin dependencias de red. */
  protected readonly demoSrc = `data:image/svg+xml;utf8,${encodeURIComponent(DEMO_AVATAR_SVG)}`;

  protected readonly playground = signal<PropValues>({
    initials: 'DM',
    withImage: false,
    size: 'md',
    shape: 'circle',
  });

  protected readonly controls: PropControl[] = [
    { key: 'initials', label: 'initials', type: 'text', placeholder: 'DM' },
    { key: 'withImage', label: 'src', type: 'boolean' },
    {
      key: 'size',
      label: 'size',
      type: 'select',
      options: ['sm', 'md', 'lg'].map((value) => ({ label: value, value })),
    },
    {
      key: 'shape',
      label: 'shape',
      type: 'select',
      options: ['circle', 'square'].map((value) => ({ label: value, value })),
    },
  ];

  protected readonly pgInitials = computed(() => (this.playground()['initials'] as string) || '');
  protected readonly pgSrc = computed(() =>
    this.playground()['withImage'] === true ? this.demoSrc : null,
  );
  protected readonly pgSize = computed(() => this.playground()['size'] as string);
  protected readonly pgShape = computed(() => this.playground()['shape'] as DmAvatarShape);

  protected readonly playgroundCode = computed(() => {
    const attrs: string[] = [];
    if (this.pgSrc()) {
      attrs.push('src="/u/diego.png"');
    }
    if (this.pgInitials()) {
      attrs.push(`initials="${this.pgInitials()}"`);
    }
    if (this.pgSize() !== 'md') {
      attrs.push(`size="${this.pgSize()}"`);
    }
    if (this.pgShape() !== 'circle') {
      attrs.push(`shape="${this.pgShape()}"`);
    }
    return attrs.length > 0 ? `<dm-avatar ${attrs.join(' ')} />` : '<dm-avatar />';
  });

  protected readonly sizesCode = [
    '<dm-avatar initials="DM" size="sm" />',
    '<dm-avatar initials="DM" size="md" />',
    '<dm-avatar initials="DM" size="lg" />',
    '<dm-avatar initials="DM" [size]="64" />',
  ].join('\n');

  protected readonly fallbackCode = [
    '<!-- imagen → iniciales → icono -->',
    '<dm-avatar [src]="photoUrl" alt="Diego Maestro" initials="DM" />',
    '<dm-avatar initials="DM" alt="Diego Maestro" />',
    '<dm-avatar />',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideAvatarDefaults } from 'ngx-dmaster-ui';",
    '',
    "providers: [provideAvatarDefaults({ shape: 'square' })]",
  ].join('\n');

  protected readonly apiRows = computed<ApiTableRow[]>(() => {
    const api = this.page().api;
    return [
      { name: 'src', type: 'string | null', default: 'null', description: api['src'] },
      { name: 'alt', type: 'string', default: "''", description: api['alt'] },
      { name: 'initials', type: 'string', default: "''", description: api['initials'] },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | number | string",
        default: "'md'",
        description: api['size'],
      },
      {
        name: 'shape',
        type: "'circle' | 'square'",
        default: "'circle'",
        description: api['shape'],
      },
    ];
  });
}
