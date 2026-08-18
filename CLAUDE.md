# ngx-dmaster — Workspace de la librería @dmaster/ui

Workspace Angular 20 con dos proyectos en `projects/`:

- **`@dmaster/ui`** — librería de componentes UI (publicable en npm como `@dmaster/ui`). Nombre del proyecto Angular: `dmaster-ui`. Directorio en disco: `projects/ngx-dmaster-ui/` (el directorio conserva el nombre histórico; la identidad pública es `@dmaster/ui`).
- **`ngx-test-app`** — dashboard de documentación viva donde se prueba y documenta cada componente.

## Comandos

```bash
npm start              # ng serve ngx-test-app (dev del dashboard, puerto 4200)
npm run build          # lib completa: ng-packagr + CSS precompilado + schematics → dist/dmaster-ui
npm run build:styles   # solo el CSS precompilado (sass → dist/dmaster-ui/styles/dmaster-ui.css)
npm run build:schematics # solo los schematics (tsc + copia de collection/schema.json al dist)
npm run build:app      # ng build ngx-test-app (prerenderiza todas las rutas — outputMode static; el número exacto crece con cada componente, no lo fijes a mano en comentarios/docs)
npm test               # tests de la librería (Vitest, headless)
npm run test:coverage  # tests de la librería con cobertura
npm run test:app       # tests del dashboard
npm run lint           # ESLint (ambos proyectos, angular-eslint flat config)
npm run lint:styles    # Stylelint sobre projects/**/*.scss
npm run format         # Prettier --write
npm run size           # auditoría de peso tree-shakeado por componente (requiere npm run build antes)
```

Antes de dar por buena cualquier tarea: `npm run build && npm test && npm run test:app && npm run lint && npm run lint:styles`.

## Regla dura: documentación siempre sincronizada con cada push

**Cada vez que se suba código nuevo (commit/push), la documentación tiene que reflejar ese estado.** No es opcional ni un "follow-up" — se hace en la misma tanda que el cambio, antes de subir. Esto incluye, según lo que toque el cambio:

- **README de la librería** (`projects/ngx-dmaster-ui/README.md`, la página que ve npm) y **README raíz** (`README.md`): sección "Components" con el componente nuevo/renombrado en su categoría real; cifras "at a glance" (nº de componentes, tests) si cambian.
- **`CHANGELOG.md`** de la librería: entrada en `[Unreleased]`.
- **Sitio de docs** (`ngx-test-app`): página del componente + `COMPONENT_REGISTRY` (`core/component-registry.ts` — única fuente de verdad, alimenta tanto el Overview como el stat "N components" de la Home; **nunca** un número a mano) + i18n en los 3 idiomas + `sitemap.xml`.
- **Este CLAUDE.md**: si el cambio introduce un patrón, gotcha o decisión de arquitectura nueva.

Motivo: ya ocurrió que el sitio en producción mostraba "18 components"/"139 tests" hardcodeados mientras la librería tenía 34 componentes reales — la documentación desincronizada activamente daña la credibilidad de cara a quien evalúa la librería. Antes de cualquier push, repasar mentalmente: _"¿alguien que lea la doc ahora mismo vería lo que acabo de construir?"_ — si la respuesta es no, la tarea no está terminada.

## Decisiones de arquitectura (no re-litigar)

