'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DishModalBaseProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const DishModalBase = ({ title, isOpen, onClose, children }: DishModalBaseProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          {title}
        </h2>
        
        {children}
      </div>
    </div>
  );
};
