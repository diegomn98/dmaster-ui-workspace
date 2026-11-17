# Portadas de release del blog — guía de diseño

Referencia para diseñar la portada ilustrada de cada release del build log
(`/blog`). La serie cubre de la **v0.1 a la v0.12**, una portada por artículo.
Esta guía fija lo que todas comparten para que, juntas, se lean como una serie,
y recoge lo aprendido al dibujarlas.

- Marco común: `projects/ngx-test-app/src/app/shared/release-cover/release-cover.component.*`
- Registro versión → portada: `projects/ngx-test-app/src/app/core/blog/covers.ts`
- Motivos (uno por release): `projects/ngx-test-app/src/app/shared/release-cover/covers/`
- Kit común de los motivos: `shared/release-cover/covers/_cover-kit.scss` (§7)
- Lienzo completo de cualquier portada: `/blog/<slug>/cover` (p. ej. `/blog/v0-12/cover`)

---

## 1. Dirección visual

- **Lienzo 1200×630** (proporción 1.91:1 de og:image). La misma ilustración es
  portada de la tarjeta, hero del artículo e imagen social.
- **Fondo oscuro tipo foto de producto**, con atmósfera sutil: retícula de puntos
  que se desvanece y glow suave del acento detrás del motivo. Nada de stock,
  clipart ni ilustraciones genéricas.
- **Un acento por release**: misma luminosidad y croma, solo cambia el tono (§4).
- **El motivo es la novedad principal**, contada con la propia UI de la librería:
  componentes reales de `@dmaster/ui` siempre que se pueda; UI esquemática muy
  cuidada si no. Tiene que contar **una pequeña historia** (un toast pausado con
  el cursor encima, un código recién pegado en sus seis celdas, un botón de
  copiar con su «Copied»). Si la release no trae componentes nuevos, se ilustra
  el concepto (la v0.12: la librería despiezándose en entry points; la v0.2: el
  terminal de `ng add`).
- **Que el dibujo no mienta.** Los datos que aparecen son reales siempre que se
  pueda: nombres de API y de tokens que existen, las muestras de la v0.8 son los
  tokens derivados de verdad, el contraste que lee la lupa de la v0.6 es el del
  par de tokens que hay debajo, los nueve temas de la v0.10 son los del
  manifiesto, el calendario de la v0.4 marca el día de la release.
- **Profundidad** con capas, sombras y, si encaja, perspectiva 3D en CSS.
  Composición limpia, **poco texto**; código solo en snippets cortos y con los
  nombres reales de la API.
- **Cada portada, su composición** (§8): ninguna repite el encuadre de otra.
- **Estáticas, accesibles** (`role="img"` + `aria-label`) y correctas con el sitio
  en claro **y** en oscuro (la portada es siempre oscura, §10).

## 2. Lienzo y escalado

El lienzo es una **imagen de tamaño fijo**: dentro se mide en **px de lienzo**
(es la excepción consciente a la regla de unidades relativas: el conjunto se
escala entero, como un `<img>`).

`app-release-cover` toma el tamaño que le dé su contenedor (necesita ancho y alto
definidos) y escala el lienzo tipo **`object-fit: cover`**, centrado, solo con CSS:

```scss
:host {
  container-type: size;
  overflow: hidden;
}
.rc__stage {
  // max(ancho/1200, alto/630) como número sin unidad: tan(atan2(a, b)) = a/b
  --dm-cover-scale: max(tan(atan2(100cqw, 1200px)), tan(atan2(100cqh, 630px)));
  transform: translate(-50%, -50%) scale(var(--dm-cover-scale));
}
```

Sin JavaScript ni `ResizeObserver`: el HTML prerenderizado ya sale bien
encuadrado. (Dividir longitudes, `100cqw / 1200px`, aún no tiene soporte amplio;
el truco `tan(atan2())` funciona en todos los navegadores modernos.)

La **og:image** es ese mismo lienzo renderizado a **1.5x** (1800×945, nítido en
feeds retina) como **JPEG q90** (~100 kB; el grano lleva el PNG a ~1,3 MB). La
genera `npm run covers` (`scripts/render-release-covers.mjs`) a partir del build
prerenderizado: la escribe en `public/blog/covers/<slug>.jpg` (se versiona; es lo
que llega a producción) y la copia también al `dist/` ya generado, que se compiló
antes de que la imagen existiera. El artículo la declara con URL absoluta en
`og:image` y `twitter:image` (`twitter:card` = `summary_large_image`), horneadas
en el HTML del prerender.

