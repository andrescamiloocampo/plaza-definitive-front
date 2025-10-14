'use client'

import { OrderCardModel } from "./OrderCard.model";
import { OrderStateIcon, OrderStateBadge } from "../../atoms";
import { useState } from "react";

export const OrderCard = ({ order, onAssign, onNotifyReady, onDeliver }: OrderCardModel) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");

  const handleDeliverClick = () => setShowPinModal(true);

  const handleDeliverConfirm = () => {
    if (pin.length === 4) {
      onDeliver({ orderId: order.id, securityPin: pin });
      setShowPinModal(false);
      setPin("");
    }
  };

  const stateColors: Record<string, string> = {
    PENDING: "text-yellow-600 border-yellow-400/40",
    PREPARATION: "text-blue-600 border-blue-400/40",
    DONE: "text-purple-600 border-purple-400/40",
    DELIVERED: "text-green-600 border-green-400/40",
    CANCELED: "text-red-600 border-red-400/40",
  };

  return (
    <>
      <div
        className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${stateColors[order.state] || "border-gray-200"
          }`}
      >
        {/* Encabezado */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">
            Orden #{order.id}
          </h3>
          <div className="flex items-center gap-2">
            <OrderStateIcon state={order.state} />
            <OrderStateBadge state={order.state} />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">
          Creada el {new Date(order.date).toLocaleString("es-CO")}
        </p>

        <hr className="border-gray-200 mb-3" />

        {/* Información básica */}
        <div className="text-sm space-y-1 mb-3">
          <div className="flex justify-between text-gray-700">
            <span>Cliente:</span>
            <span className="font-medium">ID {order.userId}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Restaurante:</span>
            <span className="font-medium">ID {order.restaurantId}</span>
          </div>
          {order.chefId && (
            <div className="flex justify-between text-gray-700">
              <span>Asignada a:</span>
              <span className="font-medium">Chef #{order.chefId}</span>
            </div>
          )}
        </div>

        {/* Lista de platos */}
        {order.dishes && order.dishes.length > 0 && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">
              Platos:
            </h4>
            <div className="space-y-1 text-sm">
              {order.dishes.map((dish, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-gray-600">{dish.name}</span>
                  <span className="font-medium text-gray-800">x{dish.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {order.state === "PENDING" && (
            <button
              onClick={() => onAssign(order.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Asignarme
            </button>
          )}

          {order.state === "PREPARATION" && (
            <button
              onClick={() => onNotifyReady(order.id)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Marcar lista
            </button>
          )}

          {order.state === "DONE" && (
            <button
              onClick={handleDeliverClick}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Entregar
            </button>
          )}
        </div>
      </div>

      {/* Modal de PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              Entregar Orden #{order.id}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Ingresa el PIN de seguridad del cliente:
            </p>
            <input
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest mb-4"
              placeholder="0000"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin("");
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeliverConfirm}
                disabled={pin.length !== 4}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
