import { OrderRequestDto } from '../../store/OrderStore';
import { useMutation, useQuery, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { orderService } from '../../datasources/orders/orderService';

export function useCreateOrder(token: string): UseMutationResult<any, Error, OrderRequestDto> {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (orderData: OrderRequestDto) => orderService.createOrder(orderData, token),
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      console.log("Orden creada exitosamente");
    },
    onError: (error: Error) => {
      console.error("Error al crear la orden:", error.message);
    },
  });

  return mutation;
}

export function useMyOrders(token: string | undefined, page: number = 0, size: number = 10) {
  return useQuery({
    queryKey: ["orders", "my-orders", page, size],
    queryFn: () => orderService.getMyOrders(token!, page, size),
    enabled: !!token,
    staleTime: 30 * 1000,
  });
}

export function useOrder(orderId: number, token: string | undefined) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getOrderById(orderId, token!),
    enabled: !!token && !!orderId,
    staleTime: 60 * 1000,
  });
}

export function useCancelOrder(token: string): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => orderService.cancelOrder(token),
    onSuccess: () => {      
      queryClient.invalidateQueries({ queryKey: ["orders"] });      
    },
    onError: (error: Error) => {
      console.error("Error al cancelar la orden:", error.message);
    },
  });
}