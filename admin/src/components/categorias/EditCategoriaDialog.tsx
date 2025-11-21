'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components//ui/dialog';
import { Button } from '@/components//ui/button';
import { Input } from '@/components//ui/input';
import { Label } from '@/components//ui/label';
import { Textarea } from '@/components//ui/textarea';
import { Switch } from '@/components//ui/switch';

interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

interface EditCategoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria: Categoria | null;
  onSubmit: (
    id: string,
    data: {
      nombre: string;
      descripcion?: string;
      activo: boolean;
    }
  ) => Promise<void>;
}

export default function EditCategoriaDialog({
  open,
  onOpenChange,
  categoria,
  onSubmit,
}: EditCategoriaDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        activo: categoria.activo,
      });
    }
  }, [categoria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria) return;

    setLoading(true);
    try {
      await onSubmit(categoria.id, {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        activo: formData.activo,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
          <DialogDescription>
            Modifica los datos de la categoría
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Categoría *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Estado Activo</Label>
              <p className="text-sm text-gray-500">
                La categoría estará visible en el sistema
              </p>
            </div>
            <Switch
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