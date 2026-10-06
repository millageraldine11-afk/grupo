/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BiosecurityLevelId, CertificateBadge, StudentStats, UserProfile } from './types';
import { INITIAL_STUDENT_STATS, LEVELS_CONFIG, CHALLENGE_SCENARIOS } from './data/challengesData';
import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { AppQRCodeModal } from './components/AppQRCodeModal';
import { EmergencyModal } from './components/EmergencyModal';
import { LevelSelectionView } from './components/levels/LevelSelectionView';
import { ChallengeEngine } from './components/student/ChallengeEngine';
import { AccessPassCard } from './components/student/AccessPassCard';
import { GamificationProfile } from './components/student/GamificationProfile';
import { VideoLabPlayer } from './components/videos/VideoLabPlayer';
import { ManualExplorer } from './components/manual/ManualExplorer';
import { UserEntryModal } from './components/auth/UserEntryModal';
import { BioGuideAssistant } from './components/guide/BioGuideAssistant';
import { sound } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('splash');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isAppQrModalOpen, setIsAppQrModalOpen] = useState<boolean>(false);

  // User Profile registration state (checks localStorage)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('biosecurity_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      name: 'Geraldine Milla',
      code: '2026-MED-042',
      career: 'Medicina Humana',
      avatarId: 'bio-guide',
      avatarUrl: '/src/assets/images/bio_guide_character_1791299109205.jpg',
      registeredAt: 'Hoy',
    };
  });

  // Open entry modal on first turn if user hasn't completed registration
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('biosecurity_user_profile');
    }
    return false;
  });

  // Active level being played
  const [activeLevelId, setActiveLevelId] = useState<BiosecurityLevelId>('level-1');

  // Student stats & levels progression
  const [studentStats, setStudentStats] = useState<StudentStats>(() => ({
    ...INITIAL_STUDENT_STATS,
    name: userProfile.name,
    code: userProfile.code,
  }));

  // App URL for the QR code
  const appShareUrl = 'https://ais-pre-inoenx4f2qzjsu5qvyos2v-375261024682.us-west2.run.app';

  // Active Certificate state
  const [currentCertificate, setCurrentCertificate] = useState<CertificateBadge | null>({
    certId: 'CERT-BIO-LVL1-4921',
    studentName: userProfile.name,
    studentCode: userProfile.code,
    levelCompleted: 'Nivel 1: Normas Básicas de Bioseguridad',
    levelNumber: 1,
    sectorsMastered: [
      'Ambiente Seguro',
      'Bioseguridad del Personal de Laboratorio',
      'Precauciones de Bioseguridad',
    ],
    issuedAt: 'Hoy',
    score: 100,
    stars: 3,
    qrVerificationToken: 'BIO-VAL-LVL1-4921-CERTIFIED',
  });

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    setIsMusicPlaying(sound.isMusicActive());
  };

  const handleToggleMusic = () => {
    const active = sound.toggleMusic();
    setIsMusicPlaying(active);
  };

  const handleSaveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('biosecurity_user_profile', JSON.stringify(profile));
    }
    setStudentStats((prev) => ({
      ...prev,
      name: profile.name,
      code: profile.code,
    }));
    setCurrentCertificate((prev) =>
      prev
        ? {
            ...prev,
            studentName: profile.name,
            studentCode: profile.code,
          }
        : null
    );
    setIsUserModalOpen(false);
  };

  const handleEarnXp = (amount: number) => {
    setStudentStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const handleSelectLevelToPlay = (levelId: BiosecurityLevelId) => {
    setActiveLevelId(levelId);
    setActiveTab('challenge');
  };

  const handleLevelComplete = (
    levelId: BiosecurityLevelId,
    passed: boolean,
    score: number,
    stars: number
  ) => {
    const levelCfg = LEVELS_CONFIG.find((l) => l.id === levelId) || LEVELS_CONFIG[0];
    const sectorsNames = levelCfg.sectors.map((s) => s.name);

    // Build new Certificate Badge
    const newCert: CertificateBadge = {
      certId: `CERT-BIO-LVL${levelCfg.number}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentStats.name,
      studentCode: studentStats.code,
      levelCompleted: levelCfg.title,
      levelNumber: levelCfg.number,
      sectorsMastered: sectorsNames,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score,
      stars,
      qrVerificationToken: `BIO-VAL-LVL${levelCfg.number}-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    setCurrentCertificate(newCert);

    if (passed) {
      sound.playSuccess();

      // Unlock next level in progression:
      setStudentStats((prev) => {
        const newlyUnlocked = [...prev.unlockedLevels];
        if (levelId === 'level-1' && !newlyUnlocked.includes('level-2')) {
          newlyUnlocked.push('level-2');
        }
        if (levelId === 'level-2' && !newlyUnlocked.includes('level-3')) {
          newlyUnlocked.push('level-3');
        }

        const sectorIds = levelCfg.sectors.map((s) => s.id);
        const allCompleted = Array.from(new Set([...prev.completedSectors, ...sectorIds]));

        return {
          ...prev,
          xp: prev.xp + 350,
          starsTotal: prev.starsTotal + stars,
          unlockedLevels: newlyUnlocked,
          completedSectors: allCompleted,
          streak: prev.streak + 1,
        };
      });
    }

    setActiveTab('certificate');
  };

  // Find active hint for Bio-Guía if in challenge
  const activeQuestions = CHALLENGE_SCENARIOS.filter((q) => q.levelId === activeLevelId);
  const currentScenario = activeQuestions[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Primary Navigation in Celeste style */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenEmergencySOP={() => setIsEmergencyModalOpen(true)}
        onOpenAppQR={() => setIsAppQrModalOpen(true)}
        userProfile={userProfile}
        onOpenUserModal={() => setIsUserModalOpen(true)}
      />

      {/* Main Content Arena */}
      <main className="flex-1 pb-16">
        {/* Tab 1: Splash / Welcome with Logo */}
        {activeTab === 'splash' && (
          <SplashScreen
            onStartLevels={() => setActiveTab('levels')}
            onOpenVideoLab={() => setActiveTab('video_lab')}
            onOpenManual={() => setActiveTab('manual')}
            onOpenAppQR={() => setIsAppQrModalOpen(true)}
            studentName={userProfile?.name}
            onOpenProfile={() => setIsUserModalOpen(true)}
          />
        )}

        {/* Tab 2: Levels & Sectors Selection */}
        {activeTab === 'levels' && (
          <LevelSelectionView
            unlockedLevels={studentStats.unlockedLevels}
            onSelectLevel={handleSelectLevelToPlay}
            starsTotal={studentStats.starsTotal}
            xpTotal={studentStats.xp}
          />
        )}

        {/* Tab 3: Playing Questions of the Selected Level & Sector */}
        {activeTab === 'challenge' && (
          <ChallengeEngine
            levelId={activeLevelId}
            onLevelComplete={handleLevelComplete}
            onCancel={() => setActiveTab('levels')}
            studentName={userProfile?.name}
          />
        )}

        {/* Tab 4: Video Lab */}
        {activeTab === 'video_lab' && (
          <VideoLabPlayer onEarnXp={handleEarnXp} />
        )}

        {/* Tab 5: Sectors of the Manual Explorer */}
        {activeTab === 'manual' && (
          <ManualExplorer onEarnXp={handleEarnXp} />
        )}

        {/* Tab 6: Certificate of Achieved Level */}
        {activeTab === 'certificate' && (
          currentCertificate ? (
            <AccessPassCard
              cert={currentCertificate}
              onBackToLevels={() => setActiveTab('levels')}
            />
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-400 text-sm">Aún no has completado un nivel para emitir certificado.</p>
              <button
                onClick={() => setActiveTab('levels')}
                className="mt-4 rounded-2xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 shadow-lg"
              >
                Ver los 3 Niveles
              </button>
            </div>
          )
        )}

        {/* Tab 7: Gamification Stats & Badges */}
        {activeTab === 'stats' && (
          <GamificationProfile
            stats={studentStats}
            onGoToLevels={() => setActiveTab('levels')}
          />
        )}
      </main>

      {/* Guide Character Assistant (Bio-Guía Alex) */}
      <BioGuideAssistant
        studentName={userProfile?.name}
        contextMode={
          activeTab === 'splash'
            ? 'splash'
            : activeTab === 'levels'
            ? 'levels'
            : activeTab === 'challenge'
            ? 'challenge'
            : activeTab === 'video_lab'
            ? 'video'
            : 'general'
        }
        currentHint={currentScenario?.guideHint}
      />

      {/* User Registration / Profile Modal */}
      <UserEntryModal
        isOpen={isUserModalOpen}
        onSaveUser={handleSaveUserProfile}
        currentProfile={userProfile}
        onClose={() => setIsUserModalOpen(false)}
        isMandatory={!userProfile.name}
      />

      {/* Dedicated App QR Code Modal */}
      <AppQRCodeModal
        isOpen={isAppQrModalOpen}
        onClose={() => setIsAppQrModalOpen(false)}
        appUrl={appShareUrl}
      />

      {/* Emergency SOP Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Footer in Celeste */}
      <footer className="border-t border-sky-500/20 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Biosecurity Challenge · Aplicación Interactiva para Estudiantes de Ciencias Médicas</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAppQrModalOpen(true)}
              className="hover:text-sky-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Escanear QR de la App</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('levels')}
              className="hover:text-cyan-400 transition-colors"
            >
              9 Sectores del Manual
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="hover:text-rose-400 transition-colors"
            >
              Guía de Emergencia SOS
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
