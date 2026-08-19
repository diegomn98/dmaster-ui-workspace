import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideDmasterIcons, provideDmasterUI } from '@dmaster/ui';
import { DM_ICONS } from '@dmaster/ui/icons';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // The library never depends on zone.js — this app runs fully zoneless.
    provideZonelessChangeDetection(),
    // Theming, density and reduced-motion config (ThemeService, etc.).
    provideDmasterUI({ theme: 'light' }),
    // Register the curated SVG icon set so `<dm-icon name="…">` resolves.
    provideDmasterIcons(DM_ICONS),
  ],
}).catch((err) => console.error(err));
