import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Info, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Scholarship } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateEligibility } from '../../utils/eligibilityCalculator';

interface EligibilityDiagnosticProps {
  scholarship: Scholarship;
  compact?: boolean;
}

export const EligibilityDiagnostic: React.FC<EligibilityDiagnosticProps> = ({
  scholarship,
  compact = false,
}) => {
  const { profile } = useApp();
  const result = calculateEligibility(scholarship, profile);

  const statusConfig = {
    Eligible: {
      title: 'High Eligibility Probability',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      color: 'emerald',
    },
    'Potentially Eligible': {
      title: 'Potentially Eligible (Review Recommended)',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
      color: 'amber',
    },
    'Not Eligible': {
      title: 'Current Criteria Mismatch',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
      color: 'rose',
    },
  };

  const current = statusConfig[result.overallStatus];

  if (compact) {
    return (
      <div className={`p-4 rounded-xl border ${current.badgeClass} space-y-2`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {current.icon}
            <span className="text-xs font-bold uppercase tracking-wider">{result.overallStatus}</span>
          </div>
          <span className="text-xs font-extrabold">{result.score}% Match</span>
        </div>
        <p className="text-xs leading-relaxed">{result.summary}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className={`p-5 border-b ${current.badgeClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-xs">
            {current.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider">
                Smart Eligibility Evaluation
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white font-bold shadow-2xs">
                {result.overallStatus}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">{current.title}</h4>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-slate-200/80 sm:pl-5">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {result.score}%
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Match Score
          </span>
        </div>
      </div>

      {/* Summary Explanation */}
      <div className="p-5 bg-slate-50/70 border-b border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-slate-900">Analysis Summary: </span>
          {result.summary}
        </p>
      </div>

      {/* Rule-by-rule Detailed Comparison Grid */}
      <div className="p-5 space-y-4">
        <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Criteria Verification Breakdown
        </h5>

        <div className="space-y-3">
          {result.breakdown.map((item, index) => {
            const isMet = item.isMet;
            return (
              <div
                key={index}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isMet === true && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Criteria Met
                      </span>
                    )}
                    {isMet === 'partial' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Conditional / Review
                      </span>
                    )}
                    {isMet === false && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Requirement Mismatch
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-900">{item.rule}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {item.explanation}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block">Your Profile:</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {item.studentValue}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 font-medium block">Scholarship Criteria:</span>
                    <span className="font-semibold text-slate-800 truncate block">
                      {item.requiredValue}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Honest Compliance Notice Banner */}
      <div className="p-4 bg-amber-50/60 border-t border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold">Transparency & Verification Guarantee</p>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            GRANTLY calculates diagnostic match scores based on declared student profiles and published eligibility guidelines. This evaluation is an orientation guide and never constitutes a guaranteed approval or legal grant commitment.
          </p>
        </div>
      </div>

      {/* Footer Profile Update Prompt */}
      <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Have your academic marks or family finances changed?
        </span>
        <Link
          to="/settings"
          className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700"
        >
          <span>Update Student Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
