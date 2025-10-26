'use client';

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/app/datasources/users/userService";
import { UserResponseDto } from "@/app/datasources/users/userService";

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
