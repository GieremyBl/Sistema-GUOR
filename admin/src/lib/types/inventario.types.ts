export interface Insumo {
    id: number;
    nombre: string;
    tipo: string; // Ej: Tela, Hilo, Botón
    unidad_medida: string; // Ej: Metros, Unidades, Rollos
    stock_actual: number;
    stock_minimo: number;
    activo: boolean;
}