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
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Eye, 
  Loader2, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CalendarIcon 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/app/hooks/use-toast';
import { getPedidos } from '@/lib/actions/pedidos.actions';
import { 
  Pedido, 
  EstadoPedido, 
  FetchPedidosParams 
} from '@/lib/types/pedido.types'; 
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function HistorialPedidosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros específicos para historial
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoPedido | ''>('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    loadHistorial();
  }, [pagination.page, busqueda, estadoFiltro, fechaInicio, fechaFin]);

  const loadHistorial = async () => {
    setLoading(true);
    try {
      const params: FetchPedidosParams = {
        page: pagination.page,
        limit: pagination.limit,
        busqueda: busqueda || undefined,
        estado: estadoFiltro || undefined,
        // Aquí podrías pasar las fechas al backend si tu API lo soporta
        // fechaInicio: fechaInicio,
        // fechaFin: fechaFin,
      };

      const result = await getPedidos(params);

      if (result.success && result.data) {
        // En un escenario real, filtraríamos por estados "finales" (Entregado, Cancelado)
        // o el backend ya nos daría solo el historial.
        // Por ahora mostramos todo pero ordenado.
        setPedidos(result.data.pedidos);
        setPagination((prev) => ({
          ...prev,
          total: result.data.meta.total || 0,
          totalPages: result.data.meta.totalPages,
        }));
      } else {
        throw new Error(result.error || 'Error al cargar historial');
      }
    } catch (error: any) {
      console.error('Error cargando historial:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar el historial',
      });
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: EstadoPedido) => {
    const colors: Record<string, string> = {
      ENTREGADO: 'bg-green-100 text-green-800 border-green-200',
      CANCELADO: 'bg-red-100 text-red-800 border-red-200',
      TERMINADO: 'bg-blue-100 text-blue-800 border-blue-200',
      PENDIENTE: 'bg-gray-100 text-gray-800 border-gray-200', // En historial suele haber pocos pendientes
    };
    // Fallback por si llega otro estado
    const style = colors[estado] || 'bg-gray-100 text-gray-800';
    return <Badge variant="outline" className={style}>{estado}</Badge>;
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('');
    setFechaInicio('');
    setFechaFin('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const exportToExcel = () => {
    try {
      const data = pedidos.map(p => ({
        'ID Pedido': p.id,
        'Cliente': p.cliente?.razon_social || 'N/A',
        'RUC': p.cliente?.ruc || 'N/A',
        'Fecha': format(new Date(p.fecha_pedido), 'dd/MM/yyyy HH:mm'),
        'Estado': p.estado,
        'Total (S/)': p.total.toFixed(2),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');
      XLSX.writeFile(workbook, `Historial_Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Éxito', description: 'Historial exportado a Excel' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Error al exportar' });
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Historial de Pedidos', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);

      const tableData = pedidos.map(p => [
        p.id,
        p.cliente?.razon_social || 'N/A',
        format(new Date(p.fecha_pedido), 'dd/MM/yyyy'),
        p.estado,
        `S/ ${p.total.toFixed(2)}`
      ]);

      (doc as any).autoTable({
        head: [['ID', 'Cliente', 'Fecha', 'Estado', 'Total']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 85, 105] }, // Color gris azulado para historial
      });

      doc.save(`Historial_Pedidos_${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: 'Éxito', description: 'Historial exportado a PDF' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Error al exportar' });
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial de Pedidos</h1>
          <p className="text-gray-500 mt-1">
            Consulta y reportes de pedidos pasados y finalizados
          </p>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Reporte
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
        </div>
      </div>

      {/* Barra de Filtros Avanzada */}
      <div className="bg-white p-4 rounded-lg border shadow-sm mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Buscador */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente, RUC o N° Pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtro Estado */}
          <Select
            value={estadoFiltro || 'all'}
            onValueChange={(val) => setEstadoFiltro(val === 'all' ? '' : val as EstadoPedido)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado Final" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="ENTREGADO">Entregado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
              <SelectItem value="TERMINADO">Terminado</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón Limpiar */}
          <Button variant="ghost" onClick={limpiarFiltros} className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" />
            Limpiar Filtros
          </Button>
        </div>

        {/* Filtros de Fecha */}
        <div className="flex flex-col md:flex-row items-center gap-4 border-t pt-4">
            <span className="text-sm font-medium text-gray-500 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Rango de Fechas:
            </span>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Input 
                    type="date" 
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full md:w-[160px]"
                />
                <span className="text-gray-400">-</span>
                <Input 
                    type="date" 
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full md:w-[160px]"
                />
            </div>
        </div>
      </div>

      {/* Tabla de Historial */}
      {loading ? (
        <div className="flex justify-center items-center h-64 border rounded-md bg-white">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px]">Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>RUC</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado Final</TableHead>
                  <TableHead className="text-right">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            No se encontraron registros en el historial.
                        </TableCell>
                    </TableRow>
                ) : (
                    pedidos.map((pedido) => (
                    <TableRow key={pedido.id} className="hover:bg-gray-50">
                        <TableCell className="font-bold text-gray-700">#{pedido.id}</TableCell>
                        <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {format(new Date(pedido.fecha_pedido), 'dd MMM yyyy', { locale: es })}
                            </span>
                            <span className="text-xs text-gray-500">
                                {format(new Date(pedido.fecha_pedido), 'HH:mm')}
                            </span>
                        </div>
                        </TableCell>
                        <TableCell className="font-medium">
                            {pedido.cliente?.razon_social || 'Cliente Eventual'}
                        </TableCell>
                        <TableCell className="text-gray-500">
                            {pedido.cliente?.ruc || '-'}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                            S/ {pedido.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/Panel-Administrativo/pedidos/${pedido.id}`)}
                            className="hover:bg-gray-100"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages || 1}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}