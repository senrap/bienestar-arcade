import { Check, RotateCcw } from 'lucide-react'
import { CATEGORIES } from '../data/categories.js'
import PixelSprite from './PixelSprite.jsx'

/**
 * Una mision del dia. En modo recarga toda la tarjeta se vuelve el boton para
 * cambiarla por otra.
 */
export default function MissionCard({ mission, index, rechargeMode, onToggle, onPick, locked }) {
  const cat = CATEGORIES[mission.cat]
  const { done } = mission
  const pickable = rechargeMode && !done

  return (
    <li
      className={`panel animate-rise relative px-4 py-4 transition-colors ${
        pickable ? 'cursor-pointer border-gold hover:bg-ink-850' : ''
      } ${done ? 'opacity-65' : ''}`}
      onClick={pickable ? () => onPick(index) : undefined}
    >
      <div className="flex items-start gap-4">
        <PixelSprite sprite={cat.sprite} scale={2} className="mt-1 shrink-0" />

        <div className="min-w-0 flex-1">
          <p className="eyebrow text-[10px]" style={{ color: cat.color }}>
            {cat.short}
          </p>

          <h3
            className={`mt-1 text-base font-semibold leading-snug ${
              done ? 'text-muted line-through' : 'text-paper'
            }`}
          >
            {mission.title}
          </h3>

          <p className="mt-1 text-sm leading-snug text-muted">{mission.desc}</p>

          <p className="mt-2 flex items-center gap-3 text-xs text-muted/80">
            <span className="tabular-nums">{mission.mins} min</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">+{mission.pts} pts</span>
            {pickable && (
              <span className="ml-auto flex items-center gap-1.5 font-medium text-gold">
                <RotateCcw size={12} aria-hidden="true" /> Cambiar esta
              </span>
            )}
          </p>
        </div>

        {/* Checkbox: cuadrado limpio que se pinta con el color de la categoria */}
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          aria-label={`Marcar "${mission.title}" como cumplida`}
          onClick={() => onToggle(index)}
          disabled={locked || rechargeMode}
          className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border-2 transition-colors disabled:cursor-not-allowed"
          style={{
            borderColor: cat.color,
            background: done ? cat.color : 'transparent',
          }}
        >
          {done && <Check size={19} strokeWidth={3.5} className="text-ink-950" aria-hidden="true" />}
        </button>
      </div>
    </li>
  )
}
