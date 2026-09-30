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
  title: string; // e.g., "Meena", "Shiva Temple", "Kabhi Kabhie Mere Dil Mein"
  relationship?: string; // e.g., "Daughter", "Grandson"
  description: string; // e.g., "She visits every Sunday afternoon with sweet jalebis."
  imageUrl?: string;
  yearOrTime?: string; // e.g., "1978", "Every morning at 7:00 AM"
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
  ageRange: string; // e.g., "75-80"
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

/** A playable song entry inside the Music Memory game */
export interface SongEntry {
  id: string;
  title: string;
  /** e.g. "Mukesh & Lata Mangeshkar" */
  artist: string;
  /** Path served from /public/audio/, e.g. /audio/song1.mp3 */
  audioUrl: string;
  /** Optional cover image URL */
  coverUrl?: string;
  /** Short emotional memory note shown on the card */
  memoryNote?: LocalizedString;
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
  /** Playlist used exclusively by the music_memory game type */
  songs?: SongEntry[];
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

export interface GameAttempt {
  id: string;
  gameId: string;
  profileId: string;
  sessionId: string;
  gameType: GameType;
  memoryRefId?: string;
  selectedChoiceId?: string;
  isCorrect: boolean;
  responseTimeMs: number;
  hintsUsed: number;
  skipped: boolean;
  timestamp: string;
}

export interface Session {
  id: string;
  profileId: string;
  startedAt: string;
  endedAt?: string;
  gamesAttempted: number;
  gamesCompleted: number;
  memoriesRevisited: number;
  totalHints: number;
  avgResponseTimeMs: number;
  feedbackNote: LocalizedString;
  suggestedNextActivity: LocalizedString;
  isComplete: boolean;
}

export interface AdaptationState {
  profileId: string;
  currentDifficulty: 1 | 2 | 3;
  consecutiveSuccess: number;
  consecutiveStruggles: number;
  gentleRepetitionQueue: string[]; // memory IDs
  categoryStrengths: Record<MemoryCategory, RecallStatus>;
  lastAdjustmentReason: string;
  lastUpdated: string;
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