- **Tests con Vitest** vía el builder experimental `@angular/build:unit-test` (`runner: "vitest"`). Karma queda prohibido.
- **Gotcha importante**: el target `test` de la librería usa `"buildTarget": "ngx-test-app:build:development"` en `angular.json`. Es intencional: el builder de ng-packagr no acepta `stylePreprocessorOptions`, y los SCSS de componentes resuelven `@use 'mixins'` gracias a los `includePaths` del build de la app. No lo "arregles" apuntándolo a la librería.
- **`tsconfig.json` → paths**: `@dmaster/ui` apunta al **código fuente** (`projects/ngx-dmaster-ui/src/public-api.ts`), no a `dist/`. El empaquetado real se valida con `npm run build`.
- **Zoneless**: el dashboard usa `provideZonelessChangeDetection()`. La librería no debe depender de zone.js jamás.
- **Angular CDK** disponible como peer de la librería (los overlays lo usan: `cdk/overlay`, `cdk/dialog`, `cdk/portal`). `@angular/forms` también es peer (CVA de switch/checkbox). **Angular Material NO está instalado**.
- **Overlays**: el consumidor debe cargar los estilos estructurales del CDK una vez — `"styles": ["node_modules/@angular/cdk/overlay-prebuilt.css", …]` (el dashboard ya lo hace). Los estilos de panel/backdrop del dialog son globales en `styles/_overlays.scss`; los de `.dm-input` en `styles/_forms.scss` (las directivas no pueden llevar hoja de estilos).
- **Composición entre componentes de la lib** (p. ej. button → spinner): importar desde el barrel del otro componente (`../../primitives/spinner`). Es la única excepción tolerada a la regla de no-relativos-profundos.
- El único copy integrado en la librería es `dismissLabel` del toast (override con `provideToastDefaults`); todo lo demás llega por inputs.
- Nombre npm final: `@dmaster/ui` (paquete scoped bajo la organización `dmaster`; verificar disponibilidad con `npm view @dmaster/ui` antes de publicar; publicar desde `dist/dmaster-ui`).
- **SSR-safety (regla dura de la lib y de la app)**: nunca tocar `window`/`document`/`localStorage` como globales. Siempre `inject(DOCUMENT)` y `this.document.defaultView?.` con optional chaining (patrón de ThemeService/TocService/PaletteService). El prerender del dashboard es el smoke test permanente: si un servicio rompe esta regla, `npm run build:app` falla.
- **Prerender estático del dashboard**: `outputMode: "static"` + `main.server.ts` (el bootstrap del servidor DEBE recibir `BootstrapContext` — sin él, NG0401) + `app.routes.server.ts` (`RenderMode.Prerender` con wildcard). Las 21 rutas salen como HTML completo con su `<title>` horneado. El output sigue en `dist/ngx-test-app/browser` (wrangler.toml intacto); `index.csr.html` es el fallback client-side.
- **Empaquetado npm**: `rxjs` es peer (aparece en los typings públicos vía paginated-select); LICENSE y CHANGELOG.md viven en `projects/ngx-dmaster-ui/` y viajan como assets de ng-package.json; el `exports` del package.json de la lib declara los subpaths `./styles`, `./styles/index` y `./styles/*` (ng-packagr los mergea con los suyos) + CSS precompilado `styles/dmaster-ui.css` para consumidores sin Sass (se genera en `build:styles`).
- **Auditoría de peso (`npm run size`, `scripts/size-audit.mjs`)**: mide el coste tree-shakeado real por componente contra el FESM del dist. **Gotcha crítico**: el FESM de ng-packagr es compilación parcial (`ɵɵngDeclare*`) y NO es tree-shakeable tal cual — medirlo directo con esbuild da ~74 kB gzip para CUALQUIER import individual (falso positivo de "no tree-shakea"). Hay que pasar primero el linker de Angular + los plugins babel del CLI (`adjust-static-class-members`, `elide-angular-metadata`, `pure-toplevel-functions`, cargados por ruta absoluta desde `@angular/build` porque su `exports` no los expone). Con el pipeline correcto: button ~3.6 kB gzip, tabla completa en el README de la lib (sección "Bundle size" — actualizarla si un componente engorda). La cifra "librería completa ~66 kB gzip" y las por-componente del README salen de este script.
- **Sistema de iconos**: `dm-icon` (primitivo) tiene **tres modos** (patrón `mat-icon`): (1) **fuente** — el contenido de texto es una ligadura de Material Symbols (`<dm-icon>home</dm-icon>`, ~3500 iconos); `fill`/`weight`/`family` mapean a los ejes de la variable font (outlined⇄filled, wght, rounded/sharp) vía CSS vars `--dm-icon-{fill,weight}` + `data-family`; (2) **SVG registrado** por `name`; (3) **`<svg>` proyectado**. `color` acepta token semántico (→`var(--dm-{color})`) o cualquier color CSS; si vacío hereda `currentColor`. El tamaño se aplica a `width/height` **y** `font-size` (unifica ambos modos). El registro SVG es agnóstico: `provideDmasterIcons(icons)` (multi-provider) mergea sets; `DmIconRegistry` los cachea como `SafeHtml` vía `DomSanitizer.bypassSecurityTrustHtml` (**único** uso de DomSanitizer en la lib — solo strings de confianza del registro, nunca de input). El **set curado** vive en un **secondary entry point** `@dmaster/ui/icons` (`projects/ngx-dmaster-ui/icons/` con su propio `ng-package.json`; ng-packagr auto-genera el subpath `./icons`; ~53 iconos outline 24×24 originales). **Regla dura**: los SVG internos de los componentes de la lib **siguen inline** (no dependen del registro, como Angular Material). En el dashboard: `provideDmasterIcons(DM_ICONS)` en `app.config.ts`, la fuente Material Symbols (3 familias) por `<link>` en `index.html`, y `tsconfig.json` mapea `@dmaster/ui/icons` a fuente. El modo fuente exige que el consumidor cargue la fuente (no se empaqueta).
- **`ng add @dmaster/ui`**: schematic en `projects/ngx-dmaster-ui/schematics/` (compilado por `build:schematics` con tsconfig propio a `dist/dmaster-ui/schematics`). Campos `schematics` y `ng-add.save` en el package.json de la lib.
- **CI/release**: `package-lock.json` VERSIONADO (no volver a ignorarlo) + `npm ci` en workflows; CI corre en `main` Y `development`; el release (tags `v*`) valida tag == versión del package.json de la lib, pasa publint y crea GitHub Release. Node fijado por `.node-version` (24) y `engines`.
- **Tema persistido**: la clave `ngx-dmaster-theme` en localStorage la escribe `ThemePersistenceService` (app, `core/theme/`) y la lee el script inline anti-FOUC de `index.html` antes del primer paint. Si se cambia la clave, cambiar AMBOS sitios.

