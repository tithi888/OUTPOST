import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { ApplicationItem, ApplicationStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDeadlineText, formatDatePretty } from '../../utils/formatters';

interface TrackerCardProps {
  application: ApplicationItem;
  onOpenNotes: (app: ApplicationItem) => void;
}

export const TrackerCard: React.FC<TrackerCardProps> = ({ application, onOpenNotes }) => {
  const { updateApplicationStatus, removeApplication } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const deadlineInfo = formatDeadlineText(application.deadline);

  const statuses: ApplicationStatus[] = [
    'Interested',
    'Saved',
    'Applying',
    'Applied',
    'Approved',
    'Rejected',
  ];

  const statusBorderColors: Record<ApplicationStatus, string> = {
    Interested: 'hover:border-slate-400',
    Saved: 'hover:border-purple-400',
    Applying: 'hover:border-amber-400',
    Applied: 'hover:border-blue-400',
    Approved: 'hover:border-emerald-500',
    Rejected: 'hover:border-rose-400',
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all ${statusBorderColors[application.status]} space-y-3 relative group`}>
      {/* Top Header: Title & Menu */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 block truncate max-w-[180px]">
            {application.provider}
          </span>
          <Link
            to={`/scholarship/${application.scholarshipId}`}
            className="text-xs sm:text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-2 leading-tight"
          >
            {application.scholarshipTitle}
          </Link>
        </div>

        {/* Quick Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            aria-label="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in-50 text-xs">
              <Link
                to={`/scholarship/${application.scholarshipId}`}
                className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                View Details
              </Link>
              <button
                onClick={() => {
                  onOpenNotes(application);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Edit Notes ({application.history.length})
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  removeApplication(application.id);
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Amount & Deadline */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="font-extrabold text-slate-900 tracking-tight">
          {application.amountFormatted}
        </span>

        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          deadlineInfo.urgency === 'urgent'
            ? 'bg-rose-50 text-rose-700 border border-rose-200'
            : deadlineInfo.urgency === 'warning'
            ? 'bg-amber-50 text-amber-800'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {deadlineInfo.label}
        </span>
      </div>

      {/* Personal Notes Snippet */}
      {application.notes && (
        <div 
          onClick={() => onOpenNotes(application)}
          className="bg-slate-50 p-2 rounded-lg text-[11px] text-slate-600 cursor-pointer hover:bg-slate-100/80 transition-colors border border-slate-100 line-clamp-2"
          title="Click to expand notes and history"
        >
          <span className="font-semibold text-slate-700">Note: </span>
          {application.notes}
        </div>
      )}

      {/* Bottom Controls: Status Switcher Dropdown */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatDatePretty(application.lastUpdated)}</span>
        </div>

        <div className="relative">
          <select
            value={application.status}
            onChange={(e) => updateApplicationStatus(application.id, e.target.value as ApplicationStatus)}
            className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200/80 focus:outline-none cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                Move to: {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
