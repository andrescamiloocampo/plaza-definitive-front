const API_BASE_URL =
  process.env.NEXT_PUBLIC_PLAZA_HOST || "http://localhost:8082/api/v1";

export interface CategoryResponseDto {
  id: number;
  name: string;  
}

class CategoryService {
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
  
  async getCategories(): Promise<CategoryResponseDto[]> {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) throw new Error("No autorizado");
      if (response.status === 403)
        throw new Error("No tienes permisos para obtener esta informacion");
      if (response.status === 404)
        throw new Error("No se encontraron categorias");
      throw new Error("Error al obtener usuarios por rol");
    }

    return response.json();
  }
}

export const categoryService = new CategoryService();
export default categoryService;
