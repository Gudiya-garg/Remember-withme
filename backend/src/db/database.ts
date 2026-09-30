import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  MemoryProfile,
  MemoryItem,
  AdaptationState,
  GameAttempt,
  Session
} from '../types/index.js';
import {
  DEMO_PROFILE_ID,
  INITIAL_DEMO_PROFILE,
  INITIAL_DEMO_MEMORIES,
  INITIAL_ADAPTATION_STATE,
  INITIAL_RECENT_SESSIONS
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface StoreSchema {
  profiles: Record<string, MemoryProfile>;
  memories: Record<string, MemoryItem>;
  adaptationStates: Record<string, AdaptationState>;
  attempts: GameAttempt[];
  sessions: Record<string, Session>;
}

class Database {
  private data: StoreSchema = {
    profiles: {},
    memories: {},
    adaptationStates: {},
    attempts: [],
    sessions: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.resetToSeedData();
      }
    } catch (err) {
      console.warn('Could not read existing store. Reverting to initial seed data.', err);
      this.resetToSeedData();
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store to file:', err);
    }
  }

  public resetToSeedData() {
    this.data = {
      profiles: {
        [DEMO_PROFILE_ID]: { ...INITIAL_DEMO_PROFILE }
      },
      memories: {},
      adaptationStates: {
        [DEMO_PROFILE_ID]: { ...INITIAL_ADAPTATION_STATE }
      },
      attempts: [],
      sessions: {}
    };

    for (const mem of INITIAL_DEMO_MEMORIES) {
      this.data.memories[mem.id] = { ...mem };
    }

    for (const session of INITIAL_RECENT_SESSIONS) {
      this.data.sessions[session.id] = { ...session };
    }

    this.save();
    return this.data;
  }

  // Profiles
  public getProfile(profileId: string = DEMO_PROFILE_ID): MemoryProfile | undefined {
    return this.data.profiles[profileId] || this.data.profiles[DEMO_PROFILE_ID];
  }

  public updateProfile(profileId: string, updates: Partial<MemoryProfile>): MemoryProfile {
    const existing = this.getProfile(profileId) || { ...INITIAL_DEMO_PROFILE, id: profileId };
    const updated: MemoryProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.profiles[profileId] = updated;
    this.save();
    return updated;
  }

  // Memories
  public getAllMemories(profileId: string = DEMO_PROFILE_ID, category?: string): MemoryItem[] {
    const list = Object.values(this.data.memories).filter((m) => m.profileId === profileId);
    if (category) {
      return list.filter((m) => m.category === category);
    }
    return list;
  }

  public getMemoryById(id: string): MemoryItem | undefined {
    return this.data.memories[id];
  }

  public createMemory(item: MemoryItem): MemoryItem {
    this.data.memories[item.id] = item;
    this.save();
    return item;
  }

  public updateMemory(id: string, updates: Partial<MemoryItem>): MemoryItem | undefined {
    const existing = this.data.memories[id];
    if (!existing) return undefined;
    const updated: MemoryItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.memories[id] = updated;
    this.save();
    return updated;
  }

  public deleteMemory(id: string): boolean {
    if (this.data.memories[id]) {
      delete this.data.memories[id];
      this.save();
      return true;
    }
    return false;
  }

  // Adaptation
  public getAdaptationState(profileId: string = DEMO_PROFILE_ID): AdaptationState {
    if (!this.data.adaptationStates[profileId]) {
      this.data.adaptationStates[profileId] = {
        ...INITIAL_ADAPTATION_STATE,
        profileId,
        lastUpdated: new Date().toISOString()
      };
      this.save();
    }
    return this.data.adaptationStates[profileId];
  }

  public updateAdaptationState(profileId: string, updates: Partial<AdaptationState>): AdaptationState {
    const existing = this.getAdaptationState(profileId);
    const updated: AdaptationState = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    this.data.adaptationStates[profileId] = updated;
    this.save();
    return updated;
  }

  // Attempts
  public recordAttempt(attempt: GameAttempt): GameAttempt {
    this.data.attempts.push(attempt);
    this.save();
    return attempt;
  }

  public getAttempts(profileId: string = DEMO_PROFILE_ID): GameAttempt[] {
    return this.data.attempts.filter((a) => a.profileId === profileId);
  }

  // Sessions
  public createSession(session: Session): Session {
    this.data.sessions[session.id] = session;
    this.save();
    return session;
  }

  public updateSession(sessionId: string, updates: Partial<Session>): Session | undefined {
    const existing = this.data.sessions[sessionId];
    if (!existing) return undefined;
    const updated: Session = {
      ...existing,
      ...updates
    };
    this.data.sessions[sessionId] = updated;
    this.save();
    return updated;
  }

  public getSession(sessionId: string): Session | undefined {
    return this.data.sessions[sessionId];
  }

  public getRecentSessions(profileId: string = DEMO_PROFILE_ID, limit: number = 5): Session[] {
    return Object.values(this.data.sessions)
      .filter((s) => s.profileId === profileId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }
}

export const db = new Database();
