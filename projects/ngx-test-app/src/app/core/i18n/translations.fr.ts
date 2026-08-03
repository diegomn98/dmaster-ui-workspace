import { DashboardTranslations } from './translations.types';

export const FR: DashboardTranslations = {
  shell: {
    navAria: 'Composants',
    openNav: 'Ouvrir la navigation',
    closeNav: 'Fermer la navigation',
    switchToLight: 'Passer au thème clair',
    switchToDark: 'Passer au thème sombre',
    languageLabel: 'Langue',
    nav: {
      intro: 'Introduction',
      home: 'Accueil',
      overview: 'Aperçu',
      primitives: 'Primitives',
      layout: 'Layout',
      buttons: 'Boutons',
      forms: 'Formulaires',
      overlays: 'Overlays',
      skeleton: 'Skeleton',
      spinner: 'Spinner',
      badge: 'Badge',
      avatar: 'Avatar',
      card: 'Card',
      loadingButton: 'Loading Button',
      switch: 'Switch',
      checkbox: 'Checkbox',
      formField: 'Form Field',
      tooltip: 'Tooltip',
      dialog: 'Dialog',
      toast: 'Toast',
    },
  },
  common: {
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
    copyCode: 'Copier le code',
    copied: 'Copié',
    playgroundControls: 'Contrôles du playground',
    api: { name: 'Nom', type: 'Type', default: 'Défaut', description: 'Description' },
  },
  home: {
    subtitle:
      'Librairie de composants Angular modernes. Standalone, signals, theming par variables CSS, dark mode et responsive dès le premier composant.',
    cta: 'Voir les composants',
    featuresAria: 'Fonctionnalités',
    features: {
      signalsTitle: "Signals d'abord",
      signalsBody:
        'API construite avec <code>input()</code>, <code>output()</code> et <code>model()</code>. <code>OnPush</code> par défaut et compatible zoneless.',
      themingTitle: 'Theming réel',
      themingBody:
        'Custom properties CSS comme unique source de theming : tokens <code>--dm-*</code>, light et dark, et densités <code>compact · comfortable · spacious</code>.',
      responsiveTitle: 'Responsive par défaut',
      responsiveBody:
        'Mobile-first, container queries quand elles apportent, cibles tactiles de 44px et respect de <code>prefers-reduced-motion</code>.',
    },
    startTitle: 'Démarrer',
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
  loadingButtonPage: {
    lead: 'Bouton avec états de chargement, succès et erreur intégrés. Largeur stable (pas de layout shift), spinner incorporé, désactivé pendant le chargement et annonces aux lecteurs d’écran via une live region.',
    demos: {
      variants: 'Variantes',
      sizes: 'Tailles',
      states: 'États',
      async: 'Action asynchrone simulée',
    },
    apiCaption: 'Inputs et outputs de dm-loading-button',
    defaultsDesc:
      'Changez les defaults de tous les <code>dm-loading-button</code> avec le token <code>LOADING_BUTTON_DEFAULTS</code> ou le helper <code>provideLoadingButtonDefaults</code> :',
    a11yItems: [
      'Pendant le chargement, le bouton interne pose <code>aria-busy="true"</code> et <code>disabled</code>, évitant les envois en double.',
      'Les changements d’état sont annoncés via une région <code>aria-live="polite"</code> masquée visuellement, avec les textes <code>loadingLabel</code> / <code>successLabel</code> / <code>errorLabel</code> que vous fournissez.',
      'Le libellé conserve son espace pendant l’affichage du spinner : le bouton ne change jamais de taille (pas de layout shift).',
      'Avec <code>prefers-reduced-motion: reduce</code>, le spinner cesse de tourner et les transitions deviennent instantanées.',
    ],
    api: {
      variant: 'Style visuel du bouton.',
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
      lead: 'Étiquette de statut construite sur les tokens sémantiques. Sans logique, pur theming : variantes, apparences, deux tailles, pill et point de statut.',
      apiCaption: 'Inputs de dm-badge',
      defaultsDesc:
        'Changez les defaults de tous les <code>dm-badge</code> avec le token <code>BADGE_DEFAULTS</code> ou le helper <code>provideBadgeDefaults</code> :',
      a11yItems: [
        'Contenu texte simple : lu naturellement par les lecteurs d’écran.',
        'L’input <code>dot</code> ajoute un marqueur redondant pour que la couleur ne soit pas le seul porteur d’état.',
      ],
      api: {
        variant: 'Couleur sémantique.',
        appearance: 'Traitement visuel : subtle, solid ou outline.',
        size: 'Échelle de taille.',
        pill: 'Coins entièrement arrondis.',
        dot: 'Point de statut en tête.',
      },
      labels: { dotHeading: 'Avec point de statut' },
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
  },
};
