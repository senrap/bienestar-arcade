import Modal from './Modal.jsx'
import { DAILY_MISSIONS, LEVELS, LEVEL_STEPS, WILDCARD_TASK } from '../lib/game.js'

const RULES = [
  ['Cada día', `La máquina sortea ${DAILY_MISSIONS} misiones de 1 a 5 minutos, una por categoría.`],
  ['Recargar', 'Una vez por día podés cambiar una misión que hoy no te sirve.'],
  ['Comodín', `Si el día vino imposible: ${WILDCARD_TASK.seconds} segundos de respiración y el nivel queda protegido.`],
  ['Subir', `${LEVEL_STEPS} días cumplidos hacen crecer el árbol un nivel.`],
  ['Bajar', 'Cada día que dejás pasar sin cumplir poda un nivel. Nunca baja de semilla.'],
  ['En el teléfono', 'Se puede instalar como app: queda con su ícono y funciona sin conexión.'],
]

/** Las reglas, en una pantalla. */
export default function HelpModal({ onClose }) {
  return (
    <Modal onClose={onClose} label="Cómo funciona">
      <p className="eyebrow text-muted">Cómo funciona</p>
      <h2 className="mt-1 text-lg font-bold text-paper">De semilla a árbol fuerte</h2>

      <dl className="mt-5 flex flex-col gap-3.5">
        {RULES.map(([key, text]) => (
          <div key={key}>
            <dt className="text-sm font-semibold text-aqua">{key}</dt>
            <dd className="mt-0.5 text-sm leading-snug text-muted">{text}</dd>
          </div>
        ))}
      </dl>

      <ol className="mt-6 flex flex-wrap gap-x-2 gap-y-1 border-t border-ink-700 pt-4 text-xs text-muted">
        {LEVELS.map((l, i) => (
          <li key={l.id} className="flex items-center gap-2">
            <span style={{ color: l.color }}>{l.name}</span>
            {i < LEVELS.length - 1 && <span aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>

      <p className="mt-5 text-xs leading-snug text-muted/70">
        Todo se guarda en este dispositivo. Sin cuentas y sin servidores.
      </p>
    </Modal>
  )
}
