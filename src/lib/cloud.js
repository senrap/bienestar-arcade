import { supabase } from './supabase.js'
import { HISTORY_DAYS } from './game.js'
export { merge } from './merge.js'

/**
 * Puente entre el estado local y la nube.
 *
 * La nube guarda el progreso agregado (el arbol) y el historial de dias, no el
 * dia en curso: las misiones de hoy se sortean en el dispositivo y ahi viven.
 */

const toRow = (state, userId) => ({
  user_id: userId,
  level: state.level,
  level_progress: state.levelProgress,
  days_at_top: state.daysAtTop,
  streak: state.streak,
  best_streak: state.bestStreak,
  points: state.points,
  total_completed: state.totalCompleted,
  by_category: state.byCategory ?? {},
  last_combo_day: state.lastComboDay,
  updated_at: new Date().toISOString(),
})

const fromRow = (row) => ({
  level: row.level,
  levelProgress: row.level_progress,
  daysAtTop: row.days_at_top,
  streak: row.streak,
  bestStreak: row.best_streak,
  points: row.points,
  totalCompleted: row.total_completed,
  byCategory: row.by_category ?? {},
  lastComboDay: row.last_combo_day,
})

/** Baja el progreso y el historial del usuario. */
export async function pull(userId) {
  if (!supabase) return null

  const [{ data: progress, error: e1 }, { data: days, error: e2 }] = await Promise.all([
    supabase.from('progress').select('*').eq('user_id', userId).maybeSingle(),
    supabase
      .from('days')
      .select('*')
      .eq('user_id', userId)
      .order('day', { ascending: false })
      .limit(HISTORY_DAYS),
  ])
  if (e1) throw e1
  if (e2) throw e2
  if (!progress) return null

  const history = {}
  for (const d of days ?? []) {
    history[d.day] = { done: d.done, total: d.total, wildcard: d.wildcard, closed: d.closed }
  }
  return { ...fromRow(progress), history }
}

/** Sube el progreso y el dia en curso. */
export async function push(userId, state) {
  if (!supabase) return
  const hoy = state.history?.[state.day]

  const trabajos = [supabase.from('progress').upsert(toRow(state, userId))]
  if (hoy) {
    trabajos.push(
      supabase.from('days').upsert({
        user_id: userId,
        day: state.day,
        done: hoy.done,
        total: hoy.total,
        wildcard: hoy.wildcard,
        closed: hoy.closed,
      }),
    )
  }

  const resultados = await Promise.all(trabajos)
  const fallo = resultados.find((r) => r.error)
  if (fallo) throw fallo.error
}

/** Sube todo el historial de una: se usa la primera vez que alguien entra. */
export async function pushHistory(userId, history) {
  if (!supabase) return
  const filas = Object.entries(history ?? {}).map(([day, e]) => ({
    user_id: userId,
    day,
    done: e.done,
    total: e.total,
    wildcard: e.wildcard,
    closed: e.closed,
  }))
  if (!filas.length) return
  const { error } = await supabase.from('days').upsert(filas)
  if (error) throw error
}

/** El ranking: solo quienes se anotaron. */
export async function fetchLeaderboard(limit = 20) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('puesto')
    .limit(limit)
  if (error) throw error
  return data ?? []
}

/** Lee el perfil publico del usuario (nombre visible y si esta en el ranking). */
export async function leerPerfil(userId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, emoji, in_ranking')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  return data
}

/** Guarda el nombre visible o la decision de aparecer en el ranking. */
export async function guardarPerfil(userId, cambios) {
  if (!supabase) return
  const { error } = await supabase.from('profiles').update(cambios).eq('id', userId)
  if (error) throw error
}
