import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  DmAvatarComponent,
  DmBadgeComponent,
  DmButtonComponent,
  DmCardComponent,
  DmCheckboxComponent,
  DmFormFieldComponent,
  DmInputDirective,
  DmRadioComponent,
  DmRadioGroupComponent,
  DmSelectComponent,
  DmSelectItem,
  DmSkeletonComponent,
  DmSwitchComponent,
  DmTabComponent,
  DmTabPanelComponent,
  DmTabsComponent,
  ThemeService,
} from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { DashboardLocale } from '../../core/i18n/translations.types';
import { PALETTE_PRESETS } from '../../core/palette/palette';
import { PaletteService } from '../../core/palette/palette.service';
import { PalettePickerComponent } from '../../layout/palette-picker/palette-picker.component';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    RouterLink,
    DmAvatarComponent,
    DmBadgeComponent,
    DmButtonComponent,
    DmCardComponent,
    DmCheckboxComponent,
    DmFormFieldComponent,
    DmInputDirective,
    DmRadioComponent,
    DmRadioGroupComponent,
    DmSelectComponent,
    DmSkeletonComponent,
    DmSwitchComponent,
    DmTabComponent,
    DmTabPanelComponent,
    DmTabsComponent,
    PalettePickerComponent,
    CodeSnippetComponent,
    RevealDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly palette = inject(PaletteService);
  protected readonly theme = inject(ThemeService);

  protected readonly installCode = 'npm install @dmaster/ui @angular/cdk';
  protected readonly presets = PALETTE_PRESETS;

  // Top bar de la landing (la home vive fuera del shell de docs).
  protected readonly locales: DmSelectItem<DashboardLocale>[] = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
  ];

  protected onLocaleChange(locale: DashboardLocale | null): void {
    if (locale) {
      this.i18n.setLocale(locale);
    }
  }

  // Preview panel state (dogfooding — the hero really uses the components).
  protected readonly darkMode = signal(false);
  protected readonly autoSave = signal(true);
  protected readonly notify = signal(true);
  protected readonly emailValue = signal('');

  // Gallery tile state (inert previews still render live values).
  protected readonly galleryTab = signal('overview');
  protected readonly galleryRadio = signal('pro');
  protected readonly gallerySelectValue = signal('design');
  protected readonly gallerySelectItems: DmSelectItem<string>[] = [
    { value: 'design', label: 'Design' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
  ];

  // Live code showcase — la pestaña activa manda tanto el preview vivo como el
  // código mostrado (dogfooding de dm-tabs). Estado de los controles del demo.
  protected readonly activeDemo = signal<'profile' | 'pricing' | 'settings'>('profile');
  protected readonly demoPush = signal(true);
  protected readonly demoDigest = signal(false);
  protected readonly demoMarketing = signal(true);

  private readonly demoCodeMap: Record<'profile' | 'pricing' | 'settings', string> = {
    profile: `<dm-card appearance="outlined" padding="lg">
  <header class="profile">
    <dm-avatar initials="AL" size="lg" color="primary" />
    <div>
      <h3>Ada Lovelace</h3>
      <p>Lead Engineer · Analytics</p>
    </div>
    <dm-badge color="success" variant="dot">Online</dm-badge>
  </header>

  <dl class="stats">
    <div><dt>128</dt><dd>Projects</dd></div>
    <div><dt>2.4k</dt><dd>Followers</dd></div>
    <div><dt>312</dt><dd>Following</dd></div>
  </dl>

  <footer class="actions">
    <dm-button color="primary" variant="shadow">Follow</dm-button>
    <dm-button color="default" variant="bordered">Message</dm-button>
  </footer>
</dm-card>`,
    pricing: `<dm-card appearance="outlined" padding="lg">
  <dm-badge color="primary" variant="flat">Most popular</dm-badge>

  <p class="price"><strong>$29</strong> / month</p>

  <ul class="features">
    <li>Unlimited projects</li>
    <li>Advanced analytics</li>
    <li>Priority support</li>
  </ul>

  <dm-button color="primary" variant="shadow" size="lg">
    Upgrade to Pro
  </dm-button>
</dm-card>`,
    settings: `<dm-card appearance="outlined" padding="lg">
  <header class="head">
    <h3>Notifications</h3>
    <dm-button color="primary" variant="flat" size="sm">Save</dm-button>
  </header>

  <div class="row">
    <div>
      <p>Push notifications</p>
      <span>Get notified on this device</span>
    </div>
    <dm-switch color="primary" [(ngModel)]="push" />
  </div>

  <div class="row">
    <div>
      <p>Weekly digest</p>
      <span>A summary every Monday</span>
    </div>
    <dm-switch color="success" [(ngModel)]="digest" />
  </div>

  <dm-checkbox color="primary" [(ngModel)]="marketing">
    Send me product updates
  </dm-checkbox>
</dm-card>`,
  };

  protected readonly demoCode = computed(() => this.demoCodeMap[this.activeDemo()]);

  // "Copy install command" feedback in the hero.
  protected readonly copied = signal(false);
  private copyTimer: ReturnType<typeof setTimeout> | undefined;

  protected copyInstall(): void {
    navigator.clipboard?.writeText(this.installCode).then(() => {
      this.copied.set(true);
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copied.set(false), 2000);
    });
  }

  protected readonly activePreset = computed(
    () => this.presets.find((p) => p.key === this.palette.current()) ?? this.presets[0],
  );

  protected readonly presetInitial = computed(() => this.activePreset().label.charAt(0));
}
