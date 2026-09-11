import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { MOCK_REBANOS_CATALOGO } from '../multirebanosMockData';

export interface MultirebanoFilterValues {
  rebanosIds: string[];
  fechaCorte?: string;
  desde?: string;
  hasta?: string;
}

interface MultirebanoFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MultirebanoFilterValues;
  onFilterChange: (newFilters: MultirebanoFilterValues) => void;
  onReset: () => void;
  showDateRange?: boolean;
  showFechaCorte?: boolean;
}

export const MultirebanoFilterDrawer: React.FC<MultirebanoFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  showDateRange = false,
  showFechaCorte = true
}) => {
  const toggleHerd = (id: string) => {
    const isChecked = filters.rebanosIds.includes(id);
    const updated = isChecked
      ? filters.rebanosIds.filter(item => item !== id)
      : [...filters.rebanosIds, id];
    onFilterChange({ ...filters, rebanosIds: updated });
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros Multi-Rebaño"
      onClear={onReset}
    >
      {/* Fecha de Corte */}
      {showFechaCorte && (
        <div className="filter-section">
          <div className="filter-section-title">Fecha de Corte</div>
          <div className="form-group">
            <input
              type="date"
              className="form-control"
              value={filters.fechaCorte || ''}
              onChange={e =>
                onFilterChange({ ...filters, fechaCorte: e.target.value || undefined })
              }
            />
            <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Consolida la información zootécnica a la fecha seleccionada.
            </span>
          </div>
        </div>
      )}

      {/* Rango de Fechas */}
      {showDateRange && (
        <div className="filter-section">
          <div className="filter-section-title">Rango de Fechas</div>
          <div className="filter-date-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Desde</label>
              <input
                type="date"
                className="form-control"
                value={filters.desde || ''}
                onChange={e =>
                  onFilterChange({ ...filters, desde: e.target.value || undefined })
                }
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Hasta</label>
              <input
                type="date"
                className="form-control"
                value={filters.hasta || ''}
                onChange={e =>
                  onFilterChange({ ...filters, hasta: e.target.value || undefined })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Selección de Rebaños */}
      <div className="filter-section">
        <div className="filter-section-title">Rebaños Activos</div>
        <div className="filter-checkbox-list">
          {MOCK_REBANOS_CATALOGO.map(r => (
            <label key={r.id} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.rebanosIds.includes(r.id)}
                onChange={() => toggleHerd(r.id)}
              />
              <span>{r.nombre}</span>
            </label>
          ))}
        </div>
      </div>
    </ReportFilterDrawer>
  );
};
