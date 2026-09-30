import { Game, GameType, MemoryItem, MemoryProfile, LocalizedString } from '../types/index.js';

export class GameGenerationAgent {
  /**
   * Generates a personalized daily memory journey consisting of curated games
   * tailored to the person's stored memories and current adaptive level.
   */
  public static generateDailyJourney(
    profile: MemoryProfile,
    memories: MemoryItem[],
    difficultyLevel: 1 | 2 | 3 = 1,
    gentleRepetitionIds: string[] = []
  ): Game[] {
    const games: Game[] = [];

    // Prioritize memories from gentle repetition queue first if available
    const repetitionMemories = memories.filter((m) => gentleRepetitionIds.includes(m.id));
    const regularMemories = memories.filter((m) => !gentleRepetitionIds.includes(m.id));

    // 1. Who Is This? (Person memory)
    const personMems = memories.filter((m) => m.category === 'person');
    if (personMems.length > 0) {
      // Pick first person
      const targetPerson = personMems[0];
      const otherPeople = personMems.slice(1).map((p) => p.title);
      games.push(this.createWhoIsThisGame(profile, targetPerson, otherPeople, difficultyLevel));
    }

    // 2. Memory Match
    if (memories.length >= 3) {
      games.push(this.createMemoryMatchGame(profile, memories, difficultyLevel));
    }

    // 3. Complete the Memory (Event or Person story)
    const eventMems = memories.filter((m) => m.category === 'event');
    if (eventMems.length > 0) {
      games.push(this.createCompleteTheMemoryGame(profile, eventMems[0], difficultyLevel));
    } else if (memories.some((m) => m.category === 'favorite')) {
      const fav = memories.find((m) => m.category === 'favorite')!;
      games.push(this.createCompleteTheMemoryGame(profile, fav, difficultyLevel));
    }

    // 4. Sequence My Day (Routine memories)
    const routineMems = memories.filter((m) => m.category === 'routine');
    if (routineMems.length >= 2) {
      games.push(this.createSequenceMyDayGame(profile, routineMems, difficultyLevel));
    }

    // 5. Place & Memory
    const placeMems = memories.filter((m) => m.category === 'place');
    if (placeMems.length > 0) {
      const otherPlaces = placeMems.slice(1).map((p) => p.title);
      games.push(this.createPlaceAndMemoryGame(profile, placeMems[0], otherPlaces, difficultyLevel));
    }

    // 6. Music Memory
    const musicMem = memories.find((m) => m.category === 'favorite' && (m.subType === 'song' || m.tags?.includes('music')));
    if (musicMem) {
      games.push(this.createMusicMemoryGame(profile, musicMem, difficultyLevel));
    }

    // 7. Story Recall
    const storySource = personMems.find((p) => p.title.toLowerCase().includes('meena')) || personMems[0] || memories[0];
    if (storySource) {
      games.push(this.createStoryRecallGame(profile, storySource, difficultyLevel));
    }

    // Return the curated set of personalized games
    return games;
  }

  // --- Game Generators ---

  private static createWhoIsThisGame(
    profile: MemoryProfile,
    target: MemoryItem,
    distractorNames: string[],
    level: 1 | 2 | 3
  ): Game {
    const distractors = distractorNames.length > 0 ? distractorNames : ['Sunita', 'Kamla', 'Ramesh'];
    const choices = [
      {
        id: 'c-correct',
        label: {
          en: `${target.title} (${target.relationship || 'Family'})`,
          hi: `${target.title} (${target.relationship || 'परिवारजन'})`
        },
        isCorrect: true
      },
      {
        id: 'c-dist-1',
        label: {
          en: `${distractors[0]} (Neighbor)`,
          hi: `${distractors[0]} (पड़ोसी)`
        },
        isCorrect: false
      }
    ];

    if (level > 1 && distractors.length > 1) {
      choices.push({
        id: 'c-dist-2',
        label: {
          en: `${distractors[1]} (Old Friend)`,
          hi: `${distractors[1]} (पुरानी सहेली)`
        },
        isCorrect: false
      });
    }

    // Shuffle choices deterministically
    choices.sort(() => 0.5 - Math.random());

    return {
      id: `game-who-${target.id}`,
      profileId: profile.id,
      type: 'who_is_this',
      difficultyLevel: level,
      title: {
        en: 'Who Is This?',
        hi: 'यह कौन हैं?'
      },
      prompt: {
        en: `Do you recognize this dear face? Who is she to you?`,
        hi: `क्या आप इस प्यारे चेहरे को पहचानते हैं? यह आपकी कौन हैं?`
      },
      supportiveHint: {
        en: `${target.description.slice(0, 85)}...`,
        hi: `संकेत: ${target.description.slice(0, 85)}...`
      },
      imageUrl: target.imageUrl,
      memoryRefId: target.id,
      memoryCategory: 'person',
      choices,
      metadata: {
        personName: target.title,
        relationship: target.relationship
      }
    };
  }

