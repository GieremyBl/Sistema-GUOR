// app/(dashboard)/dashboard/page.tsx
"use client";

import { DollarSign, Package, ShoppingBag, Users, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Datos de ejemplo
const salesData = [
  { month: "Ene", prendas: 12000 },
  { month: "Feb", prendas: 15000 },
  { month: "Mar", prendas: 19000 },
  { month: "Abr", prendas: 14000 },
  { month: "May", prendas: 21000 },
  { month: "Jun", prendas: 18000 },
  { month: "Jul", prendas: 23000 },
  { month: "Ago", prendas: 26000 },
  { month: "Sep", prendas: 22000 },
  { month: "Oct", prendas: 27000 },
  { month: "Nov", prendas: 29000 },
  { month: "Dic", prendas: 32000 }
];

const quarterlyData = [
  { quarter: "Q1 2025", ganancia: 680000 },
  { quarter: "Q2 2025", ganancia: 820000 },
  { quarter: "Q3 2025", ganancia: 1050000 },
  { quarter: "Q4 2025", ganancia: 1348000 }
];

const distributionData = [
  { name: "Polos", value: 35, color: "#5B8FF9" },
  { name: "Camisas", value: 25, color: "#A569FF" },
  { name: "Pantalones", value: 20, color: "#FF6B9D" },
  { name: "Chompas", value: 12, color: "#FFA940" },
  { name: "Otros", value: 8, color: "#5CD8A7" }
];

const topModels = [
  { name: "Polo Básico Cuello Redondo", prendas: 78500, pedidos: 145, color: "#5B8FF9" },
  { name: "Camisa Manga Larga", prendas: 65400, pedidos: 132, color: "#A569FF" },
  { name: "Pantalón Drill", prendas: 52800, pedidos: 98, color: "#FF6B9D" },
  { name: "Chompa con Capucha", prendas: 41200, pedidos: 87, color: "#FFA940" },
  { name: "Polo Deportivo", prendas: 38900, pedidos: 76, color: "#5CD8A7" }
];

const topClients = [
  { rank: 1, name: "Corporación Textil del Perú S.A.", pedidos: 28, prendas: 34500, total: 517500, growth: 12.5, icon: "🏆" },
  { rank: 2, name: "Grupo Empresarial Moda Plus", pedidos: 24, prendas: 29800, total: 447000, growth: 8.3, icon: "🥈" },
  { rank: 3, name: "Inversiones Textiles Unidos", pedidos: 21, prendas: 25600, total: 384000, growth: -2.1, icon: "🏆" },
  { rank: 4, name: "Comercial Fashion Group", pedidos: 19, prendas: 22400, total: 336000, growth: 15.8, icon: "" },
  { rank: 5, name: "Distribuidora Textil Nacional", pedidos: 17, prendas: 19200, total: 288000, growth: 5.6, icon: "" }
];

export default function DashboardPage() {
  return (
    <div>
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
          <p className="text-gray-500">Resumen general de ventas y pedidos - Año 2025</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          Año 2025
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Ganancia Anual */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +18.5%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Ganancia Anual 2025</p>
          <p className="text-3xl font-bold text-gray-800 mb-1">S/ 3.898.500</p>
          <p className="text-xs text-gray-500">Prom. mensual: S/ 324.875</p>
        </div>

        {/* Total Prendas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +22.3%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Total Prendas Vendidas</p>
          <p className="text-3xl font-bold text-gray-800 mb-1">259.900</p>
          <p className="text-xs text-gray-500">Promedio: 21.658 / mes</p>
        </div>

        {/* Modelo Más Vendido */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded">
              Top
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Modelo Más Vendido</p>
          <p className="text-xl font-bold text-gray-800 mb-1">Polo Básico</p>
          <p className="text-xs text-gray-500">78.500 prendas • 145 pedidos</p>
        </div>

        {/* Cliente Top */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">Cliente Top</p>
          <p className="text-xl font-bold text-gray-800 mb-1">Corp. Textil Perú</p>
          <p className="text-xs text-gray-500">S/ 517.500 • 28 pedidos</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ventas Mensuales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Ventas Mensuales - 2025</h3>
            <p className="text-sm text-gray-500">Cantidad de prendas vendidas por mes</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="prendas" stroke="#5B8FF9" strokeWidth={2} dot={{ fill: "#5B8FF9", r: 4 }} name="Prendas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Ganancias Trimestrales */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Ganancias Trimestrales - 2025</h3>
            <p className="text-sm text-gray-500">Ingresos por trimestre</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ganancia" fill="#5CD8A7" name="Ganancia (S/)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Distribución por Tipo */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Distribución por Tipo</h3>
            <p className="text-sm text-gray-500">Modelos más solicitados</p>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Modelos Más Vendidos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Modelos Más Vendidos</h3>
            <p className="text-sm text-gray-500">Top 5 modelos por cantidad de prendas</p>
          </div>
          <div className="space-y-4">
            {topModels.map((model, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-medium w-6">{index + 1}</span>
                    <span className="text-sm font-medium text-gray-800">{model.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{model.prendas.toLocaleString()} prendas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(model.prendas / topModels[0].prendas) * 100}%`,
                        backgroundColor: model.color
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{model.pedidos} pedidos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clientes Top */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Clientes Top</h3>
          <p className="text-sm text-gray-500">Principales clientes por volumen de ventas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ranking</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Pedidos</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prendas</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Monto Total</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Crecimiento</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client) => (
                <tr key={client.rank} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <span className="text-2xl">{client.icon || client.rank}</span>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-800">{client.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{client.pedidos}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{client.prendas.toLocaleString()}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-800">S/ {client.total.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-1 text-sm font-medium ${client.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {client.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {client.growth >= 0 ? '+' : ''}{client.growth}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}