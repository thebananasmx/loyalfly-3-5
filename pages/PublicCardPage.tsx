import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { getPublicCardSettings, createNewCustomer, getBusinessIdBySlug, getCustomerByPhone, getSurveySettings, hasCustomerVoted } from '../services/firebaseService';
import type { Customer } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import ExclamationCircleIcon from '../components/icons/ExclamationCircleIcon';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, validatePhoneNumber, formatPhoneWithDialCode } from '../utils/phoneUtils';

// --- CONFIGURACIÓN DE BACKEND (Cloud Functions 2nd Gen) ---
const GOOGLE_WALLET_URL = "https://generatewalletpass-qt7vvfswnq-uc.a.run.app";
const APPLE_WALLET_URL = "https://generateapplepass-qt7vvfswnq-uc.a.run.app";

type ViewState = 'lookup' | 'register' | 'display';

interface CardSettings {
    name: string;
    reward: string;
    color: string;
    textColorScheme: 'dark' | 'light';
    logoUrl?: string;
    plan?: string;
    stampsGoal?: number;
    stampIconType?: 'star' | 'coffee' | 'heart' | 'scissors' | 'gift' | 'custom';
    stampColor?: string;
    customStampUrl?: string;
}

interface SurveySettings {
    isEnabled: boolean;
    bannerMessage: string;
    question: string;
    option1: string;
    option2: string;
    surveyId: string;
}

