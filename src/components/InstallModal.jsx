import { Share, SquarePlus } from 'lucide-react'
import Modal from './Modal.jsx'

const Paso = ({ n, children }) => (
  <li className="flex gap-3">
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-aqua/15 font-display text-xs font-bold text-aqua">
      {n}
    </span>
    <span className="text-sm leading-snug text-muted">{children}</span>
  </li>
)

const GUIAS = {
  'ios-safari': {
    titulo: 'Instalar en tu iPhone',
    pasos: [
      <>
        Tocá el botón <span className="font-semibold text-paper">Compartir</span>{' '}
        <Share size={14} className="inline align-[-3px] text-aqua" aria-label="compartir" />, abajo
        en el centro de la pantalla.
      </>,
      <>
        Deslizá la lista hacia abajo y elegí{' '}
        <span className="font-semibold text-paper">Agregar a pantalla de inicio</span>{' '}
        <SquarePlus size={14} className="inline align-[-3px] text-aqua" aria-hidden="true" />.
      </>,
      <>
        Tocá <span className="font-semibold text-paper">Agregar</span>, arriba a la derecha. Listo:
        el árbol te queda entre tus apps.
      </>,
    ],
  },
  'ios-otro-navegador': {
    titulo: 'Abrila en Safari',
    aviso:
      'En iPhone solo Safari puede instalar aplicaciones web. Desde Chrome, Firefox o Edge la opción no aparece, por más que busques.',
    pasos: [
      <>
        Copiá la dirección de esta página y abrila en{' '}
        <span className="font-semibold text-paper">Safari</span>.
      </>,
      <>
        Ahí sí: <span className="font-semibold text-paper">Compartir</span>{' '}
        <Share size={14} className="inline align-[-3px] text-aqua" aria-hidden="true" /> →{' '}
        <span className="font-semibold text-paper">Agregar a pantalla de inicio</span>.
      </>,
    ],
  },
  android: {
    titulo: 'Instalar en tu Android',
    pasos: [
      <>
        Tocá el menú <span className="font-semibold text-paper">⋮</span> arriba a la derecha, en
        Chrome.
      </>,
      <>
        Elegí <span className="font-semibold text-paper">Instalar aplicación</span> —en algunos
        teléfonos dice <span className="font-semibold text-paper">Agregar a pantalla de inicio</span>.
      </>,
      <>Confirmá y la app queda instalada como cualquier otra.</>,
    ],
  },
  'android-firefox': {
    titulo: 'Instalar en tu Android',
    pasos: [
      <>
        Tocá el menú <span className="font-semibold text-paper">⋮</span> de Firefox.
      </>,
      <>
        Elegí <span className="font-semibold text-paper">Instalar</span> o{' '}
        <span className="font-semibold text-paper">Agregar a pantalla de inicio</span>.
      </>,
    ],
  },
  escritorio: {
    titulo: 'Instalar en esta computadora',
    pasos: [
      <>
        Buscá el ícono de instalar en la barra de direcciones, a la derecha —una pantallita con una
        flecha hacia abajo.
      </>,
      <>
        Si no está, entrá al menú del navegador y buscá{' '}
        <span className="font-semibold text-paper">Instalar Bienestar Arcade</span>.
      </>,
    ],
  },
}

/** Instrucciones de instalacion, distintas segun donde este parado el usuario. */
export default function InstallModal({ plataforma, onClose }) {
  const guia = GUIAS[plataforma] ?? GUIAS.escritorio

  return (
    <Modal onClose={onClose} label={guia.titulo}>
      <p className="eyebrow text-aqua">Tenerla a mano</p>
      <h2 className="mt-1 text-lg font-bold text-paper">{guia.titulo}</h2>

      {guia.aviso && (
        <p className="mt-3 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2.5 text-sm leading-snug text-gold">
          {guia.aviso}
        </p>
      )}

      <ol className="mt-5 flex flex-col gap-3.5">
        {guia.pasos.map((paso, i) => (
          <Paso key={i} n={i + 1}>
            {paso}
          </Paso>
        ))}
      </ol>

      <p className="mt-5 text-xs leading-snug text-muted/70">
        Queda con su ícono, abre a pantalla completa y funciona sin conexión.
      </p>

      <button type="button" onClick={onClose} className="control mt-5 w-full" style={{ '--ctrl-c': '#4ecdc4' }}>
        Entendido
      </button>
    </Modal>
  )
}
