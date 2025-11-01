'use client';

import { ReactElement } from 'react';
import { DishForm } from '../DishForm/DishForm';
import { DishModalBase } from '../DishModalBase/DishModalBase';

interface DishCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export const DishCreateModal = ({ isOpen, onClose, onCreate }: DishCreateModalProps): ReactElement | null => {  
  return (
    <DishModalBase title="Crear nuevo plato" isOpen={isOpen} onClose={onClose}>
      <DishForm
        onSubmit={(data) => {
          onCreate(data);
          onClose();
        }}
        onCancel={onClose}
      />
    </DishModalBase>
  );
};
