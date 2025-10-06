import React, { useState } from 'react';
import CardPreview from '../components/CardPreview';
import QRCode from '../components/QRCode';
import { updateCardSettings } from '../services/firebaseService';

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const CheckIconSuccess = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00AA00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;


const CardEditorPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('Café del Sol');
  const [rewardText, setRewardText] = useState('Café gratis');
  const [cardColor, setCardColor] = useState('#FEF3C7');
  const [textColorScheme, setTextColorScheme] = useState<'dark' | 'light'>('dark');
  const [stamps, setStamps] = useState(4);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const publicCardUrl = `${window.location.origin}${window.location.pathname}#/card/view`;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
        await updateCardSettings({
            name: businessName,
            reward: rewardText,
            color: cardColor
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
        console.error("Failed to save settings", error);
    } finally {
        setIsSaving(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicCardUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Editor Controls */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black tracking-tight">Editor de Tarjeta</h1>
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
            className={`w-full py-2.5 px-4 font-semibold text-white rounded-md transition-colors ${
              saveSuccess 
              ? 'bg-[#00AA00]' 
              : 'bg-black hover:bg-gray-800 disabled:bg-gray-400'
            }`}
          >
            {isSaving ? 'Guardando...' : saveSuccess ? '¡Guardado!' : 'Guardar Cambios'}
          </button>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Comparte tu Tarjeta</h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="p-2 border border-gray-200 rounded-md">
                  <QRCode url={publicCardUrl} />
              </div>
              <div className="flex-1 w-full">
                  <p className="text-base text-gray-600 mb-2">
                      Tus clientes pueden escanear este QR o usar el enlace para unirse.
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
                  {copied && <p className="text-base text-[#00AA00] mt-2 animate-pulse">¡Copiado!</p>}
                   <a
                        href={publicCardUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <ExternalLinkIcon />
                        Ver Tarjeta
                    </a>
              </div>
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
         />
      </div>
    </div>
  );
};

export default CardEditorPage;