import MissionCard from './MissionCard.jsx'
import ScorePanel from './ScorePanel.jsx'
import { COMBO_BONUS, WILDCARD_TASK } from '../lib/game.js'
import { displayDate } from '../lib/date.js'

/**
 * Pantalla de juego. En desktop se parte en dos columnas (misiones a la
 * izquierda, marcador y coleccionables a la derecha); en mobile se apila.
 */
export default function MissionPanel({
  state,
  done,
  dayComplete,
  focused,
  rechargeMode,
  onToggle,
  onPick,
  onOpenGallery,
}) {
  return (
    <div className="py-1">
      <div className="mb-4 flex items-center justify-between font-label text-[9px] tracking-[0.25em]">
        <span className="text-neon-cyan/80">{displayDate()}</span>
        <span className="text-neon-magenta">1UP</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-5">
        {/* --- COLUMNA IZQUIERDA: MISION DIARIA --- */}
        <section>
          <h2 className="mb-3 text-center font-pixel text-[12px] leading-6 text-neon-yellow text-glow-soft sm:text-sm">
            MISION DIARIA
          </h2>

          {rechargeMode && (
            <p
              className="pixel-frame animate-pop mb-3 bg-crt-950 px-3 py-2 text-center font-label text-[9px] tracking-widest text-neon-orange"
              style={{ '--frame-c': '#ff7b00' }}
            >
              MODO RECARGA · ELEGI QUE MISION CAMBIAR
            </p>
          )}

          {state.wildcardUsed ? (
            <div
              className="pixel-frame bg-crt-900 p-4 text-center"
              style={{ '--frame-c': '#b76bff' }}
            >
              <p className="font-pixel text-[11px] leading-6 text-neon-violet text-glow">
                COMODIN TRAVIESO USADO
              </p>
              <p className="mt-3 font-screen text-xl leading-6 text-white/80">
                Hoy tu única misión era {WILDCARD_TASK.title.toLowerCase()}. La racha quedó a salvo y
                nadie te va a pedir explicaciones.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {state.missions.map((mission, i) => (
                <MissionCard
                  key={`${mission.id}-${i}`}
                  mission={mission}
                  index={i}
                  focused={focused === i}
                  rechargeMode={rechargeMode}
                  onToggle={onToggle}
                  onPick={onPick}
                  locked={state.wildcardUsed}
                />
              ))}
            </ul>
          )}

          {dayComplete && (
            <div
              className="pixel-frame animate-pop mt-4 bg-crt-950 p-4 text-center"
              style={{ '--frame-c': '#39ff14' }}
            >
              <p className="font-pixel text-[12px] leading-6 text-neon-lime text-glow">
                COMBO DAY x{state.streak}
              </p>
              <p className="mt-3 font-screen text-xl leading-6 text-neon-yellow">
                {state.wildcardUsed
                  ? 'Día salvado con el comodín. Mañana volvés con todo.'
                  : `¡3 de 3! Bonus de +${COMBO_BONUS} PTS y la racha sube.`}
              </p>
            </div>
          )}
        </section>

        {/* --- COLUMNA DERECHA: MARCADOR --- */}
        <ScorePanel state={state} done={done} onOpenGallery={onOpenGallery} />
      </div>
    </div>
  )
}