## 3. Zona segura y recortes

Todo lo importante vive en la **zona segura: 560×420 centrada** (x 320–880,
y 105–525). Es la intersección de todos los recortes del sitio:

```
 0                    320                      880                   1200
 ┌──────────────────────────────────────────────────────────────────────┐ 0
 │ [dm] @dmaster/ui        (franja de esquinas, y 36–64)   v0.12 · fecha │
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│ 65  hero 12:5
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│ 90  tarjeta 8:3
 │                     ┌──────────────────────────┐                     │ 105
 │                     │                          │                     │
 │   (atmósfera y      │       ZONA SEGURA        │   (atmósfera y      │
 │    extensión del    │         560×420          │    extensión del    │
 │    motivo: se ve    │                          │    motivo: se ve    │
 │    en panorámicas)  │                          │    en panorámicas)  │
 │                     └──────────────────────────┘                     │ 525
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│ 540
 │╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌│ 565
 └──────────────────────────────────────────────────────────────────────┘ 630
                destacada ≤ 1:1 → como mucho x 285–915 visibles
```

| Dónde                          | Caja                                 | Lo que se ve del lienzo        |
| ------------------------------ | ------------------------------------ | ------------------------------ |
| Tarjeta del grid               | `aspect-ratio: 8 / 3`                | ancho completo, y 90–540       |
| Destacada (móvil/tablet)       | `aspect-ratio: 12 / 5`               | ancho completo, y 65–565       |
| Destacada (≥ lg)               | 24rem de ancho, `min-height` = ancho | proporción ≤ 1 → x 285–915 máx |
| Hero del artículo              | `aspect-ratio: 12 / 5`               | ancho completo, y 65–565       |
| og:image, `/blog/<slug>/cover` | 1200×630                             | todo, esquinas incluidas       |

Reglas que lo garantizan:

- Las cajas usan **proporción fija**, no altura fija: el recorte es el mismo en
  cualquier ancho (con la antigua altura fija de 8.5rem, una tarjeta móvil llegaba
  a 4.5:1 y cortaba el motivo).
- La destacada (≥ lg) lleva `min-height` igual al ancho de su portada: su
  proporción nunca pasa de 1:1 por corto que sea el texto de la release, así que
  las esquinas no asoman nunca.
- Fuera de la zona segura solo va **lo que puede perderse**: atmósfera y
  extensiones del motivo que enriquecen las panorámicas y la imagen completa (el
  anillo de baldosas fantasma de la v0.12, los tokens que se desvanecen a los
  lados en la v0.8, la app desenfocada de la v0.3, el campo que se sale del
  lienzo en la v0.9).
- **El foco, cerca del centro.** La tarjeta del grid muestra el ancho completo:
  un foco pegado a un lado deja la panorámica desequilibrada (la v0.9 se desplazó
  para que el botón cayera en el centro).

**Marcador `data-safe` (lo comprueba la máquina).** Cada pieza que tiene que
verse siempre (la protagonista, la anotación, el cursor…) lleva
`data-safe="<nombre>"` en su plantilla. `npm run covers` mide esas cajas en el
lienzo prerenderizado y **falla** si alguna se sale de x 320–880, y 105–525, sin
escribir la og:image de esa portada. Los marcos y las extensiones que pueden
desbordar (un panel en 3D, el anillo fantasma) no se marcan.

## 4. Paleta de acentos

**OKLCH con L 72 % y C 0.12 fijos; solo cambia el tono.** C 0.12 es el croma
máximo que cabe en sRGB en los 360° a esa luminosidad (el más justo, 190°, admite
0.124), así que ningún acento se recorta ni se sale de serie. Todos dan ≥ 7.4:1
sobre la tinta de fondo.

El tono sigue el **ángulo áureo** desde el azul de marca: v0.1 = 255°, cada
release +137.5° (`releaseHue()` en `covers.ts`; el spec comprueba que cada
entrada del registro lo respeta). Reparte los tonos sin repetirse y deja las
releases contiguas lejos en el círculo, así que dos tarjetas vecinas nunca se
confunden.

