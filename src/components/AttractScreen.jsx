import PixelSprite from './PixelSprite.jsx'
import { CATEGORY_LIST } from '../data/categories.js'
import { displayDate } from '../lib/date.js'

/**
 * Modo atraccion: lo que se ve antes de pagar la moneda del dia.
 */
export default function AttractScreen({ state, onInsertCoin }) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <p className="font-label text-[10px] tracking-[0.35em] text-neon-cyan/80">{displayDate()}</p>

      <h2 className="mt-5 font-pixel text-xl leading-8 text-neon-yellow text-glow sm:text-3xl sm:leading-12">
        READY PLAYER <span className="text-neon-magenta">ONE</span>
      </h2>

      <p className="mt-5 max-w-md font-screen text-xl leading-6 text-neon-lime/90 sm:text-2xl">
        Pagá una moneda y la máquina te tira 3 misiones traviesas de 1 a 5 minutos.
      </p>

      {/* Las 5 familias, con su sprite */}
      <ul className="mt-6 flex flex-wrap items-start justify-center gap-3">
        {CATEGORY_LIST.map((c) => (
          <li
            key={c.id}
            className="pixel-frame flex w-24 flex-col items-center gap-2 bg-crt-950 px-2 py-3"
            style={{ '--frame-c': c.color }}
            title={c.tagline}
          >
            <PixelSprite sprite={c.sprite} scale={2.5} label={c.name} />
            <span className="font-label text-[8px] leading-3 tracking-widest" style={{ color: c.color }}>
              {c.short}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onInsertCoin}
        className="pixel-btn mt-8 bg-neon-magenta px-6 py-4 font-pixel text-xs text-white sm:px-10 sm:text-sm"
        style={{ '--btn-edge': '#0d0814', '--btn-shadow': '#7a0040' }}
      >
        <span className="animate-blink">▸</span> INSERT COIN / START{' '}
        <span className="animate-blink">◂</span>
      </button>

      <p className="mt-3 font-label text-[8px] tracking-[0.25em] text-white/40">
        O PULSA START EN EL GABINETE
      </p>

      <div className="mt-7 flex w-full max-w-sm items-center justify-between gap-3 border-t-4 border-crt-700 pt-4 font-label text-[10px] tracking-widest">
        <span className="text-neon-orange">
          RACHA <span className="text-neon-yellow">{state.streak}</span>
        </span>
        <span className="text-neon-cyan/70">
          HI-SCORE <span className="text-neon-cyan">{state.points}</span>
        </span>
        <span className="text-neon-violet">
          BEST <span className="text-neon-yellow">{state.bestStreak}</span>
        </span>
      </div>
    </div>
  )
}
