import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal } from '../../../../types2/common';

export type CategoriaNoVientres =
  | 'Becerra'
  | 'Mauta'
  | 'Becerro'
  | 'Maute'
  | 'Novillo'
  | 'Lechón'
  | 'Bucerro'
  | 'Cabrito'
  | 'Pollo de engorde';

export interface NoVientresFilterValues {
  categorias: (CategoriaNoVientres | string)[];
  estatus: EstatusAnimal[];
  lotes: string[];
}

interface NoVientresFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: NoVientresFilterValues;
  onFilterChange: (newFilters: NoVientresFilterValues) => void;
  onReset: () => void;
  lotesDisponibles?: string[];
}

export const ALL_CATEGORIAS: CategoriaNoVientres[] = [
  'Becerra',
  'Mauta',
  'Becerro',
  'Maute',
  'Novillo',
  'Lechón',
  'Bucerro',
  'Cabrito',
  'Pollo de engorde'
];

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1', 'BUF-01', 'PIARA-01', 'APR-01', 'CAB-01', 'GALP-04', 'GALP-05'];

export const NoVientresFilterDrawer: React.FC<NoVientresFilterDrawerProps> = ({
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
      title="Filtros de No Vientres"
      onClear={onReset}
    >
      {/* Categorías */}
      <div className="filter-section">
        <div className="filter-section-title">Categoría de Levante / Crecimiento</div>
        <div className="filter-checkbox-list">
          {ALL_CATEGORIAS.map(cat => (
            <label key={cat} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.categorias.includes(cat)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    categorias: toggleArrayItem(filters.categorias, cat)
                  })
                }
              />
              <span>{cat}</span>
            </label>
          ))}
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
