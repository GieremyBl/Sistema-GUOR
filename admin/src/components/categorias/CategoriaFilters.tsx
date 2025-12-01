'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { 
    CategoriaFiltersState, 
    CategoriaFiltersProps, 
    CATEGORY_STATUS_OPTIONS 
} from '@/lib/types/categoria.types'; 


export default function CategoryFilters({ filters, onFiltersChange }: CategoriaFiltersProps) {
    // La variable filters está correctamente tipada como CategoriaFiltersState a través de CategoryFiltersProps
    const handleReset = () => {
        onFiltersChange({
            busqueda: '',
            estado: '',
        });
    };

    const hasActiveFilters = filters.busqueda || filters.estado;

    return (
        <div className="bg-white p-6 rounded-lg border mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={filters.busqueda}
                            onChange={(e) =>
                                onFiltersChange({ ...filters, busqueda: e.target.value })
                            }
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filtro de Espacio (Placeholder para mantener layout) */}
                <div></div> 

                {/* Filtro por Estado de Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                    </label>
                    <Select
                        value={filters.estado || 'todos'}
                        onValueChange={(value) =>
                            onFiltersChange({
                                ...filters,
                                estado: value === 'todos' ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="cursor-pointer">
                            <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos" className="cursor-pointer">
                                Todos los estados
                            </SelectItem>
                            {/* Usamos la constante importada */}
                            {CATEGORY_STATUS_OPTIONS.map((status) => (
                                <SelectItem key={status.value} value={status.value} className="cursor-pointer">
                                    {status.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Botón limpiar filtros */}
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar filtros
                    </Button>
                </div>
            )}
        </div>
    );
}