import { ChevronDown, ChevronUp } from 'lucide-react'

/**
 * Boton fisico del lateral del mueble: tapa de color, etiqueta serigrafiada
 * abajo y, si corresponde, un contador de usos restantes.
 */
export function CabinetButton({ icon: Icon, label, color, shadow, count, onClick, disabled, title }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={title || label}
        className="cab-btn focus-pixel flex h-11 w-14 items-center justify-center text-crt-950"
        style={{ '--cab-c': color, '--cab-shadow': shadow }}
      >
        <Icon size={20} strokeWidth={3} aria-hidden="true" />
      </button>
      <span className="font-label text-[8px] tracking-widest text-amber-100/80">{label}</span>
      {count !== undefined && (
        <span
          className="pixel-frame bg-crt-950 px-2 py-0.5 font-pixel text-[9px]"
          style={{ '--frame-c': color, color }}
        >
          {count}
        </span>
      )}
    </div>
  )
}

/**
 * Lateral del gabinete: rejilla de parlante arriba y la botonera debajo.
 * En desktop es una columna al costado de la pantalla; en mobile se acuesta
 * como una fila debajo del tubo.
 */
export function ControlPanel({ children, className = '' }) {
  return (
    <div className={`wood-panel flex items-center gap-4 rounded-xl p-3 lg:w-[104px] lg:flex-col lg:gap-5 lg:py-5 ${className}`}>
      <div className="speaker-grille hidden size-16 rounded-lg lg:block" aria-hidden="true" />
      <div className="flex flex-1 items-start justify-center gap-4 lg:flex-none lg:flex-col lg:items-center lg:gap-5">
        {children}
      </div>
    </div>
  )
}

/**
 * Tablero inferior: joystick de navegacion, botones A/B y el joystick del
 * segundo jugador, todavia sin partida que jugar.
 */
export function ControlDeck({ onMove, onPrimary, onSecondary, primaryLabel, secondaryLabel, disabled }) {
  return (
    <div className="wood-panel mt-4 flex items-center justify-between gap-4 rounded-xl px-4 py-4 sm:px-8">
      {/* Joystick 1: navega entre misiones */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={disabled}
          aria-label="Misión anterior"
          className="focus-pixel text-neon-cyan disabled:opacity-30"
        >
          <ChevronUp size={16} strokeWidth={4} aria-hidden="true" />
        </button>
        <div className="joy-base flex size-11 items-center justify-center" style={{ '--joy-c': '#00f0ff' }}>
          <div className="joy-ball size-7" style={{ '--joy-c': '#00f0ff' }} aria-hidden="true" />
        </div>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={disabled}
          aria-label="Misión siguiente"
          className="focus-pixel text-neon-cyan disabled:opacity-30"
        >
          <ChevronDown size={16} strokeWidth={4} aria-hidden="true" />
        </button>
        <span className="font-label text-[8px] tracking-widest text-amber-100/70">NAVEGAR</span>
      </div>

      {/* Botones A y B */}
      <div className="flex items-end gap-4 sm:gap-6">
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onPrimary}
            disabled={disabled}
            className="cab-round focus-pixel size-12 font-pixel text-[11px] text-crt-950 sm:size-14"
            style={{ '--cab-c': '#00f0ff', '--cab-shadow': '#045f66' }}
          >
            A
          </button>
          <span className="font-label text-[8px] tracking-widest text-amber-100/70">
            {primaryLabel}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={onSecondary}
            disabled={disabled}
            className="cab-round focus-pixel size-12 font-pixel text-[11px] text-crt-950 sm:size-14"
            style={{ '--cab-c': '#ff7b00', '--cab-shadow': '#7a3a00' }}
          >
            B
          </button>
          <span className="font-label text-[8px] tracking-widest text-amber-100/70">
            {secondaryLabel}
          </span>
        </div>
      </div>

      {/* Joystick 2: reservado para el modo co-op */}
      <div className="flex flex-col items-center gap-1.5" aria-hidden="true">
        <div className="joy-base flex size-11 items-center justify-center" style={{ '--joy-c': '#ff7b00' }}>
          <div className="joy-ball size-7" style={{ '--joy-c': '#ff7b00' }} />
        </div>
        <span className="font-label text-[8px] leading-3 tracking-widest text-amber-100/40">
          P2
          <br />
          SOON
        </span>
      </div>
    </div>
  )
}
