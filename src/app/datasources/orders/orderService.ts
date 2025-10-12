import { OrderRequestDto } from "@/app/store/OrderStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_USERS_HOST || "http://localhost:8080";
const PLAZA_BASE_URL =
  process.env.NEXT_PUBLIC_PLAZA_HOST || "http://localhost:8082/api/v1";

interface CreateOrderResponse {
  id: number;
  restaurantId: number;
  status: string;
}

class OrderService {
  private baseUrl: string;
  private plazaUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/orders`;
    this.plazaUrl = `${PLAZA_BASE_URL}/orders`;
  }

  async createOrder(
    orderData: OrderRequestDto,
    token: string
  ): Promise<CreateOrderResponse | null> {
    const response = await fetch(this.plazaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Datos de orden inválidos");
      }
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
      }
      if (response.status === 404) {
        throw new Error("Restaurante o platos no encontrados");
      }
      if (response.status === 409) {
        throw new Error(
          "Ya tienes una orden activa. Finalízala antes de crear una nueva."
        );
      }
      throw new Error("Error al crear la orden");
    }

    const text = await response.text();
    if (!text) {
      return null;
    }

    return JSON.parse(text);
  }

  async getMyOrders(
    token: string,
    page: number = 0,
    size: number = 10
  ): Promise<any[]> {
    const response = await fetch(
      `${this.baseUrl}/my-orders?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado");
      }
      throw new Error("Error al obtener las órdenes");
    }

    const data = await response.json();
    return data;
  }


  async getOrderById(orderId: number, token: string): Promise<any> {
    const response = await fetch(`${this.plazaUrl}/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Orden no encontrada");
      }
      throw new Error("Error al obtener la orden");
    }

    const data = await response.json();
    return data;
  }

  async cancelOrder(token: string): Promise<void> {
    console.log('Cancelar orden', token)
    const response = await fetch(`${this.plazaUrl}/cancel`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("No se puede cancelar esta orden");
      }
      if (response.status === 404) {
        throw new Error("Orden no encontrada");
      }
      throw new Error("Error al cancelar la orden");
    }
  }
}

export const orderService = new OrderService();

export default OrderService;
