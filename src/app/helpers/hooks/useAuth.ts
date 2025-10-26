'use client'

import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { authService, RegisterUserDto, LoginUserDto, LoginResponse } from "../../datasources";

export function useRegister(): UseMutationResult<void, Error, RegisterUserDto> {
  return useMutation({
    mutationFn: (userData: RegisterUserDto) => authService.register(userData),
    onSuccess: () => {
      console.log("Usuario registrado exitosamente");
    },
    onError: (error: Error) => {
      console.error("Error en el registro:", error.message);
    },
  });
}

export function useLogin(): UseMutationResult<LoginResponse, Error, LoginUserDto> {
  return useMutation({
    mutationFn: (credentials: LoginUserDto) => authService.login(credentials),
    onSuccess: (data: LoginResponse) => {      
      sessionStorage.setItem("accessToken", data.token);
      console.log("Login exitoso");
    },
    onError: (error: Error) => {
      console.error("Error en el login:", error.message);
    },
  });
}

export function useLogout() {
  return () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userEmail");
    window.location.href = "/login";
  };
}