import Modal from './Modal.jsx'
import PixelSprite from './PixelSprite.jsx'
import { LEVELS } from '../data/levels.js'

/** Aviso de que el arbol crecio o de que se podo. */
export default function LevelChangeModal({ change, onClose }) {
  const level = LEVELS[change.to]
  const from = LEVELS[change.from]
  const up = change.type === 'up'

  return (
    <Modal onClose={onClose} label={up ? 'Subiste de nivel' : 'Bajaste de nivel'}>
      <div className="text-center">
        <p className="eyebrow" style={{ color: up ? '#6ecf97' : '#e56ba0' }}>
          {up ? 'El árbol creció' : 'El árbol se podó'}
        </p>

        <div className="my-6 flex items-end justify-center gap-6">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <PixelSprite sprite={from} scale={3} />
            <span className="text-[11px] text-muted">{from.name}</span>
          </div>
          <span className="pb-6 text-xl text-muted" aria-hidden="true">
            {up ? '→' : '←'}
          </span>
          <div className="flex flex-col items-center gap-2">
            <PixelSprite sprite={level} scale={4} label={level.name} className="animate-rise" />
            <span className="text-[11px] font-semibold" style={{ color: level.color }}>
              {level.name}
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-paper">{level.name}</h2>
        <p className="mt-2 text-sm leading-snug text-muted">
          {up
            ? level.tagline
            : 'Un día sin cumplir cuesta un nivel. Se recupera igual que se ganó: cumpliendo.'}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="control mt-6 w-full"
          style={{ '--ctrl-c': up ? '#6ecf97' : '#a5a1c9' }}
        >
          {up ? 'Seguir' : 'Entendido'}
        </button>
      </div>
    </Modal>
  )
}
