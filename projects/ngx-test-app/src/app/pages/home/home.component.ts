import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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
  DmSkeletonComponent,
  DmSpinnerComponent,
  DmSwitchComponent,
} from '@dmaster/ui';

import { LocaleService } from '../../core/i18n/locale.service';
import { CodeSnippetComponent } from '../../shared/code-snippet/code-snippet.component';

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
    DmSkeletonComponent,
    DmSpinnerComponent,
    DmSwitchComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  protected readonly i18n = inject(LocaleService);
  protected readonly installCode = 'npm install @dmaster/ui @angular/cdk';

  // Preview panel state (dogfooding — the hero really uses the components).
  protected readonly darkMode = signal(false);
  protected readonly autoSave = signal(true);
  protected readonly notify = signal(true);
  protected readonly emailValue = signal('');
}
