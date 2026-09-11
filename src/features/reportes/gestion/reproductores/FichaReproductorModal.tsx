import React from 'react';
import { X, Dna, Award, CheckCircle, Package, HeartHandshake } from 'lucide-react';
import { ReproductorDetalladoEntity } from '../gestionMockData';

interface FichaReproductorModalProps {
  isOpen: boolean;
  onClose: () => void;
  reproductor: ReproductorDetalladoEntity | null;
}

export const FichaReproductorModal: React.FC<FichaReproductorModalProps> = ({
  isOpen,
  onClose,
  reproductor
}) => {
  if (!isOpen || !reproductor) return null;

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
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
              color: '#d97706'
            }}>
              <Dna size={22} />
            </div>
            <div>
              <h3 className="report-modal-title">{reproductor.nombre || reproductor.practico}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                <span className="badge-category" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
                  {reproductor.categoriaActual}
                </span>
                <span className={`badge-status ${reproductor.estatusActual.toLowerCase()}`}>
                  {reproductor.estatusActual}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Lote: {reproductor.loteActual}
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
                {reproductor.eficiencia ? `${reproductor.eficiencia}%` : 'N/A'}
              </span>
              <span style={{ fontSize: 11, color: '#16a34a' }}>Tasa de concepción</span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Servicios por Concepción</span>
              <span className="stat-kpi-value" style={{ color: '#0284c7' }}>
                {reproductor.serviciosPorConcepcion || 'N/A'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Dosis promedio por preñez</span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Stock Disponible</span>
              <span className="stat-kpi-value">
                {reproductor.stockActual}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {reproductor.stockUnidad}
              </span>
            </div>

            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Crías Nacidas</span>
              <span className="stat-kpi-value" style={{ color: '#d97706' }}>
                {reproductor.criasNacidasTotal || 0}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {reproductor.criasMachos || 0}M / {reproductor.criasHembras || 0}H
              </span>
            </div>
          </div>

          {/* Genealogía & Pedigrí */}
          <div style={{
            backgroundColor: '#f8fafc',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--border-gray)'
          }}>
            <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              Datos Genéticos y Linaje
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Raza Predominante:</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {reproductor.raza}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Centro Genético / Criador:</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {reproductor.centroGenetico || 'Hato Local'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Padre (Sire):</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#0284c7' }}>
                  {reproductor.padre || 'No registrado'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Madre (Dam):</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#ec4899' }}>
                  {reproductor.madre || 'No registrada'}
                </div>
              </div>
            </div>
          </div>

          {/* Ficha técnica de Identificación */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--border-gray)'
          }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
              Identificación y Ubicación en Sistema
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Código Práctico:</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {reproductor.practico}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Código Único:</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {reproductor.unico}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>Lote Asignado:</span>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>
                  {reproductor.loteActual}
                </div>
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
