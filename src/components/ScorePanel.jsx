import { Flame } from 'lucide-react'
import PixelSprite from './PixelSprite.jsx'
import { PETS } from '../data/pets.js'
import { DAILY_MISSIONS } from '../lib/game.js'
import { lastDays, todayKey } from '../lib/date.js'

/** Tira de los ultimos 14 dias: lleno = combo day, hueco = dia flojo. */
function StreakStrip({ history }) {
  const today = todayKey()

  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="font-label text-[8px] tracking-widest text-white/40">14D</span>
      <div className="flex flex-1 gap-[3px]">
        {lastDays(14).map((d) => {
          const entry = history[d]
          const closed = entry?.closed
          const partial = entry && entry.done > 0 && !closed
          return (
            <i
              key={d}
              title={d}
              className={`h-3 flex-1 ${
                closed
                  ? entry.wildcard
                    ? 'bg-neon-violet'
                    : 'bg-neon-lime'
                  : partial
                    ? 'bg-neon-yellow/60'
                    : 'bg-crt-700'
              } ${d === today ? 'outline-2 outline-offset-1 outline-neon-cyan/60' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Columna derecha del tubo: el marcador global y la vitrina de coleccionables.
 */
export default function ScorePanel({ state, done, onOpenGallery }) {
  const unlocked = PETS.filter((p) => state.unlocked.includes(p.id))
  const latest = unlocked[unlocked.length - 1]
  const next = PETS.find((p) => !state.unlocked.includes(p.id))

  return (
    <aside className="flex flex-col gap-4">
      {/* --- PUNTUACION GLOBAL --- */}
      <section
        className="pixel-frame bg-crt-950 p-3 sm:p-4"
        style={{ '--frame-c': '#ffe600' }}
      >
        <h2 className="font-pixel text-[10px] leading-5 text-neon-yellow text-glow-soft">
          PUNTUACION GLOBAL
        </h2>

        <p className="mt-3 font-pixel text-2xl leading-8 text-white text-glow-soft sm:text-3xl">
          {state.points.toLocaleString('es-AR')}
          <span className="ml-2 font-label text-xs text-neon-yellow">PTS</span>
        </p>

        <p className="mt-3 flex items-center gap-2 font-label text-[10px] tracking-widest text-white/70">
          RACHA DE DIAS:
          <span className="flex items-center gap-1 text-neon-orange">
            <span className="font-pixel text-[13px] text-neon-yellow">{state.streak}</span>
            <Flame size={13} strokeWidth={3} aria-hidden="true" />
          </span>
        </p>

        <p className="mt-2 font-label text-[10px] tracking-widest text-white/70">
          MISIONES DE HOY:{' '}
          <span className="font-pixel text-[12px] text-neon-lime">
            {done}/{DAILY_MISSIONS}
          </span>
        </p>

        <StreakStrip history={state.history} />
      </section>

      {/* --- COLECCIONABLES --- */}
      <section
        className="pixel-frame bg-crt-950 p-3 sm:p-4"
        style={{ '--frame-c': '#00f0ff' }}
      >
        <h2 className="font-pixel text-[10px] leading-5 text-neon-cyan text-glow-soft">
          COLECCIONABLES
        </h2>

        <div className="mt-3 flex min-h-[64px] flex-wrap items-center justify-center gap-3">
          {unlocked.length ? (
            unlocked
              .slice(-4)
              .map((pet) => (
                <PixelSprite key={pet.id} sprite={pet} scale={4} label={pet.name} />
              ))
          ) : (
            <p className="font-screen text-lg leading-5 text-white/50">
              Todavía no desbloqueaste ninguno. Cerrá tu primer combo day.
            </p>
          )}
        </div>

        <p className="mt-3 text-center font-label text-[8px] leading-4 tracking-widest text-white/50">
          {latest ? 'ULTIMO ITEM DESBLOQUEADO:' : 'PROXIMO ITEM:'}
          <br />
          <span className={latest ? 'text-neon-lime' : 'text-neon-violet'}>
            {latest ? latest.name : next?.unlock.label}
          </span>
        </p>

        <button
          type="button"
          onClick={onOpenGallery}
          className="focus-pixel mt-3 w-full bg-crt-800 py-2 font-pixel text-[9px] text-neon-yellow transition-colors hover:bg-crt-700"
        >
          VER COLECCION {state.unlocked.length}/{PETS.length}
        </button>
      </section>
    </aside>
  )
}
