// admin/src/components/pedidos/PedidoDetailsDialog.tsx
"use client";

import { Pedido, ESTADO_PEDIDO_LABELS, ESTADO_PEDIDO_COLORS, PRIORIDAD_PEDIDO_LABELS, PRIORIDAD_PEDIDO_COLORS } from '@types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Badge } from '@/ui/badge';
import { Separator } from '@/ui/separator';
import { ScrollArea } from '@/ui/scroll-area';
import { 
  Package, 
  Calendar, 
  User, 
  MapPin, 
  FileText,
  Mail,
  Phone,
  Building,
  ShoppingCart
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PedidoDetailsDialogProps {
  pedido: Pedido;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PedidoDetailsDialog({ pedido, open, onOpenChange }: PedidoDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM, yyyy", { locale: es });
  };

  const subtotal = pedido.total / 1.18; // Calcular subtotal sin IGV
  const impuesto = pedido.total - subtotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedido #{pedido.id}
          </DialogTitle>
          <DialogDescription>
            Detalles completos del pedido
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Estados y Prioridad */}
            <div className="flex gap-2 flex-wrap">
              <Badge className={ESTADO_PEDIDO_COLORS[pedido.estado]}>
                {ESTADO_PEDIDO_LABELS[pedido.estado]}
              </Badge>
              <Badge className={PRIORIDAD_PEDIDO_COLORS[pedido.prioridad]}>
                Prioridad: {PRIORIDAD_PEDIDO_LABELS[pedido.prioridad]}
              </Badge>
            </div>

            <Separator />

            {/* Información del Cliente */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Información del Cliente
              </h3>
              <div className="grid gap-2 text-sm">
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {pedido.cliente?.razon_social || 'Sin razón social'}
                    </p>
                    {pedido.cliente?.ruc && (
                      <p className="text-muted-foreground text-xs">RUC: {pedido.cliente.ruc}</p>
                    )}
                  </div>
                </div>
                {pedido.cliente?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{pedido.cliente.email}</span>
                  </div>
                )}
                {pedido.cliente?.telefono && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{pedido.cliente.telefono}</span>
                  </div>
                )}
                {pedido.cliente?.direccion && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{pedido.cliente.direccion}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Fechas */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fechas
              </h3>
              <div className="grid gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Fecha de pedido</p>
                  <p className="font-medium">{formatDate(pedido.fecha_pedido)}</p>
                </div>
                {pedido.fecha_entrega && (
                  <div>
                    <p className="text-muted-foreground text-xs">Entrega estimada</p>
                    <p className="font-medium">{formatDate(pedido.fecha_entrega)}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Productos */}
            {pedido.detalles && pedido.detalles.length > 0 && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Productos ({pedido.detalles.length})
                  </h3>
                  <div className="space-y-3">
                    {pedido.detalles.map((detalle, index) => (
                      <div 
                        key={detalle.id || index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {detalle.producto?.imagen && (
                          <img
                            src={detalle.producto.imagen}
                            alt={detalle.producto.nombre}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {detalle.producto?.nombre || 'Producto sin nombre'}
                          </p>
                          {detalle.producto?.descripcion && (
                            <p className="text-xs text-muted-foreground">
                              {detalle.producto.descripcion}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {detalle.cantidad} x {formatCurrency(detalle.precio_unitario)}
                          </p>
                          <p className="font-semibold">{formatCurrency(detalle.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />
              </>
            )}

            {/* Resumen de Costos */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IGV (18%):</span>
                <span className="font-medium">{formatCurrency(impuesto)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary">{formatCurrency(pedido.total)}</span>
              </div>
            </div>

            {/* Información Adicional */}
            {pedido.creador && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Información Adicional
                  </h3>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Creado por</p>
                    <p className="text-sm">{pedido.creador.nombre_completo}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}