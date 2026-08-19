import Modal from './Modal.jsx'
import { DAILY_MISSIONS, WILDCARD_TASK } from '../lib/game.js'

const CONTROLS = [
  ['START / A', 'Inserta la moneda y, ya en juego, marca la misión apuntada.'],
  ['JOYSTICK ▲▼', 'Cambia la misión apuntada (o las flechas del teclado).'],
  ['RECARGAR / B', 'Una vez por día: cambia una misión que hoy no podés hacer.'],
  ['COMODIN', `Bypass de ${WILDCARD_TASK.seconds} segundos que salva la racha en un mal día.`],
  ['MENU', 'Abre la colección de sprites desbloqueados.'],
]

/** Instrucciones, como el cartel pegado al costado de la maquina. */
export default function HelpModal({ onClose }) {
  return (
    <Modal onClose={onClose} color="#ff007f" label="Cómo se juega">
      <p className="font-label text-[9px] tracking-[0.3em] text-neon-magenta">HOW TO PLAY</p>
      <h2 className="mt-2 font-pixel text-[12px] leading-6 text-white">BIENESTAR ARCADE</h2>

      <p className="mt-4 font-screen text-xl leading-6 text-neon-cyan/90">
        Cada día la máquina sortea {DAILY_MISSIONS} misiones traviesas de 1 a 5 minutos. Las
        cumplís, las marcás y la racha sube. Si el día vino imposible, el comodín te salva sin culpa.
      </p>

      <dl className="mt-5 flex flex-col gap-3">
        {CONTROLS.map(([key, text]) => (
          <div key={key} className="flex gap-3">
            <dt
              className="pixel-frame h-fit shrink-0 bg-crt-950 px-2 py-1 font-label text-[8px] tracking-widest text-neon-yellow"
              style={{ '--frame-c': '#ffe600' }}
            >
              {key}
            </dt>
            <dd className="font-screen text-lg leading-5 text-white/80">{text}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 font-label text-[8px] leading-4 tracking-widest text-white/45">
        TODO SE GUARDA EN ESTE DISPOSITIVO. SIN CUENTAS, SIN SERVIDORES.
      </p>
    </Modal>
  )
}
