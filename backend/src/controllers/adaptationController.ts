import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';

export const getAdaptationState = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.params.profileId as string) || DEMO_PROFILE_ID;
    const state = db.getAdaptationState(profileId);
    res.json({
      success: true,
      adaptationState: state
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve adaptation state' });
  }
};
