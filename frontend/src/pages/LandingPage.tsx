import React from 'react';
import {
  Heart,
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle2,
  Smile,
  Music,
  Clock,
  MapPin,
  Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MemoryThread } from '../components/MemoryThread';

interface LandingPageProps {
  onNavigate: (view: 'landing' | 'profile' | 'game' | 'caregiver' | 'library') => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onLaunchDemo }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
            <Heart className="w-4 h-4 text-emerald-700 fill-emerald-700/20" />
            <span>AI-Powered Cognitive Companion</span>
          </div>

          <h1 className="font-serif-warm text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
            “Games That Adapt to the Person, <br className="hidden sm:block" />
            <span className="text-emerald-800 italic underline decoration-amber-400 decoration-wavy decoration-2">
              Not the Patient.
            </span>”
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-2xl text-slate-600 font-normal leading-relaxed mb-10">
            Turn familiar faces, cherished places, beloved songs, and daily routines into gentle, supportive cognitive activities.
          </p>

          {/* Primary & Secondary & Demo CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-8">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full sm:w-auto elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white shadow-lg text-lg px-8 py-4 rounded-2xl cursor-pointer"
            >
              <span>{t('createProfileCTA')}</span>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </button>

            <button
              onClick={() => onNavigate('caregiver')}
              className="w-full sm:w-auto elderly-btn bg-white hover:bg-amber-50/80 text-slate-800 border-2 border-amber-900/15 shadow-sm text-lg px-8 py-4 rounded-2xl cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>{t('exploreCaregiverCTA')}</span>
            </button>
          </div>

          {/* Prominent Hackathon 2-Minute Demo Launcher */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 p-3 px-6 rounded-2xl bg-amber-100/90 border border-amber-300 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Hackathon Evaluation:
            </span>
            <button
              onClick={onLaunchDemo}
              className="font-bold text-sm text-emerald-900 hover:text-emerald-950 underline flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-emerald-800 text-emerald-800" />
              Experience 2-Minute Demo Flow (Shanti Devi)
            </button>
          </div>
        </div>
      </section>

      {/* Visual Representation of Core Flow: Memory -> Personalization -> Cognitive Game -> Adaptation */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-amber-900/10 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              The Architecture of Warmth
            </span>
            <h2 className="font-serif-warm text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
              How Memories Become Activities
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Instead of generic puzzles, we preserve identity by transforming caregiver memories into personalized engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm mb-4">
                  01
                </span>
                <h3 className="font-serif-warm text-xl font-bold text-slate-900 mb-2">
                  Caregiver Memories
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Caregivers upload family portraits, daughter's visits, hometown temples, favorite songs, and morning tea routines.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-amber-900/10 text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Identity Centered
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm mb-4">
                  02
                </span>
                <h3 className="font-serif-warm text-xl font-bold text-slate-900 mb-2">
                  Personalization Engine
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Memory agents extract emotional connections, life milestones, and comfort items into structured, token-efficient JSON graphs.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-amber-900/10 text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> No Generic Trivia
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-amber-900/10 flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm mb-4">
                  03
                </span>
                <h3 className="font-serif-warm text-xl font-bold text-slate-900 mb-2">
                  Cognitive Games
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dynamic generation of 7 tailored games: Who Is This, Memory Match, Sequence My Day, Music Memory, and Story Recall.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-amber-900/10 text-[11px] font-semibold text-indigo-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accessible & Calming
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm mb-4">
                  04
                </span>
                <h3 className="font-serif-warm text-xl font-bold text-white mb-2">
                  Adaptive Intelligence
                </h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  Transparent adaptation tracks confidence, response times, and gentle clues to subtly adjust difficulty and queue forgotten memories.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-emerald-800 text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Stress-Free Wellness
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature UI Element: Memory Thread Interactive Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <MemoryThread />
      </section>

      {/* Comparison: Generic App vs Our Platform */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Core Differentiator
          </span>
          <h2 className="font-serif-warm text-3xl font-bold text-slate-900 mt-1">
            Why Personalization Matters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Generic App Card */}
          <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-300/80 text-slate-600">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full inline-block mb-4">
              Generic Brain Training Apps
            </span>
            <h3 className="font-serif-warm text-xl font-bold text-slate-800 mb-2">
              “Match the identical geometric polygons.”
            </h3>
            <p className="text-sm leading-relaxed mb-6">
              Random shapes, stressful countdown timers, and clinical scores like “Brain score = 42%” induce anxiety and disconnect from real emotional identity.
            </p>
            <ul className="text-xs space-y-2 border-t border-slate-200 pt-4 text-slate-500">
              <li>❌ Abstract shapes with zero personal meaning</li>
              <li>❌ Stressful countdown timers</li>
              <li>❌ Demoralizing performance scores</li>
              <li>❌ High patient resistance and withdrawal</li>
            </ul>
          </div>

          {/* Our Platform Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-700 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-4">
              Personal Memory Companion
            </span>
            <h3 className="font-serif-warm text-xl font-bold text-slate-900 mb-2">
              “Who is this smiling on the veranda?”
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              Shows daughter Meena holding warm carrot halwa. Asks familiar questions and uses the response to gently adapt tomorrow’s activities.
            </p>
            <ul className="text-xs space-y-2 border-t border-emerald-100 pt-4 text-emerald-950 font-medium">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Real family photos, favorite classic melodies, and daily routines
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                No timers, no clinical failure scores, pure emotional warmth
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Adaptive difficulty that protects confidence and dignity
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                Bilingual English & Hindi support for Indian elderly homes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Caregiver Assurance & Medical Disclaimer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 text-center text-slate-700 shadow-2xs">
          <ShieldCheck className="w-8 h-8 text-emerald-800 mx-auto mb-3" />
          <h3 className="font-serif-warm text-lg sm:text-xl font-bold text-slate-900 mb-2">
            Designed for Dignity & Cognitive Wellness
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t('medicalDisclaimer')}
          </p>
        </div>
      </section>
    </div>
  );
};
