import { Volume2, VolumeX } from 'lucide-react'
import { displayDate } from '../lib/date.js'

/**
 * El marco. La estetica arcade queda como envoltorio —marquesina y borde—
 * y no como simulacion de una maquina con botones fisicos.
 */
export default function AppShell({ children, controls, muted, onToggleMute }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-4 px-4 py-6 sm:py-10">
      <header className="panel frame-glow px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-[0.08em] text-paper sm:text-2xl">
              BIENESTAR <span className="text-lilac">ARCADE</span>
            </h1>
            <p className="eyebrow mt-1.5 text-muted">Hábitos diarios</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="eyebrow hidden text-muted sm:block">{displayDate()}</span>
            <button
              type="button"
              onClick={onToggleMute}
              aria-pressed={muted}
              aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
              className="rounded-lg p-2 text-muted transition-colors hover:bg-ink-800 hover:text-aqua"
            >
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4">{children}</main>

      {controls}
    </div>
  )
}
