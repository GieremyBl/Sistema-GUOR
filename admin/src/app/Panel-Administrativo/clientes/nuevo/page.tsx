'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { toast } from '@/app/hooks/use-toast';
import { createClienteWithInvitation } from '@/lib/actions/clientes';

interface ClienteFormData {
  email: string;
  razon_social: string | null;
  ruc: number | null;
  telefono: number | null;
  direccion: string | null;
}

export default function NuevoClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClienteFormData>({
    email: '',
    razon_social: null,
    ruc: null,
    telefono: null,
    direccion: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createClienteWithInvitation(formData);
      toast({
        title: 'Cliente creado',
        description: `Se envió un email de invitación a ${formData.email}`,
      });
      router.push('/Panel-Administrativo/clientes');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/Panel-Administrativo/clientes');
  };

  return (
    // ✅ CAMBIO AQUÍ: Usamos Flexbox para centrar todo en la pantalla
    // min-h-[80vh]: Asegura que ocupe altura para poder centrar verticalmente
    // flex items-center justify-center: Centra el contenido
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4">
      
      {/* Contenedor interno que mantiene el ancho máximo del formulario */}
      <div className="w-full max-w-3xl">
        
        <Button variant="ghost" className="mb-4" onClick={handleCancel}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Cliente</CardTitle>
            <CardDescription>
              El cliente recibirá un email para configurar su contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  📧 Recibirá un email para crear su contraseña
                </p>
              </div>

              {/* Razón Social */}
              <div className="space-y-2">
                <Label htmlFor="razon_social">Razón Social</Label>
                <Input
                  id="razon_social"
                  placeholder="Empresa S.A.C."
                  value={formData.razon_social || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      razon_social: e.target.value.trim() || null,
                    })
                  }
                />
              </div>

              {/* RUC */}
              <div className="space-y-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  type="number"
                  placeholder="20123456789"
                  value={formData.ruc || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ruc: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Ingresa el RUC de 11 dígitos (opcional)
                </p>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="number"
                  placeholder="987654321"
                  value={formData.telefono || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefono: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  placeholder="Av. Principal 123, Distrito, Ciudad"
                  value={formData.direccion || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direccion: e.target.value.trim() || null,
                    })
                  }
                  rows={3}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading
                    ? 'Enviando invitación...'
                    : 'Crear y Enviar Invitación'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}