'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components//ui/table';
import { Button } from '@/components//ui/button';
import { Badge } from '@/components//ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components//ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Building2, User, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Cliente } from '@/lib/types/cliente.types';

interface ClientesTableProps {
    clientes: Cliente[];
    onEdit: (cliente: Cliente) => void; 
    onDelete: (cliente: Cliente) => void;
    onToggleActivo: (cliente: Cliente) => void;
    isLoading?: boolean;
    pagination: { 
        page: number; 
        limit: number; 
        total: number; 
        totalPages: number;
    };
    onPageChange: (page: number) => void;
}

export function ClienteTable({
  clientes,
  onEdit,
  onDelete,
  onToggleActivo,
  isLoading = false, 
  pagination, 
  onPageChange,
}: ClientesTableProps) {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Cargando clientes...</p>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay clientes</h3>
        <p className="text-muted-foreground">
          Comienza creando tu primer cliente
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {cliente.ruc ? (
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {cliente.razon_social || 'Sin nombre'}
                      </div>
                      {cliente.direccion && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {cliente.direccion}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {cliente.email}
                    </div>
                    {cliente.telefono && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {cliente.telefono}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {cliente.ruc ? (
                    <span className="font-mono text-sm">{cliente.ruc}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={cliente.activo ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => onToggleActivo(cliente)}
                  >
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(cliente)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleActivo(cliente)}>
                        {cliente.activo ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(cliente)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      {/* Sección de Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} registros)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}