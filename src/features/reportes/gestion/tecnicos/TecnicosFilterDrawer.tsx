import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';

export interface TecnicosFilterValues {
  desde: string;
  hasta: string;
  estatus: ('Activo' | 'Inactivo')[];
  minEficiencia: number;
}

interface TecnicosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TecnicosFilterValues;
  onFilterChange: (newFilters: TecnicosFilterValues) => void;
  onReset: () => void;
}

export const TecnicosFilterDrawer: React.FC<TecnicosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleEstatus = (st: 'Activo' | 'Inactivo') => {
    const exists = filters.estatus.includes(st);
    const updated = exists
      ? filters.estatus.filter(e => e !== st)
      : [...filters.estatus, st];
    onFilterChange({ ...filters, estatus: updated });
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Técnicos"
      onClear={onReset}
    >
      {/* Rango de Fechas */}
      <div className="filter-section">
        <div className="filter-section-title">Período de Evaluación</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="form-group">
            <label style={{ fontSize: 12 }}>Desde:</label>
            <input
              type="date"
              className="form-control"
              value={filters.desde}
              onChange={e => onFilterChange({ ...filters, desde: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: 12 }}>Hasta:</label>
            <input
              type="date"
              className="form-control"
              value={filters.hasta}
              onChange={e => onFilterChange({ ...filters, hasta: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Estatus */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus</div>
        <div className="filter-checkbox-list">
          {(['Activo', 'Inactivo'] as const).map(st => (
            <label key={st} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.estatus.includes(st)}
                onChange={() => toggleEstatus(st)}
              />
              <span>{st}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Eficiencia mínima */}
      <div className="filter-section">
        <div className="filter-section-title">Eficiencia Mínima (%)</div>
        <div className="form-group">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={filters.minEficiencia}
            onChange={e => onFilterChange({ ...filters, minEficiencia: Number(e.target.value) })}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)' }}>
            <span>0%</span>
            <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>
              ≥ {filters.minEficiencia}%
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </ReportFilterDrawer>
  );
};
