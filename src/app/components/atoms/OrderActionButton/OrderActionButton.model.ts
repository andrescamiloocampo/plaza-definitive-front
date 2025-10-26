interface OrderActionButtonProps {
  onClick: () => void;
  variant: 'blue' | 'green' | 'purple';
  icon?: string;
  children: React.ReactNode;
}