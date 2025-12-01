'use client';

import { useState } from 'react';
import { Pencil, Trash2, Phone, Mail, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Taller, 
  ESTADO_TALLER_COLORS, 
  ESPECIALIDAD_TALLER_LABELS 
} from '@/lib/types/taller.types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TallerTableProps {
  talleres: Taller[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (taller: Taller) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function TallerTable({
  talleres,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: TallerTableProps) {

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Listado de Talleres</CardTitle>
          <CardDescription>
            Gestiona los talleres de confección ({pagination.total} talleres)
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
                        {taller.direccion && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {taller.direccion}
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
                          {ESPECIALIDAD_TALLER_LABELS[taller.especialidad]}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className={ESTADO_TALLER_COLORS[taller.estado]}
                      >
                        {taller.estado}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(taller.id.toString())}
                          title="Editar taller"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(taller)}
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

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  className={
                    pagination.page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => onPageChange(page)}
                      isActive={page === pagination.page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(
                      Math.min(pagination.totalPages, pagination.page + 1)
                    )
                  }
                  className={
                    pagination.page === pagination.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}