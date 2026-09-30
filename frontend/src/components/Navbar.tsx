import React, { useState } from 'react';
import {
  Heart,
  Brain,
  Sparkles,
  Users,
  Compass,
  BookOpen,
  Volume2,
  VolumeX,
  Languages,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

interface NavbarProps {
  currentView: 'landing' | 'profile' | 'game' | 'caregiver' | 'library';
  onNavigate: (view: 'landing' | 'profile' | 'game' | 'caregiver' | 'library') => void;
  onDemoReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onDemoReset }) => {
  const { language, toggleLanguage, t, isSpeaking, stopSpeaking } = useLanguage();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      await api.resetDemo();
      onDemoReset();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const isElderlyMode = currentView === 'game';

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-50 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <Heart className="w-6 h-6 text-amber-300 fill-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-warm text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {t('brandName')}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Care Companion
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block italic">
                “{t('tagline')}”
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-amber-50/80 rounded-2xl border border-amber-900/10">
            <button
              onClick={() => onNavigate('game')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                isElderlyMode
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-100/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('switchElderlyMode')}</span>
            </button>

            <button
              onClick={() => onNavigate('caregiver')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                currentView === 'caregiver'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-100/60'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{t('exploreCaregiverCTA')}</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                currentView === 'profile'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-100/60'
              }`}
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span>{t('createProfileCTA')}</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                currentView === 'library'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-amber-100/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-700" />
              <span>{t('memoryLibrary')}</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Reset Button for Judges */}
            <button
              onClick={handleResetDemo}
              disabled={isResetting}
              title="Reset Demo data for Shanti Devi"
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3.5 py-2 rounded-xl border border-slate-300/80 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title="Toggle English / Hindi"
            >
              <Languages className="w-4 h-4 text-emerald-700" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Audio Toggle Indicator */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-2.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 flex items-center gap-1.5 animate-pulse"
                title="Stop speaking"
              >
                <VolumeX className="w-5 h-5" />
                <span className="text-xs font-bold hidden sm:inline">Mute</span>
              </button>
            )}

            {/* Primary Action Button */}
            {currentView !== 'game' ? (
              <button
                onClick={() => onNavigate('game')}
                className="elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white shadow-md text-sm md:text-base py-2.5 px-4 rounded-xl min-h-[46px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t('playJourneyCTA')}</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('caregiver')}
                className="px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-900 font-semibold text-sm hover:bg-emerald-50 transition-colors"
              >
                {t('exploreCaregiverCTA')}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