## Estructura de la librería

```
projects/ngx-dmaster-ui/src/
├── public-api.ts                  # ÚNICA fachada pública (reexporta core + componentes)
└── lib/
    ├── core/                      # transversal: config, provideDmasterUI, servicios, tipos, utils
    │   ├── config/                # DmasterUIConfig, DMASTER_UI_CONFIG, provideDmasterUI()
    │   ├── services/              # ThemeService, DensityService, ReducedMotionService
    │   ├── types/                 # DmTheme, DmDensity, DmSize, DmCssSize…
    │   └── utils/                 # toCssSize()…
    ├── styles/                    # _tokens, _themes, _mixins, _reset, _forms, _overlays, index.scss
    └── components/
        ├── primitives/
        │   ├── skeleton/          # patrón de referencia para TODO componente nuevo
        │   ├── spinner/           # lo consume dm-button
        │   ├── badge/
        │   ├── avatar/
        │   ├── icon/              # dm-icon + DmIconRegistry + provideDmasterIcons
        │   └── kbd/
        ├── layout/
        │   ├── card/              # container-type: inline-size
        │   ├── accordion/
        │   └── divider/           # horizontal/vertical + label proyectado opcional
        ├── feedback/              # progress, alert (categoría de estado/notificación)
        │   ├── progress/          # determinado/indeterminado, striped, value label
        │   └── alert/             # color × variant, icono semántico, dismissible, action slot
        ├── buttons/
        │   └── button/            # color × variant + estados idle/loading/success/error, live region
        ├── forms/                 # CVA: switch, checkbox, select, search-field, slider; form-field + directiva dmInput
        │   ├── switch/            # prop-signal del dashboard lo dogfoodea
        │   ├── checkbox/
        │   ├── radio-group/
        │   ├── select/            # combobox (CDK overlay + keyboard + typeahead + CVA)
        │   ├── paginated-select/  # server-driven (rxResource)
        │   ├── search-field/      # CVA: input + lupa + botón limpiar; Escape limpia, Enter (search); color×variante; superficie propia (no dmInput)
        │   ├── date-picker/        # CVA: calendario en overlay, vistas día→mes→año, teclado ARIA (roving grid); Date nativo; Intl para nombres/formato/dígitos (sin date lib); firstDayOfWeek 'auto' = semana según locale (CLDR); DM_DATE_LOCALE reactivo (string|Signal); + date-utils.ts puro
        │   ├── color-picker/       # CVA: hex string; trigger de campo + panel overlay (área S/V drag+teclado, tono, alpha, hex input, swatches); + color-utils.ts puro (hex⇄rgb⇄hsv)
        │   ├── slider/            # CVA: pointer drag + teclado completo + value bubble + marks
        │   ├── error/              # dm-error — equivalente a mat-error: role=alert, proyección pura (sin icono propio; se proyecta uno si se quiere, p. ej. dm-icon); slot proyectable en dm-form-field (aria-describedby auto)
        │   └── form-field/        # estilos de .dm-input en _forms.scss (global); acepta <dm-error> proyectado
        ├── navigation/
        │   ├── tabs/
        │   ├── breadcrumbs/       # composite; router-agnóstico (href → <a>, sin href → <span>); collapse
        │   └── pagination/        # windowed pager, two-way page; dm-table lo dogfooddea en su footer
        ├── data-display/
        │   └── table/             # search → sort → paginate + selección
        └── overlays/              # CDK: requieren overlay-prebuilt.css en el consumidor
            ├── tooltip/           # directiva dmTooltip + panel interno
            ├── dialog/            # DmDialogService (cdk/dialog); reexporta DIALOG_DATA/DialogRef
            ├── toast/             # DmToastService con cola en signal
            ├── menu/              # WAI-ARIA menu: FocusKeyManager + typeahead; SCSS encapsulado (TemplatePortal), token DM_MENU_PANEL rompe el ciclo DI
            ├── popover/           # panel rico con flecha que sigue el flip real (positionChanges → data-placement)
            └── drawer/            # DmDrawerService sobre cdk/dialog; estilos globales en _overlays.scss (sección Drawer)
```

