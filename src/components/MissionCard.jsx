import { Clock, RotateCcw } from 'lucide-react'
import { CATEGORIES } from '../data/categories.js'
import PixelCheck from './PixelCheck.jsx'
import PixelSprite from './PixelSprite.jsx'

/**
 * Tarjeta de mision: sprite de la categoria, texto y checkbox retro.
 * En "modo recarga" toda la tarjeta pasa a ser el boton para cambiarla.
 */
export default function MissionCard({
  mission,
  index,
  focused,
  rechargeMode,
  onToggle,
  onPick,
  locked,
}) {
  const cat = CATEGORIES[mission.cat]
  const { done } = mission
  const pickable = rechargeMode && !done

  return (
    <li
      className={`pixel-frame relative bg-crt-900 p-3 transition-opacity ${done ? 'opacity-70' : ''} ${
        focused && !rechargeMode ? 'mission-focus' : ''
      } ${pickable ? 'cursor-pointer animate-pop' : ''}`}
      style={{ '--frame-c': pickable ? '#ff7b00' : cat.color }}
      onClick={pickable ? () => onPick(index) : undefined}
    >
      <div className="flex items-start gap-3">
        {/* --- SPRITE DE LA CATEGORIA --- */}
        <div
          className="mt-0.5 shrink-0 bg-crt-950 p-1"
          style={{
            boxShadow: `0 -3px 0 0 ${cat.color}, 0 3px 0 0 ${cat.color}, -3px 0 0 0 ${cat.color}, 3px 0 0 0 ${cat.color}`,
          }}
        >
          <PixelSprite sprite={cat.sprite} scale={2.5} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-label text-[9px] tracking-[0.2em]" style={{ color: cat.color }}>
            {cat.short}
          </p>

          <h3
            className={`mt-1.5 font-pixel text-[10px] leading-5 sm:leading-6 ${
              done ? 'text-white/45 line-through decoration-4 decoration-white/30' : 'text-white'
            }`}
          >
            {mission.title}
          </h3>

          <p className="mt-1.5 font-screen text-lg leading-5 text-neon-cyan/85">{mission.desc}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-label text-[9px] tracking-widest">
            <span className="flex items-center gap-1.5 text-neon-cyan/70">
              <Clock size={11} strokeWidth={3} aria-hidden="true" /> {mission.mins} MIN
            </span>
            <span className="text-neon-yellow">+{mission.pts} PTS</span>
          </div>

          {/* Pista de teclado / joystick, al estilo de la maquina */}
          {!done && !rechargeMode && (
            <p
              className={`mt-2 font-label text-[8px] tracking-[0.2em] ${focused ? 'text-neon-lime' : 'text-white/30'}`}
            >
              ▶ {focused ? 'PUSH START TO ACTIVATE' : 'SELECT WITH JOYSTICK'}
            </p>
          )}

          {pickable && (
            <p className="mt-2 flex items-center gap-1.5 font-label text-[8px] tracking-[0.2em] text-neon-orange">
              <RotateCcw size={11} strokeWidth={3} aria-hidden="true" /> TOCAR PARA RECARGAR ESTA
            </p>
          )}
        </div>

        {/* --- CHECKBOX RETRO --- */}
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Marcar "${mission.title}" como cumplida`}
          onClick={() => onToggle(index)}
          disabled={locked || rechargeMode}
          className="focus-pixel mt-0.5 flex size-9 shrink-0 items-center justify-center transition-transform active:translate-y-0.5 disabled:cursor-not-allowed"
          style={{
            background: done ? cat.color : '#0d0814',
            boxShadow: `0 -3px 0 0 ${cat.color}, 0 3px 0 0 ${cat.color}, -3px 0 0 0 ${cat.color}, 3px 0 0 0 ${cat.color}`,
          }}
        >
          {done && <PixelCheck color="#0d0814" scale={3} />}
        </button>
      </div>
    </li>
  )
}
