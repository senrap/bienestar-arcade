import { useEffect, useMemo, useReducer } from 'react'
import {
  COMBO_BONUS,
  DAILY_MISSIONS,
  STORAGE_KEY,
  closeDay,
  completedCount,
  createState,
  hydrate,
  isDayComplete,
  levelInfo,
  rerollAt,
  rollMissions,
  rollOverDay,
  writeHistory,
  WILDCARD_TASK,
} from '../lib/game.js'
import { todayKey } from '../lib/date.js'
import { play, setMuted } from '../lib/audio.js'

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return hydrate(raw ? JSON.parse(raw) : null)
  } catch {
    return createState()
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'insert-coin': {
      if (state.coinInserted) return state
      return writeHistory({ ...state, coinInserted: true, missions: rollMissions(DAILY_MISSIONS) })
    }

    case 'toggle': {
      const { index } = action
      const target = state.missions[index]
      if (!target || state.wildcardUsed) return state

      const done = !target.done
      const missions = state.missions.map((m, i) => (i === index ? { ...m, done } : m))
      let next = {
        ...state,
        missions,
        points: Math.max(0, state.points + (done ? target.pts : -target.pts)),
        totalCompleted: Math.max(0, state.totalCompleted + (done ? 1 : -1)),
      }

      const all = missions.filter((m) => m.done).length >= DAILY_MISSIONS
      if (all && !next.comboBonusGiven) {
        next = closeDay({ ...next, points: next.points + COMBO_BONUS, comboBonusGiven: true })
      } else if (!all && next.comboBonusGiven) {
        // Se desmarco una mision: se devuelve el bonus, pero el dia ya esta ganado.
        next = { ...next, points: Math.max(0, next.points - COMBO_BONUS), comboBonusGiven: false }
      }

      return writeHistory(next)
    }

    case 'reroll': {
      if (state.rerollsLeft <= 0 || state.wildcardUsed) return state
      const target = state.missions[action.index]
      if (!target || target.done) return state
      return writeHistory({
        ...state,
        missions: rerollAt(state.missions, action.index),
        rerollsLeft: state.rerollsLeft - 1,
      })
    }

    case 'wildcard': {
      if (state.wildcardUsed) return state
      // El comodin protege el nivel pero no hace crecer el arbol.
      return writeHistory(
        closeDay({ ...state, wildcardUsed: true, points: state.points + WILDCARD_TASK.pts }, { advance: false }),
      )
    }

    case 'dismiss-level-change':
      return { ...state, levelChange: null }

    case 'rollover':
      return rollOverDay(state, action.day)

    case 'mute':
      return { ...state, muted: action.value }

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, null, readStorage)

  // Persistencia: LocalStorage alcanza para el MVP.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage bloqueado o lleno: el juego sigue en memoria */
    }
  }, [state])

  useEffect(() => {
    setMuted(state.muted)
  }, [state.muted])

  // Si la app queda abierta y cruza la medianoche, arranca un dia nuevo sola.
  useEffect(() => {
    const tick = () => {
      const day = todayKey()
      if (day !== state.day) dispatch({ type: 'rollover', day })
    }
    const id = setInterval(tick, 30_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [state.day])

  // Subir o bajar de nivel merece su sonido.
  useEffect(() => {
    if (state.levelChange?.type === 'up') play('levelUp', [18, 40, 18, 40, 60])
    if (state.levelChange?.type === 'down') play('levelDown', 40)
  }, [state.levelChange])

  const actions = useMemo(
    () => ({
      insertCoin: () => dispatch({ type: 'insert-coin' }),
      toggle: (index) => dispatch({ type: 'toggle', index }),
      reroll: (index) => dispatch({ type: 'reroll', index }),
      useWildcard: () => dispatch({ type: 'wildcard' }),
      dismissLevelChange: () => dispatch({ type: 'dismiss-level-change' }),
      setMuted: (value) => dispatch({ type: 'mute', value }),
    }),
    [],
  )

  return {
    state,
    done: completedCount(state),
    dayComplete: isDayComplete(state),
    level: levelInfo(state),
    ...actions,
  }
}
