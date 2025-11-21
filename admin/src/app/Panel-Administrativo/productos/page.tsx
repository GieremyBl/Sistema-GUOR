'use client';

import { useState, useEffect } from 'react';
import ProductosTable from '@/components//productos/ProductosTable';
import StockDialog from '@/components//productos/StockDialog';
import CreateProductoDialog from '@/components//productos/CreateProductoDialog';
import EditProductoDialog from '@/components//productos/EditProductoDialog';
import { Button } from '@/components//ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components//ui/select';
import { Plus, Search, Filter, AlertTriangle } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components//ui/alert-dialog';
import {
  fetchProductos,
  fetchCategorias,
  deleteProducto,
  createProducto,
  updateProducto,
  Producto,
  Categoria,
} from '@/lib/api';

type ProductoTransformado = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  stock: number;
  stock_minimo: number;
  estado: string;
  categoria?: {
    id: string;
    nombre: string;
  };
};

export default function ProductosPage() {
  const { toast } = useToast();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoToDelete, setProductoToDelete] = useState<Producto | null>(null);
  const [productoToStock, setProductoToStock] = useState<Producto | null>(null);

  // Estados de diálogos
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState<Producto | null>(null);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('');
  const [showStockBajo, setShowStockBajo] = useState(false);

  // Paginación
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadCategorias();
    loadProductos();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error: any) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadProductos = async () => {
    setLoading(true);
    try {
      const data = await fetchProductos();
      setProductos(data);
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar los productos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await createProducto(data);
      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });
      setShowCreateDialog(false);
      await loadProductos();
    } catch (error: any) {
      console.error('Error creando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el producto',
      });
      throw error;
    }
  };

  const handleEdit = (id: string) => {
    const producto = productos.find((p) => p.id.toString() === id);
    if (producto) {
      setProductoToEdit(producto);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateProducto(Number(id), data);
      toast({
        title: 'Éxito',
        description: 'Producto actualizado correctamente',
      });
      setProductoToEdit(null);
      await loadProductos();
    } catch (error: any) {
      console.error('Error actualizando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el producto',
      });
      throw error;
    }
  };

  const handleDelete = (producto: ProductoTransformado) => {
    const productoOriginal = productos.find((p) => p.id.toString() === producto.id);
    if (productoOriginal) {
      setProductoToDelete(productoOriginal);
    }
  };

  const confirmDelete = async () => {
    if (!productoToDelete) return;

    try {
      await deleteProducto(productoToDelete.id);
      toast({
        title: 'Éxito',
        description: 'Producto eliminado correctamente',
      });
      await loadProductos();
      setProductoToDelete(null);
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar el producto',
      });
    }
  };

  const handleManageStock = (producto: ProductoTransformado) => {
    const productoOriginal = productos.find((p) => p.id.toString() === producto.id);
    if (productoOriginal) {
      setProductoToStock(productoOriginal);
    }
  };

  const handleUpdateStock = async (
    id: string,
    cantidad: number,
    operacion: 'agregar' | 'reducir' | 'establecer'
  ) => {
    try {
      const producto = productos.find((p) => p.id.toString() === id);
      if (!producto) return;

      let nuevoStock = producto.stock;
      if (operacion === 'agregar') {
        nuevoStock += cantidad;
      } else if (operacion === 'reducir') {
        nuevoStock = Math.max(0, nuevoStock - cantidad);
      } else {
        nuevoStock = cantidad;
      }

      const response = await fetch(`/api/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock }),
      });

      if (!response.ok) throw new Error('Error al actualizar stock');

      toast({
        title: 'Éxito',
        description: 'Stock actualizado correctamente',
      });

      await loadProductos();
    } catch (error: any) {
      console.error('Error actualizando stock:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el stock',
      });
      throw error;
    }
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('all');
    setCategoriaFiltro('all');
    setShowStockBajo(false);
    setPage(1);
  };

  let productosFiltrados = productos.filter((producto) => {
    const matchBusqueda =
      !busqueda ||
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado = !estadoFiltro || estadoFiltro === 'all' || producto.estado === estadoFiltro;

    const matchCategoria =
      !categoriaFiltro || categoriaFiltro === 'all' || producto.categoria_id.toString() === categoriaFiltro;

    const matchStockBajo = !showStockBajo || producto.stock <= producto.stock_minimo;

    return matchBusqueda && matchEstado && matchCategoria && matchStockBajo;
  });

  const total = productosFiltrados.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  const productosTransformados: ProductoTransformado[] = productosPaginados.map((p) => ({
    id: p.id.toString(),
    nombre: p.nombre,
    descripcion: p.descripcion ?? undefined,
    precio: p.precio,
    imagen: p.imagen ?? undefined,
    stock: p.stock,
    stock_minimo: p.stock_minimo,
    estado: p.estado,
    categoria_id: p.categoria_id,
    created_at: p.created_at,
    updated_at: p.updated_at ?? undefined,
    categoria: p.categoria
      ? {
          id: p.categoria_id.toString(),
          nombre: p.categoria.nombre,
        }
      : undefined,
  }));

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-1">
            Administra el catálogo de productos ({total} total)
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={estadoFiltro}
          onValueChange={(value) => {
            setEstadoFiltro(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={categoriaFiltro}
          onValueChange={(value) => {
            setCategoriaFiltro(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant={showStockBajo ? 'default' : 'outline'}
          onClick={() => {
            setShowStockBajo(!showStockBajo);
            setPage(1);
          }}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Stock Bajo
        </Button>

        {(busqueda || estadoFiltro || categoriaFiltro || showStockBajo) && (
          <Button variant="ghost" onClick={limpiarFiltros}>
            <Filter className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      <ProductosTable
        productos={productosTransformados}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onManageStock={handleManageStock}
        pagination={{
          page,
          limit,
          total,
          totalPages,
        }}
        onPageChange={setPage}
      />

      {/* Diálogo de creación */}
      <CreateProductoDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
      />

      {/* Diálogo de edición */}
      {productoToEdit && (
        <EditProductoDialog
          open={!!productoToEdit}
          onOpenChange={(open) => !open && setProductoToEdit(null)}
          producto={productoToEdit}
          onSubmit={handleUpdate}
        />
      )}

      {/* Diálogo de Stock */}
      {productoToStock && (
        <StockDialog
          open={!!productoToStock}
          onOpenChange={(open) => !open && setProductoToStock(null)}
          producto={{
            id: productoToStock.id.toString(),
            nombre: productoToStock.nombre,
            stock: productoToStock.stock,
          }}
          onSubmit={handleUpdateStock}
        />
      )}

      {/* Diálogo de eliminación */}
      <AlertDialog open={!!productoToDelete} onOpenChange={() => setProductoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el producto{' '}
              <strong>{productoToDelete?.nombre}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}