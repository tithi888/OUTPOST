import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Kanban, 
  FileText, 
  Calendar, 
  LayoutDashboard, 
  Menu, 
  X, 
  ChevronDown, 
  RotateCcw,
  UserCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInitials } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { profile, savedScholarshipIds, applications, loadDemoProfile, resetAllData } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tracker', path: '/tracker', icon: Kanban, badge: applications.length },
    { label: 'Documents', path: '/documents', icon: FileText },
    { label: 'Deadlines', path: '/deadlines', icon: Calendar },
  ];

  const isActive = (path: string) => {
    if (path === '/discover' && location.pathname.startsWith('/scholarship')) return true;
    return location.pathname === path;
  };

  const handleSelectDemo = (personaKey: string) => {
    loadDemoProfile(personaKey);
    setDemoMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Context Notification Strip */}
      <div className="bg-indigo-900 text-indigo-100 text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-800 text-indigo-200 text-[10px] font-semibold uppercase tracking-wider">
          Hackathon Edition
        </span>
        <span>GRANTLY Discovery Engine & Tracker — Built for THE OUTPOST 2026</span>
        <button 
          onClick={() => navigate('/settings')}
          className="underline hover:text-white transition-colors ml-1 font-semibold"
        >
          Manage Data
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  GRANTLY
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block"></span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-wide uppercase -mt-1">
                  Scholarship Operating System
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-indigo-600 bg-indigo-50/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Search CTA */}
            <Link
              to="/discover"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200/70 transition-colors"
              title="Search scholarships"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-500 font-mono shadow-2xs">
                ⌘K
              </kbd>
            </Link>

            {/* Bookmarks Quick Pill */}
            <Link
              to="/discover?filter=saved"
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="View saved scholarships"
            >
              <Bookmark className="w-4 h-4" />
              {savedScholarshipIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </Link>

            {/* Demo Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[100px] truncate">{profile.fullName.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Demo Student Profile
                    </p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      Active: {profile.fullName} ({profile.educationLevel})
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleSelectDemo('stem-undergrad')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-900 transition-colors"
                    >
                      <span className="font-semibold block">Aarav Patel</span>
                      <span className="text-[11px] text-slate-500">Undergrad CS • First-Gen • GPA 3.72</span>
                    </button>

                    <button
                      onClick={() => handleSelectDemo('women-in-tech')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-900 transition-colors"
                    >
                      <span className="font-semibold block">Elena Rodriguez</span>
                      <span className="text-[11px] text-slate-500">Undergrad AI • Women in Tech • GPA 3.88</span>
                    </button>

                    <button
                      onClick={() => handleSelectDemo('postgrad-humanities')}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-900 transition-colors"
                    >
                      <span className="font-semibold block">Marcus Vance</span>
                      <span className="text-[11px] text-slate-500">Postgrad Public Policy • Need-Based • GPA 3.45</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 px-2 pt-1.5 mt-1 flex flex-col gap-1">
                    <Link
                      to="/settings"
                      onClick={() => setDemoMenuOpen(false)}
                      className="w-full text-center px-2 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-md font-medium"
                    >
                      Edit Custom Profile Details
                    </Link>
                    <button
                      onClick={() => {
                        resetAllData();
                        setDemoMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md font-medium transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Demo Records
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <Link
              to="/settings"
              className="flex items-center gap-2 pl-2 border-l border-slate-200"
              title="Profile & Settings"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all">
                {getInitials(profile.fullName)}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
            >
              Onboarding Wizard
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2 px-3 text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Manage Profile & Data
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
