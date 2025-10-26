'use client'

import { useUser } from '@/app/components/context/UserContext';
import { Role } from '@/app/models/Role.model';
import { hasPermission as checkPathPermission } from '@/app/helpers/config/permissions.config';

export function usePermissions() {
  const { user, isLoading } = useUser();

  const hasRole = (allowedRoles: Role[]): boolean => {
    if (!user || !user.roles.length) return false;
    const userRole = user.roles[0];
    return allowedRoles.includes(userRole as Role);
  };

  const hasPermission = (path: string): boolean => {
    if (!user || !user.roles.length) return false;
    const userRole = user.roles[0];
    return checkPathPermission(userRole as Role, path);
  };

  const isAdmin = (): boolean => {
    return user?.roles[0] === 'ADMIN';
  };

  const isOwner = (): boolean => {
    return user?.roles[0] === 'OWNER';
  };

  const isEmployee = (): boolean => {
    return user?.roles[0] === 'EMPLOYEE';
  };

  const isCustomer = (): boolean => {
    return user?.roles[0] === 'CUSTOMER';
  };

  const isAdminOrOwner = (): boolean => {
    const role = user?.roles[0];
    return role === 'ADMIN' || role === 'OWNER';
  };

  const getCurrentRole = (): Role | null => {
    return user?.roles[0] as Role || null;
  };

  const getUserEmail = (): string | null => {
    return user?.sub || null;
  };

  return {
    user,
    isLoading,
    hasRole,
    hasPermission,
    isAdmin,
    isOwner,
    isEmployee,
    isCustomer,
    isAdminOrOwner,
    getCurrentRole,
    getUserEmail,
  };
}