import { MemoryProfile, MemoryItem, AdaptationState, Session } from '../types/index.js';

export const DEMO_PROFILE_ID = 'profile-shanti-devi';

export const INITIAL_DEMO_PROFILE: MemoryProfile = {
  id: DEMO_PROFILE_ID,
  name: 'Shanti Devi',
  ageRange: '75-80',
  preferredLanguage: 'hi',
  stage: 'mild_mci',
  caregiverName: 'Dr. Aarav Sharma & Family',
  notes: 'Enjoys listening to 1970s classic melodies, loves talking about her granddaughter’s art and gardening.',
  createdAt: '2026-09-15T08:00:00.000Z',
  updatedAt: '2026-09-30T09:00:00.000Z'
};

export const INITIAL_DEMO_MEMORIES: MemoryItem[] = [
  // People
  {
    id: 'mem-person-1',
    profileId: DEMO_PROFILE_ID,
    category: 'person',
    title: 'Meena',
    relationship: 'Daughter',
    description: 'She visits every Sunday afternoon, sits on the cane chair on the veranda, and brings freshly made warm carrot halwa (gajar ka halwa).',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    peopleInvolved: ['Meena'],
    subType: 'place',
    tags: ['family', 'daughter', 'sunday', 'halwa'],
    recallStats: {
      totalAttempts: 12,
      correctCount: 11,
      hintCount: 1,
      lastRecalledAt: '2026-09-29T16:20:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T08:30:00.000Z',
    updatedAt: '2026-09-29T16:20:00.000Z'
  },
  {
    id: 'mem-person-2',
    profileId: DEMO_PROFILE_ID,
    category: 'person',
    title: 'Rajesh',
    relationship: 'Son',
    description: 'He works in Bengaluru and makes a video call every evening at 8:00 PM without fail to ask about dinner and blood pressure medicine.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    peopleInvolved: ['Rajesh'],
    tags: ['family', 'son', 'evening call'],
    recallStats: {
      totalAttempts: 10,
      correctCount: 9,
      hintCount: 2,
      lastRecalledAt: '2026-09-28T18:10:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T08:35:00.000Z',
    updatedAt: '2026-09-28T18:10:00.000Z'
  },
  {
    id: 'mem-person-3',
    profileId: DEMO_PROFILE_ID,
    category: 'person',
    title: 'Anil',
    relationship: 'Grandson',
    description: 'He is in college studying engineering. When he visits on holidays, he sets up the wooden chess board and asks Dadi to narrate stories of old Shimla.',
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    peopleInvolved: ['Anil'],
    tags: ['family', 'grandson', 'chess', 'stories'],
    recallStats: {
      totalAttempts: 8,
      correctCount: 6,
      hintCount: 3,
      lastRecalledAt: '2026-09-27T11:45:00.000Z',
      status: 'improving'
    },
    createdAt: '2026-09-15T08:40:00.000Z',
    updatedAt: '2026-09-27T11:45:00.000Z'
  },

  // Places
  {
    id: 'mem-place-1',
    profileId: DEMO_PROFILE_ID,
    category: 'place',
    title: 'Courtyard & Veranda with Tulsi Plant',
    relationship: 'Favorite Corner at Home',
    description: 'The sunlit veranda facing the blooming marigolds where she sits every morning with a warm copper brass cup of tea.',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    subType: 'place',
    tags: ['home', 'tulsi', 'morning', 'sunlight'],
    recallStats: {
      totalAttempts: 9,
      correctCount: 9,
      hintCount: 0,
      lastRecalledAt: '2026-09-29T10:15:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T09:00:00.000Z',
    updatedAt: '2026-09-29T10:15:00.000Z'
  },
  {
    id: 'mem-place-2',
    profileId: DEMO_PROFILE_ID,
    category: 'place',
    title: 'The Ancient Shiva Temple',
    relationship: 'Sacred Walking Sanctuary',
    description: 'The ancient stone temple with morning bells ringing where she used to walk with her sister Savitri carrying fresh bilva leaves.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
    subType: 'place',
    tags: ['temple', 'spiritual', 'morning walk', 'bells'],
    recallStats: {
      totalAttempts: 7,
      correctCount: 5,
      hintCount: 2,
      lastRecalledAt: '2026-09-28T09:30:00.000Z',
      status: 'improving'
    },
    createdAt: '2026-09-15T09:10:00.000Z',
    updatedAt: '2026-09-28T09:30:00.000Z'
  },
  {
    id: 'mem-place-3',
    profileId: DEMO_PROFILE_ID,
    category: 'place',
    title: 'Agra - The Taj Mahal Garden',
    relationship: 'Unforgettable Anniversary Trip',
    description: 'Visited in the winter of 1968 with her late husband Anand. Remembered the cool marble benches and reflection in the water ponds.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
    subType: 'place',
    tags: ['travel', 'agra', 'anand', 'heritage'],
    recallStats: {
      totalAttempts: 5,
      correctCount: 3,
      hintCount: 3,
      lastRecalledAt: '2026-09-26T15:00:00.000Z',
      status: 'needs_repetition'
    },
    createdAt: '2026-09-15T09:15:00.000Z',
    updatedAt: '2026-09-26T15:00:00.000Z'
  },

  // Favorites
  {
    id: 'mem-fav-1',
    profileId: DEMO_PROFILE_ID,
    category: 'favorite',
    title: 'Kabhi Kabhie Mere Dil Mein',
    relationship: 'Favorite Song by Mukesh & Lata',
    description: 'The golden romantic melody played on the old Murphy radio. She loves humming the melody while knitting woolen cardigans.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    subType: 'song',
    tags: ['music', 'old songs', 'radio', 'peaceful'],
    recallStats: {
      totalAttempts: 8,
      correctCount: 7,
      hintCount: 1,
      lastRecalledAt: '2026-09-29T16:25:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T09:30:00.000Z',
    updatedAt: '2026-09-29T16:25:00.000Z'
  },
  {
    id: 'mem-fav-2',
    profileId: DEMO_PROFILE_ID,
    category: 'favorite',
    title: 'Marigold and Jasmine Gardening',
    relationship: 'Beloved Morning Hobby',
    description: 'Tending golden marigolds (genda phool) and white mogra flowers in clay pots, carefully plucking petals for the altar.',
    imageUrl: 'https://images.unsplash.com/photo-1596726696434-601d84b008d5?auto=format&fit=crop&w=600&q=80',
    subType: 'hobby',
    tags: ['flowers', 'garden', 'plants', 'jasmine'],
    recallStats: {
      totalAttempts: 6,
      correctCount: 5,
      hintCount: 1,
      lastRecalledAt: '2026-09-28T11:00:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T09:35:00.000Z',
    updatedAt: '2026-09-28T11:00:00.000Z'
  },
  {
    id: 'mem-fav-3',
    profileId: DEMO_PROFILE_ID,
    category: 'favorite',
    title: 'Moong Dal Khichdi with Ghee',
    relationship: 'Comfort Food',
    description: 'Warm yellow khichdi served in a kansa bowl topped with two large spoons of homemade cow ghee and sweet-sour mango relish.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    subType: 'food',
    tags: ['comfort food', 'khichdi', 'ghee'],
    recallStats: {
      totalAttempts: 4,
      correctCount: 4,
      hintCount: 0,
      lastRecalledAt: '2026-09-27T13:00:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T09:40:00.000Z',
    updatedAt: '2026-09-27T13:00:00.000Z'
  },

  // Events
  {
    id: 'mem-event-1',
    profileId: DEMO_PROFILE_ID,
    category: 'event',
    title: 'Daughter Meena’s Wedding in Jaipur',
    relationship: 'Special Family Milestone',
    yearOrTime: 'Winter 1982',
    peopleInvolved: ['Meena', 'Rajesh', 'Anand'],
    description: 'The courtyards were draped with marigold garlands. Meena wore a rose-pink silk lehenga and danced with her younger brother Rajesh.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    tags: ['wedding', 'jaipur', 'celebration', 'daughter'],
    recallStats: {
      totalAttempts: 7,
      correctCount: 6,
      hintCount: 2,
      lastRecalledAt: '2026-09-29T16:40:00.000Z',
      status: 'improving'
    },
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-29T16:40:00.000Z'
  },
  {
    id: 'mem-event-2',
    profileId: DEMO_PROFILE_ID,
    category: 'event',
    title: 'Grandson Anil’s Engineering Graduation',
    relationship: 'Proud Grandparent Moment',
    yearOrTime: 'Summer 2023',
    peopleInvolved: ['Anil', 'Meena', 'Rajesh'],
    description: 'The whole family travelled together to the university hall. Anil placed his black graduation cap gently on Dadi’s head.',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    tags: ['graduation', 'anil', 'pride', 'degree'],
    recallStats: {
      totalAttempts: 5,
      correctCount: 3,
      hintCount: 3,
      lastRecalledAt: '2026-09-25T14:15:00.000Z',
      status: 'needs_repetition'
    },
    createdAt: '2026-09-15T10:10:00.000Z',
    updatedAt: '2026-09-25T14:15:00.000Z'
  },

  // Routines
  {
    id: 'mem-routine-1',
    profileId: DEMO_PROFILE_ID,
    category: 'routine',
    title: 'Morning Ginger Tea & Watering the Tulsi',
    relationship: 'Daily Morning Rhythm (7:00 AM)',
    routineTime: 'morning',
    yearOrTime: '7:00 AM Every Morning',
    description: 'Wake up, sip warm ginger-cardamom tea on the veranda, and gently offer clean water to the holy green Tulsi plant.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    tags: ['routine', 'morning', 'tea', 'tulsi'],
    recallStats: {
      totalAttempts: 11,
      correctCount: 11,
      hintCount: 0,
      lastRecalledAt: '2026-09-30T07:15:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T10:30:00.000Z',
    updatedAt: '2026-09-30T07:15:00.000Z'
  },
  {
    id: 'mem-routine-2',
    profileId: DEMO_PROFILE_ID,
    category: 'routine',
    title: 'Afternoon Radio & Quiet Rest',
    relationship: 'Daily Afternoon Rhythm (1:30 PM)',
    routineTime: 'afternoon',
    yearOrTime: '1:30 PM After Lunch',
    description: 'Enjoy a light meal of soft phulkas, tune into the vintage songs broadcast, and rest for 30 peaceful minutes on the divan.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    tags: ['routine', 'afternoon', 'radio', 'rest'],
    recallStats: {
      totalAttempts: 8,
      correctCount: 6,
      hintCount: 2,
      lastRecalledAt: '2026-09-29T14:00:00.000Z',
      status: 'improving'
    },
    createdAt: '2026-09-15T10:35:00.000Z',
    updatedAt: '2026-09-29T14:00:00.000Z'
  },
  {
    id: 'mem-routine-3',
    profileId: DEMO_PROFILE_ID,
    category: 'routine',
    title: 'Evening Brass Bell Aarti & Son’s Call',
    relationship: 'Daily Evening Rhythm (7:30 PM)',
    routineTime: 'evening',
    yearOrTime: '7:30 PM Twilight',
    description: 'Light a small ghee lamp for prayer, ring the brass bell, and sit by the phone waiting for Rajesh’s daily video call from Bengaluru.',
    imageUrl: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80',
    tags: ['routine', 'evening', 'prayer', 'rajesh call'],
    recallStats: {
      totalAttempts: 9,
      correctCount: 8,
      hintCount: 1,
      lastRecalledAt: '2026-09-29T19:40:00.000Z',
      status: 'strong'
    },
    createdAt: '2026-09-15T10:40:00.000Z',
    updatedAt: '2026-09-29T19:40:00.000Z'
  }
];

export const INITIAL_ADAPTATION_STATE: AdaptationState = {
  profileId: DEMO_PROFILE_ID,
  currentDifficulty: 1,
  consecutiveSuccess: 2,
  consecutiveStruggles: 0,
  gentleRepetitionQueue: ['mem-place-3', 'mem-event-2'],
  categoryStrengths: {
    person: 'strong',
    routine: 'strong',
    favorite: 'strong',
    place: 'improving',
    event: 'needs_repetition'
  },
  lastAdjustmentReason: 'Consistent recognition of family members Meena and Rajesh; gently reintroducing Agra and graduation memories with simplified clues.',
  lastUpdated: '2026-09-30T08:30:00.000Z'
};

export const INITIAL_RECENT_SESSIONS: Session[] = [
  {
    id: 'session-demo-yesterday',
    profileId: DEMO_PROFILE_ID,
    startedAt: '2026-09-29T16:15:00.000Z',
    endedAt: '2026-09-29T16:27:00.000Z',
    gamesAttempted: 5,
    gamesCompleted: 5,
    memoriesRevisited: 4,
    totalHints: 2,
    avgResponseTimeMs: 4200,
    feedbackNote: {
      en: 'Wonderful session! Shanti smiled warmly when recognizing Meena and humming the classic song.',
      hi: 'बहुत ही सुंदर सत्र! शांति जी ने मीना को पहचानते हुए मुस्कुराया और पुराना गीत गुनगुनाया।'
    },
    suggestedNextActivity: {
      en: 'Tomorrow morning, let’s revisit the serene memories of the Shiva temple and the morning tea routine.',
      hi: 'कल सुबह, हम शिव मंदिर की शांतिपूर्ण यादों और सुबह की चाय की दिनचर्या को दोहराएंगे।'
    },
    isComplete: true
  }
];
