import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import StatsBanner from '../components/StatsBanner';

const CheckCircleIcon = () => <svg className="w-6 h-6 text-[#00AA00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;

const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>;
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 351.766 351.766"><path d="M313.397,28.204h-59.649c-0.967,0-1.922,0.048-2.871,0.119H53.14c-13.425,0-24.347,10.922-24.347,24.346v193.495 c0,13.424,10.922,24.346,24.347,24.346h6.265v13.559c0,0.979,0.002,2.373,0.124,3.965H10.435C4.682,288.034,0,292.715,0,298.468 v14.659c0,5.753,4.682,10.434,10.435,10.434h295.264c5.753,0,10.435-4.681,10.435-10.434v-14.659 c0-5.753-4.682-10.434-10.435-10.434h-49.093c0.122-1.591,0.124-2.985,0.124-3.965V270.51h6.265 c13.425,0,24.347-10.922,24.347-24.346v-72.276h26.058c21.156,0,38.368-17.212,38.368-38.368V66.573 C351.766,45.416,334.554,28.204,313.397,28.204z M316.766,135.519c0,1.826-1.542,3.368-3.368,3.368H287.34V63.204h26.058 c1.826,0,3.368,1.542,3.368,3.368V135.519z"/></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 50 50"><path d="M34.781 6.664h-6.951c-1.256.004-1.209 1.876 0 1.865h6.951v.957h-6.951c-1.249-.011-1.203 1.86 0 1.865h6.951v.978h-6.951c-1.249 0-1.203 1.87 0 1.865h6.951v.932h-6.951c-1.223.009-1.203 1.881 0 1.887h6.951v.934h-6.951c-1.223-.004-1.228 1.865 0 1.865h6.951v.932h-6.951c-1.223.004-1.228 1.875 0 1.866h6.951v.955h-6.951c-1.223-.011-1.228 1.858 0 1.865h6.951v.93h-6.951c-1.223-.001-1.203 1.872 0 1.866h6.951v18.159c.004 2.767 4.207 2.717 4.219 0v-42.495c-.012-1.264-1.05-2.862-2.758-2.867h-8.412c-1.256.001-1.209 1.873 0 1.865l6.951.023v.93h-6.951c-1.254-.006-1.207 1.865 0 1.866h6.951v.957zm-7.429 32.194c-.004-3.23-3.352-6.704-7.352-4.454v-12.354l-2.587-20.375c-.054-.539-.511-.666-.818-.675-.317.009-.952.136-1.021.675l-2.574 20.375v12.354c-4-2.25-7.24 1.246-7.241 4.429.001 2.832 2.181 5.158 5.131 5.151 2.972.007 5.11-2.6 5.11-5.151v-12.833h1v12.833c0 2.856 2.212 4.97 4.67 5.104-.041 1.566.47 3.8 1.432 4.686 1.128 1.04 2.471-.29 1.92-1.373-.532-1.008-1.054-1.605-.63-3.806 1.772-.82 2.956-2.546 2.96-4.586zm-16.348 2.541c-1.396-.009-2.524-1.141-2.526-2.541.002-1.399 1.13-2.536 2.526-2.544 1.386.008 2.515 1.145 2.525 2.544-.01 1.401-1.139 2.533-2.525 2.541zm8.571-2.541c.009-1.399 1.136-2.536 2.526-2.544 1.392.008 2.521 1.145 2.525 2.544-.004 1.4-1.132 2.532-2.525 2.541-1.39-.008-2.518-1.14-2.526-2.541z"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 512 512"><g><path d="M345.116,261.87c-13.849,0.001-26.866,5.389-36.665,15.189c-16.786,16.786-34.439,25.303-52.45,25.303 c-18.011,0-35.664-8.517-52.45-25.314c-9.799-9.788-22.817-15.177-36.666-15.177H0.174 c48.237,57.952,151.384,138.247,255.827,138.247s207.59-80.295,255.827-138.247H345.116z"/></g><g><path d="M363.32,112.531c-37.274-4.534-62.891,15.683-81.645,30.421c-9.968,7.831-19.385,15.234-25.674,15.234 c-6.289,0-15.706-7.403-25.674-15.234c-18.754-14.738-44.373-34.944-81.645-30.421C105.636,117.728,58.244,154.335,0,227.31 h166.884c23.075,0,44.766,8.978,61.102,25.291c20.161,20.184,35.867,20.173,56.028,0.011 c16.336-16.325,38.027-25.303,61.102-25.303H512C453.756,154.335,406.364,117.728,363.32,112.531z"/></g></svg>;


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
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('emprendedores');

    const slides = [
        {
            industry: t('landing.industries.slides.cafe.industry'),
            title: t('landing.industries.slides.cafe.title'),
            description: t('landing.industries.slides.cafe.desc'),
            color: "bg-yellow-100 text-yellow-800",
            imageUrl: "https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1762011139/coffee_loyalfly_mg9r2p.png"
        },
        {
            industry: t('landing.industries.slides.restaurant.industry'),
            title: t('landing.industries.slides.restaurant.title'),
            description: t('landing.industries.slides.restaurant.desc'),
            color: "bg-red-100 text-red-800",
            imageUrl: "https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1762011138/restaurant_loyalfly_hs7cwc.png"
        },
        {
            industry: t('landing.industries.slides.entrepreneur.industry'),
            title: t('landing.industries.slides.entrepreneur.title'),
            description: t('landing.industries.slides.entrepreneur.desc'),
            color: "bg-blue-100 text-blue-800",
            imageUrl: "https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1762011139/paint_loyalfly_aqcand.png"
        },
        {
            industry: t('landing.industries.slides.makeup.industry'),
            title: t('landing.industries.slides.makeup.title'),
            description: t('landing.industries.slides.makeup.desc'),
            color: "bg-pink-100 text-pink-800",
            imageUrl: "https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1762011141/makeup_loyalfly_s0yta0.png"
        },
        {
            industry: t('landing.industries.slides.barber.industry'),
            title: t('landing.industries.slides.barber.title'),
            description: t('landing.industries.slides.barber.desc'),
            color: "bg-gray-200 text-gray-800",
            imageUrl: "https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1762011138/barber_loyalfly_r8ymwd.png"
        }
    ];

    const tabs = [
      {
        id: 'emprendedores',
        title: t('landing.designs.tabs.entrepreneur.title'),
        icon: <StoreIcon />,
        description: t('landing.designs.tabs.entrepreneur.desc'),
        imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1775414854/card_loyalfly_tmx9vh.png'
      },
      {
        id: 'cafeterias',
        title: t('landing.designs.tabs.cafe.title'),
        icon: <CoffeeIcon />,
        description: t('landing.designs.tabs.cafe.desc'),
        imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1775414924/card_cafe_mzjj0q.png'
      },
      {
        id: 'barberias',
        title: t('landing.designs.tabs.barber.title'),
        icon: <ScissorsIcon />,
        description: t('landing.designs.tabs.barber.desc'),
        imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1775414865/card_barber_ftfyxa.png'
      },
      {
        id: 'belleza',
        title: t('landing.designs.tabs.beauty.title'),
        icon: <SparklesIcon />,
        description: t('landing.designs.tabs.beauty.desc'),
        imageUrl: 'https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_600/v1775414915/card_beauty_cu1r3n.png'
      }
    ];

    useEffect(() => {
        document.title = 'Loyalfly | Programa de Lealtad Digital para Negocios';
        
        // Canonical tag logic
        let canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', 'https://loyalfly.com.mx/');
        } else {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          canonical.setAttribute('href', 'https://loyalfly.com.mx/');
          document.head.appendChild(canonical);
        }

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 7000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };
    
    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="py-12 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Left side: Text content */}
                        <div className="md:w-1/2 text-center md:text-left">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-black tracking-tight">
                                {t('landing.hero.title')}
                            </h1>
                            <p className="mt-6 max-w-2xl mx-auto md:mx-0 text-lg md:text-xl text-gray-600">
                                {t('landing.hero.subtitle')}
                            </p>
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to="/register"
                                    className="px-8 py-3 w-full sm:w-auto text-base md:text-lg font-medium text-white bg-[#4D17FF] rounded-md hover:bg-opacity-90 transition-transform hover:scale-105"
                                >
                                    Regístrate Gratis
                                </Link>
                                <Link
                                    to="/pricing"
                                    className="px-8 py-3 w-full sm:w-auto text-base md:text-lg font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-transform hover:scale-105"
                                >
                                    Ver planes
                                </Link>
                            </div>
                            
                            {/* Wallet Badges (Informative) */}
                            <div className="mt-14 flex flex-col items-center md:items-start gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <img 
                                        src="https://res.cloudinary.com/dg4wbuppq/image/upload/v1770770709/ESMX_Add_to_Apple_Wallet_RGB_101821_in2cem.svg" 
                                        alt="Add to Apple Wallet" 
                                        className="h-[40px] w-auto opacity-90" 
                                    />
                                    <img 
                                        src="https://res.cloudinary.com/dg4wbuppq/image/upload/v1770771245/esUS_add_to_google_wallet_add-wallet-badge_qmkpl1.svg" 
                                        alt="Add to Google Wallet" 
                                        className="h-[40px] w-auto opacity-90" 
                                    />
                                </div>
                                <p className="text-xs text-gray-400 font-medium">
                                    *Descarga a wallet solo disponible en plan Entrepreneur y PRO, consulta nuestros planes
                                </p>
                            </div>
                        </div>

                        {/* Right side: Image */}
                        <div className="md:w-1/2">
                            <img
                                src="https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_1200/v1775413956/loyalfly_hero_p4fkee.png"
                                alt="Tarjeta de lealtad digital de Loyalfly en un smartphone"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner Section */}
            <StatsBanner />

            {/* Designs Tab Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black">{t('landing.designs.title')}</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-gray-600">{t('landing.designs.subtitle')}</p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* Tab buttons */}
                        <div className="mb-8 p-1.5 bg-gray-200 rounded-lg flex flex-wrap justify-center gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 text-base font-medium rounded-md transition-all duration-200 flex-grow text-center flex items-center justify-center gap-2 ${
                                        activeTab === tab.id ? 'bg-[#4D17FF] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.title}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        {activeTabData && (
                            <div key={activeTabData.id} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in-up">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-black">{activeTabData.title}</h3>
                                    <p className="mt-4 text-gray-600">{activeTabData.description}</p>
                                </div>
                                <div>
                                    <img
                                        src={activeTabData.imageUrl}
                                        alt={`Tarjeta de lealtad para ${activeTabData.title}`}
                                        className="rounded-lg shadow-xl mx-auto max-w-xs"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Help for Professionals Section */}
            <section className="py-24 bg-gray-50/50">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col md:flex-row-reverse group">
                        <div className="w-full md:w-72 h-64 md:h-auto overflow-hidden flex-shrink-0 relative">
                            <img 
                                src="https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_800/v1774967371/loyalfly_experts_xefusk.png" 
                                alt="Loyalfly Experts" 
                                className="w-full h-full object-cover object-center transition-transform duration-700"
                                referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                <span className="text-[10px] font-bold text-[#4D17FF] uppercase tracking-widest">Soporte VIP</span>
                            </div>
                        </div>
                        <div className="p-10 md:p-14 flex flex-col justify-center flex-1">
                            <div className="mb-2">
                                <span className="text-[#4D17FF] font-semibold text-sm tracking-wide uppercase">Asesoría Personalizada</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 tracking-tight leading-tight">
                                Lanza tu programa de lealtad con un experto
                            </h2>
                            <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10">
                                No lo hagas solo. Te ayudamos a configurar tu tarjeta digital y a diseñar la estrategia perfecta para que tus clientes vuelvan siempre.
                            </p>
                            
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-8 border-t border-gray-100 mt-auto">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src="https://res.cloudinary.com/dg4wbuppq/image/upload/f_auto,q_auto,w_100,c_fill,g_face/v1774967661/expert_avatar_0336a0.png" 
                                        alt="Héctor León" 
                                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-black">Héctor León</p>
                                        <p className="text-xs text-gray-400 font-medium">Loyalty Associate Manager</p>
                                    </div>
                                </div>
                                <a 
                                    href="https://calendar.app.google/nzKuGt45RLVu1on97" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 text-base md:text-lg font-bold text-white bg-black rounded-full hover:bg-[#4D17FF] transition-all hover:scale-105 shadow-xl shadow-black/10 whitespace-nowrap group/btn"
                                >
                                    <span className="md:hidden">Agendar asesoría</span>
                                    <span className="hidden md:inline">Agendar asesoría gratuita</span>
                                    <svg className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black">{t('landing.features.title')}</h2>
                        <p className="mt-4 text-gray-600">{t('landing.features.subtitle')}</p>
                    </div>
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
                        <Feature 
                            title={t('landing.features.list.digital.title')}
                            description={t('landing.features.list.digital.desc')}
                        />
                        <Feature 
                            title={t('landing.features.list.custom.title')}
                            description={t('landing.features.list.custom.desc')}
                        />
                        <Feature 
                            title={t('landing.features.list.analytics.title')}
                            description={t('landing.features.list.analytics.desc')}
                        />
                        <Feature 
                            title={t('landing.features.list.results.title')}
                            description={t('landing.features.list.results.desc')}
                        />
                    </div>
                </div>
            </section>

            {/* Industries Carousel Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-black">{t('landing.industries.title')}</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-gray-600">{t('landing.industries.subtitle')}</p>
                    </div>
                    
                    <div className="relative max-w-5xl mx-auto md:px-16">
                        <div className="overflow-hidden rounded-lg">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {slides.map((slide, index) => (
                                    <div key={index} className="w-full flex-shrink-0 p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                                            <div className="md:order-2">
                                                <img
                                                    src={slide.imageUrl}
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
                            className="hidden md:flex items-center justify-center absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
                        >
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                        <button
                            onClick={goToNext}
                            aria-label="Siguiente diapositiva"
                            className="hidden md:flex items-center justify-center absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors z-10"
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