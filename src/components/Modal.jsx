import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/** Ventana modal simple, con cierre por Escape y por click en el fondo. */
export default function Modal({ children, onClose, label, dismissable = true }) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current?.focus()
    if (!dismissable) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, dismissable])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/85 p-4 backdrop-blur-sm"
      onClick={dismissable ? onClose : undefined}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="panel animate-rise relative max-h-[85vh] w-full max-w-md overflow-y-auto px-6 py-6 outline-hidden"
      >
        {dismissable && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-3 top-3 rounded-lg p-1.5 text-muted transition-colors hover:bg-ink-800 hover:text-paper"
          >
            <X size={16} />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}