### Reglas de organización

1. **Un componente = una carpeta** dentro de su categoría (`primitives/`, futuros `buttons/`, `layout/`, `data-display/`…).
2. **Nomenclatura fija** por carpeta: `<name>.component.ts|html|scss|spec.ts`, `<name>.types.ts`, `<name>.tokens.ts`, `index.ts` (barrel), `README.md`.
3. Componentes compuestos (tabs+tab, form-field+label…) comparten carpeta. **Excepción tolerada a la nomenclatura fija**: `breadcrumb-item` lleva su PROPIO `.html`+`.scss` (no un `.ts` suelto) porque renderiza su vista aparte y sin SCSS propio habría que usar `::ng-deep` desde el padre — que `stylelint-config-standard-scss` prohíbe. Mismo criterio aplicable a futuros ítems de composite con vista propia.
4. `core/` no depende de ningún componente; cualquier componente puede usar `core/`.
5. **Prohibido `../../../` entre componentes o categorías**: lo compartido va a `core/`.
6. Todo lo público se reexporta desde `public-api.ts` (vía el `index.ts` de cada componente).

## Convenciones de código

- Standalone components, `input()` / `output()` / `model()` (nunca decoradores), `computed()` para derivados, `ChangeDetectionStrategy.OnPush` siempre.
- Control flow moderno: `@if` / `@for` / `@switch`.
- Selectores: prefijo `dm-` (librería), `app-` (dashboard). Directivas: `dm` camelCase. ESLint lo fuerza.
- Clases de componente de la lib: `DmXxxComponent` (p. ej. `DmSkeletonComponent`).
- Defaults de cada componente inyectables vía token propio (`SKELETON_DEFAULTS` + helper `provideSkeletonDefaults()`); el componente lee defaults con `inject(TOKEN)` en los initializers de `input()`.
- Accesibilidad primero: atributos ARIA en `host`, `:focus-visible` con el mixin `focus-ring`, touch targets ≥44px (mixin `touch-target`).

