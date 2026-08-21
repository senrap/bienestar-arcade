/**
 * Fusion del progreso local con el de la nube.
 *
 * Regla de oro: nunca perder progreso. Ante la duda gana el arbol mas
 * avanzado, no el mas reciente, porque un reloj mal puesto no deberia podar
 * el arbol de nadie.
 */

/** Cuanto progreso tiene un estado, en orden de importancia. */
const avance = (s) => [
  s.level ?? 0,
  s.levelProgress ?? 0,
  s.daysAtTop ?? 0,
  s.points ?? 0,
  s.totalCompleted ?? 0,
]

function masAvanzado(a, b) {
  const va = avance(a)
  const vb = avance(b)
  for (let i = 0; i < va.length; i++) {
    if (va[i] !== vb[i]) return va[i] > vb[i] ? a : b
  }
  return a
}

/** Une dos historiales quedandose con el mejor resultado de cada fecha. */
export function mergeHistory(local = {}, remote = {}) {
  const history = { ...local }
  for (const [day, entry] of Object.entries(remote)) {
    const actual = history[day]
    if (!actual || (entry.closed && !actual.closed) || entry.done > actual.done) {
      history[day] = entry
    }
  }
  return history
}

/** Une los contadores por categoria quedandose con el mayor de cada una. */
export function mergeCategories(local = {}, remote = {}) {
  const out = { ...local }
  for (const [cat, n] of Object.entries(remote)) {
    out[cat] = Math.max(out[cat] ?? 0, n ?? 0)
  }
  return out
}

export function merge(local, remote) {
  if (!remote) return local
  const ganador = masAvanzado(local, remote)

  return {
    ...local,
    level: ganador.level,
    levelProgress: ganador.levelProgress,
    daysAtTop: ganador.daysAtTop,
    points: ganador.points,
    totalCompleted: ganador.totalCompleted,
    streak: Math.max(local.streak ?? 0, remote.streak ?? 0),
    bestStreak: Math.max(local.bestStreak ?? 0, remote.bestStreak ?? 0),
    lastComboDay: [local.lastComboDay, remote.lastComboDay].filter(Boolean).sort().pop() ?? null,
    history: mergeHistory(local.history, remote.history),
    byCategory: mergeCategories(local.byCategory, remote.byCategory),
  }
}
