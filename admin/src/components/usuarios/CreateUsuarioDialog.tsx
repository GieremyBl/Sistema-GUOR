'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

interface CreateUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

const ROLES = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'recepcionista', label: 'Recepcionista' },
  { value: 'diseñador', label: 'Diseñador' },
  { value: 'cortador', label: 'Cortador' },
  { value: 'ayudante', label: 'Ayudante' },
  { value: 'representante_taller', label: 'Representante de Taller' },
];

export default function CreateUsuarioDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateUsuarioDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre_completo: '',
    telefono: '',
    rol: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nombre_completo: '',
      telefono: '',
      rol: '',
    });
    setError('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!formData.nombre_completo.trim()) {
      setError('El nombre completo es requerido');
      return;
    }

    if (!formData.password) {
      setError('La contraseña es requerida');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.rol) {
      setError('Debe seleccionar un rol');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        nombre_completo: formData.nombre_completo.trim(),
        telefono: formData.telefono.trim() || null,
        rol: formData.rol.toLowerCase(),
        estado: 'activo',
      });
      handleOpenChange(false);
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      setError(error.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo usuario al sistema
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@ejemplo.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Nombre Completo */}
          <div className="space-y-2">
            <Label htmlFor="nombre_completo">Nombre Completo *</Label>
            <Input
              id="nombre_completo"
              type="text"
              placeholder="Juan Pérez García"
              value={formData.nombre_completo}
              onChange={(e) => handleChange('nombre_completo', e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              disabled={loading}
              required
              minLength={6}
            />
            <p className="text-sm text-gray-500">Mínimo 6 caracteres</p>
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="+51 999 999 999"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="rol">Rol *</Label>
            <Select
              value={formData.rol}
              onValueChange={(value) => handleChange('rol', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}