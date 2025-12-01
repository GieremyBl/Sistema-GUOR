'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter, Eye, Loader2, Upload, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { getPedidos } from '@/lib/actions/pedidos.actions';
import { 
  Pedido, 
  EstadoPedido, 
  PrioridadPedido, 
  FetchPedidosParams 
} from '@/lib/types/pedido.types'; 
import { format } from 'date-fns';
import { CreatePedidoDialog } from '@/components/pedidos/CreatePedidoDialog';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

type FilterValue = EstadoPedido | PrioridadPedido | 'all' | '';

export default function PedidosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | ''>('');
  const [prioridadFiltro, setPrioridadFiltro] = useState<PrioridadPedido | ''>('');

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadPedidos();
  }, [pagination.page, busqueda, estadoFiltro, prioridadFiltro]);

  const loadPedidos = async () => {
    setLoading(true);
    try {
      const params: FetchPedidosParams = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (busqueda) params.busqueda = busqueda;
      if (estadoFiltro) params.estado = estadoFiltro;
      if (prioridadFiltro) params.prioridad = prioridadFiltro;

      const result = await getPedidos(params);

      if (result.success && result.data) {
        setPedidos(result.data.pedidos);
        setPagination((prev) => ({
          ...prev,
          total: result.data.meta.total || 0,
          totalPages: result.data.meta.totalPages,
        }));
      } else {
        throw new Error(result.error || 'Error al cargar pedidos');
      }
    } catch (error: any) {
      console.error('Error cargando pedidos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudieron cargar los pedidos',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: FilterValue) => {
    const filterValue = value === 'all' ? '' : value;
    setter(filterValue);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getEstadoBadge = (estado: EstadoPedido) => {
    const colors: Record<EstadoPedido, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      EN_PROCESO: 'bg-blue-100 text-blue-800',
      TERMINADO: 'bg-green-100 text-green-800',
      ENTREGADO: 'bg-gray-100 text-gray-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[estado]}>{estado}</Badge>;
  };

  const getPrioridadBadge = (prioridad: PrioridadPedido) => {
    const colors: Record<PrioridadPedido, string> = {
      BAJA: 'bg-gray-100 text-gray-800',
      NORMAL: 'bg-blue-100 text-blue-800',
      ALTA: 'bg-orange-100 text-orange-800',
      URGENTE: 'bg-red-100 text-red-800',
    };
    return <Badge className={colors[prioridad]}>{prioridad}</Badge>;
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('');
    setPrioridadFiltro('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleVerDetalle = (id: string) => {
    router.push(`/Panel-Administrativo/pedidos/${id}`);
  };

  // --- LOGICA EXPORTACIÓN ---
  const exportToExcel = () => {
    try {
      const data = pedidos.map(pedido => ({
        'ID': pedido.id,
        'Cliente': pedido.cliente?.razon_social || 'N/A',
        'RUC': pedido.cliente?.ruc || 'N/A',
        'Fecha Pedido': format(new Date(pedido.fecha_pedido), 'dd/MM/yyyy'),
        'Estado': pedido.estado,
        'Prioridad': pedido.prioridad,
        'Total': `S/ ${pedido.total.toFixed(2)}`,
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos');

      const maxWidth = data.reduce((w, r) => Math.max(w, String(r['Cliente']).length), 10);
      worksheet['!cols'] = [{ wch: 8 }, { wch: maxWidth }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

      XLSX.writeFile(workbook, `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Éxito', description: 'Pedidos exportados a Excel' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación a Excel' });
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Reporte de Pedidos', 14, 20);
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);

      const tableData = pedidos.map(p => [
        p.id,
        p.cliente?.razon_social || 'N/A',
        format(new Date(p.fecha_pedido), 'dd/MM/yyyy'),
        p.estado,
        p.prioridad,
        `S/ ${p.total.toFixed(2)}`
      ]);

      (doc as any).autoTable({
        head: [['ID', 'Cliente', 'Fecha', 'Estado', 'Prioridad', 'Total']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`pedidos_${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: 'Éxito', description: 'Pedidos exportados a PDF' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación a PDF' });
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    toast({ title: 'Importación', description: 'Funcionalidad de importar pedidos en desarrollo.' });
    event.target.value = '';
  };

  const estadoSelectValue = estadoFiltro || 'all';
  const prioridadSelectValue = prioridadFiltro || 'all';

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Alineado Igual que Productos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">
            Administra todos los pedidos del sistema ({pagination.total} total)
          </p>
        </div>
        
        {/* Grupo de Botones */}
        <div className="flex gap-2">
          <input
            type="file"
            id="import-pedidos"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('import-pedidos')?.click()}
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
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por cliente, RUC..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="pl-10"
          />
        </div>

        <Select
          value={estadoSelectValue}
          onValueChange={(value: FilterValue) => handleFilterChange(setEstadoFiltro, value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
            <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
            <SelectItem value="TERMINADO">Terminado</SelectItem>
            <SelectItem value="ENTREGADO">Entregado</SelectItem>
            <SelectItem value="CANCELADO">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={prioridadSelectValue}
          onValueChange={(value: FilterValue) => handleFilterChange(setPrioridadFiltro, value)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las prioridades</SelectItem>
            <SelectItem value="BAJA">Baja</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="ALTA">Alta</SelectItem>
            <SelectItem value="URGENTE">Urgente</SelectItem>
          </SelectContent>
        </Select>

        {(busqueda || estadoFiltro || prioridadFiltro) && (
          <Button variant="ghost" onClick={limpiarFiltros}>
            <Filter className="mr-2 h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha Pedido</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">#{pedido.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {pedido.cliente?.razon_social || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          RUC: {pedido.cliente?.ruc || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(pedido.fecha_pedido), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
                    <TableCell>{getPrioridadBadge(pedido.prioridad)}</TableCell>
                    <TableCell className="font-medium">
                      S/ {pedido.total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(pedido.id.toString())}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
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
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}

      <CreatePedidoDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={loadPedidos}
      />
    </div>
  );
}