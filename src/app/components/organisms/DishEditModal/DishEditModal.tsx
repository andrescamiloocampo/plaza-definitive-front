'use client';

import { ReactElement, useState } from "react";
import { DishModalBase } from "../DishModalBase/DishModalBase";
import { Dish } from "@/app/models";

interface DishEditModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onSave: (data: Partial<Dish>) => void;
}

export const DishEditModal = ({
  isOpen,
  dish,
  onClose,
  onSave,
}: DishEditModalProps): ReactElement | null => {
  const [description, setDescription] = useState(dish?.description ?? "");
  const [price, setPrice] = useState(dish?.price ?? 0);

  if (!dish) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ description, price });
    onClose();
  };

  return (
    <DishModalBase title="Editar plato ✏️" isOpen={isOpen} onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-md border border-blue-100"
      >        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Nombre del plato
          </label>
          <input
            type="text"
            value={dish.name}
            disabled
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe una descripción del plato"
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none resize-none min-h-[80px]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Precio ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </DishModalBase>
  );
};
