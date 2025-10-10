import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { getPublicCardSettings, createNewCustomer, getBusinessIdBySlug, getCustomerByPhone } from '../services/firebaseService';
import type { Customer } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import ExclamationCircleIcon from '../components/icons/ExclamationCircleIcon';

type ViewState = 'lookup' | 'register' | 'display';

interface CardSettings {
    name: string;
    reward: string;
    color: string;
    textColorScheme: 'dark' | 'light';
    logoUrl?: string;
}

const validateMexicanPhoneNumber = (phone: string): string => {
    if (!phone) return "El número de teléfono es requerido.";
    let cleaned = phone.trim();

    if (cleaned.startsWith('+521')) {
        cleaned = cleaned.substring(4);
    } else if (cleaned.startsWith('+52')) {
        cleaned = cleaned.substring(3);
    }

    cleaned = cleaned.replace(/\D/g, '');

    return /^\d{10}$/.test(cleaned) ? "" : "Por favor, ingresa un número de teléfono válido de 10 dígitos.";
};

const PublicCardPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    // Business & UI State
    const [settings, setSettings] = useState<CardSettings | null>(null);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Initial page load
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
    const [errors, setErrors] = useState<{ phoneLookup?: string, userName?: string, userPhone?: string, userEmail?: string, form?: string }>({});

    // View & Customer State
    const [view, setView] = useState<ViewState>('lookup');
    const [customer, setCustomer] = useState<Customer | null>(null);
    
    // Form Inputs State
    const [phoneLookup, setPhoneLookup] = useState(''); // For the lookup form
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        document.title = 'Cargando Tarjeta... | Loyalfly';
        const fetchSettings = async () => {
            if (!slug) {
                setErrors({ form: 'No se ha especificado un negocio.' });
                setLoading(false);
                document.title = 'Error | Loyalfly';
                return;
            }
            try {
                const id = await getBusinessIdBySlug(slug);
                if (!id) {
                    setErrors({ form: 'No se pudo encontrar el negocio.' });
                    setLoading(false);
                    document.title = 'Negocio no encontrado | Loyalfly';
                    return;
                }
                setBusinessId(id);
                const data = await getPublicCardSettings(id);
                if (data) {
                    setSettings(data as CardSettings);
                    document.title = `Tu Tarjeta de Lealtad de ${data.name} | Loyalfly`;
                } else {
                    setErrors({ form: 'No se pudo encontrar la configuración para este negocio.' });
                    document.title = 'Tarjeta no encontrada | Loyalfly';
                }
            } catch (err) {
                console.error(err);
                setErrors({ form: 'Ocurrió un error al cargar la información del negocio.' });
                document.title = 'Error de Carga | Loyalfly';
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [slug]);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessId || !phoneLookup) return;

        const phoneError = validateMexicanPhoneNumber(phoneLookup);
        if (phoneError) {
            setErrors({ phoneLookup: phoneError });
            return;
        }

        setIsSubmitting(true);
        setErrors({});
        try {
            const foundCustomer = await getCustomerByPhone(businessId, phoneLookup);
            if (foundCustomer) {
                setCustomer(foundCustomer);
                setView('display');
            } else {
                setUserPhone(phoneLookup); // Pre-fill phone for registration
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
        
        const phoneError = validateMexicanPhoneNumber(userPhone);
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
            const existingCustomer = await getCustomerByPhone(businessId, userPhone);
            if (existingCustomer) {
                setErrors({ userPhone: 'Este número de teléfono ya está registrado.' });
                setIsSubmitting(false);
                return;
            }

            const newCustomer = await createNewCustomer(businessId, { name: userName, phone: userPhone, email: userEmail });
            setCustomer(newCustomer);
            setView('display');
        } catch (err) {
            console.error("Registration failed", err);
            setErrors({ form: "No se pudo completar el registro. Inténtalo de nuevo." });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderContent = () => {
        if (errors.form && !settings) { // Show fatal error if settings couldn't load
            return (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
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
                            <h2 className="text-xl font-semibold text-black tracking-tight text-center mb-4">Consulta tu tarjeta</h2>
                            <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                                <form onSubmit={handleLookup} className="space-y-4">
                                    <div>
                                        <label htmlFor="phoneLookup" className="sr-only">Número de Teléfono</label>
                                        <div className="relative">
                                            <input
                                                id="phoneLookup"
                                                type="tel"
                                                value={phoneLookup}
                                                onChange={(e) => setPhoneLookup(e.target.value)}
                                                required
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.phoneLookup ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder="Tu número de teléfono (10 dígitos)"
                                                aria-invalid={!!errors.phoneLookup}
                                                aria-describedby="phoneLookup-error"
                                            />
                                            {errors.phoneLookup && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ExclamationCircleIcon />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage message={errors.phoneLookup} id="phoneLookup-error" />
                                    </div>
                                    <ErrorMessage message={errors.form} />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 px-4 font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Consultando...' : 'Consultar'}
                                    </button>
                                </form>
                                <p className="text-center text-sm text-gray-500 mt-4">
                                    ¿Eres nuevo?{' '}
                                    <button onClick={() => setView('register')} className="font-medium text-[#00AA00] hover:underline focus:outline-none">
                                        Regístrate aquí
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
                           <h2 className="text-xl font-semibold text-black tracking-tight text-center mb-4">Regístrate</h2>
                             <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label htmlFor="userName" className="block text-base font-medium text-gray-700 sr-only">Nombre</label>
                                        <div className="relative">
                                            <input
                                                id="userName"
                                                type="text"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                                required
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userName ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder="Tu nombre completo"
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
                                        <label htmlFor="userPhone" className="block text-base font-medium text-gray-700 sr-only">Teléfono</label>
                                         <div className="relative">
                                            <input
                                                id="userPhone"
                                                type="tel"
                                                value={userPhone}
                                                onChange={(e) => setUserPhone(e.target.value)}
                                                required
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userPhone ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder="Tu número de teléfono (10 dígitos)"
                                                aria-invalid={!!errors.userPhone}
                                                aria-describedby="userPhone-error"
                                            />
                                            {errors.userPhone && (
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ExclamationCircleIcon />
                                                </div>
                                            )}
                                        </div>
                                        <ErrorMessage message={errors.userPhone} id="userPhone-error" />
                                    </div>
                                    <div>
                                        <label htmlFor="userEmail" className="block text-base font-medium text-gray-700 sr-only">
                                            Email (Opcional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="userEmail"
                                                type="email"
                                                value={userEmail}
                                                onChange={(e) => setUserEmail(e.target.value)}
                                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.userEmail ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                                placeholder="tu@email.com (opcional)"
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
                                        {isSubmitting ? 'Registrando...' : 'Registrarme'}
                                    </button>
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        ¿Ya tienes cuenta?{' '}
                                        <button onClick={() => { setView('lookup'); setErrors({}); }} className="font-medium text-[#00AA00] hover:underline focus:outline-none">
                                            Consulta tus sellos
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
                        <CardPreview
                          businessName={settings!.name}
                          rewardText={settings!.reward}
                          cardColor={settings!.color}
                          stamps={customer?.stamps || 0}
                          textColorScheme={settings!.textColorScheme}
                          logoUrl={settings!.logoUrl}
                          customerName={customer?.name}
                          customerPhone={customer?.phone}
                        />
                        <button
                           onClick={() => {
                               setView('lookup');
                               setCustomer(null);
                               setPhoneLookup('');
                               setErrors({});
                           }}
                           className="mt-6 w-full py-2.5 px-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                       >
                           Consultar otro número
                       </button>
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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-sm mx-auto">
                {renderContent()}
            </div>
            <div className="text-center text-sm text-gray-500 mt-8 space-y-1">
              <p>Powered by Loyalfly</p>
              <Link to="/terminos" className="hover:underline">Términos y Condiciones</Link>
            </div>
        </div>
      );
};

export default PublicCardPage;