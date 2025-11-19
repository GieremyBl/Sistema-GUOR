import { Role, Permission } from '@/app/types';

export interface RoleConfig {
  role: Role;
  nombre: string;
  descripcion: string;
  color: string;
  permissions: Permission[];
}

export const ROLES_CONFIG: Record<Role, RoleConfig> = {
  [Role.ADMINISTRADOR]: {
    role: Role.ADMINISTRADOR,
    nombre: 'Administrador',
    descripcion: 'Control total del sistema, gestión de usuarios y configuración',
    color: 'bg-purple-500',
    permissions: [
      Permission.VIEW_USERS,
      Permission.MANAGE_USERS,
      Permission.VIEW_PRODUCTS,
      Permission.MANAGE_PRODUCTS,
      Permission.MANAGE_STOCK,
      Permission.VIEW_CATEGORIES,
      Permission.MANAGE_CATEGORIES,
      Permission.VIEW_INVENTORY,
      Permission.MANAGE_INVENTORY,
      Permission.VIEW_REPORTS,
      Permission.EXPORT_REPORTS,
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.EDIT_ORDERS,
      Permission.DELETE_ORDERS,
      Permission.CHANGE_ORDER_STATUS,
      Permission.VIEW_QUOTES,
      Permission.MANAGE_QUOTES,
      Permission.VIEW_CLIENTS,
      Permission.MANAGE_CLIENTS,
      Permission.VIEW_WORKSHOPS,
      Permission.MANAGE_WORKSHOPS,
      Permission.VIEW_CONFECTIONS,
      Permission.MANAGE_CONFECTIONS,
      Permission.VIEW_DISPATCHES,
      Permission.MANAGE_DISPATCHES,
      Permission.VIEW_SETTINGS,
      Permission.MANAGE_SETTINGS,
    ],
  },
  
  [Role.RECEPCIONISTA]: {
    role: Role.RECEPCIONISTA,
    nombre: 'Recepcionista',
    descripcion: 'Atención al cliente, recepción de pedidos y ventas',
    color: 'bg-blue-500',
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_ORDERS,
      Permission.CREATE_ORDERS,
      Permission.EDIT_ORDERS,
      Permission.CHANGE_ORDER_STATUS,
      Permission.VIEW_QUOTES,
      Permission.MANAGE_QUOTES,
      Permission.VIEW_CLIENTS,
      Permission.MANAGE_CLIENTS,
      Permission.VIEW_INVENTORY,
      Permission.VIEW_DISPATCHES,
    ],
  },
  
  [Role.CORTADOR]: {
    role: Role.CORTADOR,
    nombre: 'Cortador',
    descripcion: 'Gestión de corte de telas y registro de uso de materiales',
    color: 'bg-orange-500',
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_ORDERS,
      Permission.VIEW_CONFECTIONS,
      Permission.MANAGE_CONFECTIONS,
      Permission.VIEW_INVENTORY,
      Permission.MANAGE_INVENTORY,
    ],
  },
  
  [Role.DISENADOR]: {
    role: Role.DISENADOR,
    nombre: 'Diseñador',
    descripcion: 'Creación y diseño de productos y patrones',
    color: 'bg-pink-500',
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.MANAGE_PRODUCTS,
      Permission.VIEW_ORDERS,
      Permission.VIEW_CONFECTIONS,
      Permission.MANAGE_CONFECTIONS,
      Permission.VIEW_INVENTORY,
    ],
  },
  
  [Role.REPRESENTANTE_TALLER]: {
    role: Role.REPRESENTANTE_TALLER,
    nombre: 'Representante de Taller',
    descripcion: 'Gestión de talleres externos y seguimiento de confecciones',
    color: 'bg-indigo-500',
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_ORDERS,
      Permission.VIEW_CONFECTIONS,
      Permission.VIEW_WORKSHOPS,
      Permission.MANAGE_WORKSHOPS,
      Permission.VIEW_REPORTS,
    ],
  },
  
  [Role.AYUDANTE]: {
    role: Role.AYUDANTE,
    nombre: 'Ayudante',
    descripcion: 'Asistencia general en tareas de producción',
    color: 'bg-gray-500',
    permissions: [
      Permission.VIEW_PRODUCTS,
      Permission.VIEW_ORDERS,
      Permission.VIEW_CONFECTIONS,
      Permission.VIEW_INVENTORY,
      Permission.VIEW_DISPATCHES,
    ],
  },
};

