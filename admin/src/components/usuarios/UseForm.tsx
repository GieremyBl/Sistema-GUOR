'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface Usuario {
  id?: string;
  email: string;
  nombre_completo: string;
  telefono?: string;
  rol: string;
  estado?: string;
}

interface UseFormProps {
  initialData?: Usuario | null;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export default function UseForm({ initialData, onSubmit, isEditing = false }: UseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    password: '',
    nombre_completo: initialData?.nombre_completo || '',
    telefono: initialData?.telefono || '',
    rol: initialData?.rol || 'usuario',
    estado: initialData?.estado || 'activo',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validaciones
      if (!formData.email || !formData.nombre_completo || !formData.rol) {
        setError('Por favor completa todos los campos requeridos');
        setLoading(false);
        return;
      }

      if (!isEditing && !formData.password) {
        setError('La contraseña es requerida');
        setLoading(false);
        return;
      }

      if (formData.password && formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      // Preparar datos
      const dataToSend: any = {
        email: formData.email,
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono || null,
        rol: formData.rol,
        estado: formData.estado,
      };

      // Solo incluir password si se está creando o si se cambió
      if (!isEditing || formData.password) {
        dataToSend.password = formData.password;
      }

      await onSubmit(dataToSend);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Botón volver */}
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver
      </Button>

      {/* Card del formulario */}
      <div className="bg-white p-6 rounded-lg border space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="usuario@ejemplo.com"
            required
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="password">
            {isEditing ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
            {!isEditing && <span className="text-red-500"> *</span>}
          </Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="••••••••"
            required={!isEditing}
            minLength={6}
          />
          <p className="text-sm text-gray-500">Mínimo 6 caracteres</p>
        </div>

        {/* Nombre completo */}
        <div className="space-y-2">
          <Label htmlFor="nombre_completo">
            Nombre Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre_completo"
            type="text"
            value={formData.nombre_completo}
            onChange={(e) => handleChange('nombre_completo', e.target.value)}
            placeholder="Juan Pérez"
            required
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            type="tel"
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
            placeholder="+51 999 999 999"
          />
        </div>

        {/* Rol */}
        <div className="space-y-2">
          <Label htmlFor="rol">
            Rol <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.rol} onValueChange={(value) => handleChange('rol', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrador">Administrador</SelectItem>
              <SelectItem value="recepcionista">Recepcionista</SelectItem>
              <SelectItem value="diseñador">Diseñador</SelectItem>
              <SelectItem value="cortador">Cortador</SelectItem>
              <SelectItem value="ayudante">Ayudante</SelectItem>
              <SelectItem value="representante_taller">Representante de Taller</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado (solo en edición) */}
        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => handleChange('estado', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : isEditing ? (
            'Actualizar Usuario'
          ) : (
            'Crear Usuario'
          )}
        </Button>
      </div>
    </form>
  );
}