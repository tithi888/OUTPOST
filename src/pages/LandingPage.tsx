import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Clock, 
  DollarSign, 
  Compass, 
  FileCheck, 
  Kanban, 
  Award, 
  ChevronRight,
  TrendingUp,
  Star,
  Users,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';
import { formatCurrency } from '../utils/formatters';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loadDemoProfile } = useApp();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/discover?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const featuredScholarships = SCHOLARSHIPS_DATA.filter((s) => s.featured).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-b border-slate-200/70">
        {/* Subtle geometric background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-indigo-300/10 via-purple-300/15 to-blue-300/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hackathon Badge Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-xs text-xs font-semibold text-indigo-900">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              <span>THE OUTPOST 2026 • Frontend Arena Individual Hackathon</span>
              <span className="text-slate-300">|</span>
              <span className="text-indigo-600 font-bold">GRANTLY Platform</span>
            </div>
          </div>

          {/* Hero Headlines */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Stop searching scattered portals. Discover scholarships built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">your profile.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              GRANTLY unifies scholarship discovery, diagnostic eligibility scoring, document readiness, and deadline tracking into one intelligent student OS.
            </p>

            {/* Interactive Hero Search Form */}
            <form onSubmit={handleHeroSearch} className="pt-4 max-w-2xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl p-2 border border-slate-200/90 shadow-lg shadow-indigo-500/5 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Try 'Computer Science', 'First-Gen', 'Full Tuition', 'Undergrad'..."
                  className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/20 shrink-0"
                >
                  <span>Find Scholarships</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Filter Tags */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                <button
                  type="button"
                  onClick={() => navigate('/discover?category=STEM')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  STEM & AI
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/discover?category=First-Generation')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  First-Generation
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/discover?category=Women in Tech')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Women in Tech
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/discover?category=Need-Based')}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Need-Based Grants
                </button>
              </div>
            </form>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Launch Student Onboarding</span>
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm transition-all shadow-xs"
              >
                <span>Live Student Dashboard</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Live Interactive Dashboard Teaser / Preview Card */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-indigo-500/10 p-4 sm:p-7 relative overflow-hidden">
            {/* Top Browser Bar Mock */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono text-slate-400">grantly.app/dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Profile Verified: {profile.fullName}</span>
              </div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Stat 1 */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Potential Matched Funding
                </span>
                <div className="text-2xl font-extrabold text-slate-900">$65,000+</div>
                <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>14 Eligible Opportunities</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Eligibility Confidence
                </span>
                <div className="text-2xl font-extrabold text-emerald-600">96% High Match</div>
                <div className="text-xs text-slate-500 font-medium">
                  Income & GPA Criteria Verified
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Upcoming Deadline Alert
                </span>
                <div className="text-2xl font-extrabold text-rose-600">3 Days Left</div>
                <div className="text-xs text-slate-500 font-medium">
                  Apex Global STEM Fellowship
                </div>
              </div>
            </div>

            {/* Quick Action Preview Row */}
            <div className="mt-5 p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-indigo-950">Next Recommended Action</h4>
                  <p className="text-indigo-800/80">Complete Statement of Purpose in Document Vault for 100% submission readiness.</p>
                </div>
              </div>
              <Link
                to="/documents"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shrink-0 transition-colors"
              >
                Open Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Proof Metrics */}
      <section className="py-12 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-slate-900">$14.2M+</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Simulated Aid Discovered
              </p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-indigo-600">1,200+</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Demonstration Records
              </p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">94.8%</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Diagnostic Match Accuracy
              </p>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">100%</div>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                Client-Side Privacy (LocalStorage)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs GRANTLY Solution */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Transforming Financial Discovery
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why the traditional scholarship search is broken
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Millions of dollars in higher education aid go unclaimed every year because fragmented websites overwhelm students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Broken Way */}
            <div className="bg-white rounded-3xl p-7 border border-rose-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                  ✕
                </span>
                <h3 className="text-lg font-bold text-slate-900">The Fragmented Search Experience</h3>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Scattered across 50+ portals:</strong> Government, corporate, and trust websites with disjointed login systems.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Vague eligibility requirements:</strong> Spending 3 hours applying only to discover you were disqualified by an obscure rule.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Missed hard deadlines:</strong> Spreadsheets that fail to alert you when submission windows close.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                  <span><strong>Document chaos:</strong> Scrambling at the last minute for certified income slips, transcripts, and affidavits.</span>
                </li>
              </ul>
            </div>

            {/* The GRANTLY Way */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                <h3 className="text-lg font-bold text-white">The GRANTLY Operating System</h3>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-indigo-100/90">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unified Discovery Engine:</strong> Single searchable index covering corporate grants, trust endowments, and public aid.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Smart Eligibility Diagnostics:</strong> Automated rule-by-rule matching against your verified GPA, income, and course.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Pipeline Kanban Tracker:</strong> Drag-and-drop workflow tracking applications from Interested to Awarded.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Document Readiness Vault:</strong> Track transcripts and affidavits with 100% readiness indicators.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Step Flow */}
      <section className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-2">
              Three Seamless Steps
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How GRANTLY Powers Your Funding Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Build Your Student Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your education level, current GPA, household income bracket, and preferences once. Your data stays private in LocalStorage.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Run Smart Diagnostics</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our eligibility engine runs checks across academic marks, income limits, and geographic criteria to score true match probability.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Track Pipeline to Award</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stash documents, log personal notes, monitor countdown deadlines, and celebrate approved awards in your personal tracker.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Preview */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                Curated Opportunities
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Flagship Fellowships
              </h2>
            </div>
            <Link
              to="/discover"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredScholarships.map((sch) => (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-600">{sch.provider}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                      {sch.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {sch.title}
                  </h3>
                  <div className="mt-3 text-xl font-extrabold text-slate-900">
                    {sch.amountFormatted}
                  </div>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {sch.overview}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">
                    Due: {sch.deadline}
                  </span>
                  <Link
                    to={`/scholarship/${sch.id}`}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Check Match</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to secure your educational funding?
          </h2>
          <p className="text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join thousands of students discovering relevant scholarships without the confusion, chaos, or missed deadlines.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-extrabold text-sm transition-all shadow-lg"
            >
              Start Free Student Onboarding
            </Link>
            <Link
              to="/discover"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-800 hover:bg-indigo-700 text-white font-bold text-sm border border-indigo-700 transition-all"
            >
              Browse Discovery Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
