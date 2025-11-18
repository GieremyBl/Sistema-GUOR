"use client";

import { useState, useEffect } from 'react';
import { FetchPedidosParams, EstadoPedido, PrioridadPedido } from '@/app/types';
import { getClientesActivos } from '@/lib/actions/clientes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X, Filter } from 'lucide-react';

interface PedidosFiltersProps {
  filters: FetchPedidosParams;
  onFilterChange: (filters: Partial<FetchPedidosParams>) => void;
  loading?: boolean;
}

export function PedidosFilters({ filters, onFilterChange, loading }: PedidosFiltersProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const result = await getClientesActivos();
      if (result.success) {
        setClientes(result.data || []);
      }
    } catch (error) {
      console.error('Error loading clientes:', error);
    }
  };

  const handleReset = () => {
    onFilterChange({
      busqueda: '',
      estado: undefined,
      prioridad: undefined,
      cliente_id: undefined,
      fecha_desde: '',
      fecha_hasta: '',
    });
  };

  const hasActiveFilters = 
    filters.busqueda || 
    filters.estado || 
    filters.prioridad || 
    filters.cliente_id ||
    filters.fecha_desde ||
    filters.fecha_hasta;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Primera fila - siempre visible */}
          <div className="flex gap-4 items-end">
            {/* Búsqueda */}
            <div className="flex-1">
              <Label htmlFor="busqueda">Buscar</Label>
              <Input
                id="busqueda"
                placeholder="Buscar por número, cliente..."
                value={filters.busqueda || ''}
                onChange={(e) => onFilterChange({ busqueda: e.target.value })}
                disabled={loading}
              />
            </div>

            {/* Estado */}
            <div className="w-48">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={filters.estado || 'all'}
                onValueChange={(value) =>
                  onFilterChange({ estado: value === 'all' ? undefined : (value as EstadoPedido) })
                }
                disabled={loading}
              >
                <SelectTrigger id="estado">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                  <SelectItem value="TERMINADO">Terminado</SelectItem>
                  <SelectItem value="ENTREGADO">Entregado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                disabled={loading}
              >
                <Filter className="h-4 w-4" />
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filtros adicionales - colapsables */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {/* Cliente */}
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={filters.cliente_id?.toString() || 'all'}
                  onValueChange={(value) =>
                    onFilterChange({ cliente_id: value === 'all' ? undefined : Number(value) })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.razon_social}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prioridad */}
              <div>
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select
                  value={filters.prioridad || 'all'}
                  onValueChange={(value) =>
                    onFilterChange({ prioridad: value === 'all' ? undefined : (value as PrioridadPedido) })
                  }
                  disabled={loading}
                >
                  <SelectTrigger id="prioridad">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="BAJA">Baja</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="URGENTE">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha Desde */}
              <div>
                <Label htmlFor="fecha_desde">Fecha Desde</Label>
                <Input
                  id="fecha_desde"
                  type="date"
                  value={filters.fecha_desde || ''}
                  onChange={(e) => onFilterChange({ fecha_desde: e.target.value })}
                  disabled={loading}
                />
              </div>

              {/* Fecha Hasta */}
              <div>
                <Label htmlFor="fecha_hasta">Fecha Hasta</Label>
                <Input
                  id="fecha_hasta"
                  type="date"
                  value={filters.fecha_hasta || ''}
                  onChange={(e) => onFilterChange({ fecha_hasta: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}