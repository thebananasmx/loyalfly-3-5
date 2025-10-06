
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewCustomer } from '../services/firebaseService';

const NewCustomerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const newCustomer = await createNewCustomer({ name, phone, email });
            setSuccess(`¡Cliente "${newCustomer.name}" registrado con éxito!`);
            setName('');
            setPhone('');
            setEmail('');
            setTimeout(() => {
                navigate('/app/dashboard');
            }, 2000);
        } catch (err) {
            setError('Ocurrió un error al registrar el cliente. Inténtalo de nuevo.');
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
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                        placeholder="Nombre del cliente"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-base font-medium text-gray-700">Número de Teléfono</label>
                    <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                        placeholder="Ej: 555-0101"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-700">
                        Email <span className="text-gray-500">(Opcional)</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                        placeholder="cliente@email.com"
                    />
                </div>

                {error && <p className="text-base text-red-600">{error}</p>}
                {success && <p className="text-base text-[#00AA00]">{success}</p>}

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
