import React from 'react';
import { Flame, Award, Shield, CheckCircle, TrendingUp, Sparkles, Star, ArrowRight } from 'lucide-react';
import { StudentStats } from '../../types';

interface GamificationProfileProps {
  stats: StudentStats;
  onGoToLevels: () => void;
}

export const GamificationProfile: React.FC<GamificationProfileProps> = ({
  stats,
  onGoToLevels,
}) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header in Celeste */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sky-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
              Progreso Académico por Niveles
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{stats.code}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl mt-1">
            {stats.name}
          </h1>
          <p className="text-xs text-sky-300 mt-0.5">
            Rango: <span className="text-white font-bold">Operador Bioseguro Certificado</span>
          </p>
        </div>

        <button
          onClick={onGoToLevels}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-3 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Explorar los 3 Niveles</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Metrics Row in Celeste theme */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <Star className="h-4 w-4 fill-sky-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Estrellas</span>
          </div>
          <p className="font-mono text-2xl font-black text-white tabular-nums">
            {stats.starsTotal} <span className="text-xs font-normal text-slate-400">★</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rendimiento en retos</span>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
          <div className="flex items-center gap-2 text-cyan-400 mb-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Safety XP</span>
          </div>
          <p className="font-mono text-2xl font-black text-sky-300 tabular-nums">
            {stats.xp} <span className="text-xs font-normal text-slate-400">pts</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">+300 por nivel completado</span>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-1">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Racha Activa</span>
          </div>
          <p className="font-mono text-2xl font-black text-white tabular-nums">
            {stats.streak} <span className="text-xs font-normal text-slate-400">días</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Entrenando a diario</span>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-slate-900/70 p-4">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Niveles Libres</span>
          </div>
          <p className="font-mono text-2xl font-black text-sky-400 tabular-nums">
            {stats.unlockedLevels.length} / 3
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Básico, Intermedio...</span>
        </div>
      </div>

      {/* Badges and Competencies */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Badges Showcase */}
        <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Insignias Ganadas por Nivel</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {stats.badges.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-2xl border p-3.5 transition-all flex items-center justify-between ${
                  badge.unlocked
                    ? 'border-sky-400/40 bg-sky-950/30'
                    : 'border-slate-800 bg-slate-950/40 opacity-40'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                  <p className="text-xs text-sky-200/80 leading-tight mt-0.5">{badge.description}</p>
                </div>
                {badge.unlocked ? (
                  <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300 border border-sky-400/30 shrink-0 ml-2">
                    Desbloqueada
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                    Bloqueada
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Competency Mastery Bars */}
        <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-6">
          <h3 className="text-base font-bold text-white mb-4">
            Dominio de Protocolos del Manual de Bioseguridad
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Nivel 1: EPP & Lavado 120s</span>
                <span className="font-mono text-sky-400 font-bold">100%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Nivel 2: Punzocortantes & Centrífugas</span>
                <span className="font-mono text-cyan-400 font-bold">85%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Nivel 3: Derrames Críticos & Autoclave</span>
                <span className="font-mono text-blue-400 font-bold">60%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
