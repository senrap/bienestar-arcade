import { useCallback, useState } from 'react'
import AppShell from './components/AppShell.jsx'
import ControlBar from './components/ControlBar.jsx'
import AttractScreen from './components/AttractScreen.jsx'
import SlotReels from './components/SlotReels.jsx'
import MissionPanel from './components/MissionPanel.jsx'
import WildcardModal from './components/WildcardModal.jsx'
import HelpModal from './components/HelpModal.jsx'
import LevelChangeModal from './components/LevelChangeModal.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import AuthModal from './components/AuthModal.jsx'
import { useGame } from './hooks/useGame.js'
import { useAuth } from './hooks/useAuth.js'
import { play } from './lib/audio.js'

export default function App() {
  const { user, enviarCodigo, verificarCodigo, salir } = useAuth()
  const game = useGame(user?.id)
  const { state, level } = game
  const [rolling, setRolling] = useState(false)
  const [wildcardOpen, setWildcardOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [rechargeMode, setRechargeMode] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)

  const playing = state.coinInserted && !rolling
  const canRecharge = playing && state.rerollsLeft > 0 && !state.wildcardUsed

  const insertCoin = useCallback(() => {
    play('coin', [15, 30, 15])
    game.insertCoin()
    setRolling(true)
  }, [game])

  const toggleAt = useCallback(
    (index) => {
      play(state.missions[index]?.done ? 'uncheck' : 'check', 18)
      game.toggle(index)
    },
    [game, state.missions],
  )

  const handleRecharge = useCallback(() => {
    if (!canRecharge) return
    play('select')
    setRechargeMode((r) => !r)
  }, [canRecharge])

  const handlePick = useCallback(
    (index) => {
      play('reroll', 12)
      game.reroll(index)
      setRechargeMode(false)
    },
    [game],
  )

  const handleWildcard = useCallback(() => {
    if (!playing || state.wildcardUsed) return
    play('select')
    setWildcardOpen(true)
  }, [playing, state.wildcardUsed])

  return (
    <AppShell
      user={user}
      sync={game.sync}
      onEntrar={() => {
        play('select')
        setAuthOpen(true)
      }}
      onSalir={salir}
      muted={state.muted}
      onToggleMute={() => {
        game.setMuted(!state.muted)
        if (state.muted) play('blip')
      }}
      controls={
        perfilAbierto ? null : (
        <ControlBar
          rerollsLeft={state.rerollsLeft}
          canRecharge={canRecharge}
          rechargeMode={rechargeMode}
          wildcardUsed={state.wildcardUsed || !playing}
          onRecharge={handleRecharge}
          onWildcard={handleWildcard}
          onHelp={() => {
            play('select')
            setHelpOpen(true)
          }}
        />
        )
      }
    >
      {perfilAbierto ? (
        <ProfilePage
          state={state}
          level={level}
          user={user}
          onVolver={() => {
            play('blip', 8)
            setPerfilAbierto(false)
          }}
        />
      ) : !state.coinInserted ? (
        <AttractScreen state={state} level={level} onInsertCoin={insertCoin} />
      ) : rolling ? (
        <SlotReels missions={state.missions} onDone={() => setRolling(false)} />
      ) : (
        <MissionPanel
          state={state}
          level={level}
          done={game.done}
          dayComplete={game.dayComplete}
          rechargeMode={rechargeMode}
          onToggle={toggleAt}
          onPick={handlePick}
          onAbrirPerfil={() => {
            play('select')
            setPerfilAbierto(true)
          }}
        />
      )}

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

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onEnviar={enviarCodigo}
          onVerificar={verificarCodigo}
        />
      )}

      {state.levelChange && (
        <LevelChangeModal change={state.levelChange} onClose={game.dismissLevelChange} />
      )}
    </AppShell>
  )
}
