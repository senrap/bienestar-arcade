import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

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

  /** Manda el enlace de acceso al correo. */
  const enviarEnlace = useCallback(async (email) => {
    if (!supabase) throw new Error('No hay backend configurado')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const salir = useCallback(async () => {
    await supabase?.auth.signOut()
  }, [])

  return { session, user: session?.user ?? null, cargando, enviarEnlace, salir }
}
