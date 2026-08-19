import { CircleHelp, RotateCcw, Wind } from 'lucide-react'

/**
 * Los tres unicos controles que quedan, en una sola fila al pie.
 */
export default function ControlBar({ rerollsLeft, canRecharge, rechargeMode, wildcardUsed, onRecharge, onWildcard, onHelp }) {
  return (
    <nav className="grid grid-cols-3 gap-2" aria-label="Controles">
      <button
        type="button"
        onClick={onRecharge}
        disabled={!canRecharge}
        aria-pressed={rechargeMode}
        className="control"
        style={{ '--ctrl-c': rechargeMode ? '#f2c14e' : '#a5a1c9' }}
      >
        <RotateCcw size={15} aria-hidden="true" />
        <span className="hidden sm:inline">{rechargeMode ? 'Cancelar' : 'Recargar'}</span>
        <span className="sm:hidden">{rechargeMode ? 'Cancelar' : 'Recargar'}</span>
        {!rechargeMode && <span className="tabular-nums opacity-70">{rerollsLeft}</span>}
      </button>

      <button
        type="button"
        onClick={onWildcard}
        disabled={wildcardUsed}
        className="control"
        style={{ '--ctrl-c': '#9d8df1' }}
      >
        <Wind size={15} aria-hidden="true" />
        Comodín
      </button>

      <button type="button" onClick={onHelp} className="control" style={{ '--ctrl-c': '#a5a1c9' }}>
        <CircleHelp size={15} aria-hidden="true" />
        Ayuda
      </button>
    </nav>
  )
}
