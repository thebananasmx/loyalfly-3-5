import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { getAllBusinessesForSuperAdmin } from '../services/firebaseService';
import type { BusinessAdminData } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';

type Granularity = 'day' | 'month' | 'year';
type Metric = 'businesses' | 'customers';

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

const GrowthLineChart: React.FC<{ businesses: BusinessAdminData[], granularity: Granularity, metric: Metric }> = ({ businesses, granularity, metric }) => {
    const [tooltip, setTooltip] = useState<{ label: string; count: number; top: number; left: number } | null>(null);

    const chartData = useMemo(() => {
        const groups: { [key: string]: { count: number, timestamp: number } } = {};
        
        const processDate = (ts: number) => {
            const date = new Date(ts);
            let key = '';
            let sortKey = 0;
            
            if (granularity === 'day') {
                key = date.toISOString().split('T')[0];
                sortKey = new Date(key).getTime();
            } else if (granularity === 'month') {
                key = date.toLocaleString('es-MX', { month: 'short', year: 'numeric' });
                sortKey = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
            } else {
                key = date.getFullYear().toString();
                sortKey = new Date(date.getFullYear(), 0, 1).getTime();
            }
            
            if (!groups[key]) {
                groups[key] = { count: 0, timestamp: sortKey };
            }
            groups[key].count += 1;
        };

        if (metric === 'businesses') {
            businesses.forEach(b => b.rawCreatedAt && processDate(b.rawCreatedAt));
        } else {
            businesses.forEach(b => b.customerEnrollmentDates?.forEach(ts => processDate(ts)));
        }

        // Sort chronologically (Oldest to Newest)
        const sorted = Object.entries(groups)
            .map(([label, data]) => ({ label, ...data }))
            .sort((a, b) => a.timestamp - b.timestamp);

        // Limit data points for readability but keep chronological order
        if (granularity === 'day') return sorted.slice(-15);
        if (granularity === 'month') return sorted.slice(-12);
        return sorted;
    }, [businesses, granularity, metric]);

    const maxCount = Math.max(...chartData.map(d => d.count), 1);
    const yAxisLabels = [maxCount, Math.round(maxCount / 2), 0];
    
    // SVG coordinate system
    const chartHeight = 300;
    const chartWidth = 1000;
    
    const getX = (idx: number) => (idx / (chartData.length - 1 || 1)) * chartWidth;
    const getY = (count: number) => chartHeight - (count / maxCount) * chartHeight;

    const points = chartData.map((d, i) => ({ x: getX(i), y: getY(d.count) }));
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length - 1]?.x || chartWidth} ${chartHeight} L ${points[0]?.x || 0} ${chartHeight} Z`;

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
                    <p className="text-gray-600 font-medium">{tooltip.count} Nuevos {metric === 'businesses' ? 'Negocios' : 'Clientes'}</p>
                </div>,
                document.body
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-black">Tendencia de Crecimiento</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">
                        Mostrando nuevos {metric === 'businesses' ? 'registros de negocios' : 'clientes inscritos'}
                    </p>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-bold bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {granularity === 'day' ? 'Diario' : granularity === 'month' ? 'Mensual' : 'Anual'}
                </div>
            </div>

            <div className="w-full h-[320px] flex">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between h-[300px] pr-4 text-right min-w-[40px]">
                    {yAxisLabels.map((label) => (
                        <span key={label} className="text-xs text-gray-400 font-bold">{label}</span>
                    ))}
                </div>

                <div className="w-full h-full flex flex-col">
                    <div className="h-[300px] relative border-l border-b border-gray-200 group">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 grid grid-rows-2 pointer-events-none">
                            <div className="border-b border-dashed border-gray-100"></div>
                            <div className="border-b border-dashed border-gray-100"></div>
                        </div>

                        {chartData.length > 1 ? (
                            <svg 
                                className="absolute inset-0 w-full h-full overflow-visible" 
                                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4D17FF" stopOpacity="0.15" />
                                        <stop offset="100%" stopColor="#4D17FF" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Area fill */}
                                <path d={areaData} fill="url(#areaGradient)" className="transition-all duration-500" />
                                
                                {/* Connection Line */}
                                <path 
                                    d={pathData} 
                                    fill="none" 
                                    stroke="#4D17FF" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    className="transition-all duration-500"
                                />
                                
                                {/* Data Points */}
                                {points.map((p, i) => (
                                    <circle
                                        key={i}
                                        cx={p.x}
                                        cy={p.y}
                                        r="6"
                                        className="fill-white stroke-[#4D17FF] stroke-[3px] hover:r-8 transition-all cursor-crosshair shadow-sm"
                                        onMouseMove={(e) => handleMouseMove(e as any, chartData[i].label, chartData[i].count)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                ))}
                            </svg>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-sm">
                                Se necesitan más datos para trazar la línea de tiempo
                            </div>
                        )}
                    </div>

                    {/* X-Axis Labels */}
                    <div className="h-10 flex justify-around items-center pt-3 px-1">
                        {chartData.map(({ label }, idx) => (
                            <div key={idx} className="flex-1 text-center overflow-hidden">
                                <span className="text-[10px] sm:text-xs text-gray-400 font-bold truncate block">
                                    {label}
                                </span>
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
    const [activeMetric, setActiveMetric] = useState<Metric>('businesses');
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
        { name: 'Gratis', value: planDistribution['Gratis'] || 0, color: '#A78BFA' },
        { name: 'Entrepreneur', value: planDistribution['Entrepreneur'] || 0, color: '#7C3AED' },
        { name: 'Pro', value: planDistribution['Pro'] || 0, color: '#4D17FF' }
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
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">KPIs de la Plataforma</h1>
                    <p className="text-gray-600 mt-1">Supervisión integral del crecimiento y adopción.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                    {/* Metric Selector */}
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => setActiveMetric('businesses')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                                activeMetric === 'businesses' 
                                ? 'bg-black text-white shadow-sm' 
                                : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            Negocios
                        </button>
                        <button
                            onClick={() => setActiveMetric('customers')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                                activeMetric === 'customers' 
                                ? 'bg-black text-white shadow-sm' 
                                : 'text-gray-500 hover:text-black'
                            }`}
                        >
                            Clientes
                        </button>
                    </div>

                    {/* Granularity Selectors */}
                    <div className="flex items-center bg-gray-200 p-1 rounded-lg border border-gray-300">
                        {(['day', 'month', 'year'] as Granularity[]).map((g) => (
                            <button
                                key={g}
                                onClick={() => setGranularity(g)}
                                className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Negocios" value={totalBusinesses} />
                <StatCard title="Total de Clientes" value={totalCustomers} />
                <StatCard title="Sellos Otorgados" value={totalStamps} />
                <StatCard title="Recompensas Canjeadas" value={totalRewards} />
            </div>

            {/* Growth Line Chart Section */}
            <GrowthLineChart businesses={businesses} granularity={granularity} metric={activeMetric} />

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