import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase.
 *
 * La URL y la clave publicable son publicas por diseno: viajan en cada pedido
 * del navegador y cualquiera puede leerlas del bundle. Lo que protege los datos
 * es RLS en la base, no esconder la clave. Por eso viven aca como valores por
 * defecto y se pueden pisar con variables de entorno.
 */
const URL = import.meta.env?.VITE_SUPABASE_URL || 'https://eogvnrloqwbhyxowhize.supabase.co'
const KEY =
  import.meta.env?.VITE_SUPABASE_KEY || 'sb_publishable_j91QL6riPVsiZBOepH9pjw_jIaVeh2E'

export const supabase =
  URL && KEY
    ? createClient(URL, KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

/** Sin backend configurado la app sigue andando, solo que guarda local. */
export const cloudEnabled = Boolean(supabase)
