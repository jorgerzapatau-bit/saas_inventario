"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const mockData2026 = [
    { name: 'Ene', entradas: 4000, salidas: 2400 },
    { name: 'Feb', entradas: 3000, salidas: 1398 },
    { name: 'Mar', entradas: 2000, salidas: 9800 },
    { name: 'Abr', entradas: 2780, salidas: 3908 },
    { name: 'May', entradas: 1890, salidas: 4800 },
    { name: 'Jun', entradas: 2390, salidas: 3800 },
    { name: 'Jul', entradas: 3490, salidas: 4300 },
    { name: 'Ago', entradas: 4000, salidas: 2400 },
    { name: 'Sep', entradas: 3000, salidas: 1398 },
    { name: 'Oct', entradas: 2000, salidas: 9800 },
    { name: 'Nov', entradas: 2780, salidas: 3908 },
    { name: 'Dic', entradas: 1890, salidas: 4800 },
];

const mockData2025 = [
    { name: 'Ene', entradas: 2000, salidas: 1400 },
    { name: 'Feb', entradas: 1000, salidas: 2398 },
    { name: 'Mar', entradas: 4000, salidas: 3800 },
    { name: 'Abr', entradas: 1780, salidas: 2908 },
    { name: 'May', entradas: 2890, salidas: 1800 },
    { name: 'Jun', entradas: 3390, salidas: 2800 },
    { name: 'Jul', entradas: 1490, salidas: 1300 },
    { name: 'Ago', entradas: 2000, salidas: 3400 },
    { name: 'Sep', entradas: 1000, salidas: 2398 },
    { name: 'Oct', entradas: 3000, salidas: 1800 },
    { name: 'Nov', entradas: 1780, salidas: 2908 },
    { name: 'Dic', entradas: 3890, salidas: 1800 },
];

export default function AnalyticsChart() {
    const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('area');
    const [year, setYear] = useState<'2026' | '2025'>('2026');

    const data = year === '2026' ? mockData2026 : mockData2025;

    const renderChart = () => {
        switch (chartType) {
            case 'line':
                return (
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="entradas" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Entradas" />
                        <Line type="monotone" dataKey="salidas" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Salidas" />
                    </LineChart>
                );
            case 'bar':
                return (
                    <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                        <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar dataKey="entradas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Entradas" />
                        <Bar dataKey="salidas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Salidas" />
                    </BarChart>
                );
            case 'area':
            default:
                return (
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Area type="monotone" dataKey="entradas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEntradas)" name="Entradas" />
                        <Area type="monotone" dataKey="salidas" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSalidas)" name="Salidas" />
                    </AreaChart>
                );
        }
    };

    return (
        <Card className="mt-8 mb-8">
            <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Tendencia de Movimientos</h3>
                    <p className="text-sm text-gray-500 mt-1">Comparación mensual de Entradas vs Salidas</p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                    <select
                        className="bg-white border-gray-300 text-sm rounded-md py-1.5 px-3 text-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                        value={year}
                        onChange={(e) => setYear(e.target.value as any)}
                    >
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                    </select>

                    <div className="h-6 w-px bg-gray-300 mx-1"></div>

                    <div className="flex bg-gray-200/50 rounded-md p-0.5">
                        <button
                            onClick={() => setChartType('area')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${chartType === 'area' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Área
                        </button>
                        <button
                            onClick={() => setChartType('bar')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${chartType === 'bar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Barras
                        </button>
                        <button
                            onClick={() => setChartType('line')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${chartType === 'line' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Líneas
                        </button>
                    </div>
                </div>
            </div>
            <CardContent>
                <div className="h-[400px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
