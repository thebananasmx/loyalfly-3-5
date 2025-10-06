
import React from 'react';

interface CardPreviewProps {
  businessName: string;
  rewardText: string;
  cardColor: string;
  stamps: number;
}

const CheckIcon: React.FC = () => (
    <svg className="w-4 h-4 text-[#00AA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const CardPreview: React.FC<CardPreviewProps> = ({ businessName, rewardText, cardColor, stamps }) => {
  const totalStamps = 10;
  const isRewardReady = stamps >= totalStamps;

  return (
    <div className="w-full max-w-sm mx-auto font-sans shadow-lg rounded-lg overflow-hidden">
      <div 
        className="p-6 transition-colors duration-300" 
        style={{ backgroundColor: cardColor }}
      >
        <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-black bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black opacity-50">L</span>
            </div>
            <h2 className="text-2xl font-bold text-black truncate">{businessName || 'Nombre del Negocio'}</h2>
            <p className="text-base text-gray-700 mt-2">
                {stamps}/{totalStamps} Sellos para tu próxima recompensa
            </p>
        </div>

        <div className="grid grid-cols-5 gap-3 sm:gap-4 my-6 sm:my-8">
            {Array.from({ length: totalStamps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        index < stamps ? 'bg-black' : 'bg-gray-200'
                    }`}
                >
                    {index < stamps && <CheckIcon />}
                </div>
            ))}
        </div>
      </div>
      
      <div 
          className="relative bg-white p-6 text-center"
          style={{
            maskImage: 'radial-gradient(circle at 0 0.5rem, transparent 0, transparent 0.35rem, black 0.35rem), radial-gradient(circle at 100% 0.5rem, transparent 0, transparent 0.35rem, black 0.35rem)',
            maskSize: '50% 1rem',
            maskPosition: '0 0, 100% 0',
            maskRepeat: 'no-repeat',
          }}
      >
        <div className="absolute -top-px left-0 right-0 h-px bg-transparent" style={{
          backgroundImage: 'linear-gradient(to right, #ccc 33%, rgba(255,255,255,0) 0%)',
          backgroundSize: '8px 1px',
          backgroundRepeat: 'repeat-x'
        }}></div>

        {isRewardReady ? (
            <p className="font-bold text-lg text-[#00AA00]">
                ¡Tienes una recompensa activa! Canjear
            </p>
        ) : (
            <p className="font-medium text-gray-800">
                {rewardText || 'Tu Recompensa'}
            </p>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
