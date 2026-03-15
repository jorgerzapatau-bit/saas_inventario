"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Truck, ShoppingCart, LogOut, ArrowRightLeft, FileText, Upload, Settings } from 'lucide-react';

export default function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white shadow-xl">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <h1 className="text-2xl font-bold tracking-tight text-blue-400">Inventory<span className="text-white">SaaS</span></h1>
            </div>
            <div className="flex flex-col flex-1 p-4 space-y-2 overflow-y-auto">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <Package size={20} />
                    <span className="font-medium">Productos</span>
                </Link>
                <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <ArrowRightLeft size={20} />
                    <span className="font-medium">Kardex / Movimientos</span>
                </Link>
                <Link href="/dashboard/purchases" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <ShoppingCart size={20} />
                    <span className="font-medium">Compras (Entradas)</span>
                </Link>
                <Link href="/dashboard/sales" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <Upload size={20} />
                    <span className="font-medium">Registrar Salidas</span>
                </Link>
                <Link href="/dashboard/suppliers" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <Truck size={20} />
                    <span className="font-medium">Proveedores</span>
                </Link>
                <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <FileText size={20} />
                    <span className="font-medium">Reportes</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-800 hover:text-white">
                    <Settings size={20} />
                    <span className="font-medium">Parámetros</span>
                </Link>
            </div>
            <div className="p-4 border-t border-gray-800">
                <button onClick={handleLogout} className="flex items-center w-full gap-3 px-4 py-3 text-gray-400 transition-colors rounded-lg hover:bg-red-900/50 hover:text-red-400">
                    <LogOut size={20} />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
}
