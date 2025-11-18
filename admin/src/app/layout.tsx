import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modas y Estilos Guor - Sistema de Gestión",
  description: "Sistema de Gestión Textil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      <Toaster />
      </body>
    </html>
  );
}