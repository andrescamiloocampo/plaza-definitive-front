"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { UserPlus } from "lucide-react";
import { useCreateOwner } from "@/app/helpers/hooks/useCreateOwner";
import { UserRequestDto } from "@/app/datasources/users/userService";

export const CreateOwnerForm = () => {
  const [form, setForm] = useState<UserRequestDto>({
    name: "",
    lastname: "",
    identityDocument: 0,
    phone: "",
    birthdate: "",
    email: "",
  });

  const mutation = useCreateOwner();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "identityDocument" ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form, {
      onSuccess: () => {
        toast.success("Propietario creado correctamente");
        setForm({
          name: "",
          lastname: "",
          identityDocument: 0,
          phone: "",
          birthdate: "",
          email: "",
        });
      },
      onError: (error) => {
        toast.error(error.message || "Error al crear propietario");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Juan"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="lastname"
            placeholder="Pérez"
            value={form.lastname}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Documento de Identidad <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="identityDocument"
          placeholder="1234567890"
          value={form.identityDocument || ""}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+57 300 123 4567"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="birthdate"
            value={form.birthdate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <UserPlus className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-900 font-medium">Contraseña por defecto</p>
          <p className="text-sm text-blue-700 mt-1">
            Se asignará la contraseña <span className="font-mono font-bold">S3gur0_P@ss2025</span>
          </p>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {mutation.isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Propietario
            </>
          )}
        </button>
      </div>
    </form>
  );
};