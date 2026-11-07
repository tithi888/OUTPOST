import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  StudentProfile, 
  ApplicationItem, 
  DocumentItem, 
  ApplicationStatus, 
  DocumentStatus,
  Scholarship 
} from '../types';
import { 
  INITIAL_PROFILE, 
  DEMO_PROFILES, 
  INITIAL_SAVED_SCHOLARSHIP_IDS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DOCUMENTS 
} from '../data/defaultProfile';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  profile: StudentProfile;
  setProfile: (profile: StudentProfile) => void;
  loadDemoProfile: (key: string) => void;
  resetAllData: () => void;
  savedScholarshipIds: string[];
  toggleSaveScholarship: (id: string) => void;
  isScholarshipSaved: (id: string) => boolean;
  applications: ApplicationItem[];
  addApplication: (scholarshipId: string, status?: ApplicationStatus, note?: string) => void;
  updateApplicationStatus: (id: string, newStatus: ApplicationStatus, note?: string) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  removeApplication: (id: string) => void;
  getApplicationByScholarshipId: (scholarshipId: string) => ApplicationItem | undefined;
  documents: DocumentItem[];
  updateDocumentStatus: (id: string, status: DocumentStatus, fileName?: string, fileSize?: string) => void;
  addDocument: (doc: DocumentItem) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  scholarships: Scholarship[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'grantly_profile_v1',
  SAVED: 'grantly_saved_v1',
  APPLICATIONS: 'grantly_applications_v1',
  DOCUMENTS: 'grantly_documents_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or defaults
  const [profile, setProfileState] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [savedScholarshipIds, setSavedScholarshipIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
      return saved ? JSON.parse(saved) : INITIAL_SAVED_SCHOLARSHIP_IDS;
    } catch {
      return INITIAL_SAVED_SCHOLARSHIP_IDS;
    }
  });

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedScholarshipIds));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  }, [savedScholarshipIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save applications', e);
    }
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents', e);
    }
  }, [documents]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setProfile = (newProfile: StudentProfile) => {
    setProfileState(newProfile);
    showToast('Student profile updated successfully!');
  };

  const loadDemoProfile = (key: string) => {
    if (DEMO_PROFILES[key]) {
      setProfileState(DEMO_PROFILES[key]);
      showToast(`Loaded demo persona: ${DEMO_PROFILES[key].fullName}`, 'info');
    }
  };

  const resetAllData = () => {
    setProfileState(INITIAL_PROFILE);
    setSavedScholarshipIds(INITIAL_SAVED_SCHOLARSHIP_IDS);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    showToast('Platform data reset to default demo records.', 'info');
  };

  const toggleSaveScholarship = (id: string) => {
    setSavedScholarshipIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Scholarship removed from bookmarks', 'info');
        return prev.filter((item) => item !== id);
      } else {
        const sch = SCHOLARSHIPS_DATA.find((s) => s.id === id);
        showToast(`Saved "${sch?.title || 'Scholarship'}" to bookmarks!`);
        return [...prev, id];
      }
    });
  };

  const isScholarshipSaved = (id: string) => {
    return savedScholarshipIds.includes(id);
  };

  const getApplicationByScholarshipId = (scholarshipId: string) => {
    return applications.find((a) => a.scholarshipId === scholarshipId);
  };

  const addApplication = (
    scholarshipId: string, 
    status: ApplicationStatus = 'Interested', 
    note?: string
  ) => {
    const existing = applications.find((a) => a.scholarshipId === scholarshipId);
    if (existing) {
      updateApplicationStatus(existing.id, status, note);
      return;
    }

    const sch = SCHOLARSHIPS_DATA.find((s) => s.id === scholarshipId);
    if (!sch) return;

    const newApp: ApplicationItem = {
      id: 'app-' + Date.now(),
      scholarshipId: sch.id,
      scholarshipTitle: sch.title,
      provider: sch.provider,
      amountFormatted: sch.amountFormatted,
      deadline: sch.deadline,
      status: status,
      appliedDate: status === 'Applied' || status === 'Approved' ? new Date().toISOString().split('T')[0] : undefined,
      notes: note || `Added to tracker with status: ${status}`,
      history: [
        {
          status: status,
          timestamp: new Date().toISOString(),
          note: note || 'Initial addition to tracker',
        },
      ],
      lastUpdated: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    showToast(`Added to application tracker (${status})!`);
  };

  const updateApplicationStatus = (
    id: string, 
    newStatus: ApplicationStatus, 
    note?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const isApplyingOrApproved = newStatus === 'Applied' || newStatus === 'Approved';
          return {
            ...app,
            status: newStatus,
            appliedDate: isApplyingOrApproved && !app.appliedDate ? new Date().toISOString().split('T')[0] : app.appliedDate,
            notes: note || app.notes,
            lastUpdated: new Date().toISOString(),
            history: [
              ...app.history,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note: note || `Status changed to ${newStatus}`,
              },
            ],
          };
        }
        return app;
      })
    );
    showToast(`Application status updated to ${newStatus}`);
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            notes,
            lastUpdated: new Date().toISOString(),
          };
        }
        return app;
      })
    );
    showToast('Personal notes saved!');
  };

  const removeApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application entry removed from tracker', 'info');
  };

  const updateDocumentStatus = (
    id: string, 
    status: DocumentStatus, 
    fileName?: string, 
    fileSize?: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          return {
            ...doc,
            status,
            fileName: fileName || doc.fileName,
            fileSize: fileSize || doc.fileSize,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return doc;
      })
    );
    showToast(`Document "${fileName || 'Item'}" status updated!`);
  };

  const addDocument = (doc: DocumentItem) => {
    setDocuments((prev) => [...prev, doc]);
    showToast(`Added document: ${doc.name}`);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        loadDemoProfile,
        resetAllData,
        savedScholarshipIds,
        toggleSaveScholarship,
        isScholarshipSaved,
        applications,
        addApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        removeApplication,
        getApplicationByScholarshipId,
        documents,
        updateDocumentStatus,
        addDocument,
        toasts,
        showToast,
        removeToast,
        scholarships: SCHOLARSHIPS_DATA,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
