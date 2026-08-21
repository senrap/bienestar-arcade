import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { esCodigo, extraerToken } from '../lib/authToken.js'

/**
 * Sesion de Supabase. Sin backend configurado devuelve una sesion nula y la
 * app funciona igual, guardando solo en este dispositivo.
 */
export function useAuth() {
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return
    let vivo = true

    supabase.auth.getSession().then(({ data }) => {
      if (!vivo) return
      setSession(data.session)
      setCargando(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => {
      setSession(s)
      setCargando(false)
    })

    return () => {
      vivo = false
      sub.subscription.unsubscribe()
    }
  }, [])

  /**
   * Manda el codigo de acceso al correo.
   *
   * El mismo correo lleva un codigo de 6 digitos y un enlace. El codigo es lo
   * que importa: una app instalada en el telefono tiene su propio almacenamiento,
   * separado del navegador, asi que si el enlace se abre en Safari la sesion
   * queda ahi y la app fijada sigue deslogueada. Con el codigo, el ingreso pasa
   * entero adentro de la app.
   */
  const enviarCodigo = useCallback(async (email) => {
    if (!supabase) throw new Error('No hay backend configurado')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  /**
   * Canjea por una sesion lo que haya llegado al correo, sin salir de la app:
   * puede ser un codigo de 6 digitos o el enlace entero pegado.
   */
  const verificarCodigo = useCallback(async (email, valor) => {
    if (!supabase) throw new Error('No hay backend configurado')

    const desdeEnlace = extraerToken(valor)
    const { error } = desdeEnlace
      ? await supabase.auth.verifyOtp(desdeEnlace)
      : await supabase.auth.verifyOtp({
          email: email.trim(),
          token: String(valor).trim(),
          type: 'email',
        })
    if (error) throw error
  }, [])

  const salir = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return { session, user: session?.user ?? null, cargando, enviarCodigo, verificarCodigo, salir }
}
