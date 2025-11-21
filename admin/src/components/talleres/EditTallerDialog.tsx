'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components//ui/select';
import { useToast } from'@/app/hooks/use-toast';
import { updateTallerAction } from '@/lib/actions/talleres';
import type { Taller, TallerUpdateData, EspecialidadTaller, EstadoTaller } from '@/lib/api';

const tallerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  ruc: z.string().optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
});

type TallerFormData = z.infer<typeof tallerSchema>;

interface EditTallerDialogProps {
  taller: Taller;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const especialidades: { value: EspecialidadTaller; label: string }[] = [
  { value: 'CORTE', label: 'Corte' },
  { value: 'CONFECCION', label: 'Confección' },
  { value: 'BORDADO', label: 'Bordado' },
  { value: 'ESTAMPADO', label: 'Estampado' },
  { value: 'COSTURA', label: 'Costura' },
  { value: 'ACABADOS', label: 'Acabados' },
  { value: 'OTRO', label: 'Otro' },
];

const estados: { value: EstadoTaller; label: string }[] = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
  { value: 'SUSPENDIDO', label: 'Suspendido' },
];

export function EditTallerDialog({ taller, open, onOpenChange, onSuccess }: EditTallerDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [especialidadValue, setEspecialidadValue] = useState<string>(taller.especialidad || '');
  const [estadoValue, setEstadoValue] = useState<string>(taller.estado);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TallerFormData>({
    resolver: zodResolver(tallerSchema),
    defaultValues: {
      nombre: taller.nombre,
      ruc: taller.ruc || '',
      contacto: taller.contacto || '',
      telefono: taller.telefono || '',
      email: taller.email || '',
      direccion: taller.direccion || '',
    },
  });

  useEffect(() => {
    setEspecialidadValue(taller.especialidad || '');
    setEstadoValue(taller.estado);
  }, [taller]);

  const onSubmit = async (data: TallerFormData) => {
    setIsSubmitting(true);

    try {
      const updateData: TallerUpdateData = {
        nombre: data.nombre,
        ruc: data.ruc || undefined,
        contacto: data.contacto || undefined,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        direccion: data.direccion || undefined,
        especialidad: especialidadValue ? (especialidadValue as EspecialidadTaller) : undefined,
        estado: estadoValue as EstadoTaller,
      };

      const result = await updateTallerAction(taller.id, updateData);

      if (result.success) {
        toast({
          title: '✅ Taller actualizado',
          description: result.message || 'El taller ha sido actualizado exitosamente',
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: '❌ Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'Error al actualizar el taller',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Taller</DialogTitle>
          <DialogDescription>
            Modifica la información del taller
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">
              Nombre del Taller <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: Taller San Juan"
            />
            {errors.nombre && (
              <p className="text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="ruc">RUC</Label>
            <Input
              id="ruc"
              {...register('ruc')}
              placeholder="20123456789"
              maxLength={11}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contacto">Persona de Contacto</Label>
              <Input
                id="contacto"
                {...register('contacto')}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register('telefono')}
                placeholder="987654321"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contacto@taller.com"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              {...register('direccion')}
              placeholder="Av. Principal 123, Lima"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Especialidad</Label>
              <Select value={especialidadValue} onValueChange={setEspecialidadValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp.value} value={esp.value}>
                      {esp.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select value={estadoValue} onValueChange={setEstadoValue}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((est) => (
                    <SelectItem key={est.value} value={est.value}>
                      {est.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
          <Button onClick={handleFormSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}