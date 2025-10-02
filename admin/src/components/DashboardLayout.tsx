"use client";

import { useState } from "react";
import Sidebar from "./AppSidebar";
import Header from "./AppHeader";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Mobile Navigation */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed left-4 top-4 z-40"
            size="sm"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Layout */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500">
                  &copy; 2025 Modas Estilos GUOR. Todos los derechos reservados.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
