import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, MessageSquare, Volume2, Shield } from 'lucide-react';
import { LAB_IMAGES } from '../../data/challengesData';
import { sound } from '../../utils/soundEffects';

interface BioGuideAssistantProps {
  currentHint?: string;
  studentName?: string;
  contextMode?: 'splash' | 'levels' | 'challenge' | 'video' | 'general';
  isCorrect?: boolean | null;
  onAskHint?: () => void;
}

export const BioGuideAssistant: React.FC<BioGuideAssistantProps> = ({
  currentHint,
  studentName = 'Estudiante',
  contextMode = 'general',
  isCorrect = null,
  onAskHint,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);

  // Dynamic speech text depending on state
  const getGuideSpeech = () => {
    if (isCorrect === true) {
      return `¡Brillante, ${studentName}! Demostraste un reflejo preventivo impecable. ¡Sigue así!`;
    }
    if (isCorrect === false) {
      return `¡Atención, ${studentName}! Revisa la consecuencia y el protocolo del manual. ¡De este error aprenderás para siempre!`;
    }

    if (contextMode === 'splash') {
      return `¡Hola, ${studentName}! Soy Bio-Guía, tu mentor en el laboratorio. Te acompañaré paso a paso para evitar accidentes reales. ¡Vamos a ganar XP!`;
    }
    if (contextMode === 'levels') {
      return `Los 3 niveles cubren los 9 sectores clave del manual. ¡Asegúrate de superar el 75% para conseguir tus insignias!`;
    }
    if (contextMode === 'challenge') {
      return currentHint
        ? `Tómate tu tiempo para observar las imágenes. Si tienes dudas, pulsa en "Pedir Pista" para ayudarte.`
        : `Observa con atención los detalles clínicos de la fotografía antes de tomar tu decisión.`;
    }
    if (contextMode === 'video') {
      return `En este simulador puedes observar los errores más comunes a cámara lenta. ¡Presta atención a las pausas!`;
    }
    return `¡La bioseguridad es tu mayor aliada! Siempre alerta ante riesgos biológicos.`;
  };

  const handleRequestHint = () => {
    sound.playTick();
    setShowHintModal(!showHintModal);
    if (onAskHint) onAskHint();
  };

  return (
    <aside aria-label="Asistente Bio-Guía" className="fixed bottom-4 right-4 z-40 max-w-sm sm:max-w-md pointer-events-none transition-all">
      <div className="pointer-events-auto flex flex-col items-end">
        
        {/* Chat Speech Bubble */}
        {isExpanded && (
          <div className="relative mb-2 max-w-xs sm:max-w-sm rounded-3xl border-2 border-sky-400/60 bg-slate-950/95 p-4 shadow-[0_0_30px_rgba(14,165,233,0.3)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-sky-500/20 pb-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>Bio-Guía Alex</span>
              </div>
              <span className="rounded-full bg-sky-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-300">
                Mentor Virtual
              </span>
            </div>

            {/* Speech Text */}
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {getGuideSpeech()}
            </p>

            {/* Hint Box if open */}
            {showHintModal && currentHint && (
              <div className="mt-3 rounded-2xl border border-amber-500/40 bg-amber-950/60 p-3 text-xs text-amber-200 animate-in fade-in">
                <div className="flex items-center gap-1 font-bold text-amber-300 mb-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Pista Confidencial:</span>
                </div>
                <p>{currentHint}</p>
              </div>
            )}

            {/* Hint Action Button for challenges */}
            {contextMode === 'challenge' && currentHint && isCorrect === null && (
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={handleRequestHint}
                  className="flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-950/80 px-3 py-1.5 text-[11px] font-bold text-sky-200 hover:bg-sky-900/60 transition-colors shadow-sm"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
                  <span>{showHintModal ? 'Ocultar Pista' : '💡 Pedir Pista a Bio-Guía'}</span>
                </button>
              </div>
            )}

            {/* Small speech triangle pointing to avatar */}
            <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-sky-400/60 bg-slate-950" />
          </div>
        )}

        {/* Character Avatar Trigger Button */}
        <div className="flex items-center gap-2">
          {/* Collapse/Expand Toggle Pill */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 rounded-full border border-sky-500/30 bg-slate-950/90 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:text-white shadow-lg backdrop-blur-md"
            title={isExpanded ? 'Minimizar a Bio-Guía' : 'Abrir consejos de Bio-Guía'}
          >
            {isExpanded ? (
              <>
                <span>Minimizar</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                <span>Consejos de Bio-Guía</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            )}
          </button>

          {/* Avatar Icon Container with glowing ring */}
          <button
            onClick={() => {
              sound.playTick();
              setIsExpanded(!isExpanded);
            }}
            className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 border-sky-400 bg-slate-950 p-1 shadow-[0_0_25px_rgba(14,165,233,0.4)] transition-transform hover:scale-110 active:scale-95"
            title="Bio-Guía: Asistente interactivo"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
            <img
              src={LAB_IMAGES.guideCharacter}
              alt="Bio-Guía Asistente de Bioseguridad"
              className="relative h-full w-full rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Live activity dot */}
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-400"></span>
            </span>
          </button>
        </div>

      </div>
    </aside>
  );
};
