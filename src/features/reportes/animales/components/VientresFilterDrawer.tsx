import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal, EstatusReproductivo, EstatusProductivo } from '../../../../types2/common';

export interface VientresFilterValues {
  categorias: string[];
  estatus: EstatusAnimal[];
  estatusReproductivo: EstatusReproductivo[];
  estatusProductivo: EstatusProductivo[];
  lotes: string[];
}

interface VientresFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: VientresFilterValues;
  onFilterChange: (newFilters: VientresFilterValues) => void;
  onReset: () => void;
  availableCategorias?: string[];
}

const DEFAULT_CATEGORIAS: string[] = [
  'Novilla', 'Vaca',
  'Cerda Reproductora', 'Cerda de Reemplazo',
  'Búfala', 'Bubilla',
  'Cabra Lechera', 'Cabritona',
  'Yegua',
  'Gallina Ponedora', 'Pava', 'Pata', 'Gallina Fina'
];
const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_REPRODUCTIVO: EstatusReproductivo[] = ['Vacía', 'Preñada', 'En espera'];
const ALL_PRODUCTIVO: EstatusProductivo[] = ['Criando', 'Ordeño', 'Seca', 'Lactancia', 'Postura', 'En Producción'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1', 'TERM1', 'GALP-01', 'GALP-02', 'PIARA-01', 'CAB-01', 'APR-01'];

export const VientresFilterDrawer: React.FC<VientresFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  availableCategorias
}) => {
  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  const catsToRender = availableCategorias || DEFAULT_CATEGORIAS;

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Vientres"
      onClear={onReset}
    >
      {/* Categoría */}
      <div className="filter-section">
        <div className="filter-section-title">Categoría</div>
        <div className="filter-checkbox-list">
          {catsToRender.map(cat => (
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

      {/* Estatus Productivo */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus Productivo</div>
        <div className="filter-checkbox-list">
          {ALL_PRODUCTIVO.map(prod => (
            <label key={prod} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.estatusProductivo.includes(prod)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    estatusProductivo: toggleArrayItem(filters.estatusProductivo, prod)
                  })
                }
              />
              <span>{prod}</span>
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