### SCSS y theming

- **Los `.scss` de componentes NUNCA hardcodean colores**: siempre `var(--dm-…)` de los tokens semánticos (`--dm-bg`, `--dm-fg-muted`, `--dm-border`, `--dm-primary`…).
- Los estilos de componente **solo** importan `@use 'mixins';` (resuelve por `includePaths` / `styleIncludePaths`). `index.scss` (reset + tokens + temas) se importa UNA vez en el `styles.scss` del consumidor.
- Tokens de componente propios con fallback: `var(--dm-skeleton-bg, var(--dm-bg-muted))`, definidos globalmente en `_themes.scss` (sección "Component tokens").
- Temas por atributo en `<html>`: `data-dm-theme="light|dark"` (lo estampa `ThemeService`, que resuelve `auto` contra `prefers-color-scheme`) y `data-dm-density="compact|comfortable|spacious"` (`DensityService`).
- Mobile-first: base = móvil; hacia arriba con `@include respond-to(sm|md|lg|xl|2xl)`. Container queries con `container-above()` cuando el componente deba adaptarse a su contenedor (preferirlas en layout y data-display).
- Unidades relativas (`rem`, `em`, `%`, `clamp()`); nada de `px` fijos salvo bordes 1px.
- `prefers-reduced-motion`: los tokens `--dm-duration-*` se anulan globalmente en `_tokens.scss`; animaciones no basadas en esos tokens se apagan con `@include reduced-motion`.
- Clases BEM (`bloque__elemento--modificador`); variantes de componente como data-attributes (`[data-variant='…']`), no como explosión de clases.
- **Lenguaje visual propio: plano y muy redondeado.** Rellenos PLANOS (colores sólidos vivos, SIN gradiente ni `--dm-sheen` en componentes), muy redondeado (radios `sm 8 / md 12 / lg 14 / xl 18`; chips a `full`), sombras difusas suaves, press elástico `scale(0.92–0.97)` con `--dm-ease-snappy`. `--dm-gradient-brand` se conserva SOLO en marca (logo, títulos hero del dashboard), nunca en componentes. `--dm-sheen` queda como token legado sin uso en componentes.
- **Sistema de color × variante**: tokens por color `--dm-{default|primary|secondary|success|warning|danger}` con `-hover`, `-fg` (texto sobre solid) y `-subtle` (relleno flat). Los componentes con variantes (button, badge) mapean el `data-color` a variables genéricas locales (`--dm-btn*` / `--dm-badge*`) y las variantes (`data-variant`) las consumen — así se evita la explosión color×variante en SCSS. La variante `shadow` proyecta un glow del propio color con `color-mix`.
- **Marca ligada al theme (no re-litigar)**: `--dm-gradient-brand` (logo `dm.`, favicon, títulos hero) **deriva** de `--dm-primary`/`--dm-primary-hover` (`linear-gradient(135deg, var(--dm-primary-hover), var(--dm-primary))`) — ya NO es un índigo→violeta fijo independiente del tema. Así logo/favicon/hero siguen automáticamente el theme claro/oscuro **y** la paleta en vivo del `PalettePicker` (que sobreescribe `--dm-primary*` inline en `<html>`). Los SVG inline del logo (`shell.component.html`, `home.component.html`) usan `style="stop-color: var(--dm-primary-hover)"` en sus `<stop>` (no el atributo `stop-color`, que no resuelve custom properties). El favicon estático (`public/favicon.svg`) es un documento aparte sin acceso al CSS del host: fija el azul del theme por defecto y usa su propio `@media (prefers-color-scheme: dark)` interno — es el fallback antes de hidratar (SSR/prerender, JS deshabilitado) y solo puede seguir el color del SO, no la paleta. Una vez arranca Angular, `FaviconThemeService` (`core/theme/favicon-theme.ts`, cableado con `provideFaviconTheme()` en `app.config.ts`) toma el relevo: un `effect()` sobre `ThemeService.resolvedTheme()` + `PaletteService.current()` regenera el SVG como `data:` URI y reemplaza el `href` del `<link rel="icon">` — así la pestaña sigue el theme claro/oscuro **y** la paleta en vivo, igual que el logo del header. Resuelve los colores desde el estado de los servicios (constantes light/dark + `PALETTE_PRESETS`), no leyendo `getComputedStyle` — evita una carrera de orden de `effect()`s con el que estampa `data-dm-theme`.
- **`PaletteService` no persiste** (a propósito): el picker de paletas es una herramienta "pruébalo" de la sesión actual — cada carga arranca en `default` (azul), nunca restaura la última paleta elegida desde `localStorage`. Motivo: con la marca ligada al theme, una paleta no-default sobreviviendo un reload haría que logo/favicon/hero parpadeasen a un color distinto tras la hidratación (no hay script anti-FOUC para la paleta, a diferencia de `ngx-dmaster-theme`). El theme claro/oscuro (`ThemeService`/`ThemePersistenceService`) sigue persistiendo normalmente — es un eje independiente.
- **Button** (`dm-button`): `color` × `variant` (`solid|flat|faded|bordered|light|ghost|shadow`) + `radius` (**default `full`** = píldora, seña del lenguaje visual de la lib) + `size` (32/40/48px) + estados idle/loading/success/error con live region. **Badge/Chip** (`dm-badge`): `color` × `variant` (`solid|flat|bordered|light|dot|shadow`) + `radius` + `size`; `dot` es una variante (no un boolean).
- **Familia de campos — estética unificada (regla dura)**: `dmInput`/form-field, `dm-select`, `dm-paginated-select`, `dm-search-field` y `dm-date-picker` deben leerse como hermanos SIEMPRE. Contrato compartido: radius por defecto **`md`** (nada de píldora por defecto — `full` queda opt-in), alturas **32/40/48px** (los `--dm-control-height*` de densidad comfortable coinciden con la escala sm/md/lg hardcodeada de select/search), superficie flat `--dm-bg-muted` → eleva a `--dm-bg-elevated` en focus, y **focus SIEMPRE primary** con el ring "parkeado a 0 spread": el mapeo `data-color='default'` de select/paginated/search apunta a `--dm-primary` (NO a `--dm-fg`) para igualar el focus azul de `.dm-input`. Cualquier campo nuevo copia este contrato antes de inventar nada.

