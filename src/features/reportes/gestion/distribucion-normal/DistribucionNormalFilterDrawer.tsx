import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';

export interface DistribucionNormalFilterValues {
  tipo: string;
  variable: string;
  agruparPor: string;
  min: string;
  max: string;
  desde: string;
  hasta: string;
  rebano: string;
  raza: string;
  padre: string;
}

interface DistribucionNormalFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: DistribucionNormalFilterValues;
  onFilterChange: (newFilters: DistribucionNormalFilterValues) => void;
  onReset: () => void;
  availableBreeds?: string[];
}

export const DistribucionNormalFilterDrawer: React.FC<DistribucionNormalFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
  availableBreeds
}) => {
  return (
    <ReportFilterDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros de Distribución Normal"
      onClear={onReset}
    >
      {/* Tipo */}
      <div className="filter-section">
        <div className="filter-section-title">Tipo</div>
        <select
          className="form-control"
          value={filters.tipo}
          onChange={e => onFilterChange({ ...filters, tipo: e.target.value })}
        >
          <option value="Todos">Todos</option>
          <option value="Producción">Producción</option>
          <option value="Crecimiento">Crecimiento</option>
          <option value="Reproducción">Reproducción</option>
        </select>
      </div>

      {/* Agrupar variable por */}
      <div className="filter-section">
        <div className="filter-section-title">Agrupar Variable Por</div>
        <select
          className="form-control"
          value={filters.agruparPor}
          onChange={e => onFilterChange({ ...filters, agruparPor: e.target.value })}
        >
          <option value="Lote">Lote</option>
          <option value="Raza">Raza</option>
          <option value="Año">Año</option>
          <option value="Número de Parto">Número de Parto</option>
        </select>
      </div>

      {/* Rango de Valores Min / Max */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Valores de Variable</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div className="form-group">
            <label style={{ fontSize: 12 }}>Mínimo:</label>
            <input
              type="number"
              placeholder="0"
              className="form-control"
              value={filters.min}
              onChange={e => onFilterChange({ ...filters, min: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: 12 }}>Máximo:</label>
            <input
              type="number"
              placeholder="Sin límite"
              className="form-control"
              value={filters.max}
              onChange={e => onFilterChange({ ...filters, max: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Rango de Fechas */}
      <div className="filter-section">
        <div className="filter-section-title">Rango de Fechas</div>
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

      {/* Rebaños */}
      <div className="filter-section">
        <div className="filter-section-title">Rebaño</div>
        <select
          className="form-control"
          value={filters.rebano}
          onChange={e => onFilterChange({ ...filters, rebano: e.target.value })}
        >
          <option value="Todos los Rebaños">Todos los Rebaños</option>
          <option value="Rebaño de Prueba">Rebaño de Prueba</option>
          <option value="Rebaño Secundario">Rebaño Secundario</option>
        </select>
      </div>

      {/* Razas */}
      <div className="filter-section">
        <div className="filter-section-title">Raza</div>
        <select
          className="form-control"
          value={filters.raza}
          onChange={e => onFilterChange({ ...filters, raza: e.target.value })}
        >
          <option value="Todas las Razas">Todas las Razas</option>
          {availableBreeds && availableBreeds.length > 0 ? (
            availableBreeds.map(r => (
              <option key={r} value={r}>{r}</option>
            ))
          ) : (
            <>
              <option value="Carora">Carora</option>
              <option value="Gyr Lechero">Gyr Lechero</option>
              <option value="Brahman">Brahman</option>
              <option value="Holstein">Holstein</option>
              <option value="Girolando">Girolando</option>
            </>
          )}
        </select>
      </div>

      {/* Padres */}
      <div className="filter-section">
        <div className="filter-section-title">Padre / Semental</div>
        <input
          type="text"
          placeholder="Código o nombre del padre..."
          className="form-control"
          value={filters.padre}
          onChange={e => onFilterChange({ ...filters, padre: e.target.value })}
        />
      </div>
    </ReportFilterDrawer>
  );
};
