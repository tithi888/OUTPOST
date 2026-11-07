import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Building2, 
  Calendar, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Plus, 
  Share2, 
  ChevronRight,
  AlertCircle,
  FileCheck,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDeadlineText, formatCurrency } from '../utils/formatters';
import { EligibilityDiagnostic } from '../components/eligibility/EligibilityDiagnostic';
import { Badge } from '../components/common/Badge';
import { ApplicationStatus } from '../types';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    scholarships, 
    isScholarshipSaved, 
    toggleSaveScholarship, 
    getApplicationByScholarshipId, 
    addApplication, 
    updateApplicationStatus,
    documents,
    showToast
  } = useApp();

  const scholarship = scholarships.find((s) => s.id === id);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Interested');
  const [showApplyDemoModal, setShowApplyDemoModal] = useState(false);

  if (!scholarship) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Scholarship Not Found</h2>
        <p className="text-xs text-slate-500">The requested scholarship could not be located in our index.</p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery Engine</span>
        </Link>
      </div>
    );
  }

  const isSaved = isScholarshipSaved(scholarship.id);
  const existingApp = getApplicationByScholarshipId(scholarship.id);
  const deadlineInfo = formatDeadlineText(scholarship.deadline);

  // Check required document availability against user's documents
  const requiredDocsWithStatus = scholarship.requiredDocuments.map((docName) => {
    const userDoc = documents.find(
      (d) => d.type.toLowerCase() === docName.toLowerCase() || d.name.toLowerCase().includes(docName.toLowerCase())
    );
    const isReady = userDoc?.status === 'Available' || userDoc?.status === 'Uploaded (Demo)';
    return {
      name: docName,
      isReady,
      userDoc,
    };
  });

  const allDocsReady = requiredDocsWithStatus.every((d) => d.isReady);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link copied to clipboard!');
  };

  const handleApplySimulator = () => {
    addApplication(scholarship.id, 'Applying', 'Initiated application submission simulation');
    setShowApplyDemoModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link to="/discover" className="hover:text-indigo-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Discovery</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400">{scholarship.category}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-[240px] sm:max-w-md">
          {scholarship.title}
        </span>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{scholarship.provider}</span>
              <span className="text-slate-300">•</span>
              <Badge variant="purple" size="sm">{scholarship.category}</Badge>
              <Badge variant="secondary" size="sm">{scholarship.providerType}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {scholarship.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Share scholarship link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveScholarship(scholarship.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                isSaved
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Amount & Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Award Value</span>
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
              {scholarship.amountFormatted}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Application Deadline</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
              {scholarship.deadline}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              deadlineInfo.urgency === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
            }`}>
              {deadlineInfo.label}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Min GPA Requirement</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
              {scholarship.minGpa} / 4.0
            </span>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Family Income Cap</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5 truncate">
              {scholarship.maxIncome >= 999999 ? 'No Income Cap' : `≤ ${formatCurrency(scholarship.maxIncome)}`}
            </span>
          </div>
        </div>

        {/* Action Controls & Tracker Integration */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {existingApp ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Tracked in Pipeline:</span>
                <select
                  value={existingApp.status}
                  onChange={(e) => updateApplicationStatus(existingApp.id, e.target.value as ApplicationStatus)}
                  className="bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs font-bold text-indigo-700 cursor-pointer"
                >
                  <option value="Interested">Interested</option>
                  <option value="Saved">Saved</option>
                  <option value="Applying">Applying</option>
                  <option value="Applied">Applied</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => addApplication(scholarship.id, selectedStatus)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Tracker ({selectedStatus})</span>
                </button>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Interested">Stage: Interested</option>
                  <option value="Saved">Stage: Saved</option>
                  <option value="Applying">Stage: Applying</option>
                  <option value="Applied">Stage: Applied</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleApplySimulator}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <span>Launch Official Application Simulator</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Smart Eligibility Diagnostic Section */}
      <EligibilityDiagnostic scholarship={scholarship} />

      {/* Main Details Grid: Overview, Documents, and Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Overview & Detailed Criteria */}
        <div className="md:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-3">
            <h3 className="text-base font-bold text-slate-900">Program Overview & Purpose</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {scholarship.fullDescription}
            </p>
          </div>

          {/* Criteria in Detail */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Eligibility Criteria Breakdown</h3>
            <div className="space-y-3">
              {scholarship.eligibilityRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{rule.rule}</h5>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{rule.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Steps */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Application & Evaluation Process</h3>
            <div className="space-y-3">
              {scholarship.applicationSteps.map((step) => (
                <div key={step.step} className="flex items-start gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{step.title}</h5>
                    <p className="text-slate-500 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Required Documents Readiness Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Required Documents</h3>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                allDocsReady ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800'
              }`}>
                {requiredDocsWithStatus.filter((d) => d.isReady).length}/{requiredDocsWithStatus.length} Ready
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              We check your Document Vault to ensure you have verified copies ready for submission.
            </p>

            <div className="space-y-2.5">
              {requiredDocsWithStatus.map((doc, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    doc.isReady ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {doc.isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-800">{doc.name}</span>
                  </div>

                  <span className={`text-[10px] font-bold ${doc.isReady ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {doc.isReady ? 'Ready' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/documents"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manage Document Vault</span>
            </Link>
          </div>

          {/* Compliance & Source Notice */}
          <div className="p-5 bg-slate-100/70 border border-slate-200 rounded-3xl text-xs space-y-2 text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Demonstration Record Verification</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {scholarship.source}. For this hackathon, external links simulate official scholarship portals and keep records within your local browser storage.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Apply Simulator Modal */}
      {showApplyDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Application Initialized!</h3>
              <p className="text-xs text-slate-500">
                "{scholarship.title}" has been moved to <strong className="text-indigo-600">Applying</strong> status in your Application Tracker.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Application Link:</span>
                <span className="font-mono text-indigo-600 truncate max-w-[180px]">{scholarship.applicationUrl}</span>
              </div>
              <div className="flex justify-between">
                <span>Target Deadline:</span>
                <span className="font-bold text-slate-800">{scholarship.deadline}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to="/tracker"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Go to Application Tracker
              </Link>
              <button
                onClick={() => setShowApplyDemoModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