### Testing

- Vitest con globals (`describe/it/expect` sin imports; `tsconfig.spec.json` → `"types": ["vitest/globals"]`).
- TestBed **siempre** con `provideZonelessChangeDetection()` en providers.
- Inputs en tests con `fixture.componentRef.setInput('nombre', valor)`.
- Overrides de tokens con `TestBed.overrideProvider(TOKEN, { useValue: … })` antes de crear el fixture.

## El dashboard (`ngx-test-app`)

**Arquitectura de rutas**: la landing (`/`, `pages/home/`) vive FUERA del shell — página full-bleed sin sidebar, con top bar propio (logo + links Docs/Components + palette picker + idioma + theme toggle) y footer. El resto de rutas (`/getting-started`, `/components/**`) comparten `ShellComponent` como **layout route** (`app.routes.ts`: ruta `''` con `component: ShellComponent` y las docs como `children`). `app.ts` solo renderiza `<router-outlet />`.

Shell de docs (`layout/shell/`): sidebar (drawer con hamburguesa < 1024px, columna estática desde `lg`), header sticky con logo + selector de idioma (`dm-select` bordered/sm, dogfooding; bajo `sm` se muda al pie del drawer porque no cabe en el header) + theme toggle, y páginas lazy en `pages/`.

**Marca**: el logo es el monograma "d." sobre tile con gradiente índigo→violeta. Vive en `public/favicon.svg` y como SVG inline en el shell (`#dm-logo-*`), en el top bar de la landing (`#hm-logo-*`) y en el hero del Overview (`#ov-logo-*` — ids únicos por documento). La página **Overview** (`/components`, `pages/overview/`) es el escaparate con un tile por componente y preview en vivo; el CTA de la home apunta ahí.

