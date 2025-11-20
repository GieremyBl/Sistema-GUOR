import { Role, Permission } from '@types';

const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMINISTRADOR]: [
    Permission.VIEW_USERS,
    Permission.MANAGE_USERS,
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.DELETE_ORDERS,
    Permission.CHANGE_ORDER_STATUS,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_STOCK,
    Permission.VIEW_CATEGORIES,
    Permission.MANAGE_CATEGORIES,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_CONFECTIONS,
    Permission.MANAGE_CONFECTIONS,
    Permission.VIEW_WORKSHOPS,
    Permission.MANAGE_WORKSHOPS,
    Permission.VIEW_QUOTES,
    Permission.MANAGE_QUOTES,
    Permission.VIEW_DISPATCHES,
    Permission.MANAGE_DISPATCHES,
    Permission.VIEW_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
  ],
  [Role.CORTADOR]: [
    Permission.VIEW_CONFECTIONS,
    Permission.MANAGE_CONFECTIONS,
    Permission.VIEW_WORKSHOPS,
    Permission.MANAGE_WORKSHOPS,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
  ],
  [Role.DISENADOR]: [ 
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.MANAGE_STOCK,
    Permission.VIEW_CATEGORIES,
    Permission.MANAGE_CATEGORIES,
    Permission.VIEW_QUOTES
  ],
  [Role.RECEPCIONISTA]: [
    Permission.VIEW_CLIENTS,
    Permission.MANAGE_CLIENTS,
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDERS,
    Permission.EDIT_ORDERS,
    Permission.DELETE_ORDERS,
    Permission.CHANGE_ORDER_STATUS,
    Permission.VIEW_DISPATCHES,
    Permission.MANAGE_DISPATCHES,
  ],
  [Role.AYUDANTE]: [
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
  ],
  [Role.REPRESENTANTE_TALLER]: [
    Permission.VIEW_ORDERS,
    Permission.CHANGE_ORDER_STATUS,
    Permission.VIEW_WORKSHOPS,
  ],
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