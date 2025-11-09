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

// Helper para verificar permisos
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions ? permissions.includes(permission) : false;
}