import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, addStampToCustomer } from '../services/firebaseService';
import type { Customer } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;
const StampIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;


const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isStampModalOpen, setIsStampModalOpen] = useState(false);
    const [stampQuantity, setStampQuantity] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleOpenStampModal = (customer: Customer) => {
        setSelectedCustomer(customer);
        setStampQuantity(1);
        setIsStampModalOpen(true);
    };

    const handleQuantityChange = (newQuantity: number) => {
        setStampQuantity(Math.max(1, newQuantity));
    };
    
    const handleConfirmAddStamp = async () => {
        if (!selectedCustomer || !user) return;
        setIsUpdating(true);
        try {
            const updatedCustomer = await addStampToCustomer(user.uid, selectedCustomer.id, stampQuantity);
            setCustomers(prevCustomers => 
                prevCustomers.map(c => 
                    c.id === updatedCustomer.id ? updatedCustomer : c
                )
            );

            const pluralStamps = stampQuantity > 1 ? 'sellos' : 'sello';
            const pluralAgregados = stampQuantity > 1 ? 'agregados' : 'agregado';
            const successMessage = `¡${stampQuantity} ${pluralStamps} ${pluralAgregados}! ${updatedCustomer.name} ahora tiene ${updatedCustomer.stamps} sellos.`;
            showToast(successMessage, 'success');
        } catch (err) {
             showToast('No se pudo agregar el sello. Inténtalo de nuevo.', 'error');
        } finally {
            setIsUpdating(false);
            setIsStampModalOpen(false);
            setSelectedCustomer(null);
        }
    };

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
                                    <th scope="col" className="px-4 py-3 sm:px-6 text-right">Acciones</th>
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
                                        <td className="px-4 py-4 sm:px-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() => handleOpenStampModal(customer)}
                                                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-white bg-[#00AA00] rounded-md hover:bg-opacity-90 transition-colors"
                                                    title="Agregar Sello"
                                                >
                                                    <StampIcon />
                                                    <span>Sello</span>
                                                </button>
                                                <Link
                                                    to={`/app/editar-cliente/${customer.id}`}
                                                    className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                                >
                                                    <EditIcon/>
                                                    <span>Editar</span>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {selectedCustomer && (
                <ConfirmationModal
                    isOpen={isStampModalOpen}
                    onClose={() => setIsStampModalOpen(false)}
                    onConfirm={handleConfirmAddStamp}
                    title="Agregar Sellos"
                    confirmText={isUpdating ? 'Agregando...' : `Agregar ${stampQuantity} Sello${stampQuantity > 1 ? 's' : ''}`}
                >
                    <p className="mb-4 text-center">Selecciona la cantidad de sellos a agregar:</p>
                    <div className="flex items-center justify-center gap-3">
                        <button 
                            onClick={() => handleQuantityChange(stampQuantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                            disabled={stampQuantity <= 1 || isUpdating}
                            aria-label="Disminuir cantidad"
                        >
                            -
                        </button>
                        <input
                            type="number"
                            min="1"
                            value={stampQuantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                            className="w-20 h-10 text-center font-bold text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black"
                            aria-label="Cantidad de sellos"
                            disabled={isUpdating}
                        />
                        <button 
                            onClick={() => handleQuantityChange(stampQuantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-xl font-bold text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            aria-label="Aumentar cantidad"
                            disabled={isUpdating}
                        >
                            +
                        </button>
                    </div>
                    <div className="mt-4 text-center bg-gray-50 p-3 rounded-md border border-gray-200">
                        <p className="font-semibold">{selectedCustomer.name}</p>
                        <p className="text-base text-gray-500">{selectedCustomer.phone}</p>
                    </div>
                </ConfirmationModal>
            )}
        </div>
    );
};

export default DashboardPage;