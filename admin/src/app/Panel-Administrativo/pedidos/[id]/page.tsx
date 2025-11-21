'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components//ui/button';
import { Badge } from '@/components//ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components//ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components//ui/card';
import { ArrowLeft, Loader2, Package, User, Calendar, DollarSign } from 'lucide-react';
import { useToast } from'@/app/hooks/use-toast';
import { getPedido, Pedido, EstadoPedido, PrioridadPedido } from '@/lib/api';';
import { format } from 'date-fns';

export default function DetallePedidoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPedido();
  }, [params.id]);

  const loadPedido = async () => {
    try {
      const data = await getPedido(params.id as string);
      setPedido(data.pedido);
    } catch (error: any) {
      console.error('Error cargando pedido:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo cargar el pedido',
      });
      router.push('/Panel-Administrativo/pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: EstadoPedido) => {
    const colors: Record<EstadoPedido, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      EN_PROCESO: 'bg-blue-100 text-blue-800',
      TERMINADO: 'bg-green-100 text-green-800',
      ENTREGADO: 'bg-gray-100 text-gray-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[estado]}>{estado}</Badge>;
  };

  const getPrioridadBadge = (prioridad: PrioridadPedido) => {
    const colors: Record<PrioridadPedido, string> = {
      BAJA: 'bg-gray-100 text-gray-800',
      NORMAL: 'bg-blue-100 text-blue-800',
      ALTA: 'bg-orange-100 text-orange-800',
      URGENTE: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[prioridad]}>{prioridad}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Pedido #{pedido.id}</h1>
          <p className="text-gray-600 mt-1">
            Creado el {format(new Date(pedido.created_at), 'dd/MM/yyyy HH:mm')}
          </p>
        </div>
        <div className="flex gap-2">
          {getEstadoBadge(pedido.estado)}
          {getPrioridadBadge(pedido.prioridad)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Info del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Razón Social</p>
                <p className="font-medium">{pedido.cliente?.razon_social || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">RUC</p>
                <p className="font-medium">{pedido.cliente?.ruc || 'N/A'}</p>
              </div>
              {pedido.cliente?.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{pedido.cliente.email}</p>
                </div>
              )}
              {pedido.cliente?.telefono && (
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{pedido.cliente.telefono}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Fecha de Pedido</p>
                <p className="font-medium">
                  {format(new Date(pedido.fecha_pedido), 'dd/MM/yyyy')}
                </p>
              </div>
              {pedido.fecha_entrega && (
                <div>
                  <p className="text-sm text-gray-500">Fecha de Entrega</p>
                  <p className="font-medium">
                    {format(new Date(pedido.fecha_entrega), 'dd/MM/yyyy')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="font-medium">
                  {format(new Date(pedido.updated_at), 'dd/MM/yyyy HH:mm')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-3xl font-bold text-green-600">
                  S/ {pedido.total.toFixed(2)}
                </p>
              </div>
              {pedido.creador && (
                <div>
                  <p className="text-sm text-gray-500">Creado por</p>
                  <p className="font-medium">{pedido.creador.nombre_completo}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalles del Pedido */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos del Pedido
          </CardTitle>
          <CardDescription>
            {pedido.detalles?.length || 0} productos en este pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedido.detalles?.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {detalle.producto?.nombre || 'N/A'}
                        </div>
                        {detalle.producto?.descripcion && (
                          <div className="text-sm text-gray-500">
                            {detalle.producto.descripcion}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>S/ {detalle.precio_unitario.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">
                      S/ {detalle.subtotal.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Total */}
          <div className="flex justify-end mt-4 pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total del Pedido</p>
              <p className="text-2xl font-bold text-green-600">
                S/ {pedido.total.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}