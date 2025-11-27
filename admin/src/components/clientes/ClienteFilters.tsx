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

interface Filters {
  busqueda: string;
  estado: string;
}

interface ClienteFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function ClienteFilters({ filters, onFiltersChange }: ClienteFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      busqueda: '',
      estado: '',
    });
  };

  const hasActiveFilters = filters.busqueda || filters.estado;

  return (
    <div className="bg-white p-6 rounded-lg border mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o RUC..."
              value={filters.busqueda}
              onChange={(e) =>
                onFiltersChange({ ...filters, busqueda: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro por Estado */}
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
              <SelectItem value="ACTIVO" className="cursor-pointer">
                Activo
              </SelectItem>
              <SelectItem value="INACTIVO" className="cursor-pointer">
                Inactivo
              </SelectItem>
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