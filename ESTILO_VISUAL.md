# Estilo visual · Manual de Finanzas para No Financieros

Guía de diseño del sitio de los casos «Una empresa que conoces» del manual:
**https://manual-finanzas-para-no-financieros.moneytalks.mx**

Todo el sitio vive en tres partes:

- `index.html`: estilos, estructura y lógica.
- `casos.js`: el texto de los 17 casos.
- `img/`: logos y banners.

---

## 1. Principios

- **Tres marcas con el mismo peso:** MoneyTalks, el lema «Programa de Bienestar Financiero» y Envases tienen el mismo protagonismo en el encabezado.
- **Tres capas de color:**
  - El **hueso de MoneyTalks** es el fondo de todo.
  - El **rojo de Envases** es el marco del sitio: la línea superior, el índice, los botones, el pie de página y la planta de latas.
  - El **color de la empresa del caso** pinta el contenido de cada capítulo: banner, números de sección, tablas, preguntas y palabras resaltadas.
- **Lectura primero:** líneas de unos 68 caracteres, interlineado amplio y adornos que no compiten con el texto.
- **Movimiento con propósito:** las animaciones explican qué pasó y se apagan si el sistema pide reducir movimiento.

---

## 2. Logos

| Elemento | Archivo | Medidas | Uso |
|---|---|---|---|
| MoneyTalks | `logo.png` | 466 × 135 px | Encabezado y favicon |
| Envases (color) | `img/envases.webp` | 720 × 188 px | Encabezado |
| Envases (blanco) | `img/envases-blanco.webp` | 720 × 188 px | Pie de página sobre carbón |
| Logos de los casos | `img/logos/*.webp` | Máximo 480 × 160 px, sin margen | Tarjeta de logos, muro de casos, tarjetas de anterior/siguiente, guía |

### Logos de los casos

| Capítulo | Archivo | Empresa |
|---|---|---|
| 1 | `bimbo.webp` | Grupo Bimbo |
| 2 | `walmex.webp` y `ferrari.webp` | Walmart de México y Centroamérica, y Ferrari |
| 3 | `cemex.webp` y `airbnb.webp` | Cemex y Airbnb |
| 4 | `amazon.webp` | Amazon |
| 5 | `liverpool.webp` | El Puerto de Liverpool |
| 6 | `volaris.webp` | Volaris |
| 7 | `kimberly.webp` | Kimberly-Clark de México |
| 8 | `mercadolibre.webp` | Mercado Libre |
| 9 | `toyota.webp` | Toyota |
| 10 | `alsea.webp` | Alsea |
| 11 | `chedraui.webp` y `soriana.webp` | Chedraui y Soriana |
| 12 | `aeromexico.webp` | Aeroméxico |
| 13 | `bmw.webp` | BMW Group |
| 14 | `apple.webp` | Apple |
| 15 | `tiendas3b.webp` | Tiendas 3B |
| 16 | `gruma.webp` | Gruma |

### Encabezado de marca

`MoneyTalks | Programa de Bienestar Financiero | ENVASES`

- Los tres elementos miden lo mismo de ancho (`--bw`).
- El logo de Envases va al **84 %** de `--bw`, porque su bloque rojo pesa más a la vista.
- El lema mide `--bw / 10` de tamaño de letra, en peso 600, en dos líneas.
- Los separadores son líneas de 2 px en `--ink`, con un alto de `--bw × 0.3`.

| Contexto | `--bw` | Disposición |
|---|---|---|
| Pantalla del código (computadora) | 210 px | Fila |
| Pantalla del código (celular ≤ 560 px) | 190 px | Columna, con separadores horizontales de 56 px |
| Dentro del manual (computadora) | 150 px | Fila, sobre una barra `#F7F6F4` |
| Dentro del manual (celular ≤ 560 px) | Hasta 96 px (se ajusta al ancho) | Fila compacta |

---

## 3. Banners de los capítulos

