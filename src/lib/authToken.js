/**
 * El correo de acceso puede traer un codigo de 6 digitos o un enlace, segun
 * como este configurado el proyecto. Aca se decide que vino y como canjearlo.
 *
 * Aceptar el enlace pegado importa: con el correo que Supabase manda de fabrica
 * no se puede editar la plantilla —pide SMTP propio— asi que el codigo no
 * existe. Pero el enlace lleva el token adentro, y pegarlo en la app permite
 * canjearlo sin salir de ella, que es justo lo que necesita una app instalada
 * en el telefono.
 */

const PARAMETROS = ['token_hash', 'token']

/** Saca el token de un enlace de acceso, venga en la query o en el fragmento. */
export function extraerToken(texto) {
  const limpio = String(texto).trim()
  if (!/^https?:\/\//i.test(limpio)) return null

  let url
  try {
    url = new URL(limpio)
  } catch {
    return null
  }

  // Supabase manda los datos en la query; algunos flujos usan el fragmento.
  const fuentes = [url.searchParams, new URLSearchParams(url.hash.replace(/^#/, ''))]

  for (const fuente of fuentes) {
    for (const clave of PARAMETROS) {
      const valor = fuente.get(clave)
      if (valor) return { token_hash: valor, type: fuente.get('type') || 'email' }
    }
  }
  return null
}

/** Un codigo es una tira de 6 digitos, nada mas. */
export const esCodigo = (texto) => /^\d{6}$/.test(String(texto).trim())

/** Si lo pegado alcanza para intentar entrar. */
export const sirveParaEntrar = (texto) => esCodigo(texto) || Boolean(extraerToken(texto))

/**
 * Normaliza lo que el usuario escribe: los digitos se recortan a 6, pero un
 * enlace se deja intacto para no romperlo.
 */
export function normalizarEntrada(texto) {
  const valor = String(texto)
  if (/https?:\/\//i.test(valor) || /token/i.test(valor)) return valor.trim()
  return valor.replace(/\D/g, '').slice(0, 6)
}
