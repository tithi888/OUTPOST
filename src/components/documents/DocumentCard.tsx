import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  AlertCircle, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { DocumentItem, DocumentStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface DocumentCardProps {
  document: DocumentItem;
  onUploadClick: (doc: DocumentItem) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onUploadClick,
}) => {
  const { updateDocumentStatus } = useApp();

  const isReady = document.status === 'Available' || document.status === 'Uploaded (Demo)';

  return (
    <div className={`p-5 bg-white rounded-2xl border transition-all ${
      isReady ? 'border-slate-200/90 shadow-2xs' : 'border-amber-200/90 bg-amber-50/20'
    } flex flex-col justify-between space-y-4 hover:shadow-md`}>
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isReady ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}>
              {isReady ? <FileCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {document.type}
              </span>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {document.name}
              </h4>
            </div>
          </div>

          {/* Status Badge */}
          {isReady ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Action Required
            </span>
          )}
        </div>

        {/* File Details If Available */}
        {document.fileName ? (
          <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2 truncate pr-2">
              <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">{document.fileName}</span>
            </div>
            {document.fileSize && (
              <span className="text-[11px] text-slate-400 shrink-0 font-mono">{document.fileSize}</span>
            )}
          </div>
        ) : (
          <p className="mt-3 text-xs text-amber-800 bg-amber-50/60 p-2 rounded-lg border border-amber-100 leading-relaxed">
            Missing verified digital copy. Many scholarships will reject submissions without this document.
          </p>
        )}

        {/* Notes */}
        {document.notes && (
          <p className="mt-2 text-xs text-slate-500 italic">
            Note: {document.notes}
          </p>
        )}
      </div>

      {/* Footer Actions & Requirement Count */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-500">
          Required by <span className="font-bold text-slate-800">{document.requiredByCount || 3}</span> active scholarships
        </span>

        <div className="flex items-center gap-1.5">
          {isReady ? (
            <button
              onClick={() => updateDocumentStatus(document.id, 'Pending')}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Mark Pending
            </button>
          ) : (
            <button
              onClick={() => updateDocumentStatus(document.id, 'Available', 'Verified_Offline_Copy.pdf', '1.2 MB')}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
            >
              Mark Available
            </button>
          )}

          <button
            onClick={() => onUploadClick(document)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
