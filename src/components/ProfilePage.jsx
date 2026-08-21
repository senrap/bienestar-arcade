import { useState } from 'react'
import { ArrowLeft, Flame, Star, Target, TrendingUp } from 'lucide-react'
import PixelSprite from './PixelSprite.jsx'
import DimensionBars from './DimensionBars.jsx'
import HistoryGrid from './HistoryGrid.jsx'
import Leaderboard from './Leaderboard.jsx'
import { LEVELS } from '../data/levels.js'
import { play } from '../lib/audio.js'

function Dato({ icon: Icon, label, valor, tono }) {
  return (
    <div className="panel px-3 py-3 text-center">
      <Icon size={15} className={`mx-auto ${tono}`} aria-hidden="true" />
      <p className="mt-1.5 font-display text-lg font-bold tabular-nums text-paper">{valor}</p>
      <p className="eyebrow text-[9px] text-muted">{label}</p>
    </div>
  )
}

/** Cabecera del perfil: el arbol grande y donde esta parado. */
function Arbol({ level, state }) {
  const pct = Math.round((level.progress / level.steps) * 100)

  return (
    <section className="panel flex flex-col items-center px-5 py-6 text-center">
      <PixelSprite sprite={level} scale={6} label={level.name} />

      <p className="eyebrow mt-4 text-muted">
        Nivel {level.index + 1} de {LEVELS.length}
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-wide" style={{ color: level.color }}>
        {level.name}
      </h2>
      <p className="mt-1.5 max-w-xs text-sm leading-snug text-muted">{level.tagline}</p>

      <div className="mt-5 w-full max-w-xs">
        <div className="h-2 overflow-hidden rounded-full bg-ink-800">
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
              días para llegar a {level.next.name}
            </>
          )}
        </p>
      </div>

      {/* El camino completo, para ver de dónde venís y qué falta */}
      <ol className="mt-6 flex items-end justify-center gap-2">
        {LEVELS.map((l, i) => (
          <li key={l.id} className="flex flex-col items-center gap-1.5" title={l.name}>
            <PixelSprite
              sprite={l}
              scale={1.5}
              className={i <= level.index ? '' : 'opacity-25 grayscale'}
            />
            <i
              className={`h-1 w-6 rounded-full ${i <= level.index ? '' : 'bg-ink-800'}`}
              style={i <= level.index ? { background: l.color } : undefined}
              aria-hidden="true"
            />
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Pantalla de perfil y ranking, con las dos pestañas. */
export default function ProfilePage({ state, level, user, onVolver }) {
  const [pestana, setPestana] = useState('arbol')

  const cambiar = (p) => {
    play('blip', 8)
    setPestana(p)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onVolver}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-ink-800 hover:text-paper"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Volver
        </button>
      </div>

      <div role="tablist" className="flex gap-2">
        {[
          ['arbol', 'Mi árbol'],
          ['ranking', 'Ranking'],
        ].map(([id, texto]) => (
          <button
            key={id}
            role="tab"
            aria-selected={pestana === id}
            onClick={() => cambiar(id)}
            className={`control flex-1 ${pestana === id ? '' : 'opacity-60'}`}
            style={{ '--ctrl-c': pestana === id ? '#4ecdc4' : '#a5a1c9' }}
          >
            {texto}
          </button>
        ))}
      </div>

      {pestana === 'arbol' ? (
        <>
          <Arbol level={level} state={state} />

          <div className="grid grid-cols-4 gap-2">
            <Dato icon={Flame} label="Racha" valor={state.streak} tono="text-aqua" />
            <Dato icon={TrendingUp} label="Mejor" valor={state.bestStreak} tono="text-mint" />
            <Dato icon={Target} label="Misiones" valor={state.totalCompleted} tono="text-coral" />
            <Dato
              icon={Star}
              label="Puntos"
              valor={state.points.toLocaleString('es-AR')}
              tono="text-gold"
            />
          </div>

          <DimensionBars byCategory={state.byCategory} />
          <HistoryGrid history={state.history} />
        </>
      ) : (
        <Leaderboard user={user} />
      )}
    </div>
  )
}
