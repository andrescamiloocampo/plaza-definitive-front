'use client';

import { useQuery,useMutation } from "@tanstack/react-query";
import { userService } from "@/app/datasources/users/userService";
import { UserResponseDto,UserRequestDto } from "@/app/datasources/users/userService";

export const useUsers = (role: string) => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserResponseDto[]>({
    queryKey: ["users"],
    queryFn: () => userService.getUsersByRole(role),
  });

  return { users, isLoading, isError, error, refetch };
};

export const useCreateEmployee = () => {
  return useMutation({
    mutationFn: async ({
      userData,
      bussinessId,
    }: {
      userData: UserRequestDto;
      bussinessId: number;
    }) => {
      await userService.createEmployee(userData, bussinessId);
    },
  });
};

