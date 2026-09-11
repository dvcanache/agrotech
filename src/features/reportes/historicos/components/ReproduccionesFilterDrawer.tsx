import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal, TipoEventoReproductivo } from '../../../../types2/common';

export interface ReproduccionesFilterValues {
  desde?: string;
  hasta?: string;
  tipoEvento: TipoEventoReproductivo[];
  estatus: EstatusAnimal[];
  categorias: ('Novilla' | 'Vaca')[];
  lotes: string[];
}

interface ReproduccionesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ReproduccionesFilterValues;
  onFilterChange: (newFilters: ReproduccionesFilterValues) => void;
  onReset: () => void;
}

const ALL_TIPOS_EVENTO: TipoEventoReproductivo[] = [
  'Parto',
  'Servicio',
  'Revisión',
  'Aborto',
  'Celo',
  'Embrión'
];

const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_CATEGORIAS: ('Novilla' | 'Vaca')[] = ['Vaca', 'Novilla'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1'];

export const ReproduccionesFilterDrawer: React.FC<ReproduccionesFilterDrawerProps> = ({
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
      title="Filtros: Historia de Reproducciones"
      onClear={onReset}
    >
      {/* Rango de fechas */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Fechas</div>
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

      {/* Tipo de Evento */}
      <div className="filter-section">
        <div className="filter-section-title">Tipo de Evento</div>
        <div className="filter-checkbox-list">
          {ALL_TIPOS_EVENTO.map(t => (
            <label key={t} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.tipoEvento.includes(t)}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    tipoEvento: toggleArrayItem(filters.tipoEvento, t)
                  })
                }
              />
              <span>{t}</span>
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
