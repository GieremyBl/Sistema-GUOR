"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingCart, 
  Package, 
  Users,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Gestión de Cotizaciones",
    href: "/cotizaciones",
    icon: FileText,
  },
];

const additionalModules: NavItem[] = [
  {
    title: "Gestión de Pedidos",
    href: "/pedidos",
    icon: ShoppingCart,
  },
  {
    title: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    title: "Gestión de Clientes",
    href: "/clientes",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-400 via-pink-400 to-orange-400 flex items-center justify-center shadow-md">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">GestiónPro</h2>
            <p className="text-xs text-gray-500">Panel Administrador</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <div className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                <span className="flex-1">{item.title}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-rose-600" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Additional Modules Section */}
        <div className="mt-8 px-3">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Módulos Adicionales
          </h3>
          <div className="space-y-1">
            {additionalModules.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                    isActive
                      ? "bg-rose-50 text-rose-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className="flex-1">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}