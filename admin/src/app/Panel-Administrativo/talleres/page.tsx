'use client';

import { useState, useEffect } from 'react';
import TallerTable from '@/components/talleres/TallerTable';
import TallerFilters from '@/components/talleres/TallerFilters';
import DeleteTallerDialog from '@/components/talleres/DeleteTallerDialog';
import CreateTallerDialog from '@/components/talleres/CreateTallerDialog';
import EditTallerDialog from '@/components/talleres/EditTallerDialog';
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

import { Taller } from '@/lib/types/taller.types';
import { 
  getTalleresAction, 
  deleteTallerAction, 
  createTallerAction, 
  updateTallerAction 
} from '@/lib/actions/talleres.actions';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function TalleresPage() {
  const { toast } = useToast();
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    busqueda: '',
    estado: '',
    especialidad: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [tallerToEdit, setTallerToEdit] = useState<Taller | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tallerToDelete, setTallerToDelete] = useState<Taller | null>(null);

  useEffect(() => {
    loadTalleres();
  }, [filters, pagination.page]);

  const loadTalleres = async () => {
    setLoading(true);
    try {
      const result = await getTalleresAction({
        page: pagination.page,
        limit: pagination.limit,
        busqueda: filters.busqueda || undefined,
        estado: filters.estado as any || undefined,
        especialidad: filters.especialidad as any || undefined,
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setTalleres(result.data.talleres);
      setPagination((prev) => ({
        ...prev,
        total: result.data.total,
        totalPages: result.data.totalPages,
      }));
    } catch (error) {
      console.error('Error cargando talleres:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los talleres',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    const taller = talleres.find((t: Taller) => t.id.toString() === id);
    if (taller) {
      setTallerToEdit(taller);
      setIsEditDialogOpen(true);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const result = await createTallerAction(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Éxito',
        description: 'Taller creado correctamente',
      });
      setShowCreateDialog(false);
      await loadTalleres();
    } catch (error: any) {
      console.error('Error creando taller:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el taller',
      });
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      const result = await updateTallerAction(parseInt(id), data);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Éxito',
        description: 'Taller actualizado correctamente',
      });
      setTallerToEdit(null);
      setIsEditDialogOpen(false);
      await loadTalleres();
    } catch (error: any) {
      console.error('Error actualizando taller:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el taller',
      });
      throw error;
    }
  };

  const handleDelete = (taller: Taller) => {
    setTallerToDelete(taller);
  };

  const confirmDelete = async () => {
    if (!tallerToDelete) return;

    try {
      const result = await deleteTallerAction(tallerToDelete.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: 'Éxito',
        description: 'Taller eliminado correctamente',
      });
      await loadTalleres();
      setTallerToDelete(null);
    } catch (error: any) {
      console.error('Error eliminando taller:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el taller',
      });
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const exportToExcel = () => {
    try {
      const data = talleres.map(taller => ({
        'ID': taller.id,
        'Nombre': taller.nombre,
        'RUC': taller.ruc || 'N/A',
        'Contacto': taller.contacto || 'N/A',
        'Teléfono': taller.telefono || 'N/A',
        'Email': taller.email || 'N/A',
        'Especialidad': taller.especialidad || 'N/A',
        'Estado': taller.estado,
        'Fecha de Creación': new Date(taller.created_at).toLocaleDateString('es-PE'),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Talleres');

      const maxWidth = data.reduce((w, r) => Math.max(w, r['Nombre'].length), 10);
      worksheet['!cols'] = [
        { wch: 10 }, { wch: maxWidth }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 20 },
      ];

      XLSX.writeFile(workbook, `talleres_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Éxito', description: 'Talleres exportados a Excel correctamente' });
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo exportar a Excel' });
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Lista de Talleres', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);

      const tableData = talleres.map(taller => [
        taller.nombre,
        taller.ruc || 'N/A',
        taller.contacto || 'N/A',
        taller.telefono || 'N/A',
        taller.estado,
      ]);

      (doc as any).autoTable({
        head: [['Nombre', 'RUC', 'Contacto', 'Teléfono', 'Estado']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`talleres_${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: 'Éxito', description: 'Talleres exportados a PDF correctamente' });
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
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Talleres</h1>
          <p className="text-gray-600 mt-1">Administra los talleres de producción</p>
        </div>
        
        {/* Grupo de botones alineados y con tamaño uniforme */}
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
            // ELIMINADO: size="sm" para igualar altura
            onClick={() => document.getElementById('import-file')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"> {/* ELIMINADO: size="sm" */}
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                Exportar a Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2 text-red-600" />
                Exportar a PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={() => setShowCreateDialog(true)}
            className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Taller
          </Button>
        </div>
      </div>

      <TallerFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <TallerTable
        talleres={talleres}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={(page: number) => setPagination((prev) => ({ ...prev, page }))}
      />

      <CreateTallerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
      />

      <EditTallerDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setTallerToEdit(null);
        }}
        taller={tallerToEdit}
        onSubmit={handleUpdate}
      />

      <DeleteTallerDialog
        taller={tallerToDelete}
        open={!!tallerToDelete}
        onOpenChange={(open) => !open && setTallerToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}