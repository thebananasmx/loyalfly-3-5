import React, { useState, useEffect } from 'react';
import { getPromotionSettings, updatePromotionSettings, getBusinessesOnTrial, type BusinessAdminData } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';
import { Calendar, Building2, Mail, Clock, Eye, Layout } from 'lucide-react';
import type { PromotionSettings } from '../types';
import PromotionModal from '../components/PromotionModal';
import TrialCountdownBanner from '../components/TrialCountdownBanner';

const AdminPromotionsPage: React.FC = () => {
    const [settings, setSettings] = useState<PromotionSettings>({
        isActive: false,
        title: '',
        message: '',
        imageUrl: '',
        frequencyDays: 7,
        updatedAt: null
    });
    const [businessesOnTrial, setBusinessesOnTrial] = useState<BusinessAdminData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
    const { showToast } = useToast();

    // Mock date for banner preview (30 days from now)
    const mockTrialEndDate = new Date();
    mockTrialEndDate.setDate(mockTrialEndDate.getDate() + 30);

    useEffect(() => {
        document.title = 'Marketing & Popups | Super Admin';
        const fetchData = async () => {
            try {
                const [promoData, trialBusinesses] = await Promise.all([
                    getPromotionSettings(),
                    getBusinessesOnTrial()
                ]);
                
                if (promoData) {
                    setSettings(promoData);
                }
                setBusinessesOnTrial(trialBusinesses);
            } catch (error) {
                console.error("Error fetching data:", error);
                showToast('Error al cargar la información.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const calculateDaysLeft = (endDate: any) => {
        if (!endDate) return 0;
        const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

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
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">Marketing / Popups</h1>
                    <p className="text-gray-500 mt-2">Administra el popup de promoción para negocios en plan Gratis.</p>
                </div>
            </div>

            {/* Banner Preview Section */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Layout className="h-5 w-5 text-gray-400" />
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Vista Previa de la Barra de Prueba</h2>
                </div>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <TrialCountdownBanner trialEndDate={mockTrialEndDate} />
                    <div className="bg-white p-4 text-center text-xs text-gray-400 italic">
                        Así es como los negocios verán la barra superior una vez que acepten la prueba de 30 días.
                    </div>
                </div>
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

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center space-x-3 sm:space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsModalPreviewOpen(true)}
                        className="px-4 sm:px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center space-x-2"
                    >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 sm:px-8 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm flex items-center space-x-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            <span>Guardar</span>
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

            {/* Lista de Negocios en Prueba */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Calendar className="h-6 w-6 text-[#4D17FF]" />
                    <h2 className="text-2xl font-bold text-gray-900">Negocios</h2>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    {businessesOnTrial.length === 0 ? (
                        <div className="p-12 text-center">
                            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No hay negocios activos en periodo de prueba actualmente.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Negocio</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Días Restantes</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {businessesOnTrial.map((business) => {
                                        const daysLeft = calculateDaysLeft(business.trialEndDate);
                                        return (
                                            <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900">{business.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2 text-gray-500">
                                                        <Mail className="h-4 w-4" />
                                                        <span className="text-sm">{business.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className={`h-4 w-4 ${daysLeft <= 5 ? 'text-red-500' : 'text-emerald-500'}`} />
                                                        <span className={`font-bold ${daysLeft <= 5 ? 'text-red-600' : 'text-emerald-600'}`}>
                                                            {daysLeft} días
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                        daysLeft > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {daysLeft > 0 ? 'Activo' : 'Vencido'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Preview */}
            <PromotionModal 
                isOpen={isModalPreviewOpen}
                onClose={() => setIsModalPreviewOpen(false)}
                onActivate={() => {
                    showToast('Esto es solo una vista previa.', 'alert');
                    setIsModalPreviewOpen(false);
                }}
                settings={settings}
            />
        </div>
    );
};

export default AdminPromotionsPage;
