# ngx-dmaster — Workspace de la librería ngx-dmaster-ui

Workspace Angular 20 con dos proyectos en `projects/`:

- **`ngx-dmaster-ui`** — librería de componentes UI (publicable en npm como `ngx-dmaster-ui`).
- **`ngx-test-app`** — dashboard de documentación viva donde se prueba y documenta cada componente.

## Comandos

```bash
npm start              # ng serve ngx-test-app (dev del dashboard, puerto 4200)
npm run build          # ng build ngx-dmaster-ui (ng-packagr → dist/ngx-dmaster-ui)
npm run build:app      # ng build ngx-test-app
npm test               # tests de la librería (Vitest, headless)
npm run test:app       # tests del dashboard
npm run lint           # ESLint (ambos proyectos, angular-eslint flat config)
npm run lint:styles    # Stylelint sobre projects/**/*.scss
npm run format         # Prettier --write
```

Antes de dar por buena cualquier tarea: `npm run build && npm test && npm run test:app && npm run lint && npm run lint:styles`.

## Decisiones de arquitectura (no re-litigar)

- **Tests con Vitest** vía el builder experimental `@angular/build:unit-test` (`runner: "vitest"`). Karma queda prohibido.
- **Gotcha importante**: el target `test` de la librería usa `"buildTarget": "ngx-test-app:build:development"` en `angular.json`. Es intencional: el builder de ng-packagr no acepta `stylePreprocessorOptions`, y los SCSS de componentes resuelven `@use 'mixins'` gracias a los `includePaths` del build de la app. No lo "arregles" apuntándolo a la librería.
- **`tsconfig.json` → paths**: `ngx-dmaster-ui` apunta al **código fuente** (`projects/ngx-dmaster-ui/src/public-api.ts`), no a `dist/`. El empaquetado real se valida con `npm run build`.
- **Zoneless**: el dashboard usa `provideZonelessChangeDetection()`. La librería no debe depender de zone.js jamás.
- **Angular CDK** disponible como peer de la librería (los overlays lo usan: `cdk/overlay`, `cdk/dialog`, `cdk/portal`). `@angular/forms` también es peer (CVA de switch/checkbox). **Angular Material NO está instalado**.
- **Overlays**: el consumidor debe cargar los estilos estructurales del CDK una vez — `"styles": ["node_modules/@angular/cdk/overlay-prebuilt.css", …]` (el dashboard ya lo hace). Los estilos de panel/backdrop del dialog son globales en `styles/_overlays.scss`; los de `.dm-input` en `styles/_forms.scss` (las directivas no pueden llevar hoja de estilos).
- **Composición entre componentes de la lib** (p. ej. loading-button → spinner): importar desde el barrel del otro componente (`../../primitives/spinner`). Es la única excepción tolerada a la regla de no-relativos-profundos.
- El único copy integrado en la librería es `dismissLabel` del toast (override con `provideToastDefaults`); todo lo demás llega por inputs.
- Nombre npm final: `ngx-dmaster-ui` (verificar disponibilidad con `npm view ngx-dmaster-ui` antes de publicar; publicar desde `dist/ngx-dmaster-ui`).

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
        │   ├── spinner/           # lo consume dm-loading-button
        │   ├── badge/
        │   └── avatar/
        ├── layout/
        │   └── card/              # container-type: inline-size
        ├── buttons/
        │   └── loading-button/    # estados idle/loading/success/error, live region
        ├── forms/                 # CVA: switch, checkbox; form-field + directiva dmInput
        │   ├── switch/            # prop-signal del dashboard lo dogfoodea
        │   ├── checkbox/
        │   └── form-field/        # estilos de .dm-input en _forms.scss (global)
        └── overlays/              # CDK: requieren overlay-prebuilt.css en el consumidor
            ├── tooltip/           # directiva dmTooltip + panel interno
            ├── dialog/            # DmDialogService (cdk/dialog); reexporta DIALOG_DATA/DialogRef
            └── toast/             # DmToastService con cola en signal
