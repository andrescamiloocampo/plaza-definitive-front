"use client";

import type { ConflictModalProps } from "./ConflictModal.model";

export const ConflictModal = ({
  currentRestaurant,
  newRestaurant,
  onCancel,
  onConfirm,
}: ConflictModalProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Botón X para cerrar */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Ícono de advertencia */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              ¿Cambiar de restaurante?
            </h3>
          </div>
        </div>
        
        <div className="text-sm leading-relaxed mb-6">
          <p className="text-gray-600 mb-3">
            Ya tienes productos de{" "}
            <span className="font-semibold text-gray-900">
              {currentRestaurant ?? "otro restaurante"}
            </span>{" "}
            en tu carrito. Solo puedes ordenar de un restaurante a la vez.
          </p>
          <p className="text-gray-600">
            ¿Deseas vaciar tu carrito actual y agregar items de{" "}
            <span className="font-semibold text-gray-900">{newRestaurant}</span>?
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium text-sm shadow-lg shadow-purple-500/30"
          >
            Vaciar y agregar
          </button>
        </div>
      </div>
    </div>
  );
};