  private static createMemoryMatchGame(
    profile: MemoryProfile,
    memories: MemoryItem[],
    level: 1 | 2 | 3
  ): Game {
    const candidates = memories.slice(0, level === 1 ? 3 : 4);
    const matchPairs = candidates.map((m, idx) => ({
      id: `pair-${m.id}`,
      label: {
        en: m.relationship ? `${m.title} — ${m.relationship}` : m.title,
        hi: m.relationship ? `${m.title} — ${m.relationship}` : m.title
      },
      matchId: `match-${idx}`,
      image: m.imageUrl
    }));

    return {
      id: `game-match-${Date.now()}`,
      profileId: profile.id,
      type: 'memory_match',
      difficultyLevel: level,
      title: {
        en: 'Memory Match',
        hi: 'यादों का मिलान'
      },
      prompt: {
        en: 'Tap on matching pairs from your life and family memories.',
        hi: 'अपने जीवन और परिवार की जुड़ी हुई यादों के सही जोड़े बनाइए।'
      },
      supportiveHint: {
        en: 'Look at the faces and roles. Take all the time you need.',
        hi: 'चेहरों और रिश्तों को ध्यान से देखिए। कोई जल्दी नहीं है।'
      },
      memoryCategory: 'person',
      matchPairs
    };
  }

  private static createCompleteTheMemoryGame(
    profile: MemoryProfile,
    target: MemoryItem,
    level: 1 | 2 | 3
  ): Game {
    const isWedding = target.title.toLowerCase().includes('wedding');

    const prompt: LocalizedString = isWedding
      ? {
          en: `At daughter Meena’s wedding in Jaipur, she wore a beautiful...`,
          hi: `जयपुर में बेटी मीना की शादी में, उन्होंने पहना था एक सुंदर...`
        }
      : {
          en: `When remembering ${target.title}, a special tradition was...`,
          hi: `${target.title} को याद करते हुए, एक खास परंपरा थी...`
        };

    const choices = isWedding
      ? [
          {
            id: 'c-correct',
            label: {
              en: 'Rose-pink silk lehenga with golden zari',
              hi: 'गुलाबी रेशमी लहंगा सुनहरी ज़री के साथ'
            },
            isCorrect: true
          },
          {
            id: 'c-dist-1',
            label: {
              en: 'Blue woolen shawl with silver border',
              hi: 'नीली ऊनी शॉल चांदी की किनारी वाली'
            },
            isCorrect: false
          }
        ]
      : [
          {
            id: 'c-correct',
            label: {
              en: target.description.split('.')[0] || 'A joyful family celebration',
              hi: target.description.split('.')[0] || 'एक आनंदमय पारिवारिक उत्सव'
            },
            isCorrect: true
          },
          {
            id: 'c-dist-1',
            label: {
              en: 'A quiet rainy evening indoors',
              hi: 'घर के अंदर एक शांत बरसाती शाम'
            },
            isCorrect: false
          }
        ];

    return {
      id: `game-complete-${target.id}`,
      profileId: profile.id,
      type: 'complete_the_memory',
      difficultyLevel: level,
      title: {
        en: 'Complete The Memory',
        hi: 'याद को पूरा कीजिए'
      },
      prompt,
      supportiveHint: {
        en: `Remember: ${target.yearOrTime || 'Winter season'} — ${target.description.slice(0, 70)}...`,
        hi: `याद कीजिए: ${target.yearOrTime || 'सर्दियों का मौसम'} — ${target.description.slice(0, 70)}...`
      },
      imageUrl: target.imageUrl,
      memoryRefId: target.id,
      memoryCategory: target.category,
      choices
    };
  }

