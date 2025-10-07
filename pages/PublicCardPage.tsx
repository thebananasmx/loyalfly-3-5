import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { getPublicCardSettings, createNewCustomer, getBusinessIdBySlug } from '../services/firebaseService';

interface CardSettings {
    name: string;
    reward: string;
    color: string;
    textColorScheme: 'dark' | 'light';
    logoUrl?: string;
}

const PublicCardPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();

    const [settings, setSettings] = useState<CardSettings | null>(null);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isRegistered, setIsRegistered] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userStamps, setUserStamps] = useState(0);

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
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userName && userPhone && businessId) {
            try {
                await createNewCustomer(businessId, { name: userName, phone: userPhone, email: userEmail });
                setIsRegistered(true);
            } catch (err) {
                console.error("Registration failed", err);
                setError("No se pudo completar el registro. Inténtalo de nuevo.");
            }
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

    if (error || !settings) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-gray-700 mt-2">{error || 'No se encontró el negocio.'}</p>
            </div>
        )
    }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-black tracking-tight text-center mb-2">Registro de Cliente</h1>
        <p className="text-gray-600 text-center mb-6">Únete al programa de lealtad de <span className="font-semibold">{settings.name}</span>.</p>

        <CardPreview
          businessName={settings.name}
          rewardText={settings.reward}
          cardColor={settings.color}
          stamps={userStamps}
          textColorScheme={settings.textColorScheme}
          logoUrl={settings.logoUrl}
        />
        
        <div className="mt-6 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          {isRegistered ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-black">¡Bienvenido, {userName}!</h2>
              <p className="text-gray-600 mt-2">
                Ya eres parte de nuestro programa de lealtad.
              </p>
              <p className="mt-4 font-semibold text-lg">
                Tienes <span className="text-[#00AA00]">{userStamps}</span> sellos.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-black text-center mb-4">Completa tus datos</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-base font-medium text-gray-700">Nombre</label>
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
                  <label htmlFor="userPhone" className="block text-base font-medium text-gray-700">Teléfono</label>
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
                  <label htmlFor="userEmail" className="block text-base font-medium text-gray-700">
                    Email <span className="text-gray-500">(Opcional)</span>
                  </label>
                  <input
                    id="userEmail"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                    placeholder="tu@email.com"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-colors"
                >
                  Registrarme
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicCardPage;