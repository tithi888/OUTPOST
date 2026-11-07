import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { DocumentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { UploadCloud, CheckCircle2, FileCheck, ShieldAlert, Sparkles } from 'lucide-react';

interface DemoUploadModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DemoUploadModal: React.FC<DemoUploadModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const { updateDocumentStatus } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  if (!document) return null;

  const handleSimulateUpload = (fileNameOverride?: string) => {
    const finalName = fileNameOverride || selectedFileName || `${document.name.replace(/[^a-zA-Z0-9]/g, '_')}_Official.pdf`;
    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate realistic upload latency
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      updateDocumentStatus(document.id, 'Uploaded (Demo)', finalName, '1.6 MB');

      setTimeout(() => {
        setUploadSuccess(false);
        setSelectedFileName('');
        onClose();
      }, 900);
    }, 1100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      handleSimulateUpload(file.name);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Upload Document: ${document.name}`}
      description="Demonstration local document staging simulation"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Compliance disclaimer */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold">Privacy Simulation: </span>
            This frontend demo processes file metadata in your browser’s local state. No sensitive financial or identity files are transmitted to external servers.
          </p>
        </div>

        {/* Drag & Drop Simulation Dropzone */}
        <div className="relative border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-slate-50 rounded-2xl p-6 text-center transition-all cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                {selectedFileName || 'Click to select or drag PDF / Image document'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, JPG, PNG up to 10MB (Simulated)
              </p>
            </div>
          </div>
        </div>

        {/* Upload Status Simulation Feedback */}
        {isUploading && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                Validating & Staging Document...
              </span>
              <span>78%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Document successfully verified and marked as ready!</span>
          </div>
        )}

        {/* Quick Mock Fill Button */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => handleSimulateUpload(`Sample_${document.type.replace(/\s+/g, '_')}_Official.pdf`)}
            disabled={isUploading}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            ⚡ Auto-generate sample verified PDF
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
