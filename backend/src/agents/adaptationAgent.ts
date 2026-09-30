import {
  AdaptationState,
  GameAttempt,
  MemoryCategory,
  RecallStatus
} from '../types/index.js';
import { db } from '../db/database.js';

export interface AdaptationEvaluationResult {
  updatedState: AdaptationState;
  adjustmentMade: boolean;
  adjustmentType: 'increase_difficulty' | 'decrease_difficulty' | 'queue_repetition' | 'maintain';
  reason: string;
  supportiveFeedback: {
    en: string;
    hi: string;
  };
  recommendedNextType?: string;
}

export class AdaptationAgent {
  /**
   * Processes a game attempt and adapts the difficulty, repetition schedule,
   * and category strengths in real-time.
   */
  public static processAttempt(attempt: GameAttempt): AdaptationEvaluationResult {
    const currentState = db.getAdaptationState(attempt.profileId);
    let currentDifficulty = currentState.currentDifficulty;
    let consecutiveSuccess = currentState.consecutiveSuccess;
    let consecutiveStruggles = currentState.consecutiveStruggles;
    const repetitionQueue = [...currentState.gentleRepetitionQueue];
    const categoryStrengths = { ...currentState.categoryStrengths };

    let adjustmentMade = false;
    let adjustmentType: AdaptationEvaluationResult['adjustmentType'] = 'maintain';
    let reason = 'Maintaining comfortable cognitive pace.';

    // Update memory item recall stats if memoryRefId is present
    if (attempt.memoryRefId) {
      const memory = db.getMemoryById(attempt.memoryRefId);
      if (memory) {
        const stats = { ...memory.recallStats };
        stats.totalAttempts += 1;
        if (attempt.isCorrect) stats.correctCount += 1;
        stats.hintCount += attempt.hintsUsed;
        stats.lastRecalledAt = new Date().toISOString();

        // Calculate status
        const accuracy = stats.correctCount / Math.max(1, stats.totalAttempts);
        if (accuracy >= 0.8 && stats.totalAttempts >= 3) {
          stats.status = 'strong';
        } else if (accuracy >= 0.5) {
          stats.status = 'improving';
        } else {
          stats.status = 'needs_repetition';
        }

        db.updateMemory(memory.id, { recallStats: stats });

        // Update category strengths
        const cat = memory.category as MemoryCategory;
        if (cat) {
          categoryStrengths[cat] = stats.status;
        }
      }
    }

    // Adaptive evaluation rules
    const isFast = attempt.responseTimeMs < 6000;
    const isSlow = attempt.responseTimeMs > 12000;
    const hadHints = attempt.hintsUsed > 0;

    if (attempt.isCorrect && !attempt.skipped) {
      consecutiveSuccess += 1;
      consecutiveStruggles = 0;

      // If item was in gentle repetition queue and recalled cleanly, remove it
      if (attempt.memoryRefId && repetitionQueue.includes(attempt.memoryRefId)) {
        const idx = repetitionQueue.indexOf(attempt.memoryRefId);
        if (idx !== -1) repetitionQueue.splice(idx, 1);
      }

      // If 2 consecutive strong successes and response time is comfortable, step up
      if (consecutiveSuccess >= 2 && currentDifficulty < 3 && isFast) {
        currentDifficulty = (currentDifficulty + 1) as 1 | 2 | 3;
        consecutiveSuccess = 0;
        adjustmentMade = true;
        adjustmentType = 'increase_difficulty';
        reason = 'Quick recognition and high confidence; stepping up to level ' + currentDifficulty + ' with richer options.';
      }
    } else {
      // Struggled or skipped
      consecutiveStruggles += 1;
      consecutiveSuccess = 0;

      // Add to gentle repetition queue if not already there
      if (attempt.memoryRefId && !repetitionQueue.includes(attempt.memoryRefId)) {
        repetitionQueue.push(attempt.memoryRefId);
        adjustmentType = 'queue_repetition';
      }

      // If 2 struggles or excessive time/hints, reduce difficulty & simplify choices
      if ((consecutiveStruggles >= 2 || (isSlow && hadHints)) && currentDifficulty > 1) {
        currentDifficulty = (currentDifficulty - 1) as 1 | 2 | 3;
        consecutiveStruggles = 0;
        adjustmentMade = true;
        adjustmentType = 'decrease_difficulty';
        reason = 'Gentle adjustment: simplifying questions to level ' + currentDifficulty + ' with fewer choices and extra cues.';
      } else {
        reason = 'Memory noted for gentle revisit later with supportive clues.';
      }
    }

    const updatedState: AdaptationState = {
      ...currentState,
      currentDifficulty,
      consecutiveSuccess,
      consecutiveStruggles,
      gentleRepetitionQueue: repetitionQueue,
      categoryStrengths,
      lastAdjustmentReason: reason,
      lastUpdated: new Date().toISOString()
    };

    db.updateAdaptationState(attempt.profileId, updatedState);

    // Supportive feedback for elderly user
    const supportiveFeedback = attempt.isCorrect
      ? {
          en: hadHints
            ? 'Wonderful! That gentle clue helped you find the memory.'
            : 'Splendid! You recognized that immediately with such clarity.',
          hi: hadHints
            ? 'बहुत सुंदर! छोटे से संकेत ने इस प्यारी याद को ताज़ा कर दिया।'
            : 'शाबाश! आपने इसे बिना किसी देरी के तुरंत पहचान लिया।'
        }
      : {
          en: 'No worries at all! We will enjoy revisiting this special memory together soon.',
          hi: 'बिल्कुल चिंता मत कीजिए! हम जल्द ही इस खास याद को फिर से मिलकर साझा करेंगे।'
        };

    return {
      updatedState,
      adjustmentMade,
      adjustmentType,
      reason,
      supportiveFeedback
    };
  }
}
