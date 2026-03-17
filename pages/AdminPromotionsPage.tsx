import React, { useState, useEffect } from 'react';
import { getPromotionSettings, updatePromotionSettings } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';
import type { PromotionSettings } from '../types';

const AdminPromotionsPage: React.FC = () => {
    const [settings, setSettings] = useState<PromotionSettings>({
        isActive: false,
        title: '',
        message: '',
        imageUrl: '',
        frequencyDays: 7,
        updatedAt: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        document.title = 'Marketing & Popups | Super Admin';
        const fetchSettings = async () => {
            try {
                const data = await getPromotionSettings();
                if (data) {
                    setSettings(data);
                }
            } catch (error) {
                console.error("Error fetching promotion settings:", error);
                showToast('Error al cargar la configuración de promociones.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [showToast]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updatePromotionSettings(settings);
            showToast('Configuración guardada con éxito.', 'success');
        } catch (error) {
            console.error("Error updating promotion settings:", error);
            showToast('Error al guardar la configuración.', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D17FF]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black tracking-tight">Marketing / Popups</h1>
                <p className="text-gray-500 mt-2">Administra el popup de promoción para negocios en plan Gratis.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Estado de la Promoción</h3>
                            <p className="text-sm text-gray-500">Activa o desactiva el popup globalmente.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={settings.isActive}
                                onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
                            />
                            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4D17FF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#4D17FF]"></div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Popup</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4D17FF] focus:border-transparent outline-none transition-all"
                                placeholder="Ej: ¡Prueba Entrepreneur Gratis por 30 días!"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje / Descripción</label>
                            <textarea
                                value={settings.message}
                                onChange={(e) => setSettings({ ...settings, message: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4D17FF] focus:border-transparent outline-none transition-all min-h-[120px]"
                                placeholder="Describe los beneficios de la promoción..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                            <input
                                type="url"
                                value={settings.imageUrl}
                                onChange={(e) => setSettings({ ...settings, imageUrl: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4D17FF] focus:border-transparent outline-none transition-all"
                                placeholder="https://ejemplo.com/imagen.png"
                            />
                            {settings.imageUrl && (
                                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img 
                                        src={settings.imageUrl} 
                                        alt="Vista previa" 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="max-w-xs">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Visualización (días)</label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="number"
                                    min="1"
                                    max="365"
                                    value={settings.frequencyDays}
                                    onChange={(e) => setSettings({ ...settings, frequencyDays: parseInt(e.target.value) || 1 })}
                                    className="w-24 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4D17FF] focus:border-transparent outline-none transition-all"
                                    required
                                />
                                <span className="text-gray-500 text-sm">días entre cada aparición</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Si el usuario cierra el popup, no se volverá a mostrar hasta que pasen estos días.</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-8 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm flex items-center space-x-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <span>Guardar Configuración</span>
                        )}
                    </button>
                </div>
            </form>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex space-x-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-blue-900 font-semibold">Información del Sistema</h4>
                        <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>El popup solo se muestra a negocios con plan <strong>Gratis</strong>.</li>
                            <li>Al activar la prueba, el plan cambia a <strong>Entrepreneur</strong> por 30 días.</li>
                            <li>Se mostrará una barra de cuenta regresiva en el dashboard del negocio.</li>
                            <li>La activación es manual por parte del usuario desde el popup.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPromotionsPage;
