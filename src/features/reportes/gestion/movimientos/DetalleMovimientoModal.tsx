import React from 'react';
import { X, Calendar, MapPin, Tag, UserCheck, FileText, CheckCircle } from 'lucide-react';
import { MovimientoEntity } from '../../../../types2/entities';

interface DetalleMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movimiento: MovimientoEntity | null;
}

export const DetalleMovimientoModal: React.FC<DetalleMovimientoModalProps> = ({
  isOpen,
  onClose,
  movimiento
}) => {
  if (!isOpen || !movimiento) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 540 }}>
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
              justifyContent: 'center'
            }}>
              <CheckCircle size={20} color="#2d6a4f" />
            </div>
            <div>
              <h3 className="report-modal-title">Detalle del Movimiento</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Animal: {movimiento.practico} ({movimiento.unico})
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
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--border-gray)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <Calendar size={13} />
                <span>Fecha</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {movimiento.fecha}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <Tag size={13} />
                <span>Tipo</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#0284c7', marginTop: 2 }}>
                {movimiento.tipo}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <MapPin size={13} />
                <span>Origen</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>
                {movimiento.rebanoOrigen} - {movimiento.categoriaOrigen}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <MapPin size={13} />
                <span>Destino / Lote Actual</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#166534', marginTop: 2 }}>
                Lote {movimiento.loteActual} ({movimiento.categoriaActual})
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-secondary)' }}>
                <UserCheck size={13} />
                <span>Técnico Responsable</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                {movimiento.tecnico}
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
              <FileText size={14} color="#6b7280" />
              <span>Observaciones y Comentarios</span>
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: 12,
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              {movimiento.comentario || 'Sin comentarios registrados para este movimiento.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="report-modal-footer">
          <button type="button" className="btn-green-export" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
