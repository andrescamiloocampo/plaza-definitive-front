"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "./UserContext";
import { Loader2 } from "lucide-react";

const ROLE_ROUTES: Record<string, string> = {
  CUSTOMER: "/dashboard",
  EMPLOYEE: "/dashboard/employee",
  ADMIN: "/dashboard/admin",
};

export const RoleRedirectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      if (!pathname.startsWith("/auth/login")) {
        router.replace("/auth/login");
      }
      return;
    }

    const role = user.roles?.[0];
    const expectedRoute = ROLE_ROUTES[role];
    if (!expectedRoute) {
      if (!pathname.startsWith("/unauthorized")) {
        router.replace("/unauthorized");
      }
      return;
    }
    if (
      pathname !== expectedRoute &&
      !pathname.startsWith(`${expectedRoute}/`)
    ) {
      router.replace(expectedRoute);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};
