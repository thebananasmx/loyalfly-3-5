import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RefundsPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('legal.refunds')} | Loyalfly`;
  }, [t]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-black mb-6 tracking-tight">{t('legal.refundsTitle')}</h1>
      <div className="prose prose-lg text-gray-700 space-y-6">
        <p className='text-sm text-gray-500'>{t('legal.lastUpdated')}: 20 de Enero de 2026</p>
        
        <p>
            {t('legal.refundsIntro')}
        </p>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.refundsGuaranteeTitle')}</h2>
            <p>
                {t('legal.refundsGuaranteeDesc1')}
            </p>
            <p className="mt-4">
                {t('legal.refundsGuaranteeDesc2')}
            </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-black mb-3 text-red-600">{t('legal.refundsNoteTitle')}</h2>
            <ul className="list-disc list-inside space-y-2">
                <li>{t('legal.refundsNoteItem1')}</li>
                <li>{t('legal.refundsNoteItem2')}</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.refundsExceptionsTitle')}</h2>
            <p>
                {t('legal.refundsExceptionsDesc')}
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
                <li>{t('legal.refundsExceptionsItem1')}</li>
                <li>{t('legal.refundsExceptionsItem2')}</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-black mb-3">{t('legal.refundsContactTitle')}</h2>
            <p>
                {t('legal.refundsContactDesc')} <a href="mailto:hector@thebananas.com.mx" className="text-[#4D17FF] font-bold underline">hector@thebananas.com.mx</a>.
            </p>
        </section>
      </div>
    </div>
  );
};

export default RefundsPage;