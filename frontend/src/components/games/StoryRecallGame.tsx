import React, { useState } from 'react';
import { Game, GameChoice } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, HelpCircle, CheckCircle, BookOpen, Heart } from 'lucide-react';

interface StoryRecallGameProps {
  game: Game;
  onAttempt: (isCorrect: boolean, hintsUsed: number, selectedId: string) => void;
  disabled?: boolean;
}

export const StoryRecallGame: React.FC<StoryRecallGameProps> = ({ game, onAttempt, disabled }) => {
  const { language, t, speak } = useLanguage();
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  const storyText = game.storyText ? (game.storyText[language] || game.storyText.en) : '';
  const questionText = game.question ? (game.question[language] || game.question.en) : '';
  const hintText = game.supportiveHint[language] || game.supportiveHint.en;

  const handleRevealHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsedCount((prev) => prev + 1);
      speak(hintText);
    }
  };

  const handleReadStoryAloud = () => {
    speak(`${storyText}. ${questionText}`);
  };

  const handleSelectChoice = (choice: GameChoice) => {
    if (selectedChoiceId !== null || disabled) return;
    setSelectedChoiceId(choice.id);
    onAttempt(choice.isCorrect, hintsUsedCount, choice.id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5 text-amber-700" />
          </span>
          <div>
            <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900">
              {game.title[language] || game.title.en}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Family Narrative & Story Recall
            </p>
          </div>
        </div>

        <button
          onClick={handleReadStoryAloud}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-amber-100/70 text-slate-800 text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Listen to Story</span>
        </button>
      </div>

      {/* Story Box */}
      <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-2xl border border-amber-900/10 mb-8 shadow-2xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
          {language === 'hi' ? 'सुंदर पारिवारिक कथा' : 'Familiar Family Story'}
        </span>
        <p className="font-serif-warm text-lg sm:text-xl text-slate-800 leading-relaxed italic">
          “{storyText}”
        </p>
      </div>

      {/* Question */}
      <p className="text-center font-serif-warm text-xl sm:text-2xl text-slate-900 font-bold mb-6">
        {questionText}
      </p>

      {/* Choices */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {game.choices?.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          let btnStyle = 'bg-[#FAF8F5] border-amber-900/15 text-slate-800 hover:border-emerald-700 hover:bg-emerald-50/50';

          if (selectedChoiceId !== null) {
            if (choice.isCorrect) {
              btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-sm';
            } else if (isSelected) {
              btnStyle = 'bg-amber-100 border-amber-400 text-slate-800';
            } else {
              btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={choice.id}
              onClick={() => handleSelectChoice(choice)}
              disabled={selectedChoiceId !== null || disabled}
              className={`elderly-btn border-2 text-left justify-start ${btnStyle}`}
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 font-bold text-slate-600">
                {choice.isCorrect && selectedChoiceId !== null ? (
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Heart className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <span className="text-lg font-semibold">
                {choice.label[language] || choice.label.en}
              </span>
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
