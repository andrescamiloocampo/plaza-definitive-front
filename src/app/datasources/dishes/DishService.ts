import { Dish, DishRequest, DishPartialUpdate } from "@/app/models";

export class DishService {
  private baseUrl = `${process.env.NEXT_PUBLIC_PLAZA_HOST}/dishes`;

  constructor(private token: string) {}

  private getHeaders(contentType = true): HeadersInit {
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.token}`,
    };
    if (contentType) headers["Content-Type"] = "application/json";
    return headers;
  }

  async getDishesByRestaurant(
    restaurantId: number,
    page = 0,
    size = 10,
    category = ""
  ): Promise<Dish[]> {
    const url = new URL(`${this.baseUrl}/dishes`);
    url.searchParams.append("rid", restaurantId.toString());
    url.searchParams.append("page", page.toString());
    url.searchParams.append("size", size.toString());
    if (category) url.searchParams.append("category", category);

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Error al cargar los platos");
    return res.json();
  }

  async createDish(dish: DishRequest): Promise<void> {
    const res = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(dish),
    });
    if (!res.ok) throw new Error("Error al crear el plato");
  }

  async updateDish(id: number, data: DishPartialUpdate): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar el plato");
  }

  async updateDishState(id: number, state: boolean): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}/${state}`, {
      method: "PATCH",
      headers: this.getHeaders(false),
    });
    if (!res.ok) throw new Error("Error al actualizar el estado del plato");
  }
}

export const dishService: DishService = typeof window !== "undefined"
  ? new DishService(sessionStorage.getItem("accessToken") ?? "")
  : null as any;
