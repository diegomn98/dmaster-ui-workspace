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
    searchLabel: string;
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
      feedback: string;
      skeleton: string;
      spinner: string;
      badge: string;
      avatar: string;
      icon: string;
      card: string;
      accordion: string;
      button: string;
      switch: string;
      checkbox: string;
      formField: string;
      searchField: string;
      datePicker: string;
      errorMessage: string;
      colorPicker: string;
      select: string;
      autocomplete: string;
      paginatedSelect: string;
      radioGroup: string;
      tabs: string;
      table: string;
      tree: string;
      timeline: string;
      tooltip: string;
      dialog: string;
      toast: string;
      divider: string;
      progress: string;
      alert: string;
      pagination: string;
      slider: string;
      rating: string;
      breadcrumbs: string;
      menu: string;
      popover: string;
      drawer: string;
      kbd: string;
      command: string;
      stepper: string;
      fileUpload: string;
      numberInput: string;
      emptyState: string;
      toggleGroup: string;
      buttonGroup: string;
      otp: string;
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
    navDocs: string;
    navComponents: string;
    footerRights: string;
    heroChipAngular: string;
    heroChipMit: string;
    heroLine1: string;
    heroLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    copyAria: string;
    stats: {
      components: string;
      tests: string;
      externalDeps: string;
      externalDepsValue: string;
      standalone: string;
      standaloneValue: string;
    };
    galleryEyebrow: string;
    galleryTitle: string;
    gallerySubtitle: string;
    galleryViewAll: string;
    codeEyebrow: string;
    codeTitle: string;
    codeLead: string;
    codeTabs: {
      profile: string;
      pricing: string;
      settings: string;
    };
    themingEyebrow: string;
    themingTitle: string;
    themingLead: string;
    themingHint: string;
    themingSwatchesAria: string;
    featuresAria: string;
    featuresEyebrow: string;
    featuresTitle: string;
    featuresLead: string;
    features: {
      signalsTitle: string;
      signalsBody: string;
      zonelessTitle: string;
      zonelessBody: string;
      themingTitle: string;
      themingBody: string;
      depsTitle: string;
      depsBody: string;
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
    ngAddBody: string;
    installManualTitle: string;
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
    demos: {
      colors: string;
      variants: string;
      sizes: string;
      states: string;
      async: string;
      iconButtons: string;
    };
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
    searchField: SimplePageTranslations;
    datePicker: SimplePageTranslations;
    errorMessage: SimplePageTranslations;
    colorPicker: SimplePageTranslations;
    select: SimplePageTranslations;
    autocomplete: SimplePageTranslations;
    paginatedSelect: SimplePageTranslations;
    radioGroup: SimplePageTranslations;
    tabs: SimplePageTranslations;
    table: SimplePageTranslations;
    tree: SimplePageTranslations;
    timeline: SimplePageTranslations;
    tooltip: SimplePageTranslations;
    dialog: SimplePageTranslations;
    toast: SimplePageTranslations;
    divider: SimplePageTranslations;
    progress: SimplePageTranslations;
    alert: SimplePageTranslations;
    pagination: SimplePageTranslations;
    slider: SimplePageTranslations;
    rating: SimplePageTranslations;
    breadcrumbs: SimplePageTranslations;
    menu: SimplePageTranslations;
    popover: SimplePageTranslations;
    drawer: SimplePageTranslations;
    kbd: SimplePageTranslations;
    command: SimplePageTranslations;
    icon: SimplePageTranslations;
    stepper: SimplePageTranslations;
    fileUpload: SimplePageTranslations;
    numberInput: SimplePageTranslations;
    emptyState: SimplePageTranslations;
    toggleGroup: SimplePageTranslations;
    buttonGroup: SimplePageTranslations;
    otp: SimplePageTranslations;
  };
}
