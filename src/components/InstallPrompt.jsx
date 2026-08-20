import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'

const DISMISSED_KEY = 'bienestar-arcade:install-dismissed'

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

/** Safari en iPhone/iPad no ofrece boton: hay que explicar el camino a mano. */
const isIOS = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

/**
 * Invitacion a instalar la app en el telefono. En Android usa el prompt nativo
 * del navegador; en iPhone no existe, asi que muestra los dos toques que hay
 * que dar. Se puede descartar y no vuelve.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [showIOS, setShowIOS] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    try {
      if (localStorage.getItem(DISMISSED_KEY)) return
    } catch {
      /* storage bloqueado: mostramos igual */
    }

    const onPrompt = (e) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', () => setDeferred(null))

    // iOS nunca dispara beforeinstallprompt, asi que se detecta a mano.
    if (isIOS()) setShowIOS(true)

    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      /* ignorado */
    }
    setDeferred(null)
    setShowIOS(false)
  }

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  if (!deferred && !showIOS) return null

  return (
    <div className="panel animate-rise relative flex items-center gap-3 border-aqua/40 bg-aqua/5 px-4 py-3">
      <Download size={18} className="shrink-0 text-aqua" aria-hidden="true" />

      <div className="min-w-0 flex-1">
        {deferred ? (
          <p className="text-sm text-paper">Instalala en tu teléfono y abrila como una app.</p>
        ) : (
          <p className="text-sm leading-snug text-paper">
            Para tenerla como app: tocá{' '}
            <Share size={13} className="inline align-[-2px] text-aqua" aria-label="Compartir" /> y
            después <span className="font-semibold">Agregar a pantalla de inicio</span>.
          </p>
        )}
      </div>

      {deferred && (
        <button
          type="button"
          onClick={install}
          className="control shrink-0 px-3 py-2 text-xs"
          style={{ '--ctrl-c': '#4ecdc4' }}
        >
          Instalar
        </button>
      )}

      <button
        type="button"
        onClick={dismiss}
        aria-label="No mostrar más"
        className="shrink-0 rounded-lg p-1.5 text-muted transition-colors hover:bg-ink-800 hover:text-paper"
      >
        <X size={15} />
      </button>
    </div>
  )
}
