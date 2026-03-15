"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchApi('/products');
                setProducts(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar productos');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) return;
        
        try {
            await fetchApi(`/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            alert(err.message || 'Error al eliminar producto');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestiona el catálogo de productos de tu empresa.</p>
                </div>
                <Link href="/dashboard/products/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                    <Plus size={18} />
                    Nuevo Producto
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <Card>
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por SKU, nombre o categoría..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans text-gray-800"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría Id</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Precio Venta</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        Cargando productos...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No se encontraron productos. Añade tu primer producto.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 text-sm font-medium text-gray-600">{product.sku}</td>
                                        <td className="p-4 text-sm font-semibold text-gray-800">{product.nombre}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">{product.categoriaId || 'General'}</span>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-700 text-right">${Number(product.precioVenta).toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/dashboard/products/${product.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-none bg-transparent cursor-pointer inline-flex">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => handleDelete(product.id, product.nombre)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors border-none bg-transparent cursor-pointer">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
