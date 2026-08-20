import { useCallback, useEffect, useRef, useState } from 'react'
import PixelSprite from './PixelSprite.jsx'
import { HACHE_BLOCK, RUNNER_A, RUNNER_B, RUNNER_JUMP } from '../data/runner.js'
import { play } from '../lib/audio.js'

// La caminata va de -12% a 112%, asi que a la mitad exacta del recorrido el
// personaje queda debajo del bloque, que vive en el 50%.
const WALK_MS = 5000
const HOP_MS = 640
const START_DELAY = 900
const HOP_START = WALK_MS / 2 - HOP_MS / 2
const HIT_AT = WALK_MS / 2

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Firma del pie: un corredor cruza la pantalla, salta, golpea el bloque de
 * HACHE y libera el credito. Si alguien prefiere no ver animaciones, el
 * credito ya esta ahi desde el principio.
 */
export default function HacheFooter() {
  const [running, setRunning] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [bumped, setBumped] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const run = useCallback((withSound) => {
    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }
    clearTimers()
    setRunning(false)
    setJumping(false)

    // Un frame de pausa para que el navegador reinicie las animaciones CSS.
    timers.current.push(
      setTimeout(() => {
        setRunning(true)
        timers.current.push(setTimeout(() => setJumping(true), HOP_START))
        timers.current.push(
          setTimeout(() => {
            setRevealed(true)
            setBumped(true)
            if (withSound) play('coin', 12)
          }, HIT_AT),
        )
        timers.current.push(setTimeout(() => setBumped(false), HIT_AT + 260))
        timers.current.push(setTimeout(() => setJumping(false), HOP_START + HOP_MS))
        timers.current.push(setTimeout(() => setRunning(false), WALK_MS))
      }, 40),
    )
  }, [])

  useEffect(() => {
    // La primera vuelta arranca sola y en silencio: el audio necesita un gesto
    // del usuario y nadie quiere que una web suene sin que se la toque.
    const id = setTimeout(() => run(false), START_DELAY)
    return () => {
      clearTimeout(id)
      clearTimers()
    }
  }, [run])

  const frame = jumping ? RUNNER_JUMP : running ? RUNNER_A : RUNNER_B

  return (
    <footer className="relative mt-2 h-28 select-none">
      {/* El piso */}
      <div className="absolute inset-x-0 bottom-9 h-px bg-ink-700" aria-hidden="true" />

      {/* El bloque: tocarlo repite la corrida */}
      <button
        type="button"
        onClick={() => run(true)}
        aria-label="Repetir la animación del pie"
        className={`absolute bottom-[78px] left-1/2 -translate-x-1/2 rounded ${
          bumped ? 'animate-bump' : revealed ? '' : 'animate-pulse-soft'
        }`}
      >
        <PixelSprite sprite={HACHE_BLOCK} scale={1.5} />
      </button>

      {/* El corredor */}
      {running && (
        <div
          className="absolute bottom-[34px] h-6 w-6"
          style={{ marginLeft: -12, animation: `hache-walk ${WALK_MS}ms linear 1 forwards` }}
          aria-hidden="true"
        >
          <div style={jumping ? { animation: `hache-hop ${HOP_MS}ms ease-out 1` } : undefined}>
            <PixelSprite sprite={frame} scale={1.5} className={jumping ? '' : 'animate-step'} />
          </div>
        </div>
      )}

      {/* El credito */}
      <p
        className={`absolute inset-x-0 bottom-0 text-center transition-all duration-500 ${
          revealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
      >
        <a
          href="https://www.hacheconsultora.com"
          target="_blank"
          rel="noopener noreferrer"
          onFocus={() => setRevealed(true)}
          className="text-xs text-muted transition-colors hover:text-gold"
        >
          Desarrollado por <span className="font-semibold text-gold">Consultora HACHE</span>
        </a>
      </p>
    </footer>
  )
}
