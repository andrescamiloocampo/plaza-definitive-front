'use client';

import React, { useState } from 'react';
import { Plus, X, Save, Building2 } from 'lucide-react';
import { useRestaurantsByOwner } from '@/app/helpers/hooks/useRestaurants';
import { useUser } from '../../context/UserContext';
import { useUsers } from '@/app/helpers/hooks/useUsers';

export const EmployeesView = () => {
  const { user } = useUser();
  const ownerId = user?.jti ? Number(user.jti) : 0;
  const { restaurants } = useRestaurantsByOwner(ownerId);

  const { users: employees, isLoading, isError, error } = useUsers("EMPLOYEE");

  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const handleAssignClick = (employee: any) => {
    setSelectedEmployee(employee);
    setSelectedRestaurant(employee.restaurantId || "");
    setShowModal(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedRestaurant) {
      alert("Por favor selecciona un restaurante");
      return;
    }
    
    console.log(`Empleado ${selectedEmployee.name} asignado a restaurante ${selectedRestaurant}`);

    setShowModal(false);
    setSelectedEmployee(null);
    setSelectedRestaurant("");
  };

  const handleRemoveAssignment = (employeeId: string) => {
    console.log(`Eliminando asignación del empleado ${employeeId}`);    
  };

  const getRestaurantName = (restaurantId?: string | number) => {
    if (restaurantId === undefined || restaurantId === null || restaurantId === "") {
      return "-";
    }
    const id = typeof restaurantId === "string" ? Number(restaurantId) : restaurantId;
    const restaurant = restaurants.find((r: any) => r.id === id);
    return restaurant ? restaurant.name : "-";
  };
  
  if (isLoading) {
    return <div className="text-center py-10 text-gray-600">Cargando empleados...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error al cargar empleados: {error?.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Empleados</h1>
              <p className="text-green-100 mt-1">Asignar empleados a restaurantes</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Empleados</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{employees?.length || 0}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Plus className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Asignados</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {employees?.filter((e) => e.restaurantId)?.length || 0}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <Save className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Sin Asignar</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {employees?.filter((e) => !e.restaurantId)?.length || 0}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <X className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de empleados */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Restaurante
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees?.map((employee: any) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {employee.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {employee.name} {employee.lastname}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.restaurantId ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Building2 className="w-3 h-3 mr-1" />
                          {getRestaurantName(employee.restaurantId)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Sin asignar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleAssignClick(employee)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                        >
                          {employee.restaurantId ? "Cambiar" : "Asignar"}
                        </button>
                        {employee.restaurantId && (
                          <button
                            onClick={() => handleRemoveAssignment(employee.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Asignar Restaurante</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Empleado
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedEmployee?.name?.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {selectedEmployee?.name} {selectedEmployee?.lastname}
                    </p>
                    <p className="text-sm text-gray-600">{selectedEmployee?.email}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Seleccionar Restaurante
                </label>
                <select
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Selecciona un restaurante --</option>
                  {restaurants.map((restaurant: any) => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name} - {restaurant.address}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAssignment}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
