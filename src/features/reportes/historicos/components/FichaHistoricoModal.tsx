import React from 'react';
import { X, Calendar, FileText, Activity } from 'lucide-react';

export interface HistoricoModalData {
  tipo: 'reproduccion' | 'lactancia' | 'pesajeLeche' | 'crecimiento';
  titulo: string;
  practico: string;
  unico: string;
  categoria: string;
  estatus: string;
  lote: string;
  fecha: string;
  detalles: Array<{ label: string; value: string | number | undefined | null }>;
  observaciones?: string;
}

interface FichaHistoricoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: HistoricoModalData | null;
}

export const FichaHistoricoModal: React.FC<FichaHistoricoModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
            >
              <Activity size={22} />
            </div>
            <div>
              <h3 className="report-modal-title">{data.titulo}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                  {data.practico}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  ({data.unico})
                </span>
                <span className="badge-category" style={{ fontSize: 11 }}>
                  {data.categoria}
                </span>
                <span className={`badge-status ${data.estatus.toLowerCase()}`} style={{ fontSize: 11 }}>
                  {data.estatus}
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Metadata banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              padding: '10px 14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#475569' }}>
              <Calendar size={15} color="#64748b" />
              <span>Fecha del Registro: <strong>{data.fecha}</strong></span>
            </div>
            <div style={{ fontSize: 12.5, color: '#475569' }}>
              Lote: <strong style={{ color: '#166534' }}>{data.lote}</strong>
            </div>
          </div>

          {/* Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12
            }}
          >
            {data.detalles.map((d, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 6
                }}
              >
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                  {d.value !== undefined && d.value !== null && d.value !== '' ? d.value : '-'}
                </div>
              </div>
            ))}
          </div>

          {/* Observaciones */}
          {data.observaciones && (
            <div
              style={{
                backgroundColor: '#fefce8',
                border: '1px solid #fef08a',
                borderRadius: 6,
                padding: '12px 14px',
                fontSize: 12.5,
                color: '#854d0e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, marginBottom: 4 }}>
                <FileText size={15} />
                Observaciones / Diagnóstico:
              </div>
              <p style={{ margin: 0 }}>{data.observaciones}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="report-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
