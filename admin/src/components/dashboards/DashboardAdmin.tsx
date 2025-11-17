"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Package, DollarSign, AlertCircle } from "lucide-react";

type Usuario = {
  id: number;
  nombre_completo: string;
  rol: string;
};

export default function DashboardAdmin({ usuario }: { usuario: Usuario }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal con padding generoso */}
      <div className="container mx-auto px-8 py-8 max-w-7xl">
        {/* Header con más espacio */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Vista general del sistema - Control total
          </p>
        </div>

        {/* KPIs principales con más gap */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">45</div>
              <p className="text-xs text-gray-600 mt-1">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">S/ 45,231</div>
              <p className="text-xs text-gray-600 mt-1">+20.1% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-gray-600 mt-1">3 nuevos esta semana</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-5 w-5 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">234</div>
              <p className="text-xs text-gray-600 mt-1">En inventario</p>
            </CardContent>
          </Card>
        </div>

        {/* Secciones adicionales con más espacio */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl">Pedidos Recientes</CardTitle>
              <CardDescription>Últimos pedidos registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 min-h-[200px] flex items-center justify-center">
                {/* Lista de pedidos */}
                <p className="text-sm text-gray-500">No hay pedidos recientes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="text-xl">Alertas del Sistema</CardTitle>
              <CardDescription>Notificaciones importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 min-h-[200px]">
                <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Stock bajo en telas</p>
                    <p className="text-xs text-gray-600 mt-1">3 productos necesitan reabastecimiento</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}