import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ScholarshipCard } from '../components/discovery/ScholarshipCard';
import { FilterSidebar, FilterState } from '../components/discovery/FilterSidebar';
import { SearchSortBar } from '../components/discovery/SearchSortBar';
import { calculateEligibility } from '../utils/eligibilityCalculator';
import { getDaysRemaining } from '../utils/formatters';
import { Compass, Sparkles, FilterX, X } from 'lucide-react';
import { Category } from '../types';

export const DiscoveryPage: React.FC = () => {
  const { scholarships, profile, savedScholarshipIds } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mobile filter drawer open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Initialize filters with URL search params support
  const initialCategoryParam = searchParams.get('category') as Category | null;
  const initialSavedParam = searchParams.get('filter') === 'saved';
  const initialQueryParam = searchParams.get('q') || '';

  const initialFilters: FilterState = {
    searchQuery: initialQueryParam,
    educationLevels: [],
    categories: initialCategoryParam ? [initialCategoryParam] : [],
    awardTier: 'all',
    incomeCap: 'all',
    deadlineWindow: 'all',
    providerTypes: [],
    onlyHighMatch: false,
    onlySaved: initialSavedParam,
    sortBy: 'match',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Sync when query params change
  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    const isSaved = searchParams.get('filter') === 'saved';
    const q = searchParams.get('q') || '';

    if (cat || isSaved || q) {
      setFilters((prev) => ({
        ...prev,
        categories: cat ? [cat] : prev.categories,
        onlySaved: isSaved ? true : prev.onlySaved,
        searchQuery: q ? q : prev.searchQuery,
      }));
    }
  }, [searchParams]);

  // Compute active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.educationLevels.length > 0) count += filters.educationLevels.length;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.awardTier !== 'all') count++;
    if (filters.incomeCap !== 'all') count++;
    if (filters.deadlineWindow !== 'all') count++;
    if (filters.providerTypes.length > 0) count += filters.providerTypes.length;
    if (filters.onlyHighMatch) count++;
    if (filters.onlySaved) count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      educationLevels: [],
      categories: [],
      awardTier: 'all',
      incomeCap: 'all',
      deadlineWindow: 'all',
      providerTypes: [],
      onlyHighMatch: false,
      onlySaved: false,
      sortBy: 'match',
    });
    setSearchParams({});
  };

  // Filter & Sort Pipeline
  const filteredScholarships = useMemo(() => {
    return scholarships
      .map((s) => ({
        ...s,
        eligibility: calculateEligibility(s, profile),
        daysRemaining: getDaysRemaining(s.deadline),
      }))
      .filter((s) => {
        // Search Query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchProvider = s.provider.toLowerCase().includes(q);
          const matchOverview = s.overview.toLowerCase().includes(q);
          const matchTag = s.tags.some((t) => t.toLowerCase().includes(q));
          const matchCourse = s.courses.some((c) => c.toLowerCase().includes(q));
          if (!matchTitle && !matchProvider && !matchOverview && !matchTag && !matchCourse) {
            return false;
          }
        }

        // Education Levels
        if (filters.educationLevels.length > 0) {
          const hasEdu = s.educationLevels.some((lvl) => filters.educationLevels.includes(lvl));
          if (!hasEdu) return false;
        }

        // Categories
        if (filters.categories.length > 0) {
          if (!filters.categories.includes(s.category)) return false;
        }

        // Award Tier
        if (filters.awardTier === 'under5k' && s.amount >= 5000) return false;
        if (filters.awardTier === '5k-15k' && (s.amount < 5000 || s.amount > 15000)) return false;
        if (filters.awardTier === '15k-25k' && (s.amount < 15000 || s.amount > 25000)) return false;
        if (filters.awardTier === '25k-plus' && s.amount < 25000) return false;

        // Deadline Window
        if (filters.deadlineWindow === '7days' && (s.daysRemaining < 0 || s.daysRemaining > 7)) return false;
        if (filters.deadlineWindow === '30days' && (s.daysRemaining < 0 || s.daysRemaining > 30)) return false;
        if (filters.deadlineWindow === '60days' && (s.daysRemaining < 0 || s.daysRemaining > 60)) return false;

        // Provider Type
        if (filters.providerTypes.length > 0) {
          if (!filters.providerTypes.includes(s.providerType)) return false;
        }

        // High Match Only (>= 75%)
        if (filters.onlyHighMatch && s.eligibility.score < 75) return false;

        // Saved Bookmarks Only
        if (filters.onlySaved && !savedScholarshipIds.includes(s.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'match') {
          return b.eligibility.score - a.eligibility.score;
        }
        if (filters.sortBy === 'deadline') {
          return a.daysRemaining - b.daysRemaining;
        }
        if (filters.sortBy === 'amount-high') {
          return b.amount - a.amount;
        }
        if (filters.sortBy === 'amount-low') {
          return a.amount - b.amount;
        }
        return b.id.localeCompare(a.id);
      });
  }, [scholarships, profile, filters, savedScholarshipIds]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Scholarship Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Discover Verified Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Matching scholarships across corporate, governmental, university, and foundation endowments.
          </p>
        </div>

        {/* Live Active Student Profile Pill */}
        <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Scoring for: {profile.fullName.split(' ')[0]} ({profile.educationLevel})</span>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <SearchSortBar
        filters={filters}
        setFilters={setFilters}
        onToggleMobileFilter={() => setMobileFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Grid: Filters Sidebar + Scholarships List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            totalMatches={filteredScholarships.length}
            onReset={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 text-sm">Filter Opportunities</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                totalMatches={filteredScholarships.length}
                onReset={handleResetFilters}
                activeFilterCount={activeFilterCount}
              />

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Apply Filters ({filteredScholarships.length} Results)
              </button>
            </div>
          </div>
        )}

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-400">Active filters:</span>

              {filters.searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium">
                  Search: "{filters.searchQuery}"
                  <button onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-700" />
                  </button>
                </span>
              )}

              {filters.onlyHighMatch && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                  Match ≥ 75%
                  <button onClick={() => setFilters((p) => ({ ...p, onlyHighMatch: false }))}>
                    <X className="w-3 h-3 text-emerald-600" />
                  </button>
                </span>
              )}

              {filters.onlySaved && (
                <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-md font-bold">
                  Saved Bookmarks
                  <button onClick={() => setFilters((p) => ({ ...p, onlySaved: false }))}>
                    <X className="w-3 h-3 text-indigo-600" />
                  </button>
                </span>
              )}

              {filters.categories.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-md font-medium">
                  {c}
                  <button onClick={() => setFilters((p) => ({ ...p, categories: p.categories.filter((cat) => cat !== c) }))}>
                    <X className="w-3 h-3 text-purple-600" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Scholarship Cards List */}
          {filteredScholarships.length === 0 ? (
            /* Meaningful Empty State */
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FilterX className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No scholarships match your filters</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try broadening your search keywords, clearing award amount tiers, or toggling off the high-match restriction.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredScholarships.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
