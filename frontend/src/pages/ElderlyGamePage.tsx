import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Heart,
  ArrowRight,
  RotateCcw,
  Volume2,
  HelpCircle,
  CheckCircle2,
  TrendingUp,
  Smile,
  ShieldCheck
} from 'lucide-react';
import { Game, GameAttemptResult } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { WhoIsThisGame } from '../components/games/WhoIsThisGame';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { SequenceDayGame } from '../components/games/SequenceDayGame';
import { CompleteMemoryGame } from '../components/games/CompleteMemoryGame';
import { PlaceMemoryGame } from '../components/games/PlaceMemoryGame';
import { MusicMemoryGame } from '../components/games/MusicMemoryGame';
import { StoryRecallGame } from '../components/games/StoryRecallGame';

interface ElderlyGamePageProps {
  onSessionComplete: (summary: any) => void;
}

export const ElderlyGamePage: React.FC<ElderlyGamePageProps> = ({ onSessionComplete }) => {
  const { language, t, speak } = useLanguage();
  const [games, setGames] = useState<Game[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [adaptiveFeedback, setAdaptiveFeedback] = useState<GameAttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Session aggregate metrics
  const sessionStats = useRef({
    attempted: 0,
    completed: 0,
    totalHints: 0,
    totalResponseTime: 0,
    revisitedIds: new Set<string>()
  });

  useEffect(() => {
    initJourney();
  }, []);

  const initJourney = async () => {
    try {
      setLoading(true);
      const sessionRes = await api.startSession();
      setSessionId(sessionRes.session.id);

      const journeyRes = await api.getTodayJourney();
      setGames(journeyRes.games);
      setGameStartTime(Date.now());
    } catch (err) {
      console.error('Failed to initialize journey:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGameAttempt = async (
    isCorrect: boolean,
    hintsUsed: number,
    selectedChoiceId: string,
    skipped: boolean = false
  ) => {
    if (isSubmitting || games.length === 0) return;
    setIsSubmitting(true);

    const currentGame = games[currentGameIndex];
    const responseTimeMs = Date.now() - gameStartTime;

    sessionStats.current.attempted += 1;
    if (isCorrect) sessionStats.current.completed += 1;
    sessionStats.current.totalHints += hintsUsed;
    sessionStats.current.totalResponseTime += responseTimeMs;
    if (currentGame.memoryRefId) sessionStats.current.revisitedIds.add(currentGame.memoryRefId);

    try {
      const result = await api.attemptGame(currentGame.id, {
        sessionId,
        gameType: currentGame.type,
        memoryRefId: currentGame.memoryRefId,
        selectedChoiceId,
        isCorrect,
        responseTimeMs,
        hintsUsed,
        skipped
      });

      setAdaptiveFeedback(result);

      // Warm voice affirmation for the elderly user
      const affirmation = result.supportiveFeedback[language] || result.supportiveFeedback.en;
      speak(affirmation);

      // Light confetti burst on strong recognition
      if (isCorrect && hintsUsed === 0) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#2D6A4F', '#D97706', '#E9C46A']
        });
      }
    } catch (err) {
      console.error('Failed to submit attempt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextGame = async () => {
    setAdaptiveFeedback(null);

    if (currentGameIndex + 1 < games.length) {
      setCurrentGameIndex((prev) => prev + 1);
      setGameStartTime(Date.now());
    } else {
      // Completed all games in Today's Journey!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#2D6A4F', '#C85A32', '#F4A261', '#E76F51']
      });

      try {
        const avgResponse = sessionStats.current.attempted > 0
          ? Math.round(sessionStats.current.totalResponseTime / sessionStats.current.attempted)
          : 3500;

        const endRes = await api.endSession(sessionId, {
          gamesAttempted: sessionStats.current.attempted,
          gamesCompleted: sessionStats.current.completed,
          memoriesRevisited: sessionStats.current.revisitedIds.size || 3,
          totalHints: sessionStats.current.totalHints,
          avgResponseTimeMs: avgResponse
        });

        onSessionComplete(endRes.summary);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSkip = () => {
    handleGameAttempt(false, 0, 'skipped', true);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Sparkles className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-4" />
        <h2 className="font-serif-warm text-2xl font-bold text-slate-800">
          Preparing Today’s Familiar Memories...
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Gathering photos, beloved songs, and family stories with warmth.
        </p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto bg-white rounded-3xl p-8 border border-amber-900/10">
        <Heart className="w-10 h-10 text-amber-700 mx-auto mb-3" />
        <h2 className="font-serif-warm text-2xl font-bold text-slate-800">
          No Memory Journey Available
        </h2>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Please add a few memories in the Caregiver Profile to start the journey.
        </p>
        <button
          onClick={initJourney}
          className="elderly-btn bg-emerald-800 text-white py-2 px-6 rounded-xl"
        >
          Reload Journey
        </button>
      </div>
    );
  }

  const currentGame = games[currentGameIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Calm, Non-stressful Progress Tracker */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-amber-900/10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-700 animate-ping" />
          <span className="font-serif-warm text-lg sm:text-xl font-bold text-slate-800">
            {language === 'hi' ? 'स्मृति' : 'Memory'} {currentGameIndex + 1} {language === 'hi' ? 'कुल' : 'of'} {games.length}
          </span>
        </div>

        {/* Gentle step dots */}
        <div className="flex items-center gap-2">
          {games.map((_, idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                idx === currentGameIndex
                  ? 'bg-emerald-800 ring-4 ring-emerald-100 scale-110'
                  : idx < currentGameIndex
                  ? 'bg-emerald-600'
                  : 'bg-amber-100'
              }`}
            />
          ))}
        </div>

        {/* Skip button with gentle label */}
        <button
          onClick={handleSkip}
          disabled={adaptiveFeedback !== null || isSubmitting}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors"
        >
          {t('skipBtn')}
        </button>
      </div>

      {/* Render Active Game Component */}
      <div className="relative">
        {currentGame.type === 'who_is_this' && (
          <WhoIsThisGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'memory_match' && (
          <MemoryMatchGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'complete_the_memory' && (
          <CompleteMemoryGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'sequence_my_day' && (
          <SequenceDayGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'place_and_memory' && (
          <PlaceMemoryGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'music_memory' && (
          <MusicMemoryGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}

        {currentGame.type === 'story_recall' && (
          <StoryRecallGame
            game={currentGame}
            onAttempt={(isCorrect, hintsUsed, id) => handleGameAttempt(isCorrect, hintsUsed, id)}
            disabled={adaptiveFeedback !== null}
          />
        )}
      </div>

      {/* Live Supportive & Adaptive Feedback Banner */}
      {adaptiveFeedback && (
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smile className="w-6 h-6 text-amber-300" />
                <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-white">
                  {adaptiveFeedback.supportiveFeedback[language] || adaptiveFeedback.supportiveFeedback.en}
                </h3>
              </div>

              {/* Transparent Adaptive Engine notice */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-100 bg-emerald-800/80 px-3.5 py-1.5 rounded-xl w-fit">
                <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Adaptive Engine:</strong> {adaptiveFeedback.adaptation.reason}
                </span>
              </div>
            </div>

            <button
              onClick={handleNextGame}
              className="elderly-btn bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-base sm:text-lg py-3 px-8 rounded-2xl shadow-lg shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentGameIndex + 1 < games.length ? t('nextActivityBtn') : t('completeSessionBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Wellness reassurance */}
      <p className="text-center text-xs text-slate-500 italic">
        Take all the time you need. There are no countdown timers or wrong answers.
      </p>
    </div>
  );
};