  private static createSequenceMyDayGame(
    profile: MemoryProfile,
    routines: MemoryItem[],
    level: 1 | 2 | 3
  ): Game {
    const sequenceItems = [
      {
        id: 'seq-1',
        label: {
          en: 'Morning Ginger Tea & Watering the Tulsi plant',
          hi: 'सुबह की अदरक वाली चाय और तुलसी में जल अर्पित करना'
        },
        correctOrder: 1,
        timeBadge: '7:00 AM'
      },
      {
        id: 'seq-2',
        label: {
          en: 'Afternoon Soft Meal & Vintage Radio Music',
          hi: 'दोपहर का हल्का भोजन और रेडियो पर पुराने गीत'
        },
        correctOrder: 2,
        timeBadge: '1:30 PM'
      },
      {
        id: 'seq-3',
        label: {
          en: 'Evening Prayer Aarti & Son Rajesh’s Video Call',
          hi: 'शाम की आरती और बेटे राजेश का वीडियो कॉल'
        },
        correctOrder: 3,
        timeBadge: '7:30 PM'
      }
    ];

    return {
      id: `game-sequence-${Date.now()}`,
      profileId: profile.id,
      type: 'sequence_my_day',
      difficultyLevel: level,
      title: {
        en: 'Sequence My Day',
        hi: 'दिन की दिनचर्या सजाइए'
      },
      prompt: {
        en: 'Arrange your familiar daily moments in order from morning to night.',
        hi: 'सुबह से रात तक की अपनी जानी-पहचानी दिनचर्या को सही क्रम में लगाइए।'
      },
      supportiveHint: {
        en: 'Start with the morning tea in the courtyard veranda.',
        hi: 'आंगन में सुबह की चाय से शुरुआत कीजिए।'
      },
      memoryCategory: 'routine',
      sequenceItems
    };
  }

  private static createPlaceAndMemoryGame(
    profile: MemoryProfile,
    target: MemoryItem,
    otherPlaces: string[],
    level: 1 | 2 | 3
  ): Game {
    const distractors = otherPlaces.length > 0 ? otherPlaces : ['Shimla Mall Road', 'Jaipur Palace'];

    const choices = [
      {
        id: 'c-correct',
        label: {
          en: target.title,
          hi: target.title
        },
        isCorrect: true
      },
      {
        id: 'c-dist-1',
        label: {
          en: distractors[0] || 'Shimla Mall Road',
          hi: distractors[0] || 'शिमला मॉल रोड'
        },
        isCorrect: false
      }
    ];

    if (level > 1 && distractors.length > 1) {
      choices.push({
        id: 'c-dist-2',
        label: {
          en: distractors[1],
          hi: distractors[1]
        },
        isCorrect: false
      });
    }

    choices.sort(() => 0.5 - Math.random());

    return {
      id: `game-place-${target.id}`,
      profileId: profile.id,
      type: 'place_and_memory',
      difficultyLevel: level,
      title: {
        en: 'Place & Memory',
        hi: 'स्थान और स्मृति'
      },
      prompt: {
        en: `Which peaceful and cherished place is shown in this picture?`,
        hi: `इस चित्र में कौन सा जाना-पहचाना और शांतिपूर्ण स्थान दिख रहा है?`
      },
      supportiveHint: {
        en: `Clue: ${target.relationship || 'A beloved place of peace'} — ${target.description.slice(0, 60)}...`,
        hi: `संकेत: ${target.relationship || 'शांति का एक प्रिय स्थान'} — ${target.description.slice(0, 60)}...`
      },
      imageUrl: target.imageUrl,
      memoryRefId: target.id,
      memoryCategory: 'place',
      choices
    };
  }

