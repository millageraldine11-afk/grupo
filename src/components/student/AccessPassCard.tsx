import React, { useState } from 'react';
import { Award, ShieldCheck, QrCode, Download, Star, Sparkles, ArrowRight } from 'lucide-react';
import { CertificateBadge } from '../../types';
import { sound } from '../../utils/soundEffects';

interface CertificateCardProps {
  cert: CertificateBadge;
  onBackToLevels: () => void;
}

export const AccessPassCard: React.FC<CertificateCardProps> = ({ cert, onBackToLevels }) => {
  const [downloadNotice, setDownloadNotice] = useState<boolean>(false);

  const handleDownload = () => {
    sound.playSuccess();
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Title */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
          <Sparkles className="h-4 w-4" />
          Acreditación Oficial en Bioseguridad
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Certificado de Competencia Práctica
        </h2>
        <p className="mt-1 text-xs text-sky-200/80">
          Acreditación de dominio de los sectores temáticos según el Manual de Bioseguridad.
        </p>
      </div>

      {/* Holographic Certificate in Celeste Palette */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-sky-400/50 bg-gradient-to-b from-slate-900 via-sky-950/80 to-slate-950 p-6 sm:p-8 shadow-[0_0_35px_rgba(14,165,233,0.25)]">
        {/* Hologram sheen pattern */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

        {/* Certificate Header Band */}
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-400/40">
              <Award className="h-7 w-7 text-sky-400" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-sky-400 font-bold block">
                FACULTAD DE CIENCIAS MÉDICAS & SALUD
              </span>
              <h3 className="text-lg font-black text-white">{cert.levelCompleted}</h3>
            </div>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= cert.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
              />
            ))}
          </div>
        </div>

        {/* Student & Level Info */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Estudiante</span>
            <p className="text-sm font-bold text-white">{cert.studentName}</p>
            <p className="font-mono text-xs text-sky-300">{cert.studentCode}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Nivel Acreditado</span>
            <p className="text-base font-bold text-sky-400 font-mono">Etapa 0{cert.levelNumber}</p>
            <p className="text-xs text-slate-300">Puntaje Obtenido: {cert.score}%</p>
          </div>

          <div className="space-y-1 col-span-2">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Sectores Dominados</span>
            <p className="font-medium text-slate-200">
              {cert.sectorsMastered.join(' · ')}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Fecha de Aprobación</span>
            <p className="font-mono text-xs text-slate-300">{cert.issuedAt}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 uppercase tracking-wider text-[11px]">Estado</span>
            <p className="font-mono text-xs text-sky-400 font-bold">APROBADO CON ÉXITO</p>
          </div>
        </div>

        {/* Verification Token */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-sky-500/20 bg-slate-950/80 p-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-1 shadow-inner">
              <QrCode className="h-14 w-14 text-slate-950" />
            </div>
            <div>
              <span className="font-mono text-[11px] text-slate-400 block uppercase">
                Código Criptográfico de Validación:
              </span>
              <p className="font-mono text-xs font-bold text-sky-400 tracking-wider">
                {cert.qrVerificationToken}
              </p>
              <span className="text-[11px] text-slate-400">
                Aprobado según el Manual de Bioseguridad
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-sky-200 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Guardar</span>
            </button>
            <button
              onClick={onBackToLevels}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-4 py-2 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-md"
            >
              <span>Ver Más Niveles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {downloadNotice && (
          <div className="mt-3 text-center text-xs text-sky-300 animate-pulse font-medium">
            ✓ Certificado digital guardado exitosamente.
          </div>
        )}
      </div>
    </div>
  );
};
