import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  DmAvatarComponent,
  DmAvatarShape,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../../core/i18n/locale.service';
import { ApiTableComponent } from '../../../shared/api-table/api-table.component';
import { ApiTableRow } from '../../../shared/api-table/api-table.types';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DemoBlockComponent } from '../../../shared/demo-block/demo-block.component';
import { PropSignalComponent } from '../../../shared/prop-signal/prop-signal.component';
import { PropControl, PropValues } from '../../../shared/prop-signal/prop-signal.types';

const DEMO_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#6366f1"/><circle cx="24" cy="18" r="8" fill="#fff" opacity="0.92"/><path d="M8 46c0-9 7-15 16-15s16 6 16 15" fill="#fff" opacity="0.92"/></svg>`;

/** Self-contained colored avatar (data URI) — initials on a flat fill. */
function avatarSvg(initials: string, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${color}"/><text x="24" y="30" font-family="system-ui, sans-serif" font-size="19" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface DemoUser {
  name: string;
  initials: string;
  color: string;
  src: string;
}

@Component({
  selector: 'app-avatar-page',
  imports: [
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
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

  /** Equipo de demo para el grupo apilado y la user-card. */
  protected readonly team: DemoUser[] = [
    { name: 'Ada Lovelace', initials: 'AL', color: '#6366f1' },
    { name: 'Grace Hopper', initials: 'GH', color: '#0ea5e9' },
    { name: 'Alan Turing', initials: 'AT', color: '#10b981' },
    { name: 'Katherine Johnson', initials: 'KJ', color: '#f59e0b' },
  ].map((u) => ({ ...u, src: avatarSvg(u.initials, u.color) }));

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

  protected readonly sizesTs = [
    "import { Component } from '@angular/core';",
    "import { DmAvatarComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-avatar-sizes',",
    '  imports: [DmAvatarComponent],',
    "  templateUrl: './avatar-sizes.component.html',",
    '})',
    'export class AvatarSizesComponent {}',
  ].join('\n');

  protected readonly shapesCode = [
    '<dm-avatar [src]="photo" alt="Ada Lovelace" shape="circle" size="lg" />',
    '<dm-avatar [src]="photo" alt="Ada Lovelace" shape="square" size="lg" />',
    '<dm-avatar initials="AL" shape="square" />',
  ].join('\n');

  protected readonly shapesTs = [
    "import { Component } from '@angular/core';",
    "import { DmAvatarComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-avatar-shapes',",
    '  imports: [DmAvatarComponent],',
    "  templateUrl: './avatar-shapes.component.html',",
    '})',
    'export class AvatarShapesComponent {',
    "  protected readonly photo = '/u/ada.png';",
    '}',
  ].join('\n');

  protected readonly fallbackCode = [
    '<!-- image → initials → generic icon -->',
    '<dm-avatar [src]="photoUrl" alt="Diego Maestro" initials="DM" />',
    '<dm-avatar initials="DM" alt="Diego Maestro" />',
    '<dm-avatar />',
  ].join('\n');

  protected readonly fallbackTs = [
    "import { Component } from '@angular/core';",
    "import { DmAvatarComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-avatar-fallback',",
    '  imports: [DmAvatarComponent],',
    "  templateUrl: './avatar-fallback.component.html',",
    '})',
    'export class AvatarFallbackComponent {',
    "  protected readonly photoUrl = '/u/diego.png';",
    '}',
  ].join('\n');

  protected readonly groupCode = [
    '<!-- Overlap avatars with a ring in the surface color, then cap -->',
    '<!-- the list with a "+N" counter. -->',
    '<div class="avatar-stack">',
    '  @for (u of team; track u.name) {',
    '    <dm-avatar [src]="u.src" [alt]="u.name" />',
    '  }',
    '  <span class="avatar-stack__more">+3</span>',
    '</div>',
    '',
    '/* .avatar-stack > * { margin-left: -0.6rem; */',
    '/*   box-shadow: 0 0 0 3px var(--dm-bg-elevated); border-radius: 50% } */',
  ].join('\n');

  protected readonly groupTs = [
    "import { Component } from '@angular/core';",
    "import { DmAvatarComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-avatar-group',",
    '  imports: [DmAvatarComponent],',
    "  templateUrl: './avatar-group.component.html',",
    '})',
    'export class AvatarGroupComponent {',
    '  protected readonly team = [',
    "    { name: 'Ada Lovelace', src: '/u/ada.png' },",
    "    { name: 'Grace Hopper', src: '/u/grace.png' },",
    "    { name: 'Alan Turing', src: '/u/alan.png' },",
    "    { name: 'Katherine Johnson', src: '/u/katherine.png' },",
    '  ];',
    '}',
  ].join('\n');

  protected readonly statusCode = [
    '<!-- Wrap the avatar and pin a status dot to a corner. -->',
    '<span style="position: relative; display: inline-flex">',
    '  <dm-avatar [src]="photo" alt="Ada — online" size="lg" />',
    '  <span class="status-dot" style="background: var(--dm-success)"></span>',
    '</span>',
  ].join('\n');

  protected readonly statusTs = [
    "import { Component } from '@angular/core';",
    "import { DmAvatarComponent } from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-avatar-status',",
    '  imports: [DmAvatarComponent],',
    "  templateUrl: './avatar-status.component.html',",
    '})',
    'export class AvatarStatusComponent {',
    "  protected readonly photo = '/u/ada.png';",
    '}',
  ].join('\n');

  protected readonly compositionCode = [
    '<!-- A member row: avatar + identity + role badge + action. -->',
    '<dm-card style="max-width: 24rem">',
    '  <div style="display: flex; align-items: center; gap: 1rem">',
    '    <dm-avatar [src]="user.src" [alt]="user.name" size="lg" />',
    '    <div style="flex: 1; min-width: 0">',
    '      <div style="display: flex; align-items: center; gap: 0.5rem">',
    '        <strong>{{ user.name }}</strong>',
    '        <dm-badge color="primary" variant="flat" size="sm">Owner</dm-badge>',
    '      </div>',
    '      <p class="muted">ada@dmaster.io</p>',
    '    </div>',
    '    <dm-button size="sm" variant="bordered">Follow</dm-button>',
    '  </div>',
    '</dm-card>',
  ].join('\n');

  protected readonly compositionTs = [
    "import { Component } from '@angular/core';",
    'import {',
    '  DmAvatarComponent,',
    '  DmBadgeComponent,',
    '  DmButtonComponent,',
    '  DmCardComponent,',
    "} from '@dmaster/ui';",
    '',
    '@Component({',
    "  selector: 'app-member-card',",
    '  imports: [DmAvatarComponent, DmBadgeComponent, DmButtonComponent, DmCardComponent],',
    "  templateUrl: './member-card.component.html',",
    '})',
    'export class MemberCardComponent {',
    '  protected readonly user = {',
    "    name: 'Ada Lovelace',",
    "    email: 'ada@dmaster.io',",
    "    src: '/u/ada.png',",
    '  };',
    '}',
  ].join('\n');

  protected readonly defaultsCode = [
    "import { provideAvatarDefaults } from '@dmaster/ui';",
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
      {
        name: 'color',
        type: "'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
        default: "'primary'",
        description: api['color'],
      },
    ];
  });
}
