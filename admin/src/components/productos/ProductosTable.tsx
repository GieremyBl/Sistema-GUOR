'use client';

import { Edit, Trash2, Package, PackageOpen } from 'lucide-react';
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
import type { ProductoConCategoria, FiltrosProductos } from '@/lib/types/producto.types';
import { Dispatch, SetStateAction } from 'react';

interface ProductosTableProps {
  productos: ProductoConCategoria[];
  loading: boolean;
  filters: FiltrosProductos; 
  onFiltersChange: Dispatch<SetStateAction<FiltrosProductos>>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  onDelete: (producto: ProductoConCategoria) => void;
  onStock: (id: number) => void;
}

export default function ProductosTable({
  productos,
  loading,
  onEdit,
  onDelete,
  onStock,
  pagination,
  onPageChange,
}: ProductosTableProps) {
  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      activo: 'bg-green-100 text-green-800',
      inactivo: 'bg-gray-100 text-gray-800',
      agotado: 'bg-red-100 text-red-800',
      descontinuado: 'bg-yellow-100 text-yellow-800',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getStockBadge = (stock: number, stockMinimo: number) => {
    if (stock === 0) {
      return <Badge className="bg-red-100 text-red-800">Sin stock</Badge>;
    }
    if (stock <= stockMinimo) {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-500">
          Stock bajo
        </Badge>
      );
    }
    return <Badge className="bg-gray-100 text-gray-800">{stock} unidades</Badge>;
  };

  // Función helper para obtener el nombre de la categoría
  const getCategoriaNombre = (producto: ProductoConCategoria): string => {
    if (Array.isArray(producto.categoria) && producto.categoria.length > 0) {
      return producto.categoria[0].nombre;
    }
    return 'Sin categoría';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <PackageOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se encontraron productos con los filtros aplicados
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
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{producto.nombre}</div>
                      {producto.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {producto.descripcion}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getCategoriaNombre(producto)}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  S/ {Number(producto.precio).toFixed(2)}
                </TableCell>
                <TableCell>
                  {getStockBadge(producto.stock, producto.stock_minimo)}
                </TableCell>
                <TableCell>
                  <Badge className={getEstadoColor(producto.estado)}>
                    {producto.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(producto.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStock(producto.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(producto)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}