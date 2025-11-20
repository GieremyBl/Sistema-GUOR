"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getUsuarioCompleto } from "@/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Button } from "@/ui/button";
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

    console.log("🔐 [LOGIN] Iniciando login para:", email);

    try {
      // 1. Login con Supabase Auth
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("📝 [LOGIN] Resultado de signInWithPassword:", {
        success: !!data.user,
        userId: data.user?.id,
        hasSession: !!data.session,
        error: loginError?.message
      });

      if (loginError) {
        console.error("❌ [LOGIN] Error de autenticación:", loginError);
        setError("Credenciales inválidas. Por favor, intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        console.error("❌ [LOGIN] No se obtuvo usuario");
        setError("Error al iniciar sesión.");
        setIsLoading(false);
        return;
      }

      console.log("✅ [LOGIN] Autenticación exitosa, verificando datos...");

      // 2. Obtener datos adicionales del usuario
      const usuario = await getUsuarioCompleto();

      console.log("👤 [LOGIN] Usuario completo:", {
        encontrado: !!usuario,
        id: usuario?.id,
        estado: usuario?.estado,
        rol: usuario?.rol
      });

      if (!usuario) {
        console.error("❌ [LOGIN] No se encontró usuario en BD");
        setError("Error obteniendo datos del usuario.");
        setIsLoading(false);
        return;
      }

      // 3. Verificar que el usuario esté activo
      if (usuario.estado?.toLowerCase() !== 'activo') {
        console.error("❌ [LOGIN] Usuario inactivo");
        await supabase.auth.signOut();
        setError("Tu cuenta está inactiva. Contacta al administrador.");
        setIsLoading(false);
        return;
      }

      console.log("✅ [LOGIN] Usuario activo, actualizando último acceso...");

      // 4. Actualizar último acceso
      await supabase
        .from('usuarios')
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq('id', usuario.id);

      console.log("🚀 [LOGIN] Redirigiendo al dashboard...");

      // 5. Esperar un momento para asegurar que las cookies estén completamente sincronizadas
      await new Promise(resolve => setTimeout(resolve, 200));

      // 6. Redirigir al dashboard - usar window.location para forzar recarga
      window.location.href = "/Panel-Administrativo/dashboard";
      
      // 7. Detener cualquier ejecución adicional
      return;

    } catch (error) {
      console.error("💥 [LOGIN] Error inesperado:", error);
      setError("Ocurrió un error. Por favor, intenta de nuevo.");
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