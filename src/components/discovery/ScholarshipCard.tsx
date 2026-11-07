import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Calendar, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDeadlineText, formatCurrency } from '../../utils/formatters';
import { calculateEligibility } from '../../utils/eligibilityCalculator';
import { Badge } from '../common/Badge';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { profile, isScholarshipSaved, toggleSaveScholarship, getApplicationByScholarshipId, addApplication } = useApp();

  const isSaved = isScholarshipSaved(scholarship.id);
  const existingApp = getApplicationByScholarshipId(scholarship.id);
  const deadlineInfo = formatDeadlineText(scholarship.deadline);
  const eligibility = calculateEligibility(scholarship, profile);

  const getMatchBadge = () => {
    if (eligibility.score >= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          {eligibility.score}% Match
        </span>
      );
    }
    if (eligibility.score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          {eligibility.score}% Match
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        {eligibility.score}% Match
      </span>
    );
  };

  const getDeadlineBadge = () => {
    if (deadlineInfo.urgency === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3" />
          Passed
        </span>
      );
    }
    if (deadlineInfo.urgency === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-rose-600" />
          {deadlineInfo.label}
        </span>
      );
    }
    if (deadlineInfo.urgency === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
          <Clock className="w-3 h-3 text-amber-600" />
          {deadlineInfo.label}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
        <Clock className="w-3 h-3 text-slate-400" />
        {deadlineInfo.label}
      </span>
    );
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between relative">
      {/* Top Header: Provider & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <span className="truncate max-w-[200px] sm:max-w-[240px]">{scholarship.provider}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-400 font-medium">{scholarship.providerType}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {getMatchBadge()}
            
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={isSaved ? 'Remove from bookmarks' : 'Save bookmark'}
              aria-label={isSaved ? 'Remove bookmark' : 'Save scholarship'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link to={`/scholarship/${scholarship.id}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
            {scholarship.title}
          </h3>
        </Link>

        {/* Award Amount & Deadline */}
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {scholarship.amountFormatted}
          </span>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {scholarship.awardType}
          </span>
          {getDeadlineBadge()}
        </div>

        {/* Overview */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {scholarship.overview}
        </p>

        {/* Requirements Snippets */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Target Level</span>
            <span className="font-semibold text-slate-800 truncate block">
              {scholarship.educationLevels[0]}
              {scholarship.educationLevels.length > 1 && ` +${scholarship.educationLevels.length - 1}`}
            </span>
          </div>

          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 font-medium block">Min GPA Requirement</span>
            <span className="font-semibold text-slate-800 block">
              {scholarship.minGpa} / 4.0
            </span>
          </div>

          <div className="bg-slate-50/70 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 font-medium block">Income Ceiling</span>
            <span className="font-semibold text-slate-800 truncate block">
              {scholarship.maxIncome >= 999999 ? 'No Ceiling' : `≤ ${formatCurrency(scholarship.maxIncome)}`}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="purple" size="sm">
            {scholarship.category}
          </Badge>
          {scholarship.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" size="sm">
              {tag}
            </Badge>
          ))}
          {scholarship.renewable && (
            <Badge variant="success" size="sm">
              Renewable
            </Badge>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {existingApp ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50/80 px-2.5 py-1.5 rounded-lg border border-indigo-200/80">
            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tracker: {existingApp.status}</span>
          </div>
        ) : (
          <button
            onClick={() => addApplication(scholarship.id, 'Interested')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track</span>
          </button>
        )}

        <Link
          to={`/scholarship/${scholarship.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition-all shadow-xs shadow-indigo-600/20 group-hover:gap-2"
        >
          <span>View Details & Diagnostic</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
