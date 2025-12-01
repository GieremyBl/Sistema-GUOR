'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/app/hooks/use-toast';
import { createTallerAction } from '@/lib/actions/talleres.actions';
import { 
  EspecialidadTaller, 
  EstadoTaller,
  ESPECIALIDAD_TALLER_LABELS,
  ESTADO_TALLER_LABELS,
  type TallerCreateInput 
} from '@/lib/types/taller.types';

const tallerSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  ruc: z.string().optional(),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  direccion: z.string().optional(),
});

type TallerFormData = z.infer<typeof tallerSchema>;

interface CreateTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: TallerCreateInput) => Promise<void>;
}

export default function CreateTallerDialog({ 
  open, 
  onOpenChange,
  onSubmit 
}: CreateTallerDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [especialidadValue, setEspecialidadValue] = useState<string>('');
  const [estadoValue, setEstadoValue] = useState<EstadoTaller>(EstadoTaller.ACTIVO);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TallerFormData>({
    resolver: zodResolver(tallerSchema),
  });

  const handleFormSubmit = async (data: TallerFormData) => {
    setIsSubmitting(true);

    try {
      const createData: TallerCreateInput = {
        nombre: data.nombre,
        ruc: data.ruc || undefined,
        contacto: data.contacto || undefined,
        telefono: data.telefono || undefined,
        email: data.email || undefined,
        direccion: data.direccion || undefined,
        especialidad: especialidadValue ? (especialidadValue as EspecialidadTaller) : undefined,
        estado: estadoValue,
      };

      // Si se proporciona onSubmit desde el padre, usarlo
      if (onSubmit) {
        await onSubmit(createData);
      } else {
        // Si no, usar la acción directamente
        const result = await createTallerAction(createData);

        if (!result.success) {
          throw new Error(result.error);
        }

        toast({
          title: '✅ Taller creado',
          description: result.message || 'El taller ha sido creado exitosamente',
        });
      }

      reset();
      setEspecialidadValue('');
      setEstadoValue(EstadoTaller.ACTIVO);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creando taller:', error);
      toast({
        title: '❌ Error',
        description: error.message || 'Error al crear el taller',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Taller</DialogTitle>
          <DialogDescription>
            Completa la información del taller de confección
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">
              Nombre del Taller <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: Taller San Juan"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contacto">Persona de Contacto</Label>
              <Input
                id="contacto"
                {...register('contacto')}
                placeholder="Ej: Juan Pérez"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                {...register('telefono')}
                placeholder="987654321"
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Especialidad</Label>
              <Select 
                value={especialidadValue} 
                onValueChange={setEspecialidadValue}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EspecialidadTaller).map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {ESPECIALIDAD_TALLER_LABELS[esp]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>
                Estado <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={estadoValue} 
                onValueChange={(value) => setEstadoValue(value as EstadoTaller)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EstadoTaller).map((est) => (
                    <SelectItem key={est} value={est}>
                      {ESTADO_TALLER_LABELS[est]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Crear Taller
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}