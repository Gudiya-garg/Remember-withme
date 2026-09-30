import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Game, GameChoice, SongEntry } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  Volume2, HelpCircle, CheckCircle, Music, Heart,
  Play, Pause, AlertCircle, Radio,
} from 'lucide-react';

interface MusicMemoryGameProps {
  game: Game;
  onAttempt: (isCorrect: boolean, hintsUsed: number, selectedId: string) => void;
  disabled?: boolean;
}

// ─── Small helper: format seconds → "m:ss" ───────────────────────────────────
function fmtTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Individual song player card ─────────────────────────────────────────────
interface SongCardProps {
  song: SongEntry;
  language: 'en' | 'hi';
  isActivePlayer: boolean;
  onRequestPlay: (id: string) => void;
  onRequestPause: () => void;
  /** Shared audio ref — only used when this card IS the active player */
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const SongCard: React.FC<SongCardProps> = ({
  song, language, isActivePlayer, onRequestPlay, onRequestPause, audioRef,
}) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);       // 0..1
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const note = song.memoryNote?.[language] || song.memoryNote?.en || '';

  // When another card becomes active, pause local state
  useEffect(() => {
    if (!isActivePlayer) {
      setPlaying(false);
    }
  }, [isActivePlayer]);

  // Attach audio event listeners when this card owns the active player
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isActivePlayer) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };
    const onError = () => { setLoadError(true); setPlaying(false); };
    const onCanPlay = () => setLoadError(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplay', onCanPlay);
    };
  }, [isActivePlayer, audioRef]);

  const handleToggle = () => {
    if (loadError) return;
    const audio = audioRef.current;

    if (!isActivePlayer) {
      // Ask parent to set this song as active, then play
      onRequestPlay(song.id);
      return;
    }

    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      onRequestPause();
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setLoadError(true));
    }
  };

  // Scrub bar click
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActivePlayer || loadError) return;
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const isPlaying = isActivePlayer && playing;

  return (
    <div
      className={`
        rounded-2xl border-2 p-5 transition-all duration-300
        ${isPlaying
          ? 'border-purple-400 bg-purple-50 shadow-md shadow-purple-100'
          : 'border-amber-900/15 bg-[#FAF8F5] hover:border-amber-300'}
      `}
    >
      {/* Top row: cover + info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative shrink-0">
          <img
            src={song.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=80&q=60'}
            alt={song.title}
            className={`w-16 h-16 rounded-xl object-cover ${isPlaying ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
          />
          {isPlaying && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-lg leading-tight truncate">{song.title}</p>
          <p className="text-sm text-slate-500 font-medium truncate">{song.artist}</p>
          {note && (
            <p className="text-xs text-amber-700 italic mt-1 leading-snug line-clamp-2">{note}</p>
          )}
        </div>
      </div>

      {/* Error state */}
      {loadError && isActivePlayer && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-sm text-amber-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            {language === 'hi'
              ? 'ऑडियो फ़ाइल नहीं मिली। कृपया MP3 फ़ाइल यहाँ रखें: '
              : 'Audio file not found. Please add the MP3 file at: '}
            <code className="font-mono text-xs bg-amber-100 px-1 rounded">{song.audioUrl}</code>
          </span>
        </div>
      )}

      {/* Progress bar (only when active) */}
      {isActivePlayer && !loadError && (
        <div className="mb-3">
          <div
            className="relative w-full h-3 bg-slate-200 rounded-full cursor-pointer"
            onClick={handleScrub}
            role="slider"
            aria-label={`Song progress: ${fmtTime(currentTime)} of ${fmtTime(duration)}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${progress * 100}%` }}
            />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full shadow border-2 border-white"
              style={{ left: `calc(${progress * 100}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono mt-1">
            <span>{fmtTime(currentTime)}</span>
            <span>{duration > 0 ? fmtTime(duration) : '--:--'}</span>
          </div>
        </div>
      )}

      {/* Play/Pause button — large for elderly */}
      <button
        id={`play-btn-${song.id}`}
        onClick={handleToggle}
        disabled={loadError}
        aria-label={isPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
        className={`
          w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg
          transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
          ${isPlaying
            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200'
            : 'bg-amber-900/90 hover:bg-amber-800 text-amber-50 shadow-sm'}
        `}
      >
        {isPlaying
          ? <><Pause className="w-6 h-6" /> <span>{language === 'hi' ? 'रोकें' : 'Pause'}</span></>
          : <><Play className="w-6 h-6" fill="currentColor" /> <span>{language === 'hi' ? 'बजाएं' : 'Play'}</span></>
        }
      </button>
    </div>
  );
};

// ─── Main game component ─────────────────────────────────────────────────────
export const MusicMemoryGame: React.FC<MusicMemoryGameProps> = ({ game, onAttempt, disabled }) => {
  const { language, t, speak } = useLanguage();
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  // Audio state — one shared <audio> element
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSongId, setActiveSongId] = useState<string | null>(null);

  const promptText = game.prompt[language] || game.prompt.en;
  const hintText = game.supportiveHint[language] || game.supportiveHint.en;
  const songs: SongEntry[] = game.songs ?? [];

  // Initialize/update the <audio> src whenever activeSongId changes
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (activeSongId) {
      const song = songs.find((s) => s.id === activeSongId);
      if (song) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.load();
        audioRef.current.play().catch(() => {
          // Errors are handled inside SongCard via the 'error' event
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [activeSongId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleRequestPlay = useCallback((songId: string) => {
    // Pause current if different
    if (activeSongId && activeSongId !== songId && audioRef.current) {
      audioRef.current.pause();
    }
    setActiveSongId(songId);
  }, [activeSongId]);

  const handleRequestPause = useCallback(() => {
    // Active song stays active but paused; SongCard manages play state internally
  }, []);

  const handleRevealHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsUsedCount((prev) => prev + 1);
      speak(hintText);
    }
  };

  const handleSelectChoice = (choice: GameChoice) => {
    if (selectedChoiceId !== null || disabled) return;
    setSelectedChoiceId(choice.id);
    onAttempt(choice.isCorrect, hintsUsedCount, choice.id);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/10 shadow-sm max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Music className="w-5 h-5 text-purple-700" />
          </span>
          <div>
            <h2 className="font-serif-warm text-2xl sm:text-3xl font-bold text-slate-900">
              {game.title[language] || game.title.en}
            </h2>
            <p className="text-xs text-slate-500 font-medium">Sensory &amp; Musical Memory Recall</p>
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

      {/* ── Vintage Radio banner ── */}
      <div className="bg-gradient-to-r from-amber-900/90 to-amber-950 text-amber-50 rounded-2xl p-5 mb-7 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-800/80 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 text-amber-300" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block">
            {language === 'hi' ? 'प्रिय गीत — सुनिए और याद कीजिए' : 'Beloved Songs — Listen & Remember'}
          </span>
          <p className="font-serif-warm text-white text-lg leading-snug mt-0.5">
            {promptText}
          </p>
        </div>
      </div>

      {/* ── Song cards ── */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
          <Music className="w-10 h-10 opacity-40" />
          <p className="text-center text-sm">
            {language === 'hi'
              ? 'कोई गीत उपलब्ध नहीं है।'
              : 'No songs available for this profile yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-8">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              language={language}
              isActivePlayer={activeSongId === song.id}
              onRequestPlay={handleRequestPlay}
              onRequestPause={handleRequestPause}
              audioRef={audioRef}
            />
          ))}
        </div>
      )}

      {/* ── Quiz section (who sang this?) ── */}
      {game.choices && game.choices.length > 0 && (
        <>
          <div className="border-t border-amber-900/10 pt-6 mb-5">
            <p className="text-center font-serif-warm text-xl sm:text-2xl text-slate-800 font-medium leading-snug">
              {language === 'hi'
                ? 'ऊपर दिए गए गीत को सुनें और बताएं — यह किसने गाया?'
                : 'After listening above, who do you think sang this song?'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {game.choices.map((choice) => {
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
                  id={`choice-${choice.id}`}
                  onClick={() => handleSelectChoice(choice)}
                  disabled={selectedChoiceId !== null || disabled}
                  className={`elderly-btn border-2 text-left justify-start ${btnStyle}`}
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 font-bold text-slate-600">
                    {choice.isCorrect && selectedChoiceId !== null
                      ? <CheckCircle className="w-5 h-5 text-emerald-700" />
                      : <Music className="w-4 h-4 text-purple-600" />
                    }
                  </div>
                  <span className="text-lg font-semibold">
                    {choice.label[language] || choice.label.en}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── Gentle hint ── */}
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