| Release | Tono | Acento (`oklch(72% 0.12 h)`) | Portada                   |
| ------- | ---- | ---------------------------- | ------------------------- |
| v0.1    | 255° | `#6fa7ee`                    | lámina del botón píldora  |
| v0.2    | 33°  | `#e58773`                    | terminal de `ng add`      |
| v0.3    | 170° | `#43bd99`                    | paleta ⌘K                 |
| v0.4    | 308° | `#b98fde`                    | color picker + calendario |
| v0.5    | 85°  | `#c79e41`                    | select múltiple           |
| v0.6    | 223° | `#35b4db`                    | lupa de contraste         |
| v0.7    | 0°   | `#e183a1`                    | superficies + OTP         |
| v0.8    | 138° | `#7eb66b`                    | grafo de tokens           |
| v0.9    | 275° | `#8f9eef`                    | macro del botón de copiar |
| v0.10   | 53°  | `#df8e59`                    | abanico de temas          |
| v0.11   | 190° | `#1dbcb5`                    | cola de toasts            |
| v0.12   | 328° | `#cd89cb`                    | paquete despiezado        |
| v0.13   | 105° | `#b0a946`                    | —                         |
| v0.14   | 243° | `#5badea`                    | —                         |
| v0.15   | 20°  | `#e68485`                    | —                         |
| v0.16   | 158° | `#5abb88`                    | —                         |

Cómo se usa el acento:

- **Un solo foco por portada**: la pieza que cuenta la novedad y el glow que la
  ilumina (la baldosa que sale en la v0.12, el chip recién añadido en la v0.5, el
  marco de pegado en la v0.7). El resto del motivo es neutro (`color="default"`
  en los componentes reales).
- **Colores que son datos** (los nueve temas de la v0.10, las muestras de un color
  picker) se pintan **en tinte apagado**, `color-mix(in oklch, <color> 55%,
#26262c)`: se reconocen sin competir con el foco ni hacer un arcoíris.
- Dentro de la portada **`--dm-primary` es el acento** (y `--dm-primary-fg` la
  tinta oscura: el blanco sobre L 72 % no llega a AA). Los componentes reales con
  `color="primary"` lo toman solos; sus derivados (`-hover`, `-subtle`, `-text`)
  se re-derivan por la cascada OKLCH de `_themes.scss` — la v0.8 los pinta tal
  cual.
- Tinta de fondo: `oklch(14.5% 0.012 h)`, casi negra con un susurro del tono de
  la release. Variables del marco: `--dm-cover-hue`, `--dm-cover-accent`,
  `--dm-cover-ink`.

## 5. Tipografía

Las del sitio: **Inter** (`--dm-font-sans`) y **JetBrains Mono**
(`--dm-font-mono`). Poco texto y siempre con función.

| Elemento                      | Fuente         | Tamaño / peso             | Color                 |
| ----------------------------- | -------------- | ------------------------- | --------------------- |
| Firma `@dmaster/ui`           | Inter          | 17 px / 600, −0.02em      | blanco 88 %           |
| Monograma `dm`                | Inter          | 13 px / 700 en tile 28 px | tinta sobre `#fafafa` |
| Versión · fecha               | JetBrains Mono | 15 px / 500 · 400         | blanco 88 % · 48 %    |
| Anotación del motivo          | JetBrains Mono | 15 px; el dato en acento  | blanco 62 % + acento  |
| Etiquetas internas del motivo | JetBrains Mono | 11 px                     | blanco 45 %           |
| UI dentro del motivo          | Inter          | 13–17 px (títulos 600)    | blanco 48–92 %        |

Snippets de código: nombres reales (`@dmaster/ui/toggle-group`,
`<dm-select multiple filterable>`, `--dm-ease-snappy`…), una línea como mucho.
La fecha va en ISO (`2026-11-16`), como en el resto del blog.

## 6. Capas comunes (el marco)

De abajo arriba, todas en `release-cover.component.scss`:

1. **Tinta** — `--dm-cover-ink` en el host.
2. **Glow** — dos radiales del acento detrás del centro (34 % y 18 % de alfa) y
   un velo cenital blanco al 5 %: da volumen sin «arcoíris».
3. **Retícula de puntos** — 1.1 px cada 24 px, blanco 15 %, con máscara radial
   que la desvanece hacia los bordes.
