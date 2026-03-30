
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBusinessData, getAllCustomers } from '../services/firebaseService';
import CardPreview from '../components/CardPreview';
import { useToast } from '../context/ToastContext';
import type { Business, Customer } from '../types';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

const AdminBusinessDetailPage: React.FC = () => {
    const { businessId } = useParams<{ businessId: string }>();
    const [business, setBusiness] = useState<Business | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [advancedMetrics, setAdvancedMetrics] = useState<{
        avgRecurrence: number;
        avgLifetime: number;
        retentionRate: number;
        avgRedemptionSpeed: number;
        churnRate: number;
    } | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        document.title = 'Detalle de Negocio | Admin | Loyalfly';
        const loadData = async () => {
            if (!businessId) return;
            setLoading(true);
            try {
                const [busData, customersData] = await Promise.all([
                    getBusinessData(businessId),
                    getAllCustomers(businessId)
                ]);
                setBusiness(busData);
                setCustomers(customersData);

                // Calculate Advanced Metrics
                if (customersData.length > 0) {
                    const stampsGoal = busData?.cardSettings?.stampsGoal || 10;
                    
                    // Retention Rate: Customers with more than 1 stamp (or at least one reward)
                    const retainedCustomers = customersData.filter(c => (c.stamps + (c.rewardsRedeemed * stampsGoal)) > 1);
                    const retentionRate = (retainedCustomers.length / customersData.length) * 100;

                    // For the other metrics, we need transaction dates. 
                    // To avoid massive fetching, we'll fetch transactions for a sample or all if not too many.
                    // For now, let's fetch for all since it's an admin view.
                    const transactionsPromises = customersData.map(c => 
                        import('../services/firebaseService').then(m => m.getCustomerTransactions(businessId, c.id))
                    );
                    const allCustomerTransactions = await Promise.all(transactionsPromises);

                    let totalRecurrenceDays = 0;
                    let recurrenceCount = 0;
                    let totalLifetimeDays = 0;
                    let totalRedemptionDays = 0;
                    let redemptionCount = 0;
                    let churnedCount = 0;
                    const now = new Date();
                    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

                    allCustomerTransactions.forEach((txs, index) => {
                        if (txs.length === 0) return;

                        const sortedTxs = [...txs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                        const firstTx = new Date(sortedTxs[0].date);
                        const lastTx = new Date(sortedTxs[sortedTxs.length - 1].date);

                        // Lifetime
                        totalLifetimeDays += (lastTx.getTime() - firstTx.getTime()) / (1000 * 60 * 60 * 24);

                        // Recurrence
                        if (sortedTxs.length > 1) {
                            const daysDiff = (lastTx.getTime() - firstTx.getTime()) / (1000 * 60 * 60 * 24);
                            totalRecurrenceDays += daysDiff / (sortedTxs.length - 1);
                            recurrenceCount++;
                        }

                        // Churn (Inactive for > 30 days)
                        if (lastTx < thirtyDaysAgo) {
                            churnedCount++;
                        }

                        // Redemption Speed (Approximate: time to get a reward)
                        const rewardTxs = sortedTxs.filter(t => t.type === 'reward');
                        if (rewardTxs.length > 0) {
                            rewardTxs.forEach(rtx => {
                                const rDate = new Date(rtx.date);
                                totalRedemptionDays += (rDate.getTime() - firstTx.getTime()) / (1000 * 60 * 60 * 24) / rewardTxs.length;
                            });
                            redemptionCount++;
                        }
                    });

                    setAdvancedMetrics({
                        avgRecurrence: recurrenceCount > 0 ? totalRecurrenceDays / recurrenceCount : 0,
                        avgLifetime: customersData.length > 0 ? totalLifetimeDays / customersData.length : 0,
                        retentionRate,
                        avgRedemptionSpeed: redemptionCount > 0 ? totalRedemptionDays / redemptionCount : 0,
                        churnRate: (churnedCount / customersData.length) * 100
                    });
                }
            } catch (err) {
                console.error(err);
                showToast('Error al cargar datos del negocio', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [businessId, showToast]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-black" role="status">
                    <span className="sr-only">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No se encontró el negocio.</p>
                <Link to="/admin/dashboard" className="text-[#4D17FF] hover:underline mt-4 inline-block">
                    Volver al Dashboard
                </Link>
            </div>
        );
    }

    const previewCustomer = customers.length > 0 ? customers[0] : null;
    const cardSettings = business.cardSettings || {};

    // Calculate metrics
    const totalRevenue = customers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);
    const avgSpendPerCustomer = customers.length > 0 ? totalRevenue / customers.length : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center justify-center p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    title="Volver al Dashboard"
                >
                    <ArrowLeftIcon />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-black tracking-tight">{business.name}</h1>
                    <p className="text-gray-500">{business.email}</p>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative group">
                    <div className="flex items-center justify-between">
                        <p className="text-base text-gray-500 font-medium">Lifetime Value (LTV)</p>
                        <div className="relative group/tooltip">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10">
                                El Lifetime Value (LTV) representa el valor total acumulado generado por todos tus clientes. Se calcula sumando el monto total de compra registrado para cada cliente.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-black mt-2">
                        ${totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Valor total acumulado de todos los clientes</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <p className="text-base text-gray-500 font-medium">Gasto Promedio por Cliente</p>
                    <p className="text-3xl font-bold text-black mt-2">
                        ${avgSpendPerCustomer.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Promedio de gasto total por cada cliente registrado</p>
                </div>
            </div>

            {/* Advanced Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Recurrence */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative group/tooltip">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Recurrencia Promedio</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-bold text-black">
                        {advancedMetrics?.avgRecurrence.toFixed(1) || '0'} <span className="text-sm font-normal text-gray-500">días</span>
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Tiempo promedio que pasa entre una visita y otra de un mismo cliente.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                {/* Lifetime */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative group/tooltip">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tiempo Vida Promedio</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-bold text-black">
                        {advancedMetrics?.avgLifetime.toFixed(0) || '0'} <span className="text-sm font-normal text-gray-500">días</span>
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Tiempo promedio que un cliente permanece activo desde su primera hasta su última visita.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                {/* Retention Rate */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative group/tooltip">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tasa de Retención</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-bold text-black">
                        {advancedMetrics?.retentionRate.toFixed(1) || '0'}%
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Porcentaje de clientes que han regresado al menos una vez después de su registro.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                {/* Redemption Speed */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative group/tooltip">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Velocidad de Canje</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-bold text-black">
                        {advancedMetrics?.avgRedemptionSpeed.toFixed(0) || '0'} <span className="text-sm font-normal text-gray-500">días</span>
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Tiempo promedio que le toma a un cliente completar una tarjeta de sellos.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>

                {/* Churn Rate */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative group/tooltip">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tasa de Abandono</p>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl font-bold text-black">
                        {advancedMetrics?.churnRate.toFixed(1) || '0'}%
                    </p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-black text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                        Porcentaje de clientes que no han tenido actividad en los últimos 30 días.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Column 1: Card Preview */}
                <div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-black mb-4">Tarjeta Configurada</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Visualización con datos del {previewCustomer ? 'primer cliente registrado' : 'cliente de ejemplo'}.
                        </p>
                        <div className="flex justify-center bg-gray-50 p-4 rounded-lg">
                            <CardPreview
                                businessName={cardSettings.name || business.name}
                                rewardText={cardSettings.reward || 'Recompensa'}
                                cardColor={cardSettings.color || '#FEF3C7'}
                                stamps={previewCustomer ? previewCustomer.stamps : 4}
                                textColorScheme={cardSettings.textColorScheme || 'dark'}
                                logoUrl={cardSettings.logoUrl}
                                customerName={previewCustomer?.name || 'Juan Pérez'}
                                customerPhone={previewCustomer?.phone || '5512345678'}
                                customerId={previewCustomer?.id}
                                stampsGoal={cardSettings.stampsGoal}
                                stampIconType={cardSettings.stampIconType}
                                stampColor={cardSettings.stampColor}
                                customStampUrl={cardSettings.customStampUrl}
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Customers Table */}
                <div>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-black">Lista de Clientes</h2>
                            <p className="text-gray-500 mt-1">Total: {customers.length} clientes registrados</p>
                        </div>
                        <div className="overflow-x-auto flex-grow">
                            <table className="w-full text-base text-left text-gray-600">
                                <thead className="text-base text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Nombre</th>
                                        <th scope="col" className="px-6 py-3">Teléfono</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3 text-center">Sellos</th>
                                        <th scope="col" className="px-6 py-3 text-right">Gasto Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.length > 0 ? (
                                        customers.map((customer) => (
                                            <tr key={customer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{customer.name}</td>
                                                <td className="px-6 py-4">{customer.phone}</td>
                                                <td className="px-6 py-4">{customer.email || '-'}</td>
                                                <td className="px-6 py-4 text-center">{customer.stamps}</td>
                                                <td className="px-6 py-4 text-right font-medium text-black">
                                                    ${(customer.totalSpent || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                Este negocio aún no tiene clientes registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBusinessDetailPage;