Cada capítulo abre con un banner propio. El título va encima de la zona lisa de la izquierda.

| Capítulo | Archivo | Medidas | Título en |
|---|---|---|---|
| 0 | `img/banners/cap00.webp` | 1600 × 376 | Blanco |
| 1 | `cap01.webp` (Bimbo) | 1600 × 506 | Blanco |
| 2 | `cap02.webp` (Walmart y Ferrari) | 1600 × 509 | Blanco |
| 3 | `cap03.webp` (Cemex y Airbnb) | 1600 × 504 | Blanco |
| 4 | `cap04.webp` (Amazon) | 1600 × 502 | **Oscuro** |
| 5 | `cap05.webp` (Liverpool) | 1600 × 502 | Blanco |
| 6 | `cap06.webp` (Volaris) | 1600 × 508 | Blanco |
| 7 | `cap07.webp` (Kimberly-Clark) | 1600 × 502 | Blanco |
| 8 | `cap08.webp` (Mercado Libre) | 1600 × 507 | **Oscuro** |
| 9 | `cap09.webp` (Toyota) | 1600 × 507 | Blanco |
| 10 | `cap10.webp` (Alsea) | 1600 × 507 | Blanco |
| 11 | `cap11.webp` (Chedraui y Soriana) | 1600 × 501 | **Oscuro** |
| 12 | `cap12.webp` (Aeroméxico) | 1600 × 509 | Blanco |
| 13 | `cap13.webp` (BMW) | 1600 × 427 | Blanco |
| 14 | `cap14.webp` (Apple) | 1530 × 403 | Blanco |
| 15 | `cap15.webp` (Tiendas 3B) | 1600 × 415 | Blanco |
| 16 | `cap16.webp` (Gruma) | 1600 × 387 | Blanco |

- **Versión ligera:** cada banner tiene una versión de 800 px de ancho (`capNN-800.webp`) que se usa en celular y en pantallas normales.
- **Color del título:** se eligió midiendo el contraste de la zona izquierda. En los banners amarillo y naranja (Amazon, Mercado Libre, Chedraui/Soriana), el blanco no se leería.
- **En computadora:** el banner se ve completo con su proporción original y radio de 22 px. El texto ocupa el 46 % de la izquierda (60 % en el capítulo 0, porque su zona lisa es más ancha). El título mide `clamp(20px, 3.7cqi, 30px)`.
- **Si el espacio mide menos de 620 px:** en celular y pantallas angostas, el banner va completo arriba con radio de 16 px y el título debajo, en tinta sobre hueso.
- **Al cambiar banners:** recortar márgenes, exportar a WebP en 1600 px y 800 px de ancho y anotar sus medidas y el color del título en `BANNERS`, dentro de `index.html`.

---

## 4. Color

### Paleta base (variables CSS en `:root`)

| Variable | Valor | Nombre | Uso |
|---|---|---|---|
| `--bg` | `#F4F3F1` | Hueso MoneyTalks | Fondo general |
| `--ink` | `#1F1F1F` | Tinta | Texto principal y títulos |
| `--muted` | `#6B6862` | Tinta suave | Texto secundario, etiquetas y notas |
| `--env-red` | `#AA1124` | Rojo Envases | Acento del sitio (`--brand`) |
| `--env-red-dark` | `#921327` | Rojo Envases oscuro | Degradado del pie de página |
| `--env-gray` | `#999998` | Gris Envases | Texto gris de la marca |
| `--env-ink` | `#262626` | Carbón Envases | Pie de página, casillas del código, botones principales, recuadro de la planta de latas |
| `--danger` | `#C2410C` | Naranja quemado | Errores; distinto del rojo de Envases a propósito |

### Neutros de apoyo

