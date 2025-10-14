export type Role = 'ADMIN' | 'CUSTOMER' | 'EMPLOYEE' | 'OWNER';

export interface User {
    id: string;
    email: string;
    role: Role;
}