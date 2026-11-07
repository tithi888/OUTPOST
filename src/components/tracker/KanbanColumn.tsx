import React from 'react';
import { ApplicationItem, ApplicationStatus } from '../../types';
import { TrackerCard } from './TrackerCard';
import { FolderKanban } from 'lucide-react';

interface KanbanColumnProps {
  status: ApplicationStatus;
  applications: ApplicationItem[];
  onOpenNotes: (app: ApplicationItem) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  applications,
  onOpenNotes,
}) => {
  const statusMeta: Record<ApplicationStatus, { label: string; headerColor: string; dotColor: string }> = {
    Interested: { label: 'Interested', headerColor: 'text-slate-700 bg-slate-100', dotColor: 'bg-slate-400' },
    Saved: { label: 'Saved', headerColor: 'text-purple-700 bg-purple-50', dotColor: 'bg-purple-500' },
    Applying: { label: 'In Progress / Drafting', headerColor: 'text-amber-800 bg-amber-50', dotColor: 'bg-amber-500' },
    Applied: { label: 'Submitted / Under Review', headerColor: 'text-blue-700 bg-blue-50', dotColor: 'bg-blue-500' },
    Approved: { label: 'Approved / Awarded', headerColor: 'text-emerald-800 bg-emerald-50', dotColor: 'bg-emerald-600' },
    Rejected: { label: 'Closed / Ineligible', headerColor: 'text-rose-700 bg-rose-50', dotColor: 'bg-rose-500' },
  };

  const meta = statusMeta[status];

  return (
    <div className="flex flex-col bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 min-w-[280px] max-w-[320px] w-full shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${meta.dotColor}`} />
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">{meta.label}</h4>
        </div>
        <span className="text-xs font-extrabold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
          {applications.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-18rem)] pr-0.5">
        {applications.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-400 text-xs">
            <FolderKanban className="w-5 h-5 mx-auto mb-1 text-slate-300" />
            <span>No scholarships in this stage</span>
          </div>
        ) : (
          applications.map((app) => (
            <TrackerCard key={app.id} application={app} onOpenNotes={onOpenNotes} />
          ))
        )}
      </div>
    </div>
  );
};
