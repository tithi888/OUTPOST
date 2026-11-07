import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Bookmark, 
  Kanban, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Compass, 
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { calculateEligibility } from '../utils/eligibilityCalculator';
import { formatCurrency, formatDeadlineText, formatDatePretty } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const DashboardPage: React.FC = () => {
  const { profile, scholarships, applications, savedScholarshipIds, documents } = useApp();

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Calculate matching scholarships
  const evaluatedScholarships = scholarships.map((s) => ({
    ...s,
    eligibility: calculateEligibility(s, profile),
  }));

  const highMatches = evaluatedScholarships
    .filter((s) => s.eligibility.score >= 75)
    .sort((a, b) => b.eligibility.score - a.eligibility.score);

  const totalFundingPotential = highMatches.reduce((acc, curr) => acc + curr.amount, 0);

  // Application Pipeline stats
  const inProgressApps = applications.filter((a) => a.status === 'Applying');
  const submittedApps = applications.filter((a) => a.status === 'Applied');
  const approvedApps = applications.filter((a) => a.status === 'Approved');

  // Document Readiness
  const availableDocsCount = documents.filter((d) => d.status === 'Available' || d.status === 'Uploaded (Demo)').length;
  const docReadinessPct = Math.round((availableDocsCount / (documents.length || 1)) * 100);

  // Profile completion score
  const profileFields = [
    profile.fullName,
    profile.educationLevel,
    profile.institution,
    profile.course,
    profile.state,
    profile.annualFamilyIncome > 0,
    profile.category,
    profile.gpa > 0,
    profile.scholarshipPreferences.length > 0,
  ];
  const completedFieldCount = profileFields.filter(Boolean).length;
  const profileCompletionPct = Math.round((completedFieldCount / profileFields.length) * 100);

  // Data for Recharts Pipeline Bar Chart
  const pipelineChartData = [
    { name: 'Interested', count: applications.filter((a) => a.status === 'Interested').length, fill: '#94a3b8' },
    { name: 'Saved', count: applications.filter((a) => a.status === 'Saved').length, fill: '#a855f7' },
    { name: 'Applying', count: inProgressApps.length, fill: '#f59e0b' },
    { name: 'Applied', count: submittedApps.length, fill: '#3b82f6' },
    { name: 'Approved', count: approvedApps.length, fill: '#10b981' },
  ];

  // Upcoming critical deadlines (< 21 days)
  const upcomingDeadlines = scholarships
    .map((s) => ({
      ...s,
      deadlineInfo: formatDeadlineText(s.deadline),
    }))
    .filter((s) => s.deadlineInfo.urgency === 'urgent' || s.deadlineInfo.urgency === 'warning')
    .sort((a, b) => a.deadlineInfo.days - b.deadlineInfo.days)
    .slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Personalized Student Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {profile.fullName.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {profile.course} • {profile.institution} ({profile.educationLevel})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/discover"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Matches ({highMatches.length})</span>
          </Link>
          <Link
            to="/tracker"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
          >
            <Kanban className="w-4 h-4 text-slate-500" />
            <span>View Tracker</span>
          </Link>
        </div>
      </div>

      {/* Profile Completion Indicator Banner (if not 100%) */}
      {profileCompletionPct < 100 && (
        <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-white rounded-2xl border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold shrink-0">
              {profileCompletionPct}%
            </div>
            <div>
              <h4 className="font-bold text-indigo-950">Student Profile Readiness: {profileCompletionPct}%</h4>
              <p className="text-slate-600">Complete missing demographics for 100% precise eligibility match accuracy.</p>
            </div>
          </div>
          <Link
            to="/settings"
            className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* 4 Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Matches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>High-Match Opportunities</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{highMatches.length}</div>
          <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Criteria alignment ≥ 75%</span>
          </p>
        </div>

        {/* Card 2: Potential Funding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Potential Matched Aid</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(totalFundingPotential)}</div>
          <p className="text-xs text-indigo-600 font-semibold">
            Across {highMatches.length} qualified programs
          </p>
        </div>

        {/* Card 3: Active Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Application Pipeline</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{applications.length}</div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span className="text-amber-700 font-bold">{inProgressApps.length} in progress</span>
            <span>•</span>
            <span className="text-blue-700 font-bold">{submittedApps.length} submitted</span>
          </div>
        </div>

        {/* Card 4: Document Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Document Readiness Vault</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-700">{docReadinessPct}%</div>
          <p className="text-xs text-slate-500 font-medium">
            {availableDocsCount} of {documents.length} verified documents ready
          </p>
        </div>
      </div>

      {/* Analytics Visualizations & Critical Deadlines Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Application Pipeline Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Application Pipeline Distribution</h3>
              <p className="text-xs text-slate-500">Live tracker status breakdown</p>
            </div>
            <Link to="/tracker" className="text-xs font-bold text-indigo-600 hover:underline">
              Open Board →
            </Link>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {pipelineChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Critical Deadlines Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Approaching Deadlines</h3>
              </div>
              <Link to="/deadlines" className="text-xs font-bold text-indigo-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No urgent deadlines in next 21 days.</p>
              ) : (
                upcomingDeadlines.map((item) => (
                  <Link
                    key={item.id}
                    to={`/scholarship/${item.id}`}
                    className="block p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                        {item.title}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.deadlineInfo.urgency === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {item.deadlineInfo.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.amountFormatted}</span>
                      <span className="text-[10px] text-slate-400">{item.deadline}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <Link
            to="/deadlines"
            className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            Open Deadline Sentinel
          </Link>
        </div>
      </div>

      {/* Recommended Scholarships for Student */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Top Personalized Matches For You
            </h3>
            <p className="text-xs text-slate-500">
              Ranked dynamically by your GPA ({profile.rawGpa}), Level ({profile.educationLevel}), and Focus ({profile.category})
            </p>
          </div>
          <Link
            to="/discover"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Browse Full Discovery Engine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {highMatches.slice(0, 3).map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-400 block truncate">
                    {sch.provider}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {sch.eligibility.score}% Match
                  </span>
                </div>

                <Link
                  to={`/scholarship/${sch.id}`}
                  className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2"
                >
                  {sch.title}
                </Link>

                <div className="mt-3 text-lg font-extrabold text-slate-900">
                  {sch.amountFormatted}
                </div>

                <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {sch.eligibility.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  Due: {sch.deadline}
                </span>
                <Link
                  to={`/scholarship/${sch.id}`}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <span>Evaluate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Application Activity Feed */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Application Pipeline Activity</h3>
          </div>
          <Link to="/tracker" className="text-xs font-bold text-indigo-600 hover:underline">
            Manage All Applications
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {applications.slice(0, 4).map((app) => (
            <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-900">{app.scholarshipTitle}</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  {app.provider} • {app.amountFormatted} • Updated: {formatDatePretty(app.lastUpdated)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    app.status === 'Approved' ? 'success' :
                    app.status === 'Applied' ? 'primary' :
                    app.status === 'Applying' ? 'warning' : 'secondary'
                  }
                  size="sm"
                >
                  {app.status}
                </Badge>
                <Link
                  to={`/scholarship/${app.scholarshipId}`}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
