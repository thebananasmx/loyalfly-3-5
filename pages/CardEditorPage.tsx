
import React, { useState } from 'react';
import CardPreview from '../components/CardPreview';
import { updateCardSettings } from '../services/firebaseService';

const lightColors = [
  '#FFFFFF', '#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE', '#E0E7FF', '#F3E8FF',
];

const CardEditorPage: React.FC = () => {
  const [businessName, setBusinessName] = useState('Café del Sol');
  const [rewardText, setRewardText] = useState('Café gratis');
  const [cardColor, setCardColor] = useState('#FEF3C7');
  const [stamps, setStamps] = useState(4);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Editor Controls */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Editor de Tarjeta</h1>
        <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="rewardText" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo
            </label>
            <div className="flex flex-wrap gap-2">
              {lightColors.map(color => (
                <button
                  key={color}
                  onClick={() => setCardColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${
                    cardColor === color ? 'border-black' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
           <div>
            <label htmlFor="stamps" className="block text-sm font-medium text-gray-700 mb-1">
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
      </div>
      
      {/* Card Preview */}
      <div className="lg:sticky lg:top-8 h-full">
         <h2 className="text-xl font-bold text-black mb-4 text-center">Previsualización</h2>
         <CardPreview 
            businessName={businessName}
            rewardText={rewardText}
            cardColor={cardColor}
            stamps={stamps}
         />
      </div>
    </div>
  );
};

export default CardEditorPage;
