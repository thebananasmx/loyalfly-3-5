import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


const NavItem: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-base font-medium transition-colors ${
          isActive ? 'text-black' : 'text-gray-500 hover:text-black'
        }`
      }
    >
      {children}
    </NavLink>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" onClick={closeMenu} className="text-xl font-bold tracking-tight text-black">
            Loyalfly
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-6">
              <NavItem to="/pricing">Precios</NavItem>
              <NavItem to="/terminos">Términos</NavItem>
            </nav>
            <div className="flex items-center space-x-4 ml-6">
                <Link 
                  to="/login" 
                  className="text-base font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-base font-medium text-white bg-[#4D17FF] rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Registrarse
                </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Abrir menú" className="p-2 -mr-2">
              {isMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg">
          <div className="flex flex-col px-4 pt-2 pb-4 space-y-4">
            <NavItem to="/pricing" onClick={closeMenu}>Precios</NavItem>
            <NavItem to="/terminos" onClick={closeMenu}>Términos</NavItem>
            <hr/>
            <Link 
              to="/login"
              onClick={closeMenu}
              className="px-4 py-2 text-center text-base font-medium text-gray-600 bg-gray-100 rounded-md hover:text-black hover:bg-gray-200 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register"
              onClick={closeMenu} 
              className="px-4 py-2 text-center text-base font-medium text-white bg-[#4D17FF] rounded-md hover:bg-opacity-90 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;