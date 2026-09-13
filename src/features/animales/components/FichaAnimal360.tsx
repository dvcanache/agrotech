import React, { useState, useEffect } from 'react';
import { 
  Info, 
  GitBranch, 
  Heart, 
  Milk, 
  Scale, 
  ShieldAlert, 
  MapPin 
} from 'lucide-react';
import { Animal, Animal360 } from '../../../types/animal';
import { getAnimal360ByPractico } from '../animalesData';
import { FichaCabecera } from './FichaCabecera';
import { TabGeneralIdentificacion } from './TabGeneralIdentificacion';
import { TabGenealogiaConsanguinidad } from './TabGenealogiaConsanguinidad';
import { TabHistorialReproductivo } from './TabHistorialReproductivo';
import { TabCurvasLactancia } from './TabCurvasLactancia';
import { TabDesarrolloPonderal } from './TabDesarrolloPonderal';
import { TabSanidadUbre } from './TabSanidadUbre';
import { TabTrazabilidadEspacial } from './TabTrazabilidadEspacial';
import './fichaAnimal.css';

export type FichaAnimalTab = 
  | 'general'
  | 'genealogia'
  | 'reproduccion'
  | 'lactancia'
  | 'ponderal'
  | 'sanidad'
  | 'trazabilidad';

interface FichaAnimal360Props {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal360 | Animal | string | null;
  onOpenNuevoEvento?: (animalPractico: string) => void;
}

export const FichaAnimal360: React.FC<FichaAnimal360Props> = ({
  isOpen,
  onClose,
  animal,
  onOpenNuevoEvento
}) => {
  const [activeTab, setActiveTab] = useState<FichaAnimalTab>('general');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !animal) return null;

  // Resolve full 360 data
  let animal360: Animal360;
  if (typeof animal === 'string') {
    animal360 = getAnimal360ByPractico(animal);
  } else if ('pedigri' in animal) {
    animal360 = animal as Animal360;
  } else {
    animal360 = getAnimal360ByPractico((animal as Animal).practico);
  }

  const isPoultry = animal360.especie === 'Aves de corral' || (animal360.categoria && ['Gallina', 'Pollo', 'Gallo', 'Pava', 'Pato', 'Pavito', 'Patito'].some(c => animal360.categoria.includes(c)));

  const TABS_CONFIG: { key: FichaAnimalTab; label: string; num: number; icon: React.ReactNode }[] = [
    { key: 'general', label: 'General & Identificación', num: 1, icon: <Info size={15} /> },
    { key: 'genealogia', label: 'Genealogía & Consanguinidad', num: 2, icon: <GitBranch size={15} /> },
    { key: 'reproduccion', label: isPoultry ? 'Ciclo Reproductivo & Incubación' : 'Historial Reproductivo', num: 3, icon: <Heart size={15} /> },
    { key: 'lactancia', label: isPoultry ? 'Curvas de Postura & Rendimiento' : 'Curvas Lactancia (Wood)', num: 4, icon: <Milk size={15} /> },
    { key: 'ponderal', label: 'Desarrollo Ponderal', num: 5, icon: <Scale size={15} /> },
    { key: 'sanidad', label: isPoultry ? 'Sanidad & Bioseguridad Aviar' : animal360.especie === 'Caprinos' ? 'Sanidad & Ubre (2G)' : 'Sanidad & Ubre (4Q)', num: 6, icon: <ShieldAlert size={15} /> },
    { key: 'trazabilidad', label: 'Trazabilidad Espacial', num: 7, icon: <MapPin size={15} /> },
  ];

  return (
    <div className="ficha360-backdrop" onClick={onClose}>
      <div className="ficha360-modal" onClick={e => e.stopPropagation()}>
        {/* 1. Cabecera Dinámica y Alerta Sanitaria de Retiro */}
        <FichaCabecera
          animal={animal360}
          onClose={onClose}
          onOpenEventoModal={() => onOpenNuevoEvento?.(animal360.practico)}
        />

        {/* 2. Barra de Navegación de 7 Pestañas Contextuales */}
        <div className="ficha360-tabs-bar">
          {TABS_CONFIG.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`ficha360-tab-item ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="ficha360-tab-num">{tab.num}</span>
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. Cuerpo de la Ficha (Contenido Scrolleable de la Pestaña Activa) */}
        <div className="ficha360-body">
          {activeTab === 'general' && (
            <TabGeneralIdentificacion animal={animal360} />
          )}
          {activeTab === 'genealogia' && (
            <TabGenealogiaConsanguinidad animal={animal360} />
          )}
          {activeTab === 'reproduccion' && (
            <TabHistorialReproductivo animal={animal360} />
          )}
          {activeTab === 'lactancia' && (
            <TabCurvasLactancia animal={animal360} />
          )}
          {activeTab === 'ponderal' && (
            <TabDesarrolloPonderal animal={animal360} />
          )}
          {activeTab === 'sanidad' && (
            <TabSanidadUbre animal={animal360} />
          )}
          {activeTab === 'trazabilidad' && (
            <TabTrazabilidadEspacial animal={animal360} />
          )}
        </div>
      </div>
    </div>
  );
};
