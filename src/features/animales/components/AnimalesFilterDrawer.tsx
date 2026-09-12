import React from 'react';
import { ReportFilterDrawer } from '../../reportes/components/ReportFilterDrawer';

export interface AnimalesFilterValues {
  categorias: string[];
  estatus: string[];
  lotes: string[];
  raza: string;
}

interface AnimalesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: AnimalesFilterValues;
  onFilterChange: (newFilters: AnimalesFilterValues) => void;
  onReset: () => void;
}

const ALL_CATEGORIAS = [
  'Vaca',
  'Novilla',
  'Mauta',
  'Maute',
  'Becerra',
  'Becerro',
  'Toro',
  'Novillo'
];

const ALL_ESTATUS = ['Activo', 'Inactivo'];
const ALL_LOTES = ['01', '02', 'Lote Maternidad', 'Lote Ceba', 'Lote Ordeño', 'Escotero'];
const ALL_RAZAS = [
  'Todas las razas',
  'Brahman',
  'Carora',
  'Gyr Lechero',
  'Girolando',
  'Pardo Suizo',
  'Mestizo Doble Propósito'
];

export const AnimalesFilterDrawer: React.FC<AnimalesFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleCategoria = (cat: string) => {
    const exists = filters.categorias.includes(cat);
    const updated = exists
      ? filters.categorias.filter(c => c !== cat)
      : [...filters.categorias, cat];
    onFilterChange({ ...filters, categorias: updated });
  };

  const toggleEstatus = (st: string) => {
    const exists = filters.estatus.includes(st);
    const updated = exists
      ? filters.estatus.filter(s => s !== st)
      : [...filters.estatus, st];
    onFilterChange({ ...filters, estatus: updated });
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
      title="Filtros de Animales"
      onClear={onReset}
    >
      {/* Categoría */}
      <div className="filter-section">
        <div className="filter-section-title">Categoría Zootécnica</div>
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

      {/* Estatus */}
      <div className="filter-section">
        <div className="filter-section-title">Estatus Operativo</div>
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

      {/* Lote */}
      <div className="filter-section">
        <div className="filter-section-title">Lote de Ubicación</div>
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

      {/* Raza / Composición */}
      <div className="filter-section">
        <div className="filter-section-title">Raza Predominante</div>
        <select
          className="form-select"
          value={filters.raza}
          onChange={e => onFilterChange({ ...filters, raza: e.target.value })}
        >
          {ALL_RAZAS.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </ReportFilterDrawer>
  );
};
