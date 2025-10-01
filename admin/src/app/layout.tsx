import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/session-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Modas y Estilos Guor - Sistema de Gestión",
  description: "Sistema de gestión textil para Modas y Estilos Guor S.A.C.",
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}