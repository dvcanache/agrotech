import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal, EstatusReproductivo } from '../../../../types2/common';

export interface SecosFilterValues {
  estatus: EstatusAnimal[];
  estatusReproductivo: EstatusReproductivo[];
  lotes: string[];
}

interface SecosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SecosFilterValues;
  onFilterChange: (newFilters: SecosFilterValues) => void;
  onReset: () => void;
}

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_REPRODUCTIVO: EstatusReproductivo[] = ['Vacía', 'Preñada', 'En espera'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1'];

export const SecosFilterDrawer: React.FC<SecosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Animales Secos"
      onClear={onReset}
    >
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

      {/* Estatus Reproductivo */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus Reproductivo</div>
        <div className="filter-checkbox-list">
          {ALL_REPRODUCTIVO.map(rep => (
            <label key={rep} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.estatusReproductivo.includes(rep)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    estatusReproductivo: toggleArrayItem(filters.estatusReproductivo, rep)
                  })
                }
              />
              <span>{rep}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lotes */}
      <div className="filter-section">
        <div className="filter-section-title">Lotes</div>
        <div className="filter-checkbox-list">
          {ALL_LOTES.map(lote => (
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
