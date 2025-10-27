import React from 'react';

interface CardPreviewProps {
  businessName: string;
  rewardText: string;
  cardColor: string;
  stamps: number;
  textColorScheme: 'dark' | 'light';
  logoUrl?: string;
  customerName?: string;
  customerPhone?: string;
}

const StarIcon: React.FC = () => (
    <svg className="w-6 h-6 text-[#FFC700]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);


const CardPreview: React.FC<CardPreviewProps> = ({ businessName, rewardText, cardColor, stamps, textColorScheme, logoUrl, customerName, customerPhone }) => {
  const totalStamps = 10;
  const isRewardReady = stamps >= totalStamps;

  const isLight = textColorScheme === 'light';
  const primaryTextColor = isLight ? 'text-white' : 'text-black';
  const secondaryTextColor = isLight ? 'text-white/80' : 'text-gray-700';
  const logoTextColor = isLight ? 'text-white opacity-50' : 'text-black opacity-50';
  const logoBgColor = isLight ? 'bg-white/20' : 'bg-black/10';
  const filledStampBgColor = isLight ? 'bg-white' : 'bg-black';
  const unfilledStampBgColor = 'bg-white/30';

  return (
    <div className="w-full max-w-sm mx-auto font-sans shadow-lg rounded-lg overflow-hidden">
      <div 
        className="p-6 transition-colors duration-300" 
        style={{ backgroundColor: cardColor }}
      >
        <div className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden ${logoBgColor} transition-colors`}>
                {logoUrl ? (
                    <img src={logoUrl} alt={`${businessName} logo`} className="w-full h-full object-cover" />
                ) : (
                    <span className={`text-2xl font-bold ${logoTextColor} transition-colors`}>L</span>
                )}
            </div>
            <h2 className={`text-2xl font-bold truncate ${primaryTextColor} transition-colors`}>{businessName || 'Nombre del Negocio'}</h2>
            <p className={`text-base mt-2 ${secondaryTextColor} transition-colors`}>
                {stamps}/{totalStamps} Sellos para tu próxima recompensa
            </p>
        </div>

        {customerName && customerPhone && (
            <div className="text-center pt-4 -mb-2 sm:-mb-2">
                <p className={`text-sm font-medium truncate ${primaryTextColor}`}>{customerName}</p>
                <p className={`text-xs ${secondaryTextColor}`}>{customerPhone}</p>
            </div>
        )}

        <div className="grid grid-cols-5 gap-3 sm:gap-4 my-6 sm:my-8">
            {Array.from({ length: totalStamps }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full flex items-center justify-center transition-all duration-300 ${
                        index < stamps ? filledStampBgColor : unfilledStampBgColor
                    }`}
                >
                    {index < stamps && <StarIcon />}
                </div>
            ))}
        </div>
      </div>
      
      <div className="bg-white p-6 border-t border-gray-200">
        {isRewardReady ? (
            <div>
                <p className="text-center font-bold text-lg text-[#00AA00]">
                    ¡Felicidades! ya tienes:
                </p>
                <p className="text-center font-semibold text-gray-800 mt-1">
                    {rewardText}
                </p>
            </div>
        ) : (
             <div>
                <p className="text-center text-base text-gray-600">
                    Tu próxima Recompensa:
                </p>
                <p className="text-center font-semibold text-gray-800 mt-1">
                    {rewardText}
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;