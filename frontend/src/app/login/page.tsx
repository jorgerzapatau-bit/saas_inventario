"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchApi } from '@/lib/api';

interface CompanyInfo {
    nombre: string;
    logo?: string | null;
}

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [loadingCompany, setLoadingCompany] = useState(true);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const companySlug = searchParams.get('company');

    useEffect(() => {
        if (companySlug) {
            const loadCompany = async () => {
                try {
                    const data = await fetchApi(`/company/${companySlug}`);
                    setCompanyInfo(data);
                } catch (err) {
                    console.error("Error loading company", err);
                } finally {
                    setLoadingCompany(false);
                }
            };
            loadCompany();
        } else {
            setLoadingCompany(false);
        }
    }, [companySlug]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await fetchApi('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCompany) {
        return <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <p className="text-gray-500">Cargando...</p>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
                {companyInfo?.logo ? (
                    <img src={companyInfo.logo} alt={companyInfo.nombre} className="h-16 mb-4 object-contain" />
                ) : null}
                
                {companyInfo ? (
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        {companyInfo.nombre}
                    </h2>
                ) : (
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
                        Inventory<span className="text-blue-600">SaaS</span>
                    </h2>
                )}
                
                <p className="mt-2 text-center text-sm text-gray-600">
                    Inicia sesión para gestionar tu empresa
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-800"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                            >
                                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Credenciales Demo</span>
                            </div>
                        </div>
                        <div className="mt-2 text-center text-xs text-gray-500">
                            <p>Email: admin@demo.com</p>
                            <p>Contraseña: admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                <p className="text-gray-500">Cargando...</p>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
