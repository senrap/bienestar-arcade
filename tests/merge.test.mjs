import test from 'node:test'
import assert from 'node:assert/strict'
import { merge, mergeHistory } from '../src/lib/merge.js'

const arbol = (over = {}) => ({
  level: 0, levelProgress: 0, daysAtTop: 0,
  points: 0, totalCompleted: 0, streak: 0, bestStreak: 0,
  lastComboDay: null, history: {},
  ...over,
})

test('sin nada en la nube, queda lo local', () => {
  const local = arbol({ level: 2, points: 300 })
  assert.deepEqual(merge(local, null), local)
})

test('gana el arbol mas avanzado, no el mas reciente', () => {
  const local = arbol({ level: 1, levelProgress: 2, points: 200 })
  const remoto = arbol({ level: 3, points: 500, totalCompleted: 25 })

  for (const fusion of [merge(local, remoto), merge(remoto, local)]) {
    assert.equal(fusion.level, 3)
    assert.equal(fusion.points, 500)
    assert.equal(fusion.totalCompleted, 25)
  }
})

test('a igual nivel desempata el progreso dentro del nivel', () => {
  const a = arbol({ level: 2, levelProgress: 2, points: 100 })
  const b = arbol({ level: 2, levelProgress: 0, points: 900 })
  assert.equal(merge(a, b).levelProgress, 2)
})

test('las rachas se quedan con el maximo de cada lado', () => {
  const fusion = merge(
    arbol({ streak: 3, bestStreak: 12 }),
    arbol({ streak: 8, bestStreak: 5 }),
  )
  assert.equal(fusion.streak, 8)
  assert.equal(fusion.bestStreak, 12)
})

test('el ultimo dia cumplido es el mas nuevo de los dos', () => {
  const fusion = merge(
    arbol({ lastComboDay: '2026-08-10' }),
    arbol({ lastComboDay: '2026-08-19' }),
  )
  assert.equal(fusion.lastComboDay, '2026-08-19')
})

test('el historial se une quedandose con el mejor resultado de cada dia', () => {
  const local = { '2026-08-18': { done: 1, total: 3, wildcard: false, closed: false } }
  const remoto = {
    '2026-08-18': { done: 3, total: 3, wildcard: false, closed: true },
    '2026-08-17': { done: 3, total: 3, wildcard: false, closed: true },
  }
  const h = mergeHistory(local, remoto)
  assert.equal(h['2026-08-18'].closed, true, 'un dia cerrado le gana a uno a medias')
  assert.ok(h['2026-08-17'], 'los dias que solo estaban en la nube se suman')
  assert.equal(Object.keys(h).length, 2)
})

test('un dia cerrado nunca se pisa con uno sin cerrar', () => {
  const cerrado = { '2026-08-18': { done: 3, total: 3, wildcard: false, closed: true } }
  const abierto = { '2026-08-18': { done: 0, total: 3, wildcard: false, closed: false } }
  assert.equal(mergeHistory(cerrado, abierto)['2026-08-18'].closed, true)
})

test('el dia en curso no se toca: las misiones son de este dispositivo', () => {
  const local = arbol({ day: '2026-08-20', missions: [{ id: 'x' }], coinInserted: true })
  const fusion = merge(local, arbol({ level: 5 }))
  assert.equal(fusion.coinInserted, true)
  assert.equal(fusion.missions.length, 1)
})

test('el desglose por categoria se une con el maximo de cada una', () => {
  const fusion = merge(
    arbol({ byCategory: { movimiento: 12, ocular: 3 } }),
    arbol({ byCategory: { movimiento: 8, nutricion: 5 } }),
  )
  assert.equal(fusion.byCategory.movimiento, 12, 'gana el mayor')
  assert.equal(fusion.byCategory.ocular, 3, 'se conserva lo que solo estaba local')
  assert.equal(fusion.byCategory.nutricion, 5, 'se suma lo que solo estaba en la nube')
})
