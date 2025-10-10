import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewCustomer } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ErrorMessage from '../components/ErrorMessage';
import ExclamationCircleIcon from '../components/icons/ExclamationCircleIcon';

const validateMexicanPhoneNumber = (phone: string): string => {
    if (!phone) return "El número de teléfono es requerido.";
    let cleaned = phone.trim();

    if (cleaned.startsWith('+521')) {
        cleaned = cleaned.substring(4);
    } else if (cleaned.startsWith('+52')) {
        cleaned = cleaned.substring(3);
    }

    cleaned = cleaned.replace(/\D/g, '');

    return /^\d{10}$/.test(cleaned) ? "" : "Por favor, ingresa un número de teléfono válido de 10 dígitos.";
};

const NewCustomerPage: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const validate = () => {
        const newErrors: { name?: string; phone?: string; email?: string } = {};

        if (!name) newErrors.name = "El nombre del cliente es requerido.";

        const phoneError = validateMexicanPhoneNumber(phone);
        if (phoneError) newErrors.phone = phoneError;

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "No es una dirección de email válida.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast('Debes iniciar sesión para registrar un cliente.', 'error');
            return;
        }
        
        if (!validate()) return;

        setLoading(true);

        try {
            const newCustomer = await createNewCustomer(user.uid, { name, phone, email });
            showToast(`¡Cliente "${newCustomer.name}" registrado con éxito!`, 'success');
            setName('');
            setPhone('');
            setEmail('');
            setTimeout(() => {
                navigate('/app/dashboard');
            }, 2000);
        } catch (err) {
            showToast('Ocurrió un error al registrar el cliente. Inténtalo de nuevo.', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-black tracking-tight mb-6">Registrar Nuevo Cliente</h1>

            <form onSubmit={handleSubmit} className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
                <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-700">Nombre Completo</label>
                    <div className="relative mt-1">
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black ${errors.name ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                            placeholder="Nombre del cliente"
                            aria-invalid={!!errors.name}
                            aria-describedby="name-error"
                        />
                        {errors.name && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon />
                            </div>
                        )}
                    </div>
                     <ErrorMessage message={errors.name} id="name-error" />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-base font-medium text-gray-700">Número de Teléfono</label>
                    <div className="relative mt-1">
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black ${errors.phone ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                            placeholder="Ej: 5512345678 (10 dígitos)"
                            aria-invalid={!!errors.phone}
                            aria-describedby="phone-error"
                        />
                        {errors.phone && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon />
                            </div>
                        )}
                    </div>
                     <ErrorMessage message={errors.phone} id="phone-error" />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700">
                        Email <span className="text-gray-500">(Opcional)</span>
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black ${errors.email ? 'pr-10 border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                            placeholder="cliente@email.com"
                            aria-invalid={!!errors.email}
                            aria-describedby="email-error"
                        />
                         {errors.email && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon />
                            </div>
                        )}
                    </div>
                    <ErrorMessage message={errors.email} id="email-error" />
                </div>

                <div className="flex items-center justify-end gap-4">
                     <button
                        type="button"
                        onClick={() => navigate('/app/dashboard')}
                        className="px-4 py-2 text-base font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                    >
                        {loading ? 'Registrando...' : 'Registrar Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewCustomerPage;