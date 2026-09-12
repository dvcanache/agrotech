import React from 'react';
import { Search, Filter, FileSpreadsheet, FileText, Plus } from 'lucide-react';

interface PotrerosToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenFilter: () => void;
  onOpenNewModal: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  hasActiveFilters: boolean;
  totalRecords: number;
}

export const PotrerosToolbar: React.FC<PotrerosToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onOpenFilter,
  onOpenNewModal,
  onExportExcel,
  onExportPdf,
  hasActiveFilters,
  totalRecords
}) => {
  return (
    <div className="animales-toolbar" style={{ flexWrap: 'wrap', gap: 12 }}>
      {/* Search Input */}
      <div className="search-container" style={{ minWidth: 260 }}>
        <Search className="search-icon" size={18} />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por código, potrero o pasto..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div className="toolbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Filter Drawer Trigger */}
        <button
          type="button"
          className={`btn-secondary ${hasActiveFilters ? 'active' : ''}`}
          onClick={onOpenFilter}
          title="Filtrar potreros"
          style={{ position: 'relative' }}
        >
          <Filter size={16} />
          <span>Filtros</span>
          {hasActiveFilters && (
            <span style={{
              width: 8,
              height: 8,
              backgroundColor: 'var(--primary-color)',
              borderRadius: '50%',
              display: 'inline-block',
              marginLeft: 4
            }} />
          )}
        </button>

        {/* Export Excel */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onExportExcel}
          title="Descargar reporte en Excel (.xlsx)"
        >
          <FileSpreadsheet size={16} />
          <span>XLSX</span>
        </button>

        {/* Export PDF */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onExportPdf}
          title="Descargar reporte en PDF (.pdf)"
        >
          <FileText size={16} />
          <span>PDF</span>
        </button>

        {/* New Paddock Button */}
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenNewModal}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Nuevo Potrero</span>
        </button>
      </div>
    </div>
  );
};
