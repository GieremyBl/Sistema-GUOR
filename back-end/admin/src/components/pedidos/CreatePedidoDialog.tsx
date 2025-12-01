"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPedido } from '@/lib/actions/pedidos.actions';
import { fetchClientesActivos } from '@/lib/actions/clientes.actions';
import { getProductosDisponibles } from '@/lib/actions/productos.actions';
import { PrioridadPedido } from '@/lib/types/pedido.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/app/hooks/use-toast';
import { Loader2, CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const detalleSchema = z.object({
  producto_id: z.string().min(1, 'Selecciona un producto'),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precio_unitario: z.number().min(0, 'El precio debe ser positivo'),
});

// ✅ Usar z.nativeEnum() en lugar de z.enum()
const formSchema = z.object({
  cliente_id: z.string().min(1, 'Selecciona un cliente'),
  fecha_entrega: z.string().optional(),
  prioridad: z.nativeEnum(PrioridadPedido), // ✅ Cambio aquí
  detalles: z.array(detalleSchema).min(1, 'Agrega al menos un producto'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePedidoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreatePedidoDialog({ open, onOpenChange, onSuccess }: CreatePedidoDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [productos, setProductos] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cliente_id: '',
      prioridad: PrioridadPedido.NORMAL, // ✅ Usar el enum
      fecha_entrega: undefined,
      detalles: [{ producto_id: '', cantidad: 1, precio_unitario: 0 }],
    },
  });

  useEffect(() => {
    if (open) {
      loadInitialData();
    }
  }, [open]);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const [clientesRes, productosRes] = await Promise.all([
        fetchClientesActivos(),
        getProductosDisponibles(),
      ]);

      // fetchClientesActivos devuelve directamente Cliente[]
      if (clientesRes.success) {
        setClientes(clientesRes.data || []);
      } else {
        console.error('Error cargando clientes:', clientesRes.error);
      }

      // getProductosDisponibles devuelve { success, data }
      if (productosRes.success) {
        setProductos(productosRes.data || []);
      } else {
        console.error('Error cargando productos:', productosRes.error);
        setProductos([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleProductoChange = (index: number, productoId: string) => {
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      form.setValue(`detalles.${index}.precio_unitario`, producto.precio, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const detallesWatch = form.watch('detalles');

  const addDetalle = () => {
    const currentDetalles = form.getValues('detalles');
    form.setValue('detalles', [
      ...currentDetalles,
      { producto_id: '', cantidad: 1, precio_unitario: 0 },
    ]);
  };

  const removeDetalle = (index: number) => {
    const currentDetalles = form.getValues('detalles');
    if (currentDetalles.length > 1) {
      form.setValue(
        'detalles',
        currentDetalles.filter((_, i) => i !== index),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  };

  const calculateTotal = () => {
    const detalles = detallesWatch;
    const subtotal = detalles.reduce(
      (sum, d) => sum + (d.cantidad * d.precio_unitario || 0),
      0
    );
    const igv = subtotal * 0.18;
    return { subtotal, igv, total: subtotal + igv };
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // ✅ Transformar los datos al formato correcto
      const pedidoData = {
        cliente_id: Number(data.cliente_id),
        fecha_entrega: data.fecha_entrega,
        prioridad: data.prioridad,
        detalles: data.detalles.map(detalle => ({
          producto_id: Number(detalle.producto_id),
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario,
        })),
      };

      const result = await createPedido(pedidoData);

      if (result.success) {
        toast({
          title: '¡Pedido creado!',
          description: 'El pedido se ha creado exitosamente.',
        });
        form.reset({
          cliente_id: '',
          prioridad: PrioridadPedido.NORMAL,
          fecha_entrega: undefined,
          detalles: [{ producto_id: '', cantidad: 1, precio_unitario: 0 }],
        });
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result.error || 'Error al crear el pedido');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el pedido',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Pedido</DialogTitle>
          <DialogDescription>
            Completa los datos del pedido y agrega los productos
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cliente_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map((cliente) => (
                          <SelectItem key={cliente.id} value={String(cliente.id)}>
                            {cliente.razon_social} - RUC: {cliente.ruc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha_entrega"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Entrega</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP', { locale: es })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) =>
                              field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
                            }
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prioridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* ✅ Usar los valores del enum */}
                          <SelectItem value={PrioridadPedido.BAJA}>Baja</SelectItem>
                          <SelectItem value={PrioridadPedido.NORMAL}>Normal</SelectItem>
                          <SelectItem value={PrioridadPedido.ALTA}>Alta</SelectItem>
                          <SelectItem value={PrioridadPedido.URGENTE}>Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Productos *</FormLabel>
                  <Button type="button" variant="outline" size="sm" onClick={addDetalle}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>

                {detallesWatch.map((detalle, index) => (
                  <div key={index} className="flex gap-2 items-start p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.producto_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Producto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductoChange(index, value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productos.map((producto) => (
                                  <SelectItem key={producto.id} value={String(producto.id)}>
                                    {producto.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`detalles.${index}.cantidad`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value) || 1)}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`detalles.${index}.precio_unitario`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precio Unit.</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-8"
                      onClick={() => removeDetalle(index)}
                      disabled={detallesWatch.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {form.formState.errors.detalles?.message && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.detalles.message}
                  </p>
                )}
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">S/ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IGV (18%):</span>
                  <span className="font-medium">S/ {totals.igv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">S/ {totals.total.toFixed(2)}</span>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear Pedido
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}