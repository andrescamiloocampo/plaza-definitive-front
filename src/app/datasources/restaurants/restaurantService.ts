import { RestaurantRequestModel, RestaurantResponseModel } from "@/app/models";

const RESTAURANTS_BASE_URL =
  process.env.NEXT_PUBLIC_PLAZA_HOST || "http://localhost:8082/api/v1";

class RestaurantService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${RESTAURANTS_BASE_URL}/restaurants`;
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

  async getRestaurantsByOwner(
    ownerId: number
  ): Promise<RestaurantResponseModel[]> {
    const response = await fetch(`${this.baseUrl}/byOwner/${ownerId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para acceder a esta información.");
      }
      if (response.status === 404) {
        throw new Error(
          "No se encontraron restaurantes para este propietario."
        );
      }
      throw new Error("Error al obtener los restaurantes.");
    }

    return await response.json();
  }

  async createRestaurant(restaurant: RestaurantRequestModel): Promise<void> {
    const response = await fetch(`${this.baseUrl}/`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(restaurant),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para crear restaurantes.");
      }
      if (response.status === 409) {
        throw new Error("El restaurante ya existe.");
      }
      throw new Error("Error al crear el restaurante.");
    }
  }

  async assignEmployeeToRestaurant(data: {
    userId: number;
    restaurantId: number;
    active: boolean;
  }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/employees`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) throw new Error("Solicitud inválida");
      if (response.status === 401) throw new Error("No autorizado");
      if (response.status === 403)
        throw new Error("No tienes permisos para asignar empleados");
      throw new Error("Error al asignar empleado");
    }
  }
}

export const restaurantService = new RestaurantService();
