'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components//ui/button';
import { Input } from '@/components//ui/input';
import { Label } from '@/components//ui/label';
import { Textarea } from '@/components//ui/textarea';
import { Switch } from '@/components//ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components//ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Cliente, ClienteUpdateInput } from '@/lib/api';
import { toast } from'@/app/hooks/use-toast';

// Funciones del API (ajústalas según tu implementación)
async function getCliente(id: number): Promise<Cliente> {
  const response = await fetch(`/api/clientes/${id}`);
  if (!response.ok) throw new Error('Error al cargar cliente');
  const result = await response.json();
  return result.data;
}

async function updateCliente(id: number, data: ClienteUpdateInput): Promise<Cliente> {
  const response = await fetch(`/api/clientes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar cliente');
  }
  
  const result = await response.json();
  return result.data;
}

export default function EditarClientePage() {
  const router = useRouter();
  const params = useParams();
  const clienteId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<ClienteUpdateInput>({
    email: '',
    razon_social: null,
    ruc: null,
    telefono: null,
    direccion: null,
    activo: true,
  });

  useEffect(() => {
    loadCliente();
  }, [clienteId]);

  const loadCliente = async () => {
    try {
      const data = await getCliente(clienteId);
      setCliente(data);
      setFormData({
        email: data.email,
        razon_social: data.razon_social,
        ruc: data.ruc,
        telefono: data.telefono,
        direccion: data.direccion,
        activo: data.activo,
      });
    } catch (error: any) {
      console.error('Error cargando cliente:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar el cliente',
      });
      router.push('/Panel-Administrativo/clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit: ClienteUpdateInput = {
        email: formData.email?.trim(),
        razon_social: formData.razon_social?.trim() || null,
        ruc: formData.ruc || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion?.trim() || null,
        activo: formData.activo,
      };

      await updateCliente(clienteId, dataToSubmit);

      toast({
        title: 'Éxito',
        description: 'Cliente actualizado correctamente',
      });

      router.push('/Panel-Administrativo/clientes');
    } catch (error: any) {
      console.error('Error actualizando cliente:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el cliente',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/Panel-Administrativo/clientes');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="container mx-auto py-6 max-w-3xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Cliente no encontrado
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-3xl">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={handleCancel}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Clientes
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Modifica los datos del cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@example.com"
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Razón Social */}
            <div className="space-y-2">
              <Label htmlFor="razon_social">Razón Social</Label>
              <Input
                id="razon_social"
                placeholder="Empresa S.A.C."
                value={formData.razon_social || ''}
                onChange={(e) =>
                  setFormData({ ...formData, razon_social: e.target.value || null })
                }
              />
            </div>

            {/* RUC */}
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                type="number"
                placeholder="20123456789"
                value={formData.ruc || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    ruc: e.target.value ? Number(e.target.value) : null 
                  })
                }
              />
              <p className="text-sm text-muted-foreground">
                Ingresa el RUC de 11 dígitos (opcional)
              </p>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="number"
                placeholder="987654321"
                value={formData.telefono || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    telefono: e.target.value ? Number(e.target.value) : null 
                  })
                }
              />
            </div>

            {/* Dirección */}
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                placeholder="Av. Principal 123, Distrito, Ciudad"
                value={formData.direccion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value || null })
                }
                rows={3}
              />
            </div>

            {/* Estado Activo */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="activo" className="text-base">
                  Estado del Cliente
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.activo 
                    ? 'El cliente está activo y puede realizar pedidos' 
                    : 'El cliente está inactivo y no puede realizar pedidos'
                  }
                </p>
              </div>
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, activo: checked })
                }
              />
            </div>

            {/* Información adicional */}
            {cliente.created_at && (
              <div className="text-sm text-muted-foreground">
                <p>Fecha de registro: {new Date(cliente.created_at).toLocaleDateString('es-PE')}</p>
                {cliente.updated_at && (
                  <p>Última actualización: {new Date(cliente.updated_at).toLocaleDateString('es-PE')}</p>
                )}
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}