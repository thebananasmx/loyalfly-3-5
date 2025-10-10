
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const EyeSlashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.67.111 2.458.325M9 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1l22 22" /></svg>;


const RegisterPage: React.FC = () => {
    const [businessName, setBusinessName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            await register(email, password, businessName);
            navigate('/app/dashboard');
        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Este email ya está registrado.');
            } else if (err.code === 'auth/weak-password') {
                setError('La contraseña debe tener al menos 6 caracteres.');
            } else {
                setError('Ocurrió un error. Inténtalo de nuevo.');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-[70vh] bg-white">
            <div className="w-full max-w-sm p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black tracking-tight">Crea tu cuenta</h1>
                    <p className="text-gray-500 mt-2">Empieza a fidelizar a tus clientes hoy.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="businessName" className="block text-base font-medium text-gray-700">Nombre de tu Negocio</label>
                        <input 
                            id="businessName"
                            type="text"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                            placeholder="Ej: Café del Sol"
                        />
                    </div>

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
                        <div className="relative">
                            <input 
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                placeholder="Mínimo 6 caracteres"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center"
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">Confirmar Contraseña</label>
                        <div className="relative">
                            <input 
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black"
                                placeholder="Repite tu contraseña"
                            />
                        </div>
                    </div>


                    {error && <p className="text-base text-red-600">{error}</p>}

                    <div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <p className="text-base text-gray-500">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-[#00AA00] hover:underline">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
