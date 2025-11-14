import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBusinessData, getBusinessMetrics } from '../services/firebaseService';
import type { Business, Customer } from '../types';
import type { BusinessMetrics } from '../services/firebaseService';

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-base text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-black mt-1">{value}</p>
        <p className="text-base text-gray-500 mt-2">{description}</p>
    </div>
);

const LineChart: React.FC<{ data: { month: string; count: number }[]; title: string }> = ({ data, title }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid division by zero
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-black mb-4">{title}</h3>
            <div className="flex justify-between items-end h-64 border-l border-b border-gray-200 pl-4 pb-4">
                {data.map(({ month, count }) => (
                    <div key={month} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                            className="w-1/2 bg-[#4D17FF] rounded-t-md hover:opacity-80 transition-opacity"
                            style={{ height: `${(count / maxCount) * 100}%` }}
                            title={`${count} nuevo${count !== 1 ? 's' : ''} cliente${count !== 1 ? 's' : ''}`}
                        ></div>
                        <span className="text-sm text-gray-500 mt-2">{month}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MetricasPage: React.FC = () => {
    const { user } = useAuth();
    const [businessData, setBusinessData] = useState<Business | null>(null);
    const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Métricas | Loyalfly App';
        const fetchData = async () => {
            if (!user) return;
            try {
                const [business, businessMetrics] = await Promise.all([
                    getBusinessData(user.uid),
                    getBusinessMetrics(user.uid)
                ]);
                setBusinessData(business);
                setMetrics(businessMetrics);
            } catch (error) {
                console.error("Failed to fetch metrics data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }
    
    if (!metrics || !businessData) {
        return <p className="text-center text-gray-600">No se pudieron cargar las métricas.</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-black tracking-tight">Métricas de Lealtad</h1>
                <p className="text-gray-600 mt-1">Un resumen del rendimiento de tu programa de lealtad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total de Clientes" value={businessData.customerCount} description="Miembros activos en tu programa." />
                <StatCard title="Sellos Otorgados" value={metrics.totalStamps} description="Total de sellos entregados a clientes." />
                <StatCard title="Recompensas Canjeadas" value={metrics.totalRewards} description="Clientes que completaron su tarjeta." />
                <StatCard title="Tasa de Redención" value={`${metrics.redemptionRate.toFixed(1)}%`} description="De los sellos para recompensa, cuántos se canjean." />
            </div>
            
            <LineChart data={metrics.newCustomersByMonth} title="Crecimiento de Nuevos Clientes (Últimos 6 Meses)" />

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">Clientes Más Leales</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-base text-left text-gray-600">
                        <thead className="text-base text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3">Nombre</th>
                                <th scope="col" className="px-4 py-3 text-center">Sellos</th>
                                <th scope="col" className="px-4 py-3 text-center">Recompensas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.topCustomers.length > 0 ? (
                                metrics.topCustomers.map((customer: Customer) => (
                                    <tr key={customer.id} className="border-b last:border-b-0">
                                        <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
                                        <td className="px-4 py-3 text-center">{customer.stamps}</td>
                                        <td className="px-4 py-3 text-center">{customer.rewardsRedeemed}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">No hay suficientes datos de clientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default MetricasPage;
