"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, Plus, Building2, MapPin, Mail, Phone } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function SuppliersPage() {
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProveedores = async () => {
            try {
                const data = await fetchApi('/suppliers');
                setProveedores(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar proveedores');
            } finally {
                setLoading(false);
            }
        };

        loadProveedores();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Proveedores</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de contactos y empresas proveedoras.</p>
                </div>
                <Link href="/dashboard/suppliers/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                    <Plus size={18} />
                    Nuevo Proveedor
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        Cargando proveedores...
                    </div>
                ) : proveedores.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500">
                        No se encontraron proveedores. Crea tu primer proveedor.
                    </div>
                ) : (
                    proveedores.map((prov) => (
                        <Card key={prov.id} className="hover:shadow-md transition-shadow group cursor-pointer border-t-4 border-t-blue-500">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                        <Building2 size={24} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">{prov.nombre}</h3>
                                <p className="text-sm border-b border-transparent group-hover:border-blue-400 text-blue-600 inline-block font-medium mb-4 transition-colors">
                                    Contacto: {prov.contacto || 'No especificado'}
                                </p>

                                <div className="space-y-2 mt-2 pt-4 border-t border-gray-100">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone size={14} className="mr-2 text-gray-400" />
                                        {prov.telefono || 'Sin teléfono'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail size={14} className="mr-2 text-gray-400" />
                                        <span className="truncate">{prov.email || 'Sin email'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin size={14} className="mr-2 text-gray-400" />
                                        {prov.direccion || 'Sin dirección'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}

                {/* Empty Add Card */}
                {!loading && (
                    <Link href="/dashboard/suppliers/new" className="block h-full">
                        <Card className="flex flex-col items-center justify-center border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer min-h-[260px] h-full">
                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm mb-3">
                                <Plus size={24} />
                            </div>
                            <p className="font-semibold text-gray-600">Añadir Proveedor</p>
                        </Card>
                    </Link>
                )}
            </div>
        </div>
    );
}