// Categorías actualizadas
export const PERMISSION_CATEGORIES = {
  'Gestión de Usuarios': [
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
  ],
  'Gestión de Productos': [
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_STOCK,
  ],
  'Gestión de Categorías': [
    Permission.VIEW_CATEGORIES,
    Permission.MANAGE_CATEGORIES,
  ],
  'Gestión de Inventario': [
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
  ],
  'Gestión de Pedidos': [
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.DELETE_ORDERS,
    Permission.CHANGE_ORDER_STATUS,
  ],
  'Gestión de Cotizaciones': [
    Permission.VIEW_QUOTES,
    Permission.MANAGE_QUOTES,
  ],
  'Gestión de Clientes': [         
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
  ],
  'Talleres Externos': [
    Permission.VIEW_WORKSHOPS,
    Permission.MANAGE_WORKSHOPS,
  ],
  'Confecciones': [
    Permission.VIEW_CONFECTIONS,
    Permission.MANAGE_CONFECTIONS,
  ],
  'Despacho de Pedidos': [
    Permission.VIEW_DISPATCHES,
    Permission.MANAGE_DISPATCHES,
  ],
  'Reportes': [
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
  ],
  'Configuración': [
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
  ],
};

// Labels actualizados - Usa los mismos del types.ts
export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.VIEW_USERS]: 'Ver Usuarios',
  [Permission.MANAGE_USERS]: 'Gestionar Usuarios',
  [Permission.VIEW_CLIENTS]: 'Ver Clientes',
  [Permission.MANAGE_CLIENTS]: 'Gestionar Clientes',
  [Permission.VIEW_ORDERS]: 'Ver Pedidos',
  [Permission.CREATE_ORDERS]: 'Crear Pedidos',
  [Permission.EDIT_ORDERS]: 'Editar Pedidos',
  [Permission.DELETE_ORDERS]: 'Eliminar Pedidos',
  [Permission.CHANGE_ORDER_STATUS]: 'Cambiar Estado de Pedidos',
  [Permission.VIEW_PRODUCTS]: 'Ver Productos',
  [Permission.MANAGE_PRODUCTS]: 'Gestionar Productos',
  [Permission.MANAGE_STOCK]: 'Gestionar Stock',
  [Permission.VIEW_CATEGORIES]: 'Ver Categorías',
  [Permission.MANAGE_CATEGORIES]: 'Gestionar Categorías',
  [Permission.VIEW_INVENTORY]: 'Ver Inventario',
  [Permission.MANAGE_INVENTORY]: 'Gestionar Inventario',
  [Permission.VIEW_CONFECTIONS]: 'Ver Confecciones',
  [Permission.MANAGE_CONFECTIONS]: 'Gestionar Confecciones',
  [Permission.VIEW_WORKSHOPS]: 'Ver Talleres',
  [Permission.MANAGE_WORKSHOPS]: 'Gestionar Talleres',
  [Permission.VIEW_QUOTES]: 'Ver Cotizaciones',
  [Permission.MANAGE_QUOTES]: 'Gestionar Cotizaciones',
  [Permission.VIEW_DISPATCHES]: 'Ver Despachos',
  [Permission.MANAGE_DISPATCHES]: 'Gestionar Despachos',
  [Permission.VIEW_REPORTS]: 'Ver Reportes',
  [Permission.EXPORT_REPORTS]: 'Exportar Reportes',
  [Permission.VIEW_SETTINGS]: 'Ver Configuración',
  [Permission.MANAGE_SETTINGS]: 'Gestionar Configuración',
};

// Funciones de utilidad (sin cambios)
export function hasPermission(role: Role, permission: Permission): boolean {
  const roleConfig = ROLES_CONFIG[role];
  return roleConfig?.permissions.includes(permission) ?? false;
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLES_CONFIG[role]?.permissions ?? [];
}

export function getRoleConfig(role: Role): RoleConfig | undefined {
  return ROLES_CONFIG[role];
}

export function getAllRoles(): RoleConfig[] {
  return Object.values(ROLES_CONFIG);
}