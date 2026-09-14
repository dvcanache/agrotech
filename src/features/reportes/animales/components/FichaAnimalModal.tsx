import React from 'react';
import { FichaAnimal360 } from '../../../animales/components/FichaAnimal360';
import { AnimalModalData } from '../../../animales/utils/animalAdapter';

export type { AnimalModalData };

interface FichaAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: AnimalModalData | null;
}

export const FichaAnimalModal: React.FC<FichaAnimalModalProps> = ({
  isOpen,
  onClose,
  animal
}) => {
  if (!isOpen || !animal) return null;

  return (
    <FichaAnimal360
      isOpen={isOpen}
      onClose={onClose}
      animal={animal}
    />
  );
};
