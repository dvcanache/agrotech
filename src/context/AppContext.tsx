import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeneralConfig } from '../types/config';
import { Animal } from '../types/animal';
import { BASE_ANIMALS, generateAnimals } from '../features/animales/animalesData';

interface AppContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  toggleProfile: () => void;
  config: GeneralConfig;
  updateConfig: (newConfig: GeneralConfig) => void;
  resetConfig: () => void;
  animals: Animal[];
  setAnimals: React.Dispatch<React.SetStateAction<Animal[]>>;
  addAnimal: (animal: Animal) => void;
  updateAnimal: (practico: string, updates: Partial<Animal>) => void;
  deleteAnimal: (practico: string) => void;
  deleteAnimalsBatch: (practicos: string[]) => void;
}

const DEFAULT_CONFIG: GeneralConfig = {
  propietario: "AgroGan LLC, 2026",
  nombre: "Rebaño de Prueba",
  pais: "Venezuela",
  especie: "Vacunos",
  tipoExplotacion: "Doble propósito",
  tipoManejo: "Estabulado",
  zonaAgroecologica: "Desierto Tropical con Maleza"
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [config, setConfig] = useState<GeneralConfig>(DEFAULT_CONFIG);
  const [animals, setAnimals] = useState<Animal[]>(() => generateAnimals(BASE_ANIMALS.length));

  const toggleProfile = () => setIsProfileOpen(prev => !prev);
  const updateConfig = (newConfig: GeneralConfig) => setConfig(newConfig);
  const resetConfig = () => setConfig(DEFAULT_CONFIG);

  const addAnimal = (animal: Animal) => {
    setAnimals(prev => [animal, ...prev]);
  };

  const updateAnimal = (practico: string, updates: Partial<Animal>) => {
    setAnimals(prev => prev.map(a => a.practico === practico ? { ...a, ...updates } : a));
  };

  const deleteAnimal = (practico: string) => {
    setAnimals(prev => prev.filter(a => a.practico !== practico));
  };

  const deleteAnimalsBatch = (practicos: string[]) => {
    const set = new Set(practicos);
    setAnimals(prev => prev.filter(a => !set.has(a.practico)));
  };

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        isProfileOpen,
        setIsProfileOpen,
        toggleProfile,
        config,
        updateConfig,
        resetConfig,
        animals,
        setAnimals,
        addAnimal,
        updateAnimal,
        deleteAnimal,
        deleteAnimalsBatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser utilizado dentro de un AppProvider');
  }
  return context;
};
