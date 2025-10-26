'use client'

import { type ReactElement, useState } from "react";
import OrdersHooks from "@/app/helpers/hooks/useEmployeeOrders";
import { DeliverOrderParams } from "@/app/models";
import { RefreshCw, Package } from "lucide-react";
import { OrderCard } from "../OrderCard/OrderCard";
import { Pagination } from "../../molecules";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const EmployeeOrder = (): ReactElement => {
  const [page, setPage] = useState(0);
  const [selectedState, setSelectedState] = useState('');
  const size = 12;

  const { data: orders, isLoading, isError, error } = OrdersHooks.useOrders({
    page,
    size,
    state: selectedState,
  });

  const assignMutation = OrdersHooks.useAssignOrder();
  const notifyMutation = OrdersHooks.useNotifyOrderReady();
  const deliverMutation = OrdersHooks.useDeliverOrder();

  const handleAssignOrder = (orderId: number) => {
    assignMutation.mutate(orderId, {
      onSuccess: () => toast.success('Orden asignada exitosamente'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Error al asignar la orden'),
    });
  };

  const handleNotifyReady = (orderId: number) => {
    notifyMutation.mutate(orderId, {
      onSuccess: () => toast.success('Cliente notificado. Orden lista para recoger'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Error al notificar'),
    });
  };

  const handleDeliverOrder = ({ orderId, securityPin }: DeliverOrderParams) => {
    deliverMutation.mutate({ orderId, securityPin }, {
      onSuccess: () => toast.success('Orden entregada exitosamente'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Error al entregar la orden'),
    });
  };

  const states = [
    { value: '', label: 'Todas' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'PREPARATION', label: 'En preparación' },
    { value: 'DONE', label: 'Listas' },
    { value: 'DELIVERED', label: 'Entregadas' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">        
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Gestión de órdenes
          </h1>
          <p className="text-gray-500">
            Administra las órdenes de tu restaurante con facilidad
          </p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>            
          </div>
        </div>
        
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {isError && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
            <p className="font-semibold text-lg">Error al cargar las órdenes</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : 'Por favor, intenta nuevamente.'}
            </p>
          </div>
        )}
        
        {orders && orders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No hay órdenes disponibles
            </p>
          </div>
        )}
        
        {orders && orders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAssign={handleAssignOrder}
                  onNotifyReady={handleNotifyReady}
                  onDeliver={handleDeliverOrder}
                />
              ))}
            </div>
            
            <Pagination
              page={page}
              hasNext={orders.length === size}
              onNext={() => setPage(page + 1)}
              onPrev={() => setPage(Math.max(0, page - 1))}
            />
          </>
        )}
      </div>
    </div>
  );
};
