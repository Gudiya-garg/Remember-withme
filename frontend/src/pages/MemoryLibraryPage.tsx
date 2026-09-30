import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  MapPin,
  Heart,
  Calendar,
  Clock,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Music
} from 'lucide-react';
import { MemoryItem, MemoryCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

export const MemoryLibraryPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      setLoading(true);
      const res = await api.getMemories();
      setMemories(res.memories);
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'strong') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3" /> Strong Recall
        </span>
      );
    }
    if (status === 'improving') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
          <TrendingUp className="w-3 h-3" /> Improving
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
        <RefreshCw className="w-3 h-3" /> Gentle Repetition
      </span>
    );
  };

  const filteredMemories = memories.filter((m) => {
    const matchesCategory =
      activeCategory === 'all' ||
      m.category === activeCategory ||
      (activeCategory === 'music' && (m.subType === 'song' || m.tags?.includes('music'))) ||
      (activeCategory === 'hobbies' && (m.subType === 'hobby' || m.subType === 'food'));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.relationship && m.relationship.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Family Album & Cognitive Archive
          </span>
          <h1 className="font-serif-warm text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            {t('memoryLibrary')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            A beautiful digital album preserving treasured family relationships, favorite tunes, and comforting routines.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search family, place, or song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-700 bg-white"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-amber-900/10">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          All Memories ({memories.length})
        </button>

        <button
          onClick={() => setActiveCategory('person')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeCategory === 'person'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" />
          <span>People ({memories.filter((m) => m.category === 'person').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('place')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeCategory === 'place'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Places ({memories.filter((m) => m.category === 'place').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('favorite')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeCategory === 'favorite'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-600" />
          <span>Favorites & Music ({memories.filter((m) => m.category === 'favorite').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('event')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeCategory === 'event'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Life Events ({memories.filter((m) => m.category === 'event').length})</span>
        </button>

        <button
          onClick={() => setActiveCategory('routine')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
            activeCategory === 'routine'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-900/10'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>Daily Routines ({memories.filter((m) => m.category === 'routine').length})</span>
        </button>
      </div>

      {/* Memory Album Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Sparkles className="w-8 h-8 text-emerald-800 animate-spin mx-auto mb-3" />
          <p className="font-serif-warm text-slate-600">Loading Album...</p>
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl p-8 border border-amber-900/10">
          <p className="text-slate-500 font-medium">No memories found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo container */}
                {mem.imageUrl ? (
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(mem.recallStats.status)}
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-amber-50 flex items-center justify-center p-4">
                    <Heart className="w-8 h-8 text-amber-700/60" />
                  </div>
                )}

                <div className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif-warm text-xl font-bold text-slate-900">
                        {mem.title}
                      </h3>
                      {mem.relationship && (
                        <span className="text-xs font-semibold text-emerald-800 block mt-0.5">
                          {mem.relationship}
                        </span>
                      )}
                    </div>

                    {!mem.imageUrl && getStatusBadge(mem.recallStats.status)}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                    “{mem.description}”
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-amber-900/10 flex items-center justify-between text-[11px] text-slate-500">
                <span>{mem.recallStats.totalAttempts} cognitive sessions</span>
                <span className="capitalize font-semibold text-emerald-900">
                  {mem.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
