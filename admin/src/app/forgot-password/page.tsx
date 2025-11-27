"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Error al enviar el correo. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: "url('/costura.jpg')"
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Modas y Estilos Guor
          </h1>
          <p className="text-gray-600 mt-2">
            Recuperación de contraseña
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold">¿Olvidaste tu contraseña?</CardTitle>
            <CardDescription>
              Ingresa tu email y te enviaremos un link para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      ¡Correo enviado exitosamente!
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
                    </p>
                  </div>
                </div>

                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar link de recuperación
                    </>
                  )}
                </Button>

                <Link href="/login">
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio de sesión
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}