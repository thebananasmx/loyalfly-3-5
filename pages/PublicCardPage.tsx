import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { getPublicCardSettings, createNewCustomer, getBusinessIdBySlug, getCustomerByPhone } from '../services/firebaseService';
import type { Customer } from '../types';

type ViewState = 'lookup' | 'register' | 'display';

interface CardSettings {
    name: string;
    reward: string;
    color: string;
    textColorScheme: 'dark' | 'light';
    logoUrl?: string;
}

const PublicCardPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    // Business & UI State
    const [settings, setSettings] = useState<CardSettings | null>(null);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Initial page load
    const [isSubmitting, setIsSubmitting] = useState(false); // For form submissions
    const [error, setError] = useState<string | null>(null);

    // View & Customer State
    const [view, setView] = useState<ViewState>('lookup');
    const [customer, setCustomer] = useState<Customer | null>(null);
    
    // Form Inputs State
    const [phoneLookup, setPhoneLookup] = useState(''); // For the lookup form
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            if (!slug) {
                setError('No se ha especificado un negocio.');
                setLoading(false);
                return;
            }
            try {
                const id = await getBusinessIdBySlug(slug);
                if (!id) {
                    setError('No se pudo encontrar el negocio.');
                    setLoading(false);
                    return;
                }
                setBusinessId(id);
                const data = await getPublicCardSettings(id);
                if (data) {
                    setSettings(data as CardSettings);
                } else {
                    setError('No se pudo encontrar la configuración para este negocio.');
                }
            } catch (err) {
                console.error(err);
                setError('Ocurrió un error al cargar la información del negocio.');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [slug]);

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!businessId || !phoneLookup) return;
        setIsSubmitting(true);
        setError(null);
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
            setError('Ocurrió un error al buscar. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName || !userPhone || !businessId) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const existingCustomer = await getCustomerByPhone(businessId, userPhone);
            if (existingCustomer) {
                setError('Este número de teléfono ya está registrado.');
                setIsSubmitting(false);
                return;
            }

            const newCustomer = await createNewCustomer(businessId, { name: userName, phone: userPhone, email: userEmail });
            setCustomer(newCustomer);
            setView('display');
        } catch (err) {
            console.error("Registration failed", err);
            setError("No se pudo completar el registro. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderContent = () => {
        if (error && !settings) { // Show fatal error if settings couldn't load
            return (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-700 mt-2">{error}</p>
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
                                        <input
                                            id="phoneLookup"
                                            type="tel"
                                            value={phoneLookup}
                                            onChange={(e) => setPhoneLookup(e.target.value)}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="Tu número de teléfono"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-600">{error}</p>}
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
                                        <input
                                            id="userName"
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="userPhone" className="block text-base font-medium text-gray-700 sr-only">Teléfono</label>
                                        <input
                                            id="userPhone"
                                            type="tel"
                                            value={userPhone}
                                            onChange={(e) => setUserPhone(e.target.value)}
                                            required
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="Tu número de teléfono"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="userEmail" className="block text-base font-medium text-gray-700 sr-only">
                                            Email (Opcional)
                                        </label>
                                        <input
                                            id="userEmail"
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="tu@email.com (opcional)"
                                        />
                                    </div>
                                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2.5 px-4 font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors disabled:bg-gray-400"
                                    >
                                        {isSubmitting ? 'Registrando...' : 'Registrarme'}
                                    </button>
                                    <p className="text-center text-sm text-gray-500 mt-2">
                                        ¿Ya tienes cuenta?{' '}
                                        <button onClick={() => { setView('lookup'); setError(null); }} className="font-medium text-[#00AA00] hover:underline focus:outline-none">
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
                        <div className="mt-6 bg-white p-6 border border-gray-200 rounded-lg shadow-sm text-center">
                            <h2 className="text-2xl font-bold text-black">¡Hola, {customer?.name}!</h2>
                            <p className="text-gray-600 mt-1">Este es el estado de tu tarjeta.</p>
                             <button
                                onClick={() => {
                                    setView('lookup');
                                    setCustomer(null);
                                    setPhoneLookup('');
                                    setError(null);
                                }}
                                className="mt-4 w-full py-2 px-4 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                            >
                                Consultar otro número
                            </button>
                        </div>
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