4. **Grano** — ruido SVG (`feTurbulence`) al 5 %: rompe el banding de los
   degradados y da textura de foto.
5. **Viñeta** — radial a negro 45 % en los bordes.
6. **Motivo** — centrado, `inert` (§9).
7. **Esquinas** — firma (arriba a la izquierda) y versión · fecha (arriba a la
   derecha), en una sola línea a 40 px de los lados, **y 36–64**: fuera de todos
   los recortes del sitio (§3). Solo se ven en la imagen completa (redes). En el
   blog, la versión la pinta el **badge** de la tarjeta.

El motivo no repite el marco: nada de fondos, retículas ni firmas propias.

## 7. Construir el motivo

Un componente por release en `shared/release-cover/covers/cover-vXYZ.component.*`,
con `:host { display: contents; }` y una caja raíz de **560×420** (la zona
segura) donde vive la historia.

### El kit común (`_cover-kit.scss`)

Las piezas que se repiten en la serie salen de un único sitio, para que se vean
igual en todas: `@use 'cover-kit' as kit;`

| Pieza                      | Para qué                                                                |
| -------------------------- | ----------------------------------------------------------------------- |
| `kit.accent($alfa)`        | El acento de la release con alfa (`oklch(72% 0.12 h / α)`).             |
| `kit.accent-deep()`        | Tinta oscura teñida del tono (cantos, sombras de color).                |
| `@include kit.panel($r)`   | Superficie «producto»: degradado casi plano, filo de luz, sombra larga. |
| `@include kit.label`       | Etiqueta interna: mono 11 px, blanco 45 %.                              |
| `@include kit.callout`     | Anotación: píldora de cristal oscuro, mono 15 px, `<b>` en acento.      |
| `@include kit.callout-dot` | El punto de acento de la anotación.                                     |
| `@include kit.cursor($s)`  | Cursor de sistema (SVG en línea); la punta está en (0, 0) del elemento. |

**Gotcha de Sass**: dentro de una custom property las funciones no se evalúan
(`--x: kit.accent(60%)` llega literal y el color no existe). Interpolar:
`--x: #{kit.accent(60%)}`.

### Componentes reales

Se importan por subpath (`@dmaster/ui/toggle-group`) como en cualquier página de
la app. Nada animado (spinners, skeletons, `striped`): la portada es estática; un
spinner se dibuja congelado en SVG (el `loading()` de la v0.11).

Trucos que funcionaron para pintarlos en el estado que cuenta la historia:

- **Estados que necesitan interacción** se fuerzan con su propia API pública: el
  «copiado» de `dm-copy-button` (v0.9) es el check proyectado como `dmCopyIcon`
  más `copyLabel="Copied"`; el código pegado del OTP (v0.7) es su `value`.
- **Tamaño grande y nítido con tokens públicos, no con `transform: scale`**: el
  botón de la v0.1 mide 300×96 con `--dm-button-height`, `--dm-button-min-width`,
  `--dm-button-padding-inline` y `--dm-text-base` en su ámbito (el texto
  escalado con transform se emborrona y las dimensiones dejan de ser exactas).
  Con `min-width` mayor que el contenido, el tamaño es exacto y las líneas de
  construcción se pueden dibujar a mano.
- **SVG proyectado** en un componente: darle `width`/`height` explícitos (los
  estilos encapsulados del componente no le llegan y sale a 0×0).
- **Overlays** (panel del select, `dm-command`, toasts, paneles del date y color
  picker) se portalan al root: no se pueden pintar en línea. Se replican fieles
  (medidas, superficies, radios del componente real) con componentes reales
  dentro (`dm-checkbox`, `dm-kbd`, `dm-icon`, `dm-badge`).
- **Variables internas** (las de mapeo color × variante, el borde del OTP relleno)
  no son API: no se fuerzan. Si el componente no da el acento que hace falta, se
  añade alrededor (el marco de pegado de la v0.7).
- Un mismo trozo de UI que se pinta dos veces (la lupa de la v0.6) va en un
  `<ng-template>` con `NgTemplateOutlet`.
- Iconos: `<dm-icon name="…">` del set registrado (SVG en línea). No la fuente
  Material Symbols: depende de la red al renderizar la og:image.

### Tema forzado y el gotcha de los tokens de `:root`

