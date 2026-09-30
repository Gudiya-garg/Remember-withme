import { Request, Response } from 'express';
import { CaregiverInsightAgent } from '../agents/caregiverInsightAgent.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';

export const getCaregiverDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.params.profileId as string) || DEMO_PROFILE_ID;
    const dashboardData = CaregiverInsightAgent.generateDashboard(profileId);
    res.json({
      success: true,
      dashboard: dashboardData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate caregiver dashboard' });
  }
};
