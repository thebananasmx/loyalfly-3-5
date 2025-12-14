import React, { useEffect } from 'react';

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
  useEffect(() => {
    document.title = 'Log de Versiones | Docs | Loyalfly';
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold text-black mb-4 tracking-tight">Log de Versiones</h1>
      <p className="text-lg text-gray-600 mb-12">
        Un historial de todas las mejoras y nuevas funcionalidades que hemos agregado a Loyalfly para ayudarte a crecer.
      </p>
      
      {/* --- VERSION v3.5.0.19 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.19</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 25 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Internacionalización Completa (ES, EN, PT)</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha completado la traducción de la plataforma. Ahora, las secciones de <strong>Registro</strong>, <strong>Editor de Tarjeta</strong> (`/app/tarjeta`), el panel de <strong>Métricas</strong> (`/app/metricas`), la gestión de <strong>Encuestas</strong> (`/app/vote`) y el <strong>Pie de Página</strong> están disponibles nativamente en Español, Inglés y Portugués, adaptándose a la preferencia del usuario.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.18 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.18</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 24 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Vista de Detalle de Negocio para Super Admin</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha habilitado una página de detalle en el panel de administración global. Al seleccionar un negocio, el administrador puede visualizar la configuración de la tarjeta de lealtad renderizada con datos reales del primer cliente, así como consultar la lista completa de clientes registrados (nombre, teléfono, email y sellos) en modo de solo lectura.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Actualización en Página de Precios</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha actualizado la tarjeta del plan "Entrepreneur" en la página de precios para destacar que este nivel permite eliminar el botón promocional "Únete a Loyalfly" de las tarjetas digitales de los clientes, ofreciendo una apariencia más profesional y exclusiva.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.17 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.17</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 23 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Nueva Página de Ajustes de Cuenta</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha añadido una nueva sección de "Ajustes de Cuenta", accesible desde el menú desplegable del usuario en la barra lateral. Esta página permite a los dueños de negocios ver la información principal de su cuenta y gestionar la seguridad, incluyendo una funcionalidad segura para cambiar su contraseña de acceso.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Página de KPIs para Super Administrador</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha añadido una nueva página de Indicadores Clave de Rendimiento (KPIs) al panel de Super Administración. Esta sección centraliza métricas globales de la plataforma, como el número total de negocios, clientes, sellos y recompensas. Incluye una gráfica de pastel para visualizar la distribución de negocios por plan de suscripción y una tabla con los negocios más destacados para un análisis estratégico.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Rediseño Interactivo y Funcional de la Gráfica de Crecimiento</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha rediseñado por completo la gráfica en la página de Métricas. Ahora, con un tema blanco y morado alineado a la marca, muestra el "Crecimiento de Nuevos Clientes por Mes". Se mejoró su usabilidad con barras más anchas y un efecto de resaltado al pasar el cursor sobre la columna del mes. Además, se añadió una tarjeta flotante (`tooltip`) que muestra los datos exactos del mes, unificando la interacción para una experiencia más limpia e intuitiva.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Panel de Métricas Clave (KPIs)</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha introducido una nueva sección de "Métricas" en el panel de administración. Ahora los dueños de negocios pueden visualizar KPIs fundamentales como el total de clientes, sellos otorgados, recompensas canjeadas y la tasa de redención. Además, incluye una gráfica de crecimiento de clientes y una tabla con los clientes más leales para un análisis rápido y efectivo del programa.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Animaciones Suaves en Navegación</h3>
                  <p className="text-gray-600 mt-1">
                      Para mejorar la experiencia de usuario, se ha implementado un efecto de difuminado ('fade-in') al navegar entre las diferentes secciones del panel de administración. Este cambio proporciona una sensación de carga más fluida y profesional.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Optimización del Botón de Suscripción en Planes de Pago</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha refinado el proceso de suscripción para el plan "Entrepreneur". El botón, ahora con el texto "Suscribirse", es un enlace directo a la página de pago segura de Stripe, abriéndose en una nueva pestaña para una experiencia de usuario más fluida y sin interrupciones.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.16 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.16</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 22 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Reposicionamiento Estratégico de Notificaciones (Toasts)</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reubicado el contenedor de notificaciones (toasts) a la esquina superior derecha en escritorio y a la parte superior central en móviles. Este cambio soluciona un problema de usabilidad donde el widget de chat cubría los mensajes importantes, garantizando ahora su total visibilidad.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Validación de Longitud en Campos de Teléfono</h3>
                  <p className="text-gray-600 mt-1">
                      Para mejorar la calidad de los datos y la experiencia de usuario, todos los campos de entrada de número de teléfono en la aplicación ahora están limitados a un máximo de 10 dígitos, previniendo errores de formato desde el inicio.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Mejora de Usabilidad con Scroll Automático</h3>
                  <p className="text-gray-600 mt-1">
                      Al consultar o registrar una tarjeta en la página pública (`/view/:slug`), la vista ahora se desplaza automáticamente a la parte superior de la página. Esto asegura que el cliente vea su tarjeta de lealtad de inmediato, sin necesidad de hacer scroll manual.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Optimización de la Estructura de Slugs en la Base de Datos</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reestructurado la forma en que se almacenan los 'slugs' (URLs amigables) para negocios y artículos del blog. Ahora residen en colecciones dedicadas (`businessSlugs`, `blogSlugs`), lo que mejora drásticamente la eficiencia de las consultas, garantiza la unicidad de las URLs y optimiza la escalabilidad de la plataforma a largo plazo.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Enrutamiento Condicional para Compatibilidad de Entornos</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha implementado una lógica de enrutamiento "inteligente" para resolver el conflicto entre el entorno de vista previa de AI Studio y el sitio en producción. La aplicación ahora detecta la URL: si es un dominio de producción (`loyalfly.com.mx` o `vercel.app`), utiliza `BrowserRouter` para URLs limpias. Para cualquier otro entorno (como la vista previa), usa `HashRouter` por defecto, garantizando que la vista previa siempre funcione sin afectar las URLs del sitio publicado.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Corrección en la Carga de Artículos del Blog</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha solucionado un problema que impedía que los artículos publicados se mostrasen en la página del blog. La corrección ajusta la forma en que se consultan los datos en Firestore, garantizando que todos los posts con estado "publicado" se carguen y muestren correctamente sin necesidad de configuraciones manuales en la base de datos.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Solución de Bucle de Redirección en el Panel de Administración</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha corregido un error crítico que causaba un bucle de redirección infinito al intentar acceder a la ruta `/admin`, lo que impedía la carga del panel. El problema se resolvió ajustando la lógica de las rutas protegidas para dirigir correctamente a los usuarios no autorizados a la página de inicio de sesión del administrador.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.15 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.15</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 21 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Generación de Códigos QR Dinámicos para Clientes</h3>
                  <p className="text-gray-600 mt-1">
                      Cada tarjeta de cliente ahora incluye un código QR único y personal, generado dinámicamente con su ID. Este QR se crea como una imagen (tipo PNG/JPG), facilitando su guardado o compartición. Esta funcionalidad reemplaza al generador de QR externo y lo integra directamente en la plataforma.
                  </p>
              </div>
          </li>
           <li className="flex items-start gap-4">
              <FeatureTag type="new" />
              <div>
                  <h3 className="font-semibold text-black">Flujo Rápido de Sellos con Escáner QR en el Dashboard</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha introducido un botón "Escanear QR" en el dashboard que activa la cámara del dispositivo. Al escanear el QR de un cliente, el sistema lo identifica al instante y abre directamente el modal para añadir sellos, eliminando la necesidad de buscar manualmente y agilizando el servicio al cliente de forma espectacular.
                  </p>
              </div>
          </li>
          <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Ajustes Estéticos al Código QR</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha refinado la apariencia del código QR en la tarjeta del cliente para una mejor integración visual. Se ajustó su tamaño a 120x120px y se encapsuló en un contenedor con un sutil margen y esquinas redondeadas, dándole un aspecto más pulido y estético dentro del diseño de la tarjeta.
                  </p>
              </div>
          </li>
        </ul>
      </section>

      {/* --- VERSION v3.5.0.14 --- */}
      <section className="mb-12">
        <div className="pb-4 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-black">Versión 3.5.0.14</h2>
          <p className="text-base text-gray-500 mt-1">Lanzada el 20 de Octubre de 2025</p>
        </div>
        
        <ul className="mt-8 space-y-6">
           <li className="flex items-start gap-4">
              <FeatureTag type="improvement" />
              <div>
                  <h3 className="font-semibold text-black">Actualización del Widget de Chat en Vivo</h3>
                  <p className="text-gray-600 mt-1">
                      Se ha reemplazado el widget de chat de Botpress por el de Tidio para mejorar la velocidad de respuesta, la fiabilidad y ofrecer una mejor experiencia de soporte en tiempo real a nuestros usuarios.
                  </p>
              </div>
          </li>
        </ul>
      </section>

    </div>
  );
};

export default ChangelogPage;