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
    githubAria: string;
    themeLabel: string;
    themeHeading: string;
    nav: {
      intro: string;
      home: string;
      overview: string;
      gettingStarted: string;
      primitives: string;
      layout: string;
      buttons: string;
      forms: string;
      overlays: string;
      navigation: string;
      dataDisplay: string;
      skeleton: string;
      spinner: string;
      badge: string;
      avatar: string;
      card: string;
      accordion: string;
      button: string;
      switch: string;
      checkbox: string;
      formField: string;
      select: string;
      paginatedSelect: string;
      radioGroup: string;
      tabs: string;
      table: string;
      tooltip: string;
      dialog: string;
      toast: string;
    };
  };
  common: {
    importTitle: string;
    usageTitle: string;
    usageDesc: string;
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
    copy: string;
    copyCode: string;
    copied: string;
    playgroundControls: string;
    previewLabel: string;
    codeLabel: string;
    onThisPage: string;
    api: { name: string; type: string; default: string; description: string };
  };
  home: {
    versionBadge: string;
    title: string;
    heroLine1: string;
    heroLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: {
      components: string;
      tests: string;
      externalDeps: string;
      externalDepsValue: string;
    };
    showcaseAria: string;
    showcaseTitle: string;
    showcaseSubtitle: string;
    galleryTitle: string;
    gallerySubtitle: string;
    featuresAria: string;
    features: {
      signalsTitle: string;
      signalsBody: string;
      themingTitle: string;
      themingBody: string;
      responsiveTitle: string;
      responsiveBody: string;
      a11yTitle: string;
      a11yBody: string;
    };
    startTitle: string;
    startLead: string;
    startCta: string;
    ctaTitle: string;
    ctaLead: string;
  };
  gettingStarted: {
    lead: string;
    tocTitle: string;
    stepLabel: string;
    prevLabel: string;
    nextLabel: string;
    sections: {
      intro: string;
      installation: string;
      styles: string;
      providers: string;
      firstComponent: string;
      darkMode: string;
      colors: string;
      animation: string;
      typescript: string;
    };
    introBody: string;
    introHighlights: string[];
    prerequisitesTitle: string;
    prerequisitesBody: string;
    prereqItems: string[];
    installBody: string;
    stylesBody: string;
    stylesNote: string;
    providersBody: string;
    firstComponentBody: string;
    darkModeBody: string;
    darkModeItems: string[];
    darkModeNote: string;
    colorsBody: string;
    colorsItems: string[];
    colorsNote: string;
    animationBody: string;
    animationItems: string[];
    animationNote: string;
    typescriptBody: string;
    whatsNextTitle: string;
    whatsNextBody: string;
    whatsNextCta: string;
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
  buttonPage: {
    lead: string;
    demos: { colors: string; variants: string; sizes: string; states: string; async: string };
    apiCaption: string;
    defaultsDesc: string;
    a11yItems: string[];
    api: {
      color: string;
      variant: string;
      radius: string;
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
    accordion: SimplePageTranslations;
    switch: SimplePageTranslations;
    checkbox: SimplePageTranslations;
    formField: SimplePageTranslations;
    select: SimplePageTranslations;
    paginatedSelect: SimplePageTranslations;
    radioGroup: SimplePageTranslations;
    tabs: SimplePageTranslations;
    table: SimplePageTranslations;
    tooltip: SimplePageTranslations;
    dialog: SimplePageTranslations;
    toast: SimplePageTranslations;
  };
}
