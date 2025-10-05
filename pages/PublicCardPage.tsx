
import React, { useState } from 'react';
import CardPreview from '../components/CardPreview';

const PublicCardPage: React.FC = () => {
  // Static data for demonstration
  const businessName = 'Café del Sol';
  const rewardText = 'Café gratis';
  const cardColor = '#FEF3C7';

  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userStamps, setUserStamps] = useState(0); // Customer starts with 0 stamps

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userPhone) {
      // In a real app, this would make an API call to register the user
      // and associate them with the business.
      console.log(`Registering ${userName} with phone ${userPhone}`);
      setIsRegistered(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm mx-auto">
        <CardPreview
          businessName={businessName}
          rewardText={rewardText}
          cardColor={cardColor}
          stamps={userStamps}
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
              <h2 className="text-xl font-bold text-black text-center mb-4">Únete al programa de lealtad</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nombre</label>
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
                  <label htmlFor="userPhone" className="block text-sm font-medium text-gray-700">Teléfono</label>
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