const PublicCardPage: React.FC = () => {
    const { t } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const topRef = useRef<HTMLDivElement>(null);

    const [settings, setSettings] = useState<CardSettings | null>(null);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [errors, setErrors] = useState<{ phoneLookup?: string, userName?: string, userPhone?: string, userEmail?: string, form?: string }>({});

    const [view, setView] = useState<ViewState>('lookup');
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [surveySettings, setSurveySettings] = useState<SurveySettings | null>(null);
    const [hasVoted, setHasVoted] = useState(true);
    
    const [phoneLookup, setPhoneLookup] = useState(''); 
    const [selectedCountryLookup, setSelectedCountryLookup] = useState('MX');
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [selectedCountryRegister, setSelectedCountryRegister] = useState('MX');
    const [userEmail, setUserEmail] = useState('');
    const { i18n } = useTranslation();

    const handleAddToGoogleWallet = () => {
        if (!businessId || !customer) return;
        window.location.href = `${GOOGLE_WALLET_URL}?bid=${businessId}&cid=${customer.id}`;
    };

    const handleAddToAppleWallet = () => {
        if (!businessId || !customer) return;
        window.location.href = `${APPLE_WALLET_URL}?bid=${businessId}&cid=${customer.id}`;
    };

    const getGoogleWalletBadgeUrl = () => {
        const lang = i18n.language.split('-')[0];
        if (lang === 'es') return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770771245/esUS_add_to_google_wallet_add-wallet-badge_qmkpl1.svg';
        if (lang === 'pt') return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770771211/br_add_to_google_wallet_add-wallet-badge_zpnazi.svg';
        return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770771222/enUS_add_to_google_wallet_add-wallet-badge_lfceip.svg';
    };

    const getAppleWalletBadgeUrl = () => {
        const lang = i18n.language.split('-')[0];
        if (lang === 'es') return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770770709/ESMX_Add_to_Apple_Wallet_RGB_101821_in2cem.svg';
        if (lang === 'pt') return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770770808/PT_Add_to_Apple_Wallet_RGB_102021_m9ggwe.svg';
        return 'https://res.cloudinary.com/dg4wbuppq/image/upload/v1770770828/US-UK_Add_to_Apple_Wallet_RGB_101421_hkprrj.svg';
    };

    useEffect(() => {
        document.title = 'Loyalfly';
        
        // Canonical tag logic
        let canonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = `https://loyalfly.com.mx/view/${slug}`;
        if (canonical) {
          canonical.setAttribute('href', canonicalUrl);
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', canonicalUrl);
          document.head.appendChild(canonical);
        }

        const fetchSettings = async () => {
            if (!slug) {
                setErrors({ form: 'No se ha especificado un negocio.' });
                setLoading(false);
                return;
            }
            try {
                const id = await getBusinessIdBySlug(slug);
                if (!id) {
                    setErrors({ form: 'No se pudo encontrar el negocio.' });
                    setLoading(false);
                    return;
                }
                setBusinessId(id);
                const data = await getPublicCardSettings(id);
                if (data) {
                    setSettings(data as CardSettings);
                    document.title = `${data.name} | Loyalfly`;
                } else {
                    setErrors({ form: 'No se pudo encontrar la configuración para este negocio.' });
                }
            } catch (err) {
                console.error(err);
                setErrors({ form: 'Ocurrió un error al cargar la información del negocio.' });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [slug]);

    useEffect(() => {
        if (view === 'display') {
            topRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [view]);

    const handlePhoneChange = (setter: React.Dispatch<React.SetStateAction<string>>, countryCode: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = e.target.value.replace(/\D/g, '');
        const maxDigits = COUNTRIES.find(c => c.code === countryCode)?.digits || 10;
        setter(sanitized.slice(0, maxDigits));
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessId || !phoneLookup) return;

        const phoneError = validatePhoneNumber(phoneLookup, selectedCountryLookup);
        if (phoneError) {
            setErrors({ phoneLookup: phoneError });
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        try {
            const fullPhone = formatPhoneWithDialCode(phoneLookup, selectedCountryLookup);
            let foundCustomer = await getCustomerByPhone(businessId, fullPhone);
            
            // Dual search for backward compatibility
            if (!foundCustomer && selectedCountryLookup === 'MX') {
                foundCustomer = await getCustomerByPhone(businessId, phoneLookup.replace(/\D/g, ''));
            }

            if (foundCustomer) {
                setCustomer(foundCustomer);
                const surveyData = await getSurveySettings(businessId);
                if (surveyData && surveyData.isEnabled && surveyData.surveyId) {
                    setSurveySettings(surveyData as SurveySettings);
                    const voted = await hasCustomerVoted(businessId, foundCustomer.id, surveyData.surveyId);
                    setHasVoted(voted);
                } else {
                    setHasVoted(true); 
                }
                setView('display');
            } else {
                setUserPhone(phoneLookup); 
                setSelectedCountryRegister(selectedCountryLookup);
                setView('register');
            }
        } catch (err) {
            setErrors({ form: 'Ocurrió un error al buscar. Inténtalo de nuevo.' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessId) return;

        const newErrors: { userName?: string, userPhone?: string, userEmail?: string } = {};
        if (!userName) newErrors.userName = "Tu nombre es requerido.";
        
        const phoneError = validatePhoneNumber(userPhone, selectedCountryRegister);
        if (phoneError) newErrors.userPhone = phoneError;
        
        if (userEmail && !/\S+@\S+\.\S+/.test(userEmail)) {
            newErrors.userEmail = "No es una dirección de email válida.";
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        setIsSubmitting(true);
        setErrors({});

        try {
            const fullPhone = formatPhoneWithDialCode(userPhone, selectedCountryRegister);
            let existingCustomer = await getCustomerByPhone(businessId, fullPhone);
            
            // Dual search for existing check
            if (!existingCustomer && selectedCountryRegister === 'MX') {
                existingCustomer = await getCustomerByPhone(businessId, userPhone.replace(/\D/g, ''));
            }

            if (existingCustomer) {
                setErrors({ userPhone: 'Este número de teléfono ya está registrado.' });
                setIsSubmitting(false);
                return;
            }

            const newCustomer = await createNewCustomer(businessId, { name: userName, phone: fullPhone, email: userEmail });
            setCustomer(newCustomer);
            const surveyData = await getSurveySettings(businessId);
            if (surveyData && surveyData.isEnabled) {
                setSurveySettings(surveyData as SurveySettings);
                setHasVoted(false); 
            }
            setView('display');
        } catch (err) {
            console.error("Registration failed", err);
            setErrors({ form: "No se pudo completar el registro. Inténtalo de nuevo." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderContent = () => {
        if (errors.form && !settings) {
            return (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">{t('common.error')}</h1>
                    <p className="text-gray-700 mt-2">{errors.form}</p>
                </div>
            )
        }
        
        const businessHeader = (
            <div className="text-center mb-6 animate-fade-in-up">
                {settings?.logoUrl ? (
                    <img src={settings.logoUrl} alt={`${settings.name} logo`} className="w-20 h-20 mx-auto rounded-full object-cover mb-4 shadow-md border border-gray-200" />
                ) : (
                    <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gray-100 mb-4 shadow-sm border border-gray-200">
                        <span className="text-3xl font-bold text-gray-500">{settings?.name?.charAt(0)}</span>
                    </div>
                )}
                <h1 className="text-2xl font-bold text-black">{settings?.name}</h1>
            </div>
        );

        switch(view) {
            case 'lookup':
                return (
                    <div>
                        {businessHeader}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-semibold text-black tracking-tight text-center mb-4">{t('publicView.lookupTitle')}</h2>
                            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                                <form onSubmit={handleLookup} className="space-y-4">
                                    <div>
                                        <label htmlFor="phoneLookup" className="sr-only">{t('common.phone')}</label>
                                        <div className="flex gap-2">
                                            <select
                                                value={selectedCountryLookup}
                                                onChange={(e) => setSelectedCountryLookup(e.target.value)}
                                                className="block w-24 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black bg-white"
                                            >
                                                {COUNTRIES.map(c => (
                                                    <option key={c.code} value={c.code}>{c.emoji} {c.dialCode}</option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <input
                                                    id="phoneLookup"
                                                    type="tel"
                                                    value={phoneLookup}
                                                    onChange={handlePhoneChange(setPhoneLookup, selectedCountryLookup)}
                                                    required
                                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.phoneLookup ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                    placeholder={t('publicView.lookupSubtitle')}
                                                    aria-invalid={!!errors.phoneLookup}
                                                    aria-describedby="phoneLookup-error"
                                                />
                                                {errors.phoneLookup && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ErrorMessage message={errors.phoneLookup} id="phoneLookup-error" />
                                    </div>
                                    <ErrorMessage message={errors.form} />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 px-4 font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? t('common.loading') : t('publicView.lookupBtn')}
                                    </button>
                                </form>
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    {t('publicView.newHere')}{' '}
                                    <button onClick={() => setView('register')} className="font-medium text-[#4D17FF] hover:underline focus:outline-none">
                                        {t('publicView.registerLink')}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                );
            
            case 'register':
                return (
                    <div>
                        {businessHeader}
                        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                           <h2 className="text-xl font-semibold text-black tracking-tight text-center mb-4">{t('publicView.registerTitle')}</h2>
                             <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label htmlFor="userName" className="block text-base font-medium text-gray-700 sr-only">{t('common.name')}</label>
                                        <div className="relative">
                                            <input
                                                id="userName"
                                                type="text"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                required
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userName ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder={t('common.name')}
                                                aria-invalid={!!errors.userName}
                                                aria-describedby="userName-error"
                                            />
                                            {errors.userName && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ExclamationCircleIcon />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage message={errors.userName} id="userName-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="userPhone" className="block text-base font-medium text-gray-700 sr-only">{t('common.phone')}</label>
                                         <div className="flex gap-2">
                                            <select
                                                value={selectedCountryRegister}
                                                onChange={(e) => setSelectedCountryRegister(e.target.value)}
                                                className="block w-24 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black bg-white"
                                            >
                                                {COUNTRIES.map(c => (
                                                    <option key={c.code} value={c.code}>{c.emoji} {c.dialCode}</option>
                                                ))}
                                            </select>
                                            <div className="relative flex-1">
                                                <input
                                                    id="userPhone"
                                                    type="tel"
                                                    value={userPhone}
                                                    onChange={handlePhoneChange(setUserPhone, selectedCountryRegister)}
                                                    required
                                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userPhone ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                    placeholder={t('common.phone')}
                                                    aria-invalid={!!errors.userPhone}
                                                    aria-describedby="userPhone-error"
                                                />
                                                {errors.userPhone && (
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <ExclamationCircleIcon />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ErrorMessage message={errors.userPhone} id="userPhone-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="userEmail" className="block text-base font-medium text-gray-700 sr-only">
                                            {t('common.email')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="userEmail"
                                                type="email"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userEmail ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder={`${t('common.email')} (opcional)`}
                                                aria-invalid={!!errors.userEmail}
                                                aria-describedby="userEmail-error"
                                            />
                                            {errors.userEmail && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ExclamationCircleIcon />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage message={errors.userEmail} id="userEmail-error" />
                                    </div>
                                    <ErrorMessage message={errors.form} />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 px-4 font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? t('common.loading') : t('publicView.registerBtn')}
                                    </button>
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        {t('auth.haveAccount')}{' '}
                                        <button onClick={() => { setView('lookup'); setErrors({}); }} className="font-medium text-[#4D17FF] hover:underline focus:outline-none">
                                            {t('publicView.checkPoints')}
                                        </button>
                                    </p>
                                </form>
                             </div>
                        </div>
                    </div>
                );
            
            case 'display':
                return (
                     <div className="animate-fade-in-up">
                        {surveySettings && surveySettings.isEnabled && !hasVoted && (
                            <div className="mb-4 text-center bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-lg shadow-sm">
                                <Link to={`/vote/${slug}?customerId=${customer?.id}`} className="font-semibold hover:underline">
                                    🎉 {surveySettings.bannerMessage}
                                </Link>
                            </div>
                        )}
                        <CardPreview
                          businessName={settings!.name}
                          rewardText={settings!.reward}
                          cardColor={settings!.color}
                          stamps={customer?.stamps || 0}
                          textColorScheme={settings!.textColorScheme}
                          logoUrl={settings!.logoUrl}
                          customerName={customer?.name}
                          customerPhone={customer?.phone}
                          customerId={customer?.id}
                          stampsGoal={settings?.stampsGoal}
                          stampIconType={settings?.stampIconType}
                          stampColor={settings?.stampColor}
                          customStampUrl={settings?.customStampUrl}
                        />

                        {customer && (settings?.plan?.toLowerCase() === 'entrepreneur' || settings?.plan?.toLowerCase() === 'pro') && (
                            <div className="mt-6 flex flex-col items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <button 
                                    onClick={handleAddToAppleWallet} 
                                    className="transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                                    aria-label="Add to Apple Wallet"
                                >
                                    <img src={getAppleWalletBadgeUrl()} alt="Add to Apple Wallet" className="h-[52px] w-auto" />
                                </button>
                                <button 
                                    onClick={handleAddToGoogleWallet} 
                                    className="transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                                    aria-label="Add to Google Wallet"
                                >
                                    <img src={getGoogleWalletBadgeUrl()} alt="Add to Google Wallet" className="h-[52px] w-auto" />
                                </button>
                            </div>
                        )}

                        <button
                           onClick={() => {
                               setView('lookup');
                               setCustomer(null);
                               setPhoneLookup('');
                               setErrors({});
                           }}
                           className="mt-6 w-full py-2.5 px-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                       >
                           {t('publicView.consultOther')}
                       </button>

                        {settings?.plan === 'Gratis' && (
                            <Link
                                to="/"
                                className="mt-4 w-full py-3 px-4 flex items-center justify-center gap-3 text-base font-bold text-white bg-[#4D17FF] rounded-md shadow-md hover:bg-[#3a11cc] transition-colors"
                            >
                                <img src="https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_100/v1762622899/ico_loyalfly_xgfdv8.svg" alt="" className="w-6 h-6" />
                                <span>{t('card.join')} {settings.name}</span>
                            </Link>
                        )}
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                 <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                  <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }
  
    return (
        <div ref={topRef} className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm mx-auto">
                {renderContent()}
            </div>
            <div className="text-center text-sm text-gray-500 mt-8 flex flex-col items-center gap-4">
              <div>
                <p>{t('common.poweredBy')}</p>
                <Link to="/terminos" className="hover:underline">{t('header.terms')}</Link>
              </div>
              <div className="my-4">
                 <LanguageSelector />
              </div>
            </div>
        </div>
      );
};

export default PublicCardPage;