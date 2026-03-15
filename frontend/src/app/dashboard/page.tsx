"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Package, TrendingUp, AlertTriangle, DollarSign, Activity } from 'lucide-react';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        lowStock: 0,
        totalValue: 0,
        recentMovements: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Fetch basic entities to calculate stats
                const [products, movements] = await Promise.all([
                    fetchApi('/products'),
                    fetchApi('/inventory/movements')
                ]);

                const lowStockProducts = products.filter((p: any) => p.stock <= p.stockMinimo);
                const totalValue = products.reduce((acc: number, p: any) => acc + (p.stock * Number(p.precioCompra)), 0);

                setStats({
                    totalProducts: products.length,
                    lowStock: lowStockProducts.length,
                    totalValue: totalValue,
                    recentMovements: movements.slice(0, 10) // Get the top 10 most recent
                });

            } catch (error) {
                console.error("Error loading dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Resumen General</h1>
                <Link href="/dashboard/purchases" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                    + Nueva Entrada
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader title="Valor Inventario" subtitle="Costo total estimado" icon={<DollarSign size={24} />} />
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? '...' : `$${stats.totalValue.toFixed(2)}`}
                        </p>
                        <p className="text-sm text-green-500 flex items-center mt-2 font-medium">
                            <TrendingUp size={16} className="mr-1" /> Valores actuales
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader title="Total Productos" subtitle="Tipos de items activos" icon={<Package size={24} />} />
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? '...' : stats.totalProducts}
                        </p>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Catálogo activo</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader title="Stock Bajo" subtitle="Requieren atención" icon={<AlertTriangle size={24} className="text-orange-500" />} />
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-orange-600">
                            {loading ? '...' : `${stats.lowStock} items`}
                        </p>
                        <Link href="/dashboard/products" className="text-sm border-b border-transparent hover:border-orange-400 cursor-pointer text-orange-500 transition-colors mt-2 inline-block font-medium">Ver detalles →</Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader title="Movimientos Hoy" subtitle="Entradas y Salidas" icon={<Activity size={24} />} />
                    <CardContent className="pt-0">
                        <p className="text-3xl font-bold text-gray-800">
                            {loading ? '...' : stats.recentMovements.length}
                        </p>
                        <p className="text-sm text-blue-500 mt-2 font-medium">Últimos registrados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Chart */}
            <AnalyticsChart />

            {/* Recent Activity Table */}
            <h2 className="text-xl font-bold text-gray-800 mt-10 mb-4">Últimos Movimientos</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Cant</th>
                            <th className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">Motivo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">Cargando movimientos...</td>
                            </tr>
                        ) : stats.recentMovements.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-4 text-center text-gray-500">No hay movimientos registrados.</td>
                            </tr>
                        ) : (
                            stats.recentMovements.map((mov, i) => (
                                <tr key={mov.id || i} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4 text-sm text-gray-600">{new Date(mov.fechaFisica || mov.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${mov.tipo === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {mov.tipo}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-800">{mov.producto?.nombre || 'Producto Desconocido'}</td>
                                    <td className="p-4 text-sm font-bold text-gray-700">{mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}</td>
                                    <td className="p-4 text-sm text-gray-500 truncate max-w-[200px]">{mov.motivo}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
