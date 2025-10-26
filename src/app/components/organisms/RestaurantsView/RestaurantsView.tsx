'use client';

import { ReactElement } from "react";
import { useRestaurantsByOwner } from "@/app/helpers/hooks/useRestaurants";
import { RestaurantResponseModel } from "@/app/models";
import { Loader2, AlertCircle } from "lucide-react";
import { useUser } from "../../context/UserContext";

interface Props {
  onSelect: (restaurant: RestaurantResponseModel) => void;
}

export const RestaurantsView = ({ onSelect }: Props): ReactElement => {

  const { user } = useUser();
  const ownerId = user ? +user.jti : 0;
  const { restaurants, isLoading, isError, error } = useRestaurantsByOwner(ownerId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Cargando restaurantes...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-600">
        <AlertCircle className="w-6 h-6 mb-2" />
        <p>{(error as Error).message}</p>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No tienes restaurantes registrados aún.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          onClick={() => onSelect(restaurant)}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer hover:scale-[1.02]"
        >          
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          
          <div className="p-6">
            <div className="flex justify-center mb-4">
              {restaurant.urlLogo ? (
                <img
                  src={restaurant.urlLogo}
                  alt={restaurant.name}
                  className="w-16 h-16 object-cover rounded-full border"
                />
              ) : (
                <div className="text-4xl">🏠</div>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1 text-center">
              📍 {restaurant.address}
            </p>
            <p className="text-sm text-gray-600 mb-1 text-center">
              📞 {restaurant.phone}
            </p>
            <p className="text-sm text-gray-600 text-center">
              NIT: {restaurant.nit}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
