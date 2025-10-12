export interface RegisterUserDto {
  name: string;
  lastname: string;
  identityDocument: number;
  phone: string;
  birthdate: string; // Format: YYYY-MM-DD
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_USERS_HOST || "http://localhost:8080";

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/auth`;
  }
  
  async register(userData: RegisterUserDto): Promise<void> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Usuario ya existe o datos inválidos");
      }
      throw new Error("Error al registrar usuario");
    }
    
    return;
  }

  async login(credentials: LoginUserDto): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Credenciales inválidas");
      }
      throw new Error("Error al iniciar sesión");
    }

    const data: LoginResponse = await response.json();
    return data;
  }
}

export const authService = new AuthService();

export default AuthService;