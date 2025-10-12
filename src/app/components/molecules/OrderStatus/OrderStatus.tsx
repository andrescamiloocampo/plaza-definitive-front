import React from 'react';
import { Clock, Package, PackageCheck, Truck, XCircle } from 'lucide-react';

interface OrderStatusProps {
  currentState: string;
}

export const OrderStatus: React.FC<OrderStatusProps> = ({ currentState }) => {
  const steps = [
    { 
      label: 'PENDING', 
      icon: Clock, 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-600',
      lightBg: 'bg-yellow-50'
    },
    { 
      label: 'PREPARATION', 
      icon: Package, 
      color: 'bg-blue-500', 
      textColor: 'text-blue-600',
      lightBg: 'bg-blue-50'
    },
    { 
      label: 'DONE', 
      icon: PackageCheck, 
      color: 'bg-purple-500', 
      textColor: 'text-purple-600',
      lightBg: 'bg-purple-50'
    },
    { 
      label: 'DELIVERED', 
      icon: Truck, 
      color: 'bg-green-500', 
      textColor: 'text-green-600',
      lightBg: 'bg-green-50'
    },
  ];

  const isCancelled = currentState === 'CANCELLED' || currentState === 'CANCELED';  
  const currentStepIndex = steps.findIndex(step => step.label === currentState);
  
  return (
    <div className="relative py-4 px-4">      
      <div className="absolute top-6 left-0 right-0 px-9">        
        <div className="h-0.5 bg-gray-200" />
                
        {!isCancelled && currentStepIndex >= 0 && (
          <div 
            className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        )}
      </div>
      
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = !isCancelled && index <= currentStepIndex;
          const isCurrent = !isCancelled && index === currentStepIndex;
          const isPast = !isCancelled && index < currentStepIndex;

          return (
            <div key={step.label} className="flex flex-col items-center">              
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  transition-all duration-300 relative
                  ${isCancelled ? 'bg-red-100' : isActive ? step.color : 'bg-gray-200'}
                  ${isCurrent ? 'ring-4 ring-purple-200 shadow-lg' : ''}
                `}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isCancelled ? 'text-red-500' : isActive ? 'text-white' : 'text-gray-400'
                  }`}
                />
                                
                {isPast && !isCancelled && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              
              <span
                className={`
                  mt-2 text-xs font-medium transition-colors duration-300
                  ${isCancelled ? 'text-red-500' : isActive ? step.textColor : 'text-gray-400'}
                  ${isCurrent ? 'font-bold' : ''}
                `}
              >
                {step.label}
              </span>
              
              {isCurrent && !isCancelled && (
                <div className="mt-1 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
      
      {isCancelled && (
        <div className="mt-4 flex items-center justify-center gap-2 bg-red-50 py-2 px-4 rounded-lg">
          <XCircle size={18} className="text-red-500" />
          <span className="text-sm font-medium text-red-600">Orden Cancelada</span>
        </div>
      )}
    </div>
  );
};