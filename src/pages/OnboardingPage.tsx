import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EducationLevel, StudentProfile } from '../types';
import { normalizeGpa } from '../utils/eligibilityCalculator';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, loadDemoProfile } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<StudentProfile>({
    ...profile,
    fullName: profile.fullName || '',
    email: profile.email || '',
    educationLevel: profile.educationLevel || 'Undergraduate',
    institution: profile.institution || '',
    course: profile.course || '',
    academicYear: profile.academicYear || '2nd Year',
    state: profile.state || 'California',
    annualFamilyIncome: profile.annualFamilyIncome || 50000,
    category: profile.category || 'General',
    gpa: profile.gpa || 3.5,
    rawGpa: profile.rawGpa || '3.5',
    gpaScale: profile.gpaScale || '4.0',
    scholarshipPreferences: profile.scholarshipPreferences || ['STEM', 'Need-Based'],
    isOnboarded: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Please enter your full name';
      if (!formData.institution.trim()) errs.institution = 'Please enter your school or university';
      if (!formData.course.trim()) errs.course = 'Please enter your major / field of study';
    }
    if (currentStep === 2) {
      const parsedGpa = parseFloat(formData.rawGpa);
      if (isNaN(parsedGpa) || parsedGpa <= 0) {
        errs.rawGpa = 'Please enter a valid GPA or percentage';
      }
    }
    if (currentStep === 3) {
      if (formData.annualFamilyIncome < 0) {
        errs.annualFamilyIncome = 'Income cannot be negative';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const normalized = normalizeGpa(parseFloat(formData.rawGpa) || 3.5, formData.gpaScale);
    const finalProfile: StudentProfile = {
      ...formData,
      gpa: normalized,
      isOnboarded: true,
    };
    setProfile(finalProfile);
    navigate('/dashboard');
  };

  const handleAutofillDemo = () => {
    loadDemoProfile('stem-undergrad');
    setFormData({
      fullName: 'Aarav Patel',
      email: 'aarav.patel@student.edu',
      educationLevel: 'Undergraduate',
      institution: 'National Institute of Technology',
      course: 'Computer Science & Engineering',
      academicYear: '3rd Year',
      state: 'California',
      annualFamilyIncome: 48000,
      category: 'First-Generation',
      gpa: 3.72,
      rawGpa: '3.72',
      gpaScale: '4.0',
      scholarshipPreferences: ['STEM', 'First-Generation', 'Need-Based'],
      isOnboarded: true,
    });
    setErrors({});
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Top Demo Shortcut Pill */}
      <div className="mb-6 flex items-center justify-between gap-3 max-w-xl w-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Student Onboarding Wizard</span>
        </div>
        <button
          onClick={handleAutofillDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>⚡ Auto-fill STEM Profile</span>
        </button>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-600">
            <span>Step {step} of {totalSteps}</span>
            <span className="text-indigo-600">
              {step === 1 && 'Personal & Education'}
              {step === 2 && 'Academic Merit (GPA)'}
              {step === 3 && 'Financial & Demographics'}
              {step === 4 && 'Scholarship Preferences'}
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Personal & Education */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Your Academic Foundations</h3>
                <p className="text-xs text-slate-500">
                  We use your course and level to find programs with matching eligibility requirements.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Aarav Patel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                {errors.fullName && <p className="text-xs text-rose-600 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Education Level *
                  </label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as EducationLevel })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="High School">High School Senior</option>
                    <option value="Undergraduate">Undergraduate (College)</option>
                    <option value="Postgraduate">Postgraduate (Masters)</option>
                    <option value="Doctoral">Doctoral (PhD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="1st Year">1st Year / Freshman</option>
                    <option value="2nd Year">2nd Year / Sophomore</option>
                    <option value="3rd Year">3rd Year / Junior</option>
                    <option value="Final Year">Final Year / Senior</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Institution / School / University *
                </label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                {errors.institution && <p className="text-xs text-rose-600 mt-1">{errors.institution}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Major / Degree / Stream *
                </label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="e.g. Computer Science, Mechanical Eng, Fine Arts"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                {errors.course && <p className="text-xs text-rose-600 mt-1">{errors.course}</p>}
              </div>
            </div>
          )}

          {/* STEP 2: Academic Merit (GPA) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Academic Standing & Location</h3>
                <p className="text-xs text-slate-500">
                  Accurate grades ensure you only spend time on scholarships matching your GPA profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Grading Scale *
                  </label>
                  <select
                    value={formData.gpaScale}
                    onChange={(e) => setFormData({ ...formData, gpaScale: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  >
                    <option value="4.0">4.0 Scale (US / Standard)</option>
                    <option value="10.0">10.0 Scale (CGPA)</option>
                    <option value="100%">100% Percentage Scale</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Cumulative GPA / Score *
                  </label>
                  <input
                    type="text"
                    value={formData.rawGpa}
                    onChange={(e) => setFormData({ ...formData, rawGpa: e.target.value })}
                    placeholder={formData.gpaScale === '4.0' ? 'e.g. 3.75' : formData.gpaScale === '10.0' ? 'e.g. 8.8' : 'e.g. 85%'}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  {errors.rawGpa && <p className="text-xs text-rose-600 mt-1">{errors.rawGpa}</p>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  State / Territory / Domicile *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. California, New York, Texas, Washington"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
                <p className="text-[11px] text-slate-400 mt-1">Used for state-specific governmental educational grants.</p>
              </div>
            </div>
          )}

          {/* STEP 3: Financial & Demographics */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Financial Background & Cohort</h3>
                <p className="text-xs text-slate-500">
                  Many philanthropic and government subsidies target specific household income ceilings.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Annual Household Family Income (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={formData.annualFamilyIncome}
                    onChange={(e) => setFormData({ ...formData, annualFamilyIncome: Number(e.target.value) })}
                    placeholder="e.g. 45000"
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
                {errors.annualFamilyIncome && (
                  <p className="text-xs text-rose-600 mt-1">{errors.annualFamilyIncome}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Typical need-based grants cap household income at $45,000 – $75,000.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Demographic Cohort / Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  <option value="General">General Category</option>
                  <option value="First-Generation">First-Generation College Student</option>
                  <option value="Women in Tech">Women in STEM / Computing</option>
                  <option value="Minority / Underrepresented">Minority / Underrepresented Background</option>
                  <option value="Need-Based">Economically Weaker Section (EWS)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Scholarship Preferences */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in-50">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Scholarship Focus & Priorities</h3>
                <p className="text-xs text-slate-500">
                  Select the types of aid you would like highlighted in your smart dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
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
                  const isChecked = formData.scholarshipPreferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-indigo-50/80 border-indigo-400 text-indigo-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{pref}</span>
                      {isChecked && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 mt-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  You're all set! On submitting, GRANTLY will immediately calculate your personalized eligibility match scores across our database.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Controls */}
        <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>{step === totalSteps ? 'Save & Go to Dashboard' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
