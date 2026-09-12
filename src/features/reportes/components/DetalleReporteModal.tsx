import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, ExternalLink, Calendar, Layers, Clock, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ReporteItem } from './NuevoReporteModal';

interface DetalleReporteModalProps {
  isOpen: boolean;
  onClose: () => void;
  reporte: ReporteItem | null;
}

export const DetalleReporteModal: React.FC<DetalleReporteModalProps> = ({
  isOpen,
  onClose,
  reporte
}) => {
  const navigate = useNavigate();

  if (!isOpen || !reporte) return null;

  const handleOpenLiveReport = () => {
    if (reporte.rutaAsociada) {
      navigate(reporte.rutaAsociada);
      onClose();
    } else {
      alert(`Generando reporte '${reporte.nombre}' con los filtros configurados.`);
    }
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <FileText size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="report-modal-title" style={{ margin: 0 }}>{reporte.nombre}</h3>
                <span style={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 6
                }}>
                  {reporte.codigo}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                Categoría: {reporte.categoria} | Frecuencia: {reporte.frecuencia}
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: 8,
            border: '1px solid var(--border-gray)',
            fontSize: 13,
            lineHeight: 1.5,
            color: 'var(--text-primary)'
          }}>
            <strong>Descripción del Reporte:</strong>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>
              {reporte.descripcion}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: '10px 14px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Formato de Emisión</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{reporte.formato}</strong>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Plantilla Base</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{reporte.plantillaBase || 'Personalizado'}</strong>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Fecha de Creación</span>
              <strong style={{ fontSize: 13, color: 'var(--text-primary)' }}>{reporte.fechaCreacion}</strong>
            </div>

            <div style={{ padding: '10px 14px', backgroundColor: '#fafafa', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'block' }}>Estado del Motor</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#16a34a' }}>
                <CheckCircle2 size={14} /> Listo para Ejecución
              </span>
            </div>
          </div>

          {reporte.rutaAsociada && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ecfdf5',
              borderRadius: 8,
              border: '1px solid #a7f3d0',
              color: '#065f46',
              fontSize: 12.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10
            }}>
              <span>Este reporte está sincronizado con la vista de datos en vivo de AgroTech.</span>
              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenLiveReport}
                style={{ fontSize: 12, padding: '6px 12px', flexShrink: 0 }}
              >
                <ExternalLink size={14} />
                <span>Abrir Vista en Vivo</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="report-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleOpenLiveReport}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ExternalLink size={15} />
            <span>Ejecutar Reporte</span>
          </button>
        </div>
      </div>
    </div>
  );
};
