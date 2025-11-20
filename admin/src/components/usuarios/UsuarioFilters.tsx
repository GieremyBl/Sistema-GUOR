'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

interface Filters {
  busqueda: string;
  rol: string;
  estado: string;
}

interface UserFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function UserFilters({ filters, onFiltersChange }: UserFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      busqueda: '',
      rol: '',
      estado: '',
    });
  };

  const hasActiveFilters = filters.busqueda || filters.rol || filters.estado;

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
              placeholder="Buscar por nombre o email..."
              value={filters.busqueda}
              onChange={(e) =>
                onFiltersChange({ ...filters, busqueda: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro por Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rol
          </label>
          <Select
            value={filters.rol || 'todos'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                rol: value === 'todos' ? '' : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="administrador">Administrador</SelectItem>
              <SelectItem value="recepcionista">Recepcionista</SelectItem>
              <SelectItem value="diseñador">Diseñador</SelectItem>
              <SelectItem value="cortador">Cortador</SelectItem>
              <SelectItem value="ayudante">Ayudante</SelectItem>
              <SelectItem value="representante_taller">Representante Taller</SelectItem>
            </SelectContent>
          </Select>
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
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="INACTIVO">Inactivo</SelectItem>
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
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}