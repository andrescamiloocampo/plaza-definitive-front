export interface ConflictModalProps {
  currentRestaurant?: string;
  newRestaurant: string;
  onCancel: () => void;
  onConfirm: () => void;
}