'use client';

import { Edit, Trash2, FolderOpen, Power } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export interface CategoriaTable {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string | null;
  _count?: {
    productos: number;
  };
}

export interface CategoriasTableProps {
  categorias: CategoriaTable[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (categoria: CategoriaTable) => void;
  onToggleActivo: (categoria: CategoriaTable) => void;
}

export default function CategoriasTable({
  categorias,
  loading,
  onEdit,
  onDelete,
  onToggleActivo,
}: CategoriasTableProps) {
  const getEstadoColor = (activo: boolean) => {
    return activo
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando una nueva categoría
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell className="font-medium">
                  {categoria.nombre}
                </TableCell>
                <TableCell>
                  {categoria.descripcion || (
                    <span className="text-gray-400 italic">Sin descripción</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categoria._count?.productos || 0} productos
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getEstadoColor(categoria.activo)}>
                    {categoria.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(categoria.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleActivo(categoria)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(categoria)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={categoria._count?.productos ? categoria._count.productos > 0 : false}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}