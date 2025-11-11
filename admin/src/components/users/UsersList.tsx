"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddUser from "@/components/users/AddUser";
import EditUser from "@/components/users/EditUser";

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  estado: boolean;
}

export const UsersList = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'juan@example.com',
      nombre: 'Juan',
      apellido: 'Pérez',
      rol: 'Admin',
      estado: true
    },
    {
      id: '2',
      email: 'maria@example.com',
      nombre: 'María',
      apellido: 'García',
      rol: 'User',
      estado: false
    }
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        
        {/* Sheet para Agregar Usuario */}
        <Sheet>
          <SheetTrigger asChild>
            <Button>Agregar Usuario</Button>
          </SheetTrigger>
          <AddUser />
        </Sheet>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.nombre} ${user.apellido}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded ${user.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.estado ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell>
                {/* Sheet para Editar Usuario */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      Editar
                    </Button>
                  </SheetTrigger>
                  <EditUser user={user} />
                </Sheet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};