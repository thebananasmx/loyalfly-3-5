import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCustomerById, updateCustomer, deleteCustomer, getCustomerByPhone } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ErrorMessage from '../components/ErrorMessage';
import ExclamationCircleIcon from '../components/icons/ExclamationCircleIcon';
import ConfirmationModal from '../components/ConfirmationModal';
import { COUNTRIES, validatePhoneNumber, formatPhoneWithDialCode, parsePhoneNumber } from '../utils/phoneUtils';

const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const EditCustomerPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('MX');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        document.title = 'Editar Cliente | Loyalfly App';
        const fetchCustomer = async () => {
            if (!user || !customerId) {
                navigate('/app/dashboard');
                return;
            }
            try {
                const customerData = await getCustomerById(user.uid, customerId);
                if (customerData) {
                    setName(customerData.name);
                    const parsedPhone = parsePhoneNumber(customerData.phone);
                    setPhone(parsedPhone.number);
                    setSelectedCountry(parsedPhone.countryCode);
                    setEmail(customerData.email);
                    document.title = `Editar: ${customerData.name} | Loyalfly App`;
                } else {
                    showToast('Cliente no encontrado.', 'error');
                    navigate('/app/dashboard');
                }
            } catch (error) {
                console.error("Failed to load customer data", error);
                showToast('Error al cargar datos del cliente.', 'error');
                navigate('/app/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [user, customerId, navigate, showToast]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = e.target.value.replace(/\D/g, '');
        const maxDigits = COUNTRIES.find(c => c.code === selectedCountry)?.digits || 10;
        setPhone(sanitized.slice(0, maxDigits));
    };

    const validate = () => {
        const newErrors: { name?: string; phone?: string; email?: string } = {};

        if (!name) newErrors.name = "El nombre del cliente es requerido.";

        const phoneError = validatePhoneNumber(phone, selectedCountry);
        if (phoneError) newErrors.phone = phoneError;

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "No es una dirección de email válida.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !customerId || !validate()) return;

        setIsSaving(true);
        try {
            const fullPhone = formatPhoneWithDialCode(phone, selectedCountry);
            
            // Check if phone is already taken by another customer
            let existingCustomer = await getCustomerByPhone(user.uid, fullPhone);
            if (!existingCustomer && selectedCountry === 'MX') {
                existingCustomer = await getCustomerByPhone(user.uid, phone.replace(/\D/g, ''));
            }

            if (existingCustomer && existingCustomer.id !== customerId) {
                setErrors({ phone: 'Este número de teléfono ya está registrado por otro cliente.' });
                setIsSaving(false);
                return;
            }

            await updateCustomer(user.uid, customerId, { name, phone: fullPhone, email });
            showToast('Cliente actualizado con éxito.', 'success');
            navigate('/app/dashboard');
        } catch (error) {
            showToast('No se pudo actualizar el cliente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!user || !customerId) return;
        
        try {
            await deleteCustomer(user.uid, customerId);
            showToast(`Cliente "${name}" eliminado permanentemente.`, 'success');
            navigate('/app/dashboard');
        } catch (error) {
            showToast('No se pudo eliminar al cliente.', 'error');
        }
        setIsDeleteModalOpen(false);
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
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to="/app/dashboard"
                    className="inline-flex items-center justify-center p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    title="Volver al Dashboard"
                >
                    <ArrowLeftIcon />
                </Link>
                <h1 className="text-3xl font-bold text-black tracking-tight truncate">Editar a {name}</h1>
            </div>

            <form onSubmit={handleUpdate} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
                <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700">Nombre Completo</label>
                    <div className="relative mt-1">
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.name ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                            aria-invalid={!!errors.name}
                        />
                         {errors.name && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon />
                            </div>
                        )}
                    </div>
                    <ErrorMessage message={errors.name} />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-base font-medium text-gray-700">Número de Teléfono</label>
                    <div className="flex gap-2 mt-1">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="block w-24 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black bg-white"
                        >
                            {COUNTRIES.map(c => (
                                <option key={c.code} value={c.code}>{c.emoji} {c.dialCode}</option>
                            ))}
                        </select>
                        <div className="relative flex-1">
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                required
                                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.phone ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                                aria-invalid={!!errors.phone}
                            />
                             {errors.phone && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon />
                                </div>
                            )}
                        </div>
                    </div>
                    <ErrorMessage message={errors.phone} />
                </div>
                <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700">Email <span className="text-gray-500">(Opcional)</span></label>
                    <div className="relative mt-1">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none ${errors.email ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 placeholder-gray-400 focus:ring-black focus:border-black'}`}
                            aria-invalid={!!errors.email}
                        />
                         {errors.email && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon />
                            </div>
                        )}
                    </div>
                    <ErrorMessage message={errors.email} />
                </div>
                <div className="flex items-center justify-end gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => navigate('/app/dashboard')}
                        className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
            
            <div className="mt-12">
                <h2 className="text-xl font-bold text-red-600">Zona de Peligro</h2>
                <div className="mt-4 p-6 bg-white border border-red-300 rounded-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-black">Eliminar Cliente</h3>
                            <p className="text-gray-600 mt-1">Esta acción es permanente y no se puede deshacer.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full sm:w-auto mt-4 sm:mt-0 inline-flex items-center justify-center gap-2 px-4 py-2 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                        >
                            <TrashIcon />
                            Eliminar Cliente
                        </button>
                    </div>
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="¿Confirmar eliminación?"
                confirmText="Sí, eliminar cliente"
            >
                <p>Estás a punto de eliminar a <strong>{name}</strong> permanentemente.</p>
                <p className="mt-2">Todos sus datos, incluyendo sellos, serán borrados. ¿Estás seguro?</p>
            </ConfirmationModal>
        </div>
    );
};

export default EditCustomerPage;