"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import {
  Loader2,
  Clock,
  XCircle,
  PackageOpen,
  Package,
  Truck,
  PackageCheck,
} from "lucide-react";
import { orderLogsService, OrderLog } from "@/app/datasources/orders/traceabilityService";
import { orderService } from "@/app/datasources/orders/orderService";
import { OrderStatus } from "../../molecules";
import { CancelOrderModal } from "../CancelOrderModal/CancelOrderModal";

export const OrderHistory = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = session?.accessToken as string | undefined;
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await orderLogsService.getMyOrderLogs(token);
        setOrders(data);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
        toast.error("No se pudieron cargar tus órdenes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  const lastActiveOrder = useMemo(() => {
    const activeOrders = orders.filter(
      (order) => 
        order.currentState !== "CANCELED" && 
        order.currentState !== "DELIVERED"
    );
    
    if (activeOrders.length === 0) return null;
    
    return activeOrders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "ALL") return orders;
    return orders.filter((o) => o.currentState === filter);
  }, [orders, filter]);

  const canCancelOrder = (state: string) => {
    return state === "PENDING" || state === "PREPARATION";
  };

  const handleCancelClick = (orderId: number) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!orderToCancel) return;

    const token = session?.accessToken as string;
    if (!token) {
      toast.error("No estás autenticado");
      return;
    }

    setCancellingOrderId(orderToCancel);
    setShowCancelModal(false);

    try {
      await orderService.cancelOrder(token);
      toast.success("Orden cancelada exitosamente");
            
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.orderId === orderToCancel
            ? { 
                ...order, 
                currentState: "CANCELED",
                statusChanges: [
                  ...order.statusChanges,
                  {
                    previousState: order.currentState,
                    newState: "CANCELED",
                    changedAt: new Date().toISOString()
                  }
                ]
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error al cancelar la orden:", error);
      const errorMessage = error instanceof Error ? error.message : "No se pudo cancelar la orden";
      toast.error(errorMessage);
    } finally {
      setCancellingOrderId(null);
      setOrderToCancel(null);
    }
  };

  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setOrderToCancel(null);
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case "PENDING":
        return <Clock className="text-yellow-500" size={20} />;
      case "PREPARATION":
        return <Package className="text-blue-500" size={20} />;
      case "DONE":
        return <PackageCheck className="text-purple-500" size={20} />;
      case "DELIVERED":
        return <Truck className="text-green-500" size={20} />;
      case "CANCELED":
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <PackageOpen className="text-gray-400" size={20} />;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de órdenes</h1>
      
      {lastActiveOrder && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
          <div className="flex justify-between items-start mb-3">
            <p className="text-sm text-gray-600">
              Tu orden más reciente: <span className="font-semibold">#{lastActiveOrder.orderId}</span>
            </p>
            {canCancelOrder(lastActiveOrder.currentState) && (
              <button
                onClick={() => handleCancelClick(lastActiveOrder.orderId)}
                disabled={cancellingOrderId === lastActiveOrder.orderId}
                className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancellingOrderId === lastActiveOrder.orderId ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Cancelar
                  </>
                )}
              </button>
            )}
          </div>
          <OrderStatus currentState={lastActiveOrder.currentState} />
        </div>
      )}
      
      <div className="flex gap-3 mb-6 flex-wrap">
        {["ALL", "PENDING", "PREPARATION", "DONE", "DELIVERED", "CANCELED"].map((state) => (
          <button
            key={state}
            onClick={() => setFilter(state)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === state
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {state === "ALL" ? "Todas" : state}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center">
          No tienes órdenes en este estado.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-lg">
                  Orden #{order.orderId}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getStateIcon(order.currentState)}
                    <span className="font-medium text-sm">
                      {order.currentState}
                    </span>
                  </div>
                  {canCancelOrder(order.currentState) && (
                    <button
                      onClick={() => handleCancelClick(order.orderId)}
                      disabled={cancellingOrderId === order.orderId}
                      className="p-1 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                      title="Cancelar orden"
                    >
                      {cancellingOrderId === order.orderId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Creada el {new Date(order.createdAt).toLocaleString()}
              </p>

              <div className="mt-3 border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-500 mb-1 font-semibold">
                  Cambios de estado:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {order.statusChanges.map((change, i) => (
                    <li key={i} className="flex justify-between text-xs">
                      <span>
                        {change.previousState
                          ? `${change.previousState} → ${change.newState}`
                          : change.newState}
                      </span>
                      <span className="text-gray-400">
                        {new Date(change.changedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={handleCancelModalClose}
        onConfirm={handleCancelConfirm}
        orderId={orderToCancel || 0}
      />
    </div>
  );
};