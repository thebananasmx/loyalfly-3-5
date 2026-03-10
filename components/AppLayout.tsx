import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from './ToastContainer';
import { useAuth } from '../context/AuthContext';
import { getBusinessData } from '../services/firebaseService';
import type { Business } from '../types';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businessData, setBusinessData] = useState<Business | null>(null);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchBusiness = async () => {
      if (user?.uid) {
        const data = await getBusinessData(user.uid);
        setBusinessData(data);
      }
    };
    fetchBusiness();
  }, [user]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white font-sans">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10 flex items-center justify-between h-16 px-4 sm:px-6">
            <Link to="/app/dashboard" className="flex items-center space-x-2">
              {businessData?.cardSettings?.logoUrl ? (
                <img 
                  src={businessData.cardSettings.logoUrl} 
                  alt={businessData.name} 
                  className="h-8 w-8 rounded-md object-contain bg-gray-50 border border-gray-100"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-8 w-8 rounded-md bg-black flex items-center justify-center text-white text-xs font-bold">
                  {businessData?.name?.charAt(0) || 'L'}
                </div>
              )}
              <span className="font-bold text-black truncate max-w-[150px]">{businessData?.name}</span>
            </Link>
            <button onClick={() => setSidebarOpen(true)} className="p-1 text-gray-600 hover:text-black">
              <span className="sr-only">Abrir menú</span>
              <MenuIcon />
            </button>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div key={location.pathname} className="animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
};

export default AppLayout;