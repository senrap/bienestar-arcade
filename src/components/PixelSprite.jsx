/**
 * Dibuja un sprite a partir de su grilla de caracteres (16x16 en todo el juego).
 * Sin imagenes: cada pixel es una celda de una grilla CSS.
 */
export default function PixelSprite({ sprite, scale = 6, locked = false, label, className = '' }) {
  const { pixels, palette } = sprite
  const cols = pixels[0].length

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${scale}px)`,
        gridAutoRows: `${scale}px`,
        width: cols * scale,
        height: pixels.length * scale,
        filter: locked ? 'brightness(0) opacity(0.35)' : 'drop-shadow(0 0 6px rgba(0,240,255,0.25))',
      }}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
    >
      {pixels.flatMap((row, y) =>
        [...row].map((char, x) => (
          <div
            key={`${x}-${y}`}
            style={{ background: char === '.' ? 'transparent' : palette[char] }}
          />
        )),
      )}
    </div>
  )
}
