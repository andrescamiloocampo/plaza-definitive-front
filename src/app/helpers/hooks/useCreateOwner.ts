'use client'

import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { userService, UserRequestDto } from "../../datasources/users/userService";

export function useCreateOwner(): UseMutationResult<void, Error, UserRequestDto> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: UserRequestDto) => userService.createOwner(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
      console.log("Propietario creado exitosamente");
    },
    onError: (error: Error) => {
      console.error("Error al crear propietario:", error.message);
    },
  });
}
