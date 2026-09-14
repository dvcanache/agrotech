import React, { useState } from 'react';
import { X, Award, BarChart3, Layers, Calendar, CheckCircle2 } from 'lucide-react';

interface AnalisisInventarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAnimales: number;
}

export const AnalisisInventarioModal: React.FC<AnalisisInventarioModalProps> = ({
  isOpen,
  onClose,
  totalAnimales
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'ugm' | 'edades' | 'proyeccion'>('kpis');

  if (!isOpen) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog modal-large" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} color="#d97706" />
            </div>
            <div>
              <h3 className="report-modal-title">Análisis Dinámico de Inventario</h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Indicadores zootécnicos, capacidad de carga animal (UGM) y proyecciones
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-gray)',
          padding: '0 24px',
          backgroundColor: '#fafafa',
          gap: 20
        }}>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'kpis' ? 'active' : ''}`}
            onClick={() => setActiveTab('kpis')}
          >
            <BarChart3 size={15} style={{ marginRight: 6, display: 'inline' }} />
            Indicadores Clave (KPIs)
          </button>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'ugm' ? 'active' : ''}`}
            onClick={() => setActiveTab('ugm')}
          >
            <Layers size={15} style={{ marginRight: 6, display: 'inline' }} />
            Carga Animal (UGM)
          </button>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'edades' ? 'active' : ''}`}
            onClick={() => setActiveTab('edades')}
          >
            <Calendar size={15} style={{ marginRight: 6, display: 'inline' }} />
            Pirámide Poblacional
          </button>
        </div>

        {/* Modal Body */}
        <div className="report-modal-body">
          {activeTab === 'kpis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Total Animales</span>
                  <span className="stat-kpi-value">{totalAnimales} cabezas</span>
                  <span style={{ fontSize: 11, color: '#16a34a' }}>100% activos en hato</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Unidades Ganado Mayor</span>
                  <span className="stat-kpi-value">31.7 UGM</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>0.70 UGM promedio</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Proporción de Vientres</span>
                  <span className="stat-kpi-value">60.0 %</span>
                  <span style={{ fontSize: 11, color: '#2563eb' }}>27 vientres hábiles</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Relación Toro / Vaca</span>
                  <span className="stat-kpi-value">1 : 13.5</span>
                  <span
                    style={{ fontSize: 11, color: '#d97706', fontWeight: 600 }}
                    title="Subutilización de toros (Óptimo monta natural: 1:20 a 1:30; repaso IATF: 1:40 a 1:50)"
                  >
                    Subutilización (Óptimo monta: 1:20-1:30)
                  </span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-gray)'
              }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Estado Reproductivo de los Vientres Activos
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>En Ordeño / Lactando</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#2d6a4f' }}>17 vacas (63.0%)</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Producción activa diaria</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Secas Confirmadas</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#d97706' }}>4 vacas (14.8%)</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Próximas al preparto</div>
                  </div>
                  <div style={{ backgroundColor: '#ffffff', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Novillas de Reemplazo</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0284c7' }}>6 novillas (22.2%)</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Incorporación a servicio</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ugm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Conversión zootécnica de inventario a Unidades Ganado Mayor (1 UGM = 450 kg de peso vivo):
              </p>
              <div className="report-table-wrapper">
                <table className="report-grid-table">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Cabezas</th>
                      <th>Equivalente UGM</th>
                      <th>Total UGM</th>
                      <th>% del Hato</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vacas Adultas</td>
                      <td>17</td>
                      <td>1.00 UGM</td>
                      <td>17.0 UGM</td>
                      <td>45.0%</td>
                    </tr>
                    <tr>
                      <td>Toros Reproductores</td>
                      <td>2</td>
                      <td>1.25 UGM</td>
                      <td>2.5 UGM</td>
                      <td>6.6%</td>
                    </tr>
                    <tr>
                      <td>Novillas & Mautas</td>
                      <td>8</td>
                      <td>0.70 UGM</td>
                      <td>5.6 UGM</td>
                      <td>14.8%</td>
                    </tr>
                    <tr>
                      <td>Mautes & Novillos</td>
                      <td>3</td>
                      <td>0.70 UGM</td>
                      <td>2.1 UGM</td>
                      <td>5.6%</td>
                    </tr>
                    <tr>
                      <td>Becerros y Becerras</td>
                      <td>15</td>
                      <td>0.30 UGM</td>
                      <td>4.5 UGM</td>
                      <td>11.9%</td>
                    </tr>
                    <tr style={{ fontWeight: 700, backgroundColor: '#f0fdf4', color: '#166534' }}>
                      <td>TOTAL HATO</td>
                      <td>45 cabezas</td>
                      <td>-</td>
                      <td>31.7 UGM</td>
                      <td>100.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                backgroundColor: '#eff6ff',
                padding: 12,
                borderRadius: 6,
                border: '1px solid #bfdbfe',
                fontSize: 12.5,
                color: '#1e40af'
              }}>
                <CheckCircle2 size={16} />
                <span>
                  <strong>Carga Promedio Recomendada:</strong> 1.06 UGM/ha sobre 30 hectáreas útiles de pasturas disponibles (31.7 UGM / 30 ha).
                </span>
              </div>
            </div>
          )}

          {activeTab === 'edades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div style={{ padding: 16, border: '1px solid var(--border-gray)', borderRadius: 8, backgroundColor: '#f9fafb' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    0 - 8 Meses (Cría)
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#2d6a4f' }}>15 animales</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    8 Becerras / 7 Becerros (33.3% del hato)
                  </div>
                </div>
                <div style={{ padding: 16, border: '1px solid var(--border-gray)', borderRadius: 8, backgroundColor: '#f9fafb' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    8 - 24 Meses (Levante)
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#0284c7' }}>8 animales</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    5 Mautas / 3 Mautes (17.8% del hato)
                  </div>
                </div>
                <div style={{ padding: 16, border: '1px solid var(--border-gray)', borderRadius: 8, backgroundColor: '#f9fafb' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                    &gt; 24 Meses (Adultos)
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706' }}>22 animales</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    17 Vacas / 3 Novillas / 2 Toros (48.9% del hato)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="report-modal-footer">
          <button type="button" className="btn-green-export" onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
