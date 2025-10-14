export interface OrderDish {
  name: string;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  chefId?: number;
  date: string;
  state: 'PENDING' | 'PREPARATION' | 'DONE' | 'DELIVERED' | 'CANCELED';
  pin?: string;
  dishes?: OrderDish[];
}

export interface GetOrdersParams {
  page?: number;
  size?: number;
  state?: string;  
}

export interface DeliverOrderParams {
  orderId: number;
  securityPin: string;
}