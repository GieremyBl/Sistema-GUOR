'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ClienteUpdateInput } from '@/lib/api';

interface ClienteEdit {
  id: string;
  ruc?: number;
  razon_social?: string;
  email: string;
  telefono?: number;
  direccion?: string;
  activo: boolean;
}

interface EditClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteEdit;
  onSubmit: (id: string, data: ClienteUpdateInput) => Promise<void>;
}

export default function EditClienteDialog({
  open,
  onOpenChange,
  cliente,
  onSubmit,
}: EditClienteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteEdit>(cliente);

  useEffect(() => {
    setFormData(cliente);
  }, [cliente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit: ClienteUpdateInput = {
        email: formData.email.trim(),
        razon_social: formData.razon_social?.trim() || null,
        ruc: formData.ruc || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion?.trim() || null,
        activo: formData.activo,
      };

      await onSubmit(cliente.id, dataToSubmit);
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos del cliente. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Razón Social */}
            <div className="grid gap-2">
              <Label htmlFor="razon_social">Razón Social</Label>
              <Input
                id="razon_social"
                placeholder="Empresa S.A.C."
                value={formData.razon_social || ''}
                onChange={(e) =>
                  setFormData({ ...formData, razon_social: e.target.value || undefined })
                }
              />
            </div>

            {/* RUC */}
            <div className="grid gap-2">
              <Label htmlFor="ruc">RUC</Label>
              <Input
                id="ruc"
                type="number"
                placeholder="20123456789"
                value={formData.ruc || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    ruc: e.target.value ? Number(e.target.value) : undefined 
                  })
                }
              />
            </div>

            {/* Teléfono */}
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="number"
                placeholder="987654321"
                value={formData.telefono || ''}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    telefono: e.target.value ? Number(e.target.value) : undefined 
                  })
                }
              />
            </div>

            {/* Dirección */}
            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                placeholder="Av. Principal 123, Distrito, Ciudad"
                value={formData.direccion || ''}
                onChange={(e) =>
                  setFormData({ ...formData, direccion: e.target.value || undefined })
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
                    ? 'El cliente está activo' 
                    : 'El cliente está inactivo'
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}