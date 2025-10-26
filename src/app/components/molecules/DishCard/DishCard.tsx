'use client';

import { Edit, Power } from "lucide-react";
import { DishCardProps } from "./DishCard.model";

export const DishCard = ({ dish, onEdit, onToggleActive }: DishCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      {dish.imageUrl && (
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">{dish.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              dish.active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {dish.active ? "Activo" : "Inactivo"}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{dish.description}</p>
        <p className="text-xl font-bold text-green-600 mb-4">
          ${dish.price.toLocaleString("es-CO")}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(dish.id)}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center text-sm"
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </button>
          <button
            onClick={() => onToggleActive(dish.id)}
            className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center text-sm"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
