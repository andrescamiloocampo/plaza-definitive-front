import { Role } from "@/app/models/Role.model";

export const ROUTE_PERMISSIONS: Record<string, Role[]> = {
  '/dashboard': ['ADMIN', 'CUSTOMER'],
  '/admin': ['ADMIN', 'OWNER'],
  '/orders': ['EMPLOYEE'],
  '/owner_panel': ['OWNER', 'ADMIN']  
};

export const DEFAULT_ROUTES: Record<Role, string> = {
  ADMIN: '/admin',
  EMPLOYEE: '/orders',
  CUSTOMER: '/dashboard',
  OWNER: '/owner_panel',
};

export const hasPermission = (userRole: Role, path: string): boolean => {
  const matchingRoute = Object.keys(ROUTE_PERMISSIONS)
    .filter(route => path.startsWith(route))
    .sort((a, b) => b.length - a.length)[0]; 

  if (!matchingRoute) return true;
  
  const allowedRoles = ROUTE_PERMISSIONS[matchingRoute];
  return allowedRoles.includes(userRole);
};