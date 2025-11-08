

import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-base text-gray-500">&copy; {new Date().getFullYear()} Loyalfly. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terminos" className="text-base text-gray-500 hover:text-black transition-colors">Términos de Servicio</Link>
            <Link to="/pricing" className="text-base text-gray-500 hover:text-black transition-colors">Precios</Link>
            <Link to="/blog" className="text-base text-gray-500 hover:text-black transition-colors">Blog</Link>
            <Link to="/docs/style-guide" className="text-base text-gray-500 hover:text-black transition-colors">Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;