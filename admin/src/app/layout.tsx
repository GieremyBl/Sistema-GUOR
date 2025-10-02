import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/providers/session-providers";
import { ThemeProvider } from "@/components/providers/ThemeProviders";

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
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextAuthSessionProvider>
            {children}
          </NextAuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}