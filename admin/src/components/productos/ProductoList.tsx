'use client';

import React, { useState, useEffect } from 'react';
import ProductoFilters from './ProductoFilters';
import { getProductos } from '@/lib/actions/productos.actions'; 

import { 
    ProductoFiltersState,
    ProductoConCategoria,
    ProductoListProps 
} from '@/lib/types/producto.types'; 

import { Loader2 } from 'lucide-react'; 

const INITIAL_FILTERS: ProductoFiltersState = {
    busqueda: '',
    categoria: '',
    estado: '',
};

export default function ProductoList({ categorias }: ProductoListProps) {
    // 1. CORRECCIÓN: El estado ahora espera el tipo completo que devuelve la DB.
    const [productos, setProductos] = useState<ProductoConCategoria[]>([]); 
    const [filters, setFilters] = useState<ProductoFiltersState>(INITIAL_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleFiltersChange = (newFilters: ProductoFiltersState) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        setIsLoading(true);
        let debounceTimer: NodeJS.Timeout;

        const fetchProducts = async () => {
            try {
                // La Server Action devuelve { data: ProductoConCategoria[] } o { error: any }
                const result = await getProductos(filters);
                
                if (result.success && result.data) {
                    // CORRECCIÓN 1: result.data ya es ProductoConCategoria[], así que la asignación es directa.
                    setProductos(result.data);
                } else {
                    // CORRECCIÓN 2: Manejo de error usando 'error'
                    console.error("Error fetching products:", result.error); 
                    setProductos([]);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                setProductos([]);
            } finally {
                setIsLoading(false);
            }
        };

        // ... (Lógica de Debouncing sin cambios)
        if (filters.busqueda) {
            debounceTimer = setTimeout(fetchProducts, 500);
        } else {
            fetchProducts();
        }

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [filters]); 

    return (
        <div className="space-y-6">
            <ProductoFilters 
                filters={filters}
                onFiltersChange={handleFiltersChange}
                categorias={categorias} 
            />

            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">
                    Resultados de Productos ({isLoading ? 'Cargando...' : productos.length})
                </h2>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {productos.length === 0 ? (
                            <p className="text-center text-gray-500">No se encontraron productos.</p>
                        ) : (
                            productos.map(p => (
                                <div key={p.id} className="p-3 border rounded shadow-sm hover:bg-gray-50">
                                    <p className="font-medium">{p.nombre}</p>
                                    
                                    {/* CORRECCIÓN 3: Verificación de descripción y valor por defecto */}
                                    <p className="text-sm text-gray-600">
                                        {p.descripcion?.substring(0, 50) || 'Sin descripción'}...
                                    </p>
                                    
                                    {/* CORRECCIÓN 4: Comparación con el estado en minúscula */}
                                    <span className={`text-xs font-mono px-2 py-1 rounded-full 
                                        ${p.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                                    }>
                                        {/* Capitalizamos para mostrar, pero comparamos con el valor de la DB */}
                                        {p.estado.charAt(0).toUpperCase() + p.estado.slice(1)} 
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}