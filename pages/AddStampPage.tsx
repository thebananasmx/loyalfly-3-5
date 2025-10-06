
import React, { useState } from 'react';
import { getCustomerByPhone, addStampToCustomer } from '../services/firebaseService';
import type { Customer } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

const AddStampPage: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFoundCustomer(null);
        setUpdateSuccess('');
        try {
            const customer = await getCustomerByPhone(phone);
            if (customer) {
                setFoundCustomer(customer);
            } else {
                setError('Cliente no encontrado. Verifica el número de teléfono.');
            }
        } catch (err) {
            setError('Ocurrió un error al buscar el cliente.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAddStamp = async () => {
        if (!foundCustomer) return;

        setIsUpdating(true);
        try {
            const updatedCustomer = await addStampToCustomer(foundCustomer.id);
            setFoundCustomer(updatedCustomer);
            setUpdateSuccess(`¡Sello agregado! ${updatedCustomer.name} ahora tiene ${updatedCustomer.stamps} sellos.`);
        } catch (err) {
             setError('No se pudo agregar el sello. Inténtalo de nuevo.');
        } finally {
            setIsUpdating(false);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-black tracking-tight mb-6">Agregar Sello a Cliente</h1>

            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-grow">
                        <label htmlFor="phone" className="sr-only">Número de Teléfono</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                            placeholder="Buscar por número de teléfono"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                    >
                        {loading ? 'Buscando...' : 'Buscar Cliente'}
                    </button>
                </form>
            </div>
            
            {error && <p className="mt-4 text-base text-red-600">{error}</p>}
            {updateSuccess && <p className="mt-4 text-base text-[#00AA00]">{updateSuccess}</p>}

            {foundCustomer && (
                <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-black">Cliente Encontrado</h2>
                    <div className="mt-4 space-y-2 text-base">
                        <p><span className="font-medium text-gray-600">Nombre:</span> {foundCustomer.name}</p>
                        <p><span className="font-medium text-gray-600">Teléfono:</span> {foundCustomer.phone}</p>
                        <p><span className="font-medium text-gray-600">Sellos Actuales:</span> {foundCustomer.stamps}</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={isUpdating}
                        className="mt-6 w-full py-2.5 px-4 font-semibold text-white bg-[#00AA00] rounded-md hover:bg-opacity-90 transition-colors disabled:bg-green-300"
                    >
                        {isUpdating ? 'Agregando...' : 'Agregar Sello'}
                    </button>
                </div>
            )}
            
            {foundCustomer && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmAddStamp}
                    title="Confirmar Sello"
                >
                    <p>¿Seguro que quieres agregar un sello al cliente?</p>
                    <p className="font-semibold">{foundCustomer.name}</p>
                    <p className="text-gray-500">{foundCustomer.phone}</p>
                </ConfirmationModal>
            )}

        </div>
    );
};

export default AddStampPage;
