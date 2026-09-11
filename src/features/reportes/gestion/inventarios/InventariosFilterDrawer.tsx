import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { CategoriaAnimal, EstatusAnimal } from '../../../../types2/common';

export interface InventariosFilterValues {
  lotes: string[];
  estatus: EstatusAnimal[];
  categorias: CategoriaAnimal[];
  fechaCorte: string;
}

interface InventariosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InventariosFilterValues;
  onFilterChange: (newFilters: InventariosFilterValues) => void;
  onReset: () => void;
}

const ALL_LOTES = ['ESCT', 'POT1', 'SEC1', '01'];
const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_CATEGORIAS: CategoriaAnimal[] = [
  'Becerra',
  'Mauta',
  'Novilla',
  'Vaca',
  'Becerro',
  'Maute',
  'Novillo',
  'Toro'
];

export const InventariosFilterDrawer: React.FC<InventariosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleLote = (lote: string) => {
    const exists = filters.lotes.includes(lote);
    const updated = exists
      ? filters.lotes.filter(l => l !== lote)
      : [...filters.lotes, lote];
    onFilterChange({ ...filters, lotes: updated });
  };

  const toggleEstatus = (estatus: EstatusAnimal) => {
    const exists = filters.estatus.includes(estatus);
    const updated = exists
      ? filters.estatus.filter(e => e !== estatus)
      : [...filters.estatus, estatus];
    onFilterChange({ ...filters, estatus: updated });
  };

  const toggleCategoria = (cat: CategoriaAnimal) => {
    const exists = filters.categorias.includes(cat);
    const updated = exists
      ? filters.categorias.filter(c => c !== cat)
      : [...filters.categorias, cat];
    onFilterChange({ ...filters, categorias: updated });
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Inventario"
      onClear={onReset}
    >
      {/* Fecha de corte */}
      <div className="filter-section">
        <div className="filter-section-title">Fecha de Corte</div>
        <input
          type="date"
          className="form-control"
          value={filters.fechaCorte}
          onChange={e => onFilterChange({ ...filters, fechaCorte: e.target.value })}
        />
      </div>

      {/* Lotes / Locaciones */}
      <div className="filter-section">
        <div className="filter-section-title">Locaciones / Lotes</div>
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

      {/* Estatus */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus</div>
        <div className="filter-checkbox-list">
          {ALL_ESTATUS.map(st => (
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

      {/* Categorías */}
      <div className="filter-section">
        <div className="filter-section-title">Categorías de Animal</div>
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
    </ReportFilterDrawer>
  );
};
