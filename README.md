# Bienestar Arcade 👾🎮

MVP de una app que gamifica el cuidado personal con **hábitos traviesos**: micro-acciones de 1 a 5
minutos que entran en cualquier día, envueltas en una máquina arcade de los 80/90.

La lógica es simple: insertás una moneda, la máquina te tira 3 misiones, las marcás durante el día y
la racha sube. Si el día vino imposible, el **Comodín Travieso** te salva con 10 segundos de
respiración y sin culpa.

## Cómo se juega

| Control | Qué hace |
| --- | --- |
| **START** / botón **A** / `Enter` | Inserta la moneda del día y, ya en juego, marca la misión apuntada. |
| **Joystick ▲▼** / `↑` `↓` | Cambia la misión apuntada. |
| **RECARGAR** / botón **B** / `R` | 1 por día: entra en modo recarga y cambiás la misión que elijas. |
| **COMODÍN** / `C` | Bypass de 10 segundos ("respirá 3 veces") que conserva la racha en un mal día. |
| **MENU** / `M` | Abre la colección de sprites. |
| **AYUDA** / `H` | Cartel de instrucciones. |

Cerrar el día con 3/3 (o con el comodín) es un **COMBO DAY**: bonus de +30 PTS y la racha encadena.
Los 6 sprites coleccionables se desbloquean por racha, puntos o misiones acumuladas.

### Las 5 familias de misiones

- **Movimiento Disruptivo** — sentadillas en un lugar inusual, escalera, un tema de baile.
- **Salud Ocular** — mirar a 6 metros, regla 20-20-20, palmeo oscuro.
- **Nutrición Alegre** — agua con limón antes del café, almuerzo sin pantalla.
- **Digital Detox** — modo cueva 20 minutos, teléfono en otra habitación.
- **Presencia / Sensorial** — descalzo sobre el piso frío, inventario 5-4-3-2-1.

El pool tiene 40 misiones (8 por categoría) en `src/data/missions.js`.

## Estética

- **Paleta CRT**: fondo `#0d0814` / `#180e29`, acentos cian `#00f0ff`, magenta `#ff007f`,
  lima `#39ff14`, amarillo `#ffe600` y violeta `#b76bff`.
- **Tipografías**: `Press Start 2P` para títulos y botones, `VT323` para texto largo,
  `Silkscreen` para etiquetas (Google Fonts, con fallback a monoespaciada del sistema).
- **Mueble completo**: marquesina iluminada, laterales de madera con rejilla de parlante y botonera
  física, y tablero inferior con joystick y botones A/B. El tubo suma scanlines, viñeta, parpadeo y
  una línea de barrido. Todo en CSS: la madera, las rejillas y los botones son gradientes.
- **Layout**: en desktop la pantalla se parte en dos columnas (misiones a la izquierda, marcador y
  coleccionables a la derecha); en mobile se apila y los laterales se acuestan debajo del tubo.
- **Sprites**: cada mascota (`src/data/pets.js`) y cada categoría de misión (`src/data/categories.js`)
  es una grilla de 16×16 caracteres renderizada con CSS Grid. Cero imágenes, cero assets binarios.
- **Sonido**: chiptune generado en vivo con Web Audio API (ondas cuadradas + ruido filtrado),
  más vibración háptica donde el dispositivo la soporte. Se puede silenciar desde el tablero.

## Stack

- **Vite 8** + **React 19**
- **Tailwind CSS 4** (tokens de diseño en `@theme`, sin archivo de config)
- **lucide-react** para los íconos, con `image-rendering: pixelated` global
- **LocalStorage** como única persistencia (clave `bienestar-arcade:v1`)

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm test         # tests de la lógica de juego (node:test, sin dependencias)
npm run build    # build de producción en dist/
npm run preview  # sirve el build
```

## Estructura

```
src/
  data/         categorías, pool de misiones y sprites de las mascotas
  lib/          lógica de juego pura, fechas, audio chiptune
  hooks/        useGame: reducer + persistencia + rollover de medianoche
  components/   gabinete, tubo CRT, rodillos, misiones, modales
```

La lógica de juego (`src/lib/game.js`) es de funciones puras y está cubierta por tests: sorteo,
re-roll, cierre del día, encadenado y reinicio de rachas, historial e hidratación de LocalStorage.

## Detalles que importan

- **El día es local**, no UTC: las claves `YYYY-MM-DD` se arman con la fecha del dispositivo para que
  la racha no se corra de huso horario.
- **Medianoche en vivo**: si la app queda abierta, revisa cada 30 segundos (y al volver a la pestaña)
  si cambió el día, y arranca uno nuevo sola.
- **Saltear un día** reinicia la racha; un día en curso todavía sin cerrar, no.
- **Accesibilidad**: los checkboxes son `role="checkbox"` con `aria-checked`, los modales cierran con
  Escape y hay foco visible pixelado. Todo el juego se puede jugar con teclado.
  `prefers-reduced-motion` apaga las animaciones.

## Pendientes post-MVP

- Recordatorios / notificaciones para las misiones del día.
- Sincronización entre dispositivos (hoy todo vive en LocalStorage).
- Más sprites y un modo "co-op" para hacer misiones con otra persona.
