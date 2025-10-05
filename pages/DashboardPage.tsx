import React, { useState, useEffect } from 'react';
import { getCustomers } from '../services/firebaseService';
import type { Customer } from '../types';

const DashboardPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-black">Dashboard de Clientes</h1>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-4 py-3 sm:px-6">Nombre</th>
                                <th scope="col" className="px-4 py-3 sm:px-6">Email</th>
                                <th scope="col" className="px-4 py-3 sm:px-6 hidden md:table-cell">Teléfono</th>
                                <th scope="col" className="px-4 py-3 sm:px-6 hidden lg:table-cell">Fecha de Inscripción</th>
                                <th scope="col" className="px-4 py-3 sm:px-6 text-center">Sellos</th>
                                <th scope="col" className="px-4 py-3 sm:px-6 text-center">Recompensas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap">{customer.name}</td>
                                    <td className="px-4 py-4 sm:px-6">{customer.email}</td>
                                    <td className="px-4 py-4 sm:px-6 hidden md:table-cell">{customer.phone}</td>
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
    );
};

export default DashboardPage;