  private static createMusicMemoryGame(
    profile: MemoryProfile,
    songMem: MemoryItem,
    level: 1 | 2 | 3
  ): Game {
    const choices = [
      {
        id: 'c-correct',
        label: {
          en: 'Mukesh & Lata Mangeshkar (1976 classic)',
          hi: 'मुकेश और लता मंगेशकर (1976 का अमर गीत)'
        },
        isCorrect: true
      },
      {
        id: 'c-dist-1',
        label: {
          en: 'Kishore Kumar & Asha Bhosle',
          hi: 'किशोर कुमार और आशा भोसले'
        },
        isCorrect: false
      }
    ];

    if (level > 1) {
      choices.push({
        id: 'c-dist-2',
        label: {
          en: 'Mohammed Rafi Solo',
          hi: 'मोहम्मद रफी एकल स्वर'
        },
        isCorrect: false
      });
    }

    choices.sort(() => 0.5 - Math.random());

    // Song playlist — audio files must be placed in frontend/public/audio/
    const songs = [
      {
        id: 'song-1',
        title: 'Kabhi Kabhie Mere Dil Mein',
        artist: 'Mukesh & Lata Mangeshkar',
        audioUrl: '/audio/song1.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
        memoryNote: {
          en: 'Your favourite — played every afternoon on the Murphy radio.',
          hi: 'आपका प्रिय गीत — हर दोपहर मर्फी रेडियो पर बजता था।'
        }
      },
      {
        id: 'song-2',
        title: 'Lag Ja Gale',
        artist: 'Lata Mangeshkar',
        audioUrl: '/audio/song2.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=400&q=80',
        memoryNote: {
          en: 'A timeless melody you hummed while tending the marigolds.',
          hi: 'गेंदे के फूलों की देखभाल करते हुए जो धुन आप गुनगुनाती थीं।'
        }
      },
      {
        id: 'song-3',
        title: 'Ae Dil Hai Mushkil',
        artist: 'Mohammed Rafi',
        audioUrl: '/audio/song3.mp3',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
        memoryNote: {
          en: 'A golden melody from the radio your husband loved dearly.',
          hi: 'वह सुनहरी धुन जो आपके पतिजी के रेडियो पर हमेशा गूंजती थी।'
        }
      }
    ];

    return {
      id: `game-music-${songMem.id}`,
      profileId: profile.id,
      type: 'music_memory',
      difficultyLevel: level,
      title: {
        en: 'Music Memory',
        hi: 'संगीत और सुरमयी यादें'
      },
      prompt: {
        en: `You often hum "${songMem.title}". Listen to a melody and tell us who sang it.`,
        hi: `आप अक्सर "${songMem.title}" गुनगुनाती हैं। एक धुन सुनिए और बताइए — यह किसने गाया है?`
      },
      supportiveHint: {
        en: 'This melody was often played on your vintage wooden radio in the afternoon.',
        hi: 'यह धुन अक्सर दोपहर में आपके पुराने लकड़ी के रेडियो पर बजती थी।'
      },
      imageUrl: songMem.imageUrl,
      memoryRefId: songMem.id,
      memoryCategory: 'favorite',
      songs,
      choices,
      metadata: {
        routineLabel: songMem.title
      }
    };
  }

  private static createStoryRecallGame(
    profile: MemoryProfile,
    source: MemoryItem,
    level: 1 | 2 | 3
  ): Game {
    const storyText: LocalizedString = {
      en: 'One warm Sunday afternoon, daughter Meena arrived wearing her cheerful cotton dupatta. She walked up to the veranda holding a stainless steel tiffin container filled with warm, aromatic carrot halwa (gajar ka halwa) made with pure ghee and dry fruits. You both sat listening to the chirping sparrows while savoring the dessert.',
      hi: 'रविवार की दोपहर, बेटी मीना मुस्कुराते हुए घर आई। उसने बरामदे में कदम रखा और एक स्टील का टिफिन खोला जिसमें शुद्ध घी और मेवों से बना गरमा-गरम गाजर का हलवा था। आप दोनों ने साथ बैठकर गौरैया पक्षियों की चहचहाहट सुनते हुए हलवे का आनंद लिया।'
    };

    const choices = [
      {
        id: 'c-correct',
        label: {
          en: 'Warm Carrot Halwa (Gajar Halwa)',
          hi: 'गरमा-गरम गाजर का हलवा'
        },
        isCorrect: true
      },
      {
        id: 'c-dist-1',
        label: {
          en: 'Crispy Vegetable Samosas',
          hi: 'कुरकुरे समोसे'
        },
        isCorrect: false
      }
    ];

    if (level > 1) {
      choices.push({
        id: 'c-dist-2',
        label: {
          en: 'Fresh Gulab Jamun',
          hi: 'ताज़ा गुलाब जामुन'
        },
        isCorrect: false
      });
    }

    choices.sort(() => 0.5 - Math.random());

    return {
      id: `game-story-${source.id}`,
      profileId: profile.id,
      type: 'story_recall',
      difficultyLevel: level,
      title: {
        en: 'Story Recall',
        hi: 'कहानी और स्मृति'
      },
      prompt: {
        en: 'Read or listen to this sweet family memory, then answer the simple question below.',
        hi: 'इस प्यारी पारिवारिक याद को पढ़िए या सुनिए, और नीचे दिए गए आसान सवाल का उत्तर दीजिए।'
      },
      storyText,
      question: {
        en: 'What sweet treat did Meena bring in the steel tiffin box?',
        hi: 'मीना स्टील के टिफिन में क्या स्वादिष्ट व्यंजन लेकर आई थी?'
      },
      supportiveHint: {
        en: 'It was made with fresh winter carrots, pure ghee, and nuts.',
        hi: 'यह सर्दियों की ताज़ा गाजर, शुद्ध घी और मेवे से बना था।'
      },
      imageUrl: source.imageUrl,
      memoryRefId: source.id,
      memoryCategory: 'person',
      choices
    };
  }
}
