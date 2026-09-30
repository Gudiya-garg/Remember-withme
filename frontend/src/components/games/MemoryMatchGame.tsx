import React, { useState } from 'react';
import { Game } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, HelpCircle, CheckCircle2, Sparkles, Heart } from 'lucide-react';

interface MemoryMatchGameProps {
  game: Game;
  onAttempt: (isCorrect: boolean, hintsUsed: number, selectedId: string) => void;
  disabled?: boolean;
}

interface MatchCard {
  id: string;
  label: string;
  matchId: string;
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ game, onAttempt, disabled }) => {
  const { language, t, speak } = useLanguage();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Generate cards from matchPairs
  const [cards, setCards] = useState(() => {
    const rawPairs = game.matchPairs || [];
    const items: Array<{ id: string; label: string; matchId: string; image?: string }> = [];

    rawPairs.forEach((pair) => {
      // Card A: Image card or Title
      items.push({
        id: `${pair.id}-a`,
        label: pair.label[language] || pair.label.en,
        matchId: pair.matchId,
        image: pair.image
      });
      // Card B: Text connection card
      items.push({
        id: `${pair.id}-b`,
        label: pair.label[language] || pair.label.en,
        matchId: pair.matchId,
        image: undefined
      });
    });

    return items.sort(() => 0.5 - Math.random());
  });

  const promptText = game.prompt[language] || game.prompt.en;
  const hintText = game.supportiveHint[language] || game.supportiveHint.en;

  const handleCardClick = (index: number) => {
    if (disabled || selectedCards.length === 2 || selectedCards.includes(index)) return;
    const card = cards[index];
    if (matchedIds.includes(card.matchId)) return;

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const card1 = cards[newSelected[0]];
      const card2 = cards[newSelected[1]];

      if (card1.matchId === card2.matchId) {
        // Matched!
        const newMatched = [...matchedIds, card1.matchId];
        setMatchedIds(newMatched);
        setSelectedCards([]);

        // Check if finished
        if (newMatched.length >= (game.matchPairs?.length || 2)) {
          onAttempt(true, hintsUsed, 'matched-all');
        }
      } else {
        // Not matched - gentle reset after delay
        setTimeout(() => {
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  const handleRevealHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsed((prev) => prev + 1);
      speak(hintText);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-amber-700" />
          </span>
          <div>
            <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900">
              {game.title[language] || game.title.en}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Familiar Memory Pairs
            </p>
          </div>
        </div>

        <button
          onClick={() => speak(promptText)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-amber-100/70 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">{t('readAloudBtn')}</span>
        </button>
      </div>

      <p className="text-center font-serif-warm text-xl text-slate-800 font-medium mb-6">
        {promptText}
      </p>

      {/* Grid of Matching Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-8">
        {cards.map((card, idx) => {
          const isSelected = selectedCards.includes(idx);
          const isMatched = matchedIds.includes(card.matchId);

          let cardStyle = 'bg-[#FAF8F5] border-amber-900/10 text-slate-800 hover:border-emerald-700 hover:bg-emerald-50/40';

          if (isMatched) {
            cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs';
          } else if (isSelected) {
            cardStyle = 'bg-amber-100 border-amber-400 text-slate-900 shadow-sm';
          }

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={isMatched || disabled}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center min-h-[120px] cursor-pointer ${cardStyle}`}
            >
              {card.image && (
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-16 h-16 rounded-xl object-cover mb-2 border border-amber-900/10 shadow-2xs"
                />
              )}
              <span className="text-sm sm:text-base font-semibold">
                {card.label}
              </span>
              {isMatched && (
                <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Supportive Hint */}
      <div className="border-t border-amber-900/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {!showHint ? (
          <button
            onClick={handleRevealHint}
            className="text-amber-800 hover:text-amber-900 font-medium text-sm sm:text-base flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-amber-50 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-amber-700" />
            <span>{t('gentleHintBtn')}</span>
          </button>
        ) : (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-sm text-slate-800 flex items-start gap-3 w-full">
            <Heart className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block mb-0.5">
                {language === 'hi' ? 'प्यारा संकेत:' : 'Gentle Clue:'}
              </span>
              <p className="italic text-slate-700">{hintText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
