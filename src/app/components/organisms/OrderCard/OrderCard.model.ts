import type { Order,DeliverOrderParams } from "@/app/models";

export interface OrderCardModel {
  order: Order;
  onAssign: (orderId: number) => void;
  onNotifyReady: (orderId: number) => void;
  onDeliver: (params: DeliverOrderParams) => void;
}