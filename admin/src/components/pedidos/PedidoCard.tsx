"use client";

import { Pedido, ESTADO_PEDIDO_LABELS, ESTADO_PEDIDO_COLORS, PRIORIDAD_PEDIDO_LABELS, PRIORIDAD_PEDIDO_COLORS } from '@/app/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, Edit, Trash2, MoreVertical, Package, Calendar, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PedidoCardProps {
  pedido: Pedido;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PedidoCard({ pedido, onView, onEdit, onDelete }: PedidoCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMM, yyyy", { locale: es });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono text-sm font-semibold">
                #{pedido.id}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {pedido.cliente?.razon_social || 'Sin cliente'}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalles
              </DropdownMenuItem>
              {onEdit && (
                <>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Estados */}
        <div className="flex gap-2 flex-wrap">
          <Badge className={ESTADO_PEDIDO_COLORS[pedido.estado]}>
            {ESTADO_PEDIDO_LABELS[pedido.estado]}
          </Badge>
          <Badge className={PRIORIDAD_PEDIDO_COLORS[pedido.prioridad]}>
            {PRIORIDAD_PEDIDO_LABELS[pedido.prioridad]}
          </Badge>
        </div>

        {/* Información */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(pedido.fecha_pedido)}</span>
          </div>
          
          {pedido.fecha_entrega && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs">
                Entrega: {formatDate(pedido.fecha_entrega)}
              </span>
            </div>
          )}

          {pedido.cliente?.direccion && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs line-clamp-1">{pedido.cliente.direccion}</span>
            </div>
          )}

          {pedido.creador && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs">{pedido.creador.nombre_completo}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(pedido.total)}
            </span>
          </div>
          {pedido.detalles && pedido.detalles.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {pedido.detalles.length} {pedido.detalles.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalles
        </Button>
      </CardFooter>
    </Card>
  );
}