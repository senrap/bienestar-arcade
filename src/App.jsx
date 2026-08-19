import { useCallback, useEffect, useState } from 'react'
import ArcadeCabinet from './components/ArcadeCabinet.jsx'
import CRTScreen from './components/CRTScreen.jsx'
import AttractScreen from './components/AttractScreen.jsx'
import SlotReels from './components/SlotReels.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import WildcardModal from './components/WildcardModal.jsx'
import UnlockModal from './components/UnlockModal.jsx'
import PetGallery from './components/PetGallery.jsx'
import HelpModal from './components/HelpModal.jsx'
import { useGame } from './hooks/useGame.js'
import { play } from './lib/audio.js'

export default function App() {
  const game = useGame()
  const { state } = game
  const [rolling, setRolling] = useState(false)
  const [wildcardOpen, setWildcardOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [rechargeMode, setRechargeMode] = useState(false)
  const [focused, setFocused] = useState(0)

  const playing = state.coinInserted && !rolling
  const modalOpen = wildcardOpen || galleryOpen || helpOpen || Boolean(game.celebrating)
  const canRecharge = playing && state.rerollsLeft > 0 && !state.wildcardUsed

  // El foco no puede quedar apuntando a una mision que ya no existe.
  useEffect(() => {
    setFocused((f) => Math.min(f, Math.max(0, state.missions.length - 1)))
  }, [state.missions.length])

  const insertCoin = useCallback(() => {
    play('coin', [15, 30, 15])
    play('lever', 0)
    game.insertCoin()
    setFocused(0)
    setRolling(true)
  }, [game])

  const toggleAt = useCallback(
    (index) => {
      play(state.missions[index]?.done ? 'uncheck' : 'check', 18)
      game.toggle(index)
    },
    [game, state.missions],
  )

  // START / boton A: moneda si no arranco el dia, marcar si ya esta en juego.
  const handleStart = useCallback(() => {
    if (!state.coinInserted) return insertCoin()
    if (rolling || state.wildcardUsed) return
    if (rechargeMode) {
      play('error', 10)
      return setRechargeMode(false)
    }
    toggleAt(focused)
  }, [state.coinInserted, state.wildcardUsed, rolling, rechargeMode, focused, insertCoin, toggleAt])

  // RECARGAR / boton B: abre el modo recarga y despues se elige la tarjeta.
  const handleRecharge = useCallback(() => {
    if (!canRecharge) {
      play('error', 25)
      return
    }
    play('select')
    setRechargeMode((r) => !r)
  }, [canRecharge])

  const handlePick = useCallback(
    (index) => {
      play('reroll', 12)
      game.reroll(index)
      setRechargeMode(false)
      setFocused(index)
    },
    [game],
  )

  const handleMove = useCallback(
    (dir) => {
      const total = state.missions.length
      if (!playing || total === 0 || state.wildcardUsed) return
      play('blip', 8)
      setFocused((f) => (f + dir + total) % total)
    },
    [playing, state.missions.length, state.wildcardUsed],
  )

  const handleWildcard = useCallback(() => {
    if (!playing || state.wildcardUsed) {
      play('error', 25)
      return
    }
    play('select')
    setWildcardOpen(true)
  }, [playing, state.wildcardUsed])

  const openGallery = useCallback(() => {
    play('select')
    setGalleryOpen(true)
  }, [])

  // Controles de teclado, para jugar sin mouse como corresponde a un arcade.
  useEffect(() => {
    const onKey = (e) => {
      if (modalOpen || e.metaKey || e.ctrlKey || e.altKey) return
      const typing = ['INPUT', 'TEXTAREA'].includes(e.target?.tagName)
      if (typing) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          return handleMove(-1)
        case 'ArrowDown':
          e.preventDefault()
          return handleMove(1)
        case 'Enter':
        case ' ':
          // Si el foco esta en un boton, dejamos que el boton haga lo suyo.
          if (document.activeElement !== document.body) return
          e.preventDefault()
          return handleStart()
        case 'r':
        case 'R':
          return handleRecharge()
        case 'c':
        case 'C':
          return handleWildcard()
        case 'm':
        case 'M':
          return openGallery()
        case 'h':
        case 'H':
        case '?':
          return setHelpOpen(true)
        default:
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modalOpen, handleMove, handleStart, handleRecharge, handleWildcard, openGallery])

  return (
    <main className="min-h-dvh bg-crt-950">
      <ArcadeCabinet
        playing={playing}
        muted={state.muted}
        rerollsLeft={state.rerollsLeft}
        rechargeMode={rechargeMode}
        wildcardUsed={state.wildcardUsed}
        onStart={handleStart}
        onMenu={openGallery}
        onRecharge={handleRecharge}
        onWildcard={handleWildcard}
        onHelp={() => {
          play('select')
          setHelpOpen(true)
        }}
        onToggleMute={() => {
          game.setMuted(!state.muted)
          if (state.muted) play('blip')
        }}
        onMove={handleMove}
      >
        <CRTScreen>
          {!state.coinInserted ? (
            <AttractScreen state={state} onInsertCoin={insertCoin} />
          ) : rolling ? (
            <SlotReels missions={state.missions} onDone={() => setRolling(false)} />
          ) : (
            <MissionPanel
              state={state}
              done={game.done}
              dayComplete={game.dayComplete}
              focused={focused}
              rechargeMode={rechargeMode}
              onToggle={toggleAt}
              onPick={handlePick}
              onOpenGallery={openGallery}
            />
          )}
        </CRTScreen>
      </ArcadeCabinet>

      {wildcardOpen && (
        <WildcardModal
          onClose={() => setWildcardOpen(false)}
          onComplete={() => {
            game.useWildcard()
            setWildcardOpen(false)
            setRechargeMode(false)
          }}
        />
      )}

      {galleryOpen && <PetGallery unlocked={state.unlocked} onClose={() => setGalleryOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {game.celebrating && <UnlockModal pet={game.celebrating} onClose={game.dismissCelebration} />}
    </main>
  )
}
