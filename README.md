# Bienestar Arcade 🌱

MVP de una app que gamifica el cuidado personal con **hábitos diarios**: micro-acciones de 1 a 5
minutos que entran en cualquier día.

La lógica es simple: insertás una moneda, la máquina te tira 3 misiones, las marcás durante el día y
**el árbol crece**. Si dejás pasar un día, el árbol retrocede un nivel. Y si el día vino imposible,
el **comodín** lo protege con 10 segundos de respiración y sin culpa.

## El árbol: 6 niveles

| Nivel | Nombre | |
| --- | --- | --- |
| 1 | Semilla | Todo empieza bajo tierra. |
| 2 | Brote | Asomó la cabeza. Frágil, pero está. |
| 3 | Planta | Ya tiene hojas propias. |
| 4 | Arbolito | Tiene copa. Todavía lo mueve el viento. |
| 5 | Árbol | Da sombra. Ya no se cae solo. |
| 6 | Árbol fuerte | Raíces hondas. Este ya aguanta cualquier semana. |

- **Subir**: 3 días cumplidos hacen crecer el árbol un nivel.
- **Bajar**: cada día que dejás pasar sin cumplir poda un nivel. Nunca baja de semilla.
- **La cima**: una vez en árbol fuerte, la app cuenta los días que lo venís sosteniendo.
- **El comodín** protege el nivel pero no hace crecer: sostiene, no avanza.

## Los controles

Tres, al pie de la pantalla. Todo lo demás es tocar la tarjeta.

| Control | Qué hace |
| --- | --- |
| **Recargar** | Una vez por día: entrás en modo recarga y tocás la misión que querés cambiar. |
| **Comodín** | 10 segundos de respiración guiada; el nivel queda protegido. |
| **Ayuda** | Las reglas en una pantalla. |

### Las 5 familias de misiones

- **Movimiento disruptivo** — sentadillas en un lugar inusual, escalera, un tema de baile.
- **Salud ocular** — mirar a 6 metros, regla 20-20-20, palmeo oscuro.
- **Nutrición alegre** — agua con limón antes del café, almuerzo sin pantalla.
- **Digital detox** — modo cueva 20 minutos, teléfono en otra habitación.
- **Presencia / sensorial** — descalzo sobre el piso frío, inventario 5-4-3-2-1.

El pool tiene 40 misiones (8 por categoría) en `src/data/missions.js`. Cada día se sortean 3, siempre
de categorías distintas.

## Estética

Lo arcade quedó como **marco**, no como simulación: hay marquesina, moneda y rodillos, pero no un
mueble con botones físicos que finjan hacer algo. Los clicks son clicks.

- **Paleta**: fondo índigo profundo (`#0f0e1c` / `#16152a`) y cinco acentos de los 80 bajados de
  saturación — aqua `#4ecdc4`, menta `#6ecf97`, oro `#f2c14e`, coral `#e56ba0`, lila `#9d8df1`.
  Un solo acento por elemento; nada de neón sobre negro.
- **Tipografías**: `Chakra Petch` para títulos, números y controles; `Outfit` para el texto corrido.
  Ambas de Google Fonts, con fallback a la sans del sistema.
- **Sprites**: los 6 niveles del árbol (`src/data/levels.js`) y las 5 categorías
  (`src/data/categories.js`) son grillas de 16×16 caracteres renderizadas con CSS Grid.
  Cero imágenes, cero assets binarios.
- **Sonido**: chiptune generado en vivo con Web Audio API (ondas cuadradas + ruido filtrado), más
  vibración háptica donde el dispositivo la soporte. Se silencia desde el ícono del encabezado.

## Stack

- **Vite 8** + **React 19**
- **Tailwind CSS 4** (tokens de diseño en `@theme`, sin archivo de config)
- **lucide-react** para los íconos
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
  data/         categorías, pool de misiones y niveles del árbol
  lib/          lógica de juego pura, fechas, audio chiptune
  hooks/        useGame: reducer + persistencia + rollover de medianoche
  components/   marco, pantalla de inicio, rodillos, misiones, modales
```

La lógica de juego (`src/lib/game.js`) es de funciones puras y está cubierta por tests: sorteo,
recarga, cierre del día, crecimiento y poda del árbol, días en la cima, rachas, historial e
hidratación de LocalStorage.

## Detalles que importan

- **El día es local**, no UTC: las claves `YYYY-MM-DD` se arman con la fecha del dispositivo para que
  el árbol no se pode por un huso horario.
- **Medianoche en vivo**: si la app queda abierta, revisa cada 30 segundos (y al volver a la pestaña)
  si cambió el día, y arranca uno nuevo sola.
- **Días sin abrir la app cuentan**: al volver después de un hueco, se poda un nivel por cada día
  perdido, no solo por el último.
- **Accesibilidad**: los checkboxes son `role="checkbox"` con `aria-checked`, los modales cierran con
  Escape y el foco es visible. `prefers-reduced-motion` apaga las animaciones.

## Pendientes post-MVP

- Recordatorios / notificaciones para las misiones del día.
- Sincronización entre dispositivos (hoy todo vive en LocalStorage).
- Modo co-op: dos árboles que crecen juntos.