El host estampa `data-dm-theme="dark"`, que re-declara en la portada los tokens
oscuros aunque el sitio esté en claro. Pero ~30 tokens de componente
(`--dm-slider-track-bg: var(--dm-bg-muted)`, kbd, menu, tooltip, command…) se
declaran **solo en `:root`**: su `var()` se resuelve en `<html>` y llegarían a la
portada ya resueltos en claro (la pista del slider salía blanca). El marco los
re-declara en su host; si la librería añade otro token así en `:root`, hay que
añadirlo también allí.

### CSS 3D

- Plano con `transform: translate(-50%, -50%) rotateX(56deg) rotateZ(-45deg)` y
  `transform-style: preserve-3d`, posicionado en absoluto (una pista de grid
  implícita se dimensiona al contenido y descentra el plano).
- Elevación con `translateZ`; **canto de losa** con sombras duras desplazadas
  `(-d, +d)` en el plano, que en pantalla caen en vertical — grosor sin caras
  extra. El canto de una tecla (v0.3) es lo mismo en vertical: `0 9px 0 <tinta>`.
- `opacity`, `filter`, `mask` u `overflow` en un elemento **aplanan** su subárbol
  3D: ponerlos solo en hojas (las baldosas fantasma llevan `opacity` y no tienen
  hijos 3D), nunca en el plano.
- **Halos grandes fuera del 3D.** Una sombra difusa ancha (`0 0 90px`) sobre una
  pieza transformada en 3D sale **recortada en rectángulo**: Chromium rasteriza
  la capa 3D con sus propios límites. El halo va en un elemento 2D detrás (el
  `c4__halo` de la v0.4); dentro del 3D solo sombras cortas.
- **El signo de `rotateY`**: con `transform-origin` en el borde izquierdo,
  `rotateY(+θ)` aleja el lado derecho; con el origen en el borde derecho,
  `rotateY(−θ)` aleja el izquierdo. Comprobarlo en captura: invertido, la pieza se
  acerca en vez de alejarse (y lo que debía flotar delante queda detrás).
- Elementos verticales (líneas de despiece): `rotateX(90deg)` con
  `transform-origin: top`. Se anclan con `top` (con `bottom`, su borde superior
  —el origen del giro— cae en otro sitio). Las líneas ocultas tras una pieza se
  **omiten**, como en un dibujo técnico (y Chromium a veces las pinta delante).
- `perspective` larga (1400–3200 px): profundidad sin deformar las piezas. Una
  corta (1100 px) sobre una pieza ancha la encoge tanto que deja de leerse.

### Profundidad de campo

- Desenfoque con **`filter: blur()` en hojas**: un panel lejano entero (el
  calendario de la v0.4, la app de la v0.3) o un texto por tramos, de más a menos
  desenfoque hacia el foco (la clave de la v0.9), más una `mask-image` en
  degradado que disuelve el extremo.
- **Nada de `backdrop-filter`**: en el lienzo completo funciona, pero dentro de
  una tarjeta escalada Chromium muestrea mal el fondo y pinta bloques claros
  (sobre todo con el sitio en claro).

### Cursor

Solo donde la interacción **es** la historia: el hover que pausa (v0.11), el clic
que copia (v0.9), la casilla que se marca (v0.5). Nunca encima del texto que
cuenta la historia (su punta, al lado del dato: el primer intento de la v0.9
tapaba el «Copied»).

### Medir, no adivinar

`data-safe` en las piezas que deben verse (§3) y capturas de los recortes reales
(§12). Las posiciones que dependen de un componente real (dónde cae un texto) se
miden con `getBoundingClientRect()` y se fijan como variables de la caja (la lupa
de la v0.6: `--dm-c6-lx`, `--dm-c6-ly`, `--dm-c6-r`).

## 8. Composiciones de la serie

Ninguna portada repite el encuadre de otra: juntas en el grid tienen que
distinguirse por la forma, no solo por el color. Antes de diseñar una nueva,
elegir una composición que no esté en esta tabla.

| Release | Composición                                      | Foco (acento)                 | Profundidad                          |
| ------- | ------------------------------------------------ | ----------------------------- | ------------------------------------ |
| v0.1    | Lámina técnica: héroe central + fichas alrededor | El botón píldora              | Líneas de construcción, glow         |
| v0.2    | Ventana en perspectiva + piezas flotando delante | La línea «ready» del terminal | `rotateY`, chips en `translateZ`     |
| v0.3    | Tres planos: fondo / overlay / primer plano      | La acción activa de la paleta | App desenfocada, teclas físicas      |
| v0.4    | Dos piezas de pie, en ángulo                     | El tirador sobre el acento    | Giros opuestos, plano lejano borroso |
| v0.5    | Producto de frente: trigger + panel abierto      | El chip recién añadido        | Sombras                              |
| v0.6    | Lupa sobre la UI                                 | El cristal y su lectura       | Contenido ×2 recortado en círculo    |
| v0.7    | Marcos concéntricos                              | El marco de pegado del OTP    | Láminas separadas en `translateZ`    |
| v0.8    | Diagrama de flujo con conectores                 | El override y su familia      | Paneles, cables con glow             |
| v0.9    | Macro cortado por el encuadre                    | El botón «Copied»             | Desenfoque escalonado, `rotateY`     |
| v0.10   | Abanico radial                                   | La lámina que sale            | Sombras entre láminas                |
| v0.11   | Cola que retrocede en profundidad                | El toast con el cursor        | `rotateY`, estela en `translateZ`    |
| v0.12   | Campo isométrico despiezado                      | La baldosa que sale           | Plano isométrico, `translateZ`       |

Libres para las siguientes (ideas): vista cenital de un tablero o una mesa;
secuencia en tira (antes → después, 3 fotogramas); corte transversal de capas;
órbita alrededor de un centro; mosaico que se completa con la pieza que falta;
reflejo sobre un suelo brillante; pantalla de dispositivo en mano (sin marcas).

## 9. Accesibilidad

- `app-release-cover` es `role="img"` con `aria-label` = el texto alternativo de
  la release en `blog.coverAlts` (**los 3 idiomas**; el tipo sale del registro,
  así que una portada sin su texto no compila). Describe la escena y la historia
  (qué está pasando y en qué estado), no el estilo; los textos visibles que
  importan van citados.
- El motivo es `inert`: los componentes reales no son focusables ni llegan al
  árbol de accesibilidad (el `role="img"` ya los hace presentacionales). Aun así,
  cada componente real lleva su nombre accesible (`ariaLabel`), como en cualquier
  página: el gate de axe recorre también las rutas `/cover`.
- El badge de versión de la tarjeta: cristal oscuro con texto `#fafafa` (~15:1
  sobre la portada).

## 10. Claro y oscuro

La portada es **siempre oscura** y se pinta igual con el sitio en claro o en
oscuro (comprobado: capturas byte a byte idénticas en ambos temas). Lo
garantizan el `data-dm-theme="dark"` del host, la re-declaración de los tokens de
`:root` (§7) y que el marco no lee ningún color del tema del sitio. Sobre la
página clara, la tarjeta la enmarca con su borde y sombra habituales. Revisar
igualmente las tarjetas en claro: los efectos que leen el fondo de la página
(`backdrop-filter`) fallan ahí (§7).

## 11. Integración

- **Registro** (`core/blog/covers.ts`): `RELEASE_COVERS = { v012: { hue: 328,
motif: CoverV012Component }, … }`. `findCover(entry)` → portada o `undefined`.
  Sin entrada, la release conserva la portada generada de siempre (versión +
  glifo de categoría): la siguiente release puede salir así un día y no se rompe
  nada.
- **Marco** (`app-release-cover`): inputs `version`, `date`, `hue`, `label` y
  `motif` (o contenido proyectado).
- **Tarjetas** (`pages/blog/blog-page.*`): portada escalada tipo cover, centrada,
  con el badge de versión encima y un zoom de 1.03 al hover (apagado con
  `prefers-reduced-motion`).
- **Artículo** (`pages/blog/article/*`): hero 12:5 con badge; meta sociales por
  artículo (`SocialMetaService`): título, entradilla en texto plano, URL canónica,
  `article:published_time` y, con portada, `og:image`/`twitter:image` = el JPEG.
  Se hornean en el prerender; `reset()` devuelve las del sitio al salir.
- **Lienzo completo** (`/blog/<slug>/cover`): prerenderizado solo para las
  releases con portada, `noindex`, fuera del sitemap. Es la fuente de la og:image.
- **Peso**: los motivos viven en los chunks diferidos del blog (el índice los
  carga todos); nada de esto entra en el bundle inicial.

