import { MISSIONS, MISSIONS_BY_CAT, WILDCARD_TASK } from '../data/missions.js'
import { CATEGORY_LIST } from '../data/categories.js'
import { LEVELS, LEVEL_STEPS, MAX_LEVEL } from '../data/levels.js'
import { daysBetween, previousKey, todayKey } from './date.js'

export const STORAGE_KEY = 'bienestar-arcade:v1'
export const STATE_VERSION = 2
export const DAILY_MISSIONS = 3
export const DAILY_REROLLS = 1
export const COMBO_BONUS = 30
export const HISTORY_DAYS = 30

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

function shuffle(arr) {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Estado limpio: se usa la primera vez y cuando localStorage viene roto. */
export function createState(day = todayKey()) {
  return {
    version: STATE_VERSION,
    day,
    coinInserted: false,
    missions: [],
    rerollsLeft: DAILY_REROLLS,
    wildcardUsed: false,
    dayClosed: false,
    comboBonusGiven: false,
    level: 0,
    levelProgress: 0,
    daysAtTop: 0,
    levelChange: null,
    streak: 0,
    bestStreak: 0,
    points: 0,
    totalCompleted: 0,
    // Misiones cumplidas por categoria: la base del perfil por dimension.
    byCategory: {},
    lastComboDay: null,
    muted: false,
    history: {},
  }
}

/**
 * Sortea las misiones del dia: 3 categorias distintas, una mision de cada una.
 */
export function rollMissions(count = DAILY_MISSIONS) {
  const cats = shuffle(CATEGORY_LIST.map((c) => c.id)).slice(0, count)
  return cats.map((cat) => ({ ...sample(MISSIONS_BY_CAT[cat]), done: false }))
}

/**
 * Reemplaza una mision por otra: primero busca una categoria que hoy no salio,
 * y si no queda ninguna libre cae en otra mision de la misma categoria.
 */
export function rerollAt(missions, index) {
  const current = missions[index]
  const usedCats = new Set(missions.map((m) => m.cat))
  const freeCats = CATEGORY_LIST.map((c) => c.id).filter((c) => !usedCats.has(c))

  const pool = freeCats.length
    ? MISSIONS_BY_CAT[sample(freeCats)]
    : MISSIONS_BY_CAT[current.cat].filter((m) => m.id !== current.id)

  const next = { ...sample(pool.length ? pool : MISSIONS), done: false }
  return missions.map((m, i) => (i === index ? next : m))
}

/** Un dia cuenta como cumplido con 3/3 misiones o con el comodin activado. */
export function isDayComplete(state) {
  return state.wildcardUsed || state.missions.filter((m) => m.done).length >= DAILY_MISSIONS
}

export function completedCount(state) {
  return state.missions.filter((m) => m.done).length
}

/** Suma o resta una mision cumplida en el contador de su categoria. */
export function bumpCategory(byCategory, cat, delta) {
  const actual = byCategory?.[cat] ?? 0
  return { ...byCategory, [cat]: Math.max(0, actual + delta) }
}

/** Info del nivel actual, lista para pintar. */
export function levelInfo(state) {
  const level = LEVELS[state.level] ?? LEVELS[0]
  const atTop = state.level >= MAX_LEVEL
  return {
    ...level,
    index: state.level,
    atTop,
    progress: atTop ? LEVEL_STEPS : state.levelProgress,
    steps: LEVEL_STEPS,
    next: atTop ? null : LEVELS[state.level + 1],
    daysAtTop: state.daysAtTop,
  }
}

/**
 * Cierra el dia. Con las 3 misiones cumplidas el arbol avanza un paso; con el
 * comodin el dia cuenta igual pero solo protege, no hace crecer.
 */
export function closeDay(state, { advance = true } = {}) {
  if (state.dayClosed) return state

  const streak = state.lastComboDay === previousKey(state.day) ? state.streak + 1 : 1
  let { level, levelProgress, daysAtTop } = state
  let levelChange = null

  if (advance) {
    if (level >= MAX_LEVEL) {
      daysAtTop += 1
    } else {
      levelProgress += 1
      if (levelProgress >= LEVEL_STEPS) {
        levelProgress = 0
        level += 1
        levelChange = { type: 'up', from: state.level, to: level }
        if (level >= MAX_LEVEL) daysAtTop = 1
      }
    }
  }

  return {
    ...state,
    dayClosed: true,
    lastComboDay: state.day,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    level,
    levelProgress,
    daysAtTop,
    levelChange,
  }
}

/** Cada dia sin cumplir poda un nivel del arbol. Nunca baja de semilla. */
export function demote(state, missedDays) {
  if (missedDays <= 0 || state.level <= 0) return state
  const level = Math.max(0, state.level - missedDays)
  return {
    ...state,
    level,
    levelProgress: 0,
    daysAtTop: 0,
    levelChange: { type: 'down', from: state.level, to: level },
  }
}

/** Guarda el resultado del dia en el historial y lo recorta a los ultimos 30. */
export function writeHistory(state) {
  const history = {
    ...state.history,
    [state.day]: {
      done: completedCount(state),
      total: DAILY_MISSIONS,
      wildcard: state.wildcardUsed,
      closed: state.dayClosed,
    },
  }
  const keys = Object.keys(history).sort()
  const extra = keys.length - HISTORY_DAYS
  if (extra > 0) keys.slice(0, extra).forEach((k) => delete history[k])
  return { ...state, history }
}

/**
 * Cambio de dia: archiva el dia anterior, poda el arbol por cada dia que quedo
 * sin cumplir (incluidos los dias en los que ni se abrio la app) y reinicia
 * las misiones.
 */
export function rollOverDay(state, day = todayKey()) {
  if (state.day === day) return state

  const archived = writeHistory(state)
  const gap = Math.max(1, daysBetween(state.day, day))
  const missed = (archived.dayClosed ? 0 : 1) + (gap - 1)
  const keepStreak =
    archived.lastComboDay === day || archived.lastComboDay === previousKey(day)

  return {
    ...demote(archived, missed),
    day,
    coinInserted: false,
    missions: [],
    rerollsLeft: DAILY_REROLLS,
    wildcardUsed: false,
    dayClosed: false,
    comboBonusGiven: false,
    streak: keepStreak ? archived.streak : 0,
  }
}

/** Migra/valida lo que haya en localStorage sin tirar el progreso viejo. */
export function hydrate(raw, day = todayKey()) {
  if (!raw || typeof raw !== 'object') return createState(day)
  const base = { ...createState(raw.day || day), ...raw }
  base.missions = Array.isArray(base.missions) ? base.missions : []
  base.history = base.history && typeof base.history === 'object' ? base.history : {}
  base.byCategory =
    base.byCategory && typeof base.byCategory === 'object' ? base.byCategory : {}
  base.level = Math.min(MAX_LEVEL, Math.max(0, Number(base.level) || 0))
  base.levelProgress = Math.min(LEVEL_STEPS - 1, Math.max(0, Number(base.levelProgress) || 0))
  base.daysAtTop = Math.max(0, Number(base.daysAtTop) || 0)
  base.version = STATE_VERSION
  delete base.unlocked
  return rollOverDay(base, day)
}

export { LEVELS, LEVEL_STEPS, MAX_LEVEL, WILDCARD_TASK }
