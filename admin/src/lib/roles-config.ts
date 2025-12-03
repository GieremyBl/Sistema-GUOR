
  export interface Permission {
    id: string;
    label: string;
    description: string;
  }

  export interface RoleConfig {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    permissions: {
      // Permisos de creación
      create?: string[];
      // Permisos de visualización
      view?: string[];
      // Permisos de edición
      edit?: string[];
      // Permisos de eliminación
      delete?: string[];
      // Permisos de exportación
      export?: string[];
    };
  }

  export const AVAILABLE_PERMISSIONS: Permission[] = [
    // Gestión de usuarios
    { id: 'usuarios.create', label: 'Crear usuarios', description: 'Crear nuevos usuarios del sistema' },
    { id: 'usuarios.view', label: 'Ver usuarios', description: 'Visualizar lista de usuarios' },
    { id: 'usuarios.edit', label: 'Editar usuarios', description: 'Modificar información de usuarios' },
    { id: 'usuarios.delete', label: 'Eliminar usuarios', description: 'Eliminar usuarios del sistema' },
    { id: 'usuarios.export', label: 'Exportar usuarios', description: 'Exportar datos de usuarios' },

    // Gestión de clientes
    { id: 'clientes.create', label: 'Crear clientes', description: 'Registrar nuevos clientes' },
    { id: 'clientes.view', label: 'Ver clientes', description: 'Visualizar lista de clientes' },
    { id: 'clientes.edit', label: 'Editar clientes', description: 'Modificar información de clientes' },
    { id: 'clientes.delete', label: 'Eliminar clientes', description: 'Eliminar clientes' },
    { id: 'clientes.export', label: 'Exportar clientes', description: 'Exportar datos de clientes' },

    // Gestión de talleres
    { id: 'talleres.create', label: 'Crear talleres', description: 'Registrar talleres externos' },
    { id: 'talleres.view', label: 'Ver talleres', description: 'Visualizar lista de talleres' },
    { id: 'talleres.edit', label: 'Editar talleres', description: 'Modificar información de talleres' },
    { id: 'talleres.delete', label: 'Eliminar talleres', description: 'Eliminar talleres' },
    { id: 'talleres.export', label: 'Exportar talleres', description: 'Exportar datos de talleres' },

    // Productos (solo vista)
    { id: 'productos.view', label: 'Ver productos', description: 'Visualizar catálogo de productos' },
    { id: 'productos.export', label: 'Exportar productos', description: 'Exportar datos de productos' },

    // Pedidos (solo vista)
    { id: 'pedidos.view', label: 'Ver pedidos', description: 'Visualizar lista de pedidos' },
    { id: 'pedidos.export', label: 'Exportar pedidos', description: 'Exportar datos de pedidos' },

    // Cotizaciones (solo vista)
    { id: 'cotizaciones.view', label: 'Ver cotizaciones', description: 'Visualizar lista de cotizaciones' },
    { id: 'cotizaciones.export', label: 'Exportar cotizaciones', description: 'Exportar datos de cotizaciones' },

    // Categorías (solo vista)
    { id: 'categorias.view', label: 'Ver categorías', description: 'Visualizar lista de categorías' },
    { id: 'categorias.export', label: 'Exportar categorías', description: 'Exportar datos de categorías' },

    // Inventario (solo vista)
    { id: 'inventario.view', label: 'Ver inventario', description: 'Visualizar inventario de productos' },
    { id: 'inventario.export', label: 'Exportar inventario', description: 'Exportar datos de inventario' },

    // Confecciones (solo vista)
    { id: 'confecciones.view', label: 'Ver confecciones', description: 'Visualizar lista de confecciones' },
    { id: 'confecciones.export', label: 'Exportar confecciones', description: 'Exportar datos de confecciones' },

    // Despachos (solo vista)
    { id: 'despachos.view', label: 'Ver despachos', description: 'Visualizar lista de despachos' },
    { id: 'despachos.export', label: 'Exportar despachos', description: 'Exportar datos de despachos' },

    // Reportes y estadísticas
    { id: 'reportes.view', label: 'Ver reportes', description: 'Acceder a reportes y estadísticas' },
    { id: 'reportes.export', label: 'Exportar reportes', description: 'Exportar reportes del sistema' },

    // Configuración del sistema
    { id: 'sistema.config', label: 'Configurar sistema', description: 'Acceso a configuración del sistema' },
  ];

  export const ROLES_CONFIG: Record<string, RoleConfig> = {
    administrador: {
      id: 'administrador',
      name: 'Administrador',
      description: 'Acceso total a visualización y gestión de usuarios, clientes y talleres',
      icon: '🔴',
      color: 'red',
      permissions: {
        // Puede crear usuarios, clientes y talleres
        create: ['usuarios.create', 'clientes.create', 'talleres.create'],
        
        // Puede ver todo
        view: [
          'usuarios.view',
          'clientes.view',
          'talleres.view',
          'productos.view',
          'pedidos.view',
          'cotizaciones.view',
          'categorias.view',
          'inventario.view',
          'confecciones.view',
          'despachos.view',
          'reportes.view',
        ],
        
        // Puede editar usuarios, clientes y talleres
        edit: ['usuarios.edit', 'clientes.edit', 'talleres.edit'],
        
        // Puede eliminar usuarios, clientes y talleres
        delete: ['usuarios.delete', 'clientes.delete', 'talleres.delete'],
        
        // Puede exportar todo
        export: [
          'usuarios.export',
          'clientes.export',
          'talleres.export',
          'productos.export',
          'pedidos.export',
          'cotizaciones.export',
          'categorias.export',
          'inventario.export',
          'confecciones.export',
          'despachos.export',
          'reportes.export',
        ],
      },
    },
    
    recepcionista: {
      id: 'recepcionista',
      name: 'Recepcionista',
      description: 'Gestión de pedidos y clientes',
      icon: '🔵',
      color: 'blue',
      permissions: {
        create: ['pedidos.create', 'clientes.create'],
        view: ['pedidos.view', 'clientes.view', 'inventario.view', 'productos.view'],
        edit: ['pedidos.edit', 'clientes.edit'],
        export: ['pedidos.export', 'clientes.export'],
      },
    },
    
    diseñador: {
      id: 'diseñador',
      name: 'Diseñador',
      description: 'Gestión de diseños y patrones',
      icon: '🟣',
      color: 'purple',
      permissions: {
        create: ['productos.create'],
        view: ['productos.view', 'pedidos.view'],
        edit: ['productos.edit'],
        export: ['productos.export'],
      },
    },
  };

  // Función helper para verificar permisos
  export function hasPermission(
    role: string,
    action: 'create' | 'view' | 'edit' | 'delete' | 'export',
    resource: string
  ): boolean {
    const roleConfig = ROLES_CONFIG[role];
    if (!roleConfig) return false;
    
    const permissionKey = `${resource}.${action}`;
    const permissions = roleConfig.permissions[action] || [];
    
    return permissions.includes(permissionKey);
  }

  // Función para obtener todos los permisos de un rol
  export function getRolePermissions(role: string): string[] {
    const roleConfig = ROLES_CONFIG[role];
    if (!roleConfig) return [];
    
    return [
      ...(roleConfig.permissions.create || []),
      ...(roleConfig.permissions.view || []),
      ...(roleConfig.permissions.edit || []),
      ...(roleConfig.permissions.delete || []),
      ...(roleConfig.permissions.export || []),
    ];
  }