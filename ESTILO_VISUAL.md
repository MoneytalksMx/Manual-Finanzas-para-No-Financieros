# Estilo visual · Manual de Finanzas para No Financieros

Guía del estilo visual del sitio `manual-finanzas-para-no-financieros.moneytalks.mx`, el sitio de los casos «Una empresa que conoces» del manual. Todo sale de `index.html` (estilos y lógica), `casos.js` (contenido) e `img/` (logos).

---

## 1. Principios

- **Tres protagonistas por igual:** MoneyTalks, el lema «Programa de Bienestar Financiero» y Envases tienen el mismo peso visual.
- **Fondo hueso de MoneyTalks y acentos de Envases:** el fondo es cálido y neutro, y el rojo de Envases marca lo importante: dónde estás, qué está activo y qué se puede tocar.
- **Lectura primero:** el texto se lee cómodo (línea de unos 68 caracteres e interlineado amplio) y los adornos no compiten con el contenido.
- **Movimiento con propósito:** las animaciones explican qué pasó (una casilla se llena, una rama se dibuja hasta la sección elegida) y se apagan si el sistema pide reducir movimiento.

---

## 2. Marcas

| Elemento | Archivo | Uso |
|---|---|---|
| Logo MoneyTalks | `logo.png` | Encabezado; también es el favicon |
| Logo Envases (color) | `img/envases.webp` | Encabezado |
| Logo Envases (blanco) | `img/envases-blanco.webp` | Pie de página sobre fondo carbón |
| Logos de los casos | `img/logos/*.webp` | 19 logos, recortados sin margen, máximo 480 × 160 px |

**Encabezado de marca:** `MoneyTalks | Programa de Bienestar Financiero | ENVASES`

- Los tres elementos miden lo mismo de ancho (`--bw`).
- El logo de Envases va al **84 %** de `--bw`, porque su bloque rojo pesa más a la vista.
- El lema mide `--bw / 10` de tamaño de letra, en peso 600, en dos líneas.
- Los separadores son líneas de 2 px en `--ink`, con un alto de `--bw × 0.3`.

| Contexto | `--bw` | Disposición |
|---|---|---|
| Pantalla del código (computadora) | 210 px | Fila |
| Pantalla del código (celular ≤ 560 px) | 190 px | Columna, con separadores horizontales de 56 px |
| Dentro del manual (computadora) | 150 px | Fila, sobre una barra `#F7F6F4` |
| Dentro del manual (celular ≤ 560 px) | hasta 96 px (se ajusta al ancho) | Fila compacta |

---

## 3. Color

### Paleta base (variables CSS en `:root`)

| Variable | Valor | Nombre | Uso |
|---|---|---|---|
| `--bg` | `#F4F3F1` | Hueso MoneyTalks | Fondo general |
| `--ink` | `#1F1F1F` | Tinta | Texto principal, títulos, separadores del encabezado |
| `--muted` | `#6B6862` | Tinta suave | Texto secundario, etiquetas, notas |
| `--env-red` | `#AA1124` | Rojo Envases | Acento principal (`--brand`) |
| `--env-red-dark` | `#921327` | Rojo Envases oscuro | Degradado de la franja del pie de página |
| `--env-gray` | `#999998` | Gris Envases | Texto gris de la marca |
| `--env-ink` | `#262626` | Carbón Envases | Pie de página, casillas llenas del código, botones principales |
| `--danger` | `#C2410C` | Naranja quemado | Errores (distinto del rojo de Envases a propósito) |

### Neutros de apoyo

| Valor | Uso |
|---|---|
| `#FFFFFF` | Tarjetas de logos, cuerpo de las tablas y del muro |
| `#F7F6F4` | Barra del encabezado dentro del manual |
| `#F1EEE9` | Cabeceras de tablas y del muro de casos |
| `#FBFAF8` | Fondo de las tablas |
| `#E2DED7` / `#E7E3DC` / `#EBE7E1` | Bordes y líneas divisorias |
| `#D6D1C9` | Líneas del menú de ramas, recuadros punteados, puntos de la guía |
| `#E6E3DE` | Casillas vacías del código |
| `#E9E6E1` / `#DEDAD3` | Botones secundarios (normal y al pasar el mouse) |
| `#F7E7E9` | Cabecera de una tarjeta del muro al pasar el mouse |
| `#2B2A27` | Texto de párrafos de los casos |
| `#D9D9D9` | Texto del pie de página |

### Dónde va el rojo de Envases

- La línea de 4 px en el borde superior de la página.
- La etiqueta «CAPÍTULO N» encima de cada título de capítulo.
- La marca del capítulo activo y la línea que se dibuja hasta la sección elegida en el menú.
- La sección activa del menú.
- Los números de las preguntas de «Para pensar» y de la lista de la guía.
- Los enlaces de las fuentes y «¿Cómo funciona?».
- La franja que se abre al poner el código correcto.
- El círculo con el número de capítulo en el muro de casos.
- Los contornos de foco del teclado.

---

## 4. Tipografía

**Fuente única:** Montserrat (Google Fonts), pesos **500** y **600**. Si no carga, se usa `system-ui, sans-serif`.

