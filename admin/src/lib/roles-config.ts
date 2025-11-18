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
      Permission.VIEW_USUARIOS,
      Permission.MANAGE_USUARIOS,
      Permission.VIEW_PRODUCTOS,
      Permission.MANAGE_PRODUCTOS,
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_INVENTARIO,
      Permission.MANAGE_INVENTARIO,
      Permission.REGISTER_USO_MATERIALES,
      Permission.VIEW_REPORTES,
      Permission.GENERATE_REPORTES,
      Permission.VIEW_PAGOS,
      Permission.MANAGE_PAGOS,
      Permission.VIEW_PEDIDOS,
      Permission.MANAGE_PEDIDOS,
      Permission.VIEW_VENTAS,
      Permission.MANAGE_VENTAS,
      Permission.VIEW_COTIZACIONES,
      Permission.MANAGE_COTIZACIONES,
      Permission.VIEW_CLIENTES,
      Permission.MANAGE_CLIENTES,
      Permission.VIEW_TALLERES,
      Permission.MANAGE_TALLERES,
      Permission.UPDATE_ESTADO_TALLER,
      Permission.VIEW_CONFECCIONES,
      Permission.MANAGE_CONFECCIONES,
      Permission.VIEW_DESPACHO,
      Permission.CONFIRM_ENTREGA,
      Permission.UPDATE_ESTADO_DESPACHO,
    ],
  },
  
  [Role.RECEPCIONISTA]: {
    role: Role.RECEPCIONISTA,
    nombre: 'Recepcionista',
    descripcion: 'Atención al cliente, recepción de pedidos y ventas',
    color: 'bg-blue-500',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PRODUCTOS,
      Permission.VIEW_PEDIDOS,
      Permission.MANAGE_PEDIDOS,
      Permission.VIEW_VENTAS,
      Permission.MANAGE_VENTAS,
      Permission.VIEW_COTIZACIONES,
      Permission.MANAGE_COTIZACIONES,
      Permission.VIEW_CLIENTES,
      Permission.MANAGE_CLIENTES,
      Permission.VIEW_PAGOS,
      Permission.MANAGE_PAGOS,
      Permission.VIEW_INVENTARIO,
      Permission.VIEW_DESPACHO,
    ],
  },
  
  [Role.CORTADOR]: {
    role: Role.CORTADOR,
    nombre: 'Cortador',
    descripcion: 'Gestión de corte de telas y registro de uso de materiales',
    color: 'bg-orange-500',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PRODUCTOS,
      Permission.VIEW_PEDIDOS,
      Permission.VIEW_CONFECCIONES,
      Permission.MANAGE_CONFECCIONES,
      Permission.VIEW_INVENTARIO,
      Permission.REGISTER_USO_MATERIALES,
    ],
  },
  
  [Role.DISEÑADOR]: {
    role: Role.DISEÑADOR,
    nombre: 'Diseñador',
    descripcion: 'Creación y diseño de productos y patrones',
    color: 'bg-pink-500',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PRODUCTOS,
      Permission.MANAGE_PRODUCTOS,
      Permission.VIEW_PEDIDOS,
      Permission.VIEW_CONFECCIONES,
      Permission.MANAGE_CONFECCIONES,
      Permission.VIEW_INVENTARIO,
    ],
  },
  
  [Role.REPRESENTANTE_TALLER]: {
    role: Role.REPRESENTANTE_TALLER,
    nombre: 'Representante de Taller',
    descripcion: 'Gestión de talleres externos y seguimiento de confecciones',
    color: 'bg-indigo-500',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PRODUCTOS,
      Permission.VIEW_PEDIDOS,
      Permission.VIEW_CONFECCIONES,
      Permission.VIEW_TALLERES,
      Permission.MANAGE_TALLERES,
      Permission.UPDATE_ESTADO_TALLER,
      Permission.VIEW_REPORTES,
    ],
  },
  
  [Role.AYUDANTE]: {
    role: Role.AYUDANTE,
    nombre: 'Ayudante',
    descripcion: 'Asistencia general en tareas de producción',
    color: 'bg-gray-500',
    permissions: [
      Permission.VIEW_DASHBOARD,
      Permission.VIEW_PRODUCTOS,
      Permission.VIEW_PEDIDOS,
      Permission.VIEW_CONFECCIONES,
      Permission.VIEW_INVENTARIO,
      Permission.VIEW_DESPACHO,
    ],
  },
};

