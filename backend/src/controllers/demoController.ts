import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';
import { CaregiverInsightAgent } from '../agents/caregiverInsightAgent.js';

export const resetDemo = async (req: Request, res: Response): Promise<void> => {
  try {
    db.resetToSeedData();
    const dashboard = CaregiverInsightAgent.generateDashboard(DEMO_PROFILE_ID);

    res.json({
      success: true,
      message: 'Demo profile for Shanti Devi successfully restored to clean baseline.',
      profileId: DEMO_PROFILE_ID,
      dashboard
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset demo data' });
  }
};
