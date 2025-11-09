export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios_ids: {
        Row: {
          id: number
          email: string
          nombre: string | null
          apellido: string | null
          contraseña: string
          telefono: string | null
          direccion: string | null
          estado: boolean
          rol: 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'CORTADOR' | 'DISEÑADOR' | 'REPRESENTANTE_TALLER' | 'AYUDANTE'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          email: string
          contraseña: string
          nombre?: string | null
          apellido?: string | null
          telefono?: string | null
          direccion?: string | null
          estado?: boolean
          rol?: 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'CORTADOR' | 'DISEÑADOR' | 'REPRESENTANTE_TALLER' | 'AYUDANTE'
        }
        Update: {
          email?: string
          nombre?: string | null
          apellido?: string | null
          telefono?: string | null
          direccion?: string | null
          estado?: boolean
          rol?: 'ADMINISTRADOR' | 'RECEPCIONISTA' | 'CORTADOR' | 'DISEÑADOR' | 'REPRESENTANTE_TALLER' | 'AYUDANTE'
        }
      }
      clientes: {
        Row: {
          id: number
          nombre: string
          email: string | null
          telefono: string | null
          direccion: string | null
          created_at: string
        }
      }
      productos: {
        Row: {
          id: number
          nombre: string
          descripcion: string | null
          precio: number
          stock: number
          created_at: string
        }
      }
      inventario: {
        Row: {
          id: number
          producto_id: number
          cantidad: number
          ubicacion: string | null
          updated_at: string
        }
      }
      pedidos: {
        Row: {
          id: number
          cliente_id: number
          estado: string
          total: number
          created_at: string
          updated_at: string | null
        }
      }
      cotizaciones: {
        Row: {
          id: number
          cliente_id: number
          created_by: number
          monto: number
          estado: string
          created_at: string
        }
      }
      confecciones: {
        Row: {
          id: number
          pedido_id: number
          estado: string
          fecha_inicio: string | null
          fecha_fin: string | null
          created_at: string
        }
      }
      talleres: {
        Row: {
          id: number
          nombre: string
          contacto: string | null
          direccion: string | null
          created_at: string
        }
      }
      despachos: {
        Row: {
          id: number
          pedido_id: number
          responsable_id: number
          estado: string
          fecha_despacho: string | null
          created_at: string
        }
      }
    }
  }
}