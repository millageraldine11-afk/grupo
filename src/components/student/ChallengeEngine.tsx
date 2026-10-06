import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Star,
  Award,
  Sparkles,
  Play,
  Pause,
  Eye,
  Check,
  HelpCircle,
  Flame,
  ShieldCheck,
  Target,
  Trash2,
  ListOrdered,
  ZoomIn
} from 'lucide-react';
import { BiosecurityLevelId, ChallengeScenario, DecisionOption, HotspotTarget, WasteItem } from '../../types';
import { CHALLENGE_SCENARIOS, LEVELS_CONFIG } from '../../data/challengesData';
import { sound } from '../../utils/soundEffects';
import { ImageZoomModal } from '../common/ImageZoomModal';

interface ChallengeEngineProps {
  levelId: BiosecurityLevelId;
  onLevelComplete: (levelId: BiosecurityLevelId, passed: boolean, score: number, stars: number) => void;
  onCancel: () => void;
  studentName?: string;
}

export const ChallengeEngine: React.FC<ChallengeEngineProps> = ({
  levelId,
  onLevelComplete,
  onCancel,
  studentName = 'Estudiante',
}) => {
  const currentLevelConfig = LEVELS_CONFIG.find((l) => l.id === levelId) || LEVELS_CONFIG[0];
  const levelQuestions = CHALLENGE_SCENARIOS.filter((q) => q.levelId === levelId);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [showLevelSummary, setShowLevelSummary] = useState<boolean>(false);

  // Video / Canvas simulation state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [simPlaying, setSimPlaying] = useState<boolean>(true);

  // Hotspot interaction state
  const [foundHotspot, setFoundHotspot] = useState<HotspotTarget | null>(null);
  const [hotspotClickPos, setHotspotClickPos] = useState<{ x: number; y: number } | null>(null);

  // Waste sorter state (for waste_sorter interaction)
  const [sortedWaste, setSortedWaste] = useState<{ [id: string]: 'red_bag' | 'sharps_box' | 'black_bag' | 'yellow_bag' }>({});
  const [activeWasteItemIndex, setActiveWasteItemIndex] = useState<number>(0);

  // Secondary image choice state
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Zoomed image modal state
  const [zoomedImage, setZoomedImage] = useState<{ src: string; title: string; desc?: string } | null>(null);

  const timerIntervalRef = useRef<number | null>(null);

  const scenario: ChallengeScenario = levelQuestions[currentIndex] || levelQuestions[0];

  // Initialize for each question
  useEffect(() => {
    setTimeLeft(scenario?.timeLimitSeconds || 18);
    setSelectedOption(null);
    setIsResolved(false);
    setSimPlaying(true);
    setFoundHotspot(null);
    setHotspotClickPos(null);
    setSortedWaste({});
    setActiveWasteItemIndex(0);
    setSelectedImageId(null);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          handleTimeExpire();
          return 0;
        }
        if (prev <= 5) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentIndex, levelId]);

  // Canvas animation for video simulations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scenario.videoClipType) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#060d19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      if (scenario.videoClipType === 'centrifuge') {
        if (simPlaying) angle += 0.09;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 65, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * 55, Math.sin(a) * 55, 10, 0, Math.PI * 2);
          ctx.fillStyle = i === 2 ? '#ef4444' : '#0284c7';
          ctx.fill();
        }
        ctx.restore();

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('SIMULACIÓN DE ROTOR A 4,500 RPM', cx, cy + 85);
      } else if (scenario.videoClipType === 'handwash') {
        if (simPlaying) angle += 0.03;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('FRICCIÓN: 40-60s', cx, cy + 5);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('Norma de Higiene Hospitalaria', cx, cy + 22);
      } else if (scenario.videoClipType === 'sharps') {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(cx - 40, cy - 50, 80, 100);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GUARDIÁN 3/4', cx, cy + 5);

        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx - 45, cy - 25);
        ctx.lineTo(cx + 45, cy - 25);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (scenario.videoClipType === 'spill') {
        if (simPlaying) angle += 0.04;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 45 + Math.sin(angle) * 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('HIPOCLORITO PERIFÉRICO (20-30 MIN)', cx, cy + 70);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [scenario, simPlaying]);

  const handleTimeExpire = () => {
    setIsResolved(true);
    sound.playError();
    setErrorsCount((prev) => prev + 1);
  };

  const handleSelectOption = (option: DecisionOption) => {
    if (isResolved) return;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setSelectedOption(option);
    setIsResolved(true);

    if (option.isCorrect) {
      sound.playSuccess();
      setCorrectAnswersCount((prev) => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate(80);
      }
    } else {
      sound.playError();
      setErrorsCount((prev) => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate([150, 50, 150]);
      }
    }
  };

  // Image Card Click
  const handleSelectImageCard = (img: { id: string; isCorrect: boolean; label: string; explanation?: string }) => {
    if (isResolved) return;
    setSelectedImageId(img.id);

    const matchingOpt = scenario.options.find((o) => o.isCorrect === img.isCorrect) || scenario.options[0];
    handleSelectOption(matchingOpt);
  };

  // Hotspot Click
  const handleImageHotspotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isResolved || !scenario.hotspots || scenario.hotspots.length === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setHotspotClickPos({ x: clickX, y: clickY });

    // Check if within any danger hotspot radius
    const hit = scenario.hotspots.find((h) => {
      const dist = Math.sqrt(Math.pow(clickX - h.x, 2) + Math.pow(clickY - h.y, 2));
      return dist <= h.radius;
    });

    if (hit) {
      setFoundHotspot(hit);
      const correctOpt = scenario.options.find((o) => o.isCorrect) || scenario.options[0];
      handleSelectOption(correctOpt);
    } else {
      sound.playError();
      setFoundHotspot({
        x: clickX,
        y: clickY,
        radius: 8,
        label: 'Zona sin peligro evidente',
        hazardDescription: 'Aquí no se encuentra la infracción de bioseguridad. Busca en los mesones y vías de evacuación.',
        isDanger: false,
      });
    }
  };

  // Waste Sorter Bin Click
  const handleSortWasteItem = (bin: 'red_bag' | 'sharps_box' | 'black_bag' | 'yellow_bag') => {
    if (!scenario.wasteItems || isResolved) return;
    const currentItem = scenario.wasteItems[activeWasteItemIndex];
    if (!currentItem) return;

    const newSorted = { ...sortedWaste, [currentItem.id]: bin };
    setSortedWaste(newSorted);

    if (activeWasteItemIndex < scenario.wasteItems.length - 1) {
      setActiveWasteItemIndex((prev) => prev + 1);
      sound.playTick();
    } else {
      // All sorted! Evaluate
      const allCorrect = scenario.wasteItems.every((item) => newSorted[item.id] === item.correctBin);
      const targetOpt = allCorrect
        ? scenario.options.find((o) => o.isCorrect) || scenario.options[0]
        : scenario.options.find((o) => !o.isCorrect) || scenario.options[1];
      handleSelectOption(targetOpt);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < levelQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowLevelSummary(true);
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setIsResolved(false);
    setTimeLeft(scenario.timeLimitSeconds);
    setFoundHotspot(null);
    setHotspotClickPos(null);
    setSortedWaste({});
    setActiveWasteItemIndex(0);
    setSelectedImageId(null);
  };

  const handleFinishLevel = () => {
    const total = levelQuestions.length;
    const finalScore = Math.round((correctAnswersCount / total) * 100);
    const passed = finalScore >= currentLevelConfig.minScoreToPass;
    const stars = finalScore === 100 ? 3 : finalScore >= 75 ? 2 : 1;
    onLevelComplete(levelId, passed, finalScore, stars);
  };

  const progressPct = ((timeLeft / scenario.timeLimitSeconds) * 100).toFixed(0);

  // Level Summary Card
  if (showLevelSummary) {
    const total = levelQuestions.length;
    const finalScore = Math.round((correctAnswersCount / total) * 100);
    const passed = finalScore >= currentLevelConfig.minScoreToPass;
    const stars = finalScore === 100 ? 3 : finalScore >= 75 ? 2 : 1;

    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="relative overflow-hidden rounded-3xl border-2 border-sky-400/50 bg-gradient-to-b from-slate-900 via-sky-950/80 to-slate-950 p-8 shadow-[0_0_35px_rgba(14,165,233,0.3)]">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-slate-950 shadow-xl">
            {passed ? <Award className="h-10 w-10 fill-slate-950" /> : <RotateCcw className="h-10 w-10" />}
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold block mb-1">
            {currentLevelConfig.title.toUpperCase()}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {passed ? '¡Nivel Superado con Éxito!' : 'Nivel Pendiente de Aprobación'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-sky-200">
            {passed
              ? `Has demostrado competencia en ${currentLevelConfig.subtitle}.`
              : 'Se requiere un mínimo de 75% para avanzar al siguiente nivel. Revisa los sectores del manual y reintenta.'}
          </p>

          <div className="my-6 flex justify-center items-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`h-8 w-8 ${
                  passed && starIdx <= stars
                    ? 'text-amber-400 fill-amber-400 animate-bounce'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 my-6 text-xs max-w-sm mx-auto">
            <div className="rounded-xl border border-sky-500/20 bg-slate-950/80 p-3">
              <span className="text-slate-400 block">Puntaje Obtenido</span>
              <span className="font-mono text-xl font-bold text-sky-400">{finalScore}%</span>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-slate-950/80 p-3">
              <span className="text-slate-400 block">Aciertos</span>
              <span className="font-mono text-xl font-bold text-white">
                {correctAnswersCount} / {total}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {passed ? (
              <button
                onClick={handleFinishLevel}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-3 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg"
              >
                <span>Avanzar & Ver Reconocimiento</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setCorrectAnswersCount(0);
                  setErrorsCount(0);
                  setShowLevelSummary(false);
                }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-xs font-black text-slate-950 hover:bg-sky-400 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reintentar este Nivel</span>
              </button>
            )}

            <button
              onClick={onCancel}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Volver al Menú de Niveles
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top Header Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-sky-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-sky-500/20 border border-sky-500/40 px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-sky-300">
              {scenario.sectorName}
            </span>
            <span className="text-slate-600">·</span>
            <span className="font-mono text-xs text-sky-400 font-bold">
              Reto {currentIndex + 1} de {levelQuestions.length}
            </span>
          </div>
          <h2 className="text-xl font-black text-white sm:text-2xl mt-1">{scenario.title}</h2>
        </div>

        {/* 15s Countdown Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-sky-500/30 bg-slate-900 px-3.5 py-1.5 shadow-inner">
            <Clock className={`h-4 w-4 ${timeLeft <= 4 ? 'text-rose-500 animate-spin' : 'text-sky-400'}`} />
            <span
              className={`font-mono text-base font-bold tabular-nums ${
                timeLeft <= 4 ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}
            >
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Salir a Niveles
          </button>
        </div>
      </div>

      {/* Timer Progress Bar in Celeste Glow */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            timeLeft > 7
              ? 'bg-gradient-to-r from-sky-400 to-cyan-300 shadow-[0_0_12px_#38bdf8]'
              : timeLeft > 3
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_12px_#f59e0b]'
              : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_12px_#ef4444]'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* DYNAMIC INTERACTIVE DISPLAY MODES */}

      {/* MODE 1: IMAGE CARD PICKER (User chooses between big visual image choices!) */}
      {scenario.interactionType === 'image_card_choice' && scenario.secondaryImages && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-4">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Eye className="h-4 w-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                DECISIÓN VISUAL: SELECCIONA LA IMAGEN CORRECTA
              </span>
            </div>
            <p className="text-sm font-bold text-white">{scenario.situationPrompt}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenario.secondaryImages.map((img) => {
              const isSelected = selectedImageId === img.id;
              let cardBorder = 'border-sky-500/30 hover:border-sky-400 hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]';
              if (isResolved) {
                if (img.isCorrect) {
                  cardBorder = 'border-sky-400 ring-4 ring-sky-400/50 bg-sky-950/40';
                } else if (isSelected && !img.isCorrect) {
                  cardBorder = 'border-rose-500 ring-4 ring-rose-500/50 bg-rose-950/40';
                } else {
                  cardBorder = 'border-slate-800 opacity-60';
                }
              }

              return (
                <button
                  key={img.id}
                  onClick={() => handleSelectImageCard(img)}
                  disabled={isResolved}
                  className={`relative overflow-hidden rounded-3xl border-2 text-left bg-slate-950 transition-all p-3 flex flex-col group ${cardBorder}`}
                >
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-900 mb-3">
                    <img
                      src={img.src}
                      alt={img.label}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 rounded-lg bg-slate-950/90 border border-sky-400/50 px-2.5 py-1 text-[11px] font-mono font-bold text-sky-300">
                      TOCA PARA ELEGIR
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage({
                          src: img.src,
                          title: img.label,
                          desc: img.explanation || scenario.situationPrompt,
                        });
                      }}
                      className="absolute top-3 right-3 rounded-lg bg-slate-950/80 border border-sky-400/40 p-1.5 text-sky-300 hover:text-white hover:bg-slate-900 transition-colors z-10"
                      title="Ampliar imagen en pantalla completa"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-white px-2 mb-2 leading-relaxed">
                    {img.label}
                  </p>

                  {isResolved && img.explanation && (
                    <div className={`mt-auto p-2.5 rounded-xl text-xs font-medium ${img.isCorrect ? 'bg-sky-950/80 text-sky-200 border border-sky-400/30' : 'bg-rose-950/80 text-rose-200 border border-rose-500/30'}`}>
                      {img.isCorrect ? '✅ ' : '❌ '} {img.explanation}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE HOTSPOT (Spot the Danger on the Lab Scene) */}
      {scenario.interactionType === 'interactive_hotspot' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-4">
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Target className="h-4 w-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                ENCUENTRA EL PELIGRO EN EL ESCENARIO
              </span>
            </div>
            <p className="text-sm font-bold text-white">{scenario.situationPrompt}</p>
            <p className="text-xs text-sky-300 mt-1">
              Haz clic o toca directamente sobre el área de la imagen donde detectes el riesgo de bioseguridad.
            </p>
          </div>

          <div
            onClick={handleImageHotspotClick}
            className="relative overflow-hidden rounded-3xl border-2 border-sky-500/40 bg-slate-950 cursor-crosshair shadow-2xl group"
          >
            <img
              src={scenario.imageSrc}
              alt={scenario.title}
              className="aspect-16/9 sm:aspect-21/9 w-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Zoom Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImage({
                  src: scenario.imageSrc,
                  title: scenario.title,
                  desc: 'Escenario de laboratorio en alta resolución: examina la mesada, equipos y pasillos.',
                });
              }}
              className="absolute top-3 right-3 rounded-xl bg-slate-950/80 border border-sky-400/40 p-2 text-sky-300 hover:text-white hover:bg-slate-900 transition-colors z-20 flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md"
              title="Ampliar imagen"
            >
              <ZoomIn className="h-4 w-4" />
              <span className="hidden sm:inline">Ver en grande</span>
            </button>

            {/* Pulsating target indicator where user clicked */}
            {hotspotClickPos && (
              <div
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${hotspotClickPos.x}%`, top: `${hotspotClickPos.y}%` }}
              >
                <div className={`h-12 w-12 rounded-full border-2 animate-ping ${foundHotspot?.isDanger ? 'border-sky-400 bg-sky-400/20' : 'border-rose-400 bg-rose-400/20'}`} />
                <div className={`absolute inset-0 m-auto h-4 w-4 rounded-full ${foundHotspot?.isDanger ? 'bg-sky-400' : 'bg-rose-500'}`} />
              </div>
            )}

            {/* Resolved Callout */}
            {foundHotspot && (
              <div className="absolute bottom-4 inset-x-4 rounded-2xl bg-slate-950/95 border border-sky-400/60 p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                  <CheckCircle className="h-4 w-4 text-sky-400" />
                  <span>{foundHotspot.label}</span>
                </div>
                <p className="text-xs text-slate-200 mt-1">{foundHotspot.hazardDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: WASTE SORTER INTERACTION */}
      {scenario.interactionType === 'waste_sorter' && scenario.wasteItems && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-500/30 bg-slate-900/80 p-4 text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-sky-400 font-bold block mb-1">
              CLASIFICADOR EN VIVO · ELEMENTO {activeWasteItemIndex + 1} DE {scenario.wasteItems.length}
            </span>
            <div className="my-3 inline-block rounded-2xl border border-sky-400/40 bg-sky-950/80 px-6 py-3 shadow-lg">
              <h4 className="text-base font-black text-white">
                {scenario.wasteItems[activeWasteItemIndex]?.name}
              </h4>
            </div>
            <p className="text-xs text-sky-200">
              Toca el contenedor reglamentario donde debe desecharse este residuo:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Red Bag */}
            <button
              onClick={() => handleSortWasteItem('red_bag')}
              disabled={isResolved}
              className="rounded-3xl border-2 border-rose-500/50 bg-rose-950/30 hover:bg-rose-950/60 p-5 text-center transition-all hover:scale-105 active:scale-95 group shadow-lg"
            >
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Trash2 className="h-7 w-7" />
              </div>
              <h5 className="text-sm font-black text-rose-300">BOLSA ROJA</h5>
              <p className="text-[11px] text-rose-200/80 mt-1">Biocontaminados con sangre o fluidos</p>
            </button>

            {/* Sharps Box */}
            <button
              onClick={() => handleSortWasteItem('sharps_box')}
              disabled={isResolved}
              className="rounded-3xl border-2 border-amber-500/50 bg-amber-950/30 hover:bg-amber-950/60 p-5 text-center transition-all hover:scale-105 active:scale-95 group shadow-lg"
            >
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h5 className="text-sm font-black text-amber-300">GUARDIÁN RÍGIDO</h5>
              <p className="text-[11px] text-amber-200/80 mt-1">Agujas, bisturís y vidrios punzocortantes</p>
            </button>

            {/* Black Bag */}
            <button
              onClick={() => handleSortWasteItem('black_bag')}
              disabled={isResolved}
              className="rounded-3xl border-2 border-slate-600 bg-slate-900/60 hover:bg-slate-800 p-5 text-center transition-all hover:scale-105 active:scale-95 group shadow-lg"
            >
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                <Trash2 className="h-7 w-7" />
              </div>
              <h5 className="text-sm font-black text-slate-300">BOLSA NEGRA</h5>
              <p className="text-[11px] text-slate-400 mt-1">Residuos comunes no contaminados</p>
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: VIDEO CHECKPOINT & STANDARD DYNAMIC SPLIT (Video, Step Sequencer or Photo with Option Grid) */}
      {(scenario.interactionType === 'video_checkpoint' ||
        scenario.interactionType === 'step_sequencer' ||
        scenario.interactionType === 'multiple_choice') && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left: Dynamic Visual / Video Canvas Container */}
          <div className="md:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border-2 border-sky-500/30 bg-slate-950 shadow-2xl group">
              {scenario.videoClipType ? (
                <div className="relative aspect-4/3 w-full flex items-center justify-center bg-slate-950">
                  <canvas
                    ref={canvasRef}
                    width={420}
                    height={315}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setSimPlaying(!simPlaying)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 border border-sky-400/40 text-sky-300 hover:text-white"
                    >
                      {simPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-sky-300" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={scenario.imageSrc}
                    alt={scenario.title}
                    className="aspect-4/3 w-full object-cover brightness-95 contrast-105"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setZoomedImage({
                        src: scenario.imageSrc,
                        title: scenario.title,
                        desc: scenario.situationPrompt,
                      });
                    }}
                    className="absolute top-3 right-3 rounded-xl bg-slate-950/80 border border-sky-400/40 p-2 text-sky-300 hover:text-white hover:bg-slate-900 transition-colors z-20 flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md"
                    title="Ampliar imagen"
                  >
                    <ZoomIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Ver en grande</span>
                  </button>
                </div>
              )}

              {/* Sector Badge Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-xl bg-slate-950/90 border border-sky-400/60 px-3 py-1.5 text-xs font-mono font-bold text-sky-300 backdrop-blur-md shadow-lg">
                <Zap className="h-3.5 w-3.5 text-sky-400" />
                <span>{scenario.hazardBadge}</span>
              </div>

              {/* Sequence preview if step sequencer */}
              {scenario.sequenceItems && (
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-slate-950/90 border border-sky-400/40 p-3 backdrop-blur-md">
                  <span className="text-[10px] font-mono font-bold text-sky-300 uppercase tracking-wider block mb-1">
                    SECUENCIA SOS RECOMENDADA
                  </span>
                  <div className="space-y-1">
                    {scenario.sequenceItems.map((s) => (
                      <div key={s.id} className="flex items-center gap-2 text-[11px] text-slate-200">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-sky-500/20 font-mono text-[9px] font-bold text-sky-300">
                          {s.stepNumber}
                        </span>
                        <span className="truncate">{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right: Decision Action Choices */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sky-400">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">
                  {scenario.sectorName}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-4 leading-snug">
                {scenario.situationPrompt}
              </h3>

              {/* Action Buttons */}
              <div className="space-y-3">
                {scenario.options.map((option, idx) => {
                  const isSelected = selectedOption?.id === option.id;
                  let btnStyle = 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-sky-400 hover:bg-slate-850';

                  if (isResolved) {
                    if (option.isCorrect) {
                      btnStyle = 'border-sky-400 bg-sky-950/80 text-sky-100 ring-2 ring-sky-400/50';
                    } else if (isSelected && !option.isCorrect) {
                      btnStyle = 'border-rose-500 bg-rose-950/70 text-rose-100 ring-2 ring-rose-500/50';
                    } else {
                      btnStyle = 'border-slate-800/40 bg-slate-900/30 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      disabled={isResolved}
                      className={`w-full text-left rounded-2xl border p-3.5 transition-all flex items-start gap-3 shadow-md ${btnStyle}`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-xs font-bold bg-slate-800 text-sky-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium leading-snug">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK & RESOLUTION CONTROLS */}
      {isResolved && selectedOption && (
        <div
          className={`mt-6 rounded-3xl border-2 p-5 transition-all shadow-2xl ${
            selectedOption.isCorrect
              ? 'border-sky-400/80 bg-gradient-to-r from-sky-950/90 via-slate-900/95 to-cyan-950/90'
              : 'border-rose-600/80 bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-red-950/90'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              {selectedOption.isCorrect ? (
                <CheckCircle className="h-6 w-6 text-sky-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4
                  className={`text-xs font-black uppercase tracking-wider ${
                    selectedOption.isCorrect ? 'text-sky-300' : 'text-rose-300'
                  }`}
                >
                  {selectedOption.isCorrect ? '¡Decisión Biosegura Exitosa!' : '¡Infracción de Bioseguridad!'}
                </h4>
                <p className="text-xs sm:text-sm text-slate-100 mt-1 leading-relaxed font-semibold">
                  {selectedOption.consequence}
                </p>
                <p className="text-xs text-sky-300 mt-2 italic bg-slate-950/60 p-2.5 rounded-xl border border-sky-400/20">
                  💡 <strong>Regla del Manual:</strong> {scenario.protocolTip}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {!selectedOption.isCorrect && (
                <button
                  onClick={handleRetryQuestion}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reintentar</span>
                </button>
              )}
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-300 px-5 py-2.5 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-lg"
              >
                <span>{currentIndex < levelQuestions.length - 1 ? 'Siguiente Reto' : 'Finalizar Nivel'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Expired State Banner */}
      {isResolved && !selectedOption && timeLeft === 0 && (
        <div className="mt-6 rounded-3xl border border-rose-900/60 bg-rose-950/50 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-xs font-black uppercase text-rose-300">¡Tiempo Límite Expirado!</h4>
              <p className="text-xs text-rose-200 mt-0.5">
                La inacción multiplica los riesgos de contagio. Revisa la regla obligatoria y vuelve a intentarlo.
              </p>
            </div>
          </div>
          <button
            onClick={handleRetryQuestion}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reintentar
          </button>
        </div>
      )}

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <ImageZoomModal
          isOpen={!!zoomedImage}
          onClose={() => setZoomedImage(null)}
          imageSrc={zoomedImage.src}
          imageTitle={zoomedImage.title}
          description={zoomedImage.desc}
        />
      )}
    </div>
  );
};
