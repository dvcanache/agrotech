import React from 'react';
import { X, Settings, CheckSquare } from 'lucide-react';

export interface ColumnSetting {
  key: string;
  label: string;
  visible: boolean;
}

export interface ReportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  columns: ColumnSetting[];
  onToggleColumn: (key: string) => void;
  onResetColumns?: () => void;
}

export const ReportSettingsModal: React.FC<ReportSettingsModalProps> = ({
  isOpen,
  onClose,
  title = 'Configuración de Columnas',
  columns,
  onToggleColumn,
  onResetColumns
}) => {
  if (!isOpen) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={20} color="var(--primary-color)" />
            <h3 className="report-modal-title">{title}</h3>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="report-modal-body">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
            Seleccione las columnas que desea mostrar en la tabla de este reporte:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {columns.map(col => (
              <label
                key={col.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: '6px 10px',
                  backgroundColor: col.visible ? '#f0fdf4' : '#f9fafb',
                  borderRadius: 6,
                  border: col.visible ? '1px solid #bbf7d0' : '1px solid #e5e7eb'
                }}
              >
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => onToggleColumn(col.key)}
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <span style={{ fontWeight: col.visible ? 600 : 400, color: 'var(--text-primary)' }}>
                  {col.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="report-modal-footer">
          {onResetColumns && (
            <button
              type="button"
              className="drawer-clear-btn"
              onClick={onResetColumns}
              style={{ marginRight: 'auto' }}
            >
              <CheckSquare size={14} />
              <span>Mostrar todas</span>
            </button>
          )}
          <button
            type="button"
            className="btn-green-export"
            onClick={onClose}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
