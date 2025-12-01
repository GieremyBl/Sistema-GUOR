'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; 
import { getCategoriasConFiltros } from '@/lib/actions/categorias.actions'; 

// CORRECCIÓN 1: Renombramos la importación del componente de UI para evitar el duplicado
import CategoriaFiltersComponent from './CategoriaFilters'; 

// Importamos los tipos necesarios
import { 
    CategoriaFiltersState,
    CategoriaConConteo,
    CategoriaListProps,
    FiltrosCategorias 
} from '@/lib/types/categoria.types'; 


// Usamos el tipo CategoriaFiltersState para la constante
const INITIAL_FILTERS: CategoriaFiltersState = { 
    busqueda: '',
    estado: '', // Vacío significa 'todos'
};

// ===========================================
// FUNCIÓN DE MAPEO
// Convierte el estado de la UI (string) al formato de la DB (boolean)
// ===========================================
const mapFiltersToDB = (uiFilters: CategoriaFiltersState): FiltrosCategorias => {
    let activo: boolean | undefined;

    if (uiFilters.estado === 'Activa') {
        activo = true;
    } else if (uiFilters.estado === 'Inactiva') {
        activo = false;
    }

    return {
        busqueda: uiFilters.busqueda || undefined,
        activo: activo,
        // page y limit se añadirían aquí si se usaran
    };
};
// ===========================================

export default function CategoriaList({}: CategoriaListProps) {
    const [filters, setFilters] = useState<CategoriaFiltersState>(INITIAL_FILTERS);
    const [categorias, setCategorias] = useState<CategoriaConConteo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // La función recibe el tipo CategoriaFiltersState
    const handleFiltersChange = (newFilters: CategoriaFiltersState) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        setIsLoading(true);
        let debounceTimer: NodeJS.Timeout;

        const fetchCategories = async () => {
            try {
                // CORRECCIÓN 3: Mapear el estado del cliente al formato de la DB
                const filtersDB = mapFiltersToDB(filters);
                
                // Llamada a la Server Action
                const result = await getCategoriasConFiltros(filtersDB);
                
                if (result.success && result.data) {
                    setCategorias(result.data);
                } else {
                    // CORRECCIÓN 2: Manejo de error usando 'error'
                    console.error("Error fetching categories:", result.error);
                    setCategorias([]);
                }
            } catch (error) {
                console.error("Fetch failed:", error);
                setCategorias([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Lógica de Debouncing (500ms)
        if (filters.busqueda) {
            debounceTimer = setTimeout(fetchCategories, 500);
        } else {
            fetchCategories();
        }

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [filters]); 

    return (
        <div className="space-y-6">
            {/* Usamos el componente renombrado */}
            <CategoriaFiltersComponent 
                filters={filters}
                onFiltersChange={handleFiltersChange}
            />

            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">
                    Resultados de Categorías ({isLoading ? 'Cargando...' : categorias.length})
                </h2>
                
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {categorias.length === 0 ? (
                            <p className="text-center text-gray-500">No se encontraron categorías.</p>
                        ) : (
                            categorias.map(c => (
                                <div key={c.id} className="p-3 border rounded shadow-sm hover:bg-gray-50">
                                    <p className="font-medium">{c.nombre}</p>
                                    <p className="text-sm text-gray-600">{c.descripcion || 'Sin descripción'}</p>
                                    <p className="text-xs text-gray-500">
                                        Productos asociados: {c._count?.productos || 0}
                                    </p>
                                    <span className={`text-xs font-mono px-2 py-1 rounded-full 
                                        ${c.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                                    }>
                                        {c.activo ? 'Activa' : 'Inactiva'}
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