import React from 'react';
import { Award, Flame, Lock, Unlock, Play, Star, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { BiosecurityLevelId } from '../../types';
import { LEVELS_CONFIG } from '../../data/challengesData';
import { sound } from '../../utils/soundEffects';

interface LevelSelectionViewProps {
  unlockedLevels: BiosecurityLevelId[];
  onSelectLevel: (levelId: BiosecurityLevelId) => void;
  starsTotal: number;
  xpTotal: number;
}

export const LevelSelectionView: React.FC<LevelSelectionViewProps> = ({
  unlockedLevels,
  onSelectLevel,
  starsTotal,
  xpTotal,
}) => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Top Banner with Celeste / Cyan Palette */}
      <div className="mb-8 rounded-3xl border border-sky-500/30 bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-cyan-950/80 p-6 sm:p-8 shadow-[0_0_35px_rgba(14,165,233,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/60 px-3.5 py-1 text-xs font-semibold text-sky-300 backdrop-blur-md mb-2">
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Manual de Bioseguridad · 9 Sectores Temáticos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Niveles y Sectores del Manual
            </h1>
            <p className="mt-1 text-sm text-sky-200/80 max-w-xl">
              Avanza a través de los sectores del manual: desde los conceptos de ambiente seguro y EPP hasta el manejo de derrames biológicos y punzocortantes.
            </p>
          </div>

          {/* Quick Metrics Badge in Celeste style */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-sky-400/30 bg-slate-950/80 px-4 py-2.5 shadow-inner">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Estrellas</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">{starsTotal} ★</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-sky-400/30 bg-slate-950/80 px-4 py-2.5 shadow-inner">
              <Flame className="h-5 w-5 text-sky-400" />
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Safety XP</span>
                <span className="font-mono text-base font-bold text-sky-300 tabular-nums">{xpTotal} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Levels Road Map Cards Grid with Sectors */}
      <div className="space-y-8">
        {LEVELS_CONFIG.map((lvl) => {
          const isUnlocked = unlockedLevels.includes(lvl.id);

          return (
            <div
              key={lvl.id}
              className={`relative rounded-3xl border transition-all duration-300 p-6 sm:p-8 shadow-xl ${
                isUnlocked
                  ? 'border-sky-500/40 bg-slate-900/90 hover:border-sky-400 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]'
                  : 'border-slate-800 bg-slate-950/60 opacity-60'
              }`}
            >
              {/* Level Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                      ETAPA 0{lvl.number}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-semibold text-sky-300">
                      3 Sectores Oficiales
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-sky-200 mt-0.5">
                    {lvl.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isUnlocked ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300 border border-sky-500/30">
                        <Unlock className="h-3.5 w-3.5" />
                        Desbloqueado
                      </span>
                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onSelectLevel(lvl.id);
                        }}
                        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg"
                      >
                        <Play className="h-4 w-4 fill-slate-950 text-slate-950" />
                        <span>Jugar Nivel {lvl.number}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 px-3.5 py-1 text-xs font-semibold text-slate-400">
                      <Lock className="h-3.5 w-3.5" />
                      Completa el nivel anterior
                    </span>
                  )}
                </div>
              </div>

              {/* Sectors Grid for this level */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lvl.sectors.map((sector) => (
                  <div
                    key={sector.id}
                    className="rounded-2xl border border-sky-500/20 bg-slate-950/70 p-4 space-y-2 hover:border-sky-400/40 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        SECTOR {sector.number} DEL MANUAL
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {sector.questionsCount} retos
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {sector.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Reward info */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Insignia al Aprobar: <strong className="text-sky-300">{lvl.badgeName}</strong></span>
                <span className="font-mono text-sky-400 font-bold">+300 Safety XP al superar el 75%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
