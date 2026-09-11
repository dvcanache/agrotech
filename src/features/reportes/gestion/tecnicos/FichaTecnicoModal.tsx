import React from 'react';
import { X, User, Award, CheckCircle, TrendingUp, Calendar, Zap } from 'lucide-react';
import { TecnicoEntity } from '../../../../types2/entities';

interface FichaTecnicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tecnico: TecnicoEntity | null;
}

export const FichaTecnicoModal: React.FC<FichaTecnicoModalProps> = ({
  isOpen,
  onClose,
  tecnico
}) => {
  if (!isOpen || !tecnico) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog modal-large" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#0284c7'
            }}>
              {tecnico.codigo}
            </div>
            <div>
              <h3 className="report-modal-title">{tecnico.nombre}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span className={`badge-status ${tecnico.estatus.toLowerCase()}`}>
                  {tecnico.estatus}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Inseminador & Técnico Reproductivo
                </span>
              </div>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="report-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top KPI Cards */}
          <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Eficiencia Reproductiva</span>
              <span className="stat-kpi-value" style={{ color: '#16a34a' }}>
                {tecnico.eficienciaPorcentaje}%
              </span>
              <span style={{ fontSize: 11, color: '#16a34a' }}>Alto rendimiento</span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Servicios por Concepción</span>
              <span className="stat-kpi-value" style={{ color: '#0284c7' }}>
                {tecnico.serviciosPorConcepcion}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Ratio óptimo &lt; 1.6</span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Total Servicios</span>
              <span className="stat-kpi-value">{tecnico.totalServicios}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Inseminaciones / Montas</span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Diagnósticos Positivos</span>
              <span className="stat-kpi-value" style={{ color: '#15803d' }}>
                {tecnico.positivos} preñeces
              </span>
              <span style={{ fontSize: 11, color: '#15803d' }}>Confirmadas por ecografía</span>
            </div>
          </div>

          {/* Desglose de Servicios por Repetición */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--border-gray)'
          }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              Distribución de Éxito por Número de Servicio
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>1er Servicio</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#16a34a' }}>{tecnico.primerServicio}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {((tecnico.primerServicio / tecnico.totalServicios) * 100).toFixed(1)}% del total
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>2do Servicio</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0284c7' }}>{tecnico.segundoServicio}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {((tecnico.segundoServicio / tecnico.totalServicios) * 100).toFixed(1)}% del total
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>3er Servicio</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#d97706' }}>{tecnico.tercerServicio}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {((tecnico.tercerServicio / tecnico.totalServicios) * 100).toFixed(1)}% del total
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>4 o más Servicios</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ef4444' }}>{tecnico.cuatroOMasServicios}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Repetidoras</div>
              </div>
            </div>
          </div>

          {/* Desglose de Nacimientos y Biotecnología */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--border-gray)'
            }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                Crías Nacidas
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Partos Concluidos:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{tecnico.partos}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Machos Nacidos:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0284c7' }}>{tecnico.machosNacidos}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Hembras Nacidas:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ec4899' }}>{tecnico.hembrasNacidas}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Abortos Registrados:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>{tecnico.abortos}</span>
              </div>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--border-gray)'
            }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                Biotecnología Reproductiva (FIV / Embriones)
              </h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Embriones Colocados:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{tecnico.embrionesColocados || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Óvulos Viables Obtenidos:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{tecnico.ovulosViables || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Óvulos Totales Aspirados:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{tecnico.ovulosTotales || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Viabilidad por Dosis:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0284c7' }}>
                  {tecnico.viablesPorDosis ? `${(tecnico.viablesPorDosis * 100).toFixed(0)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="report-modal-footer">
          <button type="button" className="btn-green-export" onClick={onClose}>
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
