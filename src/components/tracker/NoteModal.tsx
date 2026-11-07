import React, { useState, useEffect } from 'react';
import { ApplicationItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Clock, History, Save, Calendar, CheckCircle2 } from 'lucide-react';
import { formatDatePretty } from '../../utils/formatters';

interface NoteModalProps {
  application: ApplicationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const { updateApplicationNotes } = useApp();
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '');
    }
  }, [application]);

  if (!application) return null;

  const handleSave = () => {
    updateApplicationNotes(application.id, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={application.scholarshipTitle}
      description={`Managed by ${application.provider} • Current Status: ${application.status}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Quick Details Bar */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Award Amount:</span>
            <span className="font-bold text-slate-800">{application.amountFormatted}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Application Deadline:</span>
            <span className="font-bold text-slate-800">{application.deadline}</span>
          </div>
        </div>

        {/* Personal Notes Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
            Personal Application Notes & Reminders
          </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document checklist status, submission confirmation code, professor recommendation follow-up, essay thoughts..."
            className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-slate-800"
          />
        </div>

        {/* Audit History / Timeline */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-indigo-600" />
            <span>Application Activity History</span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {application.history.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Status: {h.status}</span>
                    <span className="text-[10px] text-slate-400">{formatDatePretty(h.timestamp)}</span>
                  </div>
                  {h.note && <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-600/20 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Application Notes</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
