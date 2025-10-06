
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/app/dashboard');
        } catch (err) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-white">
            <div className="w-full max-w-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-tight">Bienvenido de nuevo</h1>
                    <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta de negocio.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
                        <input 
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                            placeholder="tu@negocio.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-gray-700">Contraseña</label>
                         <input 
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-base text-red-600">{error}</p>}

                    <div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                        >
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
                 <div className="text-center mt-4">
                     <p className="text-base text-gray-500">Demo: test@business.com / password123</p>
                 </div>
            </div>
        </div>
    );
};

export default LoginPage;
