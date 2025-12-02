'use client';

import { useState, useEffect } from 'react';
import UserTable from '@/components/usuarios/UsuarioTable';
import UserFilters from '@/components/usuarios/UsuarioFilters';
import DeleteUsuarioDialog from '@/components/usuarios/DeleteUsuarioDialog';
import CreateUsuarioDialog from '@/components/usuarios/CreateUsuarioDialog';
import EditUsuarioDialog from '@/components/usuarios/EditUsuarioDialog';
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
import type { Usuario, UsuariosResponse } from '@/lib/types/usuario.types';
import { getUsuario, deleteUsuario, createUsuario, updateUsuario } from '@/lib/actions/usuarios.actions'; 

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function UsuariosPage() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    busqueda: '',
    rol: '',
    estado: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  
  // Estados de diálogos
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, [filters, pagination.page]);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const data: UsuariosResponse = await getUsuario({
        page: pagination.page,
        limit: pagination.limit,
        busqueda: filters.busqueda || undefined,
        rol: filters.rol || undefined,
        estado: filters.estado || undefined,
      });

      setUsuarios(data.usuarios);
      setPagination((prev) => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => { 
    const usuario = usuarios.find((u) => u.id === id);
    if (usuario) {
      setUsuarioToEdit(usuario);
      setIsEditDialogOpen(true);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await createUsuario(data);
      toast({
        title: 'Éxito',
        description: 'Usuario creado correctamente',
      });
      setShowCreateDialog(false);
      await loadUsuarios();
    } catch (error: any) {
      console.error('Error creando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el usuario',
      });
      throw error;
    }
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await updateUsuario(id, data);
      toast({
        title: 'Éxito',
        description: 'Usuario actualizado correctamente',
      });
      setUsuarioToEdit(null);
      setIsEditDialogOpen(false);
      await loadUsuarios();
    } catch (error: any) {
      console.error('Error actualizando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el usuario',
      });
      throw error;
    }
  };

  const handleDelete = (usuario: Usuario) => {
    setUserToDelete(usuario);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUsuario(userToDelete.id); 
      toast({
        title: 'Éxito',
        description: 'Usuario eliminado correctamente',
      });
      await loadUsuarios();
      setUserToDelete(null);
    } catch (error: any) {
      console.error('Error eliminando usuario:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el usuario',
      });
    }
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Función para exportar a Excel
  const exportToExcel = () => {
    try {
      const data = usuarios.map(usuario => ({
        'ID': usuario.id,
        'Nombre Completo': usuario.nombre_completo,
        'Email': usuario.email,
        'Teléfono': usuario.telefono || 'N/A',
        'Rol': usuario.rol,
        'Estado': usuario.estado,
        'Fecha de Creación': new Date(usuario.created_at).toLocaleDateString('es-PE'),
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
      const maxWidth = data.reduce((w, r) => Math.max(w, String(r['Nombre Completo']).length), 10);
      worksheet['!cols'] = [
        { wch: 10 }, { wch: maxWidth }, { wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 20 },
      ];
      XLSX.writeFile(workbook, `usuarios_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast({ title: 'Éxito', description: 'Usuarios exportados a Excel correctamente' });
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo exportar a Excel' });
    }
  };

  // Función para exportar a PDF
  const exportToPDF = async () => {
    try {
      // Importación dinámica para evitar problemas en SSR
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Lista de Usuarios', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);
      const tableData = usuarios.map(usuario => [
        usuario.nombre_completo,
        usuario.email,
        usuario.telefono || 'N/A',
        usuario.rol,
        usuario.estado,
      ]);
      doc.autoTable({
        head: [['Nombre', 'Email', 'Teléfono', 'Rol', 'Estado']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] },
      });
      doc.save(`usuarios_${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: 'Éxito', description: 'Usuarios exportados a PDF correctamente' });
    } catch (error) {
      console.error('Error exportando a PDF:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo exportar a PDF' });
    }
  };

  // Función para importar desde Excel
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
      {/* Header estandarizado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los usuarios y sus permisos en el sistema</p>
        </div>
        
        {/* Grupo de botones alineados */}
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
            // Se eliminó size="sm" para igualar altura con "Nuevo Usuario"
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
            Nuevo Usuario
          </Button>
        </div>
      </div>

      <UserFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <UserTable
        usuarios={usuarios}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Diálogo de creación */}
      <CreateUsuarioDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreate}
      />

      <EditUsuarioDialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setUsuarioToEdit(null);
        }}
        usuario={usuarioToEdit}
        onSubmit={handleUpdate}
      />

      {/* Diálogo de eliminación */}
      <DeleteUsuarioDialog
        user={userToDelete}
        open={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}