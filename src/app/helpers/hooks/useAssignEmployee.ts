'use client';

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from '@/app/datasources';

export const useAssignEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { userId: number; restaurantId: number; active: boolean }) => {
      return await restaurantService.assignEmployeeToRestaurant(data);
    },
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: ["employeesAssignments"] });
    },
  });
};
