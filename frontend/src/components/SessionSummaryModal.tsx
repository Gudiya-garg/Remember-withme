import React from 'react';
import {
  Sparkles,
  Heart,
  Smile,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Compass,
  RotateCcw
} from 'lucide-react';
import { SessionSummary } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface SessionSummaryModalProps {
  summary: SessionSummary;
  onClose: () => void;
  onNavigateToCaregiver: () => void;
  onReplayJourney: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  summary,
  onClose,
  onNavigateToCaregiver,
  onReplayJourney
}) => {
  const { language, t } = useLanguage();

  const feedbackText = summary.feedbackNote[language] || summary.feedbackNote.en;
  const nextActivityText = summary.suggestedNextActivity[language] || summary.suggestedNextActivity.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 border-2 border-emerald-700 shadow-2xl max-w-xl w-full text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-3xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <Smile className="w-8 h-8 text-amber-300" />
        </div>

        <h2 className="font-serif-warm text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          {t('journeyCompleteTitle')}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 mb-6 italic max-w-md mx-auto">
          “{feedbackText}”
        </p>

        {/* Gentle, Affirmative Metrics (NO competitive failure scores) */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-2xs">
            <Heart className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <span className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900 block">
              {summary.memoriesRevisited || 3}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {t('memoriesRevisited')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
            <span className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900 block">
              {summary.gamesCompleted || 3}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {t('activitiesCompleted')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-900/10 shadow-2xs">
            <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <span className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900 block">
              {summary.totalHints || 1}
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {t('helpRequested')}
            </span>
          </div>
        </div>

        {/* Suggested Next Activity */}
        <div className="bg-amber-100/70 border border-amber-300/80 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 mb-8 text-left flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 block mb-0.5">
              {t('suggestedNext')}:
            </span>
            <p className="text-slate-700">{nextActivityText}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 rounded-2xl shadow-md text-base sm:text-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('returnHome')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={onNavigateToCaregiver}
              className="flex-1 px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-900 font-semibold text-xs sm:text-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{t('viewCaregiverInsights')}</span>
            </button>

            <button
              onClick={onReplayJourney}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay Today’s Journey</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
