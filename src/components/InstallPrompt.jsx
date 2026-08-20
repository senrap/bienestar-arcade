import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import InstallModal from './InstallModal.jsx'
import { detectarPlataforma, yaInstalada } from '../lib/platform.js'
import { play } from '../lib/audio.js'

const DISMISSED_KEY = 'bienestar-arcade:install-dismissed'

/**
 * Invitacion a instalar la app en el telefono.
 *
 * Android dispara `beforeinstallprompt` y ahi se instala de un toque. iPhone no
 * tiene ese evento —y encima solo Safari puede instalar—, asi que en todos los
 * demas casos el panel abre las instrucciones del navegador que corresponda.
 * La regla es que tocar el panel SIEMPRE haga algo.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [visible, setVisible] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [plataforma, setPlataforma] = useState('escritorio')

  useEffect(() => {
    if (yaInstalada()) return
    setPlataforma(detectarPlataforma().tipo)

    try {
      if (localStorage.getItem(DISMISSED_KEY)) return
    } catch {
      /* storage bloqueado: se muestra igual */
    }
    setVisible(true)

    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    const onInstalada = () => {
      setDeferred(null)
      setVisible(false)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalada)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalada)
    }
  }, [])

  const dismiss = (e) => {
    e.stopPropagation()
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      /* ignorado */
    }
    setVisible(false)
  }

  // Con prompt nativo se instala directo; sin el, se explica como hacerlo.
  const accionar = async () => {
    play('select')
    if (deferred) {
      deferred.prompt()
      const { outcome } = await deferred.userChoice
      setDeferred(null)
      if (outcome === 'accepted') setVisible(false)
      return
    }
    setModalAbierto(true)
  }

  if (!visible) return null

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label="Tenela como app en el teléfono"
        onClick={accionar}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), accionar())}
        className="panel animate-rise flex cursor-pointer items-center gap-3 border-aqua/40 bg-aqua/5 px-4 py-3 transition-colors hover:bg-aqua/10"
      >
        <Download size={18} className="shrink-0 text-aqua" aria-hidden="true" />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-paper">Tenela como app en el teléfono</p>
          <p className="text-xs text-muted">
            {deferred ? 'Se instala de un toque' : 'Tocá acá y te muestro cómo'}
          </p>
        </div>

        <span className="control shrink-0 px-3 py-2 text-xs" style={{ '--ctrl-c': '#4ecdc4' }}>
          {deferred ? 'Instalar' : 'Ver cómo'}
        </span>

        <button
          type="button"
          onClick={dismiss}
          aria-label="No mostrar más"
          className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-ink-800 hover:text-paper"
        >
          <X size={15} />
        </button>
      </div>

      {modalAbierto && (
        <InstallModal plataforma={plataforma} onClose={() => setModalAbierto(false)} />
      )}
    </>
  )
}
