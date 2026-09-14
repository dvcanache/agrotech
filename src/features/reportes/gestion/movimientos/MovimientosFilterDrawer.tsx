import React from 'react';
import { ReportFilterDrawer } from '../../components/ReportFilterDrawer';

export interface MovimientosFilterValues {
  desde: string;
  hasta: string;
  tipos: string[];
  lotes: string[];
  tecnico: string;
}

interface MovimientosFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MovimientosFilterValues;
  onFilterChange: (newFilters: MovimientosFilterValues) => void;
  onReset: () => void;
}

const ALL_TIPOS = [
  'Cambio de Lote',
  'Cambio de Rebaño',
  'Cambio de Categoría',
  'Entrada por Nacimiento',
  'Entrada por Compra',
  'Salida por Venta',
  'Salida por Descarte'
];

const ALL_LOTES = ['ESCT', 'POT1', 'SEC1', '01'];

export const MovimientosFilterDrawer: React.FC<MovimientosFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset
}) => {
  const toggleTipo = (tipo: string) => {
    const exists = filters.tipos.includes(tipo);
    const updated = exists
      ? filters.tipos.filter(t => t !== tipo)
      : [...filters.tipos, tipo];
    onFilterChange({ ...filters, tipos: updated });
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
      title="Filtros de Movimientos"
      onClear={onReset}
    >
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

      {/* Tipos de Movimiento */}
      <div className="filter-section">
        <div className="filter-section-title">Tipo de Movimiento</div>
        <div className="filter-checkbox-list">
          {ALL_TIPOS.map(t => (
            <label key={t} className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.tipos.includes(t)}
                onChange={() => toggleTipo(t)}
              />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lotes */}
      <div className="filter-section">
        <div className="filter-section-title">Lote Actual</div>
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

      {/* Técnico */}
      <div className="filter-section">
        <div className="filter-section-title">Técnico Responsable</div>
        <select
          className="form-control"
          value={filters.tecnico}
          onChange={e => onFilterChange({ ...filters, tecnico: e.target.value })}
        >
          <option value="">Todos los técnicos</option>
          <option value="JHON JAIRO RESTREPO">JHON JAIRO RESTREPO</option>
          <option value="ALEJANDRA DURAN">ALEJANDRA DURAN</option>
          <option value="AUGUSTO RODRIGUEZ">AUGUSTO RODRIGUEZ</option>
          <option value="MARIA VICTORIA PEREZ">MARIA VICTORIA PEREZ</option>
          <option value="PEDRO PAREDES">PEDRO PAREDES</option>
          <option value="SANTOS MICHELENA">SANTOS MICHELENA</option>
          <option value="TULIO HERNANDEZ">TULIO HERNANDEZ</option>
          <option value="ZULAY BERRUETA">ZULAY BERRUETA</option>
        </select>
      </div>
    </ReportFilterDrawer>
  );
};
