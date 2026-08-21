import { CATEGORY_LIST } from '../data/categories.js'
import PixelSprite from './PixelSprite.jsx'

/**
 * Como viene cada dimension: cuantas misiones cumpliste de cada familia,
 * en proporcion a la que mas hiciste.
 */
export default function DimensionBars({ byCategory = {} }) {
  const filas = CATEGORY_LIST.map((c) => ({ ...c, n: byCategory[c.id] ?? 0 }))
  const total = filas.reduce((s, f) => s + f.n, 0)
  const techo = Math.max(1, ...filas.map((f) => f.n))

  const ordenadas = [...filas].sort((a, b) => b.n - a.n)
  const fuerte = ordenadas[0]
  const floja = ordenadas[ordenadas.length - 1]

  return (
    <section className="panel px-5 py-5">
      <div className="flex items-baseline justify-between">
        <h3 className="eyebrow text-muted">Tus dimensiones</h3>
        <span className="font-display text-sm font-bold tabular-nums text-paper">
          {total} {total === 1 ? 'misión' : 'misiones'}
        </span>
      </div>

      {total === 0 ? (
        <p className="mt-4 text-sm leading-snug text-muted">
          Todavía no cumpliste ninguna. Cuando marques las primeras, acá vas a ver de qué lado te
          inclinás.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3">
            {filas.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <PixelSprite sprite={c.sprite} scale={1.5} className="shrink-0" />

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="eyebrow text-[10px]" style={{ color: c.color }}>
                      {c.short}
                    </span>
                    <span className="font-display text-xs font-bold tabular-nums text-muted">
                      {c.n}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-800">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${(c.n / techo) * 100}%`, background: c.color }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Una lectura, no solo números */}
          {fuerte.n > floja.n && (
            <p className="mt-4 border-t border-ink-700 pt-4 text-sm leading-snug text-muted">
              Tu fuerte es <span style={{ color: fuerte.color }}>{fuerte.name.toLowerCase()}</span>.
              La que menos tocás es{' '}
              <span style={{ color: floja.color }}>{floja.name.toLowerCase()}</span>
              {floja.n === 0 ? ': todavía no cumpliste ninguna.' : '.'}
            </p>
          )}
        </>
      )}
    </section>
  )
}
