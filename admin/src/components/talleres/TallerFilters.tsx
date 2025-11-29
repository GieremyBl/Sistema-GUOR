'use client';

import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { 
  EstadoTaller, 
  EspecialidadTaller,
  ESTADO_TALLER_LABELS,
  ESPECIALIDAD_TALLER_LABELS 
} from '@/lib/types/taller.types';

interface TallerFiltersProps {
  filters: {
    busqueda: string;
    estado: string;
    especialidad: string;
  };
  onFiltersChange: (filters: {
    busqueda: string;
    estado: string;
    especialidad: string;
  }) => void;
}

export default function TallerFilters({ filters, onFiltersChange }: TallerFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleBusquedaChange = (value: string) => {
    const newFilters = { ...localFilters, busqueda: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEstadoChange = (value: string) => {
    const newFilters = { ...localFilters, estado: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleEspecialidadChange = (value: string) => {
    const newFilters = { ...localFilters, especialidad: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      busqueda: '',
      estado: '',
      especialidad: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters.busqueda || localFilters.estado || localFilters.especialidad;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Campo de búsqueda */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, RUC, contacto..."
                  value={localFilters.busqueda}
                  onChange={(e) => handleBusquedaChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por Estado */}
            <div>
              <Select
                value={localFilters.estado}
                onValueChange={handleEstadoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todos los estados</SelectItem>
                  {Object.values(EstadoTaller).map((estado) => (
                    <SelectItem key={estado} value={estado}>
                      {ESTADO_TALLER_LABELS[estado]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Especialidad */}
            <div>
              <Select
                value={localFilters.especialidad}
                onValueChange={handleEspecialidadChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">Todas las especialidades</SelectItem>
                  {Object.values(EspecialidadTaller).map((especialidad) => (
                    <SelectItem key={especialidad} value={especialidad}>
                      {ESPECIALIDAD_TALLER_LABELS[especialidad]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Botón para limpiar filtros */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}