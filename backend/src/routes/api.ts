import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import {
  getMemories,
  getMemoryById,
  createMemory,
  updateMemory,
  deleteMemory
} from '../controllers/memoryController.js';
import {
  getTodayJourney,
  generateGames,
  attemptGame
} from '../controllers/gameController.js';
import { getAdaptationState } from '../controllers/adaptationController.js';
import { getCaregiverDashboard } from '../controllers/caregiverController.js';
import { startSession, endSession } from '../controllers/sessionController.js';
import { resetDemo } from '../controllers/demoController.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'AI-Powered Personal Memory Companion',
    tagline: 'Games That Adapt to the Person, Not the Patient',
    timestamp: new Date().toISOString()
  });
});

// Profile
router.get('/profile', getProfile);
router.get('/profile/:profileId', getProfile);
router.put('/profile', updateProfile);
router.put('/profile/:profileId', updateProfile);

// Memories
router.get('/memories', getMemories);
router.get('/memories/:id', getMemoryById);
router.post('/memories', createMemory);
router.put('/memories/:id', updateMemory);
router.delete('/memories/:id', deleteMemory);

// Games & Cognitive Journey
router.get('/games/today', getTodayJourney);
router.post('/games/generate', generateGames);
router.post('/games/:id/attempt', attemptGame);

// Adaptation Engine
router.get('/adaptation', getAdaptationState);
router.get('/adaptation/:profileId', getAdaptationState);

// Caregiver Dashboard & Insights
router.get('/caregiver/dashboard', getCaregiverDashboard);
router.get('/caregiver/dashboard/:profileId', getCaregiverDashboard);

// Sessions
router.post('/session/start', startSession);
router.post('/session/:id/end', endSession);

// Demo Reset & Quick Seeding
router.post('/demo/reset', resetDemo);

export default router;
