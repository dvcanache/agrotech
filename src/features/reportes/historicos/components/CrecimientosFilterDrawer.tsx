import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal, CategoriaAnimal, TipoPesaje } from '../../../../types2/common';

export interface CrecimientosFilterValues {
  pesoMin?: number;
  pesoMax?: number;
  desde?: string;
  hasta?: string;
  categorias: CategoriaAnimal[];
  tiposPesaje: TipoPesaje[];
  estatus: EstatusAnimal[];
  lotes: string[];
}

interface CrecimientosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: CrecimientosFilterValues;
  onFilterChange: (newFilters: CrecimientosFilterValues) => void;
  onReset: () => void;
}

const ALL_CATEGORIAS: CategoriaAnimal[] = [
  'Becerro',
  'Becerra',
  'Maute',
  'Mauta',
  'Novillo',
  'Novilla',
  'Toro',
  'Vaca'
];

const ALL_TIPOS_PESAJE: TipoPesaje[] = [
  'General',
  'Al nacer',
  'Al destete',
  'Al servicio',
  'Al ingreso',
  'Al parto',
  'Al secado',
  'Al salir'
];

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1'];

export const CrecimientosFilterDrawer: React.FC<CrecimientosFilterDrawerProps> = ({
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
      title="Filtros: Historia de Crecimientos"
      onClear={onReset}
    >
      {/* Rango de Peso (kg) */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Peso (kg)</div>
        <div className="filter-date-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Mínimo</label>
            <input
              type="number"
              min="0"
              max="1500"
              className="form-control"
              placeholder="0 kg"
              value={filters.pesoMin || ''}
              onChange={e =>
                onFilterChange({
                  ...filters,
                  pesoMin: e.target.value ? Number(e.target.value) : undefined
                })
              }
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Máximo</label>
            <input
              type="number"
              min="0"
              max="1500"
              className="form-control"
              placeholder="1000 kg"
              value={filters.pesoMax || ''}
              onChange={e =>
                onFilterChange({
                  ...filters,
                  pesoMax: e.target.value ? Number(e.target.value) : undefined
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Rango de fechas */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Fechas (Pesaje)</div>
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

      {/* Tipo de Pesaje */}
      <div className="filter-section">
        <div className="filter-section-title">Tipo de Pesaje</div>
        <div className="filter-checkbox-list">
          {ALL_TIPOS_PESAJE.map(tp => (
            <label key={tp} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.tiposPesaje.includes(tp)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    tiposPesaje: toggleArrayItem(filters.tiposPesaje, tp)
                  })
                }
              />
              <span>{tp}</span>
            </label>
          ))}
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
