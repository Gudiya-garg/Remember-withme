import React, { useState } from 'react';
import { Game, SequenceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, HelpCircle, Clock, CheckCircle2, ArrowDown, Sparkles, Heart } from 'lucide-react';

interface SequenceDayGameProps {
  game: Game;
  onAttempt: (isCorrect: boolean, hintsUsed: number, selectedId: string) => void;
  disabled?: boolean;
}

export const SequenceDayGame: React.FC<SequenceDayGameProps> = ({ game, onAttempt, disabled }) => {
  const { language, t, speak } = useLanguage();
  const rawItems = game.sequenceItems || [];

  // Scramble initial order
  const [availableItems, setAvailableItems] = useState<SequenceItem[]>(() => {
    return [...rawItems].sort(() => 0.5 - Math.random());
  });
  const [arrangedSlots, setArrangedSlots] = useState<SequenceItem[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const promptText = game.prompt[language] || game.prompt.en;
  const hintText = game.supportiveHint[language] || game.supportiveHint.en;

  const handleSelectItem = (item: SequenceItem) => {
    if (disabled || isSubmitted) return;
    setArrangedSlots((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleResetOrder = () => {
    if (isSubmitted) return;
    setAvailableItems([...rawItems].sort(() => 0.5 - Math.random()));
    setArrangedSlots([]);
  };

  const handleCheckOrder = () => {
    if (arrangedSlots.length !== rawItems.length) return;
    setIsSubmitted(true);

    const isCorrect = arrangedSlots.every((item, idx) => item.correctOrder === idx + 1);
    onAttempt(isCorrect, hintsUsed, 'sequenced');
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
          <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-blue-700" />
          </span>
          <div>
            <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900">
              {game.title[language] || game.title.en}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Daily Rhythm & Routine Recall
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

      {/* Arranged Slots Section */}
      <div className="mb-6 bg-amber-50/60 p-4 sm:p-6 rounded-2xl border border-amber-900/10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
          Your Ordered Day:
        </span>

        {arrangedSlots.length === 0 ? (
          <p className="text-sm italic text-slate-400 py-3 text-center">
            Tap the activities below in the order you do them throughout the day.
          </p>
        ) : (
          <div className="space-y-2.5">
            {arrangedSlots.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-emerald-300 shadow-2xs"
              >
                <span className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium text-slate-800 text-base flex-1">
                  {item.label[language] || item.label.en}
                </span>
                {item.timeBadge && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold">
                    {item.timeBadge}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Items to tap */}
      {availableItems.length > 0 && (
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
            Choose Next Activity:
          </span>
          <div className="grid grid-cols-1 gap-3">
            {availableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                disabled={disabled || isSubmitted}
                className="elderly-btn bg-[#FAF8F5] border-2 border-amber-900/15 text-slate-800 hover:border-emerald-700 hover:bg-emerald-50/50 justify-between text-left"
              >
                <span className="text-base sm:text-lg font-semibold">
                  {item.label[language] || item.label.en}
                </span>
                <ArrowDown className="w-4 h-4 text-emerald-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={handleResetOrder}
          disabled={arrangedSlots.length === 0 || isSubmitted}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          Reset Order
        </button>

        {arrangedSlots.length === rawItems.length && !isSubmitted && (
          <button
            onClick={handleCheckOrder}
            className="elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 px-6 rounded-xl text-base font-bold shadow-sm"
          >
            Check My Day Sequence
          </button>
        )}
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
