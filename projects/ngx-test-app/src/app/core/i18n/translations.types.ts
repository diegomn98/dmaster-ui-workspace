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
/** Un artículo de release del blog: titular, entradilla y "qué salió". */
export interface BlogArticleTranslations {
  title: string;
  lead: string;
  bullets: string[];
}

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
      theming: string;
      componentTokens: string;
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
    navRoadmap: string;
    navBlog: string;
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
    namedThemesTitle: string;
    namedThemesBody: string;
    animationBody: string;
    animationItems: string[];
    animationNote: string;
    typescriptBody: string;
    whatsNextTitle: string;
    whatsNextBody: string;
    whatsNextCta: string;
  };
  theming: {
    lead: string;
    sections: {
      overview: string;
      semanticTokens: string;
      colorSystem: string;
      derivedCascade: string;
      lightDark: string;
      namedThemes: string;
      density: string;
      motion: string;
      componentTokens: string;
      overlayScoping: string;
    };
    overviewBody: string;
    overviewHighlights: string[];
    semanticBody: string;
    surfaceTokens: string;
    textTokens: string;
    borderTokens: string;
    shadowTokens: string;
    colorSystemBody: string;
    colorRoles: string[];
    derivedBody: string;
    derivedNote: string;
    lightDarkBody: string;
    lightDarkItems: string[];
    namedBody: string;
    namedSteps: string[];
    densityBody: string;
    densityScales: string[];
    motionBody: string;
    motionTokens: string[];
    motionNote: string;
    componentTokensBody: string;
    componentTokensItems: string[];
    componentTokensNote: string;
    overlayBody: string;
    overlayNote: string;
    whatsNextTitle: string;
    whatsNextBody: string;
    whatsNextCta: string;
    whatsNextCtaSecondary: string;
  };
  componentTokens: {
    lead: string;
    totalTokensLabel: string;
    sections: {
      howItWorks: string;
      globalOverride: string;
      scopedOverride: string;
      perThemeOverride: string;
      overlayScoping: string;
      reference: string;
    };
    howItWorksBody: string;
    howItWorksPattern: string;
    globalBody: string;
    scopedBody: string;
    perThemeBody: string;
    overlayBody: string;
    referenceBody: string;
    referenceCategories: {
      primitives: string;
      layout: string;
      feedback: string;
      buttons: string;
      forms: string;
      navigation: string;
      dataDisplay: string;
      overlays: string;
    };
    backToTheming: string;
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
  // Página /roadmap — full-bleed, fuera del shell (como la landing).
  roadmap: {
    eyebrow: string;
    nowLabel: string;
    // Board de 3 columnas (Shipped / In progress / Next).
    board: {
      backlog: string;
      inProgress: string;
      done: string;
      backlogMeta: string;
      inProgressMeta: string;
      doneMeta: string;
      targetTitle: string;
      targetSub: string;
    };
    rail: {
      foundations: string;
      forms: string;
      catalogue: string;
      current: string;
      theming: string;
    };
    focusItems: {
      freezeTitle: string;
      freezeDesc: string;
      deprecationTitle: string;
      deprecationDesc: string;
      docsTitle: string;
      docsDesc: string;
    };
    statusInProgress: string;
    statusQueued: string;
    gatesTitle: string;
    gates: {
      a11y: string;
      visual: string;
      consumer: string;
      provenance: string;
    };
    next: {
      signalFormsTitle: string;
      signalFormsDesc: string;
      tagsTitle: string;
      tagsDesc: string;
      textareaTitle: string;
      textareaDesc: string;
      contextMenuTitle: string;
      contextMenuDesc: string;
      scrollAreaTitle: string;
      scrollAreaDesc: string;
      splitterTitle: string;
      splitterDesc: string;
      themeBuilderTitle: string;
      themeBuilderDesc: string;
    };
    catForms: string;
    catOverlay: string;
    catLayout: string;
    catDx: string;
    footerTitle: string;
    footerChangelog: string;
    footerReleases: string;
  };
  // Página /blog — full-bleed, fuera del shell (como landing y roadmap).
  // Los artículos son las release notes reales: uno por versión, con la
  // metadata en core/blog/releases.ts (única fuente de verdad de slugs/fechas).
  blog: {
    title: string;
    latestLabel: string;
    filterAll: string;
    rssTitle: string;
    rssDesc: string;
    browseCta: string;
    rssCta: string;
    categories: {
      a11y: string;
      performance: string;
      testing: string;
      architecture: string;
      release: string;
    };
    articleBack: string;
    articleWhatShipped: string;
    articleViewRelease: string;
    articleViewChangelog: string;
    articleNewer: string;
    articleOlder: string;
    articles: {
      v08: BlogArticleTranslations;
      v07: BlogArticleTranslations;
      v06: BlogArticleTranslations;
      v05: BlogArticleTranslations;
      v04: BlogArticleTranslations;
      v03: BlogArticleTranslations;
      v02: BlogArticleTranslations;
      v01: BlogArticleTranslations;
    };
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
