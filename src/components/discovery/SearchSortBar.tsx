import React from 'react';
import { Search, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { FilterState } from './FilterSidebar';

interface SearchSortBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onToggleMobileFilter: () => void;
  activeFilterCount: number;
}

export const SearchSortBar: React.FC<SearchSortBarProps> = ({
  filters,
  setFilters,
  onToggleMobileFilter,
  activeFilterCount,
}) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
      {/* Search Input */}
      <div className="relative w-full sm:flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
          placeholder="Search by scholarship title, provider, field, or keywords..."
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Controls: Mobile Filter Button & Sort Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        {/* Mobile Filter Toggle */}
        <button
          onClick={onToggleMobileFilter}
          className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort Select */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex-1 sm:flex-initial">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer w-full"
          >
            <option value="match">Highest Match (AI Diagnostic)</option>
            <option value="deadline">Deadline (Soonest First)</option>
            <option value="amount-high">Award Amount (Highest First)</option>
            <option value="amount-low">Award Amount (Lowest First)</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};
