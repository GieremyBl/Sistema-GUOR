'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Briefcase } from 'lucide-react';
import { Button } from '@/components//ui/button';
import { Input } from '@/components//ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components//ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components///ui/select';
import { getTalleresAction, getEstadisticasTalleresAction } from '@/lib/actions/talleres';
import { TalleresTable } from '@/components/talleres/TalleresTable';
import { CreateTallerDialog } from '@/components/talleres/CreateTallerDialog';
import type { Taller, EstadoTaller, EspecialidadTaller } from '@/lib/api';

const especialidadLabels: Record<EspecialidadTaller, string> = {
  CORTE: 'Corte',
  CONFECCION: 'Confección',
  BORDADO: 'Bordado',
  ESTAMPADO: 'Estampado',
  COSTURA: 'Costura',
  ACABADOS: 'Acabados',
  OTRO: 'Otro',
};

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [busqueda, setBusqueda] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [especialidadFilter, setEspecialidadFilter] = useState<string>('');

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  const [estadisticas, setEstadisticas] = useState<any>(null);

  useEffect(() => {
    loadTalleres();
    loadEstadisticas();
  }, [page, busqueda, estadoFilter, especialidadFilter]);

  const loadTalleres = async () => {
    setLoading(true);
    try {
      const result = await getTalleresAction({
        page,
        limit,
        busqueda: busqueda || undefined,
        estado: estadoFilter as EstadoTaller || undefined,
        especialidad: especialidadFilter as EspecialidadTaller || undefined,
      });

      if (result.success && result.data) {
        setTalleres(result.data.talleres);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('Error cargando talleres:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const result = await getEstadisticasTalleresAction();
      if (result.success) {
        setEstadisticas(result.data);
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleSearch = (value: string) => {
    setBusqueda(value);
    setPage(1);
  };

  const handleEstadoFilter = (value: string) => {
    setEstadoFilter(value === 'todos' ? '' : value);
    setPage(1);
  };

  const handleEspecialidadFilter = (value: string) => {
    setEspecialidadFilter(value === 'todas' ? '' : value);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Talleres</h1>
          <p className="text-muted-foreground">
            Gestiona los talleres de confección
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Taller
        </Button>
      </div>

      {estadisticas && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Talleres</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estadisticas.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Talleres Activos</CardTitle>
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.porEstado?.ACTIVO || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspendidos</CardTitle>
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estadisticas.porEstado?.SUSPENDIDO || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busca y filtra talleres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, RUC o contacto..."
                value={busqueda}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={estadoFilter || 'todos'} onValueChange={handleEstadoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="ACTIVO">Activo</SelectItem>
                <SelectItem value="INACTIVO">Inactivo</SelectItem>
                <SelectItem value="SUSPENDIDO">Suspendido</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={especialidadFilter || 'todas'}
              onValueChange={handleEspecialidadFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las especialidades</SelectItem>
                {Object.entries(especialidadLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando talleres...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TalleresTable talleres={talleres} onUpdate={loadTalleres} />
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {talleres.length} de {total} talleres
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <CreateTallerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadTalleres}
      />
    </div>
  );
}
