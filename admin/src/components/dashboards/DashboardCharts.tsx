"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface VentaMensual {
  mes: string;
  ventas: number;
}

interface EstadoPedido {
  name: string;
  value: number;
}

const PIE_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];
const MONTHS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export function DashboardCharts() {
  const [salesData, setSalesData] = useState<VentaMensual[]>([]);
  const [ordersData, setOrdersData] = useState<EstadoPedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    setLoading(true);
    try {
      // 1. OBTENER DATOS DE VENTAS Y ESTADO (6 MESES)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      // Traer todos los pedidos de los últimos 6 meses para agregación
      const { data: pedidosData, error } = await supabase
        .from('pedidos')
        .select('total, created_at, estado')
        .gte('created_at', sixMonthsAgo.toISOString());

      if (error) throw error;
      if (!pedidosData) return;

      // ----------------------------------------------------
      // 2. PROCESAMIENTO DE VENTAS MENSUALES (JS AGGREGATION)
      // ----------------------------------------------------
      const monthlySalesMap = new Map<string, number>();

      pedidosData.forEach(pedido => {
        if (pedido.total && pedido.created_at) {
          const date = new Date(pedido.created_at);
          const monthIndex = date.getMonth();
          const year = date.getFullYear();
          const key = `${MONTHS_ES[monthIndex]}-${year}`;

          const currentTotal = monthlySalesMap.get(key) || 0;
          monthlySalesMap.set(key, currentTotal + pedido.total);
        }
      });

      // Formatear los datos para Recharts (asegurando el orden de los meses)
      const sortedSalesData: VentaMensual[] = Array.from(monthlySalesMap).map(([key, ventas]) => ({
        mes: key.split('-')[0], // Solo mostramos el nombre del mes
        ventas,
      }));
      setSalesData(sortedSalesData);

      // ----------------------------------------------------
      // 3. PROCESAMIENTO DE PEDIDOS POR ESTADO (JS AGGREGATION)
      // ----------------------------------------------------
      const statusCountsMap = new Map<string, number>();

      pedidosData.forEach(pedido => {
        if (pedido.estado) {
          const statusName = pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1).replace('_', ' ');
          const currentCount = statusCountsMap.get(statusName) || 0;
          statusCountsMap.set(statusName, currentCount + 1);
        }
      });

      const formattedOrdersData: EstadoPedido[] = Array.from(statusCountsMap).map(([name, value]) => ({
        name,
        value,
      }));
      setOrdersData(formattedOrdersData);

    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Muestra un estado de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <div className="animate-pulse text-gray-500">Cargando datos de gráficas...</div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* 📊 Gráfica de Ventas Mensuales (Barra) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ventas Mensuales</h2>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="mes" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                formatter={(value) => [`S/ ${value.toLocaleString()}`, 'Ventas']}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Bar dataKey="ventas" name="Ventas" fill="#4C51BF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🥧 Gráfica de Distribución de Pedidos (Pie) */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Pedidos por Estado</h2>
          <FileText className="w-5 h-5 text-blue-500" />
        </div>
        <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
          <ResponsiveContainer width="95%" height="100%">
            <PieChart>
              <Pie
                data={ordersData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {ordersData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} pedidos`, name]}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}