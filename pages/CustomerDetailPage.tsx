
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, getCustomerTransactions, getBusinessData } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Customer, Business } from '../types';
import { ArrowLeft, User, Phone, Mail, Calendar, CreditCard, History, Star } from 'lucide-react';

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [business, setBusiness] = useState<Business | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user || !id) return;
            setLoading(true);
            try {
                const [customerData, businessData, transactionsData] = await Promise.all([
                    getCustomerById(user.uid, id),
                    getBusinessData(user.uid),
                    getCustomerTransactions(user.uid, id)
                ]);

                if (customerData) {
                    setCustomer(customerData);
                    setBusiness(businessData);
                    setTransactions(transactionsData);
                    document.title = `${customerData.name} | Detalle de Cliente`;
                } else {
                    showToast('Cliente no encontrado', 'error');
                    navigate('/app/dashboard');
                }
            } catch (error) {
                console.error("Error fetching customer detail:", error);
                showToast('Error al cargar los detalles del cliente', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user, navigate, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-[#4D17FF]"></div>
            </div>
        );
    }

    if (!customer) return null;

    const stampsGoal = business?.cardSettings?.stampsGoal || 10;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Link 
                to="/app/dashboard" 
                className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver al Dashboard
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400 mb-4">
                                {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{customer.name}</h1>
                            <p className="text-gray-500 mb-6">Cliente desde {customer.enrollmentDate}</p>
                            
                            <div className="w-full pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                    <span className="text-base">{customer.phone}</span>
                                </div>
                                {customer.email && (
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                        <span className="text-base truncate">{customer.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Resumen de Actividad</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Gastado</p>
                                <p className="text-3xl font-bold text-gray-900">${customer.totalSpent?.toLocaleString() || '0.00'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Sellos</p>
                                    <p className="text-2xl font-bold text-gray-900">{customer.stamps} / {stampsGoal}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Premios</p>
                                    <p className="text-2xl font-bold text-gray-900">{customer.rewardsRedeemed}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                            <div className="flex items-center">
                                <History className="w-6 h-6 mr-3 text-[#4D17FF]" />
                                <h2 className="text-xl font-bold text-gray-900">Historial de Transacciones</h2>
                            </div>
                            <span className="text-sm text-gray-400 font-medium">{transactions.length} registros</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Fecha</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipo</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Cantidad</th>
                                        <th className="px-8 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.length > 0 ? (
                                        transactions.map((t) => (
                                            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {new Date(t.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(t.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        t.type === 'stamp' ? 'bg-purple-50 text-[#4D17FF]' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                        {t.type === 'stamp' ? 'Sello Agregado' : 'Recompensa Canjeada'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {t.type === 'stamp' ? `+${t.quantity}` : `-${stampsGoal}`}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {t.amount > 0 ? `$${t.amount.toLocaleString()}` : '-'}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-gray-400">
                                                No hay transacciones registradas para este cliente.
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

export default CustomerDetailPage;
