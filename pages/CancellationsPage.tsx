import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CancellationsPage: React.FC = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('legal.cancellations')} | Loyalfly`;
  }, [t]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-black mb-6 tracking-tight">{t('legal.cancellationsTitle')}</h1>
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p className='text-sm text-gray-500'>{t('legal.lastUpdated')}: 20 de Enero de 2026</p>
        
        <section>
            <h2 className="text-xl font-semibold text-black mb-3">¿Cómo puedo cancelar mi suscripción?</h2>
            <p>
                {t('legal.cancellationsIntro')}
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{t('legal.cancellationsEmailProcess')}</li>
                <li>{t('legal.cancellationsEmailAddress')}: <a href="mailto:hector@thebananas.com.mx" className="text-[#4D17FF] font-bold underline">hector@thebananas.com.mx</a></li>
                <li>{t('legal.cancellationsDetail')}</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.cancellationsTimeframeTitle')}</h2>
            <p>
                {t('legal.cancellationsTimeframeDesc')}
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.cancellationsAccessTitle')}</h2>
            <p>
                {t('legal.cancellationsAccessDesc')}
            </p>
        </section>
      </div>
    </div>
  );
};

export default CancellationsPage;