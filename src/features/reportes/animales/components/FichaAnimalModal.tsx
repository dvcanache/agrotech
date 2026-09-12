import React from 'react';
import { EstatusAnimal, EstatusReproductivo, EstatusProductivo, CategoriaAnimal } from '../../../../types2/common';
import { FichaAnimal360 } from '../../../animales/components/FichaAnimal360';

export interface AnimalModalData {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  lote: string;
  estatusReproductivo?: EstatusReproductivo;
  estatusProductivo?: EstatusProductivo;
  edadAnos?: number;
  partos?: number;
  ultimoParto?: string;
  ultimoServicio?: string;
  reproductor?: string;
  fechaProximoParto?: string;
  fechaProximoSecado?: string;
  diasParida?: number;
  diasSeca?: number;
  pesoKg?: number;
  raza?: string;
}

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
      animal={animal.practico}
    />
  );
};
