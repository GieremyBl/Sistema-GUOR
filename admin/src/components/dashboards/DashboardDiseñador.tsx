
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Palette, Package, Clock, TrendingUp } from "lucide-react";

type Usuario = {
  id: number;
  nombre_completo: string;
  rol: string;
};

export default function DashboardDiseñador({ usuario }: { usuario: Usuario }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal con padding generoso */}
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        {/* Header con más espacio */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard de Diseño
        </h1>
        <p className="text-gray-600 mt-1">
          Gestión de diseños y catálogo de productos
        </p>
      </div>
      {/* KPIs para diseñador */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Diseños Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-gray-600">Por aprobar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-gray-600">En catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Este Mes</CardTitle>
            <Palette className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">Diseños creados</p>
          </CardContent>
        </Card>
      </div>
      {/* Sección de diseños recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Diseños Recientes</CardTitle>
          <CardDescription>Últimos diseños trabajados</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">No hay diseños recientes</p>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}