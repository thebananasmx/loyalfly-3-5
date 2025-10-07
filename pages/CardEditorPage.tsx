import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CardPreview from '../components/CardPreview';
import { useAuth } from '../context/AuthContext';
import { updateCardSettings, getBusinessData } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CheckIconSuccess = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00AA00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;


const CardEditorPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [businessName, setBusinessName] = useState('');
  const [rewardText, setRewardText] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cardColor, setCardColor] = useState('#FEF3C7');
  const [textColorScheme, setTextColorScheme] = useState<'dark' | 'light'>('dark');
  const [stamps, setStamps] = useState(4);
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
      const fetchBusinessData = async () => {
          if (!user) return;
          setIsLoadingData(true);
          try {
              const data: any = await getBusinessData(user.uid);
              if (data) {
                  setSlug(data.slug || '');
                  if (data.cardSettings) {
                      setBusinessName(data.cardSettings.name || '');
                      setRewardText(data.cardSettings.reward || '');
                      setCardColor(data.cardSettings.color || '#FEF3C7');
                      setTextColorScheme(data.cardSettings.textColorScheme || 'dark');
                      setLogoUrl(data.cardSettings.logoUrl || '');
                  } else {
                      setBusinessName(data.name || '');
                  }
              }
          } catch (error) {
              console.error("Failed to fetch business data", error);
              showToast('Error al cargar los datos de la tarjeta.', 'error');
          } finally {
              setIsLoadingData(false);
          }
      };

      fetchBusinessData();
  }, [user]);

  const publicCardUrl = slug ? `${window.location.origin}${window.location.pathname}#/view/${slug}` : '';

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateCardSettings(user.uid, {
            name: businessName,
            reward: rewardText,
            color: cardColor,
            textColorScheme: textColorScheme,
            logoUrl: logoUrl
        });
        showToast('¡Cambios guardados con éxito!', 'success');
    } catch (error) {
        console.error("Failed to save settings", error);
        showToast('No se pudieron guardar los cambios.', 'error');
    } finally {
        setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicCardUrl).then(() => {
        setCopied(true);
        showToast('¡URL copiada al portapapeles!', 'success');
        setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoadingData) {
      return (
          <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                <span className="sr-only">Cargando...</span>
              </div>
          </div>
      );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Editor Controls */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Link
                to="/app/dashboard"
                className="inline-flex items-center justify-center p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                title="Volver al Dashboard"
            >
                <ArrowLeftIcon />
            </Link>
            <h1 className="text-3xl font-bold text-black tracking-tight">Editor de Tarjeta</h1>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
          <div>
            <label htmlFor="businessName" className="block text-base font-medium text-gray-700 mb-1">
              Nombre del Negocio
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="logoUrl" className="block text-base font-medium text-gray-700 mb-1">
              URL del Logo (Opcional)
            </label>
            <input
              id="logoUrl"
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          <div>
            <label htmlFor="rewardText" className="block text-base font-medium text-gray-700 mb-1">
              Texto de la Recompensa
            </label>
            <input
              id="rewardText"
              type="text"
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
            />
          </div>
          <div>
            <label htmlFor="cardColorHex" className="block text-base font-medium text-gray-700 mb-1">
                Color de Fondo
            </label>
            <div className="mt-1 flex items-center gap-3">
                <div className="relative w-12 h-10">
                    <div 
                        className="w-full h-full rounded-md border border-gray-300"
                        style={{ backgroundColor: cardColor }}
                    ></div>
                    <input
                        type="color"
                        value={cardColor}
                        onChange={(e) => setCardColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Seleccionar un color"
                    />
                </div>
                <input
                    id="cardColorHex"
                    type="text"
                    value={cardColor.toUpperCase()}
                    onChange={(e) => setCardColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                    aria-label="Código de color hexadecimal"
                />
            </div>
          </div>
           <div>
            <label className="block text-base font-medium text-gray-700 mb-1">
              Patrón de color del texto
            </label>
            <div className="mt-1 grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-md">
                <button
                    onClick={() => setTextColorScheme('dark')}
                    className={`px-3 py-1.5 text-base font-medium rounded-md transition-colors ${
                        textColorScheme === 'dark' ? 'bg-white shadow-sm text-black' : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    Oscuro
                </button>
                <button
                    onClick={() => setTextColorScheme('light')}
                    className={`px-3 py-1.5 text-base font-medium rounded-md transition-colors ${
                        textColorScheme === 'light' ? 'bg-white shadow-sm text-black' : 'text-gray-600 hover:bg-white/50'
                    }`}
                >
                    Claro
                </button>
            </div>
          </div>
           <div>
            <label htmlFor="stamps" className="block text-base font-medium text-gray-700 mb-1">
              Sellos de Muestra ({stamps})
            </label>
            <input
              id="stamps"
              type="range"
              min="0"
              max="10"
              value={stamps}
              onChange={(e) => setStamps(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00AA00]"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-2.5 px-4 font-semibold text-white rounded-md transition-colors bg-black hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Comparte con tus clientes</h3>
          <div>
              <p className="text-base text-gray-600 mb-2">
                  Tus clientes pueden usar el siguiente enlace para unirse.
              </p>
              <div className="flex items-center">
                  <input 
                      type="text" 
                      readOnly 
                      value={publicCardUrl}
                      className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-base text-gray-700 focus:outline-none"
                  />
                  <button
                      onClick={handleCopyUrl}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors flex items-center"
                      title="Copiar URL"
                  >
                      {copied ? <CheckIconSuccess /> : <CopyIcon />}
                  </button>
              </div>
               <a
                    href={publicCardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                    <ExternalLinkIcon />
                    Ver Registro
                </a>
          </div>
        </div>
      </div>
      
      {/* Card Preview */}
      <div className="lg:sticky lg:top-8 h-full">
         <h2 className="text-xl font-bold text-black mb-4 text-center">Previsualización</h2>
         <CardPreview 
            businessName={businessName}
            rewardText={rewardText}
            cardColor={cardColor}
            stamps={stamps}
            textColorScheme={textColorScheme}
            logoUrl={logoUrl}
         />
      </div>
    </div>
  );
};

export default CardEditorPage;
