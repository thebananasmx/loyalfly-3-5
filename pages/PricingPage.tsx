
import React from 'react';
import { Link } from 'react-router-dom';

const CheckIcon = () => <svg className="w-5 h-5 text-[#00AA00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>;

interface PricingCardProps {
  plan: string;
  price: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, price, description, features, isFeatured = false }) => {
  const cardClasses = `border rounded-lg p-6 sm:p-8 flex flex-col h-full ${isFeatured ? 'border-[#00AA00] border-2' : 'border-gray-200'}`;
  const buttonClasses = `w-full mt-8 py-3 font-semibold rounded-md transition-colors text-center ${isFeatured ? 'bg-[#00AA00] text-white hover:bg-opacity-90' : 'bg-black text-white hover:bg-gray-800'}`;

  return (
    <div className={cardClasses}>
      <h3 className="text-lg font-semibold text-black">{plan}</h3>
      <p className="mt-4 text-4xl font-bold text-black">{price}</p>
      <p className="mt-2 text-gray-600">{description}</p>
      <ul className="mt-6 space-y-4 text-gray-600 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link to="/register" className={buttonClasses}>
        Empezar
      </Link>
    </div>
  );
};


const PricingPage: React.FC = () => {
    return (
        <div className="py-16 sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Planes simples y transparentes</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        Elige el plan que se adapte al tamaño de tu negocio. Sin contratos, cancela cuando quieras.
                    </p>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
                    <PricingCard 
                        plan="Gratis"
                        price="$0"
                        description="Para empezar y probar."
                        features={[
                            'Hasta 10 clientes',
                            'Tarjeta de lealtad digital',
                            'Personalización básica'
                        ]}
                    />
                    <PricingCard 
                        plan="Entrepreneur"
                        price="$29"
                        description="Ideal para negocios en crecimiento."
                        features={[
                            'Hasta 100 clientes',
                            'Tarjeta de lealtad digital',
                            'Personalización completa',
                            'Soporte por email'
                        ]}
                        isFeatured={true}
                    />
                    <PricingCard 
                        plan="Pro"
                        price="$99"
                        description="Para negocios establecidos."
                        features={[
                            'Clientes ilimitados',
                            'Tarjeta de lealtad digital',
                            'Personalización completa',
                            'Soporte prioritario'
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default PricingPage;