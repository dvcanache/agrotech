import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal } from '../../../../types2/common';

export interface LactanciasFilterValues {
  lactanciaMin?: number;
  lactanciaMax?: number;
  desde?: string;
  hasta?: string;
  categorias: ('Novilla' | 'Vaca')[];
  estatus: EstatusAnimal[];
  lotes: string[];
}

interface LactanciasFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: LactanciasFilterValues;
  onFilterChange: (newFilters: LactanciasFilterValues) => void;
  onReset: () => void;
}

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_CATEGORIAS: ('Novilla' | 'Vaca')[] = ['Vaca', 'Novilla'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1'];

export const LactanciasFilterDrawer: React.FC<LactanciasFilterDrawerProps> = ({
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
      title="Filtros: Historia de Lactancias"
      onClear={onReset}
    >
      {/* Rango de Número de Lactancia */}
      <div className="filter-section">
        <div className="filter-section-title">Número de Lactancia</div>
        <div className="filter-date-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Mínimo</label>
            <input
              type="number"
              min="1"
              max="20"
              className="form-control"
              placeholder="1"
              value={filters.lactanciaMin || ''}
              onChange={e =>
                onFilterChange({
                  ...filters,
                  lactanciaMin: e.target.value ? Number(e.target.value) : undefined
                })
              }
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Máximo</label>
            <input
              type="number"
              min="1"
              max="20"
              className="form-control"
              placeholder="10"
              value={filters.lactanciaMax || ''}
              onChange={e =>
                onFilterChange({
                  ...filters,
                  lactanciaMax: e.target.value ? Number(e.target.value) : undefined
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Fechas (Inicio Lactancia)</div>
        <div className="filter-date-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Desde</label>
            <input
              type="date"
              className="form-control"
              value={filters.desde || ''}
              onChange={e => onFilterChange({ ...filters, desde: e.target.value || undefined })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Hasta</label>
            <input
              type="date"
              className="form-control"
              value={filters.hasta || ''}
              onChange={e => onFilterChange({ ...filters, hasta: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>

      {/* Categoría */}
      <div className="filter-section">
        <div className="filter-section-title">Categoría</div>
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
          {ALL_LOTES.map(l => (
            <label key={l} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.lotes.includes(l)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    lotes: toggleArrayItem(filters.lotes, l)
                  })
                }
              />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </div>
    </ReportFilterDrawer>
  );
};
