import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBusinessIdBySlug, getScannerBusinessData, getCustomerById, addStampToCustomer, redeemRewardForCustomer } from '../services/firebaseService';
import type { Business, Customer } from '../types';
import { Html5Qrcode } from 'html5-qrcode';
import { CheckCircle } from 'lucide-react';

type ScannerState = 'LOCKED' | 'IDLE' | 'SCANNING' | 'CUSTOMER_VIEW' | 'SUCCESS';

const ScannerModePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const [businessId, setBusinessId] = useState<string | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // States
    const [scannerState, setScannerState] = useState<ScannerState>('LOCKED');
    const [pinInput, setPinInput] = useState('');
    const [pinError, setPinError] = useState(false);
    
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [purchaseAmount, setPurchaseAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchBusiness = async () => {
            if (!slug) {
                setError("Slug no proporcionado");
                setLoading(false);
                return;
            }
            try {
                const bId = await getBusinessIdBySlug(slug);
                if (!bId) {
                    setError("Negocio no encontrado");
                    setLoading(false);
                    return;
                }
                setBusinessId(bId);
                const data = await getScannerBusinessData(bId);
                setBusiness(data);
                
                if (!data?.scannerPin) {
                    setError("Consulta a tu Administrador para configurar el PIN de Escáner");
                } else {
                    // Check local storage for existing valid session
                    const savedAuth = localStorage.getItem(`scanner_auth_${bId}`);
                    if (savedAuth) {
                        try {
                            const parsedAuth = JSON.parse(savedAuth);
                            if (parsedAuth.pin === data.scannerPin && parsedAuth.expiresAt > Date.now()) {
                                setScannerState('IDLE');
                            }
                        } catch (e) {
                            console.error("Error parsing saved auth", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching business:", error);
                setError("Error al cargar el negocio");
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [slug]);

    useEffect(() => {
        if (scannerState !== 'SCANNING' || !businessId) return;

        const qrReaderId = "qr-reader-scan-mode";
        const html5QrCode = new Html5Qrcode(qrReaderId);

        const qrCodeSuccessCallback = async (decodedText: string) => {
            try {
                if (html5QrCode.isScanning) {
                    await html5QrCode.stop();
                }
            } catch (err) {
                console.warn("QR scanner failed to stop gracefully.", err);
            }
            
            try {
                const cust = await getCustomerById(businessId, decodedText);
                if (cust) {
                    setCustomer(cust);
                    setScannerState('CUSTOMER_VIEW');
                } else {
                    alert('Cliente no encontrado con este código QR.');
                    setScannerState('IDLE');
                }
            } catch (err) {
                alert('Error al buscar cliente.');
                setScannerState('IDLE');
            }
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };
        
        html5QrCode.start(
            { facingMode: "environment" },
            config,
            qrCodeSuccessCallback,
            () => {} 
        ).catch((err) => {
            alert('No se pudo iniciar el escáner. Revisa los permisos de la cámara.');
            console.error("Unable to start scanning.", err);
            setScannerState('IDLE');
        });

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(err => console.warn("QR scanner failed to stop on cleanup.", err));
            }
        };
    }, [scannerState, businessId]);

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
        setPinInput('');
        setPinError(false);
    };

    const verifyPin = (pinToVerify: string) => {
        if (business?.scannerPin === pinToVerify) {
            setScannerState('IDLE');
            setPinInput('');
            
            // Save to local storage for 24 hours
            if (businessId) {
                localStorage.setItem(`scanner_auth_${businessId}`, JSON.stringify({
                    pin: pinToVerify,
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours in ms
                }));
            }
        } else {
            setPinError(true);
            setTimeout(() => setPinInput(''), 500);
        }
    };

    const handleManualLock = () => {
        if (businessId) {
            localStorage.removeItem(`scanner_auth_${businessId}`);
        }
        setScannerState('LOCKED');
    };

    const handleAddStamp = async () => {
        if (!businessId || !customer) return;
        setIsProcessing(true);
        try {
            const amount = purchaseAmount ? parseFloat(purchaseAmount) : undefined;
            await addStampToCustomer(businessId, customer.id, 1, amount);
            setSuccessMessage('¡Sello agregado con éxito!');
            setScannerState('SUCCESS');
            setTimeout(() => {
                setScannerState('IDLE');
                setCustomer(null);
                setPurchaseAmount('');
            }, 2000);
        } catch (error) {
            alert('Error al agregar sello');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRedeem = async () => {
        if (!businessId || !customer) return;
        setIsProcessing(true);
        try {
            await redeemRewardForCustomer(businessId, customer.id);
            setSuccessMessage('¡Recompensa redimida con éxito!');
            setScannerState('SUCCESS');
            setTimeout(() => {
                setScannerState('IDLE');
                setCustomer(null);
                setPurchaseAmount('');
            }, 2000);
        } catch (error) {
            alert('Error al redimir recompensa');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (scannerState === 'LOCKED') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-xs flex flex-col items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Modo Escáner</h1>
                    <p className="text-gray-500 mb-10 text-center">Ingresa el PIN de {business?.name}</p>

                    <div className="flex gap-6 mb-12">
                        {[0, 1, 2, 3].map(i => (
                            <div 
                                key={i} 
                                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                                    pinInput.length > i 
                                        ? 'bg-gray-400 border-gray-400' 
                                        : 'bg-transparent border-gray-300'
                                } ${pinError ? 'border-red-500 bg-red-500' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-x-6 gap-y-5 w-full">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                            <button
                                key={num}
                                onClick={() => handlePinPress(num.toString())}
                                className="w-20 h-20 rounded-full bg-gray-50/80 text-3xl font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center mx-auto transition-all duration-150 active:scale-95"
                            >
                                {num}
                            </button>
                        ))}
                        <div className="w-20 h-20"></div>
                        <button
                            onClick={() => handlePinPress('0')}
                            className="w-20 h-20 rounded-full bg-gray-50/80 text-3xl font-semibold text-gray-900 hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center mx-auto transition-all duration-150 active:scale-95"
                        >
                            0
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-gray-400 hover:text-gray-600 active:scale-90 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (scannerState === 'IDLE') {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
                {business?.scannerPin && (
                    <button 
                        onClick={handleManualLock}
                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
                        title="Bloquear pantalla"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </button>
                )}

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
                        onClick={() => setScannerState('SCANNING')}
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
    }

    if (scannerState === 'SCANNING') {
        return (
            <div className="min-h-screen bg-black flex flex-col relative">
                <button 
                    onClick={() => setScannerState('IDLE')}
                    className="absolute top-6 right-6 z-10 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-white text-xl font-semibold mb-6">Escanea el código QR</h2>
                    <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-2xl overflow-hidden relative">
                        <div id="qr-reader-scan-mode" className="w-full h-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (scannerState === 'CUSTOMER_VIEW' && customer) {
        const stampsNeeded = business?.cardSettings?.stampsGoal || 10;
        const canRedeem = customer.stamps >= stampsNeeded;

        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="p-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Cliente</h2>
                        <button 
                            onClick={() => {
                                setScannerState('IDLE');
                                setCustomer(null);
                                setPurchaseAmount('');
                            }}
                            className="text-gray-400 hover:text-gray-600 p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-900">{customer.name}</h3>
                                <p className="text-lg text-gray-500">{customer.phone}</p>
                            </div>
                        </div>

                        <div className="mb-10 text-center">
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Sellos Acumulados</p>
                            <div className="text-6xl font-black text-gray-900">
                                {customer.stamps} <span className="text-2xl text-gray-300 font-medium">/ {stampsNeeded}</span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Monto de compra (Opcional)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-400 text-lg">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={purchaseAmount}
                                        onChange={(e) => setPurchaseAmount(e.target.value)}
                                        className="block w-full pl-10 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4D17FF] text-xl font-medium"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddStamp}
                                disabled={isProcessing}
                                className="w-full py-5 bg-[#4D17FF] text-white text-xl font-bold rounded-2xl shadow-lg shadow-[#4D17FF]/20 hover:bg-[#3a11cc] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isProcessing ? 'Procesando...' : '+ Sello'}
                            </button>

                            {canRedeem && (
                                <button
                                    onClick={handleRedeem}
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-emerald-500 text-white text-xl font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Redimir Recompensa
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (scannerState === 'SUCCESS') {
        return (
            <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <CheckCircle className="w-32 h-32 text-white mb-6" />
                <h1 className="text-4xl font-bold text-white mb-2">{successMessage}</h1>
            </div>
        );
    }

    return null;
};

export default ScannerModePage;
