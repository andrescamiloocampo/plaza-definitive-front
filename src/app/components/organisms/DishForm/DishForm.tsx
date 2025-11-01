"use client";

import { ReactElement, useState } from "react";
import { Dish } from "@/app/models";
import { useCategories } from "@/app/helpers/hooks/useCategories";

interface DishFormProps {
  initialData?: Partial<Dish>;
  onSubmit: (data: Partial<Dish>) => void;
  onCancel: () => void;
}

export const DishForm = ({
  initialData = {},
  onSubmit,
  onCancel,
}: DishFormProps): ReactElement => {
  const { categories, isLoading, isError } = useCategories();

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || 0,
    category: initialData.category,
    imageUrl: initialData.imageUrl || "",
    active: initialData.active ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : undefined;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">        
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          {initialData.id ? "Editar plato" : "Crear nuevo plato"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Hamburguesa clásica"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              placeholder="Describe el plato brevemente..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                type="number"
                name="price"
                placeholder="Ej: 25000"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoría
              </label>

              {isLoading ? (
                <p className="text-gray-500 text-sm mt-1">
                  Cargando categorías...
                </p>
              ) : isError ? (
                <p className="text-red-500 text-sm mt-1">
                  Error al cargar las categorías
                </p>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300 focus:outline-none text-gray-700"
                >
                  <option value="">Seleccione una categoría</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL de imagen
            </label>
            <input
              type="text"
              name="imageUrl"
              placeholder="Ej: https://misimagenes.com/plato.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="accent-purple-600"
            />
            <label className="text-sm text-gray-700">Activo</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-medium text-sm shadow-lg shadow-purple-500/30"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
