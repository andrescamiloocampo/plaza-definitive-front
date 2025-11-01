'use client';

import { useQuery,useMutation } from "@tanstack/react-query";

import { restaurantService } from "@/app/datasources";
import { RestaurantEmployeeModel, RestaurantRequestModel, RestaurantResponseModel } from "@/app/models";

export const useRestaurantsByOwner = (ownerId: number) => {
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
  } = useQuery<RestaurantResponseModel[]>({
    queryKey: ["restaurants", ownerId],
    queryFn: () => restaurantService.getRestaurantsByOwner(ownerId),
    enabled: !!ownerId,
    retry: 1,
  });

  return {
    restaurants: restaurants || [],
    isLoading,
    isError,
    error,
  };
};

export const useCreateRestaurant = () => {
  const {
    mutateAsync: createRestaurant,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (restaurant: RestaurantRequestModel) =>
      restaurantService.createRestaurant(restaurant),
  });

  return {
    createRestaurant,
    isPending,
    isError,
    error,
    isSuccess,
  };
};

export const useGetEmployees = () => {
  const {
    data: assignments,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["employeesAssignments"],
    queryFn: async () => await restaurantService.getEmployees(),
  });

  return {
    assignments: assignments || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};