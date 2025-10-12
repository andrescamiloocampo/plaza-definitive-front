const LOGS_BASE_URL =
  process.env.NEXT_PUBLIC_LOGS_HOST || "http://localhost:8083/api/v1";

interface StatusChange {
  previousState: string | null;
  newState: string;
  changedAt: string;
}

export interface OrderLog {
  orderId: number;
  chefId: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
  currentState: string;
  statusChanges: StatusChange[];
}

class OrderLogsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${LOGS_BASE_URL}/logs/orders`;
  }

  async getMyOrderLogs(token: string): Promise<OrderLog[]> {
    const response = await fetch(this.baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Inicia sesión nuevamente.");
      }
      throw new Error("Error al obtener el historial de órdenes.");
    }

    const data = await response.json();
    return data;
  }
}

export const orderLogsService = new OrderLogsService();
