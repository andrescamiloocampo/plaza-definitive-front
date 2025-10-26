import { Dish } from "@/app/models";

export interface DishCardProps {
  dish: Dish;
  onEdit: (id: number) => void;
  onToggleActive: (id: number) => void;
}