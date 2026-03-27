import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CheckIcon = () => <svg className="w-5 h-5 text-[#00AA00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;

interface PricingCardProps {
  plan: string;
  price: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  isContact?: boolean;
  stripeLink?: string;
  buttonText: string;
  discountInfo?: React.ReactNode;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, description, features, isFeatured = false, isContact = false, stripeLink, buttonText, discountInfo }) => {
  const cardClasses = `border rounded-lg p-6 sm:p-8 flex flex-col h-full ${isFeatured ? 'border-[#4D17FF] border-2' : 'border-gray-200'}`;
  const buttonClasses = `w-full mt-8 py-3 font-semibold rounded-md transition-colors text-center ${isFeatured ? 'bg-[#4D17FF] text-white hover:bg-opacity-90' : 'bg-black text-white hover:bg-gray-800'}`;

  const renderButton = () => {
    if (stripeLink) {
      return (
        <a href={stripeLink} target="_blank" rel="noopener noreferrer" className={buttonClasses}>
          {buttonText}
        </a>
      );
    }
    if (isContact) {
      return (
        <a href="mailto:hector@thebananas.com.mx" className={buttonClasses}>
          {buttonText}
        </a>
      );
    }
    return (
      <Link to="/register" className={buttonClasses}>
        {buttonText}
      </Link>
    );
  };

  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-semibold text-black">{plan}</h3>
      <div className="mt-4">
        <p className="text-4xl font-bold text-black">{price}</p>
        {discountInfo && (
          <div className="mt-2">
            {discountInfo}
          </div>
        )}
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
      <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {renderButton()}
    </div>
  );
};


const PricingPage: React.FC = () => {
    const { t } = useTranslation();
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

    useEffect(() => {
        document.title = 'Loyalfly';
        
        // Canonical tag logic
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', 'https://loyalfly.com.mx/pricing');
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', 'https://loyalfly.com.mx/pricing');
          document.head.appendChild(canonical);
        }
    }, []);

    return (
        <div className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">{t('pricing.title')}</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        {t('pricing.subtitle')}
                    </p>

                    {/* Billing Cycle Switch */}
                    <div className="mt-10 flex justify-center">
                        <div className="bg-gray-100 p-1 rounded-xl flex items-center shadow-inner">
                            <button 
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Mensual
                            </button>
                            <button 
                                onClick={() => setBillingCycle('annual')}
                                className={`px-8 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${billingCycle === 'annual' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Anual
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
                    <PricingCard 
                        plan={t('pricing.free.name')}
                        price="$0"
                        description={t('pricing.free.desc')}
                        buttonText={t('pricing.cta.start')}
                        features={[
                            t('pricing.features.customers100'),
                            t('pricing.features.digitalCard'),
                            t('pricing.features.basicCustom')
                        ]}
                    />
                    <PricingCard 
                        plan={t('pricing.entrepreneur.name')}
                        price={billingCycle === 'monthly' ? "$299 / mes" : "$2,870 / año"}
                        description={t('pricing.entrepreneur.desc')}
                        buttonText={t('pricing.cta.subscribe')}
                        features={[
                            t('pricing.features.customers1000'),
                            t('pricing.features.digitalCard'),
                            t('pricing.features.stampsCustomization'),
                            t('pricing.features.removeBranding'),
                            "Descarga a Wallet Apple y Google",
                            t('pricing.features.emailSupport')
                        ]}
                        isFeatured={true}
                        stripeLink={billingCycle === 'monthly' ? "https://buy.stripe.com/3cI6oI2dX1Rrfpy9XP5c400" : "https://buy.stripe.com/eVq9AU5q9dA9fpy0nf5c402"}
                        discountInfo={billingCycle === 'annual' ? (
                            <p className="text-sm text-gray-500">
                                <span className="text-red-600 font-bold">20% DE DESCUENTO</span>
                                <br />
                                DE: <span className="line-through">3,588 MXN</span> A $2,870
                            </p>
                        ) : undefined}
                    />
                    <PricingCard 
                        plan={t('pricing.pro.name')}
                        price="Cotiza hoy"
                        description={t('pricing.pro.desc')}
                        buttonText={t('pricing.cta.contact')}
                        features={[
                            t('pricing.features.customersUnlimited'),
                            t('pricing.features.digitalCard'),
                            t('pricing.features.fullCustom'),
                            t('pricing.features.removeBranding'),
                            "Descarga a Wallet Apple y Google",
                            t('pricing.features.prioritySupport')
                        ]}
                        isContact={true}
                    />
                </div>

                {/* Promo Banner (Downsell) */}
                <div className="mt-20 max-w-5xl mx-auto border-[#4D17FF] border-2 rounded-lg p-6 sm:p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                    <div className="flex-grow">
                        <div className="inline-block px-3 py-1 bg-[#4D17FF] text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">
                            ⭐ Oferta de Lanzamiento
                        </div>
                        <h3 className="text-2xl font-bold text-black">Promo Entrepreneur</h3>
                        <p className="mt-2 text-gray-600 text-base leading-relaxed max-w-xl">
                            ¿Aún lo estás pensando? Digitaliza tu programa de lealtad hoy mismo con todas las herramientas premium por un precio especial de bienvenida.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end shrink-0">
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-[#4D17FF]">$99</span>
                            <span className="text-gray-500 font-medium">MXN</span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter mb-4">AL MES POR LOS PRIMEROS TRES MESES</p>
                        <a 
                            href="https://buy.stripe.com/3cI6oI2dX1Rrfpy9XP5c400?prefilled_promo_code=3x99" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-12 py-3 font-semibold text-white bg-[#4D17FF] rounded-md hover:bg-opacity-90 transition-colors text-center"
                        >
                            Suscríbete ahora
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;