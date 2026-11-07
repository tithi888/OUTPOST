import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Kanban, 
  List, 
  Search, 
  Plus, 
  Clock, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationItem, ApplicationStatus } from '../types';
import { KanbanColumn } from '../components/tracker/KanbanColumn';
import { NoteModal } from '../components/tracker/NoteModal';
import { formatDeadlineText, formatDatePretty } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const TrackerPage: React.FC = () => {
  const { applications, updateApplicationStatus, removeApplication } = useApp();
  
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  
  // Note Modal state
  const [activeNoteApp, setActiveNoteApp] = useState<ApplicationItem | null>(null);

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Saved',
    'Applying',
    'Applied',
    'Approved',
    'Rejected',
  ];

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = app.scholarshipTitle.toLowerCase().includes(q);
        const matchesProvider = app.provider.toLowerCase().includes(q);
        const matchesNotes = app.notes.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProvider && !matchesNotes) return false;
      }
      if (statusFilter !== 'all' && app.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [applications, searchQuery, statusFilter]);

  // Aggregate Metrics
  const activeCount = applications.filter((a) => a.status === 'Applying' || a.status === 'Applied').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Kanban className="w-4 h-4" />
            <span>Scholarship Application Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Pipeline Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track submissions, manage notes, and keep audit history synchronized across your application lifecycle.
          </p>
        </div>

        {/* View Mode Toggle & Discovery Link */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Link
            to="/discover"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tracked</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{applications.length}</span>
          <span className="text-[11px] text-slate-500">In current pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
          <span className="text-2xl font-extrabold text-amber-600 block">{activeCount}</span>
          <span className="text-[11px] text-amber-800">Drafting or submitted</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Awarded & Approved</span>
          <span className="text-2xl font-extrabold text-emerald-600 block">{approvedCount}</span>
          <span className="text-[11px] text-emerald-800">Verified scholarship awards</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Success Rate</span>
          <span className="text-2xl font-extrabold text-indigo-600 block">
            {applications.length > 0 ? Math.round((approvedCount / applications.length) * 100) : 0}%
          </span>
          <span className="text-[11px] text-indigo-800">Conversion to sanction</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracked applications..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Filter:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st} ({applications.filter((a) => a.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-max">
            {statuses.map((status) => {
              const columnApps = filteredApps.filter((a) => a.status === status);
              return (
                <KanbanColumn
                  key={status}
                  status={status}
                  applications={columnApps}
                  onOpenNotes={(app) => setActiveNoteApp(app)}
                />
              );
            })}
          </div>
        </div>
      ) : (
        /* TABLE / LIST VIEW */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Scholarship</th>
                  <th className="py-3 px-4">Award Value</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Personal Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No applications found matching your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => {
                    const dl = formatDeadlineText(app.deadline);
                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                          <Link
                            to={`/scholarship/${app.scholarshipId}`}
                            className="hover:text-indigo-600 block truncate"
                          >
                            {app.scholarshipTitle}
                          </Link>
                          <span className="text-[11px] font-normal text-slate-400">{app.provider}</span>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {app.amountFormatted}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="block font-medium">{app.deadline}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            dl.urgency === 'urgent' ? 'bg-rose-50 text-rose-700' : 'text-slate-500'
                          }`}>
                            {dl.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                            className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer"
                          >
                            {statuses.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div
                            onClick={() => setActiveNoteApp(app)}
                            className="cursor-pointer hover:text-indigo-600 text-slate-600 truncate"
                            title="Click to edit notes"
                          >
                            {app.notes || <span className="text-slate-300 italic">Add note...</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveNoteApp(app)}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md"
                              title="Edit notes & history"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeApplication(app.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                              title="Remove from tracker"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notes & Audit History Modal */}
      <NoteModal
        application={activeNoteApp}
        isOpen={Boolean(activeNoteApp)}
        onClose={() => setActiveNoteApp(null)}
      />
    </div>
  );
};
