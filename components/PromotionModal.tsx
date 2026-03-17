import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, ArrowRight } from 'lucide-react';
import type { PromotionSettings } from '../types';

interface PromotionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onActivate: () => void;
    settings: PromotionSettings;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onClose, onActivate, settings }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header Image / Icon */}
                        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#4D17FF] to-[#7B52FF] flex items-center justify-center overflow-hidden">
                            {settings.imageUrl ? (
                                <img 
                                    src={settings.imageUrl} 
                                    alt="Promoción" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="flex flex-col items-center text-white">
                                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-md mb-3">
                                        <Gift className="h-12 w-12" />
                                    </div>
                                    <Sparkles className="h-6 w-6 animate-pulse" />
                                </div>
                            )}
                            
                            {/* Close Button */}
                            <button 
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Text Content */}
                        <div className="p-6 sm:p-8 text-center space-y-4">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                {settings.title}
                            </h2>
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                                {settings.message}
                            </p>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={onActivate}
                                    className="w-full py-4 bg-[#4D17FF] text-white font-bold rounded-2xl hover:bg-[#3D12CC] transition-all shadow-lg shadow-[#4D17FF]/25 flex items-center justify-center space-x-2 group"
                                >
                                    <span>Activar mi prueba de 30 días</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                                >
                                    Quizás más tarde
                                </button>
                            </div>
                        </div>

                        {/* Footer Badge */}
                        <div className="bg-gray-50 py-3 px-6 text-center border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Oferta por tiempo limitado
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromotionModal;
