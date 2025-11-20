'use client';

import { useState } from 'react';
import { Pencil, Trash2, Phone, Mail, Briefcase } from 'lucide-react';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useToast } from '@/hooks/use-toast';
import { deleteTallerAction } from '@/actions/talleres';
import type { Taller, EstadoTaller, EspecialidadTaller } from '@/api';
import { EditTallerDialog } from './EditTallerDialog';
import { DeleteTallerDialog } from './DeleteTallerDialog';

interface TalleresTableProps {
  talleres: Taller[];
  onUpdate: () => void;
}

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

export function TalleresTable({ talleres, onUpdate }: TalleresTableProps) {
  const { toast } = useToast();
  const [editingTaller, setEditingTaller] = useState<Taller | null>(null);
  const [deletingTaller, setDeletingTaller] = useState<Taller | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const result = await deleteTallerAction(id);
      
      if (result.success) {
        toast({
          title: '✅ Taller eliminado',
          description: 'El taller ha sido eliminado exitosamente',
        });
        setDeletingTaller(null);
        onUpdate();
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

  if (talleres.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            No se encontraron talleres
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Crea tu primer taller para comenzar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Talleres</CardTitle>
          <CardDescription>
            Gestiona los talleres de confección
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Nombre</th>
                  <th className="text-left p-4 font-medium">RUC</th>
                  <th className="text-left p-4 font-medium">Contacto</th>
                  <th className="text-left p-4 font-medium">Especialidad</th>
                  <th className="text-left p-4 font-medium">Estado</th>
                  <th className="text-right p-4 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {talleres.map((taller) => (
                  <tr key={taller.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{taller.nombre}</p>
                        {taller.email && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {taller.email}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{taller.ruc || '—'}</span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {taller.contacto && (
                          <p className="font-medium">{taller.contacto}</p>
                        )}
                        {taller.telefono && (
                          <p className="text-muted-foreground flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {taller.telefono}
                          </p>
                        )}
                        {!taller.contacto && !taller.telefono && '—'}
                      </div>
                    </td>
                    <td className="p-4">
                      {taller.especialidad ? (
                        <Badge variant="outline" className="font-normal">
                          {especialidadLabels[taller.especialidad]}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={estadoColors[taller.estado]}
                      >
                        {taller.estado}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTaller(taller)}
                          title="Editar taller"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingTaller(taller)}
                          title="Eliminar taller"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {editingTaller && (
        <EditTallerDialog
          taller={editingTaller}
          open={!!editingTaller}
          onOpenChange={(open) => !open && setEditingTaller(null)}
          onSuccess={onUpdate}
        />
      )}

      {deletingTaller && (
        <DeleteTallerDialog
          taller={deletingTaller}
          open={!!deletingTaller}
          onOpenChange={(open) => !open && setDeletingTaller(null)}
          onConfirm={() => handleDelete(deletingTaller.id)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}