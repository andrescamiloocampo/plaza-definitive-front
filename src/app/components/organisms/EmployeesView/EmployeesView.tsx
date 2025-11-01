"use client";

import React, { useState } from "react";
import { Plus, X, Save, Building2 } from "lucide-react";
import { useRestaurantsByOwner,useGetEmployees } from "@/app/helpers/hooks/useRestaurants";
import { AssignRestaurantModal } from "../AssignRestaurantModal/AssignRestaurantModal";
import { CreateEmployeeModal } from "../CreateEmployeeModal/CreateEmployeeModal";
import { useUser } from "../../context/UserContext";
import { useUsers, useCreateEmployee } from "@/app/helpers/hooks/useUsers";
import { toast } from "react-toastify";
import { useAssignEmployee } from "@/app/helpers/hooks/useAssignEmployee";
import { RestaurantEmployeeModel } from "@/app/models";

export const EmployeesView = () => {
  const { user } = useUser();
  const ownerId = user?.jti ? Number(user.jti) : 0;

  const { restaurants } = useRestaurantsByOwner(ownerId);
  const { assignments } = useGetEmployees();
  const {
    users: employees,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsers("EMPLOYEE");
  const { mutate: assignEmployee, isPending: assigning } = useAssignEmployee();

  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  const { mutate: createEmployee, isPending: creating } = useCreateEmployee();

  const handleAssignClick = (employee: any) => {
    const assignment = getEmployeeAssignment(employee.id);
    setSelectedEmployee(employee);
    setSelectedRestaurant(assignment?.restaurantId?.toString() || "");
    setShowModal(true);
  };

  const handleSaveAssignment = () => {
    if (!selectedRestaurant) {
      toast.warning("Por favor selecciona un restaurante");
      return;
    }

    assignEmployee(
      {
        userId: selectedEmployee.id,
        restaurantId: Number(selectedRestaurant),
        active: true,
      },
      {
        onSuccess: () => {
          toast.success(
            `Empleado ${selectedEmployee.name} asignado correctamente`
          );
          setShowModal(false);
          setSelectedEmployee(null);
          setSelectedRestaurant("");          
        },
        onError: (error: any) => {
          toast.error(error.message || "Error al asignar empleado");
        },
      }
    );
  };

  const handleCreateEmployee = async (data: any) => {
    const bussinessId = restaurants?.[0]?.id || 0;

    createEmployee(
      { userData: data, bussinessId },
      {
        onSuccess: () => {
          toast.success("Empleado creado exitosamente 🎉");
          refetch();
          setShowCreateModal(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Error al crear empleado");
        },
      }
    );
  };

  const getEmployeeAssignment = (employeeId: number):RestaurantEmployeeModel | undefined => {
    if (!Array.isArray(assignments)) return undefined;
    return assignments.find((a: any) => a.userId === employeeId && a.active);
  };

  const getRestaurantName = (restaurantId?: string | number) => {
    if (!restaurantId) return "-";
    const id =
      typeof restaurantId === "string" ? Number(restaurantId) : restaurantId;
    const restaurant = restaurants.find((r: any) => r.id === id);
    return restaurant ? restaurant.name : "-";
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Cargando empleados...
      </div>
    );
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Empleados</h1>
              <p className="text-green-100 mt-1">
                Asignar empleados a restaurantes
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 flex items-center px-5 py-2 bg-white text-green-700 font-medium rounded-xl shadow hover:bg-green-50 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            {creating ? "Creando..." : "Crear empleado"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Empleados
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {employees?.length || 0}
                </p>
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
                  {Array.isArray(assignments) ? assignments.filter((a: any) => a.active)?.length : 0}
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
                  {employees?.filter((e) => !getEmployeeAssignment(e.id))?.length || 0}
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <X className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

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
                {employees?.map((employee: any) => {
                  const assignment = getEmployeeAssignment(employee.id);
                  
                  return (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
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
                      {assignment?.restaurantId ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Building2 className="w-3 h-3 mr-1" />
                          {getRestaurantName(assignment.restaurantId)}
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
                          {assignment?.restaurantId ? "Cambiar" : "Asignar"}
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AssignRestaurantModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveAssignment}
        selectedEmployee={selectedEmployee}
        selectedRestaurant={selectedRestaurant}
        setSelectedRestaurant={setSelectedRestaurant}
        restaurants={restaurants}
      />

      <CreateEmployeeModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateEmployee}
      />
    </div>
  );
};