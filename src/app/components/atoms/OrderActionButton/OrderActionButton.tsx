'use client'

import type { ReactElement } from "react";

export const OrderActionButton = ({ 
  onClick, 
  variant, 
  icon, 
  children 
}: OrderActionButtonProps):ReactElement => {
  const variantStyles = {
    blue: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    green: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
    purple: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
  };

  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-gradient-to-r ${variantStyles[variant]} text-white px-5 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};