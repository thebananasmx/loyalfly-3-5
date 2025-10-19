import React, { useEffect, useState } from 'react';
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

const slides = [
    {
        industry: "Cafeterías",
        title: "Aroma a lealtad en cada taza.",
        description: "Premia a tus clientes frecuentes con un café gratis y haz que cada visita cuente. Loyalfly es el ingrediente secreto para que vuelvan por más.",
        color: "bg-yellow-100 text-yellow-800"
    },
    {
        industry: "Restaurantes",
        title: "El platillo principal es la fidelidad.",
        description: "Desde postres de cortesía hasta descuentos especiales, crea un programa de recompensas que deje a tus comensales con un excelente sabor de boca.",
        color: "bg-red-100 text-red-800"
    },
    {
        industry: "Emprendedores",
        title: "Construye una comunidad, no solo clientes.",
        description: "Si tienes una tienda local o un pequeño negocio, Loyalfly te ayuda a crear conexiones duraderas y a convertir compradores ocasionales en tus fans número uno.",
        color: "bg-blue-100 text-blue-800"
    },
    {
        industry: "Nail & Makeup Artists",
        title: "Belleza que recompensa.",
        description: "Ofrece un servicio gratuito o un descuento exclusivo después de varias visitas. Es la manera perfecta de agradecer a tus clientas por su confianza y lealtad.",
        color: "bg-pink-100 text-pink-800"
    },
    {
        industry: "Estilistas y Barberos",
        title: "Un corte por encima de la competencia.",
        description: "Fideliza a tu clientela con un programa de lealtad tan impecable como tus cortes. Un servicio gratuito cada ciertos cortes es un incentivo que funciona.",
        color: "bg-gray-200 text-gray-800"
    }
];


const LandingPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        document.title = 'Loyalfly | Programa de Lealtad Digital para Negocios';
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col-reverse md:flex-row items-center gap-12">
                        {/* Left side: Text content */}
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight">
                                Transforma visitantes en clientes fieles.
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl text-gray-600">
                                Loyalfly es la forma más simple y elegante de crear un programa de lealtad digital que tus clientes amarán. Sin tarjetas de plástico, sin complicaciones.
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to="/pricing"
                                    className="px-8 py-3 w-full sm:w-auto text-base md:text-lg font-medium text-white bg-[#4D17FF] rounded-md hover:bg-opacity-90 transition-transform hover:scale-105"
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

                        {/* Right side: Image */}
                        <div className="md:w-1/2">
                            <img
                                src="https://placehold.co/1024x1024.png"
                                alt="Tarjeta de lealtad digital de Loyalfly en un smartphone"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
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

            {/* Industries Carousel Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black">Perfecto para tu Negocio</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-gray-600">Desde cafeterías hasta salones de belleza, Loyalfly se adapta a ti.</p>
                    </div>
                    
                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-lg">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {slides.map((slide, index) => (
                                    <div key={index} className="w-full flex-shrink-0 p-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="md:order-2">
                                                <img
                                                    src="https://placehold.co/1024x1024.png"
                                                    alt={slide.title}
                                                    className="rounded-lg shadow-xl w-full h-auto object-cover"
                                                />
                                            </div>
                                            <div className="text-center md:text-left md:order-1">
                                                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${slide.color}`}>
                                                    {slide.industry}
                                                </span>
                                                <h3 className="text-2xl font-bold text-black">{slide.title}</h3>
                                                <p className="mt-4 text-gray-600">{slide.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Arrow Controls */}
                        <button
                            onClick={goToPrevious}
                            aria-label="Diapositiva anterior"
                            className="hidden md:flex items-center justify-center absolute top-1/2 -left-4 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                            onClick={goToNext}
                            aria-label="Siguiente diapositiva"
                            className="hidden md:flex items-center justify-center absolute top-1/2 -right-4 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                        
                        <div className="flex justify-center mt-6 space-x-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Ir a la diapositiva ${index + 1}`}
                                    className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'}`}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;