'use client';

import { ReactElement, useState } from "react";
import { Store, ChevronRight, Users } from "lucide-react";
import { RestaurantsView,DishesView,EmployeesView } from "../components/organisms";

const modules = [
  {
    id: "restaurants",
    title: "Mis Restaurantes",
    description: "Ver y gestionar tus restaurantes",
    icon: Store,
    color: "from-blue-500 to-blue-600",
    view: "restaurants",
  },
  {
    id: "employees",
    title: "Empleados",
    description: "Asignar empleados a restaurantes",
    icon: Users,
    color: "from-green-500 to-green-600",
    view: "employees",
  }  
];

export default function OwnerPage():ReactElement {  
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);

  const renderContent = () => {
    switch (selectedView) {
      case "restaurants":
        return (
          <RestaurantsView            
            onSelect={(r) => {
              setSelectedRestaurant(r);
              setSelectedView("dishes");
            }}
          />
        );
      case "dishes":
        return <DishesView selectedRestaurant={selectedRestaurant} />;
      case "employees":
        return <EmployeesView/>;      
    }
  };

  const currentModule = modules.find((m) => m.view === selectedView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-20">      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedView ? (
          <>            
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Bienvenido al Panel de Propietario</h2>
              <p className="text-green-100 text-lg">Administra tus restaurantes, platos y empleados</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    onClick={() => setSelectedView(module.view)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02]"
                  >
                    <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                      <p className="text-gray-600 text-sm">{module.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>            
            <button
              onClick={() => {
                setSelectedView(null);
                setSelectedRestaurant(null);
              }}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 mb-6 font-medium"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span>Volver al inicio</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${currentModule?.color} p-6 text-white`}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    {currentModule?.icon && <currentModule.icon className="w-7 h-7" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{currentModule?.title}</h2>
                    <p className="text-white/90 text-sm">{currentModule?.description}</p>
                  </div>
                </div>
              </div>
              <div className="p-8">{renderContent()}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
