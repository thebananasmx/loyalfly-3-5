import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBusinessData } from '../services/firebaseService';
import type { Business } from '../types';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const CardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const SurveyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const MetricsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [businessData, setBusinessData] = useState<Business | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            if (user?.uid) {
                const data = await getBusinessData(user.uid);
                setBusinessData(data);
            }
        };
        fetchBusiness();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        onClose();
        await logout();
        navigate('/login');
    };

    const navLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200";
    const activeClass = "bg-gray-200 text-[#4D17FF]";
    const inactiveClass = "text-gray-500 hover:bg-gray-100 hover:text-gray-900";

    const plan = businessData?.plan || 'Gratis';
    const limit = plan === 'Entrepreneur' ? 1000 : (plan === 'Pro' ? 1000000 : 100);
    const limitLabel = limit >= 1000000 ? '∞' : limit;
    const customerCount = businessData?.customerCount || 0;
    const progressPercentage = Math.min(100, (customerCount / limit) * 100);
    
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
                <div className="p-4 relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex justify-between items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3 truncate">
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
                            <span className="font-semibold text-black truncate">{businessData?.name || 'Mi Negocio'}</span>
                        </div>
                        <ChevronDownIcon />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-4 right-4 mt-2 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-10 animate-fade-in-down">
                           <NavLink 
                                to="/app/settings"
                                onClick={() => { setIsDropdownOpen(false); onClose(); }}
                                className={({isActive}) => `${navLinkClasses} mx-2 ${isActive ? activeClass : inactiveClass}`}
                            >
                                <SettingsIcon />
                                <span>{t('sidebar.settings')}</span>
                            </NavLink>
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink 
                        to="/app/dashboard"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <DashboardIcon />
                        <span>{t('sidebar.dashboard')}</span>
                    </NavLink>
                    <NavLink 
                        to="/app/tarjeta"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <CardIcon />
                        <span>{t('sidebar.myCard')}</span>
                    </NavLink>
                    <NavLink 
                        to="/app/metricas"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <MetricsIcon />
                        <span>{t('sidebar.metrics')}</span>
                    </NavLink>
                    <NavLink 
                        to="/app/vote"
                        onClick={onClose}
                        className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                    >
                        <SurveyIcon />
                        <span>{t('sidebar.survey')}</span>
                    </NavLink>
                </nav>

                {/* Usage Widget */}
                <div className="px-4 mb-6">
                    <div className="p-4 bg-white rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">{t('sidebar.usage.clients')}</span>
                            <span className="text-sm text-black">
                                {customerCount} / {limitLabel}
                            </span>
                        </div>
                        <div className="w-full rounded-full h-1.5 mb-3" style={{ backgroundColor: '#ede8ff' }}>
                            <div 
                                className="bg-[#4D17FF] h-1.5 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400">
                            {t('sidebar.usage.plan')}: <span className="text-[#4D17FF] font-medium">{plan}</span>
                        </p>
                    </div>
                </div>

                <div className="">
                    <LanguageSelector variant="sidebar" />
                </div>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className={`${navLinkClasses} w-full ${inactiveClass}`}
                    >
                        <LogoutIcon />
                        <span>{t('sidebar.logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
