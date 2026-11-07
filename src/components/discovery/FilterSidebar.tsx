import React from 'react';
import { Filter, RotateCcw, Check, Sparkles, Bookmark } from 'lucide-react';
import { EducationLevel, Category } from '../../types';

export interface FilterState {
  searchQuery: string;
  educationLevels: EducationLevel[];
  categories: Category[];
  awardTier: 'all' | 'under5k' | '5k-15k' | '15k-25k' | '25k-plus';
  incomeCap: 'all' | '50k' | '75k' | '100k';
  deadlineWindow: 'all' | '7days' | '30days' | '60days';
  providerTypes: string[];
  onlyHighMatch: boolean;
  onlySaved: boolean;
  sortBy: 'match' | 'deadline' | 'amount-high' | 'amount-low' | 'newest';
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onReset: () => void;
  activeFilterCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  totalMatches,
  onReset,
  activeFilterCount,
}) => {
  const educationOptions: EducationLevel[] = [
    'High School',
    'Undergraduate',
    'Postgraduate',
    'Doctoral',
  ];

  const categoryOptions: Category[] = [
    'STEM',
    'Women in Tech',
    'First-Generation',
    'Need-Based',
    'Merit-Based',
    'Arts & Humanities',
    'Minority / Underrepresented',
    'General',
  ];

  const providerTypeOptions = [
    'Government',
    'Corporate',
    'Foundation',
    'University',
    'International',
  ];

  const toggleEducation = (level: EducationLevel) => {
    setFilters((prev) => ({
      ...prev,
      educationLevels: prev.educationLevels.includes(level)
        ? prev.educationLevels.filter((l) => l !== level)
        : [...prev.educationLevels, level],
    }));
  };

  const toggleCategory = (cat: Category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleProviderType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      providerTypes: prev.providerTypes.includes(type)
        ? prev.providerTypes.filter((t) => t !== type)
        : [...prev.providerTypes, type],
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Filter Discovery</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2">
        <label
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
            filters.onlyHighMatch
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Smart Match ≥ 75% Only</span>
          </div>
          <input
            type="checkbox"
            checked={filters.onlyHighMatch}
            onChange={(e) => setFilters((prev) => ({ ...prev, onlyHighMatch: e.target.checked }))}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
        </label>

        <label
          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
            filters.onlySaved
              ? 'bg-indigo-50/70 border-indigo-300 text-indigo-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/70'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>Saved Bookmarks Only</span>
          </div>
          <input
            type="checkbox"
            checked={filters.onlySaved}
            onChange={(e) => setFilters((prev) => ({ ...prev, onlySaved: e.target.checked }))}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
          />
        </label>
      </div>

      {/* Education Level */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Education Level
        </h4>
        <div className="space-y-1.5">
          {educationOptions.map((level) => {
            const isSelected = filters.educationLevels.includes(level);
            return (
              <label
                key={level}
                onClick={() => toggleEducation(level)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{level}</span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category / Discipline */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Category & Demographics
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {categoryOptions.map((cat) => {
            const isSelected = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Award Amount Tiers */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Award Amount
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Any Amount' },
            { id: 'under5k', label: '< $5,000' },
            { id: '5k-15k', label: '$5k – $15k' },
            { id: '15k-25k', label: '$15k – $25k' },
            { id: '25k-plus', label: '$25,000+' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilters((prev) => ({ ...prev, awardTier: item.id as any }))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                filters.awardTier === item.id
                  ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deadline Urgency */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Application Deadline
        </h4>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Deadlines' },
            { id: '7days', label: 'Urgent: Due in 7 Days' },
            { id: '30days', label: 'Due in 30 Days' },
            { id: '60days', label: 'Due in 60 Days' },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => setFilters((prev) => ({ ...prev, deadlineWindow: item.id as any }))}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                filters.deadlineWindow === item.id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  filters.deadlineWindow === item.id
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300'
                }`}
              >
                {filters.deadlineWindow === item.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Provider Type */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Provider Type
        </h4>
        <div className="space-y-1.5">
          {providerTypeOptions.map((type) => {
            const isSelected = filters.providerTypes.includes(type);
            return (
              <label
                key={type}
                onClick={() => toggleProviderType(type)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{type}</span>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="font-bold text-slate-900">{totalMatches}</span> matching opportunities
        </p>
      </div>
    </div>
  );
};