## 12. Checklist: portada nueva

1. Leer el artículo de la release: ¿cuál es la novedad y qué historia cuenta en
   un vistazo? Un foco, y datos reales (§1).
2. Elegir una composición libre (§8) y apuntarla en la tabla.
3. `cover-vXYZ.component.{ts,html,scss}` en `shared/release-cover/covers/`, con el
   kit (§7) y `data-safe` en las piezas que deben verse.
4. Entrada en `RELEASE_COVERS` con `hue: releaseHue('v0.XY')` (tabla §4).
5. `blog.coverAlts.vXYZ` en `translations.{en,es,fr}.ts`.
6. Revisar:
   - `/blog/<slug>/cover` a 1200×630, con las guías de los recortes;
   - **en miniatura** (~300 px de ancho, el tamaño de una tarjeta): la historia
     tiene que leerse por las formas, sin leer el texto;
   - **en hoja de contactos con las demás**: que no se parezca a ninguna y que
     siga siendo de la serie;
   - en `/blog` (destacada, panorámica en lg/md/móvil, claro y oscuro).
7. `npm run build:app && npm run covers` → `public/blog/covers/<slug>.jpg`
   (versionarlo). Falla si algo marcado con `data-safe` se sale de la zona segura.
8. Gates habituales + regenerar las baselines visuales (cambian `/blog`, el
   artículo y la ruta `/cover` nueva).

## 13. Fichas de portada

Cada ficha: la historia, lo que se dibuja y lo que no es obvio.

### v0.1 — «The initial public surface» · 255° `#6fa7ee`

Lámina de especificación del lenguaje visual que nació con la primera release:
un `dm-button` real en píldora a 300×96 (tokens públicos) con las líneas de
construcción del radio `full` y la cota `3rem`; tres fichas: relleno plano
(`--dm-primary`), tema por atributo (`data-dm-theme`: light / dark / auto, con
`dm-badge`) y el press (`scale(0.97)` sobre la curva real de `--dm-ease-snappy`,
`cubic-bezier(0.2, 0, 0, 1)`, con sus asas).

### v0.2 — «Packaging done right» · 33° `#e58773`

Sin componentes nuevos: lo que ve quien instala. Terminal en tres cuartos
(`rotateY` sobre su borde izquierdo: el texto arranca cerca y legible) con
`ng add @dmaster/ui`: instala el CDK, actualiza `angular.json` y `styles.scss`, y
la última línea, «@dmaster/ui is ready», en acento. Delante, a distintas
profundidades, tres chips con lo que trae el paquete: `./styles/*`,
`dmaster-ui.css`, un `ThemeService` seguro en SSR.

### v0.3 — «Eleven components in one release» · 170° `#43bd99`

Tres planos: la app desenfocada bajo el velo del overlay; la paleta de
`dm-command` (réplica) con «theme» escrito y «Dark theme» activa; y delante las
teclas ⌘ y K, físicas (canto con sombra dura, la K recién pulsada, retroiluminadas
con el acento). `dm-kbd` e iconos reales dentro de la paleta.

### v0.4 — «The field family grows» · 308° `#b98fde`

Los dos campos pesados como paneles de pie en ángulo. Delante, el color picker
(réplica) eligiendo el acento de la propia portada: el área S/V usa el tono HSV
del acento (272°) y los tiradores caen en S 36 % · V 87 %, el hex dice `B98FDE`.
Detrás, desenfocado, el calendario de agosto de 2026 con el 18, el día de la
release (semana en lunes; el 1 cae en sábado). El halo del panel va en 2D (§7).

### v0.5 — «Autocomplete, multiple select» · 85° `#c79e41`

`dm-select` `multiple filterable` abierto, de frente: el filtro con «vit», el
grupo Tooling con la coincidencia resaltada, `dm-checkbox` reales, y el cursor
marcando «Vitest», que acaba de aparecer como chip (el único con acento) junto a
los `dm-badge` neutros del trigger, como en el select real. Anotación:
`<dm-select multiple filterable>`.

### v0.6 — «A full WCAG AA audit» · 223° `#35b4db`

Tarjeta de pedido con tres componentes nuevos reales en neutro (`dm-stepper`,
`dm-rating`, `dm-number-input`) y una lupa de inspector sobre su texto más débil,
«128 reviews». La lectura es verdad: la tarjeta es `--dm-bg-elevated` (#2b2b32) y
el texto `--dm-fg-subtle` (#92929a), el par que la auditoría recalibró → 4.55:1,
AA. La lupa es la misma tarjeta (`<ng-template>`) escalada ×2 alrededor del centro
del cristal y recortada en círculo.

### v0.7 — «A surface ramp with real contrast» · 0° `#e183a1`

Tres superficies anidadas pintadas con los tokens reales (`--dm-bg-subtle` →
`-muted` → `-elevated`), cada una rotulada con su nombre y separadas en
profundidad. Dentro, dos componentes nuevos: un `dm-toggle-group` neutro y, en la
tarjeta, el `dm-otp` con el código recién pegado; el foco es el marco de pegado
en acento con el badge «Pasted» (el borde del OTP relleno es una variable
interna: no se fuerza).

### v0.8 — «Real theming» · 138° `#7eb66b`

Grafo de izquierda a derecha: un override, `--dm-primary`, alimenta
`--dm-primary-hover`, `-text` y `-subtle` (las muestras **son** esos tokens,
re-derivados por la cascada dentro de la portada), que recolorean una tarjeta con
`dm-badge`, `dm-switch`, `dm-checkbox` y `dm-button` reales. Anotación: la
sintaxis de color relativo de `_themes.scss`. A los lados, desvaneciéndose,
tokens por componente reales (de las tablas «Design tokens» de los README).

### v0.9 — «A copy-to-clipboard button» · 275° `#8f9eef`

Macro: el campo de una clave de API tan cerca que el lienzo lo corta; el
`dm-copy-button` real en su estado «Copied» (tokens públicos de `dm-button` para
el tamaño), el cursor y la onda del clic. La clave se desenfoca por tramos hacia
lo lejano y el campo se aleja (`rotateY`) y se disuelve con una máscara. Primer
intento descartado: tarjeta de fondo desenfocada (repetía el recurso de la v0.3)
con `backdrop-filter` (bloques claros en las tarjetas).

### v0.10 — «Prebuilt themes» · 53° `#df8e59`

Abanico de muestras con los nueve temas reales de `@dmaster/ui/themes/*`
(manifiesto), girando sobre su remache, en tinte apagado; la lámina Sunset (el
tono de la release) sale del abanico con el acento y `dm-switch`, `dm-badge` y
`dm-button` reales recoloreados. Anotación: `ng add @dmaster/ui --theme=sunset`.
Los nombres van arriba a la izquierda de cada lámina: es la franja que la vecina
no tapa (abajo y en vertical se cortaban o salían boca abajo).

### v0.11 — «Toasts that wait for you» · 190° `#1dbcb5`

La pila de toasts (réplica fiel del contenedor) en perspectiva: el más reciente,
«Report exported», con el cursor encima y su barra de tiempo congelada a medias;
detrás un `loading()` (spinner congelado) y uno informativo; al fondo la cola
retrocediendo en profundidad con «+3 queued». Anotación: «timer paused · 2.6s
left».

### v0.12 — «One entry point per component» · 328° `#cd89cb`

La release no trae componentes nuevos: cambia cómo se publica la librería.

- **Escena**: el paquete despiezado en isométrico. Un campo 5×5 de losas, una
  por entry point. El núcleo 3×3 lleva componentes reales dentro (`dm-avatar`,
  `dm-switch`, `dm-badge`, `dm-button`, `dm-checkbox`, `dm-kbd`, `dm-progress`,
  `dm-slider`), todos en neutro; el anillo exterior son losas fantasma con
  nombres reales (`/menu`, `/dialog`, `/table`…) que se desvanecen: son 46.
- **Historia**: la losa `/toggle-group` sale del paquete (elevada 104 px, el único
  elemento con acento) y deja su hueco vacío y punteado, con líneas de despiece
  desde sus esquinas. Una anotación horizontal nombra el subpath,
  `@dmaster/ui/toggle-group`. Es lo que cambia la 0.12: un componente que solo usa
  una ruta diferida sale del bundle inicial y viaja con esa ruta.
- **Encaje**: núcleo, pieza que sale y anotación dentro de la zona segura; el
  anillo fantasma la desborda a propósito, así que la destacada (cuadrada) queda
  enfocada en la historia y las panorámicas y la og:image se ven llenas.
