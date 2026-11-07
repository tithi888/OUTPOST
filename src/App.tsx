import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ScholarshipDetailPage } from './pages/ScholarshipDetailPage';
import { TrackerPage } from './pages/TrackerPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DeadlinesPage } from './pages/DeadlinesPage';
import { SettingsPage } from './pages/SettingsPage';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';

export function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Landing Page Route with standalone Navbar & Footer */}
          <Route
            path="/"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1">
                  <LandingPage />
                </main>
                <Footer />
                <NotificationToast />
              </div>
            }
          />

          {/* Onboarding Wizard (Dedicated focused layout) */}
          <Route
            path="/onboarding"
            element={
              <div className="min-h-screen flex flex-col bg-slate-50">
                <Navbar />
                <main className="flex-1">
                  <OnboardingPage />
                </main>
                <Footer />
                <NotificationToast />
              </div>
            }
          />

          {/* Workspace Routes inside responsive AppLayout with Sidebar */}
          <Route element={<AppLayout showSidebar={true} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/discover" element={<DiscoveryPage />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/deadlines" element={<DeadlinesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
