import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { Session, LocalizedString } from '../types/index.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';

export const startSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.body.profileId as string) || DEMO_PROFILE_ID;
    const session: Session = {
      id: `sess-${Date.now()}`,
      profileId,
      startedAt: new Date().toISOString(),
      gamesAttempted: 0,
      gamesCompleted: 0,
      memoriesRevisited: 0,
      totalHints: 0,
      avgResponseTimeMs: 0,
      feedbackNote: {
        en: 'Session commenced peacefully.',
        hi: 'सत्र शांतिपूर्वक प्रारंभ हुआ।'
      },
      suggestedNextActivity: {
        en: 'Continue exploring familiar family moments.',
        hi: 'परिवार के प्यारे पलों को याद करना जारी रखें।'
      },
      isComplete: false
    };

    db.createSession(session);
    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
};

export const endSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.id as string;
    const {
      gamesAttempted = 0,
      gamesCompleted = 0,
      memoriesRevisited = 0,
      totalHints = 0,
      avgResponseTimeMs = 3500
    } = req.body;

    const feedbackNote: LocalizedString = {
      en: `You revisited ${memoriesRevisited} precious memories today with such calm and grace. Every familiar face brings warmth to the heart.`,
      hi: `आपने आज ${memoriesRevisited} अनमोल यादों को इतनी सहजता और खुशी के साथ फिर से ताज़ा किया। हर जाना-पहचाना चेहरा दिल को सुकून देता है।`
    };

    const suggestedNextActivity: LocalizedString = {
      en: 'Next time, we will revisit your peaceful morning routine and beloved vintage melodies.',
      hi: 'अगली बार, हम आपकी सुबह की शांत दिनचर्या और पसंदीदा पुराने गीतों को याद करेंगे।'
    };

    const updated = db.updateSession(sessionId, {
      endedAt: new Date().toISOString(),
      gamesAttempted,
      gamesCompleted,
      memoriesRevisited,
      totalHints,
      avgResponseTimeMs,
      feedbackNote,
      suggestedNextActivity,
      isComplete: true
    });

    res.json({
      success: true,
      summary: updated || {
        id: sessionId,
        memoriesRevisited,
        gamesCompleted,
        totalHints,
        feedbackNote,
        suggestedNextActivity
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end session' });
  }
};
