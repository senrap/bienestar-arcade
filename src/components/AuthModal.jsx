import { useState } from 'react'
import { ArrowLeft, KeyRound, Mail } from 'lucide-react'
import Modal from './Modal.jsx'
import { play } from '../lib/audio.js'

const LARGO_CODIGO = 6

const mensajeDeError = (err, contexto) => {
  const texto = err?.message ?? ''
  if (/rate|limit|seconds|too many/i.test(texto))
    return 'Se pidieron muchos códigos seguidos. Probá de nuevo en unos minutos.'
  if (contexto === 'codigo')
    return 'Ese código no es válido o ya venció. Revisá el correo o pedí uno nuevo.'
  return 'No pudimos enviar el código. Revisá el correo e intentá otra vez.'
}

/**
 * Ingreso con codigo de un solo uso.
 *
 * Todo el flujo pasa adentro de la app a proposito: si el ingreso dependiera de
 * abrir el enlace del correo, en un telefono con la app instalada la sesion
 * quedaria en el navegador y la app seguiria deslogueada.
 */
export default function AuthModal({ onClose, onEnviar, onVerificar }) {
  const [paso, setPaso] = useState('email') // email | codigo
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState(null)

  const pedirCodigo = async (e) => {
    e?.preventDefault()
    setError(null)
    setOcupado(true)
    try {
      await onEnviar(email)
      setPaso('codigo')
      setCodigo('')
      play('select')
    } catch (err) {
      setError(mensajeDeError(err, 'envio'))
    } finally {
      setOcupado(false)
    }
  }

  const entrar = async (e) => {
    e.preventDefault()
    setError(null)
    setOcupado(true)
    try {
      await onVerificar(email, codigo)
      play('win', 15)
      onClose()
    } catch (err) {
      setError(mensajeDeError(err, 'codigo'))
      setOcupado(false)
    }
  }

  return (
    <Modal onClose={onClose} label="Guardar mi progreso">
      {paso === 'email' ? (
        <>
          <p className="eyebrow text-aqua">Tu cuenta</p>
          <h2 className="mt-1 text-lg font-bold text-paper">Guardá tu árbol</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Con una cuenta tu progreso deja de vivir solo en este dispositivo: lo recuperás en
            cualquier teléfono y no lo perdés si limpiás los datos.
          </p>

          <form onSubmit={pedirCodigo} className="mt-5 flex flex-col gap-3">
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
              disabled={ocupado}
              className="control w-full"
              style={{ '--ctrl-c': '#4ecdc4' }}
            >
              {ocupado ? 'Enviando…' : 'Enviarme el código'}
            </button>
          </form>

          <p className="mt-4 text-xs leading-snug text-muted/70">
            No hay contraseñas. Te llega un código de {LARGO_CODIGO} dígitos y lo escribís acá mismo.
          </p>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setPaso('email')
              setError(null)
            }}
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-paper"
          >
            <ArrowLeft size={13} aria-hidden="true" /> Cambiar el correo
          </button>

          <h2 className="mt-3 text-lg font-bold text-paper">Escribí el código</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Le mandamos un código de {LARGO_CODIGO} dígitos a{' '}
            <span className="text-paper">{email}</span>. Copialo acá sin salir de la app.
          </p>

          <form onSubmit={entrar} className="mt-5 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="eyebrow text-[10px] text-muted">Código</span>
              <div className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-950 px-3 py-2.5 focus-within:border-aqua">
                <KeyRound size={16} className="shrink-0 text-muted" aria-hidden="true" />
                <input
                  type="text"
                  required
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  value={codigo}
                  onChange={(e) =>
                    setCodigo(e.target.value.replace(/\D/g, '').slice(0, LARGO_CODIGO))
                  }
                  placeholder="000000"
                  className="min-w-0 flex-1 bg-transparent font-display text-xl tracking-[0.35em] tabular-nums text-paper outline-hidden placeholder:text-muted/40"
                />
              </div>
            </label>

            {error && <p className="text-sm text-coral">{error}</p>}

            <button
              type="submit"
              disabled={ocupado || codigo.length < LARGO_CODIGO}
              className="control w-full"
              style={{ '--ctrl-c': '#4ecdc4' }}
            >
              {ocupado ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <button
            type="button"
            onClick={pedirCodigo}
            disabled={ocupado}
            className="mt-4 text-xs text-muted underline underline-offset-4 transition-colors hover:text-aqua disabled:opacity-50"
          >
            No me llegó, mandame otro
          </button>
        </>
      )}
    </Modal>
  )
}
