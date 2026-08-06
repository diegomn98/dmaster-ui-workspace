import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: '@dmaster/ui · Modern Angular components',
  },
  {
    path: 'getting-started',
    loadComponent: () =>
      import('./pages/getting-started/getting-started.component').then(
        (m) => m.GettingStartedComponent,
      ),
    title: 'Getting Started · @dmaster/ui',
  },
  {
    path: 'components',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/overview/overview-page.component').then((m) => m.OverviewPageComponent),
    title: 'Components · @dmaster/ui',
  },
  {
    path: 'components/skeleton',
    loadComponent: () =>
      import('./pages/components/skeleton-page/skeleton-page.component').then(
        (m) => m.SkeletonPageComponent,
      ),
    title: 'Skeleton · @dmaster/ui',
  },
  {
    path: 'components/button',
    loadComponent: () =>
      import('./pages/components/button-page/button-page.component').then(
        (m) => m.ButtonPageComponent,
      ),
    title: 'Button · @dmaster/ui',
  },
  {
    path: 'components/spinner',
    loadComponent: () =>
      import('./pages/components/spinner-page/spinner-page.component').then(
        (m) => m.SpinnerPageComponent,
      ),
    title: 'Spinner · @dmaster/ui',
  },
  {
    path: 'components/badge',
    loadComponent: () =>
      import('./pages/components/badge-page/badge-page.component').then(
        (m) => m.BadgePageComponent,
      ),
    title: 'Badge · @dmaster/ui',
  },
  {
    path: 'components/card',
    loadComponent: () =>
      import('./pages/components/card-page/card-page.component').then((m) => m.CardPageComponent),
    title: 'Card · @dmaster/ui',
  },
  {
    path: 'components/avatar',
    loadComponent: () =>
      import('./pages/components/avatar-page/avatar-page.component').then(
        (m) => m.AvatarPageComponent,
      ),
    title: 'Avatar · @dmaster/ui',
  },
  {
    path: 'components/switch',
    loadComponent: () =>
      import('./pages/components/switch-page/switch-page.component').then(
        (m) => m.SwitchPageComponent,
      ),
    title: 'Switch · @dmaster/ui',
  },
  {
    path: 'components/checkbox',
    loadComponent: () =>
      import('./pages/components/checkbox-page/checkbox-page.component').then(
        (m) => m.CheckboxPageComponent,
      ),
    title: 'Checkbox · @dmaster/ui',
  },
  {
    path: 'components/select',
    loadComponent: () =>
      import('./pages/components/select-page/select-page.component').then(
        (m) => m.SelectPageComponent,
      ),
    title: 'Select · @dmaster/ui',
  },
  {
    path: 'components/paginated-select',
    loadComponent: () =>
      import('./pages/components/paginated-select-page/paginated-select-page.component').then(
        (m) => m.PaginatedSelectPageComponent,
      ),
    title: 'Paginated Select · @dmaster/ui',
  },
  {
    path: 'components/form-field',
    loadComponent: () =>
      import('./pages/components/form-field-page/form-field-page.component').then(
        (m) => m.FormFieldPageComponent,
      ),
    title: 'Form Field · @dmaster/ui',
  },
  {
    path: 'components/tooltip',
    loadComponent: () =>
      import('./pages/components/tooltip-page/tooltip-page.component').then(
        (m) => m.TooltipPageComponent,
      ),
    title: 'Tooltip · @dmaster/ui',
  },
  {
    path: 'components/dialog',
    loadComponent: () =>
      import('./pages/components/dialog-page/dialog-page.component').then(
        (m) => m.DialogPageComponent,
      ),
    title: 'Dialog · @dmaster/ui',
  },
  {
    path: 'components/toast',
    loadComponent: () =>
      import('./pages/components/toast-page/toast-page.component').then(
        (m) => m.ToastPageComponent,
      ),
    title: 'Toast · @dmaster/ui',
  },
  {
    path: 'components/accordion',
    loadComponent: () =>
      import('./pages/components/accordion-page/accordion-page.component').then(
        (m) => m.AccordionPageComponent,
      ),
    title: 'Accordion · @dmaster/ui',
  },
  {
    path: 'components/radio-group',
    loadComponent: () =>
      import('./pages/components/radio-group-page/radio-group-page.component').then(
        (m) => m.RadioGroupPageComponent,
      ),
    title: 'Radio Group · @dmaster/ui',
  },
  {
    path: 'components/tabs',
    loadComponent: () =>
      import('./pages/components/tabs-page/tabs-page.component').then((m) => m.TabsPageComponent),
    title: 'Tabs · @dmaster/ui',
  },
  {
    path: 'components/table',
    loadComponent: () =>
      import('./pages/components/table-page/table-page.component').then(
        (m) => m.TablePageComponent,
      ),
    title: 'Table · @dmaster/ui',
  },
  { path: '**', redirectTo: '' },
];
