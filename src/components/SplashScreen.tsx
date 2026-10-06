import React, { useEffect } from 'react';
import { Play, Sparkles, BookOpen, ShieldCheck, Zap, ArrowRight, Video, Flame, Star, QrCode, Smartphone } from 'lucide-react';
import { LAB_IMAGES } from '../data/challengesData';
import { sound } from '../utils/soundEffects';

interface SplashScreenProps {
  onStartLevels: () => void;
  onOpenVideoLab: () => void;
  onOpenManual: () => void;
  onOpenAppQR: () => void;
  studentName?: string;
  onOpenProfile?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onStartLevels,
  onOpenVideoLab,
  onOpenManual,
  onOpenAppQR,
  studentName,
  onOpenProfile,
}) => {
  useEffect(() => {
    sound.playSuccess();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 overflow-hidden bg-radial from-slate-900 via-sky-950/60 to-slate-950">
      {/* Background Celeste & Cyan Ambient Lighting Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-sky-500/25 via-cyan-400/20 to-teal-300/10 rounded-full blur-3xl pointer-events-none animate-pulse-ring" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Box */}
      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        
        {/* Header Kicker in Celeste with Student Greeting */}
        <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/70 px-4 py-1.5 text-xs font-semibold text-sky-200 backdrop-blur-md shadow-lg">
            <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-spin" />
            <span>Manual de Bioseguridad · Ciencias Médicas & Salud</span>
          </div>

          {studentName && (
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/50 bg-sky-900/60 px-3.5 py-1 text-xs font-bold text-white hover:bg-sky-800/80 transition-colors shadow-md"
            >
              <span>👋 Estudiante:</span>
              <span className="text-sky-300 underline underline-offset-2">{studentName}</span>
            </button>
          )}
        </div>

        {/* 3D App Logo Icon Container with Celeste glow */}
        <div className="relative my-4 group">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />
          
          <div className="relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-3xl border-2 border-sky-400/80 bg-slate-950 p-2 shadow-2xl overflow-hidden ring-4 ring-sky-400/25 transform transition-transform hover:scale-105">
            <img
              src={LAB_IMAGES.appLogoBadge}
              alt="Biosecurity Challenge App Logo"
              className="h-full w-full object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* App Title in Celeste Theme */}
        <div className="mt-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            BIOSECURITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-200">CHALLENGE</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono tracking-widest uppercase text-sky-300 font-bold">
            APRENDIZAJE INTERACTIVO POR NIVELES Y SECTORES
          </p>
        </div>

        {/* Dynamic Pitch / Description */}
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
          Supera los <span className="text-sky-300 font-semibold">9 sectores del Manual de Bioseguridad</span> a través de 3 niveles progresivos con imágenes de impacto, micro-videos interactivos y simulaciones de emergencias reales.
        </p>

        {/* Sectors of the Manual Preview Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded-xl border border-sky-400/30 bg-sky-950/60 px-3 py-1.5 font-semibold text-sky-200">
            Nivel 1: Ambiente Seguro · Bioseguridad del Personal · Precauciones
          </span>
          <span className="text-sky-400 font-bold">→</span>
          <span className="rounded-xl border border-cyan-400/30 bg-cyan-950/60 px-3 py-1.5 font-semibold text-cyan-200">
            Nivel 2: Residuos por Colores · Equipos · Desinfección
          </span>
          <span className="text-sky-400 font-bold">→</span>
          <span className="rounded-xl border border-blue-400/30 bg-blue-950/60 px-3 py-1.5 font-semibold text-blue-200">
            Nivel 3: Derrames SOS · Punzocortantes · Incendios
          </span>
        </div>

        {/* Dynamic Action Buttons Grid */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl">
          {/* Main Primary Button: Levels Challenge */}
          <button
            onClick={() => {
              sound.playSuccess();
              onStartLevels();
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-4 text-sm font-extrabold text-slate-950 hover:from-sky-400 hover:to-cyan-300 transition-all shadow-[0_0_25px_rgba(14,165,233,0.4)] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="h-5 w-5 fill-slate-950 text-slate-950" />
            <span>Jugar por Niveles (1, 2 y 3)</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* QR Code Button */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenAppQR();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-sky-400/50 bg-sky-950/80 px-5 py-4 text-sm font-bold text-sky-200 hover:bg-sky-900/60 hover:text-white transition-all shadow-md"
          >
            <QrCode className="h-5 w-5 text-sky-400" />
            <span>QR de la App</span>
          </button>

          {/* Secondary Button: Video Lab */}
          <button
            onClick={() => {
              sound.playTick();
              onOpenVideoLab();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
          >
            <Video className="h-5 w-5 text-cyan-400" />
            <span>Video Lab</span>
          </button>
        </div>

        {/* Medical Students Laboratory Preview Banner */}
        <div className="mt-10 w-full max-w-3xl rounded-3xl border border-sky-500/20 bg-slate-900/70 p-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-left">
            <img
              src={LAB_IMAGES.studentsInLab}
              alt="Estudiantes Universitarios en Práctica de Laboratorio"
              className="h-24 w-full sm:w-36 rounded-2xl object-cover border border-sky-500/30"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Casos Prácticos & Decisiones Visuales</span>
              </div>
              <p className="text-xs text-slate-300">
                Aprende con imágenes reales y videos interactivos: calzado reglamentario, técnica de lavado en 120s, descarte sin reenfundar en guardián al 75% y neutralización de derrames con hipoclorito en espiral perimetral.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
