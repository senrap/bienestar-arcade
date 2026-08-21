import test from 'node:test'
import assert from 'node:assert/strict'
import { esCodigo, extraerToken, normalizarEntrada, sirveParaEntrar } from '../src/lib/authToken.js'

const ENLACE =
  'https://proyecto.supabase.co/auth/v1/verify?token=pkce_abc123&type=magiclink&redirect_to=https://bienestar-arcade.netlify.app'

test('saca el token de un enlace de acceso', () => {
  assert.deepEqual(extraerToken(ENLACE), { token_hash: 'pkce_abc123', type: 'magiclink' })
})

test('acepta la variante token_hash y el token en el fragmento', () => {
  assert.equal(extraerToken('https://x.co/auth/v1/verify?token_hash=h1&type=email').token_hash, 'h1')
  assert.equal(extraerToken('https://x.co/#token_hash=h2&type=recovery').token_hash, 'h2')
})

test('tolera espacios alrededor del enlace pegado', () => {
  assert.equal(extraerToken(`   ${ENLACE}   `).token_hash, 'pkce_abc123')
})

test('no confunde cualquier cosa con un enlace de acceso', () => {
  for (const basura of ['hola', '', 'http://[', 'https://bienestar-arcade.netlify.app/', '12345']) {
    assert.equal(extraerToken(basura), null, `deberia rechazar ${JSON.stringify(basura)}`)
  }
})

test('un codigo son exactamente seis digitos', () => {
  assert.ok(esCodigo('123456'))
  assert.ok(esCodigo(' 123456 '))
  assert.ok(!esCodigo('12345'))
  assert.ok(!esCodigo('1234567'))
  assert.ok(!esCodigo('12345a'))
})

test('sirveParaEntrar acepta las dos formas y rechaza el resto', () => {
  assert.ok(sirveParaEntrar('123456'))
  assert.ok(sirveParaEntrar(ENLACE))
  assert.ok(!sirveParaEntrar('1234'))
  assert.ok(!sirveParaEntrar('no soy un enlace'))
})

test('normalizar limpia los codigos pero deja intacto el enlace', () => {
  assert.equal(normalizarEntrada('codigo: 12 34 56'), '123456')
  assert.equal(normalizarEntrada('12ab34cd56'), '123456')
  assert.equal(normalizarEntrada('1234567890'), '123456', 'recorta a seis')
  assert.equal(normalizarEntrada(`  ${ENLACE}  `), ENLACE, 'el enlace no se toca')
})
