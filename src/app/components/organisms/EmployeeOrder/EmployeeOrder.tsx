'use client'

import { type ReactElement, useState } from "react";
import OrdersHooks from "@/app/helpers/hooks/useEmployeeOrders";
import { DeliverOrderParams } from "@/app/models";
import { RefreshCw, Package } from "lucide-react";
import { OrderCard } from "../OrderCard/OrderCard";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const EmployeeOrder = (): ReactElement => {
  const [page, setPage] = useState(0);
  const [selectedState, setSelectedState] = useState('');  
  const size = 10;

  const { data: orders, isLoading, isError, error, refetch } = OrdersHooks.useOrders({ 
    page, 
    size, 
    state: selectedState,    
  });

  const assignMutation = OrdersHooks.useAssignOrder();
  const notifyMutation = OrdersHooks.useNotifyOrderReady();
  const deliverMutation = OrdersHooks.useDeliverOrder();

  const handleAssignOrder = (orderId: number) => {
    assignMutation.mutate(orderId, {
      onSuccess: () => {
        toast.success('Orden asignada exitosamente ✅');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Error al asignar la orden ❌');
      }
    });
  };

  const handleNotifyReady = (orderId: number) => {
    notifyMutation.mutate(orderId, {
      onSuccess: () => {
        toast.success('Cliente notificado. Orden lista para recoger 📦');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Error al notificar ❌');
      }
    });
  };

  const handleDeliverOrder = ({ orderId, securityPin }: DeliverOrderParams) => {
    deliverMutation.mutate({ orderId, securityPin }, {
      onSuccess: () => {
        toast.success('Orden entregada exitosamente 🚚');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Error al entregar la orden ❌');
      }
    });
  };

  const states = [
    { value: '', label: 'Todas' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'PREPARATION', label: 'En Preparación' },
    { value: 'DONE', label: 'Listas' },
    { value: 'DELIVERED', label: 'Entregadas' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Órdenes</h1>
          <p className="text-gray-600">Administra las órdenes de tu restaurante</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado:
              </label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setPage(0);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors mt-6"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-semibold">Error al cargar las órdenes</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : 'Por favor, intenta nuevamente.'}
            </p>
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No hay órdenes disponibles</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
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

            <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Anterior
              </button>
              
              <span className="text-gray-600 font-medium">
                Página {page + 1}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={orders.length < size}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>      
    </div>
  );
};
