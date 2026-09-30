import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { MemoryProfilePage } from './pages/MemoryProfilePage';
import { ElderlyGamePage } from './pages/ElderlyGamePage';
import { CaregiverDashboardPage } from './pages/CaregiverDashboardPage';
import { MemoryLibraryPage } from './pages/MemoryLibraryPage';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { SessionSummary } from './types';
import { api } from './services/api';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

const MainApp: React.FC = () => {
  const { t } = useLanguage();
  const [currentView, setCurrentView] = useState<'landing' | 'profile' | 'game' | 'caregiver' | 'library'>('landing');
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLaunchDemo = async () => {
    try {
      showToast('Loading Demo Profile: Shanti Devi...');
      await api.resetDemo();
      setCurrentView('game');
      showToast('Demo Active: Shanti Devi’s Memory Journey Ready!');
    } catch (err) {
      console.error(err);
      setCurrentView('game');
    }
  };

  const handleDemoReset = () => {
    showToast('Demo data restored to initial baseline.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-emerald-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDemoReset={handleDemoReset}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {currentView === 'profile' && <MemoryProfilePage />}

        {currentView === 'game' && (
          <ElderlyGamePage
            onSessionComplete={(summary) => setSessionSummary(summary)}
          />
        )}

        {currentView === 'caregiver' && (
          <CaregiverDashboardPage
            onNavigateToGame={() => {
              setCurrentView('game');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'library' && <MemoryLibraryPage />}
      </main>

      {/* Page 5: Session Summary Modal */}
      {sessionSummary && (
        <SessionSummaryModal
          summary={sessionSummary}
          onClose={() => setSessionSummary(null)}
          onNavigateToCaregiver={() => {
            setSessionSummary(null);
            setCurrentView('caregiver');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReplayJourney={() => {
            setSessionSummary(null);
            setCurrentView('game');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Warm Healthcare Footer */}
      <footer className="bg-white border-t border-amber-900/10 py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-50 flex items-center justify-center">
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300/30" />
            </div>
            <div>
              <span className="font-serif-warm font-bold text-slate-900 text-sm">
                Personal Memory Companion
              </span>
              <p className="text-[11px] text-slate-400">
                “Games That Adapt to the Person, Not the Patient.”
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 max-w-md leading-relaxed">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 inline mr-1" />
            Supportive cognitive wellness platform. Does not replace professional clinical or diagnostic evaluation.
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Hackathon MVP • Node.js + React + Vite + TypeScript
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
