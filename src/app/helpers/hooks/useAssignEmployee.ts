'use client';

import { useMutation } from "@tanstack/react-query";
import { restaurantService } from '@/app/datasources';

export const useAssignEmployee = () => {
  return useMutation({
    mutationFn: (data: { userId: number; restaurantId: number; active: boolean }) =>
      restaurantService.assignEmployeeToRestaurant(data),
  });
};
