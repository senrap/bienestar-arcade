import PixelSprite from './PixelSprite.jsx'
import { LEVELS } from '../data/levels.js'
import { lastDays, todayKey } from '../lib/date.js'

/** Tira de los ultimos 14 dias: lleno = dia cumplido, hueco = dia perdido. */
function DayStrip({ history }) {
  const today = todayKey()

  return (
    <div className="mt-4 flex items-center gap-2">
      <span className="eyebrow text-[10px] text-muted/70">14d</span>
      <div className="flex flex-1 gap-1">
        {lastDays(14).map((d) => {
          const entry = history[d]
          const closed = entry?.closed
          const partial = entry && entry.done > 0 && !closed
          return (
            <i
              key={d}
              title={d}
              className={`h-2 flex-1 rounded-full ${
                closed ? (entry.wildcard ? 'bg-lilac' : 'bg-mint') : partial ? 'bg-gold/50' : 'bg-ink-700'
              } ${d === today ? 'ring-1 ring-aqua/60' : ''}`}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * El arbol: en que nivel esta, cuanto falta para el proximo y —si ya llego
 * arriba— cuantos dias lleva sosteniendolo.
 */
export default function LevelPanel({ level, state }) {
  const pct = Math.round((level.progress / level.steps) * 100)

  return (
    <section className="panel px-5 py-5">
      <div className="flex items-center gap-5">
        <PixelSprite
          sprite={level}
          scale={4}
          label={`Nivel ${level.index + 1}: ${level.name}`}
          className="shrink-0"
        />

        <div className="min-w-0 flex-1">
          <p className="eyebrow text-muted">
            Nivel {level.index + 1} de {LEVELS.length}
          </p>
          <h2 className="mt-0.5 text-lg font-bold tracking-wide" style={{ color: level.color }}>
            {level.name}
          </h2>
          <p className="mt-1 text-sm leading-snug text-muted">{level.tagline}</p>

          {/* Progreso hacia el nivel siguiente */}
          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${pct}%`, background: level.color }}
              />
            </div>
            <p className="mt-2 text-xs text-muted">
              {level.atTop ? (
                <>
                  <span className="font-semibold text-gold tabular-nums">{level.daysAtTop}</span>{' '}
                  {level.daysAtTop === 1 ? 'día' : 'días'} sosteniendo la cima
                </>
              ) : (
                <>
                  <span className="tabular-nums">
                    {level.progress}/{level.steps}
                  </span>{' '}
                  días cumplidos para llegar a {level.next.name}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-700 pt-4 text-center">
        {[
          ['Racha', state.streak, 'text-aqua'],
          ['Puntos', state.points.toLocaleString('es-AR'), 'text-gold'],
          ['Mejor racha', state.bestStreak, 'text-muted'],
        ].map(([label, value, tone]) => (
          <div key={label}>
            <dt className="eyebrow text-[10px] text-muted/70">{label}</dt>
            <dd className={`mt-1 font-display text-lg font-bold tabular-nums ${tone}`}>{value}</dd>
          </div>
        ))}
      </dl>

      <DayStrip history={state.history} />
    </section>
  )
}
