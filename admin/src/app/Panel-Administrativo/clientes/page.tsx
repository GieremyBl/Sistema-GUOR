'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import { ClientesTable } from '@/components/clientes/ClientesTable';
import CreateClienteDialog from '@/components/clientes/CreateClienteDialog';
import EditClienteDialog from '@/components/clientes/EditClienteDialog';
import DeleteConfirmDialog from '@/components/clientes/DeleteConfirmDialog';
import ClienteFilters from '@/components/clientes/ClienteFilters';
import { useToast } from '@/app/hooks/use-toast';
import type { Cliente, ClienteCreateInput, ClienteUpdateInput } from '@/lib/api';
import * as api from '@/lib/api';

interface Filters {
  busqueda: string;
  estado: string;
}

export default function ClientesPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    busqueda: '',
    estado: '',
  });

  // Estados para diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Cargar clientes
  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setIsLoading(true);
    try {
      const data = await api.getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los clientes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    const matchBusqueda = !filters.busqueda || 
      cliente.razon_social?.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      cliente.email.toLowerCase().includes(filters.busqueda.toLowerCase()) ||
      cliente.ruc?.toString().includes(filters.busqueda);

    const matchEstado = !filters.estado || 
      (filters.estado === 'ACTIVO' ? cliente.activo : !cliente.activo);

    return matchBusqueda && matchEstado;
  });

  // Crear cliente
  const handleCreate = async (data: ClienteCreateInput) => {
    try {
      const newCliente = await api.createCliente(data);
      setClientes([...clientes, newCliente]);
      
      toast({
        title: 'Cliente creado',
        description: 'El cliente ha sido creado exitosamente',
      });
    } catch (error: any) {
      console.error('Error al crear cliente:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el cliente',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Editar cliente
  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (id: string, data: ClienteUpdateInput) => {
    try {
      await api.updateCliente(id, data);

      setClientes(clientes.map(c => 
        c.id.toString() === id 
          ? { ...c, ...data }
          : c
      ));

      toast({
        title: 'Cliente actualizado',
        description: 'Los cambios han sido guardados exitosamente',
      });
    } catch (error: any) {
      console.error('Error al actualizar cliente:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar el cliente',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Eliminar cliente
  const handleDelete = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCliente) return;

    try {
      await api.deleteCliente(selectedCliente.id.toString());

      setClientes(clientes.filter(c => c.id !== selectedCliente.id));
      
      toast({
        title: 'Cliente eliminado',
        description: 'El cliente ha sido eliminado exitosamente',
      });
      
      setDeleteDialogOpen(false);
      setSelectedCliente(null);
    } catch (error: any) {
      console.error('Error al eliminar cliente:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el cliente',
        variant: 'destructive',
      });
    }
  };

  // Toggle activo
  const handleToggleActivo = async (cliente: Cliente) => {
    try {
      await api.updateCliente(cliente.id.toString(), { activo: !cliente.activo });

      setClientes(clientes.map(c => 
        c.id === cliente.id 
          ? { ...c, activo: !c.activo }
          : c
      ));

      toast({
        title: cliente.activo ? 'Cliente desactivado' : 'Cliente activado',
        description: `El cliente ha sido ${cliente.activo ? 'desactivado' : 'activado'} exitosamente`,
      });
    } catch (error: any) {
      console.error('Error al cambiar estado:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del cliente',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu base de clientes y su información de contacto
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Clientes
              </p>
              <p className="text-3xl font-bold mt-2">{clientes.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Activos
              </p>
              <p className="text-3xl font-bold mt-2">
                {clientes.filter(c => c.activo).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Inactivos
              </p>
              <p className="text-3xl font-bold mt-2">
                {clientes.filter(c => !c.activo).length}
              </p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <ClienteFilters filters={filters} onFiltersChange={setFilters} />

      {/* Tabla */}
      <ClientesTable
        clientes={clientesFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActivo={handleToggleActivo}
        isLoading={isLoading}
      />

      {/* Diálogos */}
      <CreateClienteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreate}
      />

      <EditClienteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        cliente={selectedCliente}
        onSubmit={handleUpdate}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="¿Eliminar cliente?"
        description={`¿Estás seguro de que deseas eliminar a "${selectedCliente?.razon_social || selectedCliente?.email}"? Esta acción no se puede deshacer.`}
      />
      </div>
    </div>
  );
}