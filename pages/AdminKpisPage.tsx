import React, { useState, useEffect } from 'react';
import { getAllBusinessesForSuperAdmin } from '../services/firebaseService';
import type { BusinessAdminData } from '../services/firebaseService';
import { useToast } from '../context/ToastContext';

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
                className="w-48 h-48 rounded-full" 
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

const AdminKpisPage: React.FC = () => {
    const [businesses, setBusinesses] = useState<BusinessAdminData[]>([]);
    const [loading, setLoading] = useState(true);
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
            <div>
                <h1 className="text-3xl font-bold text-black tracking-tight">KPIs de la Plataforma</h1>
                <p className="text-gray-600 mt-1">Una visión general del rendimiento de Loyalfly.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Negocios" value={totalBusinesses} />
                <StatCard title="Total de Clientes" value={totalCustomers} />
                <StatCard title="Sellos Otorgados" value={totalStamps} />
                <StatCard title="Recompensas Canjeadas" value={totalRewards} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-black mb-4">Distribución de Planes</h3>
                    <PieChart data={pieChartData} />
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
                                        <tr key={business.id} className="border-b last:border-b-0">
                                            <td className="px-4 py-3 font-medium text-gray-900">{business.name}</td>
                                            <td className="px-4 py-3 text-center font-semibold">{business.customerCount}</td>
                                            <td className="px-4 py-3">{business.plan}</td>
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
