import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendPasswordReset } from '../services/firebaseService';

const LoginPage: React.FC = () => {
    const [view, setView] = useState<'login' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
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
    
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await sendPasswordReset(email);
            setMessage('Si existe una cuenta, se ha enviado un enlace para restablecer tu contraseña a tu correo.');
        } catch (err) {
            setError('No se pudo enviar el correo. Inténtalo de nuevo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const switchToResetView = () => {
        setView('reset');
        setError('');
        setMessage('');
        setPassword('');
    };

    const switchToLoginView = () => {
        setView('login');
        setError('');
        setMessage('');
    };

    const renderLoginView = () => (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black tracking-tight">Bienvenido de nuevo</h1>
                <p className="text-gray-500 mt-2">Inicia sesión en tu cuenta de negocio.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-base font-medium text-gray-700">Contraseña</label>
                         <button 
                            type="button"
                            onClick={switchToResetView}
                            className="text-sm font-medium text-[#00AA00] hover:underline focus:outline-none"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
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
             <div className="text-center mt-6">
                 <p className="text-base text-gray-500">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="font-medium text-[#00AA00] hover:underline">
                        Regístrate
                    </Link>
                </p>
             </div>
        </>
    );

    const renderResetView = () => (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black tracking-tight">Restablecer Contraseña</h1>
                <p className="text-gray-500 mt-2">Ingresa tu email para recibir un enlace de restablecimiento.</p>
            </div>
            
            {message ? (
                 <div className="p-4 mb-4 text-base text-green-800 bg-green-100 rounded-lg text-center" role="alert">
                    {message}
                 </div>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-6">
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

                    {error && <p className="text-base text-red-600">{error}</p>}

                    <div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                        >
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </div>
                </form>
            )}

             <div className="text-center mt-6">
                 <p className="text-base text-gray-500">
                    <button onClick={switchToLoginView} className="font-medium text-[#00AA00] hover:underline focus:outline-none">
                        Volver a Iniciar Sesión
                    </button>
                </p>
             </div>
        </>
    );
    
    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-white">
            <div className="w-full max-w-sm p-8">
                {view === 'login' ? renderLoginView() : renderResetView()}
            </div>
        </div>
    );
};

export default LoginPage;