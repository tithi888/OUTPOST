import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDeadlineText, formatDatePretty, getDaysRemaining } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const DeadlinesPage: React.FC = () => {
  const { scholarships, applications, isScholarshipSaved, getApplicationByScholarshipId } = useApp();
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'urgent' | 'warning' | 'normal' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrich scholarships with deadline info and tracked status
  const scholarshipsWithDeadlines = useMemo(() => {
    return scholarships
      .map((s) => {
        const days = getDaysRemaining(s.deadline);
        const deadlineInfo = formatDeadlineText(s.deadline);
        const trackedApp = getApplicationByScholarshipId(s.id);
        const isSaved = isScholarshipSaved(s.id);
        return {
          ...s,
          days,
          deadlineInfo,
          trackedApp,
          isSaved,
        };
      })
      .filter((s) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = s.title.toLowerCase().includes(q);
          const matchProvider = s.provider.toLowerCase().includes(q);
          if (!matchTitle && !matchProvider) return false;
        }
        if (filterUrgency !== 'all' && s.deadlineInfo.urgency !== filterUrgency) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.days - b.days);
  }, [scholarships, applications, isScholarshipSaved, filterUrgency, searchQuery]);

  // Urgent counts
  const urgentCount = scholarships.filter((s) => formatDeadlineText(s.deadline).urgency === 'urgent').length;
  const warningCount = scholarships.filter((s) => formatDeadlineText(s.deadline).urgency === 'warning').length;
  const expiredCount = scholarships.filter((s) => formatDeadlineText(s.deadline).urgency === 'expired').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Deadline Sentinel & Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Deadline Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chronological timeline of upcoming submission cutoffs so you never miss funding opportunities.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>{urgentCount} Critical Deadlines (&lt;7 days)</span>
          </div>
        </div>
      </div>

      {/* KPI Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setFilterUrgency('urgent')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterUrgency === 'urgent' ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400' : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-bold">
            <span>Critical (&lt; 7 Days)</span>
            <Flame className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{urgentCount}</div>
          <p className="text-[11px] text-slate-500">Requires immediate action</p>
        </div>

        <div 
          onClick={() => setFilterUrgency('warning')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterUrgency === 'warning' ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
            <span>Approaching (&lt; 30 Days)</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{warningCount}</div>
          <p className="text-[11px] text-slate-500">Finalize transcripts & essays</p>
        </div>

        <div 
          onClick={() => setFilterUrgency('normal')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterUrgency === 'normal' ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400' : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-indigo-700 font-bold">
            <span>Future (30+ Days)</span>
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {scholarships.length - urgentCount - warningCount - expiredCount}
          </div>
          <p className="text-[11px] text-slate-500">Preparation window open</p>
        </div>

        <div 
          onClick={() => setFilterUrgency('expired')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            filterUrgency === 'expired' ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400' : 'bg-white border-slate-200/90 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Passed Deadlines</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{expiredCount}</div>
          <p className="text-[11px] text-slate-500">Awaiting next cycle</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deadlines by title or provider..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterUrgency('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterUrgency === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Deadlines ({scholarships.length})
          </button>
          <button
            onClick={() => setFilterUrgency('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterUrgency === 'urgent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Urgent (&lt;7d)
          </button>
          <button
            onClick={() => setFilterUrgency('warning')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterUrgency === 'warning' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Approaching (&lt;30d)
          </button>
          <button
            onClick={() => setFilterUrgency('expired')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterUrgency === 'expired' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Passed
          </button>
        </div>
      </div>

      {/* Deadlines Timeline Table / Cards List */}
      <div className="space-y-3">
        {scholarshipsWithDeadlines.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400 text-xs">
            No scholarships found matching this deadline window.
          </div>
        ) : (
          scholarshipsWithDeadlines.map((item) => {
            const urgency = item.deadlineInfo.urgency;
            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  urgency === 'urgent'
                    ? 'border-rose-300 shadow-rose-500/5 bg-gradient-to-r from-rose-50/30 to-white'
                    : urgency === 'warning'
                    ? 'border-amber-200'
                    : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold ${
                      urgency === 'urgent'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : urgency === 'warning'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : urgency === 'expired'
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono">
                      {new Date(item.deadline).toLocaleString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-base leading-none">
                      {new Date(item.deadline).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-500">{item.provider}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-slate-800">{item.amountFormatted}</span>
                      {item.isSaved && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          <Bookmark className="w-2.5 h-2.5 fill-indigo-600" />
                          Saved
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/scholarship/${item.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors block mt-0.5"
                    >
                      {item.title}
                    </Link>

                    {item.trackedApp && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Pipeline Status: {item.trackedApp.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${
                        urgency === 'urgent'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : urgency === 'warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : urgency === 'expired'
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.deadlineInfo.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 sm:text-right">
                      Due: {item.deadline}
                    </span>
                  </div>

                  <Link
                    to={`/scholarship/${item.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    <span>View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
