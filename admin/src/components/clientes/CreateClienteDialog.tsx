'use client';

import { useState } from 'react';
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
import { ClienteCreateInput } from '@/lib/api';

interface CreateClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClienteCreateInput) => Promise<void>;
}

export default function CreateClienteDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateClienteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteCreateInput>({
    email: '',
    razon_social: null,
    ruc: null,
    telefono: null,
    direccion: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpiar campos vacíos y convertir a null
      const dataToSubmit: ClienteCreateInput = {
        email: formData.email.trim(),
        razon_social: formData.razon_social?.trim() || null,
        ruc: formData.ruc || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion?.trim() || null,
      };

      await onSubmit(dataToSubmit);
      
      // Resetear formulario
      setFormData({
        email: '',
        razon_social: null,
        ruc: null,
        telefono: null,
        direccion: null,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo cliente. Los campos marcados con * son obligatorios.
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
                  setFormData({ ...formData, razon_social: e.target.value || null })
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
                    ruc: e.target.value ? Number(e.target.value) : null 
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
                    telefono: e.target.value ? Number(e.target.value) : null 
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
                  setFormData({ ...formData, direccion: e.target.value || null })
                }
                rows={3}
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
              {loading ? 'Creando...' : 'Crear Cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}