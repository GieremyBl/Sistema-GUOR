"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Scissors,
  Settings,
  BarChart3,
  Palette,
  Boxes,
  DollarSign,
  Building2,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Shield,
  FileText,
  Tags,
} from 'lucide-react';

type Usuario = {
  rol: string;
};

type SubMenuItem = {
  title: string;
  href: string;
  icon?: any;
};

type NavItem = {
  title: string;
  href?: string;
  icon: any;
  roles: string[];
  subItems?: SubMenuItem[];
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/Panel-Administrativo/dashboard',
    icon: LayoutDashboard,
    roles: ['administrador', 'recepcionista', 'diseñador', 'cortador', 'ayudante', 'representante_taller'],
  },
  {
    title: 'Usuarios',
    icon: Users,
    roles: ['administrador'],
    subItems: [
      {
        title: 'Lista de Usuarios',
        href: '/Panel-Administrativo/usuarios',
        icon: Users,
      },
      {
        title: 'Nuevo Usuario',
        href: '/Panel-Administrativo/usuarios/nuevo',
        icon: UserPlus,
      },
      {
        title: 'Roles y Permisos',
        href: '/Panel-Administrativo/usuarios/roles',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Clientes',
    href: '/Panel-Administrativo/clientes',
    icon: Users,
    roles: ['administrador', 'recepcionista'],
  },
  {
    title: 'Pedidos',
    icon: ShoppingCart,
    roles: ['administrador', 'recepcionista', 'diseñador', 'cortador'],
    subItems: [
      {
        title: 'Todos los Pedidos',
        href: '/Panel-Administrativo/pedidos',
        icon: ShoppingCart,
      },
      {
        title: 'Nuevo Pedido',
        href: '/Panel-Administrativo/pedidos/nuevo',
      },
      {
        title: 'Historial',
        href: '/Panel-Administrativo/pedidos/historial',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Productos',
    icon: Package,
    roles: ['administrador', 'diseñador'],
    subItems: [
      {
        title: 'Lista de Productos',
        href: '/Panel-Administrativo/productos',
        icon: Package,
      },
      {
        title: 'Categorías',
        href: '/Panel-Administrativo/productos/categorias',
        icon: Tags,
      },
    ],
  },
  {
    title: 'Inventario',
    href: '/Panel-Administrativo/inventario',
    icon: Boxes,
    roles: ['administrador', 'diseñador'],
  },
  {
    title: 'Corte',
    href: '/Panel-Administrativo/corte',
    icon: Scissors,
    roles: ['administrador', 'cortador'],
  },
  {
    title: 'Confecciones',
    href: '/Panel-Administrativo/confecciones',
    icon: Building2,
    roles: ['administrador', 'representante_taller'],
  },
  {
    title: 'Cotizaciones',
    href: '/Panel-Administrativo/cotizaciones',
    icon: DollarSign,
    roles: ['administrador', 'recepcionista'],
  },
  {
    title: 'Reportes',
    icon: BarChart3,
    roles: ['administrador'],
    subItems: [
      {
        title: 'Ventas',
        href: '/Panel-Administrativo/reportes/ventas',
      },
      {
        title: 'Producción',
        href: '/Panel-Administrativo/reportes/produccion',
      },
      {
        title: 'Inventario',
        href: '/Panel-Administrativo/reportes/inventario',
      },
    ],
  },
  {
    title: 'Configuración',
    href: '/Panel-Administrativo/configuracion',
    icon: Settings,
    roles: ['administrador'],
  },
];

export default function Sidebar({ usuario }: { usuario: Usuario }) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  // Filtrar items según rol
  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(usuario.rol)
  );

  // Toggle menú desplegable
  const toggleMenu = (title: string) => {
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  // Verificar si un submenú está activo
  const isSubItemActive = (subItems?: SubMenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(subItem => pathname === subItem.href);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col h-screen">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Guor System</h1>
            <p className="text-xs text-gray-400">Sistema de Gestión</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus.includes(item.title);
            const isActive = pathname === item.href || isSubItemActive(item.subItems);

            return (
              <div key={item.title}>
                {/* Item principal */}
                {hasSubItems ? (
                  // Con submenú - clickeable para expandir
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        isActive ? "text-white" : "text-gray-400"
                      )} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                ) : (
                  // Sin submenú - link directo
                  <Link
                    href={item.href!}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-white" : "text-gray-400"
                    )} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                )}

                {/* Submenú desplegable */}
                {hasSubItems && isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-4">
                    {item.subItems!.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = pathname === subItem.href;

                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                            isSubActive
                              ? 'bg-rose-600/20 text-rose-300 font-medium'
                              : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                          )}
                        >
                          {SubIcon && <SubIcon className="w-4 h-4" />}
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer del sidebar */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <p className="text-xs text-gray-400 text-center">
            © 2025 Modas y Estilos Guor
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}