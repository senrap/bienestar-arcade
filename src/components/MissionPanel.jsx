import MissionCard from './MissionCard.jsx'
import LevelPanel from './LevelPanel.jsx'
import { COMBO_BONUS, DAILY_MISSIONS } from '../lib/game.js'

/** La pantalla del dia: el arbol arriba, las misiones abajo. */
export default function MissionPanel({
  state,
  level,
  done,
  dayComplete,
  rechargeMode,
  onToggle,
  onPick,
  onAbrirPerfil,
}) {
  return (
    <>
      <LevelPanel level={level} state={state} onAbrirPerfil={onAbrirPerfil} />

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="eyebrow text-muted">Misiones de hoy</h2>
          <span className="font-display text-sm font-bold tabular-nums text-paper">
            {done}/{DAILY_MISSIONS}
          </span>
        </div>

        {rechargeMode && (
          <p className="panel animate-rise border-gold/60 bg-gold/5 px-4 py-3 text-center text-sm text-gold">
            Elegí cuál querés cambiar.
          </p>
        )}

        {state.wildcardUsed ? (
          <div className="panel px-5 py-5 text-center">
            <p className="font-display text-base font-bold text-lilac">Comodín usado</p>
            <p className="mt-2 text-sm leading-snug text-muted">
              Hoy tu única misión era respirar tres veces. El árbol quedó donde estaba y nadie te
              va a pedir explicaciones.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {state.missions.map((mission, i) => (
              <MissionCard
                key={`${mission.id}-${i}`}
                mission={mission}
                index={i}
                rechargeMode={rechargeMode}
                onToggle={onToggle}
                onPick={onPick}
                locked={state.wildcardUsed}
              />
            ))}
          </ul>
        )}

        {dayComplete && (
          <div className="panel animate-rise border-mint/50 bg-mint/5 px-5 py-4 text-center">
            <p className="font-display text-base font-bold text-mint">Día cumplido</p>
            <p className="mt-1.5 text-sm leading-snug text-muted">
              {state.wildcardUsed
                ? 'El comodín sostuvo el nivel. Mañana el árbol vuelve a crecer.'
                : `3 de 3. +${COMBO_BONUS} pts de bonus y un día más de raíz.`}
            </p>
          </div>
        )}
      </section>
    </>
  )
}
