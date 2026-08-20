/**
 * El personaje del pie de pagina y el bloque que golpea al saltar.
 * Sprites originales de 16x16, misma grilla de caracteres que el resto del
 * juego: cada letra es una clave de la paleta y el punto es transparente.
 */
const RUNNER_PALETTE = {
  o: '#1a1830', // contorno
  c: '#6ecf97', // gorra
  s: '#f0c39a', // piel
  b: '#4ecdc4', // remera
  p: '#2f2b55', // pantalon
  e: '#4f3a28', // zapatillas
}

const HEAD = [
  '................',
  '.....oooooo.....',
  '....occccco.....',
  '....occccco.....',
  '....ossssso.....',
  '....osososo.....',
  '....ossssso.....',
]

/** Paso uno: piernas abiertas. */
export const RUNNER_A = {
  palette: RUNNER_PALETTE,
  pixels: [
    ...HEAD,
    '...oobbbboo.....',
    '..sobbbbbbos....',
    '...obbbbbbo.....',
    '...obbbbbbo.....',
    '....oppppo......',
    '....oppppo......',
    '....op..po......',
    '...eeo..oee.....',
    '................',
  ],
}

/** Paso dos: piernas juntas. */
export const RUNNER_B = {
  palette: RUNNER_PALETTE,
  pixels: [
    ...HEAD,
    '...oobbbboo.....',
    '..sobbbbbbos....',
    '...obbbbbbo.....',
    '...obbbbbbo.....',
    '....oppppo......',
    '....oppppo......',
    '....oppppo......',
    '....oeeeeo......',
    '................',
  ],
}

/** En el aire: brazos arriba y piernas recogidas. */
export const RUNNER_JUMP = {
  palette: RUNNER_PALETTE,
  pixels: [
    ...HEAD,
    '.s.oobbbboo.s...',
    '...obbbbbbo.....',
    '...obbbbbbo.....',
    '....oppppo......',
    '....oppppo......',
    '...eeoooee......',
    '................',
    '................',
    '................',
  ],
}

/** El bloque sorpresa, con la H de HACHE. */
export const HACHE_BLOCK = {
  palette: { o: '#1a1830', k: '#f2c14e', h: '#7a5c14' },
  pixels: [
    '................',
    '................',
    '..oooooooooooo..',
    '..okkkkkkkkkko..',
    '..okkkkkkkkkko..',
    '..okkhhkkhhkko..',
    '..okkhhkkhhkko..',
    '..okkhhhhhhkko..',
    '..okkhhhhhhkko..',
    '..okkhhkkhhkko..',
    '..okkhhkkhhkko..',
    '..okkhhkkhhkko..',
    '..okkkkkkkkkko..',
    '..oooooooooooo..',
    '................',
    '................',
  ],
}