```

### Reglas de organización

1. **Un componente = una carpeta** dentro de su categoría (`primitives/`, futuros `buttons/`, `layout/`, `data-display/`…).
2. **Nomenclatura fija** por carpeta: `<name>.component.ts|html|scss|spec.ts`, `<name>.types.ts`, `<name>.tokens.ts`, `index.ts` (barrel), `README.md`.
3. Componentes compuestos (tabs+tab, form-field+label…) comparten carpeta.
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
- Estética: bordes 1px baja opacidad, radios 6–10px, sombras multicapa (`--dm-shadow-*`), micro-interacciones 150–200ms con `--dm-ease-*`. Referencias: shadcn/ui, Vercel Geist, Linear, Radix.
- **Lenguaje visual de marca** (aplicar a componentes nuevos donde encaje): superficies "solid" con gradiente vertical sutil (`color-mix` con white 14–16% arriba) + highlight interior `var(--dm-sheen)`; toasts/overlays con glass (`color-mix` translúcido + `backdrop-filter: blur`); inset shadows suaves en tracks/inputs; press feedback con `scale(0.9)` en `:active`. Tokens de marca: `--dm-gradient-brand` (títulos hero, logo) y `--dm-sheen`.

### Testing

- Vitest con globals (`describe/it/expect` sin imports; `tsconfig.spec.json` → `"types": ["vitest/globals"]`).
- TestBed **siempre** con `provideZonelessChangeDetection()` en providers.
- Inputs en tests con `fixture.componentRef.setInput('nombre', valor)`.
- Overrides de tokens con `TestBed.overrideProvider(TOKEN, { useValue: … })` antes de crear el fixture.

## El dashboard (`ngx-test-app`)

Documentación viva con layout tipo docs: shell (`layout/shell/`) con sidebar (drawer con hamburguesa < 1024px, columna estática desde `lg`), header sticky con logo + selector de idioma + theme toggle, y páginas lazy en `pages/`.

**Marca**: el logo es el monograma "d." sobre tile con gradiente índigo→violeta. Vive en `public/favicon.svg` y como SVG inline en el shell (`#dm-logo-*`) y en el hero del Overview (`#ov-logo-*` — ids únicos por documento). La página **Overview** (`/components`, `pages/overview/`) es el escaparate con un tile por componente y preview en vivo; el CTA de la home apunta ahí.

Los estilos compartidos de las páginas de docs (`.page__*`, `.demo-*`, chips de código inline) son **globales** en `src/styles/_docs.scss` (importado desde `styles.scss`). Es a propósito: parte del contenido llega por `[innerHTML]` (traducciones con `<code>`) y los estilos encapsulados de Angular no alcanzan a los nodos insertados así. El SCSS de cada página solo define su `:host`.

Componentes shared reutilizables en `shared/` (usarlos SIEMPRE en páginas de componente, no reinventarlos):

- `app-demo-block` — render en vivo (content projection) + snippet copiable debajo (`heading`, `code`, `language`).
- `app-code-snippet` — bloque de código copiable (`code`, `language`).
- `app-api-table` — tabla de inputs/outputs (`rows: ApiTableRow[]`).
- `app-prop-signal` — playground: controles (`PropControl[]`) + two-way `[(values)]` con un signal de la página.

**Gotcha**: en `prop-signal`, los `<select>` marcan la opción activa con `[selected]` en cada `<option>` (un `[value]` en el `<select>` se aplica antes de que existan las options y falla).

### Checklist: nuevo componente de la librería

1. Carpeta en `lib/components/<categoría>/<nombre>/` con los 8 archivos de la nomenclatura fija (usar `skeleton/` como plantilla).
2. Tokens de componente en `_themes.scss` si dependen del tema.
3. Export en `public-api.ts`.
4. Tests (mínimo: render por defecto, cada input, a11y del host, defaults inyectables).
5. Página en `pages/components/<nombre>-page/` con: descripción, playground (`prop-signal` + snippet generado), varios `demo-block`, `api-table`, notas de accesibilidad.
6. Ruta lazy en `app.routes.ts` + entrada en `sections` del shell.
7. **Tile en el Overview** (`pages/overview/overview-page.component`): añadir la entrada al array `tiles` y un `@case` con su mini-preview EN VIVO (los previews van dentro de un contenedor `inert`; los overlays usan mocks estáticos con las clases `ov__mock-*`). Esta regla es obligatoria: el Overview es el escaparate de la librería.
8. `npm run lint && npm run lint:styles && npm test` en verde.

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
2. Publicación en npm cuando haya masa crítica: verificar nombre, `npm run build` y publicar desde `dist/ngx-dmaster-ui`.
