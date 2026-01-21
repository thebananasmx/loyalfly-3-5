import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LegalLayout: React.FC = () => {
    const { t } = useTranslation();
    const navLinkClasses = "block px-4 py-2 rounded-md text-base font-medium transition-colors";
    const activeClass = "bg-gray-100 text-black font-bold";
    const inactiveClass = "text-gray-600 hover:bg-gray-100 hover:text-black";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Legal Sidebar */}
                <aside className="md:w-1/4 lg:w-1/5">
                    <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wider">{t('legal.sidebarTitle')}</h2>
                    <nav className="space-y-2">
                         <NavLink
                            to="/terminos"
                            end
                            className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                        >
                            {t('legal.terms')}
                        </NavLink>
                        <NavLink
                            to="/terminos/cancelaciones"
                            className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                        >
                            {t('legal.cancellations')}
                        </NavLink>
                        <NavLink
                            to="/terminos/reembolsos"
                            className={({isActive}) => `${navLinkClasses} ${isActive ? activeClass : inactiveClass}`}
                        >
                            {t('legal.refunds')}
                        </NavLink>
                    </nav>
                </aside>

                {/* Legal Content */}
                <main className="md:w-3/4 lg:w-4/5 bg-white p-6 sm:p-10 rounded-xl border border-gray-200 shadow-sm">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LegalLayout;