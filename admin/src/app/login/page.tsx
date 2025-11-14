"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getUsuarioCompleto } from "@/app/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LogIn, AlertCircle, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Login con Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setError("Error al iniciar sesión.");
        setIsLoading(false);
        return;
      }

      // 2. Obtener datos adicionales del usuario
      const usuario = await getUsuarioCompleto();

      if (!usuario) {
        setError("Error obteniendo datos del usuario.");
        setIsLoading(false);
        return;
      }

      // 3. Verificar que el usuario esté activo
      if (usuario.estado !== 'ACTIVO') {
        await supabase.auth.signOut();
        setError("Tu cuenta está inactiva. Contacta al administrador.");
        setIsLoading(false);
        return;
      }

      // 4. Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', usuario.id);

      // 5. Redirigir al dashboard
      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      console.error("Error en login:", error);
      setError("Ocurrió un error. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: "url('/costura.jpg')" }}
      />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Modas y Estilos Guor
          </h1>
          <p className="text-gray-600 mt-2">
            S.A.C. - Sistema de Gestión Textil
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales corporativas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@guor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Iniciando sesión..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">
                      ¿No tienes acceso al sistema?
                    </p>
                    <p className="text-sm text-blue-700">
                      Contacta al administrador del sistema para solicitar tus credenciales.
                    </p>
                    <p className="text-xs text-blue-600 mt-2">
                      Email: admin@guor.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 Modas y Estilos Guor. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}