import { DashboardTranslations } from './translations.types';

export const EN: DashboardTranslations = {
  shell: {
    navAria: 'Components',
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    languageLabel: 'Language',
    nav: {
      intro: 'Introduction',
      home: 'Home',
      overview: 'Overview',
      primitives: 'Primitives',
      layout: 'Layout',
      buttons: 'Buttons',
      forms: 'Forms',
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
    playgroundDesc: 'Tweak the inputs live and copy the resulting snippet.',
    examplesTitle: 'Examples',
    apiTitle: 'API',
    defaultsTitle: 'Global defaults',
    a11yTitle: 'Accessibility',
    demos: {
      basic: 'Basic',
      variants: 'Variants',
      sizes: 'Sizes',
      states: 'States',
      appearances: 'Appearances',
      positions: 'Positions',
      withLabel: 'With label',
      forms: 'Reactive Forms',
      composition: 'Composition',
    },
  },
  shared: {
    copyCode: 'Copy code',
    copied: 'Copied',
    playgroundControls: 'Playground controls',
    api: { name: 'Name', type: 'Type', default: 'Default', description: 'Description' },
  },
  home: {
    subtitle:
      'Modern Angular component library. Standalone, signals, CSS-variable theming, dark mode and responsive from the very first component.',
    cta: 'Browse components',
    featuresAria: 'Features',
    features: {
      signalsTitle: 'Signals first',
      signalsBody:
        'API built with <code>input()</code>, <code>output()</code> and <code>model()</code>. <code>OnPush</code> by default and zoneless-ready.',
      themingTitle: 'Real theming',
      themingBody:
        'CSS custom properties as the single theming source: <code>--dm-*</code> tokens, light and dark, and <code>compact · comfortable · spacious</code> densities.',
      responsiveTitle: 'Responsive by default',
      responsiveBody:
        'Mobile-first, container queries where they help, 44px touch targets and <code>prefers-reduced-motion</code> support.',
    },
    startTitle: 'Get started',
  },
  skeletonPage: {
    lead: 'Loading placeholder that mirrors the shape of the content it replaces. No Angular Material dependency, accessible by default, with animations that honor <code>prefers-reduced-motion</code>.',
    demos: {
      basic: 'Basic',
      variants: 'Variants',
      animations: 'Animations',
      paragraph: 'Paragraph (count)',
      card: 'Composition: profile card',
      fluid: 'Fluid sizes',
    },
    apiCaption: 'dm-skeleton inputs',
    defaultsDesc:
      'Change the defaults of every <code>dm-skeleton</code> in the app with the <code>SKELETON_DEFAULTS</code> token or the <code>provideSkeletonDefaults</code> helper:',
    a11yItems: [
      'The host exposes <code>role="status"</code>, <code>aria-busy="true"</code> and <code>aria-live="polite"</code>: screen readers announce the loading state without interrupting.',
      'With <code>prefers-reduced-motion: reduce</code> both animations are disabled and the placeholder stays static.',
      'Accepts fluid sizes (<code>%</code>, <code>clamp()</code>, <code>vw</code>); with no explicit size it fills 100% of its container.',
    ],
    api: {
      variant: 'Shape of the placeholder.',
      width:
        'Width. Number → px; string passed through (%, rem, clamp()…). Unset, it fills 100% of the container.',
      height:
        'Height. Unset, uses the per-variant default: 1em (text), 6rem (rectangular/rounded), 2.5rem (circular).',
      animation: 'Loading animation. none renders a static placeholder.',
      rounded: 'Border-radius scale, applies with variant="rounded".',
      count:
        'Number of rendered lines/blocks (min 1). With variant="text" the last line is automatically shortened.',
    },
  },
  loadingButtonPage: {
    lead: 'Button with built-in loading, success and error states. Stable width (no layout shift), integrated spinner, disabled while loading and screen-reader announcements via a polite live region.',
    demos: {
      variants: 'Variants',
      sizes: 'Sizes',
      states: 'States',
      async: 'Simulated async action',
    },
    apiCaption: 'dm-loading-button inputs and outputs',
    defaultsDesc:
      'Change the defaults of every <code>dm-loading-button</code> with the <code>LOADING_BUTTON_DEFAULTS</code> token or the <code>provideLoadingButtonDefaults</code> helper:',
    a11yItems: [
      'While loading, the internal button sets <code>aria-busy="true"</code> and <code>disabled</code>, preventing duplicate submissions.',
      'State changes are announced through a visually hidden <code>aria-live="polite"</code> region using the <code>loadingLabel</code> / <code>successLabel</code> / <code>errorLabel</code> texts you provide.',
      'The label keeps its space while the spinner shows: the button never changes size (no layout shift).',
      'With <code>prefers-reduced-motion: reduce</code> the spinner stops animating and transitions become instant.',
    ],
    api: {
      variant: 'Visual style of the button.',
      size: 'Control size; heights follow the global density tokens.',
      state:
        'Current state. loading disables the button and shows the spinner; success/error flash an icon.',
      type: 'Native button type.',
      disabled: 'Disables the button (it is also disabled automatically while loading).',
      loadingLabel:
        'Text announced to screen readers while loading (the library ships no copy of its own).',
      successLabel: 'Text announced on success.',
      errorLabel: 'Text announced on error.',
      clicked: 'Emitted on click, only while the button is interactive (not disabled nor loading).',
    },
    asyncButtonLabel: 'Save changes',
  },
  pages: {
    overview: {
      lead: 'Every component in the library, live. Built with signals, themed with CSS variables, accessible by default — open any tile to see its docs, playground and API.',
      apiCaption: '',
      a11yItems: [],
      api: {},
      labels: { count: 'components', open: 'Open docs' },
    },
    spinner: {
      lead: 'Indeterminate loading indicator. Inherits <code>currentColor</code>, so it adapts to any surface — buttons, inputs, empty states — without extra inputs.',
      apiCaption: 'dm-spinner inputs',
      defaultsDesc:
        'Change the defaults of every <code>dm-spinner</code> with the <code>SPINNER_DEFAULTS</code> token or the <code>provideSpinnerDefaults</code> helper:',
      a11yItems: [
        'Without <code>label</code> it is decorative (<code>aria-hidden="true"</code>): the surrounding context announces loading.',
        'With <code>label</code> it exposes <code>role="status"</code> + <code>aria-label</code>.',
        'With <code>prefers-reduced-motion: reduce</code> the rotation stops (static arc).',
      ],
      api: {
        size: 'Named size (sm 1rem, md 1.5rem, lg 2rem), pixels (number) or any CSS length.',
        strokeWidth: 'Stroke width in viewBox units (24).',
        label: 'Accessible label. Empty → decorative.',
      },
      labels: { inButton: 'Inside other components' },
    },
    badge: {
      lead: 'Status label built on the semantic status tokens. No logic, pure theming: variants, appearances, two sizes, pill and status dot.',
      apiCaption: 'dm-badge inputs',
      defaultsDesc:
        'Change the defaults of every <code>dm-badge</code> with the <code>BADGE_DEFAULTS</code> token or the <code>provideBadgeDefaults</code> helper:',
      a11yItems: [
        'Plain text content: read naturally by screen readers.',
        'The <code>dot</code> input adds a redundant marker so color is not the only state carrier.',
      ],
      api: {
        variant: 'Semantic color.',
        appearance: 'Visual treatment: subtle, solid or outline.',
        size: 'Size scale.',
        pill: 'Fully rounded corners.',
        dot: 'Leading status dot.',
      },
      labels: { dotHeading: 'With status dot' },
    },
    card: {
      lead: 'Surface primitive. Declares <code>container-type: inline-size</code>, so its content can use container queries against the card instead of the viewport.',
      apiCaption: 'dm-card inputs',
      defaultsDesc:
        'Change the defaults of every <code>dm-card</code> with the <code>CARD_DEFAULTS</code> token or the <code>provideCardDefaults</code> helper:',
      a11yItems: [
        'The card is a neutral container; if the whole card is clickable, wrap it in a link or button so it gets real semantics and focus.',
        'The hover lift honors reduced-motion via the duration tokens.',
      ],
      api: {
        appearance: 'Surface treatment: elevated, outlined or flat.',
        padding: 'Inner padding scale.',
        interactive: 'Hover lift for clickable cards.',
      },
      labels: {
        interactiveHeading: 'Interactive',
        cardTitle: 'Card title',
        cardBody: 'Cards are the base surface for grouping related content.',
      },
    },
    avatar: {
      lead: 'Avatar with an automatic fallback chain: image → initials → generic icon. A failed image load falls back silently; changing <code>src</code> retries.',
      apiCaption: 'dm-avatar inputs',
      defaultsDesc:
        'Change the defaults of every <code>dm-avatar</code> with the <code>AVATAR_DEFAULTS</code> token or the <code>provideAvatarDefaults</code> helper:',
      a11yItems: [
        'With image: standard <code>&lt;img alt&gt;</code>.',
        'Fallbacks expose <code>role="img"</code> + <code>aria-label</code> (alt → initials).',
      ],
      api: {
        src: 'Image URL. Falls back to initials (then icon) on error.',
        alt: 'Alt for the image / label for the fallback.',
        initials: 'Shown when there is no (working) image.',
        size: 'Named size (2 / 2.5 / 3rem), pixels (number) or CSS length.',
        shape: 'Circle or square.',
      },
      labels: { fallbackHeading: 'Fallback chain' },
    },
    switch: {
      lead: 'Toggle switch (<code>role="switch"</code>). Works standalone with <code>[(checked)]</code> and with Angular forms via <code>ControlValueAccessor</code>. The playground of this very docs app uses it.',
      apiCaption: 'dm-switch inputs',
      defaultsDesc:
        'Change the defaults of every <code>dm-switch</code> with the <code>SWITCH_DEFAULTS</code> token or the <code>provideSwitchDefaults</code> helper:',
      a11yItems: [
        '<code>role="switch"</code> + <code>aria-checked</code>; the projected content becomes the label via <code>aria-labelledby</code>.',
        'Without a projected label, pass <code>ariaLabel</code>.',
        '≥44px touch target; thumb motion honors reduced-motion.',
      ],
      api: {
        checked: 'Two-way state: [(checked)] / (checkedChange).',
        disabled: 'Combined with the forms disabled state.',
        size: 'Size scale.',
        inputId: 'Id of the internal button, for external label[for].',
        ariaLabel: 'Accessible name when no label content is projected.',
      },
      labels: { notifications: 'Email notifications', formValue: 'Form value' },
    },
    checkbox: {
      lead: 'Checkbox built on a real native <code>&lt;input type="checkbox"&gt;</code> (form semantics intact) with a custom box. Supports indeterminate and Angular forms via <code>ControlValueAccessor</code>.',
      apiCaption: 'dm-checkbox inputs',
      a11yItems: [
        'Real native input: keyboard, focus and form semantics for free; the projected content is a real label.',
        'Indeterminate exposes <code>aria-checked="mixed"</code>.',
        '≥44px touch target; the check animation honors reduced-motion.',
      ],
      api: {
        checked: 'Two-way state: [(checked)] / (checkedChange).',
        indeterminate: 'Visual mixed state while not checked.',
        disabled: 'Combined with the forms disabled state.',
        inputId: 'Id of the native input, for external label[for].',
        ariaLabel: 'Accessible name when no label content is projected.',
      },
      labels: {
        terms: 'Accept the terms and conditions',
        indeterminateHeading: 'Indeterminate',
        selectAll: 'Select all',
      },
    },
    formField: {
      lead: 'Composite form field: label + projected native control (<code>dmInput</code>) + hint/error. It wires <code>id</code>, <code>for</code>, <code>aria-describedby</code> and <code>aria-invalid</code> automatically.',
      apiCaption: 'dm-form-field inputs',
      a11yItems: [
        'The label is linked to the control with <code>for</code>; hint and error travel via <code>aria-describedby</code>.',
        'The error uses <code>role="alert"</code> and switches the input to <code>aria-invalid="true"</code>.',
        'Error display is deliberately explicit: the consumer decides when to show which message.',
      ],
      api: {
        label: 'Visible label, wired with for.',
        hint: 'Help text (hidden while error is set).',
        error: 'Error text; non-empty activates the error state.',
        required: 'Shows the * marker (set required on the input too).',
        dmInput:
          'Attribute directive that applies the field styling to native input/textarea/select.',
      },
      labels: {
        emailLabel: 'Email',
        emailHint: 'We never share your email.',
        emailError: 'Enter a valid email address.',
        messageLabel: 'Message',
        withTextarea: 'With textarea',
      },
    },
    tooltip: {
      lead: 'Text tooltip on any element, built on the CDK Overlay. Shows on hover (with delay) and keyboard focus (immediate); Escape closes it; flips when there is no room.',
      apiCaption: 'dmTooltip inputs and defaults',
      defaultsDesc:
        'Position and delays are configurable per app with <code>TOOLTIP_DEFAULTS</code> or <code>provideTooltipDefaults</code>:',
      a11yItems: [
        'Panel with <code>role="tooltip"</code>, referenced from the trigger via <code>aria-describedby</code> while visible.',
        'Keyboard support: shows on focus, hides on blur and Escape.',
        'The entrance animation honors reduced-motion via the duration tokens.',
      ],
      api: {
        dmTooltip: 'Tooltip text (required). Empty → never shown.',
        dmTooltipPosition: 'Preferred placement; auto-flips: top, bottom, left, right.',
        showDelay: 'Default hover delay before showing (300ms). Global default.',
        hideDelay: 'Default delay before hiding (100ms). Global default.',
      },
      labels: { trigger: 'Hover or focus me' },
    },
    dialog: {
      lead: 'Modal dialog service, a thin wrapper over the CDK Dialog: focus trap, Escape/backdrop and <code>aria-modal</code> come from the CDK; the panel ships the library look. Requires <code>overlay-prebuilt.css</code> once per app.',
      apiCaption: 'DmDialogConfig options',
      a11yItems: [
        'Focus trap and focus restore on close (CDK).',
        '<code>role="dialog"</code> + <code>aria-modal="true"</code>; name it with <code>ariaLabel</code>.',
        'Escape and backdrop click close it unless <code>disableClose</code> is set.',
      ],
      api: {
        data: 'Injected into the content component via DIALOG_DATA.',
        size: 'Panel width: sm 22rem, md 30rem, lg 42rem.',
        disableClose: 'Blocks backdrop click and Escape.',
        ariaLabel: 'Accessible name of the dialog.',
      },
      labels: {
        open: 'Open dialog',
        demoTitle: 'Delete component?',
        demoBody: 'This action cannot be undone. The component will be removed from the library.',
        cancel: 'Cancel',
        confirm: 'Delete',
        result: 'Last result',
      },
    },
    toast: {
      lead: 'Notification queue. Toasts stack bottom-right, auto-dismiss (configurable) and are announced politely. Requires <code>overlay-prebuilt.css</code> once per app.',
      apiCaption: 'DmToastOptions',
      defaultsDesc:
        'Duration, dismiss button and its aria-label (the only built-in copy in the library) are configurable with <code>TOAST_DEFAULTS</code> or <code>provideToastDefaults</code>:',
      a11yItems: [
        'Each toast is <code>role="status"</code>: announced without interrupting the user.',
        'The dismiss button has a configurable <code>aria-label</code> and a ≥44px touch target.',
        'The entrance animation honors reduced-motion via the duration tokens.',
      ],
      api: {
        variant: 'Semantic color + icon: neutral, success, warning, danger.',
        duration: 'Auto-dismiss in ms; 0 disables it.',
        dismissible: 'Shows the dismiss button.',
      },
      labels: {
        show: 'Show toast',
        helpers: 'Variant helpers',
        message: 'Changes saved successfully',
        sticky: 'Sticky toast (duration 0)',
      },
    },
  },
};
