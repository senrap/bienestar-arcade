import { useState } from 'react'
import { CheckCircle2, Mail } from 'lucide-react'
import Modal from './Modal.jsx'
import { play } from '../lib/audio.js'

/** Ingreso por enlace al correo: sin contrasenas que recordar ni recuperar. */
export default function AuthModal({ onClose, onEnviar }) {
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('form') // form | enviando | enviado
  const [error, setError] = useState(null)

  const enviar = async (e) => {
    e.preventDefault()
    setError(null)
    setEstado('enviando')
    try {
      await onEnviar(email)
      setEstado('enviado')
      play('win', 15)
    } catch (err) {
      setEstado('form')
      setError(
        /rate|limit|seconds/i.test(err?.message ?? '')
          ? 'Se enviaron muchos enlaces seguidos. Probá de nuevo en unos minutos.'
          : 'No pudimos enviar el enlace. Revisá el correo e intentá otra vez.',
      )
    }
  }

  if (estado === 'enviado') {
    return (
      <Modal onClose={onClose} label="Revisá tu correo">
        <div className="py-2 text-center">
          <CheckCircle2 size={34} className="mx-auto text-mint" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-bold text-paper">Revisá tu correo</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Le mandamos un enlace a <span className="text-paper">{email}</span>. Tocalo desde este
            mismo teléfono y entrás sin contraseña.
          </p>
          <button type="button" onClick={onClose} className="control mt-6 w-full" style={{ '--ctrl-c': '#4ecdc4' }}>
            Listo
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal onClose={onClose} label="Guardar mi progreso">
      <p className="eyebrow text-aqua">Tu cuenta</p>
      <h2 className="mt-1 text-lg font-bold text-paper">Guardá tu árbol</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Con una cuenta tu progreso deja de vivir solo en este navegador: lo recuperás en cualquier
        teléfono y no lo perdés si limpiás los datos.
      </p>

      <form onSubmit={enviar} className="mt-5 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="eyebrow text-[10px] text-muted">Tu correo</span>
          <div className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 focus-within:border-aqua">
            <Mail size={16} className="shrink-0 text-muted" aria-hidden="true" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@ejemplo.com"
              className="min-w-0 flex-1 bg-transparent text-[15px] text-paper outline-hidden placeholder:text-muted/50"
            />
          </div>
        </label>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={estado === 'enviando'}
          className="control w-full"
          style={{ '--ctrl-c': '#4ecdc4' }}
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviarme el enlace'}
        </button>
      </form>

      <p className="mt-4 text-xs leading-snug text-muted/70">
        No hay contraseñas. Te llega un enlace, lo tocás y estás adentro.
      </p>
    </Modal>
  )
}
