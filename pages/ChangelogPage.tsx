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

      {/* --- VERSION v3.5.0.5 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.5</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 10 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Flujo de Consulta y Registro Unificado para Clientes</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha rediseñado la página pública de la tarjeta para agilizar la experiencia del cliente. Ahora, se presenta un único campo para el número de teléfono. El sistema detecta automáticamente si el cliente ya está registrado para mostrarle su tarjeta o lo guía al formulario de registro si es nuevo.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Términos y Condiciones Actualizados y Visibles</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reescrito por completo la página de Términos y Condiciones para alinearla con la legislación mexicana, delimitando claramente la responsabilidad de Loyalfly como intermediario. Además, se ha añadido un enlace directo a esta página en la vista pública de la tarjeta para garantizar la transparencia con el cliente final.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.4 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.4</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 9 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Mejora de Legibilidad en la Recompensa</h3>
                  <p className="text-gray-600 mt-1">
                      Se eliminó un efecto visual que cubría el texto de la recompensa en la previsualización de la tarjeta. Ahora el texto es siempre claro y legible sobre un fondo blanco limpio.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Estilo Actualizado para Sellos Vacíos</h3>
                  <p className="text-gray-600 mt-1">
                      Se ajustó el color de fondo de los sellos no marcados en la tarjeta. En lugar de un gris sólido, ahora utilizan un blanco semi-transparente que permite ver el color de fondo de la tarjeta a través de ellos.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.3 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.3</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 8 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Simplificación de la Sección "Comparte con tus Clientes"</h3>
                  <p className="text-gray-600 mt-1">
                      Para enfocar la funcionalidad del MVP, se ha rediseñado la sección para compartir en el editor de tarjetas. Se eliminó el código QR y se ajustó el texto para mayor claridad, cambiando el botón de "Ver Tarjeta" a "Ver Registro" para reflejar mejor la acción actual.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Previsualización Dinámica del Texto de Recompensa</h3>
                  <p className="text-gray-600 mt-1">
                      La previsualización de la tarjeta ahora muestra en tiempo real el texto ingresado en el campo "Texto de la Recompensa". Esto proporciona una experiencia de edición más intuitiva y directa, eliminando el texto de ejemplo y mostrando el contenido final exacto.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">URL Amigables para Registro de Clientes</h3>
                  <p className="text-gray-600 mt-1">
                      Cada negocio ahora tiene una URL pública única y fácil de compartir (ej: `loyalfly.app/#/view/nombre-negocio`). Este enlace dirige a los nuevos clientes a una página de registro personalizada con el logo y diseño de la tarjeta del negocio, simplificando la inscripción al programa de lealtad.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Flujo de Registro para Nuevos Clientes</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha implementado un formulario de registro público que permite a los clientes inscribirse con su nombre, teléfono y correo (opcional). Al completarlo, ven su nueva tarjeta digital al instante, mejorando la experiencia de incorporación.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Personalización del Logo de la Tarjeta</h3>
                  <p className="text-gray-600 mt-1">
                      Ahora los negocios pueden personalizar completamente su tarjeta de lealtad agregando un logo propio. Se ha añadido un nuevo campo en el editor de la tarjeta que permite ingresar una URL pública de una imagen (JPG o PNG), la cual se mostrará en la previsualización y en la tarjeta pública del cliente.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Generación Automática de Slugs</h3>
                  <p className="text-gray-600 mt-1">
                     El sistema ahora crea automáticamente un "slug" (una versión del nombre del negocio amigable para URLs) al registrar un nuevo negocio. Esto asegura que los enlaces públicos sean limpios, legibles y profesionales.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Reestructuración de Datos en Firestore para Mejor Escalabilidad</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha refactorizado la estructura de la base de datos en Firestore. La configuración de la tarjeta de lealtad ahora se almacena en una subcolección dedicada (`/businesses/{'{'}businessId{'}'}/config/card`). Este cambio mejora la organización, aísla la configuración de la información principal del negocio y prepara la plataforma para futuras funcionalidades avanzadas sin impactar la experiencia del usuario.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Validación de la Implementación y Reglas de Firebase</h3>
                  <p className="text-gray-600 mt-1">
                      Se realizó una auditoría completa de la integración con Firebase Auth y Firestore, confirmando que la implementación del lado del cliente sigue las mejores prácticas. Adicionalmente, se han configurado las reglas de seguridad del lado del servidor para el entorno de desarrollo y pruebas, permitiendo un acceso flexible para la depuración y manteniendo la seguridad como una prioridad para la producción.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.2 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.2</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 7 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Implementación de Autenticación Real con Firebase</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reemplazado el sistema de inicio de sesión simulado por una integración completa con Firebase Authentication. Ahora los negocios pueden registrarse, iniciar sesión y mantener su sesión de forma segura y persistente, utilizando email y contraseña.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Estructura de Base de Datos Escalable con Firestore</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha implementado una arquitectura de datos en Firestore. Cada negocio tiene su propio documento (identificado por su ID de usuario) que contiene la configuración de la tarjeta y una subcolección dedicada para sus clientes. Este modelo asegura que los datos estén organizados, seguros y sean eficientes de consultar.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.1 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.1</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 6 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Selector de Color RGB en Editor de Tarjeta</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reemplazado el selector de colores predefinidos por un selector RGB interactivo y optimizado para móviles, ofreciendo control total sobre el color de la tarjeta.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Dashboard Optimizado para Móviles</h3>
                  <p className="text-gray-600 mt-1">
                      La columna 'Teléfono' ahora es visible en la vista móvil del dashboard de clientes para un acceso rápido a la información de contacto clave, ocultando la columna 'Email' en pantallas pequeñas.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Sección de Documentación Unificada</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha creado una nueva sección 'Docs' con navegación lateral para centralizar la 'Guía de Estilo', el 'Log de Versiones' y futura documentación del negocio, mejorando la organización.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5 --- */}
      <section>
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 6 de Octubre de 2025</p>
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