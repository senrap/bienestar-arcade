import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { WILDCARD_TASK } from '../lib/game.js'
import { play } from '../lib/audio.js'

/**
 * El bypass sin culpa: una micro-tarea de 10 segundos que protege el nivel
 * cuando el dia vino imposible.
 */
export default function WildcardModal({ onClose, onComplete }) {
  const [phase, setPhase] = useState('intro') // intro | breathing | done
  const [left, setLeft] = useState(WILDCARD_TASK.seconds)

  useEffect(() => {
    if (phase !== 'breathing') return
    if (left <= 0) {
      setPhase('done')
      play('win', [20, 40, 20])
      return
    }
    const id = setTimeout(() => {
      setLeft((n) => n - 1)
      if (left % 3 === 0) play('breathe', 0)
    }, 1000)
    return () => clearTimeout(id)
  }, [phase, left])

  return (
    <Modal onClose={onClose} label="Comodín" dismissable={phase !== 'breathing'}>
      <p className="eyebrow text-lilac">Comodín</p>

      {phase === 'intro' && (
        <>
          <h2 className="mt-1 text-lg font-bold text-paper">{WILDCARD_TASK.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {WILDCARD_TASK.desc} Sirve para los días que salieron mal: el árbol no retrocede y las
            misiones de hoy quedan como estén.
          </p>
          <button
            type="button"
            onClick={() => {
              play('select')
              setPhase('breathing')
            }}
            className="control mt-6 w-full"
            style={{ '--ctrl-c': '#9d8df1' }}
          >
            Empezar · {WILDCARD_TASK.seconds}s
          </button>
        </>
      )}

      {phase === 'breathing' && (
        <div className="py-8 text-center">
          <div className="animate-pulse-soft mx-auto flex size-28 items-center justify-center rounded-full border-2 border-lilac">
            <span className="font-display text-3xl font-bold tabular-nums text-lilac">{left}</span>
          </div>
          <p className="mt-6 text-base text-paper">
            {left > 6 ? 'Inhalá despacio…' : left > 3 ? 'Sostené…' : 'Soltá todo el aire.'}
          </p>
        </div>
      )}

      {phase === 'done' && (
        <div className="py-3 text-center">
          <h2 className="mt-1 text-lg font-bold text-mint">Nivel protegido</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Tres respiraciones y listo. +{WILDCARD_TASK.pts} pts y el día cuenta igual. Sin culpa.
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="control mt-6 w-full"
            style={{ '--ctrl-c': '#6ecf97' }}
          >
            Continuar
          </button>
        </div>
      )}
    </Modal>
  )
}
