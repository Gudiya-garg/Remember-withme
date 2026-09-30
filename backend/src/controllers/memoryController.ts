import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { MemoryAgent } from '../agents/memoryAgent.js';
import { DEMO_PROFILE_ID } from '../db/seedData.js';
import { MemoryCategory } from '../types/index.js';

export const getMemories = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.query.profileId as string) || DEMO_PROFILE_ID;
    const category = req.query.category as MemoryCategory | undefined;

    const memories = db.getAllMemories(profileId, category);
    const richness = MemoryAgent.calculateRichness(memories);

    res.json({
      success: true,
      count: memories.length,
      memories,
      richness
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve memories' });
  }
};

export const getMemoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const memory = db.getMemoryById(req.params.id as string);
    if (!memory) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }
    res.json({ success: true, memory });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve memory' });
  }
};

export const createMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = (req.body.profileId as string) || DEMO_PROFILE_ID;
    const profile = db.getProfile(profileId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const processed = MemoryAgent.processNewMemory(req.body, profile);
    const created = db.createMemory(processed);

    const allMemories = db.getAllMemories(profileId);
    const richness = MemoryAgent.calculateRichness(allMemories);

    res.status(201).json({
      success: true,
      memory: created,
      richness,
      message: 'Memory added successfully. Your memory profile is becoming richer!'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create memory' });
  }
};

export const updateMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = db.updateMemory(req.params.id as string, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    const allMemories = db.getAllMemories(updated.profileId);
    const richness = MemoryAgent.calculateRichness(allMemories);

    res.json({
      success: true,
      memory: updated,
      richness
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update memory' });
  }
};

export const deleteMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const memory = db.getMemoryById(req.params.id as string);
    if (!memory) {
      res.status(404).json({ error: 'Memory not found' });
      return;
    }

    const profileId = memory.profileId;
    db.deleteMemory(req.params.id as string);

    const allMemories = db.getAllMemories(profileId);
    const richness = MemoryAgent.calculateRichness(allMemories);

    res.json({
      success: true,
      message: 'Memory removed successfully',
      richness
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete memory' });
  }
};
