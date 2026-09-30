import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { MemoryAgent } from '../agents/memoryAgent.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.params.profileId as string) || DEMO_PROFILE_ID;
    const profile = db.getProfile(profileId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const memories = db.getAllMemories(profileId);
    const richness = MemoryAgent.calculateRichness(memories);

    res.json({
      success: true,
      profile,
      richness
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.params.profileId as string) || DEMO_PROFILE_ID;
    const updated = db.updateProfile(profileId, req.body);
    const memories = db.getAllMemories(profileId);
    const richness = MemoryAgent.calculateRichness(memories);

    res.json({
      success: true,
      profile: updated,
      richness
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
