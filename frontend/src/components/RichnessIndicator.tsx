import React from 'react';
import { Sparkles, Users, MapPin, Heart, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface RichnessIndicatorProps {
  richness?: {
    percentage: number;
    label: string;
    details: {
      people: number;
      places: number;
      favorites: number;
      events: number;
      routines: number;
    };
    suggestions?: string[];
  };
}

export const RichnessIndicator: React.FC<RichnessIndicatorProps> = ({ richness }) => {
  if (!richness) return null;

  const { percentage = 75, label = 'Rich & Personalized', details, suggestions = [] } = richness;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </span>
            <h3 className="font-serif-warm text-xl sm:text-2xl font-bold text-slate-900">
              Your Memory Profile Richness
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            More diverse memories create richer, less repetitive cognitive activities.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
            {percentage}%
          </span>
          <span className="block text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            {label}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3.5 bg-amber-100/70 rounded-full overflow-hidden mb-6 p-0.5 border border-amber-200">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Category Counts Breakdown */}
      {details && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10 text-center">
            <Users className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
            <span className="text-base font-bold text-slate-900 block">{details.people}</span>
            <span className="text-[11px] font-medium text-slate-500">People</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10 text-center">
            <MapPin className="w-4 h-4 text-amber-700 mx-auto mb-1" />
            <span className="text-base font-bold text-slate-900 block">{details.places}</span>
            <span className="text-[11px] font-medium text-slate-500">Places</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10 text-center">
            <Heart className="w-4 h-4 text-rose-700 mx-auto mb-1" />
            <span className="text-base font-bold text-slate-900 block">{details.favorites}</span>
            <span className="text-[11px] font-medium text-slate-500">Favorites</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10 text-center">
            <Calendar className="w-4 h-4 text-indigo-700 mx-auto mb-1" />
            <span className="text-base font-bold text-slate-900 block">{details.events}</span>
            <span className="text-[11px] font-medium text-slate-500">Events</span>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-amber-900/10 text-center col-span-2 sm:col-span-1">
            <Clock className="w-4 h-4 text-blue-700 mx-auto mb-1" />
            <span className="text-base font-bold text-slate-900 block">{details.routines}</span>
            <span className="text-[11px] font-medium text-slate-500">Routines</span>
          </div>
        </div>
      )}

      {/* Helpful Caregiver Suggestion */}
      {suggestions.length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong className="font-semibold">Gentle Tip:</strong> {suggestions[0]}
          </span>
        </div>
      )}
    </div>
  );
};
