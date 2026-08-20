import { Check, CloudOff, LogOut, RefreshCw, UserRound } from 'lucide-react'

const ESTADOS = {
  syncing: { icon: RefreshCw, texto: 'Guardando…', tono: 'text-muted', gira: true },
  saved: { icon: Check, texto: 'Guardado', tono: 'text-mint' },
  error: { icon: CloudOff, texto: 'Sin guardar', tono: 'text-coral' },
}

/**
 * Estado de la cuenta en el encabezado: invita a crearla si no hay, y si hay
 * muestra si el progreso ya subio.
 */
export default function AccountButton({ user, sync, onEntrar, onSalir }) {
  if (!user) {
    return (
      <button
        type="button"
        onClick={onEntrar}
        className="control px-3 py-2 text-xs"
        style={{ '--ctrl-c': '#4ecdc4' }}
      >
        <UserRound size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Guardar progreso</span>
        <span className="sm:hidden">Entrar</span>
      </button>
    )
  }

  const estado = ESTADOS[sync]

  return (
    <div className="flex items-center gap-2">
      {estado && (
        <span className={`flex items-center gap-1.5 text-[11px] ${estado.tono}`}>
          <estado.icon size={13} className={estado.gira ? 'animate-spin' : ''} aria-hidden="true" />
          <span className="hidden sm:inline">{estado.texto}</span>
        </span>
      )}
      <button
        type="button"
        onClick={onSalir}
        title={`Salir de ${user.email}`}
        aria-label={`Salir de la cuenta ${user.email}`}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-ink-800 hover:text-coral"
      >
        <LogOut size={16} />
      </button>
    </div>
  )
}
