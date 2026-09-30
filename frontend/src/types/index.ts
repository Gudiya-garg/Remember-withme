export type Language = 'en' | 'hi';

export type MemoryCategory = 'person' | 'place' | 'favorite' | 'event' | 'routine';

export type RecallStatus = 'strong' | 'improving' | 'needs_repetition';

export interface LocalizedString {
  en: string;
  hi: string;
}

export interface MemoryRecallStats {
  totalAttempts: number;
  correctCount: number;
  hintCount: number;
  lastRecalledAt?: string;
  status: RecallStatus;
}

export interface MemoryItem {
  id: string;
  profileId: string;
  category: MemoryCategory;
  title: string;
  relationship?: string;
  description: string;
  imageUrl?: string;
  yearOrTime?: string;
  peopleInvolved?: string[];
  routineTime?: 'morning' | 'afternoon' | 'evening';
  subType?: 'song' | 'food' | 'hobby' | 'place' | 'festival' | 'daily_activity';
  tags?: string[];
  recallStats: MemoryRecallStats;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryProfile {
  id: string;
  name: string;
  ageRange: string;
  preferredLanguage: Language;
  stage?: 'mild_mci' | 'moderate' | 'early' | 'prefer_not_to_say';
  caregiverName: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type GameType =
  | 'who_is_this'
  | 'memory_match'
  | 'complete_the_memory'
  | 'sequence_my_day'
  | 'place_and_memory'
  | 'music_memory'
  | 'story_recall';

export interface GameChoice {
  id: string;
  label: LocalizedString;
  isCorrect: boolean;
  image?: string;
}

export interface SequenceItem {
  id: string;
  label: LocalizedString;
  correctOrder: number;
  timeBadge?: string;
  iconName?: string;
}

export interface MatchPair {
  id: string;
  label: LocalizedString;
  matchId: string;
  image?: string;
}

export interface Game {
  id: string;
  profileId: string;
  sessionId?: string;
  type: GameType;
  difficultyLevel: 1 | 2 | 3;
  title: LocalizedString;
  prompt: LocalizedString;
  supportiveHint: LocalizedString;
  memoryRefId?: string;
  memoryCategory?: MemoryCategory;
  imageUrl?: string;
  audioSnippetTitle?: string;
  choices?: GameChoice[];
  sequenceItems?: SequenceItem[];
  matchPairs?: MatchPair[];
  storyText?: LocalizedString;
  question?: LocalizedString;
  metadata?: {
    personName?: string;
    relationship?: string;
    placeName?: string;
    routineLabel?: string;
  };
}

export interface GameAttemptResult {
  isCorrect: boolean;
  supportiveFeedback: LocalizedString;
  adaptation: {
    adjustmentMade: boolean;
    adjustmentType: string;
    reason: string;
    currentDifficulty: number;
    repetitionQueue: string[];
  };
}

export interface SessionSummary {
  id: string;
  memoriesRevisited: number;
  gamesCompleted: number;
  totalHints: number;
  feedbackNote: LocalizedString;
  suggestedNextActivity: LocalizedString;
}

export interface MemoryThreadNode {
  id: string;
  entityName: string;
  entityRole: string;
  memorySnippet: string;
  gameType: GameType;
  gameLabel: string;
  status: RecallStatus;
  adaptationAction: string;
}

export interface CaregiverDashboardData {
  profile: MemoryProfile;
  todayStats: {
    activitiesCompleted: number;
    engagementMinutes: number;
    gamesAttempted: number;
    hintsUsed: number;
  };
  memoryInsights: {
    frequentlyRecalledPeople: Array<{
      name: string;
      relationship: string;
      recallRate: number;
      image?: string;
      status: RecallStatus;
    }>;
    frequentlyForgottenMemories: Array<{
      id: string;
      title: string;
      category: MemoryCategory;
      struggleCount: number;
      suggestion: string;
    }>;
    strongCategories: MemoryCategory[];
    categoriesNeedingRepetition: MemoryCategory[];
  };
  adaptationTimeline: Array<{
    id: string;
    timestamp: string;
    memoryTitle: string;
    gameType: GameType;
    performanceSignal: string;
    adjustment: string;
    outcome: string;
  }>;
  memoryThreads: MemoryThreadNode[];
  trends: Array<{
    day: string;
    completionRate: number;
    avgResponseSeconds: number;
  }>;
  richnessScore: {
    percentage: number;
    label: string;
    details: {
      people: number;
      places: number;
      favorites: number;
      events: number;
      routines: number;
    };
  };
  disclaimer: string;
}
