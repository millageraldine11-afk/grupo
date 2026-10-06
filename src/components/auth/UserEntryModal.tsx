import React, { useState } from 'react';
import { User, Sparkles, ShieldCheck, ArrowRight, Award, GraduationCap, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { LAB_IMAGES } from '../../data/challengesData';
import { sound } from '../../utils/soundEffects';

interface UserEntryModalProps {
  isOpen: boolean;
  onSaveUser: (profile: UserProfile) => void;
  currentProfile?: UserProfile;
  onClose?: () => void;
  isMandatory?: boolean;
}

const CAREERS = [
  'Medicina Humana',
  'Enfermería',
  'Tecnología Médica / Laboratorio Clínico',
  'Biología / Microbiología',
  'Farmacia y Bioquímica',
  'Odontología',
  'Ciencias de la Salud General',
];

const AVATARS = [
  { id: 'bio-guide', name: 'Bio-Guía Alex', src: LAB_IMAGES.guideCharacter },
  { id: 'student-female', name: 'Científica', src: LAB_IMAGES.ppeStudent },
  { id: 'student-team', name: 'Equipo de Prácticas', src: LAB_IMAGES.studentsInLab },
  { id: 'app-badge', name: 'Emblema Dorado', src: LAB_IMAGES.appLogoBadge },
];

export const UserEntryModal: React.FC<UserEntryModalProps> = ({
  isOpen,
  onSaveUser,
  currentProfile,
  onClose,
  isMandatory = false,
}) => {
  const [name, setName] = useState<string>(currentProfile?.name || 'Geraldine Milla');
  const [code, setCode] = useState<string>(currentProfile?.code || '2026-MED-042');
  const [career, setCareer] = useState<string>(currentProfile?.career || 'Medicina Humana');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(currentProfile?.avatarId || 'bio-guide');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Por favor ingresa tu nombre de estudiante.');
      return;
    }

    const selectedAvatar = AVATARS.find((a) => a.id === selectedAvatarId);

    const newProfile: UserProfile = {
      name: name.trim(),
      code: code.trim() || '2026-MED-EST',
      career,
      avatarId: selectedAvatarId,
      avatarUrl: selectedAvatar?.src || LAB_IMAGES.guideCharacter,
      registeredAt: new Date().toLocaleDateString(),
    };

    sound.playSuccess();
    // Start background music when user enters the challenge
    sound.startBackgroundMusic();
    onSaveUser(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-sky-400/60 bg-gradient-to-b from-slate-900 via-sky-950/90 to-slate-950 p-6 sm:p-8 shadow-[0_0_50px_rgba(14,165,233,0.35)] animate-in fade-in zoom-in-95">
        {/* Glow sheen */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-950/70 px-4 py-1 text-xs font-semibold text-sky-300 mb-3 shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            <span>Registro de Estudiante Universitario</span>
          </div>

          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-sky-400 bg-slate-950 p-1 shadow-xl">
            <img
              src={LAB_IMAGES.guideCharacter}
              alt="Bio-Guía"
              className="h-full w-full rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ¡Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Biosecurity Challenge</span>!
          </h2>
          <p className="mt-1 text-xs text-sky-200/80 max-w-md mx-auto">
            Configura tu perfil para personalizar tus certificados, registrar tu puntuación y recibir consejos de Bio-Guía.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">
              Nombre Completo o Alias:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Ej. Geraldine Milla"
                className="w-full rounded-2xl border border-sky-500/30 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 transition-all"
              />
              <User className="absolute right-3.5 top-3.5 h-4 w-4 text-sky-400 pointer-events-none" />
            </div>
          </div>

          {/* Code & Career Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">
                Código / Matrícula:
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej. 2026-MED-042"
                className="w-full rounded-2xl border border-sky-500/30 bg-slate-950/80 px-4 py-2.5 text-xs font-mono font-bold text-sky-200 placeholder-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-1">
                Carrera / Especialidad:
              </label>
              <div className="relative">
                <select
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                  className="w-full rounded-2xl border border-sky-500/30 bg-slate-950/80 px-3 py-2.5 text-xs font-semibold text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 transition-all cursor-pointer"
                >
                  {CAREERS.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
              Elige tu Avatar o Personaje:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatarId === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      sound.playTick();
                      setSelectedAvatarId(av.id);
                    }}
                    className={`relative overflow-hidden rounded-2xl border-2 p-1 transition-all flex flex-col items-center gap-1 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-950/80 ring-2 ring-sky-400/50 scale-105'
                        : 'border-slate-800 bg-slate-950/60 opacity-60 hover:opacity-100 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={av.src}
                      alt={av.name}
                      className="h-12 w-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-semibold text-slate-300 truncate w-full text-center">
                      {av.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-sky-400 flex items-center justify-center text-slate-950">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {validationError && (
            <p className="text-xs text-rose-400 font-semibold bg-rose-950/50 p-2.5 rounded-xl border border-rose-800/60">
              ⚠️ {validationError}
            </p>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-2">
            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 py-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
            )}

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-300 py-3.5 text-xs font-black text-slate-950 hover:from-sky-300 hover:to-cyan-200 transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)]"
            >
              <span>¡Comenzar Desafío!</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
