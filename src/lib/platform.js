/**
 * Que navegador y sistema hay del otro lado, solo con el detalle que importa
 * para instalar la app. La deteccion por user agent es imperfecta, asi que se
 * usa unicamente para elegir que instrucciones mostrar, nunca para bloquear.
 */
export function detectarPlataforma() {
  if (typeof navigator === 'undefined') return { tipo: 'escritorio' }

  const ua = navigator.userAgent
  const esIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  // En iPhone, Chrome, Firefox y Edge son Safari por dentro pero NO pueden
  // instalar aplicaciones: solo Safari muestra "Agregar a pantalla de inicio".
  const navegadorAjenoEnIOS = /crios|fxios|edgios|opt\//i.test(ua)

  if (esIOS) return { tipo: navegadorAjenoEnIOS ? 'ios-otro-navegador' : 'ios-safari' }
  if (/android/i.test(ua)) return { tipo: /firefox/i.test(ua) ? 'android-firefox' : 'android' }
  return { tipo: 'escritorio' }
}

/** Si ya se abrio como app instalada, no hay nada que ofrecer. */
export function yaInstalada() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}
