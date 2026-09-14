import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Settings,
  Filter,
  FileSpreadsheet,
  Printer,
  ChevronDown
} from 'lucide-react';

export interface ReportViewHeaderProps {
  title: string;
  backRoute?: string;
  onFilterToggle?: () => void;
  isFilterOpen?: boolean;
  activeFiltersCount?: number;
  onExportXLSX?: () => void;
  onExportPDF?: () => void;
  onSettingsClick?: () => void;
  exportDisabled?: boolean;
  extraActions?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export const ReportViewHeader: React.FC<ReportViewHeaderProps> = ({
  title,
  backRoute = '/reportes',
  onFilterToggle,
  isFilterOpen = false,
  activeFiltersCount = 0,
  onExportXLSX,
  onExportPDF,
  onSettingsClick,
  exportDisabled = false,
  extraActions,
  primaryAction
}) => {
  const navigate = useNavigate();

  return (
    <div className="report-view-header">
      {/* Left section: back button & title */}
      <div className="report-header-left">
        <button
          type="button"
          className="report-back-btn"
          onClick={() => navigate(backRoute)}
          title="Regresar al Centro de Reportes"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span>{title}</span>
        </button>
      </div>

      {/* Middle & Right section: controls & actions */}
      <div className="report-header-right">
        {/* Custom view-specific actions (e.g. Análisis de Inventario or Selector de Criterio) */}
        {extraActions}

        {/* Primary Action Button if configured */}
        {primaryAction && (
          <button
            type="button"
            className="btn-amber-action"
            onClick={primaryAction.onClick}
          >
            {primaryAction.icon}
            <span>{primaryAction.label}</span>
          </button>
        )}

        {/* Settings Button */}
        <button
          type="button"
          className="btn-blue-icon"
          onClick={onSettingsClick || (() => alert('Configuración de columnas y visualización del reporte'))}
          title="Configuración de vista"
        >
          <Settings size={16} />
          <ChevronDown size={12} />
        </button>

        {/* Filter Toggle Button */}
        {onFilterToggle && (
          <button
            type="button"
            className="btn-blue-icon"
            onClick={onFilterToggle}
            title={isFilterOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
            style={{ backgroundColor: isFilterOpen ? '#0369a1' : '#0284c7' }}
          >
            <Filter size={16} />
            <ChevronDown size={12} />
            {activeFiltersCount > 0 && (
              <span className="badge-active-filter">{activeFiltersCount}</span>
            )}
          </button>
        )}

        {/* Export PDF Button */}
        {onExportPDF && (
          <button
            type="button"
            className="btn-pdf-export"
            onClick={onExportPDF}
            disabled={exportDisabled}
            title="Exportar reporte en formato PDF / Imprimir"
          >
            <Printer size={16} />
            <span>Exportar PDF</span>
          </button>
        )}

        {/* Export XLSX Button */}
        <button
          type="button"
          className="btn-green-export"
          onClick={onExportXLSX}
          disabled={exportDisabled}
          title="Descargar reporte en formato Excel / CSV"
        >
          <FileSpreadsheet size={16} />
          <span>Descargar XLSX</span>
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
};
