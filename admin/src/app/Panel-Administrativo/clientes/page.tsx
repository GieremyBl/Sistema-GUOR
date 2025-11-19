'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ClientesTable } from '@/components/clientes/ClientesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import {
  fetchClientes,
  deleteCliente,
  toggleClienteActivo,
} from '@/lib/actions/clientes';
import type { Cliente } from '@/lib/api';
import { toast } from '@/app/hooks/use-toast';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClientes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clientes.filter(c =>
        c.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ruc?.toString().includes(searchTerm)
      );
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes(clientes);
    }
  }, [searchTerm, clientes]);

  const loadClientes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClientes();
      setClientes(data);
      setFilteredClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los clientes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (cliente: Cliente) => {
    const mensaje = `¿Eliminar a ${cliente.razon_social || cliente.email}?\n\nNota: Si tiene pedidos asociados, solo se desactivará.`;
    
    if (!confirm(mensaje)) return;
    
    try {
      await deleteCliente(cliente.id);
      toast({
        title: 'Cliente eliminado',
        description: 'El cliente se eliminó correctamente',
      });
      loadClientes();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al eliminar cliente',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActivo = async (cliente: Cliente) => {
    try {
      await toggleClienteActivo(cliente.id);
      toast({
        title: cliente.activo ? 'Cliente desactivado' : 'Cliente activado',
        description: `El cliente ahora está ${cliente.activo ? 'inactivo' : 'activo'}`,
      });
      loadClientes();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del cliente',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (cliente: Cliente) => {
    // ← CORRECCIÓN: Convertir el id numérico a string para la URL
    router.push(`/Panel-Administrativo/clientes/${cliente.id.toString()}`);
  };

  const handleNuevoCliente = () => {
    router.push('/Panel-Administrativo/clientes/nuevo');
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tu base de clientes
          </p>
        </div>
        <Button onClick={handleNuevoCliente}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o RUC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Mostrando {filteredClientes.length} de {clientes.length} clientes
      </div>

      <ClientesTable
        clientes={filteredClientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActivo={handleToggleActivo}
        isLoading={isLoading}
      />
    </div>
  );
}