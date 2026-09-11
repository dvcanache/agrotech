import React, { useEffect } from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';

export interface ReportFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onClear: () => void;
  onApply?: () => void;
  children: React.ReactNode;
}

export const ReportFilterDrawer: React.FC<ReportFilterDrawerProps> = ({
  isOpen,
  onClose,
  title = 'Filtros del Reporte',
  onClear,
  onApply,
  children
}) => {
  // Manejo de tecla Escape para cerrar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside
        className="filter-drawer-panel"
        onClick={e => e.stopPropagation()}
        aria-label="Panel de Filtros"
      >
        {/* Encabezado del cajón */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <Filter size={18} color="var(--primary-color)" />
            <span>{title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className="drawer-clear-btn"
              onClick={onClear}
              title="Restablecer todos los filtros"
            >
              <RotateCcw size={14} />
              <span>Limpiar filtros</span>
            </button>
            <button
              type="button"
              className="report-modal-close-btn"
              onClick={onClose}
              title="Cerrar panel"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cuerpo con los controles de filtro */}
        <div className="drawer-body">
          {children}
        </div>

        {/* Pie con botones de acción */}
        <div className="drawer-footer">
          <button
            type="button"
            className="btn-green-export"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => {
              if (onApply) onApply();
              onClose();
            }}
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            className="btn-amber-action"
            style={{ backgroundColor: '#6b7280', boxShadow: 'none' }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </aside>
    </div>
  );
};
