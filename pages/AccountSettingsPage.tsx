import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getBusinessData, reauthenticateAndChangePassword } from '../services/firebaseService';
import type { Business } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import { useTranslation, Trans } from 'react-i18next';

const AccountSettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { t } = useTranslation();

    const [businessData, setBusinessData] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordErrors, setPasswordErrors] = useState<{ current?: string; new?: string; confirm?: string; form?: string }>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        document.title = `${t('accountSettings.title')} | Loyalfly App`;
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await getBusinessData(user.uid);
                setBusinessData(data);
            } catch (error) {
                console.error("Failed to fetch business data:", error);
                showToast(t('accountSettings.fetchError'), 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, showToast]);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordErrors({});

        const newErrors: { current?: string; new?: string; confirm?: string } = {};
        if (!currentPassword) newErrors.current = t('accountSettings.errors.currentRequired');
        if (newPassword.length < 6) newErrors.new = t('accountSettings.errors.newLength');
        if (newPassword !== confirmPassword) newErrors.confirm = t('accountSettings.errors.mismatch');

        if (Object.keys(newErrors).length > 0) {
            setPasswordErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            await reauthenticateAndChangePassword(currentPassword, newPassword);
            showToast(t('accountSettings.success'), 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            console.error("Password change failed:", error);
            if (error.code === 'auth/wrong-password') {
                setPasswordErrors({ form: t('accountSettings.errors.wrongPassword') });
            } else {
                setPasswordErrors({ form: t('accountSettings.errors.general') });
            }
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }
    
    const inputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black disabled:bg-gray-100";

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-black tracking-tight">{t('accountSettings.title')}</h1>
                <p className="text-gray-600 mt-1">{t('accountSettings.subtitle')}</p>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
                <h2 className="text-xl font-bold text-black">{t('accountSettings.businessInfo')}</h2>
                <div>
                    <label htmlFor="businessName" className="block text-base font-medium text-gray-700">{t('accountSettings.businessName')}</label>
                    <input id="businessName" type="text" value={businessData?.name || ''} disabled className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700">{t('accountSettings.email')}</label>
                    <input id="email" type="email" value={user?.email || ''} disabled className={inputClasses} />
                </div>
            </div>

            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h2 className="text-xl font-bold text-black">{t('accountSettings.security')}</h2>
                <form onSubmit={handlePasswordChange} className="space-y-6 mt-4">
                     <div>
                        <label htmlFor="currentPassword" className="block text-base font-medium text-gray-700">{t('accountSettings.currentPassword')}</label>
                        <input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className={inputClasses} />
                        <ErrorMessage message={passwordErrors.current} />
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-base font-medium text-gray-700">{t('accountSettings.newPassword')}</label>
                        <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={inputClasses} />
                        <ErrorMessage message={passwordErrors.new} />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">{t('accountSettings.confirmPassword')}</label>
                        <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={inputClasses} />
                        <ErrorMessage message={passwordErrors.confirm} />
                    </div>
                    <ErrorMessage message={passwordErrors.form} />
                    <div className="text-right">
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 disabled:bg-gray-400">
                            {isSaving ? t('accountSettings.saving') : t('accountSettings.savePassword')}
                        </button>
                    </div>
                </form>
            </div>

            {businessData?.plan && businessData.plan !== 'Gratis' && (
                <div className="p-6 bg-white border border-red-200 rounded-lg">
                    <h2 className="text-xl font-bold text-red-600">{t('accountSettings.subscription')}</h2>
                    <p className="text-gray-600 mt-2">
                        <Trans i18nKey="accountSettings.subscriptionDesc" values={{ plan: businessData.plan }}>
                            Actualmente estás en el plan <strong>{businessData.plan}</strong>. Si deseas cancelar tu suscripción, puedes hacerlo desde el portal de facturación de Stripe.
                        </Trans>
                    </p>
                    <div className="mt-6">
                        <a 
                            href="https://billing.stripe.com/p/login/3cI6oI2dX1Rrfpy9XP5c400" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                        >
                            {t('accountSettings.cancelSubscription')}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettingsPage;
