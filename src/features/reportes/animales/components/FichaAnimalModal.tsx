import React, { useState } from 'react';
import { X, Info, Heart, Activity } from 'lucide-react';
import { EstatusAnimal, EstatusReproductivo, EstatusProductivo, CategoriaAnimal } from '../../../../types2/common';

export interface AnimalModalData {
  practico: string;
  unico: string;
  categoria: CategoriaAnimal;
  estatus: EstatusAnimal;
  lote: string;
  estatusReproductivo?: EstatusReproductivo;
  estatusProductivo?: EstatusProductivo;
  edadAnos?: number;
  partos?: number;
  ultimoParto?: string;
  ultimoServicio?: string;
  reproductor?: string;
  fechaProximoParto?: string;
  fechaProximoSecado?: string;
  diasParida?: number;
  diasSeca?: number;
  pesoKg?: number;
  raza?: string;
}

interface FichaAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: AnimalModalData | null;
}

export const FichaAnimalModal: React.FC<FichaAnimalModalProps> = ({
  isOpen,
  onClose,
  animal
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'reproduccion' | 'produccion'>('general');

  if (!isOpen || !animal) return null;

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div className="report-modal-dialog modal-large" onClick={e => e.stopPropagation()}>
        {/* Encabezado */}
        <div className="report-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              color: '#2d6a4f'
            }}>
              {animal.practico}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h3 className="report-modal-title">Ficha del Semoviente: {animal.practico}</h3>
                <span className={`badge-status ${animal.estatus.toLowerCase()}`}>
                  {animal.estatus}
                </span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Código Único: {animal.unico} | Lote: {animal.lote} | Categoría: {animal.categoria}
              </p>
            </div>
          </div>
          <button type="button" className="report-modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Pestañas */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-gray)',
          padding: '0 24px',
          backgroundColor: '#fafafa',
          gap: 20
        }}>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Info size={15} style={{ marginRight: 6, display: 'inline' }} />
            General & Identificación
          </button>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'reproduccion' ? 'active' : ''}`}
            onClick={() => setActiveTab('reproduccion')}
          >
            <Heart size={15} style={{ marginRight: 6, display: 'inline' }} />
            Estado Reproductivo
          </button>
          <button
            type="button"
            className={`settings-tab ${activeTab === 'produccion' ? 'active' : ''}`}
            onClick={() => setActiveTab('produccion')}
          >
            <Activity size={15} style={{ marginRight: 6, display: 'inline' }} />
            Producción & Manejo
          </button>
        </div>

        {/* Cuerpo */}
        <div className="report-modal-body">
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="stats-cards-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Categoría</span>
                  <span className="stat-kpi-value">{animal.categoria}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Hato lechero</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Edad Estimada</span>
                  <span className="stat-kpi-value">{animal.edadAnos ? `${animal.edadAnos} años` : 'N/D'}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Desarrollo adulto</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Lote Actual</span>
                  <span className="stat-kpi-value" style={{ color: '#166534' }}>{animal.lote}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Locación en finca</span>
                </div>
                <div className="stat-kpi-card">
                  <span className="stat-kpi-label">Partos Históricos</span>
                  <span className="stat-kpi-value">{animal.partos ?? 0}</span>
                  <span style={{ fontSize: 11, color: '#2563eb' }}>Crías registradas</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f8fafc',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-gray)'
              }}>
                <h4 style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Información Genealógica y Fenotípica
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Raza / Cruce:</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {animal.raza || 'Carora / Mestizo Lechero'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Peso Corporal Registrado:</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {animal.pesoKg ? `${animal.pesoKg} Kg` : '480 Kg (estimado)'}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Rebaño de Origen:</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0284c7' }}>
                      Rebaño de Prueba
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Condición Sanitaria:</span>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#16a34a' }}>
                      Vacunación al día / Apto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reproduccion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
                backgroundColor: '#f8fafc',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-gray)'
              }}>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Diagnóstico Reproductivo:</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: animal.estatusReproductivo === 'Preñada' ? '#166534' : '#d97706' }}>
                    {animal.estatusReproductivo || 'No registrado'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Último Servicio Realizado:</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {animal.ultimoServicio || 'Sin servicios en el ciclo actual'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Semental / Pajuela Empleada:</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0284c7' }}>
                    {animal.reproductor || 'N/A'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Fecha Proyectada de Parto:</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#15803d' }}>
                    {animal.fechaProximoParto || 'Pendiente de confirmación'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produccion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 14,
                backgroundColor: '#f8fafc',
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--border-gray)'
              }}>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Estatus Productivo:</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-color)' }}>
                    {animal.estatusProductivo || 'N/D'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Días en Lactancia / Parida:</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#0284c7' }}>
                    {animal.diasParida ? `${animal.diasParida} días` : '0 días'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Fecha Prevista de Secado:</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#d97706' }}>
                    {animal.fechaProximoSecado || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
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
