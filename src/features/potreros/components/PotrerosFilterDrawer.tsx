import React from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { PASTURE_SPECIES_OPTIONS } from '../potrerosData';

export interface PotrerosFilterState {
  estatus: string;
  especieForrajera: string;
  areaMin: string;
  areaMax: string;
  conLote: string; // 'todos' | 'con_lote' | 'sin_lote'
}

interface PotrerosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PotrerosFilterState;
  onChange: (newFilters: PotrerosFilterState) => void;
  onReset: () => void;
}

export const PotrerosFilterDrawer: React.FC<PotrerosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset
}) => {
  if (!isOpen) return null;

  return (
    <div className="filter-drawer-backdrop" onClick={onClose}>
      <div className="filter-drawer" onClick={e => e.stopPropagation()}>
        <div className="filter-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Filter size={18} color="var(--primary-color)" />
            <h3 className="filter-drawer-title">Filtros de Potreros</h3>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="filter-drawer-body">
          {/* Estatus */}
          <div className="filter-group">
            <label className="filter-label">Estatus del Potrero</label>
            <select
              className="filter-input"
              value={filters.estatus}
              onChange={e => onChange({ ...filters, estatus: e.target.value })}
            >
              <option value="">Todos los estatus</option>
              <option value="Activo">Activo</option>
              <option value="En descanso">En descanso</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="En siembra">En siembra</option>
            </select>
          </div>

          {/* Especie Forrajera */}
          <div className="filter-group">
            <label className="filter-label">Especie Forrajera</label>
            <select
              className="filter-input"
              value={filters.especieForrajera}
              onChange={e => onChange({ ...filters, especieForrajera: e.target.value })}
            >
              <option value="">Todas las especies</option>
              {PASTURE_SPECIES_OPTIONS.map(specie => (
                <option key={specie} value={specie}>{specie}</option>
              ))}
            </select>
          </div>

          {/* Rango de Superficie */}
          <div className="filter-group">
            <label className="filter-label">Superficie (Hectáreas)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                type="number"
                placeholder="Mín ha"
                className="filter-input"
                value={filters.areaMin}
                onChange={e => onChange({ ...filters, areaMin: e.target.value })}
              />
              <input
                type="number"
                placeholder="Máx ha"
                className="filter-input"
                value={filters.areaMax}
                onChange={e => onChange({ ...filters, areaMax: e.target.value })}
              />
            </div>
          </div>

          {/* Ocupación / Lote */}
          <div className="filter-group">
            <label className="filter-label">Asignación de Lote</label>
            <select
              className="filter-input"
              value={filters.conLote}
              onChange={e => onChange({ ...filters, conLote: e.target.value })}
            >
              <option value="todos">Todos los potreros</option>
              <option value="con_lote">Solo con lote asignado (pastando)</option>
              <option value="sin_lote">Solo sin lote asignado (vacíos)</option>
            </select>
          </div>
        </div>

        <div className="filter-drawer-footer">
          <button type="button" className="btn-secondary" onClick={onReset} style={{ flex: 1 }}>
            <RotateCcw size={15} />
            <span>Restablecer</span>
          </button>
          <button type="button" className="btn-primary" onClick={onClose} style={{ flex: 1 }}>
            <span>Aplicar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
