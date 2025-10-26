'use client'

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const PinModal = ({
  isOpen,
  orderId,
  onClose,
  onConfirm,
  title = "Entregar Orden",
  description = "Ingresa el PIN de seguridad del cliente",
}: PinModalModel) => {
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.length === 4) {
      onConfirm(pin);
      setPin("");
    }
  };

  const handleClose = () => {
    onClose();
    setPin("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl animate-scaleIn relative">
          {/* Botón de cerrar */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icono */}
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 rounded-full p-3">
              <AlertTriangle className="text-yellow-500 w-8 h-8" />
            </div>
          </div>

          {/* Título */}
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-center text-gray-600 text-sm mb-5">
            Orden #{orderId}
          </p>

          {/* Descripción */}
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            {description}
          </p>

          {/* Campo PIN */}
          <input
            type="text"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 rounded-xl text-center text-2xl font-semibold tracking-[0.5em] mb-6 outline-none transition-all"
            placeholder="••••"
          />

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={pin.length !== 4}
              className={`flex-1 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium shadow-md transition-all`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </>
  );
};
