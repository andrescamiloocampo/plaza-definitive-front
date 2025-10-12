import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DishCategory {
  name: string;
}

interface DishModel {
  id: number;
  name: string;
  category: DishCategory;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
  restaurantId: number;
}

interface OrderItem extends DishModel {
  quantity: number;
}

interface RestaurantInfo {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export interface OrderDishDto {
  dishId: number;
  quantity: number;
}

export interface OrderRequestDto {
  restaurantId: number;
  dishes: OrderDishDto[];
}

interface OrderStore {  
  items: OrderItem[];
  restaurant: RestaurantInfo | null;
  
  addItem: (dish: DishModel, restaurantInfo: RestaurantInfo) => boolean;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  
  canAddFromRestaurant: (restaurantId: number) => boolean;
    
  getOrderPayload: () => OrderRequestDto | null;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,

      addItem: (dish: DishModel, restaurantInfo: RestaurantInfo) => {
        const state = get();
                
        if (state.restaurant && state.restaurant.id !== restaurantInfo.id) {
          return false;
        }

        const existingItem = state.items.find(item => item.id === dish.id);

        if (existingItem) {          
          set({
            items: state.items.map(item =>
              item.id === dish.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {          
          set({
            items: [...state.items, { ...dish, quantity: 1 }],
            restaurant: restaurantInfo,
          });
        }

        return true;
      },

      removeItem: (dishId: number) => {
        const state = get();
        const newItems = state.items.filter(item => item.id !== dishId);
        
        set({
          items: newItems,          
          restaurant: newItems.length === 0 ? null : state.restaurant,
        });
      },

      updateQuantity: (dishId: number, quantity: number) => {
        const state = get();
        
        if (quantity <= 0) {          
          get().removeItem(dishId);
          return;
        }

        set({
          items: state.items.map(item =>
            item.id === dishId ? { ...item, quantity } : item
          ),
        });
      },

      clearOrder: () => {
        set({
          items: [],
          restaurant: null,
        });
      },

      getTotal: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      canAddFromRestaurant: (restaurantId: number) => {
        const state = get();
        return !state.restaurant || state.restaurant.id === restaurantId;
      },

      getOrderPayload: () => {
        const state = get();
                
        if (!state.restaurant || state.items.length === 0) {
          return null;
        }
        
        const payload: OrderRequestDto = {
          restaurantId: state.restaurant.id,
          dishes: state.items.map(item => ({
            dishId: item.id,
            quantity: item.quantity,
          })),
        };

        return payload;
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        items: state.items,
        restaurant: state.restaurant,
      }),
    }
  )
);