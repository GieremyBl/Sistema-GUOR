'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, Trash2, Phone, Mail, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/app/hooks/use-toast';
import { getTallerAction, deleteTallerAction } from '@/lib/actions/talleres.actions';
import EditTallerDialog from '@/components/talleres/EditTallerDialog';
import DeleteTallerDialog from '@/components/talleres/DeleteTallerDialog';
import { 
  Taller, 
  ESTADO_TALLER_COLORS, 
  ESPECIALIDAD_TALLER_LABELS 
} from '@/lib/types/taller.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TallerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = parseInt(params.id as string);

  const [taller, setTaller] = useState<Taller | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadTaller();
  }, [id]);

  const loadTaller = async () => {
    setLoading(true);
    try {
      const result = await getTallerAction(id);
      if (result.success) {
        setTaller(result.data);
      } else {
        toast({
          title: '❌ Error',
          description: result.error,
          variant: 'destructive',
        });
        router.push('/Panel-Administrativo/talleres');
      }
    } catch (error) {
      console.error('Error cargando taller:', error);
      toast({
        title: '❌ Error',
        description: 'Error al cargar el taller',
        variant: 'destructive',
      });
      router.push('/Panel-Administrativo/talleres');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      // La actualización se maneja en el EditTallerDialog
      toast({
        title: '✅ Taller actualizado',
        description: 'El taller ha sido actualizado exitosamente',
      });
      setShowEditDialog(false);
      await loadTaller();
    } catch (error: any) {
      console.error('Error actualizando taller:', error);
      toast({
        title: '❌ Error',
        description: error.message || 'Error al actualizar el taller',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!taller) return;

    try {
      const result = await deleteTallerAction(taller.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: '✅ Taller eliminado',
        description: result.message || 'El taller ha sido eliminado exitosamente',
      });
      router.push('/Panel-Administrativo/talleres');
    } catch (error: any) {
      console.error('Error eliminando taller:', error);
      toast({
        title: '❌ Error',
        description: error.message || 'Error al eliminar el taller',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
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
              <Badge 
                variant="outline" 
                className={`mt-1 ${ESTADO_TALLER_COLORS[taller.estado]}`}
              >
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
                  {ESPECIALIDAD_TALLER_LABELS[taller.especialidad]}
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

      {/* Diálogo de edición */}
      <EditTallerDialog
        taller={taller}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSubmit={handleUpdate}
      />

      {/* Diálogo de eliminación */}
      <DeleteTallerDialog
        taller={taller}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
}