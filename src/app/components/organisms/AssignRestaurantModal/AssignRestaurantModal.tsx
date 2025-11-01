'use client';

import React from 'react';
import { X, Building2 } from 'lucide-react';

interface AssignRestaurantModalProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedEmployee: any;
  selectedRestaurant: string;
  setSelectedRestaurant: (value: string) => void;
  restaurants: any[];
}

export const AssignRestaurantModal: React.FC<AssignRestaurantModalProps> = ({
  show,
  onClose,
  onSave,
  selectedEmployee,
  selectedRestaurant,
  setSelectedRestaurant,
  restaurants,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-start gap-3 mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Asignar restaurante
            </h3>
            <p className="text-sm text-gray-500">
              {selectedEmployee?.name} {selectedEmployee?.lastname}
            </p>
          </div>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Selecciona un restaurante
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">-- Selecciona un restaurante --</option>
              {restaurants.map((restaurant: any) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.address}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {selectedEmployee?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {selectedEmployee?.email}
              </p>
              <p className="text-xs text-gray-500">
                {selectedEmployee?.phone || 'Sin teléfono'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium text-sm shadow-lg shadow-purple-500/30"
          >
            Guardar asignación
          </button>
        </div>
      </div>
    </div>
  );
};
