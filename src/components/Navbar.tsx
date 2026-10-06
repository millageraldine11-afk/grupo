import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Video, BookOpen, Layers, Award, QrCode, Music, User } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenEmergencySOP: () => void;
  onOpenAppQR: () => void;
  userProfile?: UserProfile;
  onOpenUserModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  isMusicPlaying,
  onToggleMusic,
  onOpenEmergencySOP,
  onOpenAppQR,
  userProfile,
  onOpenUserModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Wordmark in Celeste */}
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('splash');
          }}
          className="text-lg font-black tracking-tight text-white hover:text-sky-300 transition-colors shrink-0 flex items-center gap-2"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200">
            Biosecurity Challenge
          </span>
          <span className="text-[10px] font-mono font-bold text-sky-400/90 uppercase tracking-widest border border-sky-400/40 px-2 py-0.5 rounded-full bg-sky-950/80">
            Estudiantes
          </span>
        </a>

        {/* Zone 2: Navigation Links for Students */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-400">
          <button
            onClick={() => onSelectTab('splash')}
            className={`transition-colors hover:text-white ${
              activeTab === 'splash' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Inicio & Logo
          </button>
          <button
            onClick={() => onSelectTab('levels')}
            className={`transition-colors hover:text-white ${
              activeTab === 'levels' || activeTab === 'challenge' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Niveles & Sectores
          </button>
          <button
            onClick={() => onSelectTab('video_lab')}
            className={`transition-colors hover:text-white ${
              activeTab === 'video_lab' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Video Lab
          </button>
          <button
            onClick={() => onSelectTab('manual')}
            className={`transition-colors hover:text-white ${
              activeTab === 'manual' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => onSelectTab('certificate')}
            className={`transition-colors hover:text-white ${
              activeTab === 'certificate' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Certificado
          </button>
          <button
            onClick={() => onSelectTab('stats')}
            className={`transition-colors hover:text-white ${
              activeTab === 'stats' ? 'text-sky-400 font-bold' : ''
            }`}
          >
            Racha & Rango
          </button>
        </nav>

        {/* Zone 3: Actions in Celeste styling */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Profile Pill */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenUserModal();
            }}
            className="flex items-center gap-2 rounded-2xl border border-sky-400/40 bg-sky-950/70 py-1.5 px-2.5 text-xs font-bold text-sky-200 hover:bg-sky-900/60 hover:text-white transition-all shadow-sm"
            title="Editar perfil de estudiante"
          >
            {userProfile?.avatarUrl ? (
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="h-6 w-6 rounded-lg object-cover border border-sky-400/50"
              />
            ) : (
              <div className="h-6 w-6 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-300">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="max-w-[90px] sm:max-w-[120px] truncate text-left">
              {userProfile?.name || 'Mi Perfil'}
            </span>
          </button>

          {/* Background Ambient Music Button */}
          <button
            onClick={() => {
              sound.playTick();
              onToggleMusic();
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
              isMusicPlaying
                ? 'border-sky-400 bg-sky-950 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title={isMusicPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo ambiental'}
          >
            <Music className={`h-3.5 w-3.5 ${isMusicPlaying ? 'animate-bounce text-sky-400' : ''}`} />
            <span className="hidden sm:inline font-mono text-[11px]">
              {isMusicPlaying ? 'Música: ON' : 'Música'}
            </span>
          </button>

          {/* QR Code App Share Button */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenAppQR();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-950/70 px-3 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-900/60 hover:text-white transition-colors shadow-sm"
            title="Ver código QR para abrir la app en el móvil"
          >
            <QrCode className="h-4 w-4 text-sky-400" />
            <span className="hidden md:inline">QR de la App</span>
          </button>

          {/* Sound mute toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-sky-500/30 bg-slate-900 text-slate-400 hover:text-sky-300 hover:border-sky-400 transition-colors"
            aria-label="Alternar sonido"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-sky-400" />}
          </button>

          {/* Emergency SOS button */}
          <button
            onClick={onOpenEmergencySOP}
            className="flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/60 px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/80 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
