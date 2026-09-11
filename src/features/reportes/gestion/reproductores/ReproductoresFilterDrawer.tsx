import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';

export interface ReproductoresFilterValues {
  categorias: ('Toro' | 'Semen' | 'Embrión')[];
  estatus: ('Activo' | 'Inactivo')[];
  lotes: string[];
  minEficiencia: number;
}

interface ReproductoresFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ReproductoresFilterValues;
  onFilterChange: (newFilters: ReproductoresFilterValues) => void;
  onReset: () => void;
}

const ALL_CATEGORIAS = ['Toro', 'Semen', 'Embrión'] as const;
const ALL_LOTES = ['TERM1', 'ESCT', 'POT1', '01'];

export const ReproductoresFilterDrawer: React.FC<ReproductoresFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleCategoria = (cat: 'Toro' | 'Semen' | 'Embrión') => {
    const exists = filters.categorias.includes(cat);
    const updated = exists
      ? filters.categorias.filter(c => c !== cat)
      : [...filters.categorias, cat];
    onFilterChange({ ...filters, categorias: updated });
  };

  const toggleLote = (lote: string) => {
    const exists = filters.lotes.includes(lote);
    const updated = exists
      ? filters.lotes.filter(l => l !== lote)
      : [...filters.lotes, lote];
    onFilterChange({ ...filters, lotes: updated });
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Reproductores"
      onClear={onReset}
    >
      {/* Categoría */}
      <div className="filter-section">
        <div className="filter-section-title">Tipo de Material</div>
        <div className="filter-checkbox-list">
          {ALL_CATEGORIAS.map(cat => (
            <label key={cat} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.categorias.includes(cat)}
                onChange={() => toggleCategoria(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lotes */}
      <div className="filter-section">
        <div className="filter-section-title">Lote / Ubicación</div>
        <div className="filter-checkbox-list">
          {ALL_LOTES.map(lote => (
            <label key={lote} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.lotes.includes(lote)}
                onChange={() => toggleLote(lote)}
              />
              <span>{lote}</span>
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
