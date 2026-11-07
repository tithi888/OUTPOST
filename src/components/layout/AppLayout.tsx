import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from '../common/Footer';
import { NotificationToast } from '../common/NotificationToast';

interface AppLayoutProps {
  showSidebar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ showSidebar = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {showSidebar && <Sidebar />}

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Footer />
      <NotificationToast />
    </div>
  );
};
