interface PinModalModel {
  isOpen: boolean;
  orderId: string | number;
  onClose: () => void;
  onConfirm: (pin: string) => void;
  title?: string;
  description?: string;
  icon?: string;
  iconBgColor?: string;
  confirmColor?: 'purple' | 'blue' | 'green';
}