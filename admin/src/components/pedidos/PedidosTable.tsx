"use client";

import { Pedido } from '@/lib/api';';

// Este componente recibe los datos ya cargados
export default function PedidosTable({ pedidos }: { pedidos: Pedido[] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Lista de Pedidos ({pedidos.length})</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{pedido.id}...</td>
              <td className="p-2">{pedido.cliente?.razon_social || 'N/A'}</td>
              <td className="p-2">{pedido.estado}</td>
              <td className="p-2">${pedido.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}