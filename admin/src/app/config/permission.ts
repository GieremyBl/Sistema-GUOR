import { Role, Permission } from '@/app/types';

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMINISTRADOR]: [
    Permission.VIEW_USUARIOS,
    Permission.MANAGE_USUARIOS,
    Permission.VIEW_PRODUCTOS,
    Permission.MANAGE_PRODUCTOS,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INVENTARIO,
    Permission.MANAGE_INVENTARIO,
    Permission.VIEW_REPORTES,
    Permission.GENERATE_REPORTES,
    Permission.VIEW_PAGOS,
    Permission.MANAGE_PAGOS,
    Permission.VIEW_ORDENES,
    Permission.MANAGE_ORDENES,
    Permission.VIEW_VENTAS,
    Permission.MANAGE_VENTAS,
    Permission.VIEW_COTIZACIONES,
    Permission.MANAGE_COTIZACIONES,
    Permission.VIEW_TALLERES,
    Permission.MANAGE_TALLERES,
    Permission.VIEW_CONFECCIONES,
    Permission.MANAGE_CONFECCIONES,
    Permission.VIEW_DESPACHO,
    Permission.CONFIRM_ENTREGA,
    Permission.UPDATE_ESTADO_DESPACHO
  ],
  
  [Role.RECEPCIONISTA]: [
    Permission.VIEW_PAGOS,
    Permission.MANAGE_PAGOS,
    Permission.VIEW_ORDENES,
    Permission.MANAGE_ORDENES,
    Permission.VIEW_VENTAS,
    Permission.MANAGE_VENTAS,
    Permission.VIEW_COTIZACIONES,
    Permission.MANAGE_COTIZACIONES
  ],
  
  [Role.CORTADOR]: [
    Permission.VIEW_INVENTARIO,
    Permission.REGISTER_USO_MATERIALES
  ],
  
  [Role.DISEÑADOR]: [
    Permission.VIEW_TALLERES,
    Permission.MANAGE_TALLERES,
    Permission.VIEW_CONFECCIONES,
    Permission.MANAGE_CONFECCIONES
  ],
  
  [Role.REPRESENTANTE_TALLER]: [
    Permission.VIEW_TALLERES,
    Permission.UPDATE_ESTADO_TALLER
  ],
  
  [Role.AYUDANTE]: [
    Permission.VIEW_DESPACHO,
    Permission.CONFIRM_ENTREGA,
    Permission.UPDATE_ESTADO_DESPACHO
  ]
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}