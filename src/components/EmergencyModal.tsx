import React, { useState } from 'react';
import { X, ShieldAlert, Droplets, Syringe, Eye, RotateCcw, AlertOctagon } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'spill' | 'puncture' | 'splash' | 'centrifuge'>('spill');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-rose-900/60 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-900/40 bg-rose-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Guía de Emergencia Inmediata en Laboratorio</h3>
              <p className="text-xs text-rose-300/80">Acciones críticas estandarizadas del Manual de Bioseguridad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-2 gap-1 text-xs font-medium">
          <button
            onClick={() => {
              setActiveTab('spill');
              sound.playTick();
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'spill'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="h-4 w-4" />
            Derrame Biológico
          </button>
          <button
            onClick={() => {
              setActiveTab('puncture');
              sound.playTick();
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'puncture'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Syringe className="h-4 w-4" />
            Pinchazo Accidental
          </button>
          <button
            onClick={() => {
              setActiveTab('splash');
              sound.playTick();
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'splash'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="h-4 w-4" />
            Salpicadura Ocular
          </button>
          <button
            onClick={() => {
              setActiveTab('centrifuge');
              sound.playTick();
            }}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
              activeTab === 'centrifuge'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="h-4 w-4" />
            Centrífuga Rota
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 text-sm text-slate-300 space-y-4">
          {activeTab === 'spill' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-rose-900/30 bg-rose-950/20 p-3">
                <AlertOctagon className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-rose-200">Protocolo de Derrame de Muestra Infecciosa</h4>
                  <p className="text-xs text-rose-300/80 mt-0.5">No intentes secar con papel toalla seco directamente.</p>
                </div>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-xs leading-relaxed text-slate-300">
                <li><strong className="text-white">Avisar en voz alta</strong> a los compañeros de mesa para evitar tránsito y pisadas.</li>
                <li><strong className="text-white">Cubrir el derrame con papel toalla absorbente</strong> para fijar el líquido y contener salpicaduras.</li>
                <li><strong className="text-white">Verter Hipoclorito de Sodio al 1%</strong> o desinfectante fenólico en espiral, desde la periferia hacia el centro.</li>
                <li><strong className="text-white">Esperar 20 a 30 minutos cronometrados</strong> de tiempo de contacto biocida.</li>
                <li><strong className="text-white">Recoger con pinzas o pala</strong> (nunca con las manos directamente) y descartar en bolsa roja de biocontaminados.</li>
              </ol>
            </div>
          )}

          {activeTab === 'puncture' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-amber-900/30 bg-amber-950/20 p-3">
                <AlertOctagon className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-200">Protocolo de Exposición Accidental Punzocortante</h4>
                  <p className="text-xs text-amber-300/80 mt-0.5">Acción en los primeros 60 segundos.</p>
                </div>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-xs leading-relaxed text-slate-300">
                <li><strong className="text-white">Retirar el guante</strong> con cuidado sin diseminar sangre externa.</li>
                <li><strong className="text-white">Promover el sangrado libre</strong> bajo agua corriente tibia. <span className="text-rose-400 font-semibold">NO comprimir bruscamente ni chupar la herida</span>.</li>
                <li><strong className="text-white">Lavar abundantemente con agua y jabón desinfectante</strong> durante 3 a 5 minutos.</li>
                <li><strong className="text-white">Notificar inmediatamente al docente y al encargado de bioseguridad</strong> para registro de profilaxis post-exposición (PEP) dentro de las 2 horas.</li>
              </ol>
            </div>
          )}

          {activeTab === 'splash' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-sky-900/30 bg-sky-950/20 p-3">
                <AlertOctagon className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sky-200">Salpicadura en Ojos o Mucosas</h4>
                  <p className="text-xs text-sky-300/80 mt-0.5">Uso de estación lavaojos de emergencia.</p>
                </div>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-xs leading-relaxed text-slate-300">
                <li><strong className="text-white">Dirigirse de inmediato a la estación lavaojos</strong> (estudiantes cercanos deben guiar al afectado).</li>
                <li><strong className="text-white">Mantener párpados abiertos con los dedos limpios</strong> mientras el flujo continuo de solución salina o agua tibia irriga.</li>
                <li><strong className="text-white">Irrigar durante un mínimo de 15 minutos continuos</strong>. Rotar los globos oculares en todas las direcciones.</li>
                <li><strong className="text-white">Acudir a evaluación médica oftálmica urgente</strong> con ficha del agente involucrado.</li>
              </ol>
            </div>
          )}

          {activeTab === 'centrifuge' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-purple-900/30 bg-purple-950/20 p-3">
                <AlertOctagon className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-200">Rotura de Tubo dentro de Centrífuga</h4>
                  <p className="text-xs text-purple-300/80 mt-0.5">Peligro severo de aerosoles invisibles altamente concentrados.</p>
                </div>
              </div>
              <ol className="space-y-2 list-decimal list-inside text-xs leading-relaxed text-slate-300">
                <li><strong className="text-white">Apagar el motor de la centrífuga</strong> y NO ABRIR LA TAPA.</li>
                <li><strong className="text-white">Esperar 30 minutos cronometrados</strong> con la tapa cerrada para permitir la sedimentación de aerosoles biológicos.</li>
                <li><strong className="text-white">Colocarse respirador N95/FFP2, pantalla facial y guantes resistentes</strong> antes de abrir.</li>
                <li><strong className="text-white">Retirar vidrios rotos con pinzas</strong> hacia contenedor rígido y sumergir los porta-tubos en desinfectante adecuado.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-3">
          <span className="font-mono text-xs text-slate-400">
            Manual de Bioseguridad · Protocolos de Respuesta Inmediata SOS
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
