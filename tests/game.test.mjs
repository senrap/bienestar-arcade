import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DAILY_MISSIONS,
  LEVEL_STEPS,
  MAX_LEVEL,
  bumpCategory,
  closeDay,
  createState,
  demote,
  hydrate,
  isDayComplete,
  levelInfo,
  rerollAt,
  rollMissions,
  rollOverDay,
} from '../src/lib/game.js'
import { daysBetween, previousKey, todayKey } from '../src/lib/date.js'

const allDone = (missions) => missions.map((m) => ({ ...m, done: true }))

/** Cierra `days` dias consecutivos cumplidos, arrancando en `from`. */
function playDays(days, from = '2026-01-01', state = createState(from)) {
  let s = { ...state, day: from }
  for (let i = 0; i < days; i++) {
    s = closeDay({ ...s, missions: allDone(rollMissions()) })
    if (i < days - 1) {
      const next = new Date(2026, 0, 1)
      next.setDate(next.getDate() + i + 1)
      s = rollOverDay(s, todayKey(next))
    }
  }
  return s
}

test('el sorteo diario da 3 misiones de categorias distintas', () => {
  for (let i = 0; i < 200; i++) {
    const missions = rollMissions()
    assert.equal(missions.length, DAILY_MISSIONS)
    assert.equal(new Set(missions.map((m) => m.cat)).size, DAILY_MISSIONS)
    assert.ok(missions.every((m) => m.done === false))
  }
})

test('el re-roll reemplaza la mision elegida y no repite categoria', () => {
  const missions = rollMissions()
  const next = rerollAt(missions, 1)
  assert.notEqual(next[1].id, missions[1].id)
  assert.equal(next[0].id, missions[0].id)
  assert.equal(new Set(next.map((m) => m.cat)).size, DAILY_MISSIONS)
  assert.equal(next[1].done, false)
})

test('el dia se cierra con 3/3 o con el comodin', () => {
  const partial = { ...createState('2026-01-10'), missions: rollMissions() }
  assert.equal(isDayComplete(partial), false)
  assert.equal(isDayComplete({ ...partial, missions: allDone(partial.missions) }), true)
  assert.equal(isDayComplete({ ...partial, wildcardUsed: true }), true)
})

test('la racha encadena dias consecutivos y se corta con un hueco', () => {
  const dos = playDays(2)
  assert.equal(dos.streak, 2)
  assert.equal(dos.bestStreak, 2)
  assert.equal(rollOverDay(dos, '2026-01-05').streak, 0)
})

test('tres dias cumplidos hacen crecer el arbol un nivel', () => {
  const s = playDays(LEVEL_STEPS)
  assert.equal(s.level, 1)
  assert.equal(s.levelProgress, 0)
  assert.deepEqual(s.levelChange, { type: 'up', from: 0, to: 1 })

  const antes = playDays(LEVEL_STEPS - 1)
  assert.equal(antes.level, 0)
  assert.equal(antes.levelProgress, LEVEL_STEPS - 1)
  assert.equal(antes.levelChange, null)
})

test('el comodin cierra el dia pero no hace crecer el arbol', () => {
  const base = createState('2026-01-10')
  const conComodin = closeDay({ ...base, wildcardUsed: true }, { advance: false })
  assert.equal(conComodin.dayClosed, true)
  assert.equal(conComodin.streak, 1)
  assert.equal(conComodin.levelProgress, 0)
  assert.equal(conComodin.level, 0)
})

test('un dia sin cumplir poda un nivel; varios dias podan varios', () => {
  const s = playDays(LEVEL_STEPS * 2) // nivel 2
  assert.equal(s.level, 2)

  const unDia = rollOverDay({ ...s, dayClosed: false, day: '2026-01-06' }, '2026-01-07')
  assert.equal(unDia.level, 1)
  assert.deepEqual(unDia.levelChange, { type: 'down', from: 2, to: 1 })

  const dosDias = rollOverDay({ ...s, dayClosed: false, day: '2026-01-06' }, '2026-01-08')
  assert.equal(dosDias.level, 0)
})

test('el arbol nunca baja de semilla', () => {
  const semilla = { ...createState('2026-01-10'), level: 0 }
  assert.equal(demote(semilla, 5).level, 0)
  assert.equal(demote(semilla, 5).levelChange, null)
})

test('en la cima se cuentan los dias sostenidos', () => {
  const cima = playDays(LEVEL_STEPS * MAX_LEVEL)
  assert.equal(cima.level, MAX_LEVEL)
  assert.equal(cima.daysAtTop, 1)

  const info = levelInfo(cima)
  assert.equal(info.atTop, true)
  assert.equal(info.next, null)

  const unoMas = closeDay({
    ...rollOverDay(cima, '2026-01-16'),
    missions: allDone(rollMissions()),
  })
  assert.equal(unoMas.daysAtTop, 2)
})

test('bajar de la cima reinicia el contador de dias sostenidos', () => {
  const cima = playDays(LEVEL_STEPS * MAX_LEVEL)
  const caido = rollOverDay({ ...cima, dayClosed: false, day: '2026-01-16' }, '2026-01-17')
  assert.equal(caido.level, MAX_LEVEL - 1)
  assert.equal(caido.daysAtTop, 0)
})

test('el cambio de dia archiva el resultado anterior en el historial', () => {
  const dia = playDays(1)
  const siguiente = rollOverDay(dia, '2026-01-02')
  assert.deepEqual(siguiente.history['2026-01-01'], {
    done: DAILY_MISSIONS,
    total: DAILY_MISSIONS,
    wildcard: false,
    closed: true,
  })
  assert.equal(siguiente.missions.length, 0)
  assert.equal(siguiente.coinInserted, false)
  assert.equal(siguiente.rerollsLeft, 1)
})

test('hydrate tolera basura y migra el estado viejo con coleccionables', () => {
  assert.equal(hydrate(null).points, 0)
  assert.equal(hydrate('roto').level, 0)

  const viejo = { day: todayKey(), points: 42, unlocked: ['cactus-gamer'], level: 99 }
  const migrado = hydrate(viejo)
  assert.equal(migrado.points, 42)
  assert.equal(migrado.level, MAX_LEVEL)
  assert.equal(migrado.unlocked, undefined)
})

test('hydrate poda el arbol si el usuario volvio despues de un hueco', () => {
  const ayer = { ...playDays(LEVEL_STEPS), day: previousKey(todayKey()), dayClosed: true }
  assert.equal(hydrate(ayer).level, 1)

  const abandonado = { ...ayer, day: previousKey(previousKey(todayKey())), dayClosed: false }
  assert.equal(hydrate(abandonado).level, 0)
})

test('daysBetween cuenta dias calendario', () => {
  assert.equal(daysBetween('2026-01-01', '2026-01-02'), 1)
  assert.equal(daysBetween('2026-01-01', '2026-01-01'), 0)
  assert.equal(daysBetween('2026-02-28', '2026-03-01'), 1)
})

test('el contador por categoria sube al marcar y baja al desmarcar', () => {
  let c = {}
  c = bumpCategory(c, 'movimiento', 1)
  c = bumpCategory(c, 'movimiento', 1)
  c = bumpCategory(c, 'ocular', 1)
  assert.deepEqual(c, { movimiento: 2, ocular: 1 })

  c = bumpCategory(c, 'movimiento', -1)
  assert.equal(c.movimiento, 1)

  // Nunca baja de cero, aunque llegue un desmarque de mas
  c = bumpCategory(c, 'detox', -1)
  assert.equal(c.detox, 0)
})
