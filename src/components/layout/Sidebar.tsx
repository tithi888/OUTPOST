import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Compass, 
  LayoutDashboard, 
  Kanban, 
  FileText, 
  Calendar, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInitials, formatCurrency } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const { profile, applications, documents, savedScholarshipIds } = useApp();

  // Calculate document readiness %
  const availableDocsCount = documents.filter((d) => d.status === 'Available' || d.status === 'Uploaded (Demo)').length;
  const docReadinessPct = Math.round((availableDocsCount / (documents.length || 1)) * 100);

  // Calculate in-progress applications
  const inProgressCount = applications.filter((a) => a.status === 'Applying' || a.status === 'Applied').length;

  const links = [
    { label: 'Discovery Engine', path: '/discover', icon: Compass },
    { label: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { 
      label: 'Application Tracker', 
      path: '/tracker', 
      icon: Kanban, 
      count: applications.length 
    },
    { 
      label: 'Document Vault', 
      path: '/documents', 
      icon: FileText, 
      subtext: `${docReadinessPct}% ready` 
    },
    { label: 'Deadline Sentinel', path: '/deadlines', icon: Calendar },
    { label: 'Profile & Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between h-[calc(100vh-6.25rem)] sticky top-25 hidden md:flex shrink-0">
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* User Mini Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
            {getInitials(profile.fullName)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">{profile.fullName}</h4>
            <p className="text-[11px] text-slate-500 truncate">{profile.course || profile.educationLevel}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-emerald-700">Verified Profile</span>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div>
          <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Main Workspace
          </p>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      {link.count !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {link.count}
                        </span>
                      )}
                      {link.subtext && !isActive && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          {link.subtext}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Document Readiness Progress Card */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 border border-indigo-100 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-950">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Document Vault
            </span>
            <span className="text-[11px] font-bold text-indigo-600">{docReadinessPct}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${docReadinessPct}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {availableDocsCount} of {documents.length} verified documents ready for 1-click submission.
          </p>
        </div>

        {/* Quick Pipeline Summary */}
        <div className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Saved Bookmarks</span>
            <span className="font-bold text-slate-700">{savedScholarshipIds.length}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Active Submissions</span>
            <span className="font-bold text-indigo-600">{inProgressCount}</span>
          </div>
        </div>
      </div>

      {/* Footer Info / Help */}
      <div className="p-4 border-t border-slate-200/80 bg-slate-50/50">
        <NavLink
          to="/onboarding"
          className="flex items-center justify-between text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Rerun Onboarding
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </NavLink>
      </div>
    </aside>
  );
};
