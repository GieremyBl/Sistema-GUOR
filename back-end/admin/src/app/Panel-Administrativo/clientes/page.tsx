'use client';

import { useState, useEffect } from 'react';
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
import { ClienteTable } from '@/components/clientes/ClienteTable';
import ClienteFilters from '@/components/clientes/ClienteFilters'; 
import DeleteClienteDialog from '@/components/clientes/DeleteClienteDialog';
import CreateClienteDialog from '@/components/clientes/CreateClienteDialog';
import EditClienteDialog from '@/components/clientes/EditClienteDialog';
import type { 
    Cliente, 
    FetchClientesParams, 
    ClientesResponse,
    ClienteUpdateInput
} from '@/lib/types/cliente.types';
import { 
    getClientes,
    deleteCliente, 
    createClienteWithInvitation,
    updateCliente 
} from '@/lib/actions/clientes.actions'; 

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function ClientesPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]); 
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState<Omit<FetchClientesParams, 'page' | 'limit'>>({
    busqueda: '',
    activo: undefined,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  useEffect(() => {
    loadClientes();
  }, [filters, pagination.page]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data: ClientesResponse = await getClientes({
        page: pagination.page,
        limit: pagination.limit,
        busqueda: filters.busqueda || undefined,
        activo: filters.activo, 
      });

      if (data.error) throw new Error(data.error);

      setClientes(data.clientes);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error cargando clientes:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: 'No se pudieron cargar los clientes.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente);
    setIsEditDialogOpen(true);
  };

  const handleCreate = async (data: any) => {
    try {
      const result = await createClienteWithInvitation(data);
      if (!result.success) throw new Error(result.error);
      
      toast({ title: 'Éxito', description: 'Cliente creado e invitado correctamente' });
      setShowCreateDialog(false);
      await loadClientes();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo crear el cliente' });
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: ClienteUpdateInput) => {
    try {
      const result = await updateCliente(id, data);
      if (!result.success) throw new Error(result.error);
      
      toast({ title: 'Éxito', description: 'Cliente actualizado correctamente' });
      setClienteToEdit(null);
      setIsEditDialogOpen(false);
      await loadClientes();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo actualizar el cliente' });
      throw error;
    }
  };

  const handleToggleActivo = async (cliente: Cliente) => {
    const newActivoState = !cliente.activo; 
    try {
      const result = await updateCliente(cliente.id, { activo: newActivoState });

      if (!result.success) throw new Error(result.error);
      
      toast({ 
        title: 'Éxito', 
        description: `Cliente ${newActivoState ? 'activado' : 'desactivado'} correctamente.` 
      });
      await loadClientes(); 
    } catch (error: any) {
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || `No se pudo ${newActivoState ? 'activar' : 'desactivar'} el cliente` 
      });
    }
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;
    try {
      const result = await deleteCliente(clienteToDelete.id);
      if (!result.success) throw new Error(result.error);
      
      toast({ title: 'Éxito', description: 'Cliente eliminado correctamente' });
      await loadClientes();
      setClienteToDelete(null);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'No se pudo eliminar el cliente' });
    }
  };
  
  const exportToExcel = () => {
    try {
      if (clientes.length === 0) {
        toast({ variant: "destructive", title: "Aviso", description: "No hay datos para exportar." });
        return;
      }

      const datosExportar = clientes.map(c => ({
        ID: c.id,
        'Razón Social': c.razon_social || 'Sin Razón Social', 
        RUC: c.ruc || 'S/N',                              
        Email: c.email,
        Teléfono: c.telefono || 'S/N',                           
        Dirección: c.direccion || 'S/N',                 
        Estado: c.activo ? 'Activo' : 'Inactivo',
        'Fecha Registro': new Date(c.created_at).toLocaleDateString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(datosExportar);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

      const fecha = new Date().toISOString().split('T')[0];
      const fileName = `Reporte_Clientes_${fecha}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      
      toast({ title: 'Exportación Exitosa', description: 'El archivo Excel se ha descargado.' });
    } catch (error) {
      console.error("Error exportando Excel:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación a Excel.' });
    }
  };

  const exportToPDF = () => {
    try {
      if (clientes.length === 0) {
        toast({ variant: "destructive", title: "Aviso", description: "No hay datos para exportar." });
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Reporte de Clientes", 14, 20);
      doc.setFontSize(10);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 28);

      const tableColumn = ["ID", "Razón Social", "RUC", "Email", "Teléfono", "Estado"];
      
      const tableRows = clientes.map(c => [
        c.id,
        c.razon_social || '-',
        c.ruc || '-',
        c.email,
        c.telefono || '-',
        c.activo ? 'Activo' : 'Inactivo',
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] } 
      });

      const fecha = new Date().toISOString().split('T')[0];
      doc.save(`Reporte_Clientes_${fecha}.pdf`);

      toast({ title: 'Exportación Exitosa', description: 'El archivo PDF se ha descargado.' });
    } catch (error) {
      console.error("Error exportando PDF:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación a PDF.' });
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
      {/* Header estandarizado con Productos y Pedidos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1">Administra la información y estado de tus clientes</p>
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
            // Se eliminó size="sm" para igualar altura
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

          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      <ClienteFilters filters={filters as any} onFiltersChange={handleFiltersChange} />

      <ClienteTable 
        clientes={clientes} 
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={(cliente: Cliente) => setClienteToDelete(cliente)}
        onToggleActivo={handleToggleActivo} 
        pagination={pagination}
        onPageChange={(page: number) => setPagination((prev) => ({ ...prev, page }))}
      />

      <CreateClienteDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
      />

      <EditClienteDialog
        open={isEditDialogOpen}
        onOpenChange={(open: boolean) => {
          setIsEditDialogOpen(open);
          if (!open) setClienteToEdit(null);
        }}
        cliente={clienteToEdit}
        onSubmit={handleUpdate}
      />

      <DeleteClienteDialog
        cliente={clienteToDelete}
        open={!!clienteToDelete}
        onClose={() => setClienteToDelete(null)}
        onOpenChange={() => setClienteToDelete(null)} 
        onConfirm={confirmDelete}
      />
    </div>
  );
}