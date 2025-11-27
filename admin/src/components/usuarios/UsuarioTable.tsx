'use client';

import { Edit, Trash2, Mail, Phone, User } from 'lucide-react';
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

interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: string;
  estado: string;
  created_at: string;
}

interface UserTableProps {
  usuarios: Usuario[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (usuario: Usuario) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function UserTable({
  usuarios,
  loading,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
}: UserTableProps) {
  const getRolColor = (rol: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      supervisor: 'bg-blue-100 text-blue-800',
      operador: 'bg-green-100 text-green-800',
      usuario: 'bg-gray-100 text-gray-800',
    };
    return colors[rol] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoColor = (estado: string) => {
    return estado === 'activo'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza creando un nuevo usuario
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
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell className="font-medium">
                  {usuario.nombre_completo}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {usuario.email}
                  </div>
                </TableCell>
                <TableCell>
                  {usuario.telefono ? (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {usuario.telefono}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getRolColor(usuario.rol)}>
                    {usuario.rol}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getEstadoColor(usuario.estado)}>
                    {usuario.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(usuario.id)}
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      title="Editar usuario"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {/* ✅ Botón de Eliminar con cursor-pointer */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(usuario)}
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Eliminar usuario"
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

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Mostrando{' '}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{' '}
          a{' '}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{' '}
          de <span className="font-medium">{pagination.total}</span> resultados
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="cursor-pointer disabled:cursor-not-allowed"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}