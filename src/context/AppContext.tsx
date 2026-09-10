import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GeneralConfig } from '../types/config';

interface AppContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  toggleProfile: () => void;
  config: GeneralConfig;
  updateConfig: (newConfig: GeneralConfig) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: GeneralConfig = {
  propietario: "AgroTech LLC, 2026",
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

  const toggleProfile = () => setIsProfileOpen(prev => !prev);
  const updateConfig = (newConfig: GeneralConfig) => setConfig(newConfig);
  const resetConfig = () => setConfig(DEFAULT_CONFIG);

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
        resetConfig
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
