import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DemoUploadModal } from '../components/documents/DemoUploadModal';
import { Modal } from '../components/common/Modal';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument } = useApp();

  const [activeUploadDoc, setActiveUploadDoc] = useState<DocumentItem | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState('Certificate');
  const [filterTab, setFilterTab] = useState<'all' | 'ready' | 'pending'>('all');

  // Document Readiness Metrics
  const availableDocs = documents.filter((d) => d.status === 'Available' || d.status === 'Uploaded (Demo)');
  const pendingDocs = documents.filter((d) => d.status === 'Pending');
  const readinessPct = Math.round((availableDocs.length / (documents.length || 1)) * 100);

  const filteredDocs = documents.filter((d) => {
    if (filterTab === 'ready') return d.status === 'Available' || d.status === 'Uploaded (Demo)';
    if (filterTab === 'pending') return d.status === 'Pending';
    return true;
  });

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newDoc: DocumentItem = {
      id: 'doc-custom-' + Date.now(),
      name: customName.trim(),
      type: customType,
      status: 'Pending',
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: 'Custom requirement added by student',
      requiredByCount: 1,
    };

    addDocument(newDoc);
    setCustomName('');
    setShowAddCustomModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Document Readiness Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Management Checklist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pre-verify certified transcripts, affidavits, and bank documents to ensure instant 1-click submission.
          </p>
        </div>

        <button
          onClick={() => setShowAddCustomModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Document</span>
        </button>
      </div>

      {/* Progress & Readiness Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xl flex items-center justify-center shrink-0">
              {readinessPct}%
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Overall Document Readiness Score
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {availableDocs.length} of {documents.length} verified documents ready. You are qualified to apply for 95% of active scholarships.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{availableDocs.length} Ready</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingDocs.length} Action Needed</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${readinessPct}%` }}
          />
        </div>

        {/* Compliance Note */}
        <div className="pt-2 flex items-start gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Local Staging Notice:</strong> Document proofs are simulated within your browser session for hackathon evaluation. No sensitive government records are transmitted to remote servers.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filterTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Documents ({documents.length})
        </button>
        <button
          onClick={() => setFilterTab('ready')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filterTab === 'ready'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Verified & Ready ({availableDocs.length})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filterTab === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Upload ({pendingDocs.length})
        </button>
      </div>

      {/* Document Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onUploadClick={(d) => setActiveUploadDoc(d)}
          />
        ))}
      </div>

      {/* Demo Upload Simulator Modal */}
      <DemoUploadModal
        document={activeUploadDoc}
        isOpen={Boolean(activeUploadDoc)}
        onClose={() => setActiveUploadDoc(null)}
      />

      {/* Add Custom Document Modal */}
      <Modal
        isOpen={showAddCustomModal}
        onClose={() => setShowAddCustomModal(false)}
        title="Add Custom Document Requirement"
        description="Add a specific institutional affidavit, essay, or certificate to your checklist"
        maxWidth="md"
      >
        <form onSubmit={handleAddCustom} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. University Sports Certification, Proof of Internship"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Document Category / Type
            </label>
            <select
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="Academic Marksheet">Academic Marksheet</option>
              <option value="Certificate">Certificate / Proof</option>
              <option value="Essay / SOP">Statement of Purpose / Essay</option>
              <option value="Recommendation">Letter of Recommendation</option>
              <option value="Financial">Financial / Tax Record</option>
              <option value="Identity">Identity Document</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCustomModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              Save Requirement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