**Landing** (`pages/home/`): hero split con preview viva + fondo full-bleed (dot-grid con máscara en `.home__hero-bleed`; el hero y el CTA final NO llevan tinte de color de fondo — se quitaron a propósito), stats, galería de tiles clicables (routerLink a cada docs page, previews `inert`), **sección de código en vivo** (`.home__code`: `dm-tabs` como control segmentado — sin panels, se autooculta el slot vacío — que conmuta a la vez el preview vivo con `@switch` y el `demoCode()` mostrado en `app-code-snippet`), sección theming con las paletas en vivo (`PaletteService`), features, install y CTA (superficie plana). Budget `anyComponentStyle` del build de la app subido a 26/30 kB por esta página.

**Card del hero**: el glow/orbes de color son hermanos ABSOLUTOS detrás de `.home__hero-preview-window` (z-index 0) — NO un `::before` hijo con z-index negativo (eso teñía el interior de lila porque se pinta sobre el fondo blanco). La ventana va a z-index 1 con fondo opaco. En `lg` flota con `hero-card-float`.

**Animaciones**: entrada escalonada del hero al cargar (`home-rise` con delays por `nth-child`), float/pulse del preview, y **scroll-reveal** vía la directiva `appReveal` (`shared/reveal.directive.ts`): IntersectionObserver que añade `reveal--in` al entrar en viewport; el índice opcional (`appReveal="2"`) escala el retardo (`--dm-reveal-delay`). Los grids (galería, features) escalonan sus hijos con `nth-child`. Todo se apaga con `prefers-reduced-motion` (guard al final del SCSS). Nota: el IntersectionObserver no dispara en el panel de preview headless (no compone frames), pero sí en navegadores reales.

**Ejemplos del code showcase**: `Profile` (avatar+badge+stats+botones), `Pricing` (badge+precio+features con check ✓ CSS+botón) y `Settings` (switches+checkbox+Save) — cada uno con su card `dm-card` real y su código en `demoCodeMap` (home.ts). Son deliberadamente "de producto" (no primitivos sueltos) para captar mejor.

