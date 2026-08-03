import { DashboardTranslations } from './translations.types';

export const ES: DashboardTranslations = {
  shell: {
    navAria: 'Componentes',
    openNav: 'Abrir navegación',
    closeNav: 'Cerrar navegación',
    switchToLight: 'Cambiar a tema claro',
    switchToDark: 'Cambiar a tema oscuro',
    languageLabel: 'Idioma',
    nav: {
      intro: 'Introducción',
      home: 'Inicio',
      overview: 'Overview',
      primitives: 'Primitives',
      layout: 'Layout',
      buttons: 'Botones',
      forms: 'Formularios',
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
    playgroundDesc: 'Varía los inputs en vivo y copia el snippet resultante.',
    examplesTitle: 'Ejemplos',
    apiTitle: 'API',
    defaultsTitle: 'Defaults globales',
    a11yTitle: 'Accesibilidad',
    demos: {
      basic: 'Básico',
      variants: 'Variantes',
      sizes: 'Tamaños',
      states: 'Estados',
      appearances: 'Apariencias',
      positions: 'Posiciones',
      withLabel: 'Con etiqueta',
      forms: 'Reactive Forms',
      composition: 'Composición',
    },
  },
  shared: {
    copyCode: 'Copiar código',
    copied: 'Copiado',
    playgroundControls: 'Controles del playground',
    api: { name: 'Nombre', type: 'Tipo', default: 'Default', description: 'Descripción' },
  },
  home: {
    subtitle:
      'Librería de componentes Angular modernos. Standalone, signals, theming con CSS variables, dark mode y responsive desde el primer componente.',
    cta: 'Ver componentes',
    featuresAria: 'Características',
    features: {
      signalsTitle: 'Signals primero',
      signalsBody:
        'API construida con <code>input()</code>, <code>output()</code> y <code>model()</code>. <code>OnPush</code> por defecto y compatible con zoneless.',
      themingTitle: 'Theming real',
      themingBody:
        'CSS custom properties como única fuente de theming: tokens <code>--dm-*</code>, light y dark, y densidades <code>compact · comfortable · spacious</code>.',
      responsiveTitle: 'Responsive por defecto',
      responsiveBody:
        'Mobile-first, container queries donde aportan, touch targets de 44px y respeto de <code>prefers-reduced-motion</code>.',
    },
    startTitle: 'Empezar',
  },
  skeletonPage: {
    lead: 'Placeholder de carga que imita la forma del contenido que reemplaza. Sin dependencia de Angular Material, accesible por defecto y con animaciones que respetan <code>prefers-reduced-motion</code>.',
    demos: {
      basic: 'Básico',
      variants: 'Variantes',
      animations: 'Animaciones',
      paragraph: 'Párrafo (count)',
      card: 'Composición: card de perfil',
      fluid: 'Tamaños fluidos',
    },
    apiCaption: 'Inputs de dm-skeleton',
    defaultsDesc:
      'Cambia los defaults de todos los <code>dm-skeleton</code> de la app con el token <code>SKELETON_DEFAULTS</code> o el helper <code>provideSkeletonDefaults</code>:',
    a11yItems: [
      'El host expone <code>role="status"</code>, <code>aria-busy="true"</code> y <code>aria-live="polite"</code>: los lectores de pantalla anuncian el estado de carga sin interrumpir.',
      'Con <code>prefers-reduced-motion: reduce</code> las animaciones se desactivan y el placeholder queda estático.',
      'Acepta tamaños fluidos (<code>%</code>, <code>clamp()</code>, <code>vw</code>); sin tamaño explícito ocupa el 100% de su contenedor.',
    ],
    api: {
      variant: 'Forma del placeholder.',
      width:
        'Ancho. Número → px; string tal cual (%, rem, clamp()…). Sin valor ocupa el 100% del contenedor.',
      height:
        'Alto. Sin valor usa el default de la variante: 1em (text), 6rem (rectangular/rounded), 2.5rem (circular).',
      animation: 'Animación de carga. none renderiza un placeholder estático.',
      rounded: 'Escala de border-radius, aplica con variant="rounded".',
      count:
        'Número de líneas/bloques renderizados (mínimo 1). Con variant="text", la última línea se acorta automáticamente.',
    },
  },
  loadingButtonPage: {
    lead: 'Botón con estados de carga, éxito y error integrados. Ancho estable (sin layout shift), spinner incorporado, deshabilitado mientras carga y anuncios a lectores de pantalla vía live region.',
    demos: {
      variants: 'Variantes',
      sizes: 'Tamaños',
      states: 'Estados',
      async: 'Acción asíncrona simulada',
    },
    apiCaption: 'Inputs y outputs de dm-loading-button',
    defaultsDesc:
      'Cambia los defaults de todos los <code>dm-loading-button</code> con el token <code>LOADING_BUTTON_DEFAULTS</code> o el helper <code>provideLoadingButtonDefaults</code>:',
    a11yItems: [
      'Mientras carga, el botón interno pone <code>aria-busy="true"</code> y <code>disabled</code>, evitando envíos duplicados.',
      'Los cambios de estado se anuncian mediante una región <code>aria-live="polite"</code> oculta visualmente, con los textos <code>loadingLabel</code> / <code>successLabel</code> / <code>errorLabel</code> que proporciones.',
      'La etiqueta conserva su espacio mientras se muestra el spinner: el botón nunca cambia de tamaño (sin layout shift).',
      'Con <code>prefers-reduced-motion: reduce</code> el spinner deja de girar y las transiciones son instantáneas.',
    ],
    api: {
      variant: 'Estilo visual del botón.',
      size: 'Tamaño del control; las alturas siguen los tokens globales de densidad.',
      state:
        'Estado actual. loading deshabilita el botón y muestra el spinner; success/error muestran un icono.',
      type: 'Type nativo del botón.',
      disabled: 'Deshabilita el botón (también se deshabilita automáticamente mientras carga).',
      loadingLabel:
        'Texto anunciado a lectores de pantalla durante la carga (la librería no lleva copy propio).',
      successLabel: 'Texto anunciado al completarse con éxito.',
      errorLabel: 'Texto anunciado en caso de error.',
      clicked: 'Se emite al hacer clic, solo si el botón es interactivo (ni disabled ni loading).',
    },
    asyncButtonLabel: 'Guardar cambios',
  },
  pages: {
    overview: {
      lead: 'Todos los componentes de la librería, en vivo. Construidos con signals, tematizados con CSS variables y accesibles por defecto — abre cualquier tile para ver su documentación, playground y API.',
      apiCaption: '',
      a11yItems: [],
      api: {},
      labels: { count: 'componentes', open: 'Abrir documentación' },
    },
    spinner: {
      lead: 'Indicador de carga indeterminado. Hereda <code>currentColor</code>, así que se adapta a cualquier superficie — botones, inputs, estados vacíos — sin inputs extra.',
      apiCaption: 'Inputs de dm-spinner',
      defaultsDesc:
        'Cambia los defaults de todos los <code>dm-spinner</code> con el token <code>SPINNER_DEFAULTS</code> o el helper <code>provideSpinnerDefaults</code>:',
      a11yItems: [
        'Sin <code>label</code> es decorativo (<code>aria-hidden="true"</code>): el contexto anuncia la carga.',
        'Con <code>label</code> expone <code>role="status"</code> + <code>aria-label</code>.',
        'Con <code>prefers-reduced-motion: reduce</code> el giro se detiene (arco estático).',
      ],
      api: {
        size: 'Tamaño con nombre (sm 1rem, md 1.5rem, lg 2rem), píxeles (número) o longitud CSS.',
        strokeWidth: 'Grosor del trazo en unidades del viewBox (24).',
        label: 'Etiqueta accesible. Vacía → decorativo.',
      },
      labels: { inButton: 'Dentro de otros componentes' },
    },
    badge: {
      lead: 'Etiqueta de estado construida sobre los tokens semánticos de estado. Sin lógica, puro theming: variantes, apariencias, dos tamaños, pill y punto de estado.',
      apiCaption: 'Inputs de dm-badge',
      defaultsDesc:
        'Cambia los defaults de todos los <code>dm-badge</code> con el token <code>BADGE_DEFAULTS</code> o el helper <code>provideBadgeDefaults</code>:',
      a11yItems: [
        'Contenido de texto plano: los lectores de pantalla lo leen con normalidad.',
        'El input <code>dot</code> añade un marcador redundante para que el color no sea el único portador del estado.',
      ],
      api: {
        variant: 'Color semántico.',
        appearance: 'Tratamiento visual: subtle, solid u outline.',
        size: 'Escala de tamaño.',
        pill: 'Esquinas totalmente redondeadas.',
        dot: 'Punto de estado inicial.',
      },
      labels: { dotHeading: 'Con punto de estado' },
    },
    card: {
      lead: 'Primitive de superficie. Declara <code>container-type: inline-size</code>: su contenido puede usar container queries contra la card en vez del viewport.',
      apiCaption: 'Inputs de dm-card',
      defaultsDesc:
        'Cambia los defaults de todas las <code>dm-card</code> con el token <code>CARD_DEFAULTS</code> o el helper <code>provideCardDefaults</code>:',
      a11yItems: [
        'La card es un contenedor neutro; si toda la card es clicable, envuélvela en un enlace o botón para que tenga semántica y foco reales.',
        'El hover lift respeta reduced-motion vía los tokens de duración.',
      ],
      api: {
        appearance: 'Tratamiento de superficie: elevated, outlined o flat.',
        padding: 'Escala de padding interno.',
        interactive: 'Hover lift para cards clicables.',
      },
      labels: {
        interactiveHeading: 'Interactiva',
        cardTitle: 'Título de la card',
        cardBody: 'Las cards son la superficie base para agrupar contenido relacionado.',
      },
    },
    avatar: {
      lead: 'Avatar con cadena de fallback automática: imagen → iniciales → icono genérico. Si la imagen falla, cae al fallback en silencio; cambiar <code>src</code> reintenta.',
      apiCaption: 'Inputs de dm-avatar',
      defaultsDesc:
        'Cambia los defaults de todos los <code>dm-avatar</code> con el token <code>AVATAR_DEFAULTS</code> o el helper <code>provideAvatarDefaults</code>:',
      a11yItems: [
        'Con imagen: <code>&lt;img alt&gt;</code> estándar.',
        'Los fallbacks exponen <code>role="img"</code> + <code>aria-label</code> (alt → iniciales).',
      ],
      api: {
        src: 'URL de la imagen. Con error cae a iniciales (luego icono).',
        alt: 'Alt de la imagen / etiqueta del fallback.',
        initials: 'Se muestran cuando no hay imagen (válida).',
        size: 'Tamaño con nombre (2 / 2.5 / 3rem), píxeles (número) o longitud CSS.',
        shape: 'Círculo o cuadrado.',
      },
      labels: { fallbackHeading: 'Cadena de fallback' },
    },
    switch: {
      lead: 'Toggle switch (<code>role="switch"</code>). Funciona suelto con <code>[(checked)]</code> y con Angular forms vía <code>ControlValueAccessor</code>. El playground de esta misma documentación lo usa.',
      apiCaption: 'Inputs de dm-switch',
      defaultsDesc:
        'Cambia los defaults de todos los <code>dm-switch</code> con el token <code>SWITCH_DEFAULTS</code> o el helper <code>provideSwitchDefaults</code>:',
      a11yItems: [
        '<code>role="switch"</code> + <code>aria-checked</code>; el contenido proyectado es la etiqueta vía <code>aria-labelledby</code>.',
        'Sin etiqueta proyectada, pasa <code>ariaLabel</code>.',
        'Target táctil ≥44px; el movimiento del thumb respeta reduced-motion.',
      ],
      api: {
        checked: 'Estado two-way: [(checked)] / (checkedChange).',
        disabled: 'Se combina con el estado disabled de forms.',
        size: 'Escala de tamaño.',
        inputId: 'Id del botón interno, para label[for] externo.',
        ariaLabel: 'Nombre accesible cuando no se proyecta etiqueta.',
      },
      labels: { notifications: 'Notificaciones por email', formValue: 'Valor del form' },
    },
    checkbox: {
      lead: 'Checkbox sobre un <code>&lt;input type="checkbox"&gt;</code> nativo real (semántica de formulario intacta) con caja custom. Soporta indeterminado y Angular forms vía <code>ControlValueAccessor</code>.',
      apiCaption: 'Inputs de dm-checkbox',
      a11yItems: [
        'Input nativo real: teclado, foco y semántica de formulario gratis; el contenido proyectado es un label real.',
        'El indeterminado expone <code>aria-checked="mixed"</code>.',
        'Target táctil ≥44px; la animación del check respeta reduced-motion.',
      ],
      api: {
        checked: 'Estado two-way: [(checked)] / (checkedChange).',
        indeterminate: 'Estado mixto visual mientras no está marcado.',
        disabled: 'Se combina con el estado disabled de forms.',
        inputId: 'Id del input nativo, para label[for] externo.',
        ariaLabel: 'Nombre accesible cuando no se proyecta etiqueta.',
      },
      labels: {
        terms: 'Acepto los términos y condiciones',
        indeterminateHeading: 'Indeterminado',
        selectAll: 'Seleccionar todo',
      },
    },
    formField: {
      lead: 'Campo de formulario compuesto: label + control nativo proyectado (<code>dmInput</code>) + hint/error. Cablea <code>id</code>, <code>for</code>, <code>aria-describedby</code> y <code>aria-invalid</code> automáticamente.',
      apiCaption: 'Inputs de dm-form-field',
      a11yItems: [
        'El label se asocia al control con <code>for</code>; hint y error viajan por <code>aria-describedby</code>.',
        'El error usa <code>role="alert"</code> y pone el input en <code>aria-invalid="true"</code>.',
        'Mostrar errores es deliberadamente explícito: el consumidor decide cuándo mostrar qué mensaje.',
      ],
      api: {
        label: 'Etiqueta visible, asociada con for.',
        hint: 'Texto de ayuda (oculto mientras hay error).',
        error: 'Texto de error; no vacío activa el estado de error.',
        required: 'Muestra el marcador * (pon required también en el input).',
        dmInput:
          'Directiva de atributo que aplica el estilo de campo a input/textarea/select nativos.',
      },
      labels: {
        emailLabel: 'Email',
        emailHint: 'Nunca compartimos tu email.',
        emailError: 'Introduce un email válido.',
        messageLabel: 'Mensaje',
        withTextarea: 'Con textarea',
      },
    },
    tooltip: {
      lead: 'Tooltip de texto sobre cualquier elemento, construido sobre el CDK Overlay. Aparece con hover (con delay) y con foco de teclado (inmediato); Escape lo cierra; se voltea si no hay sitio.',
      apiCaption: 'Inputs y defaults de dmTooltip',
      defaultsDesc:
        'La posición y los delays se configuran por app con <code>TOOLTIP_DEFAULTS</code> o <code>provideTooltipDefaults</code>:',
      a11yItems: [
        'Panel con <code>role="tooltip"</code>, referenciado desde el trigger vía <code>aria-describedby</code> mientras es visible.',
        'Soporte de teclado: aparece con foco, se oculta con blur y Escape.',
        'La animación de entrada respeta reduced-motion vía los tokens de duración.',
      ],
      api: {
        dmTooltip: 'Texto del tooltip (requerido). Vacío → nunca se muestra.',
        dmTooltipPosition: 'Posición preferida; se voltea sola: top, bottom, left, right.',
        showDelay: 'Delay de hover antes de mostrar (300ms). Default global.',
        hideDelay: 'Delay antes de ocultar (100ms). Default global.',
      },
      labels: { trigger: 'Pasa el ratón o enfócame' },
    },
    dialog: {
      lead: 'Servicio de diálogo modal, wrapper fino sobre el CDK Dialog: focus trap, Escape/backdrop y <code>aria-modal</code> vienen del CDK; el panel lleva el look de la librería. Requiere <code>overlay-prebuilt.css</code> una vez por app.',
      apiCaption: 'Opciones de DmDialogConfig',
      a11yItems: [
        'Focus trap y devolución del foco al cerrar (CDK).',
        '<code>role="dialog"</code> + <code>aria-modal="true"</code>; nómbralo con <code>ariaLabel</code>.',
        'Escape y click en el backdrop lo cierran salvo con <code>disableClose</code>.',
      ],
      api: {
        data: 'Se inyecta en el componente de contenido vía DIALOG_DATA.',
        size: 'Ancho del panel: sm 22rem, md 30rem, lg 42rem.',
        disableClose: 'Bloquea backdrop y Escape.',
        ariaLabel: 'Nombre accesible del diálogo.',
      },
      labels: {
        open: 'Abrir diálogo',
        demoTitle: '¿Eliminar componente?',
        demoBody: 'Esta acción no se puede deshacer. El componente se eliminará de la librería.',
        cancel: 'Cancelar',
        confirm: 'Eliminar',
        result: 'Último resultado',
      },
    },
    toast: {
      lead: 'Cola de notificaciones. Los toasts se apilan abajo a la derecha, se auto-descartan (configurable) y se anuncian sin interrumpir. Requiere <code>overlay-prebuilt.css</code> una vez por app.',
      apiCaption: 'DmToastOptions',
      defaultsDesc:
        'La duración, el botón de cierre y su aria-label (el único copy integrado en la librería) se configuran con <code>TOAST_DEFAULTS</code> o <code>provideToastDefaults</code>:',
      a11yItems: [
        'Cada toast es <code>role="status"</code>: se anuncia sin interrumpir al usuario.',
        'El botón de cierre tiene <code>aria-label</code> configurable y target táctil ≥44px.',
        'La animación de entrada respeta reduced-motion vía los tokens de duración.',
      ],
      api: {
        variant: 'Color semántico + icono: neutral, success, warning, danger.',
        duration: 'Auto-descarte en ms; 0 lo desactiva.',
        dismissible: 'Muestra el botón de cierre.',
      },
      labels: {
        show: 'Mostrar toast',
        helpers: 'Helpers por variante',
        message: 'Cambios guardados correctamente',
        sticky: 'Toast persistente (duration 0)',
      },
    },
  },
};
