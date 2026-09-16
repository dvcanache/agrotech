import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal } from '../../../../types2/common';

export interface InventariosFilterValues {
  lotes: string[];
  estatus: EstatusAnimal[];
  categorias: string[];
  fechaCorte: string;
}

interface InventariosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: InventariosFilterValues;
  onFilterChange: (newFilters: InventariosFilterValues) => void;
  onReset: () => void;
  availableLotes?: { codigo: string; nombre: string }[];
  availableCategorias?: { key: string; label: string }[];
}

const DEFAULT_LOTES = [
  { codigo: 'ESCT', nombre: 'ESCT - Escotero' },
  { codigo: 'POT1', nombre: 'POT1 - Potrero 1' },
  { codigo: 'SEC1', nombre: 'SEC1 - Secas 1' },
  { codigo: '01', nombre: '01 - Lote 01' }
];
const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const DEFAULT_CATEGORIAS = [
  { key: 'Becerra', label: 'Becerra' },
  { key: 'Mauta', label: 'Mauta' },
  { key: 'Novilla', label: 'Novilla' },
  { key: 'Vaca', label: 'Vaca' },
  { key: 'Becerro', label: 'Becerro' },
  { key: 'Maute', label: 'Maute' },
  { key: 'Novillo', label: 'Novillo' },
  { key: 'Toro', label: 'Toro' }
];

export const InventariosFilterDrawer: React.FC<InventariosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  availableLotes = DEFAULT_LOTES,
  availableCategorias = DEFAULT_CATEGORIAS
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

  const toggleCategoria = (catKey: string) => {
    const exists = filters.categorias.includes(catKey);
    const updated = exists
      ? filters.categorias.filter(c => c !== catKey)
      : [...filters.categorias, catKey];
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
          {availableLotes.map(lote => (
            <label key={lote.codigo} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.lotes.includes(lote.codigo)}
                onChange={() => toggleLote(lote.codigo)}
              />
              <span>{lote.nombre || lote.codigo}</span>
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
          {availableCategorias.map(cat => (
            <label key={cat.key} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.categorias.includes(cat.key)}
                onChange={() => toggleCategoria(cat.key)}
              />
              <span>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>
    </ReportFilterDrawer>
  );
};