**Modo oscuro del landing**: varias superficies "card" usan `--dm-bg` (#09090b) = fondo de página y se fundían (el borde al 8% no basta). En el bloque `:host-context([data-dm-theme='dark'])` del SCSS: gallery-tile / theming-card / code-card se elevan a `--dm-bg-subtle`; dentro del code card los paneles (stage + snippet) bajan a `--dm-bg` (recuadros hundidos) con separadores al 12% blanco. En los tiles SOLO se cambia `background` (no `border-color`) para no pisar el borde primary del hover.

Los estilos compartidos de las páginas de docs (`.page__*`, `.demo-*`, chips de código inline) son **globales** en `src/styles/_docs.scss` (importado desde `styles.scss`). Es a propósito: parte del contenido llega por `[innerHTML]` (traducciones con `<code>`) y los estilos encapsulados de Angular no alcanzan a los nodos insertados así. El SCSS de cada página solo define su `:host`.

Componentes shared reutilizables en `shared/` (usarlos SIEMPRE en páginas de componente, no reinventarlos):

- `app-demo-block` — render en vivo (content projection) + snippet copiable debajo (`heading`, `code`, `language`).
- `app-code-snippet` — bloque de código copiable (`code`, `language`).
- `app-api-table` — tabla de inputs/outputs (`rows: ApiTableRow[]`).
- `app-prop-signal` — playground: controles (`PropControl[]`) + two-way `[(values)]` con un signal de la página. Los controles `select` renderizan un `dm-select` (bordered/sm) y los `boolean` un `dm-switch` — dogfooding de la librería.

**Gotcha**: en `prop-signal`, los `<select>` marcan la opción activa con `[selected]` en cada `<option>` (un `[value]` en el `<select>` se aplica antes de que existan las options y falla).

**Gotcha (overflow)**: los grids de una columna del marco de docs (`.docs-page`, `.page__section`, `.page__header`, `.demo`) llevan `grid-template-columns: minmax(0, 1fr)` y sus hijos `min-width: 0` en `_docs.scss`. Es obligatorio: sin eso, un hijo ancho (la `api-table` con `min-width: 36rem`, un snippet con una línea larga) expande el track y desborda la página en viewports estrechos en vez de hacer scroll interno.

### Checklist: nuevo componente de la librería

1. Carpeta en `lib/components/<categoría>/<nombre>/` con los 8 archivos de la nomenclatura fija (usar `skeleton/` como plantilla).
2. Tokens de componente en `_themes.scss` si dependen del tema.
3. Export en `public-api.ts`.
4. Tests (mínimo: render por defecto, cada input, a11y del host, defaults inyectables).
5. Página en `pages/components/<nombre>-page/` con: descripción, playground (`prop-signal` + snippet generado), varios `demo-block`, `api-table`, notas de accesibilidad.
6. Ruta lazy en `app.routes.ts` + entrada en `sections` del shell.
7. **Registro del componente** (`core/component-registry.ts`): añadir la entrada a `COMPONENT_REGISTRY` (id, categoryKey, navKey) — es la ÚNICA fuente de verdad; de ahí sale tanto el listado del Overview como el stat "N components" de la Home, así que nunca hay que tocar un número a mano. En el Overview, añadir además el `@case` con su mini-preview EN VIVO (los previews van dentro de un contenedor `inert`; los overlays usan mocks estáticos con las clases `ov__mock-*`). Esta regla es obligatoria: el Overview es el escaparate de la librería.
8. `npm run lint && npm run lint:styles && npm test` en verde. Si el componente trae specs nuevos, actualizar también el stat de tests de la Home (`home.component.html`, `home.stats.tests` — cifra manual tipo "470+", no se puede calcular en cliente).

## i18n del dashboard

El dashboard soporta **inglés (por defecto), español y francés**, con i18n en runtime (sin `@angular/localize`): cambio de idioma en vivo desde el selector del header.

- `LocaleService` en `src/app/core/i18n/`: signal `locale` (persistido en `localStorage`, clave `ngx-dmaster-locale`, default `'en'`), computed `t()` con el diccionario activo, y `lang` de `<html>` sincronizado.
- Diccionarios tipados por idioma (`translations.en|es|fr.ts`) que implementan la interfaz `DashboardTranslations` (`translations.types.ts`): **TypeScript falla en compilación si a un idioma le falta una clave**. Toda cadena nueva del dashboard se añade a la interfaz y a los TRES diccionarios.
- Uso en componentes: `protected readonly i18n = inject(LocaleService);` y en templates `{{ i18n.t().home.cta }}`. Claves cuyo valor lleva marcado inline (`<code>…</code>`) se enlazan con `[innerHTML]` (Angular sanea); por eso sus estilos viven en el `_docs.scss` global.
- Los textos de la LIBRERÍA no se traducen aquí: los componentes de la lib no llevan copy propio; exponen inputs de texto (`loadingLabel`, etc.) que el consumidor rellena.
- Los `title` de las rutas quedan en inglés (idioma por defecto); no se traducen en runtime.

### Traducciones de páginas nuevas

Las páginas añadidas a partir de la v0.2 usan la interfaz genérica `SimplePageTranslations` (`pages.<clave>` en los diccionarios): `lead`, `apiCaption`, `defaultsDesc?`, `a11yItems`, y `api`/`labels` como `Record<string, string>` (un typo en la clave devuelve `undefined` — revisar en el navegador). Los headings de demos comunes viven en `common.demos`. Las páginas declaran `host: { class: 'docs-page' }` y no llevan SCSS propio.

## Roadmap

1. Candidatos siguientes: `tabs` (composite), `dm-select`/`menu` (overlay + a11y dura), `radio-group`, `data-display/table`. Usar `skeleton/` (simple), `form-field/` (composite) y `tooltip/` (overlay) como plantillas según el tipo.
2. Publicación en npm cuando haya masa crítica: verificar nombre, `npm run build` y publicar desde `dist/dmaster-ui`.
