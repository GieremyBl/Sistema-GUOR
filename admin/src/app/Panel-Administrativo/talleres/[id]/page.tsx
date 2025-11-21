'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin, Briefcase, Calendar } from 'lucide-react';
import { Button } from '@/components///ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components///ui/card';
import { Badge } from '@/components///ui/badge';
import { toast } from '@/app/hooks/use-toast';
import { getTallerAction, deleteTallerAction } from '@/lib/actions/talleres';
import { EditTallerDialog } from '@/components///talleres/EditTallerDialog';
import { DeleteTallerDialog } from '@/components///talleres/DeleteTallerDialog';
import type { Taller, EstadoTaller, EspecialidadTaller } from '@/lib/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const estadoColors: Record<EstadoTaller, string> = {
  ACTIVO: 'bg-green-500/10 text-green-600 border-green-500/20',
  INACTIVO: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  SUSPENDIDO: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const especialidadLabels: Record<EspecialidadTaller, string> = {
  CORTE: 'Corte',
  CONFECCION: 'Confección',
  BORDADO: 'Bordado',
  ESTAMPADO: 'Estampado',
  COSTURA: 'Costura',
  ACABADOS: 'Acabados',
  OTRO: 'Otro',
};

export default function TallerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);

  const [taller, setTaller] = useState<Taller | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTaller();
  }, [id]);

  const loadTaller = async () => {
    setLoading(true);
    try {
      const result = await getTallerAction(id);
      if (result.success && result.data) {
        setTaller(result.data);
      } else {
        toast({
          title: '❌ Error',
          description: 'No se pudo cargar el taller',
          variant: 'destructive',
        });
        router.push('/Panel-Administrativo/talleres');
      }
    } catch (error) {
      console.error('Error cargando taller:', error);
      router.push('/Panel-Administrativo/talleres');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!taller) return;

    setIsDeleting(true);
    try {
      const result = await deleteTallerAction(taller.id);

      if (result.success) {
        toast({
          title: '✅ Taller eliminado',
          description: 'El taller ha sido eliminado exitosamente',
        });
        router.push('/Panel-Administrativo/talleres');
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
        description: 'Error al eliminar el taller',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando taller...</p>
        </div>
      </div>
    );
  }

  if (!taller) {
    return null;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/Panel-Administrativo/talleres')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{taller.nombre}</h1>
            <p className="text-muted-foreground">Detalles del taller</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
            <CardDescription>Datos básicos del taller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant="outline" className={`mt-1 ${estadoColors[taller.estado]}`}>
                {taller.estado}
              </Badge>
            </div>

            {taller.ruc && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">RUC</p>
                <p className="text-base font-medium">{taller.ruc}</p>
              </div>
            )}

            {taller.especialidad && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Especialidad</p>
                <Badge variant="outline" className="mt-1">
                  {especialidadLabels[taller.especialidad]}
                </Badge>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
              <p className="text-base flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(taller.created_at), 'PPP', { locale: es })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
            <CardDescription>Datos para comunicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {taller.contacto && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Persona de Contacto</p>
                <p className="text-base font-medium">{taller.contacto}</p>
              </div>
            )}

            {taller.telefono && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                <p className="text-base flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {taller.telefono}
                </p>
              </div>
            )}

            {taller.email && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {taller.email}
                </p>
              </div>
            )}

            {taller.direccion && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                <p className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {taller.direccion}
                </p>
              </div>
            )}

            {!taller.contacto && !taller.telefono && !taller.email && !taller.direccion && (
              <p className="text-sm text-muted-foreground">
                No hay información de contacto disponible
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {showEditDialog && (
        <EditTallerDialog
          taller={taller}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSuccess={loadTaller}
        />
      )}

      {showDeleteDialog && (
        <DeleteTallerDialog
          taller={taller}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}