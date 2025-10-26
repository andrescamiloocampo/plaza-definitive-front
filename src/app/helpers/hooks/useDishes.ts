'use client'

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishesByRestaurantId } from "@/app/datasources";
import { DishRequest, DishPartialUpdate } from "@/app/models";
import { dishService } from "@/app/datasources";

export const useDishes = (rid: number, token: string, page = 0, size = 10) => {
  return useQuery({
    queryKey: ["dishes", rid, page, size],
    queryFn: () => getDishesByRestaurantId(rid, page, size, token),
    enabled: !!rid && !!token,
    refetchOnWindowFocus: false,
  });
};

export const useCreateDish = (rid: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dish: DishRequest) => dishService.createDish(dish),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes", rid] });
    },
    onError: (error: any) => {
      console.error("Error al crear el plato:", error);
    },
  });
};

export const useUpdateDish = (rid: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DishPartialUpdate }) =>
      dishService.updateDish(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes", rid] });
    },
    onError: (error: any) => {
      console.error("Error al actualizar el plato:", error);
    },
  });
};

export const useToggleDishState = (rid: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, state }: { id: number; state: boolean }) =>
      dishService.updateDishState(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes", rid] });
    },
    onError: (error: any) => {
      console.error("Error al cambiar el estado del plato:", error);
    },
  });
};
