import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Award, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">GRANTLY</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unified digital platform engineered to simplify scholarship discovery, intelligent eligibility diagnosis, document readiness, and end-to-end application tracking.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Frontend Arena • THE OUTPOST 2026</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Scholarship Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  Scholarship Discovery
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-white transition-colors">
                  Application Pipeline Tracker
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-white transition-colors">
                  Document Readiness Vault
                </Link>
              </li>
              <li>
                <Link to="/deadlines" className="hover:text-white transition-colors">
                  Deadline Sentinel
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Journey */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Student Journey
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/onboarding" className="hover:text-white transition-colors">
                  Onboarding Assessment
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Edit Academic Profile
                </Link>
              </li>
              <li>
                <Link to="/discover?category=STEM" className="hover:text-white transition-colors">
                  STEM Excellence Grants
                </Link>
              </li>
              <li>
                <Link to="/discover?category=First-Generation" className="hover:text-white transition-colors">
                  First-Gen Scholar Awards
                </Link>
              </li>
              <li>
                <Link to="/discover?category=Need-Based" className="hover:text-white transition-colors">
                  Need-Based Subsidies
                </Link>
              </li>
            </ul>
          </div>

          {/* Hackathon Criteria & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
              System Architecture
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-[11px] leading-relaxed text-slate-300">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-300 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>6-Hour Production Prototype</span>
              </div>
              Built with React 19, TypeScript, Tailwind CSS, LocalStorage state persistence, and real-time eligibility evaluation logic.
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left">
            <span className="font-semibold text-slate-300">Notice:</span> GRANTLY is an individual hackathon project submission. Scholarship listings, criteria, and deadlines are realistic simulation models for functional evaluation. Never claims guaranteed financial aid.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/settings" className="hover:text-white transition-colors">
              Data Management
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
