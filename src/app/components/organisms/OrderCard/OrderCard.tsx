'use client'

import { OrderCardModel } from "./OrderCard.model";
import { OrderStateIcon, OrderStateBadge } from "../../atoms";
import { OrderActionButton } from "../../atoms";
import { PinModal } from "../../molecules";
import { useState } from "react";

export const OrderCard = ({ order, onAssign, onNotifyReady, onDeliver }: OrderCardModel) => {
  const [showPinModal, setShowPinModal] = useState(false);  

  const handleDeliverClick = () => setShowPinModal(true);

  const stateColors: Record<string, string> = {
    PENDING: "border-l-yellow-500 bg-yellow-50/50",
    PREPARATION: "border-l-blue-500 bg-blue-50/50",
    DONE: "border-l-purple-500 bg-purple-50/50",
    DELIVERED: "border-l-green-500 bg-green-50/50",
    CANCELED: "border-l-red-500 bg-red-50/50",
  };

  return (
    <>
      <div
        className={`bg-white border-l-4 border-r border-t border-b border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
          stateColors[order.state] || "border-l-gray-300 bg-white"
        }`}
      >        
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-xl text-gray-900">
              Orden #{order.id}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(order.date).toLocaleString("es-CO", {
                dateStyle: "short",
                timeStyle: "short"
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStateIcon state={order.state} />
            <OrderStateBadge state={order.state} />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Cliente
            </span>
            <span className="font-semibold text-gray-900">ID {order.userId}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Restaurante
            </span>
            <span className="font-semibold text-gray-900">ID {order.restaurantId}</span>
          </div>
          {order.chefId && (
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Asignada a
              </span>
              <span className="font-semibold text-gray-900">Chef #{order.chefId}</span>
            </div>
          )}
        </div>
        
        {order.dishes && order.dishes.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Platos ({order.dishes.length})
            </h4>
            <div className="space-y-2">
              {order.dishes.map((dish, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <span className="text-sm text-gray-700 font-medium">{dish.name}</span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                    ×{dish.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      
        <div className="mt-5 flex gap-3">
          {order.state === "PENDING" && (
            <OrderActionButton
              onClick={() => onAssign(order.id)}
              variant="blue"
              icon="🙋‍♂️"
            >
              Asignarme
            </OrderActionButton>
          )}

          {order.state === "PREPARATION" && (
            <OrderActionButton
              onClick={() => onNotifyReady(order.id)}
              variant="green"
              icon="✓"
            >
              Marcar lista
            </OrderActionButton>
          )}

          {order.state === "DONE" && (
            <OrderActionButton
              onClick={handleDeliverClick}
              variant="purple"
              icon="📦"
            >
              Entregar
            </OrderActionButton>
          )}
        </div>      
      </div>

      <PinModal
        isOpen={showPinModal}
        orderId={order.id}
        onClose={() => setShowPinModal(false)}
        onConfirm={(pin) => onDeliver({ orderId: order.id, securityPin: pin })}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};