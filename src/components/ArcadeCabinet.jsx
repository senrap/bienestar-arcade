import { CirclePlay, HelpCircle, LayoutList, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { CabinetButton, ControlDeck, ControlPanel } from './CabinetControls.jsx'

/**
 * El mueble completo: marquesina iluminada, laterales de madera con parlantes
 * y botonera, el tubo en el medio y el tablero de joysticks abajo.
 */
export default function ArcadeCabinet({
  children,
  playing,
  muted,
  rerollsLeft,
  rechargeMode,
  wildcardUsed,
  onStart,
  onMenu,
  onRecharge,
  onWildcard,
  onToggleMute,
  onHelp,
  onMove,
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-2 py-4 sm:px-4 sm:py-8">
      <div className="wood rounded-3xl p-3 shadow-[0_28px_60px_-20px_rgba(0,0,0,0.9)] sm:p-5">
        {/* --- MARQUESINA --- */}
        <div className="relative mb-4 rounded-2xl border-4 border-crt-700 bg-crt-900 px-4 py-5 text-center sm:py-6">
          <div
            className="box-glow absolute inset-0 rounded-2xl opacity-50"
            style={{ '--glow-c': '#ff007f' }}
            aria-hidden="true"
          />
          <h1 className="marquee-title relative font-pixel text-lg leading-8 sm:text-3xl sm:leading-12">
            BIENESTAR ARCADE
          </h1>
          <p className="relative mt-3 font-label text-[10px] tracking-[0.3em] text-neon-cyan text-glow-soft sm:text-xs">
            HABITOS TRAVIESOS DIARIOS
          </p>
        </div>

        {/* --- LATERALES + TUBO --- */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-4">
          <ControlPanel className="order-2 lg:order-1">
            <CabinetButton
              icon={CirclePlay}
              label="START"
              color="#39ff14"
              shadow="#187a08"
              onClick={onStart}
              title={playing ? 'Marcar la misión apuntada' : 'Insertar moneda y sortear las misiones'}
            />
            <CabinetButton
              icon={LayoutList}
              label="MENU"
              color="#00f0ff"
              shadow="#045f66"
              onClick={onMenu}
              title="Abrir la colección de sprites"
            />
            <CabinetButton
              icon={RotateCcw}
              label="RECARGAR"
              color="#ff7b00"
              shadow="#7a3a00"
              count={rerollsLeft}
              onClick={onRecharge}
              disabled={!playing || rerollsLeft <= 0 || wildcardUsed}
              title={
                rechargeMode
                  ? 'Elegí qué misión cambiar'
                  : 'Cambiar una misión que hoy no podés hacer'
              }
            />
          </ControlPanel>

          {/* Bisel del tubo */}
          <div
            className="pixel-frame-thick order-1 self-start bg-crt-700 p-3 lg:order-2 lg:p-4"
            style={{ '--frame-c': '#00f0ff' }}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="flex gap-1.5" aria-hidden="true">
                <i className="block size-2 bg-neon-magenta" />
                <i className="block size-2 bg-neon-yellow" />
                <i className="block size-2 bg-neon-lime" />
              </span>
              <span className="font-label text-[9px] tracking-[0.3em] text-neon-cyan/70">
                MODEL BA-1986
              </span>
            </div>
            {children}
          </div>

          <ControlPanel className="order-3">
            <CabinetButton
              icon={Sparkles}
              label="COMODIN"
              color="#b76bff"
              shadow="#4a2170"
              onClick={onWildcard}
              disabled={!playing || wildcardUsed}
              title="Bypass de 10 segundos que salva la racha"
            />
            <CabinetButton
              icon={muted ? VolumeX : Volume2}
              label="SONIDO"
              color="#ffe600"
              shadow="#8a7d00"
              onClick={onToggleMute}
              title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            />
            <CabinetButton
              icon={HelpCircle}
              label="AYUDA"
              color="#ff007f"
              shadow="#7a0040"
              onClick={onHelp}
              title="Cómo se juega"
            />
          </ControlPanel>
        </div>

        {/* --- TABLERO INFERIOR --- */}
        <ControlDeck
          onMove={onMove}
          onPrimary={onStart}
          onSecondary={onRecharge}
          primaryLabel={playing ? 'MARCAR' : 'MONEDA'}
          secondaryLabel="RECARGAR"
          disabled={false}
        />
      </div>

      <p className="mt-5 text-center font-label text-[9px] leading-5 tracking-widest text-amber-200/25">
        INSERT COIN · PLAY NICE WITH YOUR BODY · 1986—∞
      </p>
    </div>
  )
}
