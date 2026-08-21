import { parseKey, todayKey, weekGrid } from '../lib/date.js'

const INICIALES = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

/**
 * Las ultimas cinco semanas en cuadricula, alineadas de domingo a sabado para
 * que cada columna sea siempre el mismo dia y se note el ritmo semanal.
 */
export default function HistoryGrid({ history = {} }) {
  const celdas = weekGrid(5)
  const hoy = todayKey()
  const jugables = celdas.filter((c) => !c.futuro)
  const cumplidos = jugables.filter((c) => history[c.key]?.closed).length

  return (
    <section className="panel px-5 py-5">
      <div className="flex items-baseline justify-between">
        <h3 className="eyebrow text-muted">Últimas 5 semanas</h3>
        <span className="font-display text-sm font-bold tabular-nums text-paper">
          {cumplidos}/{jugables.length}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {INICIALES.map((letra, i) => (
          <span key={i} className="text-center text-[10px] font-medium text-muted/50">
            {letra}
          </span>
        ))}

        {celdas.map(({ key, futuro }) => {
          const e = history[key]
          const cerrado = e?.closed
          const parcial = e && e.done > 0 && !cerrado
          return (
            <div
              key={key}
              title={futuro ? key : `${key}${cerrado ? ' · cumplido' : parcial ? ` · ${e.done}/3` : ' · sin jugar'}`}
              className={`flex aspect-square items-center justify-center rounded text-[9px] tabular-nums ${
                futuro
                  ? 'bg-ink-900 text-muted/20'
                  : cerrado
                    ? e.wildcard
                      ? 'bg-lilac/70 font-semibold text-ink-950'
                      : 'bg-mint/70 font-semibold text-ink-950'
                    : parcial
                      ? 'bg-gold/25 text-gold'
                      : 'bg-ink-800 text-muted/40'
              } ${key === hoy ? 'ring-2 ring-aqua' : ''}`}
            >
              {parseKey(key).getDate()}
            </div>
          )
        })}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted">
        <li className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-mint/70" aria-hidden="true" /> Cumplido
        </li>
        <li className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-lilac/70" aria-hidden="true" /> Con comodín
        </li>
        <li className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-gold/25" aria-hidden="true" /> A medias
        </li>
        <li className="flex items-center gap-1.5">
          <i className="size-2.5 rounded-xs bg-ink-800" aria-hidden="true" /> Sin jugar
        </li>
      </ul>
    </section>
  )
}