// Categorías actualizadas
export const PERMISSION_CATEGORIES = {
  'Gestión de Usuarios': [
    Permission.VIEW_USUARIOS,
    Permission.MANAGE_USUARIOS,
  ],
  'Gestión de Productos': [
    Permission.VIEW_PRODUCTOS,
    Permission.MANAGE_PRODUCTOS,
  ],
  'Dashboard': [
    Permission.VIEW_DASHBOARD,
  ],
  'Gestión de Inventario': [
    Permission.VIEW_INVENTARIO,
    Permission.MANAGE_INVENTARIO,
    Permission.REGISTER_USO_MATERIALES,
  ],
  'Reportes': [
    Permission.VIEW_REPORTES,
    Permission.GENERATE_REPORTES,
  ],
  'Gestión de Pagos': [
    Permission.VIEW_PAGOS,
    Permission.MANAGE_PAGOS,
  ],
  'Gestión de Pedidos': [
    Permission.VIEW_PEDIDOS,
    Permission.MANAGE_PEDIDOS,
  ],
  'Gestión de Ventas': [
    Permission.VIEW_VENTAS,
    Permission.MANAGE_VENTAS,
  ],
  'Gestión de Cotizaciones': [
    Permission.VIEW_COTIZACIONES,
    Permission.MANAGE_COTIZACIONES,
  ],
  'Gestión de Clientes': [         
    Permission.VIEW_CLIENTES,
    Permission.MANAGE_CLIENTES,
  ],
  'Talleres Externos': [
    Permission.VIEW_TALLERES,
    Permission.MANAGE_TALLERES,
    Permission.UPDATE_ESTADO_TALLER,
  ],
  'Confecciones': [
    Permission.VIEW_CONFECCIONES,
    Permission.MANAGE_CONFECCIONES,
  ],
  'Despacho de Pedidos': [
    Permission.VIEW_DESPACHO,
    Permission.CONFIRM_ENTREGA,
    Permission.UPDATE_ESTADO_DESPACHO,
  ],
};

// Labels actualizados
export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.VIEW_USUARIOS]: 'Ver usuarios',
  [Permission.MANAGE_USUARIOS]: 'Gestionar usuarios',
  [Permission.VIEW_PRODUCTOS]: 'Ver productos',
  [Permission.MANAGE_PRODUCTOS]: 'Gestionar productos',
  [Permission.VIEW_DASHBOARD]: 'Ver dashboard',
  [Permission.VIEW_INVENTARIO]: 'Ver inventario',
  [Permission.MANAGE_INVENTARIO]: 'Gestionar inventario',
  [Permission.REGISTER_USO_MATERIALES]: 'Registrar uso de materiales',
  [Permission.VIEW_REPORTES]: 'Ver reportes',
  [Permission.GENERATE_REPORTES]: 'Generar reportes',
  [Permission.VIEW_PAGOS]: 'Ver pagos',
  [Permission.MANAGE_PAGOS]: 'Gestionar pagos',
  [Permission.VIEW_PEDIDOS]: 'Ver pedidos',         
  [Permission.MANAGE_PEDIDOS]: 'Gestionar pedidos',   
  [Permission.VIEW_VENTAS]: 'Ver ventas',
  [Permission.MANAGE_VENTAS]: 'Gestionar ventas',
  [Permission.VIEW_COTIZACIONES]: 'Ver cotizaciones',
  [Permission.MANAGE_COTIZACIONES]: 'Gestionar cotizaciones',
  [Permission.VIEW_CLIENTES]: 'Ver clientes',
  [Permission.MANAGE_CLIENTES]: 'Gestionar clientes',
  [Permission.VIEW_TALLERES]: 'Ver talleres',
  [Permission.MANAGE_TALLERES]: 'Gestionar talleres',
  [Permission.UPDATE_ESTADO_TALLER]: 'Actualizar estado de taller',
  [Permission.VIEW_CONFECCIONES]: 'Ver confecciones',
  [Permission.MANAGE_CONFECCIONES]: 'Gestionar confecciones',
  [Permission.VIEW_DESPACHO]: 'Ver despacho',
  [Permission.CONFIRM_ENTREGA]: 'Confirmar entrega',
  [Permission.UPDATE_ESTADO_DESPACHO]: 'Actualizar estado de despacho',
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