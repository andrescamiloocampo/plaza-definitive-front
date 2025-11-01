const API_BASE_URL =
  process.env.NEXT_PUBLIC_USERS_HOST || "http://localhost:8080/api/v1/user";

export interface UserRequestDto {
  name: string;
  lastname: string;
  identityDocument: number;
  phone: string;
  birthdate: string;
  email: string;
  password?: string;
}

export interface RoleResponseDto {
  id: number;
  name: string;
  description?: string;
}

export interface UserResponseDto {
  restaurantId: number;
  id: number;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate: string;
  roles: RoleResponseDto[];
}


class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getAuthToken(): string {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No hay token de autenticación");
    }
    return token;
  }

  private getHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.getAuthToken()}`,
      "Content-Type": "application/json",
    };
  }

  async createOwner(userData: UserRequestDto): Promise<void> {
    const body = {
      ...userData,
      password: "S3gur0_P@ss2025",
    };

    const response = await fetch(`${this.baseUrl}/user/OWNER`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 400) throw new Error("Datos inválidos");
      if (response.status === 401) throw new Error("No autorizado");
      if (response.status === 403)
        throw new Error("No tienes permisos para crear propietarios");
      if (response.status === 409) throw new Error("El usuario ya existe");
      throw new Error("Error al crear propietario");
    }
  }

  async getUsersByRole(role: string): Promise<UserResponseDto[]> {
    const response = await fetch(`${this.baseUrl}/user/role/${role}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("No autorizado");
      if (response.status === 403)
        throw new Error("No tienes permisos para ver usuarios con este rol");
      if (response.status === 404)
        throw new Error("No se encontraron usuarios con ese rol");
      throw new Error("Error al obtener usuarios por rol");
    }

    return response.json();
  }

  async createEmployee(userData: UserRequestDto, bussinessId: number): Promise<void> {
    const body = {
      ...userData,
      password: "S3gur0_P@ss2025",
    };

    const response = await fetch(`${this.baseUrl}/user/EMPLOYEE?bid=${bussinessId}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      if (response.status === 400) throw new Error("Datos inválidos");
      if (response.status === 401) throw new Error("No autorizado");
      if (response.status === 403)
        throw new Error("No tienes permisos para crear empleados");
      if (response.status === 409) throw new Error("El usuario ya existe");
      throw new Error("Error al crear empleado");
    }
  }
}

export const userService = new UserService();
export default UserService;
