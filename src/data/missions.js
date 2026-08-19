/**
 * Pool de misiones diarias. Cada dia se sortean 3, siempre de categorias
 * distintas, para que el dia tenga variedad y no tres sentadillas seguidas.
 *
 * mins = duracion estimada (1 a 5 minutos)
 * pts  = puntaje al completarla
 */
export const MISSIONS = [
  // --- MOVIMIENTO DISRUPTIVO ---
  { id: 'mov-01', cat: 'movimiento', title: '15 sentadillas rebeldes', desc: 'Hacelas en un lugar inusual: el pasillo, el ascensor, atrás de la puerta de la oficina.', mins: 2, pts: 20 },
  { id: 'mov-02', cat: 'movimiento', title: 'Escalera en modo turbo', desc: 'Subí o bajá un piso completo por escalera, aunque el ascensor te esté esperando abierto.', mins: 3, pts: 20 },
  { id: 'mov-03', cat: 'movimiento', title: 'Baile de un tema', desc: 'Poné una canción y movete como si nadie te viera. Bonus si alguien te ve.', mins: 3, pts: 25 },
  { id: 'mov-04', cat: 'movimiento', title: 'Llamada caminando', desc: 'La próxima llamada la atendés de pie y caminando. Nada de silla.', mins: 5, pts: 20 },
  { id: 'mov-05', cat: 'movimiento', title: '10 elevaciones de talón', desc: 'Mientras se calienta el agua, la impresora imprime o el mail carga.', mins: 1, pts: 15 },
  { id: 'mov-06', cat: 'movimiento', title: 'Estirar como gato', desc: 'Manos al techo, dedos bien largos, y después tocate las puntas de los pies.', mins: 2, pts: 15 },
  { id: 'mov-07', cat: 'movimiento', title: 'Plancha de 30 segundos', desc: 'Donde estés. Si te tiembla todo, ganaste igual.', mins: 1, pts: 20 },
  { id: 'mov-08', cat: 'movimiento', title: 'La vuelta manzana corta', desc: 'Salí a la calle y caminá 5 minutos sin destino ni objetivo productivo.', mins: 5, pts: 25 },

  // --- SALUD OCULAR ---
  { id: 'ocu-01', cat: 'ocular', title: 'Desbloqueo a 6 metros', desc: 'Mirá un punto lejano durante 2 minutos. La pantalla puede esperar.', mins: 2, pts: 20 },
  { id: 'ocu-02', cat: 'ocular', title: 'Regla 20-20-20', desc: 'Cada 20 minutos, 20 segundos mirando algo a 20 pies. Hacelo 3 veces seguidas.', mins: 2, pts: 20 },
  { id: 'ocu-03', cat: 'ocular', title: 'Palmeo oscuro', desc: 'Tapate los ojos con las palmas, sin apretar, y quedate en negro absoluto 60 segundos.', mins: 1, pts: 15 },
  { id: 'ocu-04', cat: 'ocular', title: 'Parpadeo consciente', desc: '20 parpadeos lentos y completos. Estuviste con los ojos secos toda la mañana.', mins: 1, pts: 15 },
  { id: 'ocu-05', cat: 'ocular', title: 'Infinito con los ojos', desc: 'Dibujá un 8 acostado en el aire moviendo solo los ojos. Cinco vueltas para cada lado.', mins: 2, pts: 15 },
  { id: 'ocu-06', cat: 'ocular', title: 'Caza de verde', desc: 'Buscá algo verde y vivo —planta, árbol, pasto— y miralo fijo 90 segundos.', mins: 2, pts: 20 },
  { id: 'ocu-07', cat: 'ocular', title: 'Brillo al mínimo', desc: 'Bajá el brillo de todas tus pantallas un escalón y dejalo así el resto del día.', mins: 1, pts: 15 },
  { id: 'ocu-08', cat: 'ocular', title: 'Enfoque cerca y lejos', desc: 'Pulgar a 20 cm, ventana al fondo. Alterná el foco 10 veces.', mins: 2, pts: 15 },

  // --- NUTRICION ALEGRE ---
  { id: 'nut-01', cat: 'nutricion', title: 'Agua con limón primero', desc: 'Un vaso de agua con limón antes del primer café del día. El café llega después.', mins: 2, pts: 20 },
  { id: 'nut-02', cat: 'nutricion', title: 'Vaso antes de la pantalla', desc: 'Tomá un vaso entero de agua antes de volver a mirar el teléfono.', mins: 1, pts: 15 },
  { id: 'nut-03', cat: 'nutricion', title: 'Bocado a ciegas', desc: 'Comé un bocado con los ojos cerrados, masticando 20 veces. Se siente raro. Es la idea.', mins: 2, pts: 20 },
  { id: 'nut-04', cat: 'nutricion', title: 'Fruta de contrabando', desc: 'Metele una fruta a un momento donde normalmente irían galletitas.', mins: 3, pts: 20 },
  { id: 'nut-05', cat: 'nutricion', title: 'Almuerzo sin pantalla', desc: 'Cinco minutos de comida sin celular, sin mail, sin serie. Solo la comida.', mins: 5, pts: 25 },
  { id: 'nut-06', cat: 'nutricion', title: 'Un color nuevo al plato', desc: 'Sumale al plato algo de un color que hoy todavía no comiste.', mins: 3, pts: 20 },
  { id: 'nut-07', cat: 'nutricion', title: 'Infusión lenta', desc: 'Prepará un té o un mate y tomate los primeros 3 minutos sin hacer nada más.', mins: 3, pts: 20 },
  { id: 'nut-08', cat: 'nutricion', title: 'Medio vaso extra', desc: 'Cada vez que pases por la cocina hoy, medio vaso de agua. Mínimo tres veces.', mins: 2, pts: 15 },

  // --- DIGITAL DETOX ---
  { id: 'det-01', cat: 'detox', title: 'Modo cueva por 20 minutos', desc: 'Modo avión o no molestar durante 20 minutos. El mundo sobrevive.', mins: 5, pts: 25 },
  { id: 'det-02', cat: 'detox', title: 'Teléfono en otra habitación', desc: 'Dejalo lejos 15 minutos mientras hacés otra cosa. Que camine el que quiera revisarlo.', mins: 5, pts: 25 },
  { id: 'det-03', cat: 'detox', title: 'Caza de notificaciones', desc: 'Apagá las notificaciones de 3 apps que no las necesitan. Para siempre.', mins: 3, pts: 25 },
  { id: 'det-04', cat: 'detox', title: 'Escala de grises', desc: 'Poné el celular en blanco y negro por una hora. Aburre lindo.', mins: 2, pts: 20 },
  { id: 'det-05', cat: 'detox', title: 'Cero scroll en la fila', desc: 'La próxima espera —fila, ascensor, colectivo— la hacés sin sacar el teléfono.', mins: 3, pts: 20 },
  { id: 'det-06', cat: 'detox', title: 'Cierre de pestañas', desc: 'Cerrá todas las pestañas abiertas menos una. Sí, todas.', mins: 2, pts: 15 },
  { id: 'det-07', cat: 'detox', title: 'Baño sin pantalla', desc: 'Ir al baño sin llevar el teléfono. Clásico subestimado.', mins: 3, pts: 15 },
  { id: 'det-08', cat: 'detox', title: 'Primera hora limpia', desc: 'Ni mail ni redes durante los primeros 20 minutos después de despertarte.', mins: 5, pts: 25 },

  // --- PRESENCIA / SENSORIAL ---
  { id: 'pre-01', cat: 'presencia', title: 'Descalzo sobre el piso frío', desc: 'Sacate los zapatos y quedate parado sobre el piso frío 60 segundos. Sentí la temperatura.', mins: 1, pts: 20 },
  { id: 'pre-02', cat: 'presencia', title: 'Agua fría en las muñecas', desc: 'Treinta segundos de agua fría en las muñecas y la nuca. Reinicio instantáneo.', mins: 1, pts: 15 },
  { id: 'pre-03', cat: 'presencia', title: 'Inventario 5-4-3-2-1', desc: '5 cosas que ves, 4 que escuchás, 3 que tocás, 2 que olés, 1 que saboreás.', mins: 3, pts: 25 },
  { id: 'pre-04', cat: 'presencia', title: 'Respiración 4-7-8', desc: 'Inhalá 4, sostené 7, exhalá 8. Cuatro rondas completas.', mins: 3, pts: 20 },
  { id: 'pre-05', cat: 'presencia', title: 'Sol o viento en la cara', desc: 'Salí afuera y quedate 2 minutos con el sol o el viento dándote en la cara.', mins: 2, pts: 20 },
  { id: 'pre-06', cat: 'presencia', title: 'Mapa de sonidos', desc: 'Ojos cerrados: identificá el sonido más lejano que puedas escuchar.', mins: 2, pts: 15 },
  { id: 'pre-07', cat: 'presencia', title: 'Manos en agua caliente', desc: 'Lavate las manos prestando atención real a la temperatura y la textura del jabón.', mins: 1, pts: 15 },
  { id: 'pre-08', cat: 'presencia', title: 'Un mensaje agradecido', desc: 'Mandale a alguien un mensaje diciéndole algo concreto que le agradecés.', mins: 3, pts: 25 },
]

/** Micro-tarea del Comodin: 10 segundos y el nivel se conserva. */
export const WILDCARD_TASK = {
  id: 'wildcard',
  title: 'Respirá 3 veces',
  desc: 'Tres respiraciones profundas. Nada más. Hoy con eso alcanza.',
  seconds: 10,
  pts: 5,
}

export const MISSIONS_BY_CAT = MISSIONS.reduce((acc, m) => {
  ;(acc[m.cat] ||= []).push(m)
  return acc
}, {})
