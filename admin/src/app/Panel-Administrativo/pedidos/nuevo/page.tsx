'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { createPedido, fetchProductos, ProductoApi, PrioridadPedido } from '@/lib/api';

interface DetalleTemp {
  id: string;
  producto_id: string;
  producto: ProductoApi;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export default function NuevoPedidoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState<ProductoApi[]>([]);

  // Datos del pedido
  const [clienteId, setClienteId] = useState('');
  const [clienteRuc, setClienteRuc] = useState('');
  const [clienteRazonSocial, setClienteRazonSocial] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadPedido>('NORMAL');

  // Detalles del pedido
  const [detalles, setDetalles] = useState<DetalleTemp[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('1');

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const data = await fetchProductos();
      setProductos(data.filter((p) => p.estado === 'activo'));
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los productos',
      });
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || !cantidad) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selecciona un producto y cantidad',
      });
      return;
    }

    const producto = productos.find((p) => p.id.toString() === productoSeleccionado);
    if (!producto) return;

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'La cantidad debe ser mayor a 0',
      });
      return;
    }

    if (cantidadNum > producto.stock) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Stock insuficiente. Disponible: ${producto.stock}`,
      });
      return;
    }

    // Verificar si ya existe el producto
    const existe = detalles.find((d) => d.producto_id === productoSeleccionado);
    if (existe) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'El producto ya fue agregado',
      });
      return;
    }

    const nuevoDetalle: DetalleTemp = {
      id: Date.now().toString(),
      producto_id: productoSeleccionado,
      producto,
      cantidad: cantidadNum,
      precio_unitario: producto.precio,
      subtotal: cantidadNum * producto.precio,
    };

    setDetalles([...detalles, nuevoDetalle]);
    setProductoSeleccionado('');
    setCantidad('1');

    toast({
      title: 'Producto agregado',
      description: `${producto.nombre} agregado al pedido`,
    });
  };

  const eliminarProducto = (id: string) => {
    setDetalles(detalles.filter((d) => d.id !== id));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, det) => sum + det.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteRuc || !clienteRazonSocial) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Complete los datos del cliente',
      });
      return;
    }

    if (detalles.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Agrega al menos un producto al pedido',
      });
      return;
    }

    setLoading(true);
    try {
      // Primero crear/buscar cliente
      // TODO: Aquí deberías tener una función para buscar o crear el cliente
      // Por ahora asumimos que tienes el cliente_id
      
      await createPedido({
        cliente_id: clienteId || '1', // Temporal
        fecha_entrega: fechaEntrega || undefined,
        prioridad,
        detalles: detalles.map((d) => ({
          producto_id: d.producto_id,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      });

      toast({
        title: 'Éxito',
        description: 'Pedido creado correctamente',
      });

      router.push('/Panel-Administrativo/pedidos');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el pedido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Pedido</h1>
        <p className="text-gray-600 mt-1">
          Completa el formulario para registrar un nuevo pedido
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Datos del cliente que realiza el pedido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC *</Label>
                <Input
                  id="ruc"
                  placeholder="20123456789"
                  value={clienteRuc}
                  onChange={(e) => setClienteRuc(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="razonSocial">Razón Social *</Label>
                <Input
                  id="razonSocial"
                  placeholder="Empresa S.A.C."
                  value={clienteRazonSocial}
                  onChange={(e) => setClienteRazonSocial(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos del Pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Pedido</CardTitle>
            <CardDescription>Detalles generales del pedido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaEntrega">Fecha de Entrega</Label>
                <Input
                  id="fechaEntrega"
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={prioridad} onValueChange={(v: any) => setPrioridad(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BAJA">Baja</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="ALTA">Alta</SelectItem>
                    <SelectItem value="URGENTE">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Productos del Pedido
            </CardTitle>
            <CardDescription>Agrega productos al pedido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Agregar producto */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nombre} - S/ {p.precio.toFixed(2)} (Stock: {p.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  min="1"
                  placeholder="Cant."
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>
              <Button type="button" onClick={agregarProducto}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>

            {/* Lista de productos */}
            {detalles.length > 0 && (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalles.map((detalle) => (
                        <TableRow key={detalle.id}>
                          <TableCell className="font-medium">
                            {detalle.producto.nombre}
                          </TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell>S/ {detalle.precio_unitario.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">
                            S/ {detalle.subtotal.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarProducto(detalle.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">Total del Pedido</p>
                    <p className="text-3xl font-bold text-green-600">
                      S/ {calcularTotal().toFixed(2)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/Panel-Administrativo/pedidos')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Pedido'}
          </Button>
        </div>
      </form>
    </div>
  );
}