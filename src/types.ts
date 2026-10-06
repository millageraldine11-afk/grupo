export type BiosecurityLevelId = 'level-1' | 'level-2' | 'level-3';

export type QuestionInteractionType =
  | 'image_card_choice'
  | 'interactive_hotspot'
  | 'video_checkpoint'
  | 'waste_sorter'
  | 'step_sequencer'
  | 'multiple_choice';

export interface DecisionOption {
  id: string;
  label: string;
  isCorrect: boolean;
  consequence: string;
  imageThumbnail?: string;
  severity: 'critical' | 'moderate' | 'safe';
}

export interface HotspotTarget {
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  radius: number; // clickable radius percentage
  label: string;
  hazardDescription: string;
  isDanger: boolean;
}

export interface WasteItem {
  id: string;
  name: string;
  iconName: string;
  correctBin: 'red_bag' | 'sharps_box' | 'black_bag' | 'yellow_bag';
  explanation: string;
}

export interface StepSequenceItem {
  id: string;
  stepNumber: number;
  text: string;
}

export interface ChallengeScenario {
  id: string;
  levelId: BiosecurityLevelId;
  sectorId: string;
  sectorName: string;
  title: string;
  interactionType: QuestionInteractionType;
  imageSrc: string;
  secondaryImages?: {
    id: string;
    src: string;
    label: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  hotspots?: HotspotTarget[];
  wasteItems?: WasteItem[];
  sequenceItems?: StepSequenceItem[];
  videoClipType?: 'centrifuge' | 'handwash' | 'sharps' | 'spill' | 'pipette';
  videoCaption?: string;
  hazardBadge: string;
  situationPrompt: string;
  timeLimitSeconds: number;
  options: DecisionOption[];
  protocolTip: string;
  guideHint?: string;
}

export interface UserProfile {
  name: string;
  code: string;
  career: string;
  avatarId: string;
  avatarUrl?: string;
  registeredAt: string;
}

export interface SectorConfig {
  id: string;
  number: number;
  name: string;
  levelId: BiosecurityLevelId;
  description: string;
  iconName: string;
  questionsCount: number;
  themeColor: string;
}

export interface LevelConfig {
  id: BiosecurityLevelId;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  sectors: SectorConfig[];
  badgeName: string;
  accentColor: string;
  minScoreToPass: number;
}

export interface CertificateBadge {
  certId: string;
  studentName: string;
  studentCode: string;
  levelCompleted: string;
  levelNumber: number;
  sectorsMastered: string[];
  issuedAt: string;
  score: number;
  stars: number;
  qrVerificationToken: string;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StudentStats {
  name: string;
  code: string;
  streak: number;
  xp: number;
  currentLevelId: BiosecurityLevelId;
  unlockedLevels: BiosecurityLevelId[];
  highestScore: number;
  starsTotal: number;
  completedSectors: string[];
  badges: UserBadge[];
}

export interface VideoModule {
  id: string;
  title: string;
  subtitle: string;
  sector: string;
  duration: string;
  animationType: 'centrifuge' | 'handwash' | 'sharps' | 'spill' | 'pipette';
  description: string;
  keyRule: string;
  checkpointQuestion: {
    question: string;
    options: { text: string; correct: boolean; explanation: string }[];
  };
}
