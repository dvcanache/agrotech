import React from 'react';

export interface SpeciesTabItem {
  id: string; // 'TODAS' | 'Bovinos' | 'Aves de corral' | 'Porcinos' | 'Búfalos' | 'Caprinos' | 'Equinos'
  label: string;
  icon: string;
}

export const SPECIES_TABS_CONFIG: SpeciesTabItem[] = [
  { id: 'TODAS', label: 'Todas las Especies', icon: '🐾' },
  { id: 'Bovinos', label: 'Bovinos', icon: '🐮' },
  { id: 'Aves de corral', label: 'Aves', icon: '🐔' },
  { id: 'Porcinos', label: 'Porcinos', icon: '🐷' },
  { id: 'Búfalos', label: 'Búfalos', icon: '🐃' },
  { id: 'Caprinos', label: 'Caprinos', icon: '🐐' },
  { id: 'Equinos', label: 'Equinos', icon: '🐴' }
];

interface SpeciesSelectorBarProps {
  selectedSpecies: string;
  onSelectSpecies: (species: string) => void;
  speciesCounts?: Record<string, number>;
  style?: React.CSSProperties;
}

export const SpeciesSelectorBar: React.FC<SpeciesSelectorBarProps> = ({
  selectedSpecies,
  onSelectSpecies,
  speciesCounts,
  style
}) => {
  return (
    <div className="species-selector-bar" style={{ marginTop: 2, marginBottom: 12, ...style }}>
      {SPECIES_TABS_CONFIG.map(tab => {
        const isActive = selectedSpecies === tab.id;
        const count = speciesCounts ? speciesCounts[tab.id] : undefined;

        return (
          <button
            key={tab.id}
            type="button"
            className={`species-tab-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectSpecies(tab.id)}
            title={`Filtrar por ${tab.label}`}
          >
            <span className="species-tab-icon">{tab.icon}</span>
            <span className="species-tab-name">{tab.label}</span>
            {count !== undefined && (
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 11,
                  padding: '1px 7px',
                  borderRadius: 10,
                  backgroundColor: isActive ? 'var(--primary-color)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  transition: 'all 0.15s ease'
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
