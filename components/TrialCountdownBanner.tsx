import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, ArrowRight } from 'lucide-react';

interface TrialCountdownBannerProps {
    trialEndDate: any; // Firebase Timestamp
}

const TrialCountdownBanner: React.FC<TrialCountdownBannerProps> = ({ trialEndDate }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!trialEndDate) return 0;
            const end = trialEndDate.toDate ? trialEndDate.toDate().getTime() : new Date(trialEndDate).getTime();
            const now = new Date().getTime();
            const diff = end - now;
            return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 3600000); // Update every hour

        return () => clearInterval(timer);
    }, [trialEndDate]);

    if (timeLeft <= 0) return null;

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#4D17FF] text-white py-3 px-4 sm:px-6 shadow-lg relative overflow-hidden"
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                        <Clock className="h-5 w-5" />
                    </div>
                    <p className="text-sm sm:text-base font-semibold">
                        Te quedan <span className="bg-white text-[#4D17FF] px-2 py-0.5 rounded-md mx-1">{timeLeft}</span> días de tu prueba gratuita de plan Entrepreneur
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <a
                        href="https://buy.stripe.com/3cI6oI2dX1Rrfpy9XP5c400"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-[#4D17FF] px-5 py-1.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-all flex items-center space-x-2 group"
                    >
                        <span>Inicia tu suscripción Entrepreneur</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default TrialCountdownBanner;
