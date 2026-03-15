"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Save, ArrowLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        sku: "",
        nombre: "",
        descripcion: "",
        categoriaId: "",
        precioCompra: "",
        precioVenta: "",
        stockMinimo: "",
        unidad: "unidades"
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await fetchApi(`/products/${params.id}`);
                setFormData({
                    sku: data.sku || "",
                    nombre: data.nombre || "",
                    descripcion: data.descripcion || "",
                    categoriaId: data.categoriaId || "",
                    precioCompra: data.precioCompra !== null ? data.precioCompra : "",
                    precioVenta: data.precioVenta !== null ? data.precioVenta : "",
                    stockMinimo: data.stockMinimo !== null ? data.stockMinimo : "",
                    unidad: data.unidad || "unidades"
                });
            } catch (err: any) {
                setError("Error al cargar la información del producto");
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await fetchApi(`/products/${params.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...formData,
                    precioCompra: Number(formData.precioCompra),
                    precioVenta: Number(formData.precioVenta),
                    stockMinimo: Number(formData.stockMinimo),
                }),
            });

            router.push("/dashboard/products");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Error al actualizar el producto");
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-gray-500">Cargando datos del producto...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
                    <p className="text-sm text-gray-500 mt-1">Modifica los detalles del producto.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-3">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader
                        title="Información General"
                        subtitle="Detalles básicos e identificación del producto."
                    />
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">SKU (Código Interno) *</label>
                                <input
                                    required
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Ej: LAP-DELL-XPS"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Nombre del Producto *</label>
                                <input
                                    required
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Laptop Dell XPS 15..."
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Descripción (Opcional)</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe las características principales..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Unidad de Medida</label>
                                <select
                                    name="unidad"
                                    value={formData.unidad}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="unidades">Unidades</option>
                                    <option value="kilos">Kilos</option>
                                    <option value="litros">Litros</option>
                                    <option value="cajas">Cajas</option>
                                    <option value="metros">Metros</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Precio de Compra *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precioCompra"
                                        value={formData.precioCompra}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Precio de Venta *</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        name="precioVenta"
                                        value={formData.precioVenta}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Stock Mínimo Alerta *</label>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    name="stockMinimo"
                                    value={formData.stockMinimo}
                                    onChange={handleChange}
                                    placeholder="Ej: 5"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <p className="text-xs text-gray-500">Recibirás alertas cuando el stock baje de este número.</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 shadow-sm"
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <Save size={18} />
                                Guardar Producto
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
