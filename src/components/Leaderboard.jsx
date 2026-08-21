import { useEffect, useState } from 'react'
import { Trophy, UserRound } from 'lucide-react'
import PixelSprite from './PixelSprite.jsx'
import { LEVELS } from '../data/levels.js'
import { fetchLeaderboard, guardarPerfil, leerPerfil } from '../lib/cloud.js'
import { play } from '../lib/audio.js'

const MEDALLAS = ['🥇', '🥈', '🥉']

/** Fila del ranking. La tuya queda marcada. */
function Fila({ p, propio }) {
  const nivel = LEVELS[p.level] ?? LEVELS[0]
  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
        propio ? 'bg-aqua/10 ring-1 ring-aqua/40' : 'odd:bg-ink-900/60'
      }`}
    >
      <span className="w-7 shrink-0 text-center font-display text-sm font-bold tabular-nums text-muted">
        {MEDALLAS[p.puesto - 1] ?? p.puesto}
      </span>

      <PixelSprite sprite={nivel} scale={1.25} className="shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-paper">
          {p.emoji} {p.display_name} {propio && <span className="text-xs text-aqua">· vos</span>}
        </p>
        <p className="text-[11px]" style={{ color: nivel.color }}>
          {nivel.name}
          {p.days_at_top > 0 && (
            <span className="text-muted"> · {p.days_at_top} d en la cima</span>
          )}
        </p>
      </div>

      <span className="shrink-0 text-right font-display text-sm font-bold tabular-nums text-gold">
        {p.streak}
        <span className="ml-1 text-[10px] font-normal text-muted">racha</span>
      </span>
    </li>
  )
}

/** Formulario para entrar (o salir) del ranking. */
function Anotarse({ perfil, onGuardar }) {
  const [nombre, setNombre] = useState(perfil?.display_name ?? '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const dentro = Boolean(perfil?.in_ranking)

  const enviar = async (e) => {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      await onGuardar({ display_name: nombre.trim(), in_ranking: true })
      play('win', 15)
    } catch {
      setError('No pudimos guardarlo. Probá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (dentro) {
    return (
      <div className="panel flex items-center gap-3 px-4 py-3">
        <UserRound size={16} className="shrink-0 text-aqua" aria-hidden="true" />
        <p className="flex-1 text-sm text-muted">
          Aparecés como <span className="font-medium text-paper">{perfil.display_name}</span>.
        </p>
        <button
          type="button"
          onClick={() => onGuardar({ in_ranking: false })}
          className="shrink-0 text-xs text-muted underline underline-offset-4 hover:text-coral"
        >
          Salir del ranking
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="panel flex flex-col gap-3 px-4 py-4">
      <div>
        <p className="text-sm font-medium text-paper">Sumate al ranking</p>
        <p className="mt-1 text-xs leading-snug text-muted">
          Elegí con qué nombre querés aparecer. Nadie ve tu correo, solo el nombre y cómo viene tu
          árbol. Podés salir cuando quieras.
        </p>
      </div>

      <input
        type="text"
        required
        minLength={2}
        maxLength={24}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Cómo querés que te vean"
        className="rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 text-[15px] text-paper outline-hidden placeholder:text-muted/50 focus:border-aqua"
      />

      {error && <p className="text-sm text-coral">{error}</p>}

      <button
        type="submit"
        disabled={guardando || nombre.trim().length < 2}
        className="control w-full"
        style={{ '--ctrl-c': '#4ecdc4' }}
      >
        {guardando ? 'Guardando…' : 'Aparecer en el ranking'}
      </button>
    </form>
  )
}

/** Tabla de posiciones, ordenada por árbol y constancia. */
export default function Leaderboard({ user }) {
  const [filas, setFilas] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [error, setError] = useState(false)

  const cargar = async () => {
    try {
      const [tabla, mio] = await Promise.all([fetchLeaderboard(), leerPerfil(user.id)])
      setFilas(tabla)
      setPerfil(mio)
    } catch {
      setError(true)
    }
  }

  useEffect(() => {
    if (user) cargar()
  }, [user?.id])

  if (!user) {
    return (
      <div className="panel px-5 py-8 text-center">
        <Trophy size={28} className="mx-auto text-muted/60" aria-hidden="true" />
        <p className="mt-4 text-sm leading-relaxed text-muted">
          El ranking necesita una cuenta. Creá una desde el botón de arriba y elegí si querés
          aparecer.
        </p>
      </div>
    )
  }

  const guardar = async (cambios) => {
    await guardarPerfil(user.id, cambios)
    await cargar()
  }

  return (
    <div className="flex flex-col gap-4">
      <Anotarse perfil={perfil} onGuardar={guardar} />

      {error ? (
        <p className="panel px-5 py-6 text-center text-sm text-muted">
          No pudimos traer el ranking. Revisá la conexión.
        </p>
      ) : filas === null ? (
        <p className="panel px-5 py-6 text-center text-sm text-muted">Cargando…</p>
      ) : filas.length === 0 ? (
        <p className="panel px-5 py-6 text-center text-sm leading-relaxed text-muted">
          Todavía no hay nadie anotado. Si te sumás, arrancás primero.
        </p>
      ) : (
        <ol className="panel flex flex-col gap-1 px-2 py-2">
          {filas.map((p) => (
            <Fila key={`${p.puesto}-${p.display_name}`} p={p} propio={p.display_name === perfil?.display_name} />
          ))}
        </ol>
      )}

      <p className="px-1 text-xs leading-snug text-muted/70">
        Se ordena por nivel del árbol, después por días en la cima y por racha. No por puntos: lo que
        cuenta es sostener, no acumular.
      </p>
    </div>
  )
}
