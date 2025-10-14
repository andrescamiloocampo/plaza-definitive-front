"use client";

import { ReactElement, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import {
  hasPermission,
  DEFAULT_ROUTES,
} from "@/app/helpers/config/permissions.config";
import { Role } from "@/app/models/Role.model";
import { signOut } from "next-auth/react";

interface Props {
  children: ReactElement;
  requiredRoles?: Role[];
  fallbackUrl?: string;
  showUnauthorized?: boolean;
}

export default function RoleGuard({
  children,
  requiredRoles,
  fallbackUrl,
  showUnauthorized = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {  
  if (isLoading || user === undefined) return;
  
  if (user === null) {    
    signOut({ callbackUrl: "/auth/login" });
    return;
  }

  if (!user.roles || user.roles.length === 0) {    
    return;
  }

  const userRole = user.roles[0] as Role;
  
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(userRole)) {
      const redirectUrl = fallbackUrl || DEFAULT_ROUTES[userRole];      
      router.push(redirectUrl);
      setIsAuthorized(false);
      return;
    }
  } else if (!hasPermission(userRole, pathname)) {    
    router.push(DEFAULT_ROUTES[userRole]);
    setIsAuthorized(false);
    return;
  }  
  setIsAuthorized(true);
  setIsChecking(false);
}, [user, isLoading, pathname, requiredRoles, fallbackUrl, router]);


  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized && !showUnauthorized) {
    return null;
  }

  if (showUnauthorized && !isAuthorized) {
    const userRole = user!.roles[0] as Role;
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página
          </p>
          <button
            onClick={() => router.push(DEFAULT_ROUTES[userRole])}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
