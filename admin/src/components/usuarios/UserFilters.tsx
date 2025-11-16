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
    <div className="bg-white p-4 rounded-lg border mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
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
          <Select
            value={filters.rol}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, rol: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="operador">Operador</SelectItem>
              <SelectItem value="usuario">Usuario</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <Select
            value={filters.estado}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, estado: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los estados</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="inactivo">Inactivo</SelectItem>
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
            className="text-gray-600"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}