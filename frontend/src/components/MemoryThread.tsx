import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  User,
  Heart,
  Gamepad2,
  TrendingUp,
  Sparkles,
  MapPin,
  Clock,
  Music,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MemoryThreadNode } from '../types';

interface MemoryThreadProps {
  threads?: MemoryThreadNode[];
}

const DEFAULT_THREADS: MemoryThreadNode[] = [
  {
    id: 'thread-1',
    entityName: 'Meena',
    entityRole: 'Daughter',
    memorySnippet: 'Sunday visits with warm carrot halwa on the veranda cane chairs',
    gameType: 'who_is_this',
    gameLabel: 'Who Is This?',
    status: 'strong',
    adaptationAction: 'Consistently recognized in 3s. Stepped up to level 2 with subtle neighbor distractors to maintain active curiosity.'
  },
  {
    id: 'thread-2',
    entityName: 'Agra & Taj Mahal',
    entityRole: 'Anniversary Trip 1968',
    memorySnippet: 'Winter visit with late husband Anand near reflective water pools',
    gameType: 'place_and_memory',
    gameLabel: 'Place & Memory',
    status: 'needs_repetition',
    adaptationAction: 'Hesitation observed. Queued for gentle repetition with larger photo clues and affectionate narrative hints.'
  },
  {
    id: 'thread-3',
    entityName: 'Morning Rhythm',
    entityRole: 'Daily Routine',
    memorySnippet: 'Ginger tea & watering the sacred Tulsi plant at 7:00 AM',
    gameType: 'sequence_my_day',
    gameLabel: 'Sequence My Day',
    status: 'strong',
    adaptationAction: 'Anchors time of day. High familiarity acts as an emotional comfort booster before harder tasks.'
  },
  {
    id: 'thread-4',
    entityName: 'Kabhi Kabhie Melody',
    entityRole: 'Favorite Song (Mukesh/Lata)',
    memorySnippet: 'Vintage radio tune hummed while knitting cozy sweaters',
    gameType: 'music_memory',
    gameLabel: 'Music Memory',
    status: 'improving',
    adaptationAction: 'Evokes smiles and melodic rhythm. Used as a positive transitional activity to uplift spirits.'
  }
];

export const MemoryThread: React.FC<MemoryThreadProps> = ({ threads = DEFAULT_THREADS }) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>(threads[0]?.id || 'thread-1');
  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  const getEntityIcon = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('daughter') || r.includes('son') || r.includes('family')) return <User className="w-5 h-5 text-emerald-800" />;
    if (r.includes('trip') || r.includes('place')) return <MapPin className="w-5 h-5 text-amber-800" />;
    if (r.includes('routine') || r.includes('morning')) return <Clock className="w-5 h-5 text-blue-800" />;
    if (r.includes('song') || r.includes('music')) return <Music className="w-5 h-5 text-purple-800" />;
    return <Heart className="w-5 h-5 text-rose-800" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'strong') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Strong Recognition
        </span>
      );
    }
    if (status === 'improving') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <TrendingUp className="w-3.5 h-3.5" />
          Improving
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
        <RefreshCw className="w-3.5 h-3.5" />
        Gentle Repetition Queued
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm relative overflow-hidden">
      {/* Subtle organic watermark */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-serif-warm text-2xl font-bold text-slate-900">
              The Memory Thread™
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Our signature architecture transforms real caregiver memories into tailored cognitive games and evolves with real-time human response.
          </p>
        </div>

        {/* Thread Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedThreadId(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedThreadId === t.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100/70 border border-amber-900/10'
              }`}
            >
              {t.entityName}
            </button>
          ))}
        </div>
      </div>

      {/* The 4-Stage Visual Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {/* Node 1: Person / Place / Event */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-amber-900/10 flex flex-col justify-between relative group hover:border-emerald-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                1. Stored Entity
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                {getEntityIcon(activeThread.entityRole)}
              </div>
            </div>
            <h4 className="font-serif-warm text-xl font-bold text-slate-900">
              {activeThread.entityName}
            </h4>
            <p className="text-xs font-medium text-emerald-800 mt-0.5">
              {activeThread.entityRole}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-900/10 text-xs text-slate-500">
            Caregiver verified data point
          </div>

          {/* Desktop Arrow Connector */}
          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-emerald-800 text-white items-center justify-center shadow-xs">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          {/* Mobile Arrow Connector */}
          <div className="flex md:hidden justify-center my-1 text-emerald-800">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 2: The Memory */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-amber-900/10 flex flex-col justify-between relative group hover:border-amber-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                2. Cherished Memory
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Heart className="w-4 h-4 text-amber-700" />
              </div>
            </div>
            <p className="text-sm text-slate-800 font-medium leading-relaxed italic">
              “{activeThread.memorySnippet}”
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-900/10 text-xs text-slate-500">
            Emotional resonance anchor
          </div>

          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-amber-700 text-white items-center justify-center shadow-xs">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex md:hidden justify-center my-1 text-amber-700">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 3: The Cognitive Game */}
        <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-amber-900/10 flex flex-col justify-between relative group hover:border-indigo-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">
                3. Generated Game
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 text-indigo-700" />
              </div>
            </div>
            <h4 className="font-serif-warm text-lg font-bold text-slate-900">
              {activeThread.gameLabel}
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Personalized activity generated dynamically without generic trivia.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-900/10">
            {getStatusBadge(activeThread.status)}
          </div>

          <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-indigo-700 text-white items-center justify-center shadow-xs">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex md:hidden justify-center my-1 text-indigo-700">
            <ArrowDown className="w-4 h-4" />
          </div>
        </div>

        {/* Node 4: Adaptive Intelligence */}
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                4. Live Adaptation
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-300" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed font-light">
              {activeThread.adaptationAction}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-800 text-[11px] text-amber-200/90 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Zero clinical stress; gentle pacing
          </div>
        </div>
      </div>
    </div>
  );
};
