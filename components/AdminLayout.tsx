import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from './ToastContainer';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const BlogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const MetricsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const KloyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const MarketingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>;

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate('/admin/login');
    };

    const navLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200";
    const activeClass = "bg-gray-200 text-[#4D17FF]";
    const inactiveClass = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";
    
    return (
        <>
            {/* Backdrop for mobile */}
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={onClose}
              aria-hidden="true"
            ></div>

            <aside 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-50 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-label="Sidebar"
            >
                <div className="p-4 h-16 flex items-center">
                    <Link to="/admin/dashboard" onClick={onClose}>
                        <img src="https://raw.githubusercontent.com/thebananasmx/loyalfly-3-5/refs/heads/main/assets/logo_desk.svg" alt="Loyalfly" className="h-7 w-auto" />
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink 
                        to="/admin/dashboard"
                        end
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <DashboardIcon />
                        <span>Negocios</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/kpis"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <MetricsIcon />
                        <span>KPIs</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/kloy"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <KloyIcon />
                        <span>Agente IA - Kloy</span>
                    </NavLink>
                     <NavLink 
                        to="/admin/blog"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <BlogIcon />
                        <span>Blog</span>
                    </NavLink>
                    <NavLink 
                        to="/admin/marketing"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <MarketingIcon />
                        <span>Marketing / Popups</span>
                    </NavLink>
                </nav>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className={`${navLinkClasses} w-full ${inactiveClass}`}
                    >
                        <LogoutIcon />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white font-sans">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-10 flex items-center justify-between h-16 px-4 sm:px-6">
            <Link to="/admin/dashboard">
              <img src="https://raw.githubusercontent.com/thebananasmx/loyalfly-3-5/refs/heads/main/assets/logo_desk.svg" alt="Loyalfly" className="h-7 w-auto" />
            </Link>
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

export default AdminLayout;