import React from 'react';

interface CardPreviewProps {
  businessName: string;
  rewardText: string;
  cardColor: string;
  stamps: number;
  textColorScheme: 'dark' | 'light';
}

const CheckIcon: React.FC = () => (
    <svg className="w-4 h-4 text-[#00AA00]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);


const CardPreview: React.FC<CardPreviewProps> = ({ businessName, rewardText, cardColor, stamps, textColorScheme }) => {
  const totalStamps = 10;
  const isRewardReady = stamps >= totalStamps;

  const isLight = textColorScheme === 'light';
  const primaryTextColor = isLight ? 'text-white' : 'text-black';
  const secondaryTextColor = isLight ? 'text-white/80' : 'text-gray-700';
  const logoTextColor = isLight ? 'text-white opacity-50' : 'text-black opacity-50';
  const logoBgColor = isLight ? 'bg-white/20' : 'bg-black/10';
  const filledStampBgColor = isLight ? 'bg-white' : 'bg-black';
  const unfilledStampBgColor = isLight ? 'bg-white/30' : 'bg-gray-200';

  return (
    <div className="w-full max-w-sm mx-auto font-sans shadow-lg rounded-lg overflow-hidden">
      <div 
        className="p-6 transition-colors duration-300" 
        style={{ backgroundColor: cardColor }}
      >
        <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${logoBgColor} transition-colors`}>
                <span className={`text-2xl font-bold ${logoTextColor} transition-colors`}>L</span>
            </div>
            <h2 className={`text-2xl font-bold truncate ${primaryTextColor} transition-colors`}>{businessName || 'Nombre del Negocio'}</h2>
            <p className={`text-base mt-2 ${secondaryTextColor} transition-colors`}>
                {stamps}/{totalStamps} Sellos para tu próxima recompensa
            </p>
        </div>

        <div className="grid grid-cols-5 gap-3 sm:gap-4 my-6 sm:my-8">
            {Array.from({ length: totalStamps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        index < stamps ? filledStampBgColor : unfilledStampBgColor
                    }`}
                >
                    {index < stamps && <CheckIcon />}
                </div>
            ))}
        </div>
      </div>
      
      <div 
          className="relative bg-white p-6"
          style={{
            maskImage: 'radial-gradient(circle at 0 0.75rem, transparent 0, transparent 0.5rem, black 0.5rem), radial-gradient(circle at 100% 0.75rem, transparent 0, transparent 0.5rem, black 0.5rem)',
            maskSize: '51% 1.5rem',
            maskPosition: '0 0, 100% 0',
            maskRepeat: 'no-repeat',
          }}
      >
        <div className="absolute -top-[1.5px] left-0 right-0 h-[3px] bg-transparent" style={{
          backgroundImage: 'linear-gradient(to right, #9ca3af 60%, rgba(255,255,255,0) 0%)',
          backgroundSize: '10px 3px',
          backgroundRepeat: 'repeat-x'
        }}></div>

        {isRewardReady ? (
            <div>
                <p className="text-center font-bold text-lg text-[#00AA00]">
                    ¡Felicidades! ya tienes:
                </p>
                <p className="text-center font-semibold text-gray-800 mt-1">
                    {rewardText || 'Tu Recompensa'}
                </p>
            </div>
        ) : (
             <div>
                <p className="text-center text-base text-gray-600">
                    Tu próxima Recompensa:
                </p>
                <p className="text-center font-semibold text-gray-800 mt-1">
                    {rewardText || 'Tu Recompensa'}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;