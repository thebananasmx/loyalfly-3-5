
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-6 tracking-tight">Términos y Condiciones</h1>
        <div className="prose prose-lg text-gray-700 space-y-4">
          <p>
            Bienvenido a Loyalfly. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Loyalfly, ubicado en loyalfly.app.
          </p>
          <h2 className="text-2xl font-semibold text-black">1. Aceptación de los Términos</h2>
          <p>
            Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando Loyalfly si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
          </p>
          <h2 className="text-2xl font-semibold text-black">2. Licencia</h2>
          <p>
            A menos que se indique lo contrario, Loyalfly y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en Loyalfly. Todos los derechos de propiedad intelectual están reservados. Puedes acceder a esto desde Loyalfly para tu propio uso personal sujeto a las restricciones establecidas en estos términos y condiciones.
          </p>
          <h2 className="text-2xl font-semibold text-black">3. Restricciones</h2>
          <p>
            Estás específicamente restringido de todo lo siguiente:
          </p>
          <ul>
            <li>Publicar cualquier material del sitio web en cualquier otro medio.</li>
            <li>Vender, sublicenciar y/o comercializar cualquier material del sitio web.</li>
            <li>Realizar y/o mostrar públicamente cualquier material del sitio web.</li>
            <li>Usar este sitio web de cualquier manera que sea o pueda ser perjudicial para este sitio web.</li>
          </ul>
          <p>
            (Contenido de marcador de posición...)
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;