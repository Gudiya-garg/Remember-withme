import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Image as ImageIcon,
  ShieldAlert
} from 'lucide-react';
import { MemoryProfile, MemoryItem, MemoryCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { RichnessIndicator } from '../components/RichnessIndicator';

export const MemoryProfilePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState<MemoryProfile | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [richness, setRichness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Memory Modal / Inline state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('person');
  const [newRelationship, setNewRelationship] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newYearOrTime, setNewYearOrTime] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    loadProfileAndMemories();
  }, []);

  const loadProfileAndMemories = async () => {
    try {
      setLoading(true);
      const profileData = await api.getProfile();
      const memoriesData = await api.getMemories();
      setProfile(profileData.profile);
      setMemories(memoriesData.memories);
      setRichness(memoriesData.richness);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileField = (field: keyof MemoryProfile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    try {
      const res = await api.updateProfile(profile.id, profile);
      setProfile(res.profile);
      setRichness(res.richness);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMemoryCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !profile) return;

    try {
      const res = await api.createMemory({
        profileId: profile.id,
        category: newCategory,
        title: newTitle,
        relationship: newRelationship,
        description: newDescription,
        imageUrl: newImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
        yearOrTime: newYearOrTime
      });

      setMemories((prev) => [...prev, res.memory]);
      setRichness(res.richness);
      setNewTitle('');
      setNewRelationship('');
      setNewDescription('');
      setNewImage('');
      setNewYearOrTime('');
      setIsAddingCard(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await api.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      // Refresh richness
      const memoriesData = await api.getMemories();
      setRichness(memoriesData.richness);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center">
        <Sparkles className="w-8 h-8 text-emerald-800 animate-spin mx-auto mb-3" />
        <p className="font-serif-warm text-lg text-slate-600">Loading Memory Profile...</p>
      </div>
    );
  }

  const peopleMemories = memories.filter((m) => m.category === 'person');
  const favoriteMemories = memories.filter((m) => m.category === 'favorite');
  const eventMemories = memories.filter((m) => m.category === 'event');
  const routineMemories = memories.filter((m) => m.category === 'routine');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Caregiver Memory Hub
          </span>
          <h1 className="font-serif-warm text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            {t('profileBuilderTitle')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('profileBuilderSub')}
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="elderly-btn bg-emerald-800 hover:bg-emerald-900 text-white min-h-[48px] py-2.5 px-6 rounded-xl shadow-md text-base"
        >
          <Save className="w-5 h-5 text-amber-300" />
          <span>{saveSuccess ? 'Saved Successfully!' : t('saveProfileBtn')}</span>
        </button>
      </div>

      {/* Richness Indicator Bar */}
      <RichnessIndicator richness={richness} />

      {/* Section 1: Person Profile Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-amber-900/10">
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
            <User className="w-5 h-5" />
          </span>
          <h2 className="font-serif-warm text-2xl font-bold text-slate-900">
            {t('personSection')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleUpdateProfileField('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:border-emerald-700 bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Age Range
            </label>
            <input
              type="text"
              value={profile.ageRange}
              onChange={(e) => handleUpdateProfileField('ageRange', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:border-emerald-700 bg-[#FAF8F5]"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Preferred Language
            </label>
            <select
              value={profile.preferredLanguage}
              onChange={(e) => handleUpdateProfileField('preferredLanguage', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:border-emerald-700 bg-[#FAF8F5]"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
              Caregiver Reference
            </label>
            <input
              type="text"
              value={profile.caregiverName}
              onChange={(e) => handleUpdateProfileField('caregiverName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:border-emerald-700 bg-[#FAF8F5]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
            Personal Caregiver Notes & Comfort Topics
          </label>
          <textarea
            rows={2}
            value={profile.notes || ''}
            onChange={(e) => handleUpdateProfileField('notes', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-800 text-sm focus:border-emerald-700 bg-[#FAF8F5]"
            placeholder="Enjoys talking about grandchildren, old songs from 1970s, morning tea on the veranda..."
          />
        </div>
      </div>

      {/* Section 2: Family & People */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="font-serif-warm text-2xl font-bold text-slate-900">
              {t('familySection')}
            </h2>
          </div>

          <button
            onClick={() => {
              setNewCategory('person');
              setIsAddingCard(true);
            }}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Person</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {peopleMemories.map((person) => (
            <div
              key={person.id}
              className="bg-[#FAF8F5] rounded-2xl p-4 border border-amber-900/10 flex flex-col justify-between relative group"
            >
              <div>
                {person.imageUrl && (
                  <img
                    src={person.imageUrl}
                    alt={person.title}
                    className="w-full h-40 object-cover rounded-xl mb-3 border border-amber-900/10"
                  />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-warm text-lg font-bold text-slate-900">
                    {person.title}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {person.relationship}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3">
                  {person.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-amber-900/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {person.recallStats.totalAttempts} attempts
                </span>
                <button
                  onClick={() => handleDeleteMemory(person.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                  title="Remove memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Favorites & Life Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favorites */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-100 text-rose-800">
                <Heart className="w-5 h-5" />
              </span>
              <h2 className="font-serif-warm text-xl font-bold text-slate-900">
                {t('favoritesSection')}
              </h2>
            </div>
            <button
              onClick={() => {
                setNewCategory('favorite');
                setIsAddingCard(true);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-100 text-rose-900 hover:bg-rose-200"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {favoriteMemories.map((fav) => (
              <div
                key={fav.id}
                className="p-3.5 bg-[#FAF8F5] rounded-xl border border-amber-900/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{fav.title}</h4>
                  <p className="text-xs text-slate-500">{fav.relationship || fav.description.slice(0, 50)}</p>
                </div>
                <button
                  onClick={() => handleDeleteMemory(fav.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Routines */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <Clock className="w-5 h-5" />
              </span>
              <h2 className="font-serif-warm text-xl font-bold text-slate-900">
                {t('routinesSection')}
              </h2>
            </div>
            <button
              onClick={() => {
                setNewCategory('routine');
                setIsAddingCard(true);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-100 text-blue-900 hover:bg-blue-200"
            >
              + Add
            </button>
          </div>

          <div className="space-y-3">
            {routineMemories.map((routine) => (
              <div
                key={routine.id}
                className="p-3.5 bg-[#FAF8F5] rounded-xl border border-amber-900/10 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{routine.title}</h4>
                  <p className="text-xs text-blue-800 font-medium">{routine.relationship || routine.yearOrTime}</p>
                </div>
                <button
                  onClick={() => handleDeleteMemory(routine.id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Memory Modal / Card Form */}
      {isAddingCard && (
        <div className="bg-amber-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-700 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif-warm text-xl font-bold text-slate-900">
              Add New Memory to {profile.name}’s Profile
            </h3>
            <button
              onClick={() => setIsAddingCard(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddMemoryCard} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="person">Family & Person</option>
                  <option value="place">Beloved Place</option>
                  <option value="favorite">Favorite (Song/Food/Hobby)</option>
                  <option value="event">Life Event</option>
                  <option value="routine">Daily Routine</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Meena, Shiva Temple, Morning Tea"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Relationship or Time Note
                </label>
                <input
                  type="text"
                  placeholder="e.g., Daughter, 7:00 AM, Winter 1982"
                  value={newRelationship}
                  onChange={(e) => setNewRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Description / Warm Story
              </label>
              <textarea
                required
                rows={2}
                placeholder="Describe this memory with warm, sensory details that can be used for clues..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Photo URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCard(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-amber-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm"
              >
                Add Memory Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Non-diagnostic notice */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-center text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 text-emerald-800 inline-block mr-1.5 -mt-0.5" />
        Memory profiles and cognitive activities are built for companion support and wellbeing, and do not constitute medical diagnosis.
      </div>
    </div>
  );
};
