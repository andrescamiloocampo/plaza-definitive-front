'use client';

import { ReactElement, useState, useEffect } from "react";
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
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (dish) {
      setDescription(dish.description ?? "");
      setPrice(dish.price ?? 0);
    }
  }, [dish]);

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
        className="space-y-6 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl p-6 shadow-lg border border-blue-100 transition-all duration-300"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nombre del plato
          </label>
          <input
            type="text"
            value={dish.name}
            disabled
            className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none cursor-not-allowed shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Escribe una descripción del plato..."
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 focus:ring focus:ring-blue-100 outline-none resize-none min-h-[90px] shadow-sm transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Precio ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:border-green-500 focus:ring focus:ring-green-100 outline-none shadow-sm transition-all duration-200"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:shadow-sm transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </DishModalBase>
  );
};
