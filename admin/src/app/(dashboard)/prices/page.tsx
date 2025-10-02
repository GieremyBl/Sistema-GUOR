"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  CheckCircle, 
  Package, 
  DollarSign, 
  Search,
  Plus,
  Calendar,
  Building2,
  Mail,
  Phone,
  MoreVertical,
  Shirt
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NuevaCotizacionForm from "@/components/NewPricesForm";

interface Cotizacion {
  id: string;
  numero: string;
  fecha: string;
  estado: "enviada" | "borrador" | "aprobada" | "todas";
  empresa: string;
  email: string;
  telefono: string;
  modelos: number;
  prendas: number;
  monto: number;
}

const cotizaciones: Cotizacion[] = [
  {
    id: "1",
    numero: "COT-2025-001",
    fecha: "14 de enero de 2025",
    estado: "enviada",
    empresa: "Empresa Textil S.A.",
    email: "contacto@empresatextil.com",
    telefono: "+51 999 888 777",
    modelos: 2,
    prendas: 900,
    monto: 16250.00
  },
  {
    id: "2",
    numero: "COT-2025-002",
    fecha: "15 de enero de 2025",
    estado: "aprobada",
    empresa: "Confecciones Perú SAC",
    email: "ventas@confeccionesperu.com",
    telefono: "+51 999 777 666",
    modelos: 3,
    prendas: 1200,
    monto: 22500.00
  }
];

const estadisticas = [
  {
    titulo: "Total Cotizaciones",
    valor: "2",
    icon: FileText,
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    titulo: "Aprobadas",
    valor: "1",
    icon: CheckCircle,
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    titulo: "Total Prendas",
    valor: "1,900",
    icon: Package,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    titulo: "Monto Total",
    valor: "S/ 51,250",
    icon: DollarSign,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  }
];

type TabFilter = "todas" | "borradores" | "enviadas" | "aprobadas";

export default function CotizacionesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabFilter>("todas");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { key: "todas" as TabFilter, label: "Todas", count: 2 },
    { key: "borradores" as TabFilter, label: "Borradores", count: 0 },
    { key: "enviadas" as TabFilter, label: "Enviadas", count: 1 },
    { key: "aprobadas" as TabFilter, label: "Aprobadas", count: 1 }
  ];

  const getEstadoBadge = (estado: string) => {
    const badges = {
      enviada: "bg-blue-100 text-blue-700",
      borrador: "bg-gray-100 text-gray-700",
      aprobada: "bg-green-100 text-green-700"
    };
    return badges[estado as keyof typeof badges] || badges.borrador;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Cotizaciones
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Crea y administra cotizaciones para pedidos de prendas
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cotización
        </Button>
      </div>

      {/* Modal de Nueva Cotización */}
      <NuevaCotizacionForm 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {estadisticas.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {stat.titulo}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.valor}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Búsqueda y Filtros */}
      <Card className="border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por número, cliente o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.key
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label} ({tab.count})
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cotizaciones */}
      <div className="space-y-4">
        {cotizaciones.map((cotizacion) => (
          <Card key={cotizacion.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {cotizacion.numero}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(cotizacion.estado)}`}>
                    {cotizacion.estado.charAt(0).toUpperCase() + cotizacion.estado.slice(1)}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem>Duplicar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>{cotizacion.fecha}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 py-4 border-t border-b border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {cotizacion.empresa}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {cotizacion.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {cotizacion.telefono}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {cotizacion.modelos} modelos • {cotizacion.prendas} prendas
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Monto</p>
                    <p className="text-xl font-bold text-gray-900">
                      S/ {cotizacion.monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}