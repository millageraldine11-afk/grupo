import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Zap, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { VideoModule } from '../../types';
import { VIDEO_MODULES } from '../../data/challengesData';
import { sound } from '../../utils/soundEffects';

interface VideoLabPlayerProps {
  onEarnXp: (amount: number) => void;
}

export const VideoLabPlayer: React.FC<VideoLabPlayerProps> = ({ onEarnXp }) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoModule>(VIDEO_MODULES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [showCheckpoint, setShowCheckpoint] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Playback timer loop
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying && !showCheckpoint) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setShowCheckpoint(true);
            sound.playTick();
            return 100;
          }
          return prev + 1.2 * playbackSpeed;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, showCheckpoint, playbackSpeed]);

  // Dynamic canvas renderer for simulated video animations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particleAngle = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = [];

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 3 + 1,
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark clinical canvas background
      ctx.fillStyle = '#060d19';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      if (selectedVideo.animationType === 'centrifuge') {
        // Centrifuge Rotor Visualization
        ctx.save();
        ctx.translate(cx, cy);
        if (isPlaying) particleAngle += 0.08 * playbackSpeed;
        ctx.rotate(particleAngle);

        // Outer ring
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 110, 0, Math.PI * 2);
        ctx.stroke();

        // 8 rotor buckets
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4;
          const bx = Math.cos(ang) * 90;
          const by = Math.sin(ang) * 90;
          ctx.beginPath();
          ctx.arc(bx, by, 14, 0, Math.PI * 2);
          ctx.fillStyle = i === 3 ? '#ef4444' : '#0284c7';
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Center hub
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Aerosol cloud effect if past 40%
        if (progress > 35) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.beginPath();
          ctx.arc(cx, cy, 140 + Math.sin(particleAngle * 3) * 10, 0, Math.PI * 2);
          ctx.fill();

          // Aerosol warning text on canvas
          ctx.font = 'bold 12px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f87171';
          ctx.textAlign = 'center';
          ctx.fillText('⚠ AEROSOLIZACIÓN PATÓGENA DETECTADA (4,500 RPM)', cx, cy + 150);
        }
      } else if (selectedVideo.animationType === 'handwash') {
        // Handwash 120s timer simulation
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.stroke();

        // Animated progress ring
        const sweep = (progress / 100) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, -Math.PI / 2, -Math.PI / 2 + sweep);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Soap bubbles floating
        particles.forEach((p) => {
          if (isPlaying) {
            p.y -= 1 * playbackSpeed;
            if (p.y < cy - 90) p.y = cy + 90;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.7})`;
          ctx.fill();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        const secondsCounter = Math.min(120, Math.floor((progress / 100) * 120));
        ctx.fillText(`Fricción: ${secondsCounter}s / 120s`, cx, cy + 5);
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#34d399';
        ctx.fillText('Norma Oficial: Contar hasta 120', cx, cy + 25);
      } else if (selectedVideo.animationType === 'sharps') {
        // Sharps container 3/4 fill simulation
        const boxW = 120;
        const boxH = 160;
        const bx = cx - boxW / 2;
        const by = cy - boxH / 2;

        // Container body
        ctx.fillStyle = '#eab308';
        ctx.fillRect(bx, by, boxW, boxH);
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 4;
        ctx.strokeRect(bx, by, boxW, boxH);

        // Biohazard emblem on container
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BIOHAZARD', cx, by + 40);
        ctx.fillText('GUARDIÁN 3/4', cx, by + 56);

        // 3/4 fill line
        const line34Y = by + boxH * 0.25;
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(bx - 10, line34Y);
        ctx.lineTo(bx + boxW + 10, line34Y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ef4444';
        ctx.fillText('LIMITE 75% (3/4)', bx + boxW + 55, line34Y + 4);

        // Needle descending without recapping
        const needleY = by - 30 + (progress / 100) * 110;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, needleY - 40);
        ctx.lineTo(cx, needleY);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(cx - 6, needleY - 46, 12, 12);
      } else {
        // Spill containment spiral simulation
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fill();

        // Expanding spiral rings of bleach
        const maxR = 90;
        const currentR = (progress / 100) * maxR;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy, currentR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10b981';
        ctx.textAlign = 'center';
        ctx.fillText('Hipoclorito en Periferia (20-30 min)', cx, cy + 120);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [selectedVideo, isPlaying, progress, playbackSpeed]);

  const handleSelectVideo = (video: VideoModule) => {
    setSelectedVideo(video);
    setProgress(0);
    setIsPlaying(true);
    setShowCheckpoint(false);
    setSelectedAnswer(null);
    setHasAnswered(false);
    sound.playTick();
  };

  const handleRestart = () => {
    setProgress(0);
    setIsPlaying(true);
    setShowCheckpoint(false);
    setSelectedAnswer(null);
    setHasAnswered(false);
    sound.playTick();
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(idx);
    setHasAnswered(true);

    const isCorrect = selectedVideo.checkpointQuestion.options[idx].correct;
    if (isCorrect) {
      sound.playSuccess();
      onEarnXp(120);
    } else {
      sound.playError();
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Sparkles className="h-4 w-4" />
            <span>Simulador Audiovisual de Bioseguridad</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mt-1">
            Video Lab: Demostración de Errores & Protocolos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Micro-demostraciones dinámicas de alta fidelidad basadas en el Manual de Bioseguridad
          </p>
        </div>

        {/* Video selector tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {VIDEO_MODULES.map((vid) => (
            <button
              key={vid.id}
              onClick={() => handleSelectVideo(vid)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedVideo.id === vid.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {vid.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Video Player Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            {/* Top Video HUD Info */}
            <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
              <span className="rounded-lg bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 font-mono text-[11px] font-bold text-cyan-300 backdrop-blur-md">
                {selectedVideo.sector}
              </span>
              <span className="rounded-lg bg-rose-950/80 border border-rose-600/60 px-2.5 py-1 font-mono text-[11px] font-bold text-rose-300">
                REC ● SIMULACIÓN EN VIVO
              </span>
            </div>

            {/* Simulated Animated Canvas */}
            <div className="relative aspect-video w-full flex items-center justify-center bg-slate-950">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="h-full w-full object-contain"
              />

              {/* Pause Overlay Icon */}
              {!isPlaying && !showCheckpoint && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-slate-950 shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="h-8 w-8 ml-1 fill-slate-950" />
                  </button>
                </div>
              )}
            </div>

            {/* Video Controls Bar */}
            <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md">
              {/* Progress Slider */}
              <div className="mb-3 flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-400">
                  {Math.floor((progress / 100) * 45)}s
                </span>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = (clickX / rect.width) * 100;
                    setProgress(Math.max(0, Math.min(100, newPct)));
                  }}
                  className="relative h-2 flex-1 cursor-pointer rounded-full bg-slate-800 overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-cyan-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  {selectedVideo.duration}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      sound.playTick();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-white" />}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Reiniciar video"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <span className="font-bold text-xs text-white ml-2">
                    {selectedVideo.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed toggle */}
                  <button
                    onClick={() => {
                      setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : 1));
                      sound.playTick();
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-mono font-semibold text-sky-300 hover:bg-slate-700 transition-colors"
                  >
                    {playbackSpeed}x
                  </button>

                  <button
                    onClick={() => {
                      setShowCheckpoint(true);
                      setIsPlaying(false);
                      sound.playTick();
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-sky-500/20 border border-sky-400/40 px-3 py-1 text-xs font-semibold text-sky-300 hover:bg-sky-500/30 transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Pregunta Clave</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Description & Official Protocol Box */}
          <div className="rounded-3xl border border-sky-500/20 bg-slate-900/60 p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              <span>Regla Fundamental del Manual de Bioseguridad</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedVideo.description}
            </p>
            <div className="rounded-2xl border border-sky-500/20 bg-sky-950/40 p-3.5 text-xs text-sky-200">
              💡 {selectedVideo.keyRule}
            </div>
          </div>
        </div>

        {/* Right Column: Checkpoint Quiz or Quick Video List (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Decision Checkpoint Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Zap className="h-4 w-4" />
              <span>Validación de Comprensión</span>
            </div>

            <h4 className="text-sm font-bold text-white mb-4 leading-snug">
              {selectedVideo.checkpointQuestion.question}
            </h4>

            <div className="space-y-3">
              {selectedVideo.checkpointQuestion.options.map((opt: { text: string; correct: boolean; explanation: string }, idx: number) => {
                let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-sky-500/50 hover:bg-slate-900';
                if (hasAnswered) {
                  if (opt.correct) {
                    btnStyle = 'border-sky-400 bg-sky-950/60 text-sky-200 ring-1 ring-sky-400';
                  } else if (selectedAnswer === idx && !opt.correct) {
                    btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200 ring-1 ring-rose-500';
                  } else {
                    btnStyle = 'border-slate-800/40 opacity-50 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasAnswered}
                    className={`w-full text-left rounded-xl border p-3.5 text-xs font-medium transition-all ${btnStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[11px] font-bold bg-slate-800 text-slate-300">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {hasAnswered && selectedAnswer === idx && (
                      <p className={`mt-2 pt-2 border-t border-slate-800 text-[11px] ${opt.correct ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {opt.explanation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => {
                    // Pick next video
                    const currentIdx = VIDEO_MODULES.findIndex(v => v.id === selectedVideo.id);
                    const nextIdx = (currentIdx + 1) % VIDEO_MODULES.length;
                    handleSelectVideo(VIDEO_MODULES[nextIdx]);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  <span>Siguiente Video</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick List of Video Scenarios */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Módulos Demostrativos en Video:
            </h4>
            <div className="space-y-2">
              {VIDEO_MODULES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleSelectVideo(v)}
                  className={`w-full text-left rounded-xl p-3 text-xs transition-all flex items-center justify-between border ${
                    selectedVideo.id === v.id
                      ? 'border-cyan-500/40 bg-cyan-950/20 text-white font-semibold'
                      : 'border-slate-800/80 bg-slate-950/40 text-slate-400 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-white">{v.title}</p>
                    <span className="text-[11px] text-slate-500">{v.duration}</span>
                  </div>
                  <Play className="h-3.5 w-3.5 text-cyan-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
