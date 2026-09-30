import React, { useState, useEffect } from 'react';
import {
  Compass,
  Heart,
  TrendingUp,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
  RotateCcw,
  Play
} from 'lucide-react';
import { CaregiverDashboardData } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { MemoryThread } from '../components/MemoryThread';
import { RichnessIndicator } from '../components/RichnessIndicator';

interface CaregiverDashboardPageProps {
  onNavigateToGame: () => void;
}

export const CaregiverDashboardPage: React.FC<CaregiverDashboardPageProps> = ({ onNavigateToGame }) => {
  const { language, t } = useLanguage();
  const [data, setData] = useState<CaregiverDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getCaregiverDashboard();
      setData(res.dashboard);
    } catch (err) {
      console.error('Failed to load caregiver dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="py-24 text-center">
        <Sparkles className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-4" />
        <h2 className="font-serif-warm text-2xl font-bold text-slate-800">
          Gathering Activity Insights...
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Summarizing memory recall patterns, adaptation timelines, and supportive suggestions.
        </p>
      </div>
    );
  }

  const {
    profile,
    todayStats,
    memoryInsights,
    adaptationTimeline,
    memoryThreads,
    trends,
    richnessScore,
    disclaimer
  } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Header with Profile Summary & Elderly Journey Trigger */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Caregiver Insight Portal
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Profile: {profile.name} (Age {profile.ageRange})
            </span>
          </div>
          <h1 className="font-serif-warm text-3xl sm:text-4xl font-bold text-slate-900">
            {profile.name}’s Cognitive Journey
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            {profile.notes || 'Activities adapt continuously based on natural familiarity, without clinical pressure.'}
          </p>
        </div>

        <button
          onClick={onNavigateToGame}
          className="elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white min-h-[52px] py-3 px-6 rounded-2xl shadow-md text-base shrink-0 cursor-pointer"
        >
          <Play className="w-5 h-5 text-amber-300 fill-amber-300/30" />
          <span>Launch Today’s Journey</span>
        </button>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900 block mb-0.5">
            Compassionate Care Protocol:
          </strong>
          {disclaimer}
        </div>
      </div>

      {/* TODAY: Key Metrics Cards */}
      <section className="space-y-4">
        <h2 className="font-serif-warm text-2xl font-bold text-slate-900">
          {t('todayActivity')}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="font-serif-warm text-3xl font-bold text-slate-900">
              {todayStats.activitiesCompleted}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Activities finished</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Engagement</span>
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            <span className="font-serif-warm text-3xl font-bold text-slate-900">
              {todayStats.engagementMinutes}m
            </span>
            <span className="text-xs text-slate-500 block mt-1">Calm active focus</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Games Attempted</span>
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <span className="font-serif-warm text-3xl font-bold text-slate-900">
              {todayStats.gamesAttempted}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Personalized interactions</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-900/10 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Gentle Clues</span>
              <HelpCircle className="w-4 h-4 text-rose-700" />
            </div>
            <span className="font-serif-warm text-3xl font-bold text-slate-900">
              {todayStats.hintsUsed}
            </span>
            <span className="text-xs text-slate-500 block mt-1">Supportive hints requested</span>
          </div>
        </div>
      </section>

      {/* Memory Profile Richness Meter */}
      <RichnessIndicator richness={richnessScore} />

      {/* Signature UI Element: Memory Thread Visual Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-warm text-2xl font-bold text-slate-900">
              {t('memoryThreadTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('memoryThreadSub')}
            </p>
          </div>
        </div>
        <MemoryThread threads={memoryThreads} />
      </section>

      {/* MEMORY INSIGHTS: People Recalled vs Memories Needing Repetition */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frequently Recalled People */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-amber-900/10">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-warm text-xl font-bold text-slate-900">
                {t('frequentlyRecalledPeople')}
              </h3>
              <p className="text-xs text-slate-500">
                Faces and relationships consistently recognized with warmth
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {memoryInsights.frequentlyRecalledPeople.map((person, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border border-amber-900/10"
              >
                <div className="flex items-center gap-3.5">
                  {person.image ? (
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-900/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-900">
                      {person.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{person.name}</h4>
                    <span className="text-xs font-medium text-emerald-800">
                      {person.relationship}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {person.recallRate}% Recall
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memories Needing Gentle Repetition */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-amber-900/10">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <RotateCcw className="w-5 h-5 text-amber-800" />
            </span>
            <div>
              <h3 className="font-serif-warm text-xl font-bold text-slate-900">
                {t('frequentlyForgottenMemories')}
              </h3>
              <p className="text-xs text-slate-500">
                Gentle reminders and practical ideas for family conversations
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {memoryInsights.frequentlyForgottenMemories.map((mem) => (
              <div
                key={mem.id}
                className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-warm font-bold text-slate-900 text-base">
                    {mem.title}
                  </h4>
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-200 text-amber-900">
                    {mem.category}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  💡 <strong>Caregiver Tip:</strong> {mem.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADAPTATION TIMELINE & TRENDS */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            System Intelligence
          </span>
          <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {t('adaptationTimelineTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time visual record of how user signals subtly adjust cognitive activity selection.
          </p>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-emerald-800/30 ml-4 pl-6 sm:pl-8 space-y-8">
          {adaptationTimeline.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[33px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full bg-emerald-800 ring-4 ring-emerald-100" />

              <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-amber-900/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif-warm font-bold text-slate-900 text-lg">
                      {item.memoryTitle}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.gameType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.timestamp}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-amber-900/10">
                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Interaction Signal:</span>
                    <span className="text-slate-800 font-medium">{item.performanceSignal}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Difficulty Adjustment:</span>
                    <span className="text-emerald-800 font-bold">{item.adjustment}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 block mb-0.5">Supportive Outcome:</span>
                    <span className="text-slate-800 font-medium">{item.outcome}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Completion Trends */}
        <div className="pt-6 border-t border-amber-900/10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-4">
            7-Day Activity & Comfort Trend
          </span>
          <div className="grid grid-cols-7 gap-2 text-center">
            {trends.map((t, idx) => (
              <div key={idx} className="bg-[#FAF8F5] p-3 rounded-xl border border-amber-900/10">
                <span className="text-xs text-slate-400 block mb-1 font-medium">{t.day}</span>
                <span className="font-bold text-emerald-800 text-sm block">{t.completionRate}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{t.avgResponseSeconds}s avg</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
