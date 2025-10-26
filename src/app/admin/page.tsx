'use client'

import { ReactElement, useState } from "react";
import { Users, Home, ChevronRight, UtensilsCrossed } from "lucide-react";
import { CreateOwnerForm,CreateRestaurantForm } from "../components/organisms";

type View = "home" | "owners" | "restaurants";

export default function AdminPage(): ReactElement {
  const [view, setView] = useState<View>("home");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">      
          
      <div className="max-w-7xl mx-auto px-6 py-30">        
        {view === "home" && (
          <>            
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span className="font-medium text-gray-900">Inicio</span>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">
                Bienvenido al Panel de Administración
              </h2>
              <p className="text-blue-100 text-lg">
                Gestiona todos los aspectos del sistema desde un solo lugar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              
              <div
                onClick={() => setView("owners")}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02]"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Gestión de Propietarios
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Crear y administrar propietarios de negocios
                  </p>
                </div>
              </div>
              
              <div
                onClick={() => setView("restaurants")}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02]"
              >
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UtensilsCrossed className="w-7 h-7 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Gestión de Restaurantes
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Crear y administrar los restaurantes del sistema
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {view === "owners" && (
          <>
            <button
              onClick={() => setView("home")}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Volver al inicio</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                onClick={() => setView("home")}
              >
                Inicio
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="font-medium text-gray-900">
                Gestión de Propietarios
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Gestión de Propietarios</h2>
                    <p className="text-white/90 text-sm">
                      Crear y administrar propietarios del sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <CreateOwnerForm />
              </div>
            </div>
          </>
        )}
        
        {view === "restaurants" && (
          <>
            <button
              onClick={() => setView("home")}
              className="flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 mb-6 font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Volver al inicio</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <span
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                onClick={() => setView("home")}
              >
                Inicio
              </span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="font-medium text-gray-900">
                Gestión de Restaurantes
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <UtensilsCrossed className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Gestión de Restaurantes</h2>
                    <p className="text-white/90 text-sm">
                      Crear y administrar restaurantes del sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <CreateRestaurantForm />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
