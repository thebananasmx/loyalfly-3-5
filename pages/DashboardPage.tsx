import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomers, addStampToCustomer, searchCustomers } from '../services/firebaseService';
import type { Customer } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmationModal from '../components/ConfirmationModal';

const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 11a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1v-1z" /></svg>;
const StampIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

const Highlight: React.FC<{ text: string; query: string }> = ({ text, query }) => {
    if (!text || !query || query.length < 3) {
        return <>{text}</>;
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="bg-yellow-200">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isStampModalOpen, setIsStampModalOpen] = useState(false);
    const [stampQuantity, setStampQuantity] = useState(1);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Effect for initial load of recent customers
    useEffect(() => {
        document.title = 'Dashboard | Loyalfly App';
        const fetchRecentCustomers = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await getCustomers(user.uid);
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch recent customers:", error);
                showToast('No se pudieron cargar los clientes recientes.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchRecentCustomers();
    }, [user]);

    // Effect for handling search queries
    useEffect(() => {
        const performSearch = async () => {
            if (!user) return;
            
            if (debouncedSearchQuery.length < 3) {
                if (searchQuery === '') { // Only refetch recents if search is cleared
                    setLoading(true);
                    getCustomers(user.uid).then(data => {
                        setCustomers(data);
                    }).finally(() => setLoading(false));
                }
                return;
            }

            setIsSearching(true);
            try {
                const results = await searchCustomers(user.uid, debouncedSearchQuery);
                setCustomers(results);
            } catch (error) {
                console.error("Failed to search customers:", error);
                showToast('Ocurrió un error al buscar.', 'error');
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [debouncedSearchQuery, user]);

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

    const renderTableBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={7} className="text-center px-6 py-12">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black" role="status">
                                <span className="sr-only">Cargando...</span>
                            </div>
                        </div>
                    </td>
                </tr>
            );
        }

        if (customers.length > 0) {
            return customers.map((customer) => (
                <tr key={customer.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap"><Highlight text={customer.name} query={debouncedSearchQuery} /></td>
                    <td className="px-4 py-4 sm:px-6"><Highlight text={customer.phone} query={debouncedSearchQuery} /></td>
                    <td className="px-4 py-4 sm:px-6 hidden md:table-cell"><Highlight text={customer.email} query={debouncedSearchQuery} /></td>
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
            ));
        }

        return (
            <tr>
                <td colSpan={7} className="text-center px-6 py-12 text-gray-500">
                    {searchQuery ? 'No se encontraron clientes que coincidan con tu búsqueda.' : 'Aún no tienes clientes registrados.'}
                </td>
            </tr>
        );
    };

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
                
                <div>
                    <label htmlFor="customer-search" className="sr-only">Buscar cliente</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            id="customer-search"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-base"
                            placeholder="Buscar por nombre, teléfono o email (3+ caracteres)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                         {isSearching && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-black"></div>
                            </div>
                        )}
                    </div>
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
                                {renderTableBody()}
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