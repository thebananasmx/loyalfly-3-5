import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBusinessData } from '../services/firebaseService';
import type { Business } from '../types';
import { useTranslation } from 'react-i18next';

const ScannerModePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    
    // States
    const [isLocked, setIsLocked] = useState(true);
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);

    useEffect(() => {
        const fetchBusiness = async () => {
            if (!user) return;
            try {
                const data = await getBusinessData(user.uid);
                setBusiness(data);
                // If no PIN is configured, we can either force them to set it or just unlock.
                // For security, if no PIN is set, we unlock it but maybe they should set one.
                if (!data?.scannerPin) {
                    setIsLocked(false);
                }
            } catch (error) {
                console.error("Error fetching business:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [user]);

    const handlePinPress = (digit: string) => {
        if (pinInput.length < 4) {
            const newPin = pinInput + digit;
            setPinInput(newPin);
            setPinError(false);

            if (newPin.length === 4) {
                verifyPin(newPin);
            }
        }
    };

    const handleDelete = () => {
        setPinInput(prev => prev.slice(0, -1));
        setPinError(false);
    };

    const verifyPin = (pinToVerify: string) => {
        if (business?.scannerPin === pinToVerify) {
            setIsLocked(false);
            setPinInput('');
        } else {
            setPinError(true);
            setTimeout(() => setPinInput(''), 500);
        }
    };

    const handleExit = () => {
        navigate('/app/dashboard');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    // 1. Locked Screen (Numpad)
    if (isLocked) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Modo Escáner</h1>
                    <p className="text-gray-500 mb-8 text-center">Ingresa tu PIN para desbloquear</p>

                    {/* PIN Dots */}
                    <div className="flex gap-4 mb-8">
                        {[0, 1, 2, 3].map(i => (
                            <div 
                                key={i} 
                                className={`w-4 h-4 rounded-full transition-colors ${
                                    pinInput.length > i ? 'bg-black' : 'bg-gray-200'
                                } ${pinError ? 'bg-red-500' : ''}`}
                            />
                        ))}
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handlePinPress(num.toString())}
                                className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center mx-auto transition-colors"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="w-16 h-16"></div>
                        <button
                            onClick={() => handlePinPress('0')}
                            className="w-16 h-16 rounded-full bg-gray-50 text-2xl font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center mx-auto transition-colors"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-16 h-16 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center mx-auto transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                            </svg>
                        </button>
                    </div>

                    <button 
                        onClick={handleExit}
                        className="mt-12 text-gray-500 hover:text-gray-900 font-medium"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 2. Idle Screen
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
            <button 
                onClick={() => setIsLocked(true)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
                title="Bloquear pantalla"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </button>

            <div className="flex flex-col items-center max-w-md text-center">
                {business?.cardSettings?.logoUrl ? (
                    <img 
                        src={business.cardSettings.logoUrl} 
                        alt={business.name} 
                        className="w-32 h-32 object-contain mb-6"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl font-bold text-gray-400">
                            {business?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{business?.name}</h1>
                <p className="text-xl text-gray-600 mb-12">
                    Pide al cliente su tarjeta digital para otorgar un sello
                </p>

                <button 
                    onClick={() => {
                        // TODO: Implement scanner opening in Step 3
                        alert("Abrir escáner (Paso 3)");
                    }}
                    className="w-full max-w-xs py-4 px-8 bg-black text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h-1m-1-6v1m-1-1h-1m-1 6h1m-1-1v1m0-1h1m4-4h1m-5 5v1m-1-1h1M4 4h4v4H4zm0 12h4v4H4zm12 0h4v4h-4zm0-12h4v4h-4z" />
                    </svg>
                    Escanear QR
                </button>
            </div>
        </div>
    );
};

export default ScannerModePage;
