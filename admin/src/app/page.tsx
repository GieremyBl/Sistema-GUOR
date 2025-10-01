import DashboardLayout from "@/components/DashboardLayout";
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";

export default function HomePage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Resumen general de ventas y pedidos - Año 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-2 xl:col-span-1 2xl:col-span-2">
            <AppBarChart />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <CardList title="Latest Transactions" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <AppPieChart />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <TodoList />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 lg:col-span-2 xl:col-span-1 2xl:col-span-2">
            <AppAreaChart />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <CardList title="Popular Products" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}