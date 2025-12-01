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
import type { Cliente, ClienteUpdateInput } from '@/lib/types/cliente.types';

interface EditClienteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
  onSubmit: (id: number, data: ClienteUpdateInput) => Promise<void>;
}

export default function EditClienteDialog({
  open,
  onOpenChange,
  cliente,
  onSubmit,
}: EditClienteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    razon_social: '',
    ruc: '',
    telefono: '',
    direccion: '',
    activo: true,
  });

  useEffect(() => {
    if (cliente && open) {
      setFormData({
        email: cliente.email || '',
        razon_social: cliente.razon_social || '',
        ruc: cliente.ruc?.toString() || '',
        telefono: cliente.telefono?.toString() || '',
        direccion: cliente.direccion || '',
        activo: cliente.activo ?? true,
      });
      setError('');
    }
  }, [cliente, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente) return;

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
    if (formData.ruc && formData.ruc.length !== 11) {
      setError('El RUC debe tener 11 dígitos');
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit: ClienteUpdateInput = {
        email: formData.email.trim().toLowerCase(),
        razon_social: formData.razon_social?.trim() || null,
        ruc: formData.ruc ? Number(formData.ruc) : null,
        telefono: formData.telefono ? Number(formData.telefono) : null,
        direccion: formData.direccion?.trim() || null,
        activo: formData.activo,
      };

      await onSubmit(cliente.id, dataToSubmit);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);
      setError(error.message || 'Error al actualizar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos del cliente "{cliente?.razon_social || cliente?.email}"
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
              value={formData.razon_social}
              onChange={(e) => setFormData({ ...formData, razon_social: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* RUC */}
          <div className="space-y-2">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              type="text"
              placeholder="20123456789"
              value={formData.ruc}
              onChange={(e) => {
                // Solo permitir números
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, ruc: value });
              }}
              disabled={loading}
              maxLength={11}
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
              value={formData.telefono}
              onChange={(e) => {
                // Solo permitir números
                const value = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, telefono: value });
              }}
              disabled={loading}
            />
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Textarea
              id="direccion"
              placeholder="Av. Principal 123, Distrito, Ciudad"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              disabled={loading}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Estado Activo */}
          <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50">
            <div className="space-y-0.5">
              <Label htmlFor="activo" className="text-base font-medium">
                Estado del Cliente
              </Label>
              <p className="text-sm text-gray-600">
                {formData.activo ? '✓ Cliente activo' : '✗ Cliente inactivo'}
              </p>
            </div>
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, activo: checked })
              }
              disabled={loading}
            />
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