| Rol | Tamaño | Peso | Detalles |
|---|---|---|---|
| Título de capítulo | `clamp(24px, 4vw, 32px)` | 600 | `text-wrap: balance` |
| Título del caso (encabezado) | `clamp(19px, 2.6vw, 23px)` | 600 | Interlineado 1.35 |
| Título de la guía | 21 px | 600 | |
| Subtítulo de sección (01–07) | 18 px | 600 | Número de 13 px en `--muted` |
| Párrafo de caso | 15.5 px | 500 | Interlineado 1.7, máximo 68 caracteres por línea |
| Párrafo de la guía | 15 px | 500 | Interlineado 1.6 |
| Menú: capítulo | 15 px | 500 | Número con cifras de ancho fijo |
| Menú: sección | 14 px | 500 (600 activa) | |
| Tablas | 13.5 px | 500 | Cabecera de 12 px en `--muted` |
| Fuentes | 13.5 px | 500 | Enlace de 12.5 px |
| Notas de tabla | 13 px | 500 | `--muted` |
| Etiquetas en mayúsculas | 10.5–13 px | 600 | Espaciado de letras de 0.06 a 0.14em |

Las cifras usan `font-variant-numeric: tabular-nums` para que las columnas de números queden alineadas.

---

## 5. Disposición y espaciado

- **Ancho máximo del contenido:** 1160 px, centrado.
- **Computadora:** dos columnas, el índice de 320 px y el contenido, con 48 px de separación y márgenes de 40/24/96 px.
- **Celular (≤ 860 px):** una columna con margen lateral de 16 px y el índice oculto en un panel lateral.
- **Secciones del caso:** 24 px de espacio arriba y abajo, separadas por una línea de 1 px.
- **Ancla de desplazamiento:** 24 px en computadora y 76 px en celular, para que el botón fijo no tape el título.

### Puntos de quiebre

| Ancho | Cambio |
|---|---|
| ≤ 860 px | El índice pasa a panel lateral con botón fijo, la tarjeta de logos va arriba del título y el muro queda en 2 columnas |
| ≤ 560 px | El encabezado de marca se apila en la pantalla del código y se compacta dentro del manual; las casillas del código se separan menos |

---

## 6. Bordes, radios y sombras

| Elemento | Radio |
|---|---|
| Tarjeta de logos del caso, tarjeta de la guía | 18 px (la guía en celular: 20 px solo arriba) |
| Tarjetas del muro, ilustraciones de la guía | 14 px |
| Tablas, recuadros punteados, botones | 12 px |
| Casillas del código | `min(12px, tamaño/2)` |
| Botón del índice, botón de cerrar | 10 px |
| Círculo de número de capítulo | 50 % |

**Sombras (siempre suaves y cálidas):**

- **Tarjeta de logos:** `0 1px 2px rgba(31,31,31,.04), 0 8px 24px -12px rgba(31,31,31,.12)`
- **Tarjeta del muro al pasar el mouse:** `0 10px 24px -14px rgba(170,17,36,.35)`
- **Panel del índice en celular:** `12px 0 32px -16px rgba(38,38,38,.35)`
- **Guía:** `0 24px 60px -20px rgba(0,0,0,.45)`

**Fondos oscurecidos:** `rgba(38,38,38,.45)` detrás del panel del índice y `rgba(38,38,38,.55)` detrás de la guía.

---

## 7. Movimiento

| Curva | Valor | Uso |
|---|---|---|
| Salida suave (curva principal) | `cubic-bezier(0.23, 1, 0.32, 1)` | Entradas, pliegues, desplazamientos y línea del menú |
| Resorte | `cubic-bezier(0.3, 1.35, 0.6, 1)` | Casillas y caracteres del código, palomita de éxito |

| Animación | Duración |
|---|---|
| Entrada del caso y de las tarjetas | 400–500 ms |
| Tarjetas del muro | 450 ms, con 35 ms de retraso entre una y otra |
| Pliegue de un capítulo del menú | 300 ms |
| Línea que se dibuja en el menú | 400 ms |
| Panel del índice en celular | 320 ms |
| Casillas del código | 300 ms, con 20 ms de retraso entre una y otra |
| Cambio de paso de la guía | 320 ms |
| Cambios de color | 200 ms |

Con `prefers-reduced-motion: reduce`, las transiciones bajan a 1 ms y las animaciones se desactivan.

---

## 8. Componentes

### 8.1 Pantalla del código (basada en *CodeSlots* de React Bits)

- 9 casillas que aceptan letras y números; las minúsculas se muestran en mayúsculas.
- **Casilla vacía:** `#E6E3DE`. La casilla activa se oscurece 9 % con `--ink` y tiene un cursor que parpadea.
- **Casilla llena:** se rellena desde el centro en carbón `#262626` con la letra en blanco, que entra subiendo 8 px.
- **Código incorrecto:** las casillas se tiñen de naranja quemado `--danger`, aparece el mensaje «Código incorrecto. Inténtalo de nuevo.» y se vacían en cascada.
- **Código correcto:** las letras se hunden, una franja roja `--env-red` se abre desde el centro y aparece una palomita blanca.
- **Sesión:** dura 24 horas por dispositivo.

### 8.2 Menú de capítulos (basado en *BranchedMenu* de React Bits)

- Un «tronco» vertical de 2 px en `#D6D1C9` que se desvanece al final.
- Cada capítulo lleva su número y su nombre. Al abrirse, salen ramas curvas hacia sus 7 secciones.
- La sección activa dibuja una línea roja desde el tronco hasta ella, y una marca roja de 2 × 16 px señala el capítulo activo.
- Solo queda abierto el capítulo que se está leyendo.
- Arriba aparece el enlace «¿Cómo funciona?», en rojo con un ícono de ayuda.

### 8.3 Índice en celular

- **Botón fijo arriba:** ícono de tres líneas en un cuadro carbón de 38 px, la etiqueta «ÍNDICE» en rojo y el capítulo actual. El fondo es hueso al 92 % con desenfoque.
- **Panel lateral:** entra desde la izquierda con un ancho de `min(88vw, 360px)` y oscurece el fondo. Se cierra al elegir una sección, con la X, tocando el fondo o con Esc.

### 8.4 Capítulo y secciones del caso

- La etiqueta «CAPÍTULO N» va en rojo y en mayúsculas, y debajo el título del capítulo.
- Las 7 secciones van numeradas de **01** a **07**: Encabezado, La historia, Los números clave, Qué tiene que ver con tu manual, Para pensar, En una planta de latas y Fuentes.
- Una sección sin contenido muestra un recuadro punteado de 1.5 px con el texto «Contenido pendiente».

### 8.5 Encabezado del caso

- A la izquierda va la lista Capítulo / Empresa (etiqueta en `--muted` y valor en 600), con el título del caso debajo.
- A la derecha va una **tarjeta blanca de logos** de al menos 200 × 120 px. Con dos empresas, los logos se separan con una «y».
- En celular, la tarjeta va arriba del título.

### 8.6 Muro de casos (capítulo 0)

- Título: «UN CASO POR CAPÍTULO».
- Hay una tarjeta por capítulo, del 1 al 16:
  - **Cabecera** `#F1EEE9`: círculo rojo con el número, la palabra «CAPÍTULO N» en rojo y el nombre del capítulo en hasta 2 líneas (3 en celular).
  - **Cuerpo** blanco: el logo o los logos de la empresa.
- En computadora, al pasar el mouse la tarjeta sube 2 px, el borde toma un tono rojizo y la cabecera pasa a `#F7E7E9`.
- Las columnas se acomodan solas, con un mínimo de 200 px por tarjeta; en celular quedan en 2 columnas.

### 8.7 Tablas

- Contenedor con borde de 1 px y radio de 12 px sobre `#FBFAF8`. Si la tabla no cabe, se desliza de lado dentro de su caja (ancho mínimo de 520 px).
- La cabecera usa fondo `#F1EEE9` y texto de 12 px en `--muted`.
- La primera columna va en 600, como encabezado de fila, y las cifras usan dígitos de ancho fijo.
- Debajo puede ir una nota de fuente en 13 px y `--muted`.

### 8.8 Preguntas y fuentes

- **Para pensar:** lista numerada con los números en rojo y peso 600.
- **Fuentes:** cada referencia en un bloque, con el enlace completo en rojo debajo. El enlace se parte donde haga falta y se abre en otra pestaña.

### 8.9 Guía de uso (primera visita)

- Tarjeta hueso con un borde superior rojo de 5 px. En computadora va centrada (460 px de ancho, 440 px de alto mínimo); en celular sube desde abajo.
- Tiene 4 pasos: bienvenida, índice, las 7 partes y el capítulo 0.
- Arriba muestra el contador «N de 4» y el botón «Saltar guía».
- Abajo tiene puntos de avance: el actual es rojo y alargado a 20 px.
- **Botón principal:** carbón, que pasa a rojo al pasar el mouse.
- **Botón secundario:** `#E9E6E1`.

### 8.10 Pie de página

- Franja de 6 px con degradado de `#AA1124` a `#921327`.
- Fondo carbón `#262626`, con el logo blanco de Envases y el texto «Manual de Finanzas para No Financieros · Programa de Bienestar Financiero de MoneyTalks para Envases».

---

## 9. Accesibilidad

- Todo se puede usar con teclado y tiene un contorno de foco visible de 2 px en rojo.
- Hay textos alternativos en todos los logos («Logo de …»).
- Se usan `aria-expanded`, `aria-current`, `aria-live` y `role="dialog"` donde corresponde. La guía mantiene el foco dentro de ella y se cierra con Esc.
- El contraste del texto principal sobre hueso es alto; el gris `--muted` se usa solo en texto secundario.
- El movimiento se reduce si el sistema lo pide.

---

## 10. Créditos de componentes

- **CodeSlots** y **BranchedMenu** vienen de [React Bits](https://reactbits.dev). Se portaron a HTML, CSS y JavaScript sin dependencias y se adaptaron a la paleta del sitio.
