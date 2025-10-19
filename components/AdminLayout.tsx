import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from './ToastContainer';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/admin');
    };

    const navLinkClasses = "flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors";
    const activeClass = "bg-black text-white";
    const inactiveClass = "text-gray-600 hover:bg-gray-200 hover:text-black";
    
    return (
        <aside 
            className="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col"
            aria-label="Sidebar"
        >
            <div className="p-4 border-b border-gray-200 h-16 flex items-center">
                <Link to="/admin/dashboard">
                    <img src="https://raw.githubusercontent.com/thebananasmx/loyalfly-3-5/refs/heads/main/assets/logo_desk.svg" alt="Loyalfly" className="h-7 w-auto" />
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                <NavLink 
                    to="/admin/dashboard"
                    className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                >
                    <DashboardIcon />
                    <span>Negocios</span>
                </NavLink>
            </nav>
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className={`${navLinkClasses} w-full ${inactiveClass}`}
                >
                    <LogoutIcon />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}

const AdminLayout: React.FC = () => {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
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