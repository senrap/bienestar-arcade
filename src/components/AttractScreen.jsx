import PixelSprite from './PixelSprite.jsx'
import { CATEGORY_LIST } from '../data/categories.js'

/** Lo que se ve antes de empezar el dia. */
export default function AttractScreen({ state, level, onInsertCoin }) {
  const volviendo = state.streak > 0 || state.level > 0

  return (
    <section className="panel flex flex-col items-center px-5 py-8 text-center sm:py-10">
      <PixelSprite sprite={level} scale={5} label={level.name} className="animate-rise" />

      <h2 className="mt-6 text-2xl font-bold tracking-wide text-paper">
        {volviendo ? 'Otro día, otro riego' : 'Empezá tu árbol'}
      </h2>
      <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
        Tres misiones de 1 a 5 minutos por día. Cumplilas y el árbol crece; dejá pasar un día y
        retrocede un nivel.
      </p>

      <button
        type="button"
        onClick={onInsertCoin}
        className="control mt-7 px-10 py-3.5 text-[15px]"
        style={{ '--ctrl-c': '#4ecdc4' }}
      >
        Insert coin
      </button>
      <p className="mt-2.5 text-xs text-muted/70">Se sortean tus 3 misiones de hoy</p>

      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
        {CATEGORY_LIST.map((c) => (
          <li key={c.id} className="flex w-20 flex-col items-center gap-2" title={c.tagline}>
            <PixelSprite sprite={c.sprite} scale={2} label={c.name} />
            <span className="eyebrow text-[9px] leading-3" style={{ color: c.color }}>
              {c.short}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
