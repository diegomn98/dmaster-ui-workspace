import { DashboardTranslations } from './translations.types';

export const FR: DashboardTranslations = {
  shell: {
    navAria: 'Composants',
    openNav: 'Ouvrir la navigation',
    closeNav: 'Fermer la navigation',
    switchToLight: 'Passer au thème clair',
    switchToDark: 'Passer au thème sombre',
    languageLabel: 'Langue',
    githubAria: 'Voir le code source sur GitHub',
    themeLabel: 'Thème',
    themeHeading: 'Choisir un thème',
    nav: {
      intro: 'Introduction',
      home: 'Accueil',
      overview: 'Aperçu',
      gettingStarted: 'Démarrer',
      primitives: 'Primitives',
      layout: 'Layout',
      buttons: 'Boutons',
      forms: 'Formulaires',
      overlays: 'Overlays',
      navigation: 'Navigation',
      dataDisplay: 'Data Display',
      skeleton: 'Skeleton',
      spinner: 'Spinner',
      badge: 'Badge',
      avatar: 'Avatar',
      card: 'Card',
      accordion: 'Accordion',
      button: 'Button',
      switch: 'Switch',
      checkbox: 'Checkbox',
      formField: 'Form Field',
      select: 'Select',
      paginatedSelect: 'Select paginé',
      radioGroup: 'Radio Group',
      tabs: 'Tabs',
      table: 'Table',
      tooltip: 'Tooltip',
      dialog: 'Dialog',
      toast: 'Toast',
    },
  },
  common: {
    importTitle: 'Import',
    usageTitle: 'Utilisation',
    usageDesc: 'Le snippet le plus court possible — c’est ce que vous écrirez en vrai.',
    playgroundTitle: 'Playground',
    playgroundDesc: 'Modifiez les inputs en direct et copiez le snippet obtenu.',
    examplesTitle: 'Exemples',
    apiTitle: 'API',
    defaultsTitle: 'Defaults globaux',
    a11yTitle: 'Accessibilité',
    demos: {
      basic: 'Basique',
      variants: 'Variantes',
      sizes: 'Tailles',
      states: 'États',
      appearances: 'Apparences',
      positions: 'Positions',
      withLabel: 'Avec libellé',
      forms: 'Reactive Forms',
      composition: 'Composition',
    },
  },
  shared: {
    copy: 'Copier',
    copyCode: 'Copier le code',
    copied: 'Copié',
    playgroundControls: 'Contrôles du playground',
    previewLabel: 'Aperçu',
    codeLabel: 'Code',
    onThisPage: 'Sur cette page',
    api: { name: 'Nom', type: 'Type', default: 'Défaut', description: 'Description' },
  },
  home: {
    navDocs: 'Docs',
    navComponents: 'Composants',
    footerRights: 'Licence MIT © 2026 Diego Maestro',
    versionBadge: 'v0.1.2',
    heroChipAngular: 'Angular 20+',
    heroChipMit: 'Licence MIT',
    heroLine1: 'La bibliothèque de composants',
    heroLine2: 'qu’Angular mérite.',
    subtitle:
      'Librairie de composants Angular 20 moderne. Standalone, basée sur les signals, inspirée de HeroUI — avec dark mode, theming réel et accessibilité intégrés dès le premier composant.',
    ctaPrimary: 'Démarrer',
    ctaSecondary: 'Voir les composants',
    copyAria: 'Copier la commande d’installation',
    stats: {
      components: 'composants',
      tests: 'tests, 100 % au vert',
      externalDeps: 'dépendances externes d’UI',
      externalDepsValue: 'Zéro',
      standalone: 'standalone, typé, OnPush',
      standaloneValue: '100 %',
    },
    galleryEyebrow: 'Composants',
    galleryTitle: 'Un kit de composants complet',
    gallerySubtitle:
      'Chaque composant ci-dessous est en direct — thématisé via variables CSS, responsive et accessible par défaut. Cliquez sur une tuile pour ouvrir sa documentation.',
    galleryViewAll: 'Voir tous les composants',
    codeEyebrow: 'Code',
    codeTitle: 'Moins de code, meilleure UI.',
    codeLead:
      'De vrais composants, du vrai code — copiez-le directement dans votre app. Sans wrappers, sans config, sans surprises.',
    codeTabs: {
      profile: 'Profil',
      pricing: 'Tarifs',
      settings: 'Réglages',
    },
    themingEyebrow: 'Theming',
    themingTitle: 'Faites-le vôtre.',
    themingLead:
      'Chaque couleur est une variable CSS. Choisissez une palette — tout le site change de peau instantanément, sans rebuild ni configuration.',
    themingHint: 'Essayez : ce sélecteur pilote les vrais design tokens de cette page.',
    themingSwatchesAria: 'Palettes de couleurs',
    featuresAria: 'Fonctionnalités',
    featuresEyebrow: 'Pourquoi @dmaster/ui',
    featuresTitle: 'Conçue comme un produit, pas comme une démo.',
    featuresLead:
      'Chaque composant arrive avec les petites décisions déjà prises : états, clavier, animation, densité, dark mode.',
    features: {
      signalsTitle: "Signals d'abord",
      signalsBody:
        'API construite avec <code>input()</code>, <code>output()</code> et <code>model()</code>. <code>OnPush</code> par défaut et compatible zoneless.',
      zonelessTitle: 'Prêt pour le zoneless',
      zonelessBody:
        'Aucun zone.js. La détection de changements repose sur les signals et <code>OnPush</code> — prête dès aujourd’hui pour le futur zoneless d’Angular.',
      themingTitle: 'Theming réel',
      themingBody:
        'Custom properties CSS comme unique source de theming : tokens <code>--dm-*</code>, light et dark, et densités <code>compact · comfortable · spacious</code>.',
      depsTitle: 'Zéro dépendance d’UI',
      depsBody:
        'Angular + CDK, rien d’autre. Pas de police d’icônes, pas de framework CSS, pas de moteur de thème au runtime — un bundle léger qui vieillit bien.',
      responsiveTitle: 'Responsive par défaut',
      responsiveBody:
        'Mobile-first, container queries quand elles apportent, cibles tactiles de 44px et respect de <code>prefers-reduced-motion</code>.',
      a11yTitle: 'Accessible',
      a11yBody:
        'HTML sémantique, ARIA quand nécessaire, focus rings via <code>:focus-visible</code>, navigation clavier complète et annonces testées avec lecteurs d’écran.',
    },
    startTitle: 'Installez-la en quelques secondes',
    startLead:
      'Ajoutez le package, importez les styles et fournissez la librairie. Le setup complet prend moins d’une minute.',
    startCta: 'Voir le guide complet',
    ctaTitle: 'Prêt à construire ?',
    ctaLead:
      'Setup en une minute, publication le jour même. Chaque composant est prêt pour la production, testé et typé.',
  },
  gettingStarted: {
    lead: 'Ajoutez @dmaster/ui à votre app Angular 20+ en moins d’une minute — puis débloquez theming, dark mode, couleurs et animation, étape par étape.',
    tocTitle: 'Guide',
    stepLabel: 'Étape',
    prevLabel: 'Précédent',
    nextLabel: 'Suivant',
    sections: {
      intro: 'Introduction',
      installation: 'Installation',
      styles: 'Styles',
      providers: 'Fournir la librairie',
      firstComponent: 'Premier composant',
      darkMode: 'Mode sombre',
      colors: 'Couleurs et tokens',
      animation: 'Animation',
      typescript: 'TypeScript',
    },
    introBody:
      '@dmaster/ui est une librairie de composants standalone et signals-first pour Angular 20+. Chaque composant est <code>OnPush</code>, compatible zoneless, thématisé uniquement via des custom properties CSS et sans dépendance UI tierce — uniquement Angular et l’Angular CDK.',
    introHighlights: [
      '<strong>Composants standalone</strong> — pas de modules, pas de barrels. Importez ce que vous utilisez, tree-shake le reste.',
      '<strong>Compatible zoneless</strong> — signals partout, <code>OnPush</code> par défaut. Fonctionne avec <code>provideZonelessChangeDetection()</code>.',
      '<strong>Thématisé par variables CSS</strong> — surchargez n’importe quel token <code>--dm-*</code> pour re-skin la librairie entière sans forker un seul composant.',
    ],
    prerequisitesTitle: 'Prérequis',
    prerequisitesBody:
      'Avant l’installation, vérifiez que votre projet remplit ces prérequis de base.',
    prereqItems: [
      '<strong>Angular 20+</strong> (APIs standalone et le nouveau runtime signals).',
      '<strong>Node 20.19+</strong> ou <strong>22.12+</strong>.',
      '<code>@angular/cdk</code> et <code>@angular/forms</code> sont des peer dependencies (installées avec le package).',
    ],
    installBody:
      'Installez la librairie et ses peer dependencies avec votre gestionnaire de packages préféré.',
    stylesBody:
      'Importez la feuille de styles de la librairie une fois dans votre <code>styles.scss</code> global. Elle émet le reset, les design tokens et les deux thèmes light/dark.',
    stylesNote:
      'Si vous utilisez des overlays (<code>dm-dialog</code>, <code>dm-toast</code>, <code>dm-tooltip</code>, <code>dm-select</code>), chargez aussi les styles structurels du CDK une fois via <code>angular.json</code>.',
    providersBody:
      'Ajoutez <code>provideDmasterUI</code> dans votre <code>ApplicationConfig</code>. Le <code>theme</code> et la <code>density</code> initiaux se posent sur <code>&lt;html&gt;</code> pour que les tokens CSS bougent tout seuls.',
    firstComponentBody:
      'Tous les composants sont standalone : importez-les directement là où vous les utilisez. Pas de modules, pas de barrels à retenir.',
    darkModeBody:
      'Le mode sombre est un citoyen de première classe. Chaque token de couleur, de bordure et d’ombre a son équivalent dark — le basculement est instantané via un attribut sur <code>&lt;html&gt;</code>.',
    darkModeItems: [
      "<code>ThemeService.setTheme('light' | 'dark' | 'auto')</code> — <code>auto</code> suit <code>prefers-color-scheme</code>.",
      '<code>ThemeService.toggle()</code> — une ligne pour un bouton toggle ; utilisez <code>resolvedTheme()</code> pour lire le thème visible actuel.',
      'Persisté automatiquement dans <code>localStorage</code>. Pas de flash de mauvais thème au rechargement.',
    ],
    darkModeNote:
      'Préférez sauter le service ? Posez <code>data-dm-theme="dark"</code> sur <code>&lt;html&gt;</code> directement — tous les tokens basculent instantanément.',
    colorsBody:
      'Les couleurs sont exposées comme custom properties CSS sémantiques, mappées depuis une palette inspirée de HeroUI. Surchargez n’importe laquelle et toute la librairie se met à jour — sans rebuild.',
    colorsItems: [
      '<strong>Six couleurs sémantiques</strong> — <code>default</code>, <code>primary</code>, <code>secondary</code>, <code>success</code>, <code>warning</code>, <code>danger</code>. Chacune avec ses variantes <code>-hover</code>, <code>-fg</code> (texte sur solid) et <code>-subtle</code> (remplissage flat).',
      '<strong>Surfaces et texte</strong> — <code>--dm-bg</code>, <code>--dm-bg-subtle</code>, <code>--dm-bg-muted</code>, <code>--dm-fg</code>, <code>--dm-fg-muted</code>, <code>--dm-fg-subtle</code>.',
      '<strong>Bordures et ombres</strong> — <code>--dm-border</code>, <code>--dm-shadow-sm|md|lg|xl</code>. Chaque valeur ajustée pour light et dark.',
    ],
    colorsNote:
      'Surchargez <code>--dm-primary</code> dans votre <code>:root</code> et chaque bouton, focus ring et contrôle checked se re-skin en une ligne.',
    animationBody:
      'La motion est centralisée dans un petit set de tokens de durée et d’easing — pour que toute la librairie bouge au même tempo.',
    animationItems: [
      '<strong>Durées</strong> — <code>--dm-duration-fast</code> (120ms), <code>--dm-duration-base</code> (180ms), <code>--dm-duration-slow</code> (280ms).',
      '<strong>Easings</strong> — <code>--dm-ease-out</code>, <code>--dm-ease-snappy</code> pour le press élastique style HeroUI, <code>--dm-ease-in-out</code>.',
      '<strong>Reduced motion</strong> — tous les tokens de durée passent à <code>0ms</code> automatiquement sous <code>prefers-reduced-motion: reduce</code>. Zéro opt-in.',
    ],
    animationNote:
      'La signature HeroUI, c’est le press élastique : <code>scale(0.92–0.97)</code> avec <code>--dm-ease-snappy</code>. Déjà intégré dans chaque bouton.',
    typescriptBody:
      'Tous les types publics sont exportés depuis le barrel du package — pas besoin d’imports profonds. Cela inclut les types partagés <code>DmSize</code>, <code>DmTheme</code>, <code>DmDensity</code> et les <code>Color</code> / <code>Variant</code> / <code>Radius</code> de chaque composant.',
    whatsNextTitle: 'Étapes suivantes',
    whatsNextBody:
      'Vous êtes prêt. Parcourez les composants pour voir des previews en direct, des playgrounds, des tables d’API et des snippets copiables pour chacun.',
    whatsNextCta: 'Voir tous les composants',
  },
  skeletonPage: {
    lead: "Placeholder de chargement qui imite la forme du contenu qu'il remplace. Sans dépendance à Angular Material, accessible par défaut, avec des animations qui respectent <code>prefers-reduced-motion</code>.",
    demos: {
      basic: 'Basique',
      variants: 'Variantes',
      animations: 'Animations',
      paragraph: 'Paragraphe (count)',
      card: 'Composition : carte de profil',
      fluid: 'Tailles fluides',
    },
    apiCaption: 'Inputs de dm-skeleton',
    defaultsDesc:
      'Changez les defaults de tous les <code>dm-skeleton</code> de l’app avec le token <code>SKELETON_DEFAULTS</code> ou le helper <code>provideSkeletonDefaults</code> :',
    a11yItems: [
      'L’hôte expose <code>role="status"</code>, <code>aria-busy="true"</code> et <code>aria-live="polite"</code> : les lecteurs d’écran annoncent le chargement sans interrompre.',
      'Avec <code>prefers-reduced-motion: reduce</code>, les animations sont désactivées et le placeholder reste statique.',
      'Accepte des tailles fluides (<code>%</code>, <code>clamp()</code>, <code>vw</code>) ; sans taille explicite, il occupe 100 % de son conteneur.',
    ],
    api: {
      variant: 'Forme du placeholder.',
      width:
        'Largeur. Nombre → px ; chaîne transmise telle quelle (%, rem, clamp()…). Sans valeur, occupe 100 % du conteneur.',
      height:
        'Hauteur. Sans valeur, utilise le défaut de la variante : 1em (text), 6rem (rectangular/rounded), 2.5rem (circular).',
      animation: 'Animation de chargement. none rend un placeholder statique.',
      rounded: 'Échelle de border-radius, s’applique avec variant="rounded".',
      count:
        'Nombre de lignes/blocs rendus (minimum 1). Avec variant="text", la dernière ligne est raccourcie automatiquement.',
    },
  },
  buttonPage: {
    lead: 'Bouton avec une API couleur × variante façon HeroUI et des états de chargement, succès et erreur intégrés. Largeur stable (pas de layout shift), spinner incorporé et annonces aux lecteurs d’écran via une live region.',
    demos: {
      colors: 'Couleurs',
      variants: 'Variantes',
      sizes: 'Tailles',
      states: 'États',
      async: 'Action asynchrone simulée',
    },
    apiCaption: 'Inputs et outputs de dm-button',
    defaultsDesc:
      'Changez les defaults de tous les <code>dm-button</code> avec le token <code>BUTTON_DEFAULTS</code> ou le helper <code>provideButtonDefaults</code> :',
    a11yItems: [
      'Pendant le chargement, le bouton interne pose <code>aria-busy="true"</code> et <code>disabled</code>, évitant les envois en double.',
      'Les changements d’état sont annoncés via une région <code>aria-live="polite"</code> masquée visuellement, avec les textes <code>loadingLabel</code> / <code>successLabel</code> / <code>errorLabel</code> que vous fournissez.',
      'Le libellé conserve son espace pendant l’affichage du spinner : le bouton ne change jamais de taille (pas de layout shift).',
      'Avec <code>prefers-reduced-motion: reduce</code>, le spinner cesse de tourner et les transitions deviennent instantanées.',
    ],
    api: {
      color: 'Couleur sémantique : default, primary, secondary, success, warning, danger.',
      variant:
        'Variante visuelle : solid, flat, faded, bordered, light, ghost, shadow (glow coloré).',
      radius: 'Arrondi des coins : none, sm, md, lg, full (pilule).',
      size: 'Taille du contrôle ; les hauteurs suivent les tokens globaux de densité.',
      state:
        'État courant. loading désactive le bouton et affiche le spinner ; success/error affichent une icône.',
      type: 'Type natif du bouton.',
      disabled: 'Désactive le bouton (désactivé aussi automatiquement pendant le chargement).',
      loadingLabel:
        'Texte annoncé aux lecteurs d’écran pendant le chargement (la librairie n’embarque aucun texte).',
      successLabel: 'Texte annoncé en cas de succès.',
      errorLabel: 'Texte annoncé en cas d’erreur.',
      clicked: 'Émis au clic, uniquement quand le bouton est interactif (ni disabled ni loading).',
    },
    asyncButtonLabel: 'Enregistrer',
  },
  pages: {
    overview: {
      lead: 'Tous les composants de la librairie, en direct. Construits avec des signals, thématisés par variables CSS et accessibles par défaut — ouvrez une tuile pour voir sa documentation, son playground et son API.',
      apiCaption: '',
      a11yItems: [],
      api: {},
      labels: { count: 'composants', open: 'Ouvrir la documentation' },
    },
    spinner: {
      lead: 'Indicateur de chargement indéterminé. Hérite de <code>currentColor</code> : il s’adapte à toute surface — boutons, inputs, états vides — sans inputs supplémentaires.',
      apiCaption: 'Inputs de dm-spinner',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-spinner</code> avec le token <code>SPINNER_DEFAULTS</code> ou le helper <code>provideSpinnerDefaults</code> :',
      a11yItems: [
        'Sans <code>label</code>, il est décoratif (<code>aria-hidden="true"</code>) : le contexte annonce le chargement.',
        'Avec <code>label</code>, il expose <code>role="status"</code> + <code>aria-label</code>.',
        'Avec <code>prefers-reduced-motion: reduce</code>, la rotation s’arrête (arc statique).',
      ],
      api: {
        size: 'Taille nommée (sm 1rem, md 1.5rem, lg 2rem), pixels (nombre) ou longueur CSS.',
        strokeWidth: 'Épaisseur du trait en unités du viewBox (24).',
        label: 'Libellé accessible. Vide → décoratif.',
      },
      labels: { inButton: 'Dans d’autres composants' },
    },
    badge: {
      lead: 'Chip / étiquette de statut avec une API couleur × variante façon HeroUI. Sans logique, pur theming : six couleurs, six variantes, deux tailles et une échelle de rayon.',
      apiCaption: 'Inputs de dm-badge',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-badge</code> avec le token <code>BADGE_DEFAULTS</code> ou le helper <code>provideBadgeDefaults</code> :',
      a11yItems: [
        'Contenu texte simple : lu naturellement par les lecteurs d’écran.',
        'La variante <code>dot</code> ajoute un marqueur redondant pour que la couleur ne soit pas le seul porteur d’état.',
      ],
      api: {
        color: 'Couleur sémantique.',
        variant: 'Variante visuelle : solid, flat, bordered, light, dot, shadow.',
        size: 'Échelle de taille.',
        radius: 'Arrondi des coins : sm, md, lg, full (pilule).',
      },
      labels: { colorsHeading: 'Couleurs', dotHeading: 'Variante dot' },
    },
    card: {
      lead: 'Primitive de surface. Déclare <code>container-type: inline-size</code> : son contenu peut utiliser des container queries contre la carte plutôt que le viewport.',
      apiCaption: 'Inputs de dm-card',
      defaultsDesc:
        'Changez les defaults de toutes les <code>dm-card</code> avec le token <code>CARD_DEFAULTS</code> ou le helper <code>provideCardDefaults</code> :',
      a11yItems: [
        'La carte est un conteneur neutre ; si toute la carte est cliquable, enveloppez-la dans un lien ou un bouton pour une vraie sémantique et un vrai focus.',
        'Le hover lift respecte reduced-motion via les tokens de durée.',
      ],
      api: {
        appearance: 'Traitement de surface : elevated, outlined ou flat.',
        padding: 'Échelle de padding interne.',
        interactive: 'Hover lift pour les cartes cliquables.',
      },
      labels: {
        interactiveHeading: 'Interactive',
        cardTitle: 'Titre de la carte',
        cardBody: 'Les cartes sont la surface de base pour regrouper du contenu lié.',
      },
    },
    avatar: {
      lead: 'Avatar avec chaîne de fallback automatique : image → initiales → icône générique. Une image en erreur bascule en silence ; changer <code>src</code> réessaie.',
      apiCaption: 'Inputs de dm-avatar',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-avatar</code> avec le token <code>AVATAR_DEFAULTS</code> ou le helper <code>provideAvatarDefaults</code> :',
      a11yItems: [
        'Avec image : <code>&lt;img alt&gt;</code> standard.',
        'Les fallbacks exposent <code>role="img"</code> + <code>aria-label</code> (alt → initiales).',
      ],
      api: {
        src: 'URL de l’image. En erreur, bascule sur les initiales (puis l’icône).',
        alt: 'Alt de l’image / libellé du fallback.',
        initials: 'Affichées sans image (valide).',
        size: 'Taille nommée (2 / 2.5 / 3rem), pixels (nombre) ou longueur CSS.',
        shape: 'Cercle ou carré.',
      },
      labels: { fallbackHeading: 'Chaîne de fallback' },
    },
    switch: {
      lead: 'Interrupteur (<code>role="switch"</code>). Fonctionne seul avec <code>[(checked)]</code> et avec Angular forms via <code>ControlValueAccessor</code>. Le playground de cette documentation l’utilise.',
      apiCaption: 'Inputs de dm-switch',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-switch</code> avec le token <code>SWITCH_DEFAULTS</code> ou le helper <code>provideSwitchDefaults</code> :',
      a11yItems: [
        '<code>role="switch"</code> + <code>aria-checked</code> ; le contenu projeté devient le libellé via <code>aria-labelledby</code>.',
        'Sans libellé projeté, passez <code>ariaLabel</code>.',
        'Cible tactile ≥44px ; le mouvement du curseur respecte reduced-motion.',
      ],
      api: {
        checked: 'État two-way : [(checked)] / (checkedChange).',
        disabled: 'Combiné avec l’état disabled des forms.',
        size: 'Échelle de taille.',
        inputId: 'Id du bouton interne, pour label[for] externe.',
        ariaLabel: 'Nom accessible sans libellé projeté.',
      },
      labels: { notifications: 'Notifications par email', formValue: 'Valeur du form' },
    },
    checkbox: {
      lead: 'Case à cocher sur un <code>&lt;input type="checkbox"&gt;</code> natif réel (sémantique de formulaire intacte) avec boîte custom. Supporte l’indéterminé et Angular forms via <code>ControlValueAccessor</code>.',
      apiCaption: 'Inputs de dm-checkbox',
      a11yItems: [
        'Input natif réel : clavier, focus et sémantique de formulaire gratuits ; le contenu projeté est un vrai label.',
        'L’indéterminé expose <code>aria-checked="mixed"</code>.',
        'Cible tactile ≥44px ; l’animation de la coche respecte reduced-motion.',
      ],
      api: {
        checked: 'État two-way : [(checked)] / (checkedChange).',
        indeterminate: 'État mixte visuel tant que non coché.',
        disabled: 'Combiné avec l’état disabled des forms.',
        inputId: 'Id de l’input natif, pour label[for] externe.',
        ariaLabel: 'Nom accessible sans libellé projeté.',
      },
      labels: {
        terms: 'J’accepte les conditions générales',
        indeterminateHeading: 'Indéterminé',
        selectAll: 'Tout sélectionner',
      },
    },
    formField: {
      lead: 'Champ de formulaire composé : label + contrôle natif projeté (<code>dmInput</code>) + hint/erreur. Câble <code>id</code>, <code>for</code>, <code>aria-describedby</code> et <code>aria-invalid</code> automatiquement.',
      apiCaption: 'Inputs de dm-form-field',
      a11yItems: [
        'Le label est associé au contrôle avec <code>for</code> ; hint et erreur passent par <code>aria-describedby</code>.',
        'L’erreur utilise <code>role="alert"</code> et met l’input en <code>aria-invalid="true"</code>.',
        'L’affichage des erreurs est volontairement explicite : le consommateur décide quand montrer quel message.',
      ],
      api: {
        label: 'Libellé visible, associé avec for.',
        hint: 'Texte d’aide (masqué pendant l’erreur).',
        error: 'Texte d’erreur ; non vide active l’état d’erreur.',
        required: 'Affiche le marqueur * (mettez aussi required sur l’input).',
        dmInput:
          'Directive d’attribut qui applique le style de champ aux input/textarea/select natifs.',
      },
      labels: {
        emailLabel: 'Email',
        emailHint: 'Nous ne partageons jamais votre email.',
        emailError: 'Saisissez un email valide.',
        messageLabel: 'Message',
        withTextarea: 'Avec textarea',
      },
    },
    select: {
      lead: 'Dropdown de sélection simple avec une API couleur × variante façon HeroUI. Support clavier complet (flèches, Home/End, Enter, Escape, typeahead), panneau CDK ancré au trigger avec la même largeur, et intégration Reactive Forms via <code>ControlValueAccessor</code>.',
      apiCaption: 'Inputs de dm-select',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-select</code> avec le token <code>SELECT_DEFAULTS</code> ou le helper <code>provideSelectDefaults</code> :',
      a11yItems: [
        'Déclencheur avec <code>role="combobox"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code>, <code>aria-controls</code>, <code>aria-activedescendant</code>.',
        'Panneau avec <code>role="listbox"</code> ; chaque option porte <code>aria-selected</code> et <code>aria-disabled</code>.',
        'Clavier complet : Enter/Espace ouvrent (ou sélectionnent), Escape ferme, ArrowUp/Down déplacent, Home/End sautent, Tab sort normalement, les caractères imprimables déclenchent le typeahead.',
        'Les items disabled sont ignorés par le clavier et ne peuvent pas être cliqués.',
      ],
      api: {
        items: 'Tableau de { value, label, description?, disabled? } rendu dans le panneau.',
        value: 'État two-way : [(value)] / (valueChange).',
        label: 'Libellé visible au-dessus du déclencheur.',
        placeholder: 'Affiché tant que rien n’est sélectionné.',
        description: 'Texte d’aide sous le déclencheur.',
        error: 'Non vide active l’état invalide.',
        disabled: 'Combiné avec l’état disabled des forms.',
        required: 'Affiche le marqueur * et pose aria-required.',
        color: 'Couleur sémantique du ring de focus et de l’item sélectionné.',
        variant: 'Surface du déclencheur : flat, bordered, faded, underlined.',
        size: 'Hauteur du déclencheur (32 / 40 / 48px).',
        radius: 'Arrondi des coins.',
        ariaLabel: 'Nom accessible sans libellé visible.',
        clearable:
          'Affiche un bouton × pour effacer la sélection. Clavier : Suppr / Retour arrière.',
        clearAriaLabel:
          'Libellé ARIA du bouton d’effacement (localiser dans les apps multilingues).',
      },
      labels: {
        pet: 'Animal',
        pickOne: 'Choisissez-en un',
        petHint: 'Seuls ces animaux sont couverts par l’assurance.',
        formsHeading: 'Reactive Forms',
        formValue: 'Valeur du form',
        clearableHeading: 'Effaçable',
      },
    },
    paginatedSelect: {
      lead: 'Dropdown de sélection simple qui charge les options par pages — scroll infini ou bouton « Charger plus » — avec recherche optionnelle. Passez un <code>loadFn</code> et le composant gère tout : chargement initial, pagination, recherche avec debounce et état. Compatible avec REST, GraphQL, RxJS, TanStack ou toute source asynchrone.',
      apiCaption: 'Inputs de dm-paginated-select',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-paginated-select</code> avec le token <code>PAGINATED_SELECT_DEFAULTS</code> ou le helper <code>providePaginatedSelectDefaults</code> :',
      a11yItems: [
        'Déclencheur avec <code>role="combobox"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code>, <code>aria-controls</code>, <code>aria-activedescendant</code>.',
        'Panneau avec <code>role="listbox"</code> et <code>aria-busy</code> pendant le chargement ; chaque option porte <code>aria-selected</code> / <code>aria-disabled</code>.',
        "L'input de recherche prend le focus à l'ouverture du panneau (si <code>searchable</code>) ; les flèches/Enter/Escape pilotent toujours le listbox depuis l'input.",
        'Les items disabled sont ignorés par le clavier ; l\'état de chargement est annoncé via un <code>role="status"</code> live region masqué visuellement.',
      ],
      api: {
        loadFn:
          "Fonction de chargement requise : <code>(params) =&gt; Promise&lt;&#123; items, total &#125;&gt;</code>. Appelée à l'ouverture, au scroll/bouton et à chaque recherche. Reçoit <code>&#123; page, pageSize, query &#125;</code>.",
        pageSize: 'Items par page passés au loadFn. Défaut 20.',
        value: 'État two-way : [(value)] / (valueChange).',
        selectedItem:
          "L'item sélectionné quand il peut ne pas être dans la page actuelle (p. ex. sélectionné en page 1, maintenant en page 5). Utilisé pour rendre le label du déclencheur.",
        searchable: "Active l'input de recherche dans le panneau.",
        searchPlaceholder: "Placeholder de l'input de recherche.",
        searchDebounceMs:
          'Millisecondes de repos avant de recharger avec la nouvelle recherche. Défaut 250.',
        loadMoreMode: '« infinite » (IntersectionObserver sur la dernière ligne) ou « button ».',
        loadMoreLabel: 'Libellé du bouton « Charger plus » (uniquement en loadMoreMode="button").',
        loadingLabel: 'Libellé annoncé par la ligne de chargement / live region.',
        emptyLabel: "Message affiché quand il n'y a aucun résultat après le chargement.",
        color: "Couleur sémantique du ring de focus et de l'item sélectionné.",
        variant: 'Surface du déclencheur : flat, bordered, faded, underlined.',
        size: 'Hauteur du déclencheur (32 / 40 / 48px).',
        radius: 'Arrondi des coins.',
        clearable:
          'Affiche un bouton × pour effacer la sélection. Clavier : Suppr / Retour arrière.',
        clearAriaLabel:
          "Libellé ARIA du bouton d'effacement (localiser dans les apps multilingues).",
      },
      labels: {
        assignee: 'Assigné',
        pickOne: 'Choisissez un utilisateur',
        searchPlaceholder: 'Rechercher des utilisateurs…',
        loading: 'Chargement…',
        loadMore: 'Charger plus',
        emptyLabel: 'Aucun résultat',
        loadFnDesc: 'Définissez un loadFn qui retourne les items et le total de chaque page :',
        infiniteHeading: 'Scroll infini + recherche',
        buttonHeading: 'Bouton « Charger plus »',
        searchHeading: 'Avec recherche',
        clearableHeading: 'Effaçable',
      },
    },
    tooltip: {
      lead: 'Tooltip texte sur n’importe quel élément, construit sur le CDK Overlay. Apparaît au survol (avec délai) et au focus clavier (immédiat) ; Escape le ferme ; il bascule s’il manque de place.',
      apiCaption: 'Inputs et defaults de dmTooltip',
      defaultsDesc:
        'La position et les délais se configurent par app avec <code>TOOLTIP_DEFAULTS</code> ou <code>provideTooltipDefaults</code> :',
      a11yItems: [
        'Panneau avec <code>role="tooltip"</code>, référencé depuis le déclencheur via <code>aria-describedby</code> tant qu’il est visible.',
        'Clavier : apparaît au focus, disparaît au blur et avec Escape.',
        'L’animation d’entrée respecte reduced-motion via les tokens de durée.',
      ],
      api: {
        dmTooltip: 'Texte du tooltip (requis). Vide → jamais affiché.',
        dmTooltipPosition: 'Position préférée ; bascule seule : top, bottom, left, right.',
        showDelay: 'Délai de survol avant affichage (300ms). Default global.',
        hideDelay: 'Délai avant masquage (100ms). Default global.',
      },
      labels: { trigger: 'Survolez ou focalisez-moi' },
    },
    dialog: {
      lead: 'Service de dialogue modal, fine surcouche du CDK Dialog : focus trap, Escape/backdrop et <code>aria-modal</code> viennent du CDK ; le panneau porte le look de la librairie. Requiert <code>overlay-prebuilt.css</code> une fois par app.',
      apiCaption: 'Options de DmDialogConfig',
      a11yItems: [
        'Focus trap et restitution du focus à la fermeture (CDK).',
        '<code>role="dialog"</code> + <code>aria-modal="true"</code> ; nommez-le avec <code>ariaLabel</code>.',
        'Escape et clic sur le backdrop le ferment sauf avec <code>disableClose</code>.',
      ],
      api: {
        data: 'Injecté dans le composant de contenu via DIALOG_DATA.',
        size: 'Largeur du panneau : sm 22rem, md 30rem, lg 42rem.',
        disableClose: 'Bloque backdrop et Escape.',
        ariaLabel: 'Nom accessible du dialogue.',
      },
      labels: {
        open: 'Ouvrir le dialogue',
        demoTitle: 'Supprimer le composant ?',
        demoBody: 'Cette action est irréversible. Le composant sera retiré de la librairie.',
        cancel: 'Annuler',
        confirm: 'Supprimer',
        result: 'Dernier résultat',
      },
    },
    toast: {
      lead: 'File de notifications. Les toasts s’empilent en bas à droite, se ferment automatiquement (configurable) et sont annoncés sans interrompre. Requiert <code>overlay-prebuilt.css</code> une fois par app.',
      apiCaption: 'DmToastOptions',
      defaultsDesc:
        'La durée, le bouton de fermeture et son aria-label (le seul texte intégré de la librairie) se configurent avec <code>TOAST_DEFAULTS</code> ou <code>provideToastDefaults</code> :',
      a11yItems: [
        'Chaque toast est <code>role="status"</code> : annoncé sans interrompre l’utilisateur.',
        'Le bouton de fermeture a un <code>aria-label</code> configurable et une cible tactile ≥44px.',
        'L’animation d’entrée respecte reduced-motion via les tokens de durée.',
      ],
      api: {
        variant: 'Couleur sémantique + icône : neutral, success, warning, danger.',
        duration: 'Fermeture auto en ms ; 0 la désactive.',
        dismissible: 'Affiche le bouton de fermeture.',
      },
      labels: {
        show: 'Afficher le toast',
        helpers: 'Helpers par variante',
        message: 'Modifications enregistrées',
        sticky: 'Toast persistant (duration 0)',
      },
    },
    accordion: {
      lead: 'Sections verticales repliables. Sélection single ou multiple, quatre variantes visuelles et animation CSS-only qui respecte <code>prefers-reduced-motion</code>.',
      apiCaption: 'Inputs de dm-accordion / dm-accordion-item',
      defaultsDesc:
        'Modifiez les defaults avec le token <code>ACCORDION_DEFAULTS</code> ou le helper <code>provideAccordionDefaults</code>.',
      a11yItems: [
        'Le header est un <code>&lt;button&gt;</code> natif avec <code>aria-expanded</code> et <code>aria-controls</code> ; le panel est <code>role="region"</code> étiqueté par le header.',
        'Quand fermé, le panel porte <code>aria-hidden="true"</code> et <code>inert</code> — les lecteurs d’écran l’ignorent et le focus ne peut pas y entrer.',
        'Clavier : <kbd>Entrée</kbd>/<kbd>Espace</kbd> togglent ; <kbd>Flèche↓</kbd>/<kbd>Flèche↑</kbd> déplacent le focus ; <kbd>Home</kbd>/<kbd>End</kbd> sautent au premier/dernier.',
      ],
      api: {
        selectionMode: 'single : un ouvert à la fois ; multiple : toute combinaison.',
        expandedValues: 'string[] two-way des items ouverts.',
        variant: 'Style visuel : light, bordered, shadow, splitted.',
        disabled: 'Désactive tous les items en même temps.',
        value: 'Identifiant de l’item (requis par item).',
        title: 'Texte du header de l’item.',
        subtitle: 'Ligne secondaire optionnelle sous le titre.',
        icon: 'Icône de tête (projection de contenu). Utiliser width="1em" height="1em" sur SVG pour hériter font-size.',
      },
      labels: {
        single: 'Sélection single',
        multiple: 'Sélection multiple',
        variants: 'Variantes',
        icon: 'Avec slot icône',
        disabled: 'Item désactivé',
      },
    },
    radioGroup: {
      lead: 'Radio group avec roving tabindex et navigation clavier complète. Standalone via <code>[(value)]</code> ou avec Angular forms via <code>ControlValueAccessor</code>.',
      apiCaption: 'Inputs de dm-radio-group / dm-radio',
      defaultsDesc:
        'Modifiez les defaults avec le token <code>RADIO_DEFAULTS</code> ou le helper <code>provideRadioDefaults</code>.',
      a11yItems: [
        'Le host est <code>role="radiogroup"</code> ; chaque item est <code>role="radio"</code> avec <code>aria-checked</code>.',
        'Roving tabindex : <kbd>Tab</kbd> entre dans le groupe une fois ; les flèches déplacent et sélectionnent ; <kbd>Home</kbd>/<kbd>End</kbd> sautent.',
        'Un <code>&lt;input name&gt;</code> caché sérialise la valeur dans un <code>&lt;form&gt;</code> natif.',
      ],
      api: {
        name: 'Nom du contrôle (requis pour la soumission native).',
        value: 'Valeur sélectionnée (two-way).',
        color: 'Couleur sémantique de l’état checked.',
        size: 'Taille du contrôle (sm, md, lg).',
        orientation: 'Layout : vertical ou horizontal.',
        disabled: 'Désactive tout le groupe.',
        radioValue: 'Valeur du radio individuel (requis par item).',
      },
      labels: {
        colors: 'Couleurs',
        horizontal: 'Horizontal',
        forms: 'Avec Angular forms',
      },
    },
    tabs: {
      lead: "Tabs avec navigation clavier complète, cinq variantes visuelles et placement horizontal ou vertical. Couleurs mappées depuis la palette sémantique. La variante <code>segment</code> s'affiche comme un contrôle segmenté style iOS.",
      apiCaption: 'Inputs de dm-tabs / dm-tab / dm-tab-panel',
      defaultsDesc:
        'Modifiez les defaults avec le token <code>TABS_DEFAULTS</code> ou le helper <code>provideTabsDefaults</code>.',
      a11yItems: [
        'Tablist est <code>role="tablist"</code> ; tabs <code>role="tab"</code> ; panneaux <code>role="tabpanel"</code> avec <code>aria-labelledby</code>.',
        'Roving tabindex + flèches (horizontales ou verticales selon <code>placement</code>). <kbd>Home</kbd>/<kbd>End</kbd> sautent au premier/dernier activé.',
        'Les tabs désactivés sont ignorés par la navigation clavier et ne peuvent pas être activés au clic.',
      ],
      api: {
        selectedValue: 'Valeur du tab actif (two-way).',
        color: 'Couleur sémantique du tab actif.',
        variant: 'Style visuel : solid, bordered, light, underlined, segment.',
        size: 'Hauteur et padding du tab (sm, md, lg).',
        radius: 'Arrondi des coins ; underlined l’ignore.',
        placement: 'top (horizontal) ou start (vertical).',
        fullWidth: 'Étire les tabs pour partager toute la largeur (activé par défaut).',
        divider: 'Règle séparatrice sous la tablist (light / underlined).',
        tabValue: 'Valeur du tab individuel (requis par tab).',
        panelValue: 'Valeur du panneau — doit correspondre au tab.',
        disabled: 'Désactive un tab.',
      },
      labels: {
        variants: 'Variantes',
        segment: 'Segment (contrôle segmenté)',
        segmentIcons: 'Segment avec icônes',
        vertical: 'Placement vertical',
        colors: 'Couleurs',
        fullWidth: 'Pleine largeur',
        disabled: 'Tab désactivé',
      },
    },
    table: {
      lead: 'Une table premium data-driven. Par défaut elle recherche, trie, sélectionne et pagine — le tout en interne et contrôlable via des two-way models. Compose <code>dm-checkbox</code> pour la sélection et <code>dm-skeleton</code> pour le chargement, sur du HTML sémantique.',
      apiCaption: 'Inputs et outputs de dm-table',
      defaultsDesc:
        'Modifiez les defaults avec le token <code>TABLE_DEFAULTS</code> ou le helper <code>provideTableDefaults</code>.',
      a11yItems: [
        '<code>&lt;table&gt;</code>, <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;th scope="col"&gt;</code> sémantiques, <code>&lt;caption&gt;</code> optionnel — lus nativement par les lecteurs d’écran.',
        'Les colonnes triables exposent <code>aria-sort</code> ; les lignes sélectionnées <code>aria-selected</code> ; la table marque <code>aria-busy</code> pendant le chargement.',
        'La recherche est un vrai <code>&lt;input type="search"&gt;</code> ; les cases de sélection et les boutons de pagination portent des ARIA labels — tout est surchargeable pour l’i18n.',
      ],
      api: {
        columns: 'Tableau de définitions de colonnes.',
        data: 'Le dataset COMPLET — la table dérive les lignes visibles.',
        rowKey: 'Identité de ligne (row, i) => key. Requise pour une sélection fiable.',
        density: 'compact, comfortable (par défaut) ou spacious.',
        variant: 'default, striped ou bordered.',
        hover: 'Met en surbrillance les lignes au hover.',
        sticky: 'Le header reste collé au scroll du conteneur.',
        caption: 'Caption de la table (screen-reader friendly).',
        searchable: 'Affiche la recherche et filtre les lignes.',
        searchTerm: 'Terme de recherche (two-way).',
        selectionMode: 'Sélection : none, single ou multiple.',
        selectedKeys: 'Tableau des keys sélectionnées (two-way).',
        pageSize: 'Lignes par page ; 0 désactive la pagination.',
        page: 'Page courante 1-indexed (two-way).',
        pageSizeOptions: 'Options du sélecteur de lignes par page.',
        loading: 'Affiche l’état de chargement (skeletons).',
        sortState: 'État actuel ({column, direction}) ; two-way.',
        manualProcessing: 'Désactive le filtre/tri/pagination interne (server-side).',
        rowClick: 'Émet {row, index} au clic sur une ligne.',
        sortChange: 'Émet quand le tri change.',
        selectionChange: 'Émet avec les lignes sélectionnées.',
        pageChange: 'Émet quand la page ou la taille change.',
        searchChange: 'Émet quand le terme de recherche change.',
      },
      labels: {
        fullFeatured: 'Rechercher, sélectionner & paginer',
        selection: 'Sélection de lignes',
        pagination: 'Pagination',
        densities: 'Densités',
        variants: 'Variantes',
        states: 'États de chargement et vide',
        searchPlaceholder: 'Rechercher des membres…',
        rowsPerPage: 'Lignes par page',
        empty: 'Aucun membre pour l’instant',
        noResults: 'Aucun membre ne correspond à votre recherche',
        toggleLoading: 'Basculer le chargement',
        nothingSelected: 'Aucune ligne sélectionnée',
        selectedPrefix: 'Sélectionnées',
      },
    },
  },
};
