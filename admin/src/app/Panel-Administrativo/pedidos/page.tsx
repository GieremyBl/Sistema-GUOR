"use client";

import { PaginacionMeta } from '@/app/types';
import { useState, useEffect } from 'react';
import { getPedidos } from '@/lib/actions/pedidos';
import { Pedido, FetchPedidosParams, EstadoPedido, PrioridadPedido } from '@/app/types';
import { PedidosList } from '@/components/pedidos/PedidoList';
import { PedidosFilters } from '@/components/pedidos/PedidoFilters';
import { CreatePedidoDialog } from '@/components/pedidos/CreatePedidoDialog';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Package } from 'lucide-react';
import { usePermissions } from '@/app/hooks/usePermissions';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

export default function PedidosPage() {
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const canView = hasPermission('VIEW_PEDIDOS');
  const canManage = hasPermission('MANAGE_PEDIDOS');

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Filtros y paginación
  const [filters, setFilters] = useState<FetchPedidosParams>({
    page: 1,
    limit: 12,
  });

 const [meta, setMeta] = useState<PaginacionMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
});

  // Cargar pedidos
  const loadPedidos = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const result = await getPedidos(filters);

      if (result.success && result.data) {
        setPedidos(result.data.pedidos || []);
        setMeta(result.data.meta);
      } else {
        console.error('Error:', result.error);
        setPedidos([]);
      }
    } catch (error) {
      console.error('Error loading pedidos:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar al montar y cuando cambien los filtros
  useEffect(() => {
    if (canView && !permissionsLoading) {
      loadPedidos();
    }
  }, [filters, canView, permissionsLoading]);

  // Manejar cambios en filtros
  const handleFilterChange = (newFilters: Partial<FetchPedidosParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset a primera página al filtrar
    }));
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Refresh
  const handleRefresh = () => {
    loadPedidos(false);
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              No tienes permisos para ver los pedidos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gestión de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra los pedidos de tus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          {canManage && (
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pedido
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Filtros */}
      <PedidosFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-muted-foreground">Total Pedidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {pedidos.filter(p => p.estado === EstadoPedido.PENDIENTE).length}
            </div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {pedidos.filter(p => p.estado === EstadoPedido.EN_PROCESO).length}
            </div>
            <p className="text-xs text-muted-foreground">En Proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {pedidos.filter(p => p.estado === EstadoPedido.ENTREGADO).length}
            </div>
            <p className="text-xs text-muted-foreground">Entregados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pedidos */}
      <PedidosList 
        pedidos={pedidos} 
        loading={loading}
        onRefresh={handleRefresh}
      />

      {/* Paginación */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1 || loading}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page === meta.totalPages || loading}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Dialog de crear pedido */}
      <CreatePedidoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleRefresh}
      />
    </div>
  );
}