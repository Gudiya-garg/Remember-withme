import { MemoryItem, MemoryProfile, MemoryCategory } from '../types/index.js';

export interface MemoryRichness {
  percentage: number;
  label: string;
  details: {
    people: number;
    places: number;
    favorites: number;
    events: number;
    routines: number;
  };
  suggestions: string[];
}

export class MemoryAgent {
  /**
   * Evaluates how rich the memory profile is and returns actionable recommendations
   * for the caregiver to enrich cognitive games.
   */
  public static calculateRichness(memories: MemoryItem[]): MemoryRichness {
    const details = {
      people: memories.filter((m) => m.category === 'person').length,
      places: memories.filter((m) => m.category === 'place').length,
      favorites: memories.filter((m) => m.category === 'favorite').length,
      events: memories.filter((m) => m.category === 'event').length,
      routines: memories.filter((m) => m.category === 'routine').length
    };

    // Calculate score based on healthy diversity across categories
    let points = 0;
    if (details.people >= 1) points += 20;
    if (details.people >= 3) points += 10;
    if (details.places >= 1) points += 15;
    if (details.favorites >= 1) points += 15;
    if (details.events >= 1) points += 15;
    if (details.routines >= 1) points += 15;
    if (memories.some((m) => !!m.imageUrl)) points += 10;

    const percentage = Math.min(100, points);

    let label = 'Getting Started';
    if (percentage >= 85) label = 'Rich & Deeply Personalized';
    else if (percentage >= 60) label = 'Good Coverage';
    else if (percentage >= 35) label = 'Developing Profile';

    const suggestions: string[] = [];
    if (details.people < 2) {
      suggestions.push('Add another close family member or friend to broaden face-recognition activities.');
    }
    if (details.routines < 2) {
      suggestions.push('Add morning and evening routines for interactive time-sequencing games.');
    }
    if (details.favorites < 1) {
      suggestions.push('Add favorite classic songs or comfort foods to trigger joyful sensory recall.');
    }
    if (details.places < 2) {
      suggestions.push('Add a cherished hometown or travel memory place.');
    }

    return { percentage, label, details, suggestions };
  }

  /**
   * Pre-processes caregiver input, ensuring safe defaults and clean tag extraction.
   */
  public static processNewMemory(item: Partial<MemoryItem>, profile: MemoryProfile): MemoryItem {
    const now = new Date().toISOString();
    const tags = new Set<string>(item.tags || []);

    if (item.relationship) tags.add(item.relationship.toLowerCase());
    if (item.category) tags.add(item.category);
    if (item.subType) tags.add(item.subType);

    return {
      id: item.id || `mem-${item.category || 'item'}-${Date.now()}`,
      profileId: profile.id,
      category: item.category || 'person',
      title: item.title?.trim() || 'Familiar Memory',
      relationship: item.relationship?.trim(),
      description: item.description?.trim() || '',
      imageUrl: item.imageUrl || '',
      yearOrTime: item.yearOrTime || '',
      peopleInvolved: item.peopleInvolved || [],
      routineTime: item.routineTime,
      subType: item.subType,
      tags: Array.from(tags),
      recallStats: item.recallStats || {
        totalAttempts: 0,
        correctCount: 0,
        hintCount: 0,
        status: 'improving'
      },
      createdAt: item.createdAt || now,
      updatedAt: now
    };
  }
}
