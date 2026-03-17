import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

const CancellationsPage: React.FC = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = `${t('legal.cancellations')} | Loyalfly`;
    
    // Canonical tag logic
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', 'https://loyalfly.com.mx/terminos/cancelaciones');
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', 'https://loyalfly.com.mx/terminos/cancelaciones');
      document.head.appendChild(canonical);
    }
  }, [t]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-black mb-6 tracking-tight">{t('legal.cancellationsTitle')}</h1>
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p className='text-sm text-gray-500'>{t('legal.lastUpdated')}: 17 de Marzo de 2026</p>
        
        <section>
            <h2 className="text-xl font-semibold text-black mb-3">¿Cómo puedo cancelar mi suscripción?</h2>
            <p>
                {t('legal.cancellationsIntro')}
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.cancellationsTimeframeTitle')}</h2>
            <p>
                <Trans i18nKey="legal.cancellationsTimeframeDesc">
                    Si en 24hrs el cambio de tu plan no se ha ejecutado nos contactes al email <a href="mailto:contacto@loyalfly.com.mx" className="text-[#4D17FF] font-bold underline">contacto@loyalfly.com.mx</a> con el asunto cancelacion, Recibirá una confirmación por la misma vía una vez que la suscripción haya sido dada de baja.
                </Trans>
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