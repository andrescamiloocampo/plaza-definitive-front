export interface Dish {
  id: number;
  name: string;
  category: number;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  restaurantId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface DishRequest {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  restaurantId: number;
}

export interface DishPartialUpdate {  
  price?: number;
  description?: string;  
}