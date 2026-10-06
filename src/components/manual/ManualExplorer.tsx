import React, { useState } from 'react';
import { BookOpen, Trash2, Syringe, AlertTriangle, CheckCircle2, XCircle, Sparkles, Flame, Eye, Droplet, Award, ShieldCheck } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface ManualExplorerProps {
  onEarnXp: (amount: number) => void;
}

interface WasteItem {
  id: string;
  name: string;
  correctBin: 'red' | 'black' | 'yellow';
  description: string;
}

export const ManualExplorer: React.FC<ManualExplorerProps> = ({ onEarnXp }) => {
  const [activeSection, setActiveSection] = useState<'waste' | 'pictograms' | 'vaccines' | 'barriers'>('waste');
  
  // Waste sorter mini-game state
  const wasteItems: WasteItem[] = [
    { id: 'w1', name: 'Placa Petri con cultivo de E. coli', correctBin: 'red', description: 'Residuo biocontaminado infeccioso' },
    { id: 'w2', name: 'Aguja hipodérmica con jeringa', correctBin: 'yellow', description: 'Punzocortante (¡NUNCA reencapuchar con 2 manos!)' },
    { id: 'w3', name: 'Hojas de apuntes y envoltorio de papel', correctBin: 'black', description: 'Desecho común doméstico' },
    { id: 'w4', name: 'Gasa empapada con sangre venosa', correctBin: 'red', description: 'Residuo biocontaminado' },
    { id: 'w5', name: 'Hoja de bisturí usada', correctBin: 'yellow', description: 'Punzocortante metálico con filo' },
    { id: 'w6', name: 'Botella de plástico limpia de agua mineral', correctBin: 'black', description: 'Residuo general no peligroso' },
  ];

  const [currentWasteIndex, setCurrentWasteIndex] = useState<number>(0);
  const [wasteFeedback, setWasteFeedback] = useState<{ correct: boolean; msg: string } | null>(null);

  const currentItem = wasteItems[currentWasteIndex];

  const handleSortWaste = (chosenBin: 'red' | 'black' | 'yellow') => {
    if (!currentItem) return;
    const isCorrect = chosenBin === currentItem.correctBin;
    if (isCorrect) {
      sound.playSuccess();
      onEarnXp(50);
      setWasteFeedback({
        correct: true,
        msg: `¡Correcto! ${currentItem.name} clasificado según norma oficial.`,
      });
    } else {
      sound.playError();
      setWasteFeedback({
        correct: false,
        msg: `¡Error de segregación! Debe ir en ${
          currentItem.correctBin === 'red'
            ? 'Bolsa Roja (Biocontaminados)'
            : currentItem.correctBin === 'black'
            ? 'Bolsa Negra (Comunes)'
            : 'Descartador Amarillo/Rojo (Punzocortantes)'
        }.`,
      });
    }

    setTimeout(() => {
      setWasteFeedback(null);
      if (currentWasteIndex < wasteItems.length - 1) {
        setCurrentWasteIndex(prev => prev + 1);
      } else {
        setCurrentWasteIndex(0);
      }
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-sky-500/20 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <BookOpen className="h-4 w-4" />
            <span>Guía Rápida de Bioseguridad en Laboratorios</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl mt-1">
            Explorador Interactivo del Manual
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Aprende las normas oficiales mediante dinámicas visuales y minijuegos
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-sky-500/30 bg-slate-900 p-1.5 text-xs font-medium">
          <button
            onClick={() => {
              setActiveSection('waste');
              sound.playTick();
            }}
            className={`rounded-xl px-3 py-1.5 transition-all ${
              activeSection === 'waste' ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clasificador de Residuos
          </button>
          <button
            onClick={() => {
              setActiveSection('pictograms');
              sound.playTick();
            }}
            className={`rounded-xl px-3 py-1.5 transition-all ${
              activeSection === 'pictograms' ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pictogramas Oficiales
          </button>
          <button
            onClick={() => {
              setActiveSection('vaccines');
              sound.playTick();
            }}
            className={`rounded-xl px-3 py-1.5 transition-all ${
              activeSection === 'vaccines' ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vacunación de Personal
          </button>
          <button
            onClick={() => {
              setActiveSection('barriers');
              sound.playTick();
            }}
            className={`rounded-xl px-3 py-1.5 transition-all ${
              activeSection === 'barriers' ? 'bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Barreras & EPP Obligatorio
          </button>
        </div>
      </div>

      {/* SECTION 1: Waste Sorter Mini-Game */}
      {activeSection === 'waste' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-sky-500/30 bg-slate-900/60 p-6 sm:p-8 shadow-xl text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold">
              MINI-JUEGO DE SEGREGACIÓN
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              ¿En qué contenedor debe ir este residuo?
            </h3>

            {/* Current Item Card */}
            <div className="my-6 mx-auto max-w-md rounded-2xl border-2 border-dashed border-sky-400/40 bg-slate-950 p-6 shadow-inner">
              <span className="text-xs uppercase tracking-wider text-slate-500">
                Ítem {currentWasteIndex + 1} de {wasteItems.length}
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold text-white mt-2">
                {currentItem.name}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {currentItem.description}
              </p>

              {wasteFeedback && (
                <div className={`mt-4 rounded-xl p-3 text-xs font-semibold flex items-center justify-center gap-2 ${
                  wasteFeedback.correct ? 'bg-sky-950/80 text-sky-200 border border-sky-400/40' : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                }`}>
                  {wasteFeedback.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span>{wasteFeedback.msg}</span>
                </div>
              )}
            </div>

            {/* The 3 Target Bins */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <button
                onClick={() => handleSortWaste('red')}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-rose-700/60 bg-rose-950/30 p-5 hover:bg-rose-950/60 hover:border-rose-500 transition-all group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600/30 text-rose-400 group-hover:scale-110 transition-transform mb-3">
                  <Trash2 className="h-8 w-8 text-rose-400" />
                </div>
                <span className="font-bold text-sm text-white">Bolsa Roja</span>
                <span className="text-[11px] text-rose-300 mt-1">Residuos Biocontaminados</span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Máx 2/3 · 60-80 micras</span>
              </button>

              <button
                onClick={() => handleSortWaste('yellow')}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-amber-600/60 bg-amber-950/30 p-5 hover:bg-amber-950/60 hover:border-amber-500 transition-all group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600/30 text-amber-400 group-hover:scale-110 transition-transform mb-3">
                  <Syringe className="h-8 w-8 text-amber-400" />
                </div>
                <span className="font-bold text-sm text-white">Guardián Rígido</span>
                <span className="text-[11px] text-amber-300 mt-1">Punzocortantes</span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Máx 3/4 partes (75%)</span>
              </button>

              <button
                onClick={() => handleSortWaste('black')}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-700/60 bg-slate-900/50 p-5 hover:bg-slate-850 hover:border-slate-500 transition-all group"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 group-hover:scale-110 transition-transform mb-3">
                  <Trash2 className="h-8 w-8 text-slate-300" />
                </div>
                <span className="font-bold text-sm text-white">Bolsa Negra</span>
                <span className="text-[11px] text-slate-300 mt-1">Desechos Comunes</span>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Papel, cartón, oficina</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Pictograms */}
      {activeSection === 'pictograms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-rose-900/60 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-400 uppercase">PROHIBICIÓN</span>
              <span className="text-[11px] text-slate-400 font-mono">Min 35% Rojo</span>
            </div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-rose-500 bg-white text-slate-950 font-black relative">
                <div className="absolute inset-x-0 h-1 bg-rose-500 rotate-45" />
                <span className="text-xs font-mono">NO PASAR</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Forma redonda, color negro sobre fondo blanco con bordes y banda transversal roja a 45°. Prohibido fumar, comer o reencapuchar agujas.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-800/60 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-sky-400 uppercase">OBLIGACIÓN</span>
              <span className="text-[11px] text-slate-400 font-mono">Min 50% Azul</span>
            </div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-600 text-white font-black text-center p-2 text-[10px]">
                USO DE GAFAS
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Forma redonda, símbolo blanco sobre fondo azul. Obligatorio el uso de mandil abotonado, gafas de seguridad, guantes y calzado cerrado de piel.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-900/60 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase">ADVERTENCIA</span>
              <span className="text-[11px] text-slate-400 font-mono">Min 50% Amarillo</span>
            </div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex h-16 w-16 items-center justify-center bg-amber-400 text-slate-950 font-bold">
                <AlertTriangle className="h-10 w-10 text-slate-950" />
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Forma triangular, pictograma negro sobre fondo amarillo con bordes negros. Riesgo biológico, peligro de corrosión por ácidos y sustancias tóxicas.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-800/60 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-300 uppercase">SALVAMENTO</span>
              <span className="text-[11px] text-slate-400 font-mono">Min 50% Verde</span>
            </div>
            <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex h-14 w-20 items-center justify-center bg-emerald-600 text-white font-bold rounded-lg text-xs">
                + LAVAOJOS
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Forma rectangular o cuadrada, blanco sobre fondo verde. Rutas de evacuación, estación lavaojos, ducha de emergencia y botiquines.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: Vaccines */}
      {activeSection === 'vaccines' && (
        <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">
              Esquema de Inmunización para el Personal de Salud
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Requisito de bioseguridad para estudiantes en prácticas con fluidos biológicos
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono">
                <tr>
                  <th className="px-6 py-3">Vacuna</th>
                  <th className="px-6 py-3">Esquema e Indicación</th>
                  <th className="px-6 py-3">Control Requerido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-3 font-semibold text-white">Hepatitis B</td>
                  <td className="px-6 py-3">Tres dosis (0, 1 y 6 meses) intramuscular</td>
                  <td className="px-6 py-3 font-mono text-sky-400">Dosar Anti-HBsAg 1 mes luego de última dosis</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-3 font-semibold text-white">Tétanos - Difteria (dT)</td>
                  <td className="px-6 py-3">Una dosis de refuerzo</td>
                  <td className="px-6 py-3 font-mono text-cyan-300">Cada 10 años</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-3 font-semibold text-white">Influenza</td>
                  <td className="px-6 py-3">Una dosis anual</td>
                  <td className="px-6 py-3 font-mono text-amber-400">Época pre-epidémica</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="px-6 py-3 font-semibold text-white">Triple Viral (SRP)</td>
                  <td className="px-6 py-3">Dos dosis (0 - 1 mes) si serología es negativa</td>
                  <td className="px-6 py-3 font-mono text-purple-400">Evaluación serológica previa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: Barreras Primarias & EPP */}
      {activeSection === 'barriers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-sky-400">BARRERA 1 · PROTECCIÓN CORPORAL</span>
            <h4 className="text-sm font-bold text-white">Bata de Laboratorio Manga Larga</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Debe permanecer 100% abotonada hasta el cuello. Cubre los brazos y el torso. Jamás debe usarse fuera del laboratorio ni en cafeterías o transporte público.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-800/50 bg-slate-900/60 p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-cyan-300">BARRERA 2 · PROTECCIÓN OCULAR Y FACIAL</span>
            <h4 className="text-sm font-bold text-white">Gafas de Seguridad con Protección Lateral</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Lentes de policarbonato resistentes a impactos. Protegen contra salpicaduras de sangre y aerosoles patógenos que ingresan por la mucosa ocular.
            </p>
          </div>

          <div className="rounded-3xl border border-blue-800/50 bg-slate-900/60 p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-blue-400">BARRERA 3 · PROTECCIÓN DE MANOS</span>
            <h4 className="text-sm font-bold text-white">Guantes de Nitrilo o Látex Descartables</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Obligatorios para manipular muestras biológicas o reactivos. Se descartan inmediatamente tras su uso en Bolsa Roja y se realiza lavado de manos.
            </p>
          </div>

          <div className="rounded-3xl border border-teal-800/50 bg-slate-900/60 p-5 space-y-2">
            <span className="font-mono text-xs font-bold text-teal-400">BARRERA 4 · CALZADO REGLAMENTARIO</span>
            <h4 className="text-sm font-bold text-white">Zapatos Cerrados de Material Impermeable</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Totalmente cerrados de cuero o goma, suela antideslizante. Quedan terminantemente prohibidas las sandalias, calzado de tela abierta o tacones.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
