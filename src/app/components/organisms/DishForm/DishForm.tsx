'use client';

import { ReactElement, useState } from 'react';
import { Dish } from '@/app/models';

interface DishFormProps {
  initialData?: Partial<Dish>;
  onSubmit: (data: Partial<Dish>) => void;
  onCancel: () => void;
}

export const DishForm = ({ initialData = {}, onSubmit, onCancel }: DishFormProps): ReactElement => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || 0,
    category: initialData.category || '',
    imageUrl: initialData.imageUrl || '',
    active: initialData.active ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Campos */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-violet-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-violet-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-violet-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-violet-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL de imagen</label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-violet-300"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
        <label className="text-sm text-gray-700">Activo</label>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};
