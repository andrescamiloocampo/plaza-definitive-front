import { Order, DeliverOrderParams, GetOrdersParams } from "@/app/models";

const ORDERS_BASE_URL =
  process.env.NEXT_PUBLIC_PLAZA_HOST || "http://localhost:8082/api/v1";

class EmployeeOrderService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${ORDERS_BASE_URL}/orders`;
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

  async getOrders({
    page = 0,
    size = 10,
    state = "",
  }: GetOrdersParams): Promise<Order[]> {
    
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(state && { state }),
    });

    const response = await fetch(`${this.baseUrl}?${params}`, {
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
      throw new Error("Error al obtener las órdenes.");
    }
    return await response.json();
  }

  async assignOrder(orderId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${orderId}`, {
      method: "PATCH",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para asignar esta orden.");
      }
      if (response.status === 400) {
        throw new Error("La orden no puede ser asignada en su estado actual.");
      }
      throw new Error("Error al asignar la orden.");
    }
  }

  async notifyOrderReady(orderId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${orderId}`, {
      method: "PUT",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para completar esta orden.");
      }
      if (response.status === 400) {
        throw new Error("La orden no puede ser marcada como lista.");
      }
      throw new Error("Error al notificar que la orden está lista.");
    }
  }

  async deliverOrder({
    orderId,
    securityPin,
  }: DeliverOrderParams): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/deliver/${orderId}/${securityPin}`,
      {
        method: "PATCH",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para entregar esta orden.");
      }
      if (response.status === 400) {
        throw new Error("PIN incorrecto o la orden no puede ser entregada.");
      }
      throw new Error("Error al entregar la orden.");
    }
  }
}

export const employeeOrderService = new EmployeeOrderService();
