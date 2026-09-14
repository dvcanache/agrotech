import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';
import { EstatusAnimal } from '../../../../types2/common';

export interface ProximosDiasFilterValues {
  proximosDiasMaximo: number;
  categorias?: ('Novilla' | 'Vaca')[];
  estatus: EstatusAnimal[];
  lotes: string[];
}

interface ProximosDiasFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  filters: ProximosDiasFilterValues;
  onFilterChange: (newFilters: ProximosDiasFilterValues) => void;
  onReset: () => void;
  showCategoryFilter?: boolean;
  lotesDisponibles?: string[];
}

const ALL_CATEGORIAS: ('Novilla' | 'Vaca')[] = ['Novilla', 'Vaca'];
const ALL_ESTATUS: EstatusAnimal[] = ['Activo', 'Inactivo', 'Referencia'];
const ALL_LOTES = ['01', 'ESCT', 'POT1', 'SEC1', 'GALP-01', 'GALP-03', 'PIARA-01', 'APR-01', 'BUF-01', 'CAB-01'];

export const ProximosDiasFilterDrawer: React.FC<ProximosDiasFilterDrawerProps> = ({
  isOpen,
  onClose,
  title,
  filters,
  onFilterChange,
  onReset,
  showCategoryFilter = true,
  lotesDisponibles
}) => {
  const lotesOptions = lotesDisponibles && lotesDisponibles.length > 0 ? lotesDisponibles : ALL_LOTES;

  const toggleArrayItem = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onClear={onReset}
    >
      {/* Próximos Días (Máximo) */}
      <div className="filter-section">
        <div className="filter-section-title">Próximos Días (Máximo)</div>
        <div className="form-group">
          <input
            type="number"
            min="1"
            max="365"
            className="form-control"
            value={filters.proximosDiasMaximo}
            onChange={e =>
              onFilterChange({
                ...filters,
                proximosDiasMaximo: Number(e.target.value) || 30
              })
            }
          />
          <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            Mostrar eventos proyectados dentro de los próximos {filters.proximosDiasMaximo} días.
          </span>
        </div>
      </div>

      {/* Categoría */}
      {showCategoryFilter && (
        <div className="filter-section">
          <div className="filter-section-title">Categoría</div>
          <div className="filter-checkbox-list">
            {ALL_CATEGORIAS.map(cat => (
              <label key={cat} className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.categorias?.includes(cat) ?? false}
                  onChange={() =>
                    onFilterChange({
                      ...filters,
                      categorias: toggleArrayItem(filters.categorias || [], cat)
                    })
                  }
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

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
          {lotesOptions.map(lote => (
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
