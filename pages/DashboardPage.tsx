import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers } from '../services/firebaseService';
import type { Customer } from '../types';
import { useAuth } from '../context/AuthContext';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = 'Dashboard | Loyalfly App';
        const fetchCustomers = async () => {
            if (!user) return;
            try {
                const data = await getCustomers(user.uid);
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
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
    
    return (
        <div>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-3xl font-bold text-black tracking-tight">Dashboard de Clientes</h1>
                    <Link
                        to="/app/nuevo-cliente"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                        <UserPlusIcon />
                        Nuevo Cliente
                    </Link>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                     <div className="overflow-x-auto">
                        <table className="w-full text-base text-left text-gray-600">
                            <thead className="text-base text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-4 py-3 sm:px-6">Nombre</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6">Teléfono</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 hidden md:table-cell">Email</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 hidden lg:table-cell">Fecha de Inscripción</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 text-center">Sellos</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 text-center">Recompensas</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap">{customer.name}</td>
                                        <td className="px-4 py-4 sm:px-6">{customer.phone}</td>
                                        <td className="px-4 py-4 sm:px-6 hidden md:table-cell">{customer.email}</td>
                                        <td className="px-4 py-4 sm:px-6 hidden lg:table-cell">{customer.enrollmentDate}</td>
                                        <td className="px-4 py-4 sm:px-6 text-center">{customer.stamps}</td>
                                        <td className="px-4 py-4 sm:px-6 text-center">{customer.rewardsRedeemed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Link
                to="/app/agregar-sello"
                className="fixed bottom-6 right-6 bg-[#00AA00] text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00AA00]"
                title="Agregar Sello"
            >
                <span className="sr-only">Agregar Sello</span>
                <PlusIcon />
            </Link>
        </div>
    );
};

export default DashboardPage;