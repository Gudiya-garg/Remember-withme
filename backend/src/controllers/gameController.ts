import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { GameGenerationAgent } from '../agents/gameGenerationAgent.js';
import { AdaptationAgent } from '../agents/adaptationAgent.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';
import { GameAttempt } from '../types/index.js';

export const getTodayJourney = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.query.profileId as string) || DEMO_PROFILE_ID;
    const profile = db.getProfile(profileId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const memories = db.getAllMemories(profileId);
    const adaptationState = db.getAdaptationState(profileId);

    const games = GameGenerationAgent.generateDailyJourney(
      profile,
      memories,
      adaptationState.currentDifficulty,
      adaptationState.gentleRepetitionQueue
    );

    res.json({
      success: true,
      profileName: profile.name,
      currentDifficulty: adaptationState.currentDifficulty,
      repetitionQueuedCount: adaptationState.gentleRepetitionQueue.length,
      games
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate today journey' });
  }
};

export const generateGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.body.profileId as string) || DEMO_PROFILE_ID;
    const requestedLevel = req.body.difficultyLevel;

    const profile = db.getProfile(profileId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const memories = db.getAllMemories(profileId);
    const adaptationState = db.getAdaptationState(profileId);

    const level = requestedLevel || adaptationState.currentDifficulty;
    const games = GameGenerationAgent.generateDailyJourney(
      profile,
      memories,
      level,
      adaptationState.gentleRepetitionQueue
    );

    res.json({
      success: true,
      difficultyLevel: level,
      games
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate games' });
  }
};

export const attemptGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameId = req.params.id as string;
    const {
      profileId = DEMO_PROFILE_ID,
      sessionId = `session-${Date.now()}`,
      gameType,
      memoryRefId,
      selectedChoiceId,
      isCorrect,
      responseTimeMs = 3000,
      hintsUsed = 0,
      skipped = false
    } = req.body;

    const attempt: GameAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      gameId,
      profileId,
      sessionId,
      gameType,
      memoryRefId,
      selectedChoiceId,
      isCorrect,
      responseTimeMs,
      hintsUsed,
      skipped,
      timestamp: new Date().toISOString()
    };

    // Record in DB
    db.recordAttempt(attempt);

    // Run transparent adaptive engine
    const adaptationResult = AdaptationAgent.processAttempt(attempt);

    res.json({
      success: true,
      attempt,
      adaptation: {
        adjustmentMade: adaptationResult.adjustmentMade,
        adjustmentType: adaptationResult.adjustmentType,
        reason: adaptationResult.reason,
        currentDifficulty: adaptationResult.updatedState.currentDifficulty,
        repetitionQueue: adaptationResult.updatedState.gentleRepetitionQueue
      },
      supportiveFeedback: adaptationResult.supportiveFeedback
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process game attempt' });
  }
};
