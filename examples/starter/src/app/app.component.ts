import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmErrorComponent,
  DmFormFieldComponent,
  DmIconComponent,
  DmInputDirective,
  DmSelectComponent,
  DmSelectItem,
  ThemeService,
} from '@dmaster/ui';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Colored initials avatar as a self-contained data URI (no network). */
function avatarSvg(initials: string): string {
  const palette = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
  const color = palette[initials.charCodeAt(0) % palette.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
    `<rect width="48" height="48" fill="${color}"/>` +
    `<text x="24" y="30" font-family="system-ui, sans-serif" font-size="19" ` +
    `font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface Member {
  name: string;
  email: string;
  role: string;
  src: string;
}

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    DmCardComponent,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmErrorComponent,
    DmSelectComponent,
    DmIconComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly roles: DmSelectItem<string>[] = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(EMAIL_PATTERN)],
    }),
    role: new FormControl<string | null>(null, { validators: [Validators.required] }),
  });

  protected readonly state = signal<'idle' | 'loading' | 'success'>('idle');

  protected readonly team = signal<Member[]>([
    {
      name: 'Ada Lovelace',
      email: 'ada@dmaster.io',
      role: 'Owner',
      src: avatarSvg('AL'),
    },
  ]);

  protected roleLabel(value: string | null): string {
    return this.roles.find((r) => r.value === value)?.label ?? '';
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  protected submit(): void {
    if (this.form.invalid || this.state() === 'loading') {
      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading');
    const { name, email, role } = this.form.getRawValue();

    // Simulate a network round-trip; the button shows a spinner meanwhile.
    setTimeout(() => {
      this.team.update((members) => [
        ...members,
        { name, email, role: this.roleLabel(role), src: avatarSvg(this.initials(name)) },
      ]);
      this.state.set('success');
      this.form.reset({ name: '', email: '', role: null });

      setTimeout(() => this.state.set('idle'), 1400);
    }, 900);
  }
}
