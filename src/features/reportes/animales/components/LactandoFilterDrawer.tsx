import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal } from '../../../../types2/common';

export interface LactandoFilterValues {
  diasProduccionMaximo?: number;
  estatus: EstatusAnimal[];
  lotes: string[];
}

interface LactandoFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: LactandoFilterValues;
  onFilterChange: (newFilters: LactandoFilterValues) => void;
  onReset: () => void;
  lotesDisponibles?: string[];
}

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1', 'GALP-01', 'GALP-02', 'PIARA-01', 'APR-01', 'BUF-01', 'CAB-01'];

export const LactandoFilterDrawer: React.FC<LactandoFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  lotesDisponibles
}) => {
  const lotesOptions = lotesDisponibles && lotesDisponibles.length > 0 ? lotesDisponibles : ALL_LOTES;

  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Animales Lactando"
      onClear={onReset}
    >
      {/* Días en producción (máximo) */}
      <div className="filter-section">
        <div className="filter-section-title">Días en Producción (Máximo)</div>
        <div className="form-group">
          <input
            type="number"
            min="1"
            max="600"
            placeholder="Sin límite"
            className="form-control"
            value={filters.diasProduccionMaximo || ''}
            onChange={e =>
              onFilterChange({
                ...filters,
                diasProduccionMaximo: e.target.value ? Number(e.target.value) : undefined
              })
            }
          />
          <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            Filtra animales con días en leche menores o iguales al valor especificado.
          </span>
        </div>
      </div>

      {/* Estatus */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus</div>
        <div className="filter-checkbox-list">
          {ALL_ESTATUS.map(st => (
            <label key={st} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.estatus.includes(st)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    estatus: toggleArrayItem(filters.estatus, st)
                  })
                }
              />
              <span>{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lotes */}
      <div className="filter-section">
        <div className="filter-section-title">Lotes</div>
        <div className="filter-checkbox-list">
          {lotesOptions.map(lote => (
            <label key={lote} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.lotes.includes(lote)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    lotes: toggleArrayItem(filters.lotes, lote)
                  })
                }
              />
              <span>{lote}</span>
            </label>
          ))}
        </div>
      </div>
    </ReportFilterDrawer>
  );
};
