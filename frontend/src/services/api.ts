import {
  MemoryProfile,
  MemoryItem,
  Game,
  GameAttemptResult,
  CaregiverDashboardData,
  SessionSummary
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Profile
  async getProfile(profileId: string = 'profile-shanti-devi'): Promise<{ profile: MemoryProfile; richness: any }> {
    const res = await fetch(`${API_BASE}/profile/${profileId}`);
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async updateProfile(profileId: string, updates: Partial<MemoryProfile>): Promise<{ profile: MemoryProfile; richness: any }> {
    const res = await fetch(`${API_BASE}/profile/${profileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Memories
  async getMemories(profileId: string = 'profile-shanti-devi', category?: string): Promise<{ memories: MemoryItem[]; richness: any }> {
    const url = new URL(`${window.location.origin}${API_BASE}/memories`);
    url.searchParams.set('profileId', profileId);
    if (category) url.searchParams.set('category', category);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to load memories');
    return res.json();
  },

  async createMemory(data: Partial<MemoryItem>): Promise<{ memory: MemoryItem; richness: any }> {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, data: Partial<MemoryItem>): Promise<{ memory: MemoryItem; richness: any }> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  // Games & Adaptive Journey
  async getTodayJourney(profileId: string = 'profile-shanti-devi'): Promise<{
    profileName: string;
    currentDifficulty: number;
    repetitionQueuedCount: number;
    games: Game[];
  }> {
    const res = await fetch(`${API_BASE}/games/today?profileId=${profileId}`);
    if (!res.ok) throw new Error('Failed to fetch today journey');
    return res.json();
  },

  async generateGames(profileId: string = 'profile-shanti-devi', difficultyLevel?: number): Promise<{ games: Game[] }> {
    const res = await fetch(`${API_BASE}/games/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, difficultyLevel })
    });
    if (!res.ok) throw new Error('Failed to generate games');
    return res.json();
  },

  async attemptGame(gameId: string, payload: {
    profileId?: string;
    sessionId?: string;
    gameType: string;
    memoryRefId?: string;
    selectedChoiceId?: string;
    isCorrect: boolean;
    responseTimeMs: number;
    hintsUsed: number;
    skipped?: boolean;
  }): Promise<GameAttemptResult> {
    const res = await fetch(`${API_BASE}/games/${gameId}/attempt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit game attempt');
    return res.json();
  },

  // Caregiver Dashboard
  async getCaregiverDashboard(profileId: string = 'profile-shanti-devi'): Promise<{ dashboard: CaregiverDashboardData }> {
    const res = await fetch(`${API_BASE}/caregiver/dashboard/${profileId}`);
    if (!res.ok) throw new Error('Failed to load caregiver dashboard');
    return res.json();
  },

  // Sessions
  async startSession(profileId: string = 'profile-shanti-devi'): Promise<{ session: any }> {
    const res = await fetch(`${API_BASE}/session/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId })
    });
    if (!res.ok) throw new Error('Failed to start session');
    return res.json();
  },

  async endSession(sessionId: string, payload: {
    gamesAttempted: number;
    gamesCompleted: number;
    memoriesRevisited: number;
    totalHints: number;
    avgResponseTimeMs: number;
  }): Promise<{ summary: SessionSummary }> {
    const res = await fetch(`${API_BASE}/session/${sessionId}/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to end session');
    return res.json();
  },

  // Demo Restore
  async resetDemo(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset demo data');
    return res.json();
  }
};
