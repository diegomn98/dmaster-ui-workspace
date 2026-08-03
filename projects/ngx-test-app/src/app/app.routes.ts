import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'ngx-dmaster-ui · Modern Angular components',
  },
  {
    path: 'components',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/overview/overview-page.component').then((m) => m.OverviewPageComponent),
    title: 'Components · ngx-dmaster-ui',
  },
  {
    path: 'components/skeleton',
    loadComponent: () =>
      import('./pages/components/skeleton-page/skeleton-page.component').then(
        (m) => m.SkeletonPageComponent,
      ),
    title: 'Skeleton · ngx-dmaster-ui',
  },
  {
    path: 'components/loading-button',
    loadComponent: () =>
      import('./pages/components/loading-button-page/loading-button-page.component').then(
        (m) => m.LoadingButtonPageComponent,
      ),
    title: 'Loading Button · ngx-dmaster-ui',
  },
  {
    path: 'components/spinner',
    loadComponent: () =>
      import('./pages/components/spinner-page/spinner-page.component').then(
        (m) => m.SpinnerPageComponent,
      ),
    title: 'Spinner · ngx-dmaster-ui',
  },
  {
    path: 'components/badge',
    loadComponent: () =>
      import('./pages/components/badge-page/badge-page.component').then(
        (m) => m.BadgePageComponent,
      ),
    title: 'Badge · ngx-dmaster-ui',
  },
  {
    path: 'components/card',
    loadComponent: () =>
      import('./pages/components/card-page/card-page.component').then((m) => m.CardPageComponent),
    title: 'Card · ngx-dmaster-ui',
  },
  {
    path: 'components/avatar',
    loadComponent: () =>
      import('./pages/components/avatar-page/avatar-page.component').then(
        (m) => m.AvatarPageComponent,
      ),
    title: 'Avatar · ngx-dmaster-ui',
  },
  {
    path: 'components/switch',
    loadComponent: () =>
      import('./pages/components/switch-page/switch-page.component').then(
        (m) => m.SwitchPageComponent,
      ),
    title: 'Switch · ngx-dmaster-ui',
  },
  {
    path: 'components/checkbox',
    loadComponent: () =>
      import('./pages/components/checkbox-page/checkbox-page.component').then(
        (m) => m.CheckboxPageComponent,
      ),
    title: 'Checkbox · ngx-dmaster-ui',
  },
  {
    path: 'components/form-field',
    loadComponent: () =>
      import('./pages/components/form-field-page/form-field-page.component').then(
        (m) => m.FormFieldPageComponent,
      ),
    title: 'Form Field · ngx-dmaster-ui',
  },
  {
    path: 'components/tooltip',
    loadComponent: () =>
      import('./pages/components/tooltip-page/tooltip-page.component').then(
        (m) => m.TooltipPageComponent,
      ),
    title: 'Tooltip · ngx-dmaster-ui',
  },
  {
    path: 'components/dialog',
    loadComponent: () =>
      import('./pages/components/dialog-page/dialog-page.component').then(
        (m) => m.DialogPageComponent,
      ),
    title: 'Dialog · ngx-dmaster-ui',
  },
  {
    path: 'components/toast',
    loadComponent: () =>
      import('./pages/components/toast-page/toast-page.component').then(
        (m) => m.ToastPageComponent,
      ),
    title: 'Toast · ngx-dmaster-ui',
  },
  { path: '**', redirectTo: '' },
];
