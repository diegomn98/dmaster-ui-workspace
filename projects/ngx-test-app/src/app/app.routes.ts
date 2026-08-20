import { Routes } from '@angular/router';

import { ShellComponent } from './layout/shell/shell.component';

// La landing ('' exacto) vive FUERA del shell: página completa sin sidebar,
// con su propio top bar. El resto de rutas comparten el
// shell de docs (header + sidebar + TOC) como layout route.
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: '@dmaster/ui · Modern Angular components',
  },
  {
    path: '',
    component: ShellComponent,
    children: [
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
          import('./pages/components/card-page/card-page.component').then(
            (m) => m.CardPageComponent,
          ),
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
        path: 'components/icon',
        loadComponent: () =>
          import('./pages/components/icon-page/icon-page.component').then(
            (m) => m.IconPageComponent,
          ),
        title: 'Icon · @dmaster/ui',
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
        path: 'components/autocomplete',
        loadComponent: () =>
          import('./pages/components/autocomplete-page/autocomplete-page.component').then(
            (m) => m.AutocompletePageComponent,
          ),
        title: 'Autocomplete · @dmaster/ui',
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
        path: 'components/search-field',
        loadComponent: () =>
          import('./pages/components/search-field-page/search-field-page.component').then(
            (m) => m.SearchFieldPageComponent,
          ),
        title: 'Search Field · @dmaster/ui',
      },
      {
        path: 'components/date-picker',
        loadComponent: () =>
          import('./pages/components/date-picker-page/date-picker-page.component').then(
            (m) => m.DatePickerPageComponent,
          ),
        title: 'Date Picker · @dmaster/ui',
      },
      {
        path: 'components/error-message',
        loadComponent: () =>
          import('./pages/components/error-message-page/error-message-page.component').then(
            (m) => m.ErrorMessagePageComponent,
          ),
        title: 'Error · @dmaster/ui',
      },
      {
        path: 'components/color-picker',
        loadComponent: () =>
          import('./pages/components/color-picker-page/color-picker-page.component').then(
            (m) => m.ColorPickerPageComponent,
          ),
        title: 'Color Picker · @dmaster/ui',
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
          import('./pages/components/tabs-page/tabs-page.component').then(
            (m) => m.TabsPageComponent,
          ),
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
      {
        path: 'components/divider',
        loadComponent: () =>
          import('./pages/components/divider-page/divider-page.component').then(
            (m) => m.DividerPageComponent,
          ),
        title: 'Divider · @dmaster/ui',
      },
      {
        path: 'components/progress',
        loadComponent: () =>
          import('./pages/components/progress-page/progress-page.component').then(
            (m) => m.ProgressPageComponent,
          ),
        title: 'Progress · @dmaster/ui',
      },
      {
        path: 'components/alert',
        loadComponent: () =>
          import('./pages/components/alert-page/alert-page.component').then(
            (m) => m.AlertPageComponent,
          ),
        title: 'Alert · @dmaster/ui',
      },
      {
        path: 'components/pagination',
        loadComponent: () =>
          import('./pages/components/pagination-page/pagination-page.component').then(
            (m) => m.PaginationPageComponent,
          ),
        title: 'Pagination · @dmaster/ui',
      },
      {
        path: 'components/slider',
        loadComponent: () =>
          import('./pages/components/slider-page/slider-page.component').then(
            (m) => m.SliderPageComponent,
          ),
        title: 'Slider · @dmaster/ui',
      },
      {
        path: 'components/rating',
        loadComponent: () =>
          import('./pages/components/rating-page/rating-page.component').then(
            (m) => m.RatingPageComponent,
          ),
        title: 'Rating · @dmaster/ui',
      },
      {
        path: 'components/stepper',
        loadComponent: () =>
          import('./pages/components/stepper-page/stepper-page.component').then(
            (m) => m.StepperPageComponent,
          ),
        title: 'Stepper · @dmaster/ui',
      },
      {
        path: 'components/file-upload',
        loadComponent: () =>
          import('./pages/components/file-upload-page/file-upload-page.component').then(
            (m) => m.FileUploadPageComponent,
          ),
        title: 'File upload · @dmaster/ui',
      },
      {
        path: 'components/tree',
        loadComponent: () =>
          import('./pages/components/tree-page/tree-page.component').then(
            (m) => m.TreePageComponent,
          ),
        title: 'Tree · @dmaster/ui',
      },
      {
        path: 'components/number-input',
        loadComponent: () =>
          import('./pages/components/number-input-page/number-input-page.component').then(
            (m) => m.NumberInputPageComponent,
          ),
        title: 'Number input · @dmaster/ui',
      },
      {
        path: 'components/timeline',
        loadComponent: () =>
          import('./pages/components/timeline-page/timeline-page.component').then(
            (m) => m.TimelinePageComponent,
          ),
        title: 'Timeline · @dmaster/ui',
      },
      {
        path: 'components/empty-state',
        loadComponent: () =>
          import('./pages/components/empty-state-page/empty-state-page.component').then(
            (m) => m.EmptyStatePageComponent,
          ),
        title: 'Empty state · @dmaster/ui',
      },
      {
        path: 'components/toggle-group',
        loadComponent: () =>
          import('./pages/components/toggle-group-page/toggle-group-page.component').then(
            (m) => m.ToggleGroupPageComponent,
          ),
        title: 'Toggle group · @dmaster/ui',
      },
      {
        path: 'components/button-group',
        loadComponent: () =>
          import('./pages/components/button-group-page/button-group-page.component').then(
            (m) => m.ButtonGroupPageComponent,
          ),
        title: 'Button group · @dmaster/ui',
      },
      {
        path: 'components/otp',
        loadComponent: () =>
          import('./pages/components/otp-page/otp-page.component').then((m) => m.OtpPageComponent),
        title: 'OTP input · @dmaster/ui',
      },
      {
        path: 'components/breadcrumbs',
        loadComponent: () =>
          import('./pages/components/breadcrumbs-page/breadcrumbs-page.component').then(
            (m) => m.BreadcrumbsPageComponent,
          ),
        title: 'Breadcrumbs · @dmaster/ui',
      },
      {
        path: 'components/menu',
        loadComponent: () =>
          import('./pages/components/menu-page/menu-page.component').then(
            (m) => m.MenuPageComponent,
          ),
        title: 'Menu · @dmaster/ui',
      },
      {
        path: 'components/popover',
        loadComponent: () =>
          import('./pages/components/popover-page/popover-page.component').then(
            (m) => m.PopoverPageComponent,
          ),
        title: 'Popover · @dmaster/ui',
      },
      {
        path: 'components/drawer',
        loadComponent: () =>
          import('./pages/components/drawer-page/drawer-page.component').then(
            (m) => m.DrawerPageComponent,
          ),
        title: 'Drawer · @dmaster/ui',
      },
      {
        path: 'components/kbd',
        loadComponent: () =>
          import('./pages/components/kbd-page/kbd-page.component').then((m) => m.KbdPageComponent),
        title: 'Keyboard Key · @dmaster/ui',
      },
      {
        path: 'components/command',
        loadComponent: () =>
          import('./pages/components/command-page/command-page.component').then(
            (m) => m.CommandPageComponent,
          ),
        title: 'Command · @dmaster/ui',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
