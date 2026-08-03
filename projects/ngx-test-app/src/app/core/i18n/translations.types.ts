/** Idiomas soportados por el dashboard. Inglés es el idioma por defecto. */
export type DashboardLocale = 'en' | 'es' | 'fr';

/**
 * Forma genérica de las páginas de componente añadidas a partir de la v0.2.
 * `api` y `labels` son Records: menos ceremonia que una interfaz por página,
 * a cambio de que un typo en la clave devuelva `undefined` — cuidado.
 */
export interface SimplePageTranslations {
  lead: string;
  apiCaption: string;
  defaultsDesc?: string;
  a11yItems: string[];
  api: Record<string, string>;
  labels: Record<string, string>;
}

/**
 * Diccionario completo del dashboard. Cada idioma debe implementar esta
 * interfaz al completo: TypeScript garantiza que no falte ninguna clave.
 *
 * Convención: las claves cuyo valor contiene marcado inline (`<code>…</code>`)
 * se enlazan con `[innerHTML]` (Angular las sanea); el resto, con interpolación.
 */
export interface DashboardTranslations {
  shell: {
    navAria: string;
    openNav: string;
    closeNav: string;
    switchToLight: string;
    switchToDark: string;
    languageLabel: string;
    nav: {
      intro: string;
      home: string;
      overview: string;
      primitives: string;
      layout: string;
      buttons: string;
      forms: string;
      overlays: string;
      skeleton: string;
      spinner: string;
      badge: string;
      avatar: string;
      card: string;
      loadingButton: string;
      switch: string;
      checkbox: string;
      formField: string;
      tooltip: string;
      dialog: string;
      toast: string;
    };
  };
  common: {
    playgroundTitle: string;
    playgroundDesc: string;
    examplesTitle: string;
    apiTitle: string;
    defaultsTitle: string;
    a11yTitle: string;
    demos: {
      basic: string;
      variants: string;
      sizes: string;
      states: string;
      appearances: string;
      positions: string;
      withLabel: string;
      forms: string;
      composition: string;
    };
  };
  shared: {
    copyCode: string;
    copied: string;
    playgroundControls: string;
    api: { name: string; type: string; default: string; description: string };
  };
  home: {
    subtitle: string;
    cta: string;
    featuresAria: string;
    features: {
      signalsTitle: string;
      signalsBody: string;
      themingTitle: string;
      themingBody: string;
      responsiveTitle: string;
      responsiveBody: string;
    };
    startTitle: string;
  };
  skeletonPage: {
    lead: string;
    demos: {
      basic: string;
      variants: string;
      animations: string;
      paragraph: string;
      card: string;
      fluid: string;
    };
    apiCaption: string;
    defaultsDesc: string;
    a11yItems: string[];
    api: {
      variant: string;
      width: string;
      height: string;
      animation: string;
      rounded: string;
      count: string;
    };
  };
  loadingButtonPage: {
    lead: string;
    demos: { variants: string; sizes: string; states: string; async: string };
    apiCaption: string;
    defaultsDesc: string;
    a11yItems: string[];
    api: {
      variant: string;
      size: string;
      state: string;
      type: string;
      disabled: string;
      loadingLabel: string;
      successLabel: string;
      errorLabel: string;
      clicked: string;
    };
    asyncButtonLabel: string;
  };
  pages: {
    overview: SimplePageTranslations;
    spinner: SimplePageTranslations;
    badge: SimplePageTranslations;
    card: SimplePageTranslations;
    avatar: SimplePageTranslations;
    switch: SimplePageTranslations;
    checkbox: SimplePageTranslations;
    formField: SimplePageTranslations;
    tooltip: SimplePageTranslations;
    dialog: SimplePageTranslations;
    toast: SimplePageTranslations;
  };
}
