
import React from 'react';
import CardPreview from '../components/CardPreview';

const ColorBox: React.FC<{ color: string; name: string; hex: string }> = ({ color, name, hex }) => (
    <div>
        <div className="h-24 rounded-lg" style={{ backgroundColor: color }}></div>
        <div className="mt-2">
            <p className="font-semibold text-black">{name}</p>
            <p className="text-sm text-gray-500 uppercase">{hex}</p>
        </div>
    </div>
);

const StyleGuidePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-black mb-4">Guía de Estilo</h1>
        <p className="text-lg text-gray-600 mb-12">
            Esta guía documenta el sistema de diseño de Loyalfly, asegurando consistencia visual y una experiencia de usuario coherente en toda la aplicación.
        </p>

        {/* --- COLORES --- */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-black border-b pb-2 mb-6">Paleta de Colores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <ColorBox color="#FFFFFF" name="Fondo Principal" hex="#FFFFFF" />
                <ColorBox color="#000000" name="Texto Principal" hex="#000000" />
                <ColorBox color="#6B7280" name="Texto Secundario" hex="#6B7280" />
                <ColorBox color="#00AA00" name="Acento (Éxito)" hex="#00AA00" />
            </div>
        </section>

        {/* --- TIPOGRAFÍA --- */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-black border-b pb-2 mb-6">Tipografía</h2>
            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-black">Heading 1 (Extrabold)</h1>
                <h2 className="text-3xl font-bold text-black">Heading 2 (Bold)</h2>
                <h3 className="text-xl font-semibold text-black">Heading 3 (Semibold)</h3>
                <p className="text-base text-gray-700">
                    Este es un párrafo de texto normal (p). Se utiliza para la mayoría del contenido textual. <a href="#" className="text-[#00AA00] underline">Este es un enlace</a>. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
            </div>
        </section>

        {/* --- BOTONES --- */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-black border-b pb-2 mb-6">Botones</h2>
            <div className="flex flex-wrap items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                    <button className="px-6 py-2.5 font-medium text-white bg-[#00AA00] rounded-md hover:bg-opacity-90 transition-colors">Botón Primario</button>
                    <span className="text-xs text-gray-500">Normal</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <button className="px-6 py-2.5 font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">Botón Secundario</button>
                    <span className="text-xs text-gray-500">Normal</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                    <button disabled className="px-6 py-2.5 font-medium text-white bg-gray-400 rounded-md cursor-not-allowed">Botón Deshabilitado</button>
                    <span className="text-xs text-gray-500">Disabled</span>
                </div>
            </div>
        </section>
        
        {/* --- FORMULARIOS --- */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-black border-b pb-2 mb-6">Elementos de Formulario</h2>
            <div className="max-w-sm space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Campo de Texto</label>
                    <input 
                        id="name"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        placeholder="Escribe aquí..."
                    />
                </div>
                 <div>
                    <label htmlFor="name-error" className="block text-sm font-medium text-gray-700">Campo con Error</label>
                    <input 
                        id="name-error"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-red-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        defaultValue="Dato inválido"
                    />
                    <p className="mt-1 text-xs text-red-600">Este campo es requerido.</p>
                </div>
            </div>
        </section>

        {/* --- COMPONENTES --- */}
        <section>
            <h2 className="text-2xl font-bold text-black border-b pb-2 mb-6">Componentes Clave</h2>
            <h3 className="text-lg font-semibold text-black mb-4">Tarjeta de Lealtad</h3>
            <div className="p-8 bg-gray-100 rounded-lg flex justify-center">
                 <CardPreview 
                    businessName="Nombre del Negocio"
                    rewardText="Tu Recompensa"
                    cardColor="#FFFFFF"
                    stamps={3}
                 />
            </div>
        </section>

      </div>
    </div>
  );
};

export default StyleGuidePage;