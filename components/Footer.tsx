import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-200 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Usamos items-start para alinear todos los bloques al TOP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
          
          {/* Bloque 1: Navegación */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-2">{t('footer.docs')} & Info</h4>
            <Link to="/terminos" className="text-base text-gray-500 hover:text-black transition-colors">{t('footer.terms')}</Link>
            <Link to="/pricing" className="text-base text-gray-500 hover:text-black transition-colors">{t('footer.pricing')}</Link>
            <Link to="/blog" className="text-base text-gray-500 hover:text-black transition-colors">{t('footer.blog')}</Link>
            <Link to="/docs/style-guide" className="text-base text-gray-500 hover:text-black transition-colors">Guía de Estilo</Link>
          </div>

          {/* Bloque 2: Badge Stripe */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-3">
              <img 
                src="https://res.cloudinary.com/dg4wbuppq/image/upload/v1770771936/Powered_by_Stripe_-_black_xt4ja3.svg" 
                alt="Powered by Stripe - Pagos Seguros" 
                className="h-8 w-auto"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Procesamiento de pagos seguro</p>
            </div>
          </div>

          {/* Bloque 3: Leyenda Legal */}
          <div className="md:text-right">
            <p className="text-base text-gray-500">
              &copy; {new Date().getFullYear()} Loyalfly.<br />
              <span className="text-sm opacity-80">{t('footer.rights')}</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;