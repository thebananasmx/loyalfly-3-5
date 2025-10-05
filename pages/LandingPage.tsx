import React from 'react';
import { Link } from 'react-router-dom';

const CheckCircleIcon = () => <svg className="w-6 h-6 text-[#00AA00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;


const Feature: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="flex items-start space-x-4">
        <div>
            <CheckCircleIcon />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-black">{title}</h3>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight">
                        Transforma visitantes en clientes fieles.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
                        Loyalfly es la forma más simple y elegante de crear un programa de lealtad digital que tus clientes amarán. Sin tarjetas de plástico, sin complicaciones.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link 
                            to="/pricing"
                            className="px-8 py-3 w-full sm:w-auto text-base md:text-lg font-medium text-white bg-[#00AA00] rounded-md hover:bg-opacity-90 transition-transform hover:scale-105"
                        >
                            Ver Planes
                        </Link>
                        <Link 
                            to="/login"
                            className="px-8 py-3 w-full sm:w-auto text-base md:text-lg font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-transform hover:scale-105"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black">Todo lo que necesitas para crecer</h2>
                        <p className="mt-4 text-gray-600">Simple para ti, mágico para tus clientes.</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                        <Feature 
                            title="100% Digital"
                            description="Tus clientes solo necesitan su número de teléfono. Olvídate de las tarjetas físicas para siempre."
                        />
                        <Feature 
                            title="Fácil de Personalizar"
                            description="Adapta el diseño de tu tarjeta de lealtad con tu marca, colores y recompensas en segundos."
                        />
                        <Feature 
                            title="Análisis Sencillos"
                            description="Visualiza quiénes son tus clientes más leales y entiende su comportamiento de compra."
                        />
                        <Feature 
                            title="Resultados Reales"
                            description="Incrementa la frecuencia de visita y el gasto promedio de tus clientes más valiosos."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
