'use client';

import { useState, useEffect } from 'react';
import ProductosTable from '@/components/productos/ProductosTable';
import CreateProductoDialog from '@/components/productos/CreateProductoDialog';
import DeleteProductoDialog from '@/components/productos/DeleteProductoDialog';
import EditProductoDialog from '@/components/productos/EditProductoDialog';
import StockDialog from '@/components/productos/StockDialog';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, FileSpreadsheet, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/app/hooks/use-toast';
import { 
  getProductos, 
  createProducto, 
  deleteProducto,
  updateStockProducto
} from '@/lib/actions/productos.actions';
import { getCategorias } from '@/lib/actions/categorias.actions';
import { Categoria } from '@/lib/types/categoria.types';
import type { ProductoConCategoria, FiltrosProductos } from '@/lib/types/producto.types';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function ProductosPage() {
  const { toast } = useToast();
  const [productos, setProductos] = useState<ProductoConCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FiltrosProductos>({
    busqueda: '',
    estado: '',
    categoriaId: '',
    stockBajo: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState<ProductoConCategoria | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState<ProductoConCategoria | null>(null);
  const [productoStock, setProductoStock] = useState<ProductoConCategoria | null>(null); 
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, [filters, pagination.page]);

  const loadProductos = async () => {
    setLoading(true);
    try {
      const result = await getProductos({
        page: pagination.page,
        limit: pagination.limit,
        busqueda: filters.busqueda || undefined,
        estado: filters.estado || undefined,
        categoriaId: filters.categoriaId || undefined,
        stockBajo: filters.stockBajo || undefined,
      });

      if (result.success && result.data && result.pagination) {
        setProductos(result.data);
        setPagination({
          page: result.pagination.page,
          limit: result.pagination.limit,
          total: result.pagination.total,
          totalPages: result.pagination.pages,
        });
      } else {
        throw new Error(result.error || 'Error al cargar productos');
      }
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los productos',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const result = await getCategorias(); 
      if (result.success && result.data) {
        setCategorias(result.data);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleEdit = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setProductoToEdit(producto);
      setIsEditDialogOpen(true);
    }
  };

  const handleStock = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setProductoStock(producto);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const result = await createProducto(data);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Producto creado correctamente' });
        setShowCreateDialog(false);
        await loadProductos();
      } else {
        throw new Error(result.error);
      }
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

  const handleDelete = (producto: ProductoConCategoria) => {
    setProductoToDelete(producto);
  };

  const confirmDelete = async () => {
    if (!productoToDelete) return;
    try {
      const result = await deleteProducto(productoToDelete.id);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Producto eliminado correctamente' });
        await loadProductos();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error eliminando producto:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar el producto',
      });
    } finally {
      setProductoToDelete(null);
    }
  };

  const handleStockUpdate = async (id: number, cantidad: number, operacion: 'agregar' | 'reducir' | 'establecer') => {
    try {
      const result = await updateStockProducto(id, cantidad, operacion);
      if (result.success) {
        toast({ title: 'Éxito', description: 'Stock actualizado correctamente' });
        setProductoStock(null);
        await loadProductos();
      } else {
        throw new Error(result.error);
      }
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

  // --- Funciones de Exportación ---
  const exportToExcel = () => {
    try {
      const data = productos.map(producto => ({
        'ID': producto.id,
        'Nombre': producto.nombre,
        'Descripción': producto.descripcion || 'N/A',
        'Categoría': Array.isArray(producto.categoria) ? producto.categoria[0]?.nombre : 'N/A',
        'Precio': `S/ ${producto.precio.toFixed(2)}`,
        'Stock': producto.stock,
        'Stock Mínimo': producto.stock_minimo,
        'Estado': producto.estado,
        'Fecha de Creación': new Date(producto.created_at).toLocaleDateString('es-PE'),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

      const maxWidth = data.reduce((w, r) => Math.max(w, r['Nombre'].length), 10);
      worksheet['!cols'] = [{ wch: 8 }, { wch: maxWidth }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }];

      XLSX.writeFile(workbook, `productos_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Éxito', description: 'Productos exportados a Excel correctamente' });
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo exportar a Excel' });
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Lista de Productos', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);

      const tableData = productos.map(producto => [
        producto.nombre,
        Array.isArray(producto.categoria) ? producto.categoria[0]?.nombre : 'N/A',
        `S/ ${producto.precio.toFixed(2)}`,
        producto.stock.toString(),
        producto.estado,
      ]);

      (doc as any).autoTable({
        head: [['Nombre', 'Categoría', 'Precio', 'Stock', 'Estado']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`productos_${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: 'Éxito', description: 'Productos exportados a PDF correctamente' });
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo exportar a PDF' });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Datos importados:', jsonData);
        toast({ title: 'Éxito', description: `Se importaron ${jsonData.length} registros` });
      } catch (error) {
        console.error('Error importando archivo:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo importar el archivo' });
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-500 mt-1">Administra el inventario de productos</p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="import-file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                Excel (.xlsx)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2 text-red-600" />
                PDF (.pdf)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <ProductosTable
        productos={productos}
        loading={loading}
        filters={filters}
        onFiltersChange={setFilters}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStock={handleStock}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      <CreateProductoDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
        categorias={categorias}
      />

      <EditProductoDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setProductoToEdit(null);
        }}
        producto={productoToEdit}
        categorias={categorias}
        onSuccess={loadProductos}
      />

      <DeleteProductoDialog
        producto={productoToDelete}
        open={!!productoToDelete}
        onClose={() => setProductoToDelete(null)}
        onConfirm={confirmDelete}
      />

      <StockDialog
        producto={productoStock}
        open={!!productoStock}
        onOpenChange={(open) => {
            if (!open) setProductoStock(null);
        }}
        onSubmit={handleStockUpdate}
      />
    </div>
  );
}