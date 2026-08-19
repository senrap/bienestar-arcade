import { useEffect, useRef, useState } from 'react'
import PixelSprite from './PixelSprite.jsx'
import { CATEGORIES, CATEGORY_LIST } from '../data/categories.js'
import { play } from '../lib/audio.js'

const TICK_MS = 100
const FIRST_STOP = 550
const STEP = 280

/**
 * Los tres rodillos. Es puro teatro —el sorteo ya ocurrio en el reducer—
 * pero es el guiño arcade que le da sentido a la moneda.
 */
export default function SlotReels({ missions, onDone }) {
  const [frame, setFrame] = useState(0)
  const [stopped, setStopped] = useState(0)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const spin = setInterval(() => {
      setFrame((f) => f + 1)
      play('reel', 0)
    }, TICK_MS)

    const stops = [0, 1, 2].map((i) =>
      setTimeout(() => {
        setStopped(i + 1)
        play('select', 10)
      }, FIRST_STOP + i * STEP),
    )
    const end = setTimeout(() => doneRef.current(), FIRST_STOP + 3 * STEP + 320)

    return () => {
      clearInterval(spin)
      stops.forEach(clearTimeout)
      clearTimeout(end)
    }
  }, [])

  return (
    <section className="panel flex flex-col items-center px-5 py-12">
      <p className="eyebrow text-muted">Sorteando</p>

      <div className="mt-7 flex gap-3">
        {missions.map((mission, i) => {
          const cat =
            stopped > i
              ? CATEGORIES[mission.cat]
              : CATEGORY_LIST[(frame + i * 2) % CATEGORY_LIST.length]
          return (
            <div
              key={i}
              className="flex size-20 items-center justify-center rounded-xl border transition-colors sm:size-24"
              style={{
                borderColor: stopped > i ? cat.color : '#2f2b55',
                background: stopped > i ? `${cat.color}14` : 'transparent',
              }}
            >
              <PixelSprite
                sprite={cat.sprite}
                scale={2.5}
                className={stopped > i ? 'animate-rise' : 'animate-reel'}
              />
            </div>
          )
        })}
      </div>

      <p className="mt-7 text-sm text-muted">
        {stopped < 3 ? 'La máquina está eligiendo por vos…' : 'Listo. Ahí van tus 3 misiones.'}
      </p>
    </section>
  )
}
