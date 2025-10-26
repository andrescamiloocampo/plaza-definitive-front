'use client'

import { employeeOrderService } from '@/app/datasources/orders/employeeOrderService';
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";
import { GetOrdersParams,DeliverOrderParams } from "@/app/models";

export default class OrdersHooks {
  static useOrders({ page, size, state }: GetOrdersParams) {    
    return useQuery({
      queryKey: ['orders', page, size, state],
      queryFn: () => employeeOrderService.getOrders({ page, size, state }),
      staleTime: 30000,
      refetchInterval: 60000
    });
  }

  static useAssignOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (orderId: number) => employeeOrderService.assignOrder(orderId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    });
  }

  static useNotifyOrderReady() {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (orderId: number) => employeeOrderService.notifyOrderReady(orderId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    });
  }

  static useDeliverOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (params: DeliverOrderParams) => employeeOrderService.deliverOrder(params),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    });
  }
}