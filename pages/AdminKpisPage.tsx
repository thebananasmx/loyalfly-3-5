import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getAllBusinessesForSuperAdmin } from '../services/firebaseService';
import type { BusinessAdminData } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';

type Granularity = 'day' | 'month' | 'year';

const StatCard: React.FC<{ title: string; value: string | number; description?: string }> = ({ title, value, description }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-base text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-black mt-1">{value}</p>
        {description && <p className="text-base text-gray-500 mt-2">{description}</p>}
    </div>
);

const PieChart: React.FC<{ data: { name: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return <div className="flex items-center justify-center h-48 bg-gray-100 rounded-full text-gray-500">Sin datos</div>;
    }

    const gradientParts = [];
    let cumulativePercentage = 0;
    for (const item of data) {
        const percentage = (item.value / total) * 100;
        gradientParts.push(`${item.color} ${cumulativePercentage}% ${cumulativePercentage + percentage}%`);
        cumulativePercentage += percentage;
    }
    const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="flex flex-col md:flex-row items-center gap-8">
            <div 
                className="w-48 h-48 rounded-full shadow-inner border border-gray-100" 
                style={{ background: conicGradient }}
                role="img"
                aria-label="Gráfica de pastel de distribución de planes"
            ></div>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                        <div>
                            <span className="font-semibold text-black">{item.name}</span>
                            <span className="ml-2 text-gray-600">
                                {item.value} ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CHART COMPONENT ---

const GrowthChart: React.FC<{ businesses: BusinessAdminData[], granularity: Granularity }> = ({ businesses, granularity }) => {
    const [tooltip, setTooltip] = useState<{ label: string; count: number; top: number; left: number } | null>(null);

    const chartData = useMemo(() => {
        const groups: { [key: string]: number } = {};
        
        // Grouping logic
        businesses.forEach(b => {
            if (!b.rawCreatedAt) return;
            const date = new Date(b.rawCreatedAt);
            let key = '';
            
            if (granularity === 'day') {
                key = date.toISOString().split('T')[0]; // YYYY-MM-DD
            } else if (granularity === 'month') {
                key = date.toLocaleString('es-MX', { month: 'short', year: 'numeric' }); // ene. 2024
            } else {
                key = date.getFullYear().toString(); // 2024
            }
            
            groups[key] = (groups[key] || 0) + 1;
        });

        // Convert to sorted array and limit points for readability
        let sortedKeys = Object.keys(groups).sort();
        if (granularity === 'day' && sortedKeys.length > 15) {
            sortedKeys = sortedKeys.slice(-15);
        } else if (granularity === 'month' && sortedKeys.length > 12) {
            sortedKeys = sortedKeys.slice(-12);
        }

        return sortedKeys.map(key => ({ label: key, count: groups[key] }));
    }, [businesses, granularity]);

    const maxCount = Math.max(...chartData.map(d => d.count), 5);
    const yAxisLabels = [maxCount, Math.round(maxCount / 2), 0];

    const handleMouseMove = (e: React.MouseEvent, label: string, count: number) => {
        setTooltip({ label, count, top: e.clientY, left: e.clientX });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 relative">
            {tooltip && createPortal(
                <div
                    className="absolute z-50 p-3 text-sm bg-white border border-gray-200 rounded-lg shadow-xl pointer-events-none transition-opacity duration-200"
                    style={{ top: tooltip.top + 15, left: tooltip.left + 15 }}
                >
                    <p className="font-bold text-black">{tooltip.label}</p>
                    <p className="text-gray-600">{tooltip.count} Negocios nuevos</p>
                </div>,
                document.body
            )}

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black">Crecimiento de Negocios</h3>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Tendencia por {granularity === 'day' ? 'Día' : granularity === 'month' ? 'Mes' : 'Año'}</div>
            </div>

            <div className="w-full h-[300px] flex">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between h-full pb-8 pr-4 text-right min-w-[30px]">
                    {yAxisLabels.map((label) => (
                        <span key={label} className="text-xs text-gray-400 font-medium">{label}</span>
                    ))}
                </div>

                <div className="w-full h-full flex flex-col">
                    <div className="flex-grow relative border-l border-b border-gray-100">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 grid grid-rows-2 pointer-events-none">
                            <div className="border-b border-dashed border-gray-100"></div>
                            <div className="border-b border-dashed border-gray-100"></div>
                        </div>

                        {/* Bars */}
                        <div className="absolute bottom-0 left-0 right-0 h-full flex justify-around items-end px-2">
                            {chartData.length > 0 ? chartData.map(({ label, count }, idx) => (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col justify-end items-center group relative pt-4 hover:bg-gray-50 rounded-t-lg transition-colors cursor-pointer"
                                    onMouseMove={(e) => handleMouseMove(e, label, count)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    <div
                                        className="w-4/5 sm:w-12 bg-gradient-to-t from-[#4D17FF] to-[#7C3AED] rounded-t-md transition-all group-hover:brightness-110 shadow-sm"
                                        style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? '4px' : '0' }}
                                    ></div>
                                </div>
                            )) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 italic">No hay datos suficientes para graficar</div>
                            )}
                        </div>
                    </div>

                    {/* X-Axis */}
                    <div className="h-10 flex justify-around items-center pt-2 px-2 overflow-hidden">
                        {chartData.map(({ label }, idx) => (
                            <div key={idx} className="flex-1 text-center overflow-hidden">
                                <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate block px-1">{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminKpisPage: React.FC = () => {
    const [businesses, setBusinesses] = useState<BusinessAdminData[]>([]);
    const [loading, setLoading] = useState(true);
    const [granularity, setGranularity] = useState<Granularity>('month');
    const { showToast } = useToast();

    useEffect(() => {
        document.title = 'KPIs | Super Admin | Loyalfly';
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAllBusinessesForSuperAdmin();
                setBusinesses(data);
            } catch (error) {
                console.error("Failed to fetch businesses data:", error);
                showToast('No se pudieron cargar los datos.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const totalBusinesses = businesses.length;
    const totalCustomers = businesses.reduce((sum, b) => sum + b.customerCount, 0);
    const totalStamps = businesses.reduce((sum, b) => sum + b.totalStamps, 0);
    const totalRewards = businesses.reduce((sum, b) => sum + b.totalRewards, 0);

    const planDistribution = businesses.reduce((acc, b) => {
        const plan = b.plan || 'Gratis';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });
    
    const pieChartData = [
        { name: 'Gratis', value: planDistribution['Gratis'] || 0, color: '#A78BFA' }, // purple-400
        { name: 'Entrepreneur', value: planDistribution['Entrepreneur'] || 0, color: '#7C3AED' }, // purple-600
        { name: 'Pro', value: planDistribution['Pro'] || 0, color: '#4D17FF' } // Main accent
    ];
    
    const topBusinesses = [...businesses]
        .sort((a, b) => b.customerCount - a.customerCount)
        .slice(0, 10);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">KPIs de la Plataforma</h1>
                    <p className="text-gray-600 mt-1">Una visión general del rendimiento de Loyalfly.</p>
                </div>
                
                {/* Granularity Selectors */}
                <div className="flex items-center bg-gray-100 p-1 rounded-lg self-start">
                    {(['day', 'month', 'year'] as Granularity[]).map((g) => (
                        <button
                            key={g}
                            onClick={() => setGranularity(g)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                granularity === g 
                                ? 'bg-white text-black shadow-sm' 
                                : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            {g === 'day' ? 'Día' : g === 'month' ? 'Mes' : 'Año'}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Negocios" value={totalBusinesses} />
                <StatCard title="Total de Clientes" value={totalCustomers} />
                <StatCard title="Sellos Otorgados" value={totalStamps} />
                <StatCard title="Recompensas Canjeadas" value={totalRewards} />
            </div>

            {/* Growth Chart Section */}
            <GrowthChart businesses={businesses} granularity={granularity} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-black mb-6">Distribución de Planes</h3>
                    <div className="flex-grow flex items-center justify-center">
                        <PieChart data={pieChartData} />
                    </div>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-black mb-4">Top 10 Negocios por Clientes</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-base text-left text-gray-600">
                             <thead className="text-base text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3">Negocio</th>
                                    <th scope="col" className="px-4 py-3 text-center">Clientes</th>
                                    <th scope="col" className="px-4 py-3">Plan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topBusinesses.length > 0 ? (
                                    topBusinesses.map((business) => (
                                        <tr key={business.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-900">{business.name}</td>
                                            <td className="px-4 py-3 text-center font-semibold">{business.customerCount}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                    business.plan === 'Pro' ? 'bg-indigo-100 text-indigo-700' :
                                                    business.plan === 'Entrepreneur' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {business.plan || 'Gratis'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-8 text-gray-500">No hay datos de negocios.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminKpisPage;