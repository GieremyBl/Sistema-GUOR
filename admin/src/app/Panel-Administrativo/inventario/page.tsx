"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Package, AlertTriangle, Search, PlusCircle } from 'lucide-react';
import { Insumo } from '@/lib/types/inventario.types';

export default function InventarioMateriales() {
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInsumos();
    }, []);

    const filteredAndSearchedInsumos = useMemo(() => {
        return insumos.filter(insumo => {
            const matchesSearch = insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' || 
                                  insumo.tipo === filterType ||
                                  (filterType === 'low_stock' && insumo.stock_actual <= insumo.stock_minimo);
            return matchesSearch && matchesFilter;
        });
    }, [insumos, searchTerm, filterType]);

    // Obtener la lista única de tipos para el filtro dropdown
    const uniqueTypes = useMemo(() => {
        const types = new Set(insumos.map(i => i.tipo));
        return Array.from(types).sort();
    }, [insumos]);

    const fetchInsumos = async () => {
    setLoading(true);
    try {
        // Seleccionamos solo los tipos de materiales (ajusta si tienes más tipos)
        const { data, error } = await supabase
            .from('inventario')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;
        setInsumos(data as Insumo[]);
    } catch (error) {
        console.error("Error al obtener insumos:", error);
    } finally {
        setLoading(false);
    }
};

    const getAlertStatus = (current: number, min: number): 'high' | 'low' | 'ok' => {
        if (current <= 0) return 'high'; // Stock agotado
        if (current <= min) return 'low'; // Bajo stock
        return 'ok';
    };

    const getStatusStyles = (status: 'high' | 'low' | 'ok') => {
        switch (status) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'low': return 'bg-yellow-100 text-yellow-700';
            case 'ok': return 'bg-green-100 text-green-700';
        }
    };

    const filteredInsumos = insumos.filter(insumo => {
        const matchesSearch = insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || 
                            (filter === 'low_stock' && insumo.stock_actual <= insumo.stock_minimo);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="p-6 text-center">Cargando inventario de materiales...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Inventario de Materiales</h1>

            {/* Alerta de Stock Bajo */}
            <div className="mb-6">
                <AlertasStockBajo insumos={insumos} getAlertStatus={getAlertStatus} />
            </div>

            {/* Controles de Búsqueda y Acción */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar material..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded-lg"
                    >
                        <option value="all">Todos los Insumos</option>
                        <option value="low_stock">Bajo Stock</option>
                        <option value="Tela">Telas</option>
                        <option value="Insumo">Otros Insumos</option>
                    </select>
                </div>
                <button 
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-purple-700 transition-colors"
                    // Implementar lógica para abrir modal o página de registro
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Registrar Material
                </button>
            </div>

            {/* Tabla de Inventario */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInsumos.map((insumo) => {
                            const status = getAlertStatus(insumo.stock_actual, insumo.stock_minimo);
                            return (
                                <tr key={insumo.id} className={status !== 'ok' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{insumo.nombre}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insumo.tipo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insumo.unidad_medida}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold" style={{ color: status === 'ok' ? 'green' : (status === 'low' ? 'orange' : 'red') }}>
                                        {insumo.stock_actual}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{insumo.stock_minimo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(status)}`}>
                                            {status === 'high' ? '¡AGOTADO!' : status === 'low' ? 'Bajo Stock' : 'Disponible'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Ajustar</button>
                                        <button className="text-gray-600 hover:text-gray-900">Historial</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {filteredInsumos.length === 0 && !loading && (
                <p className="text-center text-gray-500 py-12">No se encontraron materiales que coincidan con los filtros.</p>
            )}
        </div>
    );
}

// Subcomponente de Alertas (para usar en el Dashboard también)
function AlertasStockBajo({ insumos, getAlertStatus }: { insumos: Insumo[], getAlertStatus: (current: number, min: number) => 'high' | 'low' | 'ok' }) {
    const alerts = insumos.filter(insumo => getAlertStatus(insumo.stock_actual, insumo.stock_minimo) !== 'ok');
    
    if (alerts.length === 0) return null;

    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-3" />
                <p className="font-bold">¡Alerta de Reabastecimiento!</p>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm">
                {alerts.slice(0, 5).map(insumo => (
                    <li key={insumo.id}>
                        **{insumo.nombre}**: Stock actual de {insumo.stock_actual} {insumo.unidad_medida} (Mínimo: {insumo.stock_minimo}).
                    </li>
                ))}
                {alerts.length > 5 && (
                    <li className="font-semibold">Y {alerts.length - 5} materiales más están en bajo stock...</li>
                )}
            </ul>
        </div>
    );
}