| Valor | Uso |
|---|---|
| `#FFFFFF` | Tarjetas de logos, tablas, preguntas y muro |
| `#F7F6F4` | Barra del encabezado dentro del manual |
| `#F1EEE9` | Cabecera de las tarjetas del muro |
| `#FBFAF8` | Fondo de las tablas |
| `#E2DED7` / `#E7E3DC` / `#EBE7E1` | Bordes y líneas divisorias |
| `#D6D1C9` | Líneas del menú, recuadros punteados y puntos de la guía |
| `#E6E3DE` | Casillas vacías del código |
| `#E9E6E1` / `#DEDAD3` | Botones secundarios (normal y al pasar el mouse) |
| `#2B2A27` | Texto de los párrafos de los casos |
| `#ECECEC` | Texto del recuadro de la planta de latas |
| `#D9D9D9` | Texto del pie de página |

### Rojo de Envases: el marco del sitio

- La línea de 4 px en el borde superior.
- El índice: la marca del capítulo activo, la línea que se dibuja hasta la sección y la sección activa.
- «¿Cómo funciona?», «ÍNDICE» y los botones de la guía.
- La franja que se abre al poner el código correcto.
- El ícono de lata en «En una planta de latas».
- La franja del pie de página.
- Los contornos de foco del teclado.

### Color de la empresa: el contenido de cada capítulo

Cada capítulo toma los colores de su empresa, guardados en `THEMES` dentro de `index.html`. En el CSS se usan como variables:

| Variable | Uso |
|---|---|
| `--c-ink` | Acento legible sobre hueso: número de sección, etiquetas Capítulo/Empresa, cabecera de tablas, enlaces de fuentes, viñetas y **palabras resaltadas** |
| `--c-bg1` / `--c-bg2` | Degradado de los círculos de «Para pensar» y respaldo detrás del banner |
| `--c-bar` | Barra de lectura, borde de la tarjeta de logos, línea de la cita y del muro |
| `--c-tint` | `--c-ink` al 9 % sobre blanco: fondo de la cita, píldoras de número y cabeceras de tabla |
| `--c-line` | `--c-ink` al 22 % sobre `#E2DED7`: bordes y líneas del capítulo |

| Cap. | Empresa | `ink` (acento) | `bg` (degradado) | `bar` (barra de marca) |
|---|---|---|---|---|
| 0 | Todas | `#AA1124` | `#262626` → `#4A1018` | Rojo, naranja, amarillo, verde, azul y morado |
| 1 | Bimbo | `#C41A24` | `#1B3365` → `#2A4C9A` | `#1B3365` → `#D81E2A` |
| 2 | Walmart y Ferrari | `#0047BB` | `#0047BB` → `#B0101E` | `#0047BB` → `#FFC220` → `#DA291C` |
| 3 | Cemex y Airbnb | `#1A3A78` | `#132C5E` → `#C2334A` | `#132C5E` → `#E03C31` → `#FF5A5F` |
| 4 | Amazon | `#232F3E` | `#232F3E` → `#37475A` | `#232F3E` → `#FF9900` |
| 5 | Liverpool | `#B0005A` | `#A0004F` → `#D1007A` | `#A0004F` → `#E5007E` → `#F7A8CF` |
| 6 | Volaris | `#902088` | `#5A1054` → `#902088` | `#902088` → `#D0A0C8` → `#68A8D8` → `#88C038` |
| 7 | Kimberly-Clark | `#00008F` | `#00007A` → `#1C2DB5` | `#00008F` → `#5C6EF0` |
| 8 | Mercado Libre | `#2D3277` | `#2D3277` → `#2A6AD0` | `#2D3277` → `#3483FA` → `#FFE600` |
| 9 | Toyota | `#B5000F` | `#9E0012` → `#58595B` | `#EB0A1E` → `#9A9A9A` |
| 10 | Alsea | `#00467F` | `#00375F` → `#00578F` | `#00467F` → `#F0C000` |
| 11 | Chedraui y Soriana | `#0057A8` | `#00509D` → `#B3161E` | `#0060C0` → `#E07A1F` → `#A8B400` → `#D81E1E` |
| 12 | Aeroméxico | `#0B2343` | `#0B1F45` → `#1F3F73` | `#0B2343` → `#3A6EA5` → `#E9302A` |
| 13 | BMW | `#0E57B5` | `#141414` → `#0E57B5` | `#141414` → `#1C69D4` → `#81C4FF` |
| 14 | Apple | `#1D1D1F` | `#1D1D1F` → `#3A3A3D` | `#1D1D1F` → `#86868B` → `#D2D2D7` |
| 15 | Tiendas 3B | `#B5121B` | `#A80F1F` → `#D81E28` | `#B5121B` → `#F4A6A6` |
| 16 | Gruma | `#00602F` | `#004A26` → `#007A3D` | `#00602F` → `#F0C018` |

