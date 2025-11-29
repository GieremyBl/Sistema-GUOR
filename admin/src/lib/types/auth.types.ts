export enum Role {
  ADMINISTRADOR = 'administrador',
  CORTADOR = 'cortador',
  DISENADOR = 'diseñador',
  RECEPCIONISTA = 'recepcionista',
  AYUDANTE = 'ayudante',
  REPRESENTANTE_TALLER = 'representante_taller',
}

export enum Permission {
  // Gestión de Usuarios
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  
  // Gestión de Clientes
  VIEW_CLIENTS = 'view_clients',
  MANAGE_CLIENTS = 'manage_clients',
  
  // Gestión de Pedidos
  VIEW_ORDERS = 'view_orders',
  CREATE_ORDERS = 'create_orders',
  EDIT_ORDERS = 'edit_orders',
  DELETE_ORDERS = 'delete_orders',
  CHANGE_ORDER_STATUS = 'change_order_status',
  
  // Gestión de Productos
  VIEW_PRODUCTS = 'view_products',
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_STOCK = 'manage_stock',
  
  // Gestión de Categorías
  VIEW_CATEGORIES = 'view_categories',
  MANAGE_CATEGORIES = 'manage_categories',
  
  // Gestión de Inventario
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',
  
  // Gestión de Confecciones
  VIEW_CONFECTIONS = 'view_confections',
  MANAGE_CONFECTIONS = 'manage_confections',
  
  // Gestión de Talleres
  VIEW_WORKSHOPS = 'view_workshops',
  MANAGE_WORKSHOPS = 'manage_workshops',
  
  // Gestión de Cotizaciones
  VIEW_QUOTES = 'view_quotes',
  MANAGE_QUOTES = 'manage_quotes',
  
  // Gestión de Despachos
  VIEW_DISPATCHES = 'view_dispatches',
  MANAGE_DISPATCHES = 'manage_dispatches',
  
  // Reportes
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',
  
  // Configuración
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMINISTRADOR]: 'Administrador',
  [Role.CORTADOR]: 'Cortador',
  [Role.DISENADOR]: 'Diseñador',
  [Role.RECEPCIONISTA]: 'Recepcionista',
  [Role.AYUDANTE]: 'Ayudante',
  [Role.REPRESENTANTE_TALLER]: 'Representante de Taller',
};

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