'use client';

import { useState } from "react";
import { toast } from "react-toastify";
import { UtensilsCrossed } from "lucide-react";
import { useCreateRestaurant } from "@/app/helpers/hooks/useRestaurants";
import { RestaurantRequestModel } from "@/app/models";
import { useUsers } from "@/app/helpers/hooks/useUsers";

export const CreateRestaurantForm = () => {
  const [form, setForm] = useState<RestaurantRequestModel>({
    name: "",
    address: "",
    phone: "",
    urlLogo: "",
    nit: "",
    ownerId: 0,
  });

  const {users:owners,isLoading,error} = useUsers('OWNER');
  const { createRestaurant, isPending } = useCreateRestaurant();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "ownerId" ? parseInt(value as string, 10) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createRestaurant(form);
      toast.success("Restaurante creado correctamente");
      setForm({
        name: "",
        address: "",
        phone: "",
        urlLogo: "",
        nit: "",
        ownerId: 0,
      });
    } catch (error: any) {
      toast.error(error.message || "Error al crear el restaurante");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">           
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Restaurante <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Ej: La Parrilla de Oro"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            NIT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nit"
            placeholder="900123456-7"
            value={form.nit}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            placeholder="Cra 10 #20-30, Bogotá"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+57 310 987 6543"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL del Logo <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="urlLogo"
          placeholder="https://mi-restaurante.com/logo.png"
          value={form.urlLogo}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
        />
      </div>
      
     <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Propietario <span className="text-red-500">*</span>
  </label>

  {isLoading ? (
    <p className="text-gray-500">Cargando propietarios...</p>
  ) : error ? (
    <p className="text-red-500">Error al cargar los propietarios</p>
  ) : (
    <select
      name="ownerId"
      value={form.ownerId || ""}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
    >
      <option value="">Seleccione un propietario</option>
      {owners?.map((owner) => (
        <option key={owner.id} value={owner.id}>
          {owner.name} {owner.lastname} - {owner.email}
        </option>
      ))}
    </select>
  )}
</div>
    
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start space-x-3">
        <UtensilsCrossed className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-purple-900 font-medium">
            Registro de Restaurante
          </p>
          <p className="text-sm text-purple-700 mt-1">
            Al crear el restaurante, podrás gestionarlo desde el panel del propietario asignado.
          </p>
        </div>
      </div>
    
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                  5.291A7.962 7.962 0 014 12H0c0 
                  3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creando...
            </>
          ) : (
            <>
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Crear Restaurante
            </>
          )}
        </button>
      </div>
    </form>
  );
};
