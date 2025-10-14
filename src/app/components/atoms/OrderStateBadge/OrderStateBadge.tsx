import { Order } from "@/app/models";

export const OrderStateBadge = ({ state }: { state: Order['state'] }) => {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PREPARATION: 'bg-blue-100 text-blue-800 border-blue-300',
    DONE: 'bg-green-100 text-green-800 border-green-300',
    DELIVERED: 'bg-gray-100 text-gray-800 border-gray-300',
    CANCELED: 'bg-red-100 text-red-800 border-red-300'
  };

  const labels = {
    PENDING: 'Pendiente',
    PREPARATION: 'En Preparación',
    DONE: 'Lista',
    DELIVERED: 'Entregada',
    CANCELED: 'Cancelada'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[state] || styles.PENDING}`}>
      {labels[state] || state}
    </span>
  );
};