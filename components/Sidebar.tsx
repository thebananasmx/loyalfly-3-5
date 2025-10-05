import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate('/login');
    };

    const navLinkClasses = "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors";
    const activeClass = "bg-black text-white";
    const inactiveClass = "text-gray-600 hover:bg-gray-200 hover:text-black";
    
    return (
        <>
            {/* Backdrop for mobile */}
            <div 
              className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={onClose}
              aria-hidden="true"
            ></div>

            <aside 
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                aria-label="Sidebar"
            >
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-black">Loyalfly App</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink 
                        to="/app/dashboard"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink 
                        to="/app/tarjeta"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <CardIcon />
                        <span>Mi Tarjeta</span>
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
        </>
    );
};

export default Sidebar;
