// admin/src/components/pedidos/PedidosList.tsx
"use client";

import { useState } from 'react';
import { Pedido } from '@/app/types';
import { PedidoCard } from './PedidoCard';
import { CreatePedidoDialog } from './CreatePedidoDialog';
import { EditPedidoDialog } from './EditPedidoDialog';
import { DeletePedidoDialog } from './DeletePedidoDialog';
import { PedidoDetailsDialog } from './PedidoDetailsDialog';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { usePermissions } from '@/app/hooks/usePermissions';

interface PedidosListProps {
  pedidos: Pedido[];
  loading?: boolean;
  onRefresh: () => void;
}

export function PedidosList({ pedidos, loading, onRefresh }: PedidosListProps) {
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('MANAGE_PEDIDOS');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [deletingPedido, setDeletingPedido] = useState<Pedido | null>(null);
  const [viewingPedido, setViewingPedido] = useState<Pedido | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  if (pedidos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">No hay pedidos</h3>
        <p className="text-muted-foreground mb-6">
          No se encontraron pedidos con los filtros aplicados.
        </p>
        {canManage && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Pedido
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            pedido={pedido}
            onView={() => setViewingPedido(pedido)}
            onEdit={canManage ? () => setEditingPedido(pedido) : undefined}
            onDelete={canManage ? () => setDeletingPedido(pedido) : undefined}
          />
        ))}
      </div>

      {/* Dialogs */}
      <CreatePedidoDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={onRefresh}
      />

      {editingPedido && (
        <EditPedidoDialog
          pedido={editingPedido}
          open={!!editingPedido}
          onOpenChange={(open) => !open && setEditingPedido(null)}
          onSuccess={onRefresh}
        />
      )}

      {deletingPedido && (
        <DeletePedidoDialog
          pedido={deletingPedido}
          open={!!deletingPedido}
          onOpenChange={(open) => !open && setDeletingPedido(null)}
          onSuccess={onRefresh}
        />
      )}

      {viewingPedido && (
        <PedidoDetailsDialog
          pedido={viewingPedido}
          open={!!viewingPedido}
          onOpenChange={(open) => !open && setViewingPedido(null)}
        />
      )}
    </>
  );
}