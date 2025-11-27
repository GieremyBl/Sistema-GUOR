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
  Boxes,
  DollarSign,
  Building2,
  ChevronDown,
  UserPlus,
  Shield,
  FileText,
  Tags,
  Menu,
  X,
  LogOut,
  BookOpen,
  Truck,
  Plus, // ← AGREGAR ESTE IMPORT
} from 'lucide-react';

type Usuario = {
  rol: string;
  nombre_completo?: string;
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
        title: 'Roles y Permisos',
        href: '/Panel-Administrativo/usuarios/roles',
        icon: Shield,
      },
    ],
  },
  {
    title: 'Clientes',
    icon: Users,
    roles: ['administrador', 'recepcionista'],
    subItems: [
      {
        title: 'Lista de Clientes',
        href: '/Panel-Administrativo/clientes',
        icon: Users,
      },
    ],
  },
  {
    title: 'Pedidos',
    icon: ShoppingCart,
    roles: ['administrador', 'recepcionista', 'diseñador', 'cortador','cortador'],
    subItems: [
      {
        title: 'Todos los Pedidos',
        href: '/Panel-Administrativo/pedidos',
        icon: ShoppingCart,
      },
      {
        title: 'Historial',
        href: '/Panel-Administrativo/pedidos/historial',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Catálogo',
    icon: BookOpen,
    roles: ['administrador', 'diseñador'],
    subItems: [
      {
        title: 'Productos',
        href: '/Panel-Administrativo/productos',
        icon: Package,
      },
      {
        title: 'Categorías',
        href: '/Panel-Administrativo/categorias',
        icon: Tags,
      },
    ],
  },
  {
    title: 'Producción',
    icon: Scissors,
    roles: ['administrador', 'cortador', 'representante_taller'],
    subItems: [
      {
        title: 'Corte',
        href: '/Panel-Administrativo/corte',
        icon: Scissors,
      },
      {
        title: 'Confecciones',
        href: '/Panel-Administrativo/confecciones',
        icon: Building2,
      },
      {
        title: 'Talleres',
        href: '/Panel-Administrativo/talleres',
        icon: Building2,
      },
    ],
  },
  {
    title: 'Logística',
    icon: Truck,
    roles: ['administrador', 'diseñador','ayudante'],
    subItems: [
      {
        title: 'Inventario',
        href: '/Panel-Administrativo/inventario',
        icon: Boxes,
      },  
      {
        title: 'Despachos',
        href: '/Panel-Administrativo/despachos',
        icon: Truck,
      },
    ],
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
        icon: DollarSign,
      },
      {
        title: 'Producción',
        href: '/Panel-Administrativo/reportes/produccion',
        icon: Scissors,
      },
      {
        title: 'Inventario',
        href: '/Panel-Administrativo/reportes/inventario',
        icon: Boxes,
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(usuario.rol)
  );

  const toggleMenu = (title: string) => {
    if (isCollapsed) setIsCollapsed(false);
    setOpenMenus(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isSubItemActive = (subItems?: SubMenuItem[]) => {
    if (!subItems) return false;
    return subItems.some(subItem => pathname === subItem.href);
  };

  const handleSignOut = () => {
    window.location.href = '/auth/signout';
  };

  return (
    <>
      {/* Botón móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay móvil */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={cn(
          "flex flex-col h-screen transition-all duration-300 ease-in-out border-r border-amber-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
          isCollapsed ? "w-24" : "w-72", 
          "fixed lg:relative z-40",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ backgroundColor: '#fffbf2' }}
      >
        {/* Header del Sidebar */}
        <div className="h-24 flex items-center justify-between px-6 mb-2 transition-all duration-300">
          {!isCollapsed ? (
            <div className="flex items-center gap-3 w-full animate-in fade-in duration-300">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="relative w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-gray-800 leading-tight truncate">
                  GUOR
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold truncate">
                  Modas y Estilos
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center transition-all duration-300">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
          )}
        </div>

        {/* Perfil de Usuario Compacto */}
        {!isCollapsed && usuario.nombre_completo && (
          <div className="px-6 mb-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="bg-white/60 p-3 rounded-2xl border border-amber-100/50 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-rose-500 text-white flex items-center justify-center font-bold shadow-rose-200 shadow-md text-sm">
                {usuario.nombre_completo.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{usuario.nombre_completo}</p>
                <p className="text-xs text-gray-500 capitalize truncate">{usuario.rol.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto hover:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus.includes(item.title);
            const isActive = pathname === item.href || isSubItemActive(item.subItems);

            return (
              <div key={item.title} className="mb-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleMenu(item.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 rounded-xl transition-all duration-300 group',
                      isCollapsed ? "py-4" : "py-3",
                      isActive
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200'
                        : 'text-gray-600 hover:bg-white hover:text-rose-600 hover:shadow-sm'
                    )}
                  >
                    <div className={cn("flex items-center gap-3 transition-all duration-300", isCollapsed && "justify-center w-full")}>
                      <Icon className={cn(
                        "transition-all duration-300",
                        isCollapsed ? "w-8 h-8" : "w-5 h-5", 
                        !isActive && "text-gray-400 group-hover:text-rose-500"
                      )} />
                      {!isCollapsed && <span className="font-medium text-sm truncate">{item.title}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={cn("w-4 h-4 transition-transform duration-200 opacity-70", isOpen && "rotate-180")} />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={cn(
                      'flex items-center gap-3 px-4 rounded-xl transition-all duration-300 group',
                      isCollapsed ? "py-4" : "py-3",
                      isActive
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-200'
                        : 'text-gray-600 hover:bg-white hover:text-rose-600 hover:shadow-sm',
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.title : ''}
                  >
                    <Icon className={cn(
                      "transition-all duration-300",
                      isCollapsed ? "w-8 h-8" : "w-5 h-5",
                      !isActive && "text-gray-400 group-hover:text-rose-500"
                    )} />
                    {!isCollapsed && <span className="font-medium text-sm truncate">{item.title}</span>}
                  </Link>
                )}

                {/* Submenú */}
                {hasSubItems && isOpen && !isCollapsed && (
                  <div className="mt-1 ml-4 pl-4 space-y-1 border-l border-amber-200/60 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = pathname === subItem.href;
                      const SubIcon = subItem.icon;
                      
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                            isSubActive
                              ? 'bg-rose-50 text-rose-600 font-medium'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                          )}
                        >
                          {SubIcon ? (
                            <SubIcon className={cn("w-4 h-4 flex-shrink-0", isSubActive ? "text-rose-500" : "text-gray-400")} />
                          ) : (
                            <div className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isSubActive ? "bg-rose-500" : "bg-gray-300")} />
                          )}
                          <span className="truncate">{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-amber-100">
          {!isCollapsed ? (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group animate-in fade-in duration-200"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm truncate">Cerrar Sesión</span>
            </button>
          ) : (
            <button onClick={handleSignOut} className="w-full flex justify-center p-2 text-gray-500 hover:text-red-600 transition-all duration-300">
              <LogOut className="w-8 h-8" />
            </button>
          )}
          
          {!isCollapsed && (
            <div className="mt-4 text-center animate-in fade-in duration-200">
               <p className="text-[10px] text-gray-400 font-medium">© 2025 GUOR System v1.0</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}