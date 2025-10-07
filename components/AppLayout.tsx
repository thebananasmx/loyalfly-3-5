import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from './ToastContainer';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10 flex items-center justify-between h-16 px-4 sm:px-6">
            <Link to="/app/dashboard" className="text-xl font-bold text-black">Loyalfly</Link>
            <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-600 hover:text-black">
              <span className="sr-only">Abrir menú</span>
              <MenuIcon />
            </button>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

export default AppLayout;
