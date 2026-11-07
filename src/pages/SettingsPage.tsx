import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  RotateCcw, 
  Download, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Save, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentProfile, EducationLevel } from '../types';
import { normalizeGpa } from '../utils/eligibilityCalculator';

export const SettingsPage: React.FC = () => {
  const { profile, setProfile, loadDemoProfile, resetAllData, showToast } = useApp();

  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeGpa(parseFloat(formData.rawGpa) || 3.5, formData.gpaScale);
    const updated: StudentProfile = {
      ...formData,
      gpa: normalized,
      isOnboarded: true,
    };
    setProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      profile,
      exportedAt: new Date().toISOString(),
      localStorage: {
        profile: localStorage.getItem('grantly_profile_v1'),
        applications: localStorage.getItem('grantly_applications_v1'),
        saved: localStorage.getItem('grantly_saved_v1'),
        documents: localStorage.getItem('grantly_documents_v1'),
      },
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `grantly_student_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Data exported successfully!');
  };

  const togglePreference = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      scholarshipPreferences: prev.scholarshipPreferences.includes(pref)
        ? prev.scholarshipPreferences.filter((p) => p !== pref)
        : [...prev.scholarshipPreferences, pref],
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <Settings className="w-4 h-4" />
          <span>Profile Configuration & Persistence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile & Platform Data
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update your academic attributes or load pre-configured test personas to evaluate matching algorithms.
        </p>
      </div>

      {/* Demo Switcher Quick Bar */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-3xl border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-950">
              Evaluator Quick-Load Personas (Hackathon Sandbox)
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
            1-Click Switch
          </span>
        </div>

        <p className="text-xs text-indigo-900/80 leading-relaxed">
          Switch between diverse student archetypes to test how the diagnostic eligibility engine calculates criteria for different GPA scales, incomes, and categories.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <button
            onClick={() => {
              loadDemoProfile('stem-undergrad');
              setFormData({ ...profile });
            }}
            className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all group"
          >
            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 block">
              Aarav Patel
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Undergrad CS • First-Gen • GPA 3.72
            </span>
          </button>

          <button
            onClick={() => {
              loadDemoProfile('women-in-tech');
              setFormData({ ...profile });
            }}
            className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all group"
          >
            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 block">
              Elena Rodriguez
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Undergrad AI • Women in Tech • GPA 3.88
            </span>
          </button>

          <button
            onClick={() => {
              loadDemoProfile('postgrad-humanities');
              setFormData({ ...profile });
            }}
            className="p-3 bg-white hover:bg-indigo-100/50 rounded-xl border border-indigo-200 text-left transition-all group"
          >
            <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 block">
              Marcus Vance
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Postgrad Policy • Need-Based • GPA 3.45
            </span>
          </button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Academic & Financial Profile</h3>
            <p className="text-xs text-slate-500">Changes immediately recalculate your match scores across all discovery cards.</p>
          </div>

          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved!
            </span>
          )}
        </div>

        {/* Section 1: Personal & Education */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            1. Student Demographics & Institution
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Education Level</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="High School">High School Senior</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctoral">Doctoral</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Academic Year</label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">State / Domicile</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Institution / University</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Course / Major</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Merit & Financials */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            2. Academic Merit & Financial Criteria
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">GPA Scale</label>
              <select
                value={formData.gpaScale}
                onChange={(e) => setFormData({ ...formData, gpaScale: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="4.0">4.0 Scale</option>
                <option value="10.0">10.0 Scale</option>
                <option value="100%">100% Scale</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Reported GPA / Marks</label>
              <input
                type="text"
                value={formData.rawGpa}
                onChange={(e) => setFormData({ ...formData, rawGpa: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Annual Family Income ($)</label>
              <input
                type="number"
                value={formData.annualFamilyIncome}
                onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Demographic Cohort / Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="General">General</option>
              <option value="First-Generation">First-Generation College Student</option>
              <option value="Women in Tech">Women in Tech / Engineering</option>
              <option value="Minority / Underrepresented">Minority / Underrepresented</option>
              <option value="Need-Based">Need-Based / EWS</option>
            </select>
          </div>
        </div>

        {/* Section 3: Scholarship Preferences */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            3. Target Scholarship Preferences
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'STEM',
              'Women in Tech',
              'First-Generation',
              'Need-Based',
              'Merit-Based',
              'Arts & Humanities',
              'Full Tuition',
              'Annual Stipend',
            ].map((pref) => {
              const isSelected = formData.scholarshipPreferences.includes(pref);
              return (
                <button
                  key={pref}
                  type="button"
                  onClick={() => togglePreference(pref)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pref}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>

      {/* Platform & Data Management Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Data Management & Hackathon Controls</h3>
        <p className="text-xs text-slate-500">
          All changes are persisted to your browser’s LocalStorage. You can export a snapshot backup or reset to default demo values at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export Local JSON Backup</span>
          </button>

          <button
            onClick={resetAllData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset All Platform Data to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
