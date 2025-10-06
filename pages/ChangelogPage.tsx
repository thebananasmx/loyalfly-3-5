
import React from 'react';

const FeatureTag: React.FC<{ type: 'new' | 'improvement' }> = ({ type }) => {
    const isNew = type === 'new';
    const bgColor = isNew ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
    const text = isNew ? 'Nuevo' : 'Mejora';
    return (
        <span className={`inline-block px-2 py-0.5 text-sm font-medium rounded-full ${bgColor}`}>
            {text}
        </span>
    );
};

const ChangelogPage: React.FC = () => {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold text-black mb-4 tracking-tight">Log de Versiones</h1>
      <p className="text-lg text-gray-600 mb-12">
        Un historial de todas las mejoras y nuevas funcionalidades que hemos agregado a Loyalfly para ayudarte a crecer.
      </p>

      {/* --- VERSION v3.5 --- */}
      <section>
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada en Octubre 2023</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Gestión de Clientes desde el Dashboard</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha añadido un botón "Nuevo Cliente" en el dashboard para registrar clientes (nombre, teléfono y email opcional) directamente en la plataforma, centralizando la gestión.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Función Rápida para Agregar Sellos</h3>
                  <p className="text-gray-600 mt-1">
                      Se implementó un botón flotante en el dashboard que lleva a una nueva pantalla para buscar clientes por teléfono y agregarles sellos de forma rápida y eficiente.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Selector de Cantidad de Sellos Mejorado</h3>
                  <p className="text-gray-600 mt-1">
                      Ahora es posible agregar múltiples sellos a la vez. El selector de cantidad se ha movido al modal de confirmación y rediseñado con un estilo de e-commerce (+/-) para una mejor experiencia de usuario.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Optimización de Tipografía para Móviles</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha estandarizado el tamaño de fuente base a 16px en toda la aplicación para cumplir con las directrices de accesibilidad de Google y mejorar la legibilidad en dispositivos móviles.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Mejoras en la Guía de Estilo y Legibilidad</h3>
                  <p className="text-gray-600 mt-1">
                      Se ajustó el interletrado de los encabezados principales para una mejor legibilidad y se documentó la familia de fuentes utilizada en la guía de estilo de la aplicación.
                  </p>
              </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ChangelogPage;