**Reglas para un tema nuevo:**

- `ink` debe tener un contraste de al menos 4.5:1 sobre `#F4F3F1` y sobre su tinte al 9 %.
- Con `bg`, el texto blanco encima debe tener un contraste de al menos 5:1.
- Si el caso tiene dos empresas, el degradado va del color de una al de la otra.

---

## 5. Tipografía

**Fuente única:** Montserrat (Google Fonts), pesos **500**, **600** y **700**. Si no carga, se usa `system-ui, sans-serif`.

| Rol | Tamaño | Peso | Detalles |
|---|---|---|---|
| Título del capítulo (sobre el banner) | `clamp(20px, 3.7cqi, 30px)` | 600 | Blanco u oscuro según el banner |
| Título del capítulo (debajo del banner) | `clamp(22px, 6.4vw, 28px)` | 600 | Tinta |
| «CAPÍTULO N» | 13 px | 600 | Mayúsculas, espaciado 0.06em |
| Título del caso | `clamp(19px, 2.6vw, 23px)` | 600 | Interlineado 1.35 |
| Subtítulo de sección | 18 px | 600 | Con píldora de número de 12 px |
| Párrafo del caso | 15.5 px | 500 | Interlineado 1.7, máximo 68 caracteres |
| Negritas y palabras resaltadas | Igual al texto | 700 | En `--c-ink` |
| Título de la guía | 21 px | 600 | |
| Párrafo de la guía | 15 px | 500 | Interlineado 1.6 |
| Índice: capítulo | 15 px | 500 | Cifras de ancho fijo |
| Índice: sección | 14 px | 500 (600 activa) | |
| Tablas | 13.5 px | 500 | Cabecera de 12 px |
| Fuentes | 13.5 px | 500 | Enlace de 12.5 px |
| Notas de tabla | 13 px | 500 | `--muted` |
| Etiquetas en mayúsculas | 10.5–13 px | 600 | Espaciado de letras de 0.06 a 0.14em |

- Las cifras usan `font-variant-numeric: tabular-nums` para que las columnas queden alineadas.
- Después de dos puntos, el texto de los casos empieza con mayúscula.

---

## 6. Palabras resaltadas

Dentro de los textos de cada caso se resaltan en **negrita y en el color de la empresa** (`--c-ink`):

1. **Las negritas propias del texto**, como «Empecemos con Walmex» o «Primera lectura: las ventas».
2. **Las cifras:** montos («426,952 millones de pesos», «111.5 mil millones») y porcentajes («4.6%»).
3. **Los conceptos del manual**, solo la primera vez que aparecen en cada sección: utilidad neta, utilidad de operación, margen de operación, margen bruto, flujo de efectivo, flujo libre, estado de resultados, balance general, depreciación, amortización, inversiones de capital, costo de oportunidad, punto de equilibrio, factor de ocupación, asiento-milla, costo unitario, tipo de cambio, tiendas iguales, presupuesto, pronóstico, forecast, payback, periodo de recuperación, VAN, TIR, EBITDA, CASM, recompras, dividendos, escenarios, eficiencia, desperdicio, caso de negocio y NEXO.

Reglas:

- Las siglas solo se resaltan en mayúsculas: «VAN» sí, «van» del verbo ir no.
- «Para pensar» no lleva resaltados.
- En el recuadro oscuro de la planta de latas, el resaltado usa `--c-ink` mezclado al 30 % con blanco para que se lea.
- La lista vive en `KEY_TERMS`, dentro de `index.html`.

---

## 7. Disposición y espaciado

- **Ancho máximo:** 1160 px, centrado.
- **Computadora:** índice de 320 px y contenido, con 48 px de separación.
- **Celular (≤ 860 px):** una columna con margen de 16 px; el índice se abre con un botón fijo.
- **Secciones:** 24 px arriba y abajo, separadas por una línea en `--c-line`.
- **Ancla al saltar a una sección:** 24 px en computadora y 76 px en celular, para que el botón fijo no tape el título.

| Ancho | Cambio |
|---|---|
| ≤ 860 px | El índice pasa a panel lateral, la tarjeta de logos va arriba del título y el muro queda en 2 columnas |
| ≤ 620 px de contenido | El banner va arriba y el título debajo |
| ≤ 560 px | El encabezado de marca se apila en la pantalla del código y se compacta dentro del manual |

---

## 8. Bordes, radios y sombras

| Elemento | Radio |
|---|---|
| Banner (computadora) | 22 px |
| Banner (celular) | 16 px |
| Tarjeta de logos, tarjeta de la guía | 18 px (la guía en celular: 20 px solo arriba) |
| Tarjetas del muro, preguntas, cita, recuadro de latas, tarjetas anterior/siguiente | 14 px |
| Tablas, botones, recuadros punteados | 12 px |
| Botón del índice y botón de cerrar | 10 px |
| Píldora de número de sección | 999 px |
| Círculos numerados | 50 % |

Las sombras son suaves y toman el color de la empresa: por ejemplo, `0 10px 22px -16px` con `--c-ink` al 60 % en las preguntas al pasar el mouse.

- **Panel del índice en celular:** `12px 0 32px -16px rgba(38,38,38,.35)`
- **Guía:** `0 24px 60px -20px rgba(0,0,0,.45)`
- **Fondos oscurecidos:** `rgba(38,38,38,.45)` detrás del índice y `rgba(38,38,38,.55)` detrás de la guía.

---

## 9. Movimiento

| Curva | Valor | Uso |
|---|---|---|
| Salida suave (principal) | `cubic-bezier(0.23, 1, 0.32, 1)` | Entradas, pliegues, desplazamientos y línea del índice |
| Resorte | `cubic-bezier(0.3, 1.35, 0.6, 1)` | Casillas del código y palomita de éxito |

| Animación | Duración |
|---|---|
| Entrada del banner y del capítulo | 400–500 ms |
| Secciones al llegar a ellas (aparecen deslizándose) | Al entrar en pantalla |
| Tarjetas del muro | 450 ms, con 35 ms de retraso entre una y otra |
| Pliegue de un capítulo del índice | 300 ms |
| Línea que se dibuja en el índice | 400 ms |
| Panel del índice en celular | 320 ms |
| Casillas del código | 300 ms, con 20 ms de retraso entre una y otra |
| Cambio de paso de la guía | 320 ms |
| Cambios de color | 200 ms |

Con `prefers-reduced-motion: reduce`, las transiciones bajan a 1 ms y las animaciones se desactivan.

---

## 10. Componentes

### 10.1 Pantalla del código (basada en *CodeSlots* de React Bits)

- 9 casillas para `ENVASES26`; aceptan letras y números y muestran todo en mayúsculas.
- **Casilla vacía:** `#E6E3DE`, con un cursor que parpadea en la activa.
- **Casilla llena:** se rellena desde el centro en carbón, con la letra en blanco.
- **Código incorrecto:** las casillas se tiñen de naranja quemado, aparece el mensaje de error y se vacían en cascada.
- **Código correcto:** las letras se hunden y una franja roja de Envases se abre con una palomita.
- **Sesión:** el acceso dura 24 horas por dispositivo.

### 10.2 Índice (basado en *BranchedMenu* de React Bits)

- Un tronco vertical de 2 px con una rama por capítulo; al abrir un capítulo salen sus 7 secciones.
- La sección activa dibuja una línea roja desde el tronco, y una marca roja señala el capítulo activo.
- Solo queda abierto el capítulo que se lee.
- Arriba aparece el enlace «¿Cómo funciona?».
- **En celular:** botón fijo «ÍNDICE» con el capítulo actual, que abre un panel lateral de `min(88vw, 360px)`.

### 10.3 Barra de lectura

Línea de 4 px fija arriba de la página, con el degradado `--c-bar` de la empresa, que avanza conforme se lee el capítulo.

### 10.4 Secciones del caso

Siete secciones numeradas con una píldora en `--c-tint` y `--c-ink`:

1. **Encabezado:** Capítulo y Empresa (etiquetas en `--c-ink`), el título del caso y una tarjeta blanca de logos con borde superior `--c-bar`. Con dos empresas, los logos se separan con una «y».
2. **La historia:** párrafos, listas numeradas y viñetas en `--c-ink`, con palabras resaltadas.
3. **Los números clave:** tabla blanca con cabecera en `--c-tint`; si no cabe, se desliza de lado. Puede llevar una nota de fuente debajo.
4. **Qué tiene que ver con tu manual:** cita sobre `--c-tint` con una línea de color a la izquierda.
5. **Para pensar:** tarjetas blancas con un círculo numerado en el degradado de la empresa.
6. **En una planta de latas:** recuadro carbón con ícono de lata en rojo Envases y la etiqueta «ENVASES · PLANTA DE LATAS».
7. **Fuentes:** cada referencia con su enlace en `--c-ink`, que se abre en otra pestaña.

### 10.5 Muro de casos (capítulo 0)

- Una tarjeta por capítulo (1–16), con cabecera `#F1EEE9`, círculo con el número, «CAPÍTULO N» y el nombre, y los logos abajo.
- Cada tarjeta usa el color de su empresa en el círculo y en la línea inferior.
- Al tocarla abre su capítulo.

### 10.6 Anterior y siguiente

Al final de cada capítulo, dos tarjetas con el color, el nombre y el logo del capítulo vecino.

### 10.7 Guía de uso (primera visita)

- Tarjeta hueso con borde superior rojo de 5 px y 4 pasos: bienvenida, índice, las 7 partes y el capítulo 0.
- Tiene contador, «Saltar guía», puntos de avance, botón principal carbón (rojo al pasar el mouse) y botón secundario gris.
- Aparece una vez por dispositivo; se puede volver a abrir desde «¿Cómo funciona?».

### 10.8 Pie de página

Franja de 6 px con degradado de `#AA1124` a `#921327`, fondo carbón y el logo blanco de Envases, con el texto «Manual de Finanzas para No Financieros · Programa de Bienestar Financiero de MoneyTalks para Envases».

---

## 11. Accesibilidad

- Todo se puede usar con teclado y tiene un contorno de foco visible de 2 px.
- Hay textos alternativos en los logos («Logo de …»). Los banners son decorativos porque el título va en texto.
- Se usan `aria-expanded`, `aria-current`, `aria-live` y `role="dialog"` donde corresponde. La guía mantiene el foco dentro de ella y se cierra con Esc.
- Los colores de acento cumplen un contraste de al menos 4.5:1 sobre hueso.
- El movimiento se reduce si el sistema lo pide.

---

## 12. Créditos de componentes

**CodeSlots** y **BranchedMenu** vienen de [React Bits](https://reactbits.dev). Se portaron a HTML, CSS y JavaScript sin dependencias y se adaptaron a la paleta del sitio.
