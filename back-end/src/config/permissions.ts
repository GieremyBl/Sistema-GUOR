import { Role, Permission } from '../types/roles';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMINISTRADOR]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.DELETE_USERS,
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_QUOTES,
    Permission.MANAGE_QUOTES,
    Permission.VIEW_CONFECTIONS,
    Permission.MANAGE_CONFECTIONS,
    Permission.VIEW_WORKSHOPS,
    Permission.MANAGE_WORKSHOPS,
    Permission.VIEW_DISPATCH,
    Permission.MANAGE_DISPATCH,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REPORTS,
  ],
  
  [Role.RECEPCIONISTA]: [
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
    Permission.VIEW_ORDERS,
    Permission.MANAGE_ORDERS,
    Permission.VIEW_QUOTES,
    Permission.MANAGE_QUOTES,
  ],
  
  [Role.CORTADOR]: [
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_INVENTORY,
    Permission.REGISTER_MATERIAL_USAGE,
  ],
  
  [Role.DISEÑADOR]: [
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_CONFECTIONS,
    Permission.MANAGE_CONFECTIONS,
    Permission.VIEW_WORKSHOPS,
    Permission.MANAGE_WORKSHOPS,
  ],
  
  [Role.REPRESENTANTE_TALLER]: [
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_WORKSHOPS,
    Permission.VIEW_CONFECTIONS,
    Permission.UPDATE_WORKSHOP_STATUS,
  ],
  
  [Role.AYUDANTE]: [
    Permission.UPDATE_OWN_PROFILE,
    Permission.VIEW_DISPATCH,
    Permission.CONFIRM_DELIVERY,
  ],
};

// Verifica si un rol tiene un permiso específico
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

// Obtiene todos los permisos asociados a un rol
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Verifica si un rol tiene al menos uno de los permisos especificados
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

// Verifica si un rol tiene todos los permisos especificados
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}