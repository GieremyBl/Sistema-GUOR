'use client';

import { useState } from 'react';
import { Button } from '@/components//ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components//ui/dialog';
import { Input } from '@/components//ui/input';
import { Label } from '@/components//ui/label';
import { Textarea } from '@/components//ui/textarea';
import type { ClienteCreateInput } from '@/lib/types/cliente.types';

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
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ClienteCreateInput>({
    email: '',
    razon_social: null,
    ruc: null,
    telefono: null,
    direccion: null,
  });

  const resetForm = () => {
    setFormData({
      email: '',
      razon_social: null,
      ruc: null,
      telefono: null,
      direccion: null,
    });
    setError('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación de email requerido
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    // Validación de RUC si se proporciona
    if (formData.ruc && formData.ruc.toString().length !== 11) {
      setError('El RUC debe tener 11 dígitos');
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit: ClienteCreateInput = {
        email: formData.email.trim().toLowerCase(),
        razon_social: formData.razon_social?.trim() || null,
        ruc: formData.ruc || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion?.trim() || null,
      };

      await onSubmit(dataToSubmit);
      handleOpenChange(false);
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      setError(error.message || 'Error al crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo cliente. El campo de email es obligatorio.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="cliente@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setError('');
              }}
              disabled={loading}
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
              disabled={loading}
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
                  ruc: e.target.value ? Number(e.target.value) : null,
                })
              }
              disabled={loading}
            />
            <p className="text-xs text-gray-500">11 dígitos (sin guiones)</p>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="987654321"
              value={formData.telefono || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  telefono: e.target.value ? Number(e.target.value) : null,
                })
              }
              disabled={loading}
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
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
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