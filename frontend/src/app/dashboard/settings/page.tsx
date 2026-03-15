"use client";
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

interface CompanySettings {
    nombre: string;
    url: string;
    logo: string;
    telefono: string;
    whatsapp: string;
    email: string;
    direccion: string;
    rfc: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<CompanySettings>({
        nombre: '',
        url: '',
        logo: '',
        telefono: '',
        whatsapp: '',
        email: '',
        direccion: '',
        rfc: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Assuming we use an endpoint that returns the current authenticated user's company information.
                // In our current setup, we added a route /company/:slug that is public,
                // but for saving/loading their own company admin should have an endpoint like GET /company/my 
                // Or we can extract company from user payload in local storage.
                // For simplicity, let's fetch /company/my which we should create, 
                // but since we only have the PUT and getting by slug, we can get the user's company from local storage to know the slug.
                
                const userObj = localStorage.getItem('user');
                if(userObj) {
                    const user = JSON.parse(userObj);
                    // if user obj doesn't have slug, we might need a dedicated endpoint. Let's assume we create a GET /company endpoint that uses token.
                    const data = await fetchApi('/company'); 
                    setSettings({
                        nombre: data.nombre || '',
                        url: data.url || '',
                        logo: data.logo || '',
                        telefono: data.telefono || '',
                        whatsapp: data.whatsapp || '',
                        email: data.email || '',
                        direccion: data.direccion || '',
                        rfc: data.rfc || ''
                    });
                }
            } catch (err) {
                console.error("Error loading settings", err);
                setError('Error al cargar la configuración.');
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            await fetchApi('/company', {
                method: 'PUT',
                body: JSON.stringify(settings),
            });
            setSuccess('Parámetros guardados correctamente.');
        } catch (err: any) {
            setError(err.message || 'Error al guardar los parámetros');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-200 w-1/4 rounded mb-8"></div></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Parámetros de la Empresa</h1>
            
            <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                
                {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
                {success && <div className="p-4 bg-green-50 text-green-600 rounded-lg">{success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nombre de la Empresa</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={settings.nombre}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Identificador URL (slug)</label>
                        <div className="flex bg-gray-50 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <span className="px-3 py-2 text-gray-500 border-r text-sm truncate max-w-[150px]">http://localhost:3000/?company=</span>
                            <input
                                type="text"
                                name="url"
                                required
                                value={settings.url}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-transparent outline-none text-gray-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">URL del Logo</label>
                        <input
                            type="url"
                            name="logo"
                            value={settings.logo}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/logo.png"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                        {settings.logo && (
                           <div className="mt-2 text-sm text-gray-500">
                               Vista previa:
                               <img src={settings.logo} alt="Preview" className="h-12 mt-1 object-contain bg-gray-50 p-1 rounded border" />
                           </div> 
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={settings.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            value={settings.whatsapp}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">RFC (Registro Federal de Contribuyentes)</label>
                        <input
                            type="text"
                            name="rfc"
                            value={settings.rfc}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Dirección</label>
                        <textarea
                            name="direccion"
                            rows={3}
                            value={settings.direccion}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 resize-none"
                        ></textarea>
                    </div>

                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Parámetros'}
                    </button>
                </div>
            </form>
        </div>
    );
}
