import React, { useState, useEffect } from 'react';
import { GisPaddock } from '../mapasData';
import { calculateForageBalance, ForageBalanceResult } from '../../potreros/prvUtils';
import {
  Scale,
  Clock,
  AlertTriangle,
  Sliders,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForageBalanceWidgetProps {
  paddock: GisPaddock;
  onOpenAforoModal?: () => void;
}

export const ForageBalanceWidget: React.FC<ForageBalanceWidgetProps> = ({
  paddock,
  onOpenAforoModal
}) => {
  // Simulator state with defaults initialized from paddock
  const [simUgg, setSimUgg] = useState<number>(paddock.uggPresentes > 0 ? paddock.uggPresentes : 25);
  const [simConsumoPv, setSimConsumoPv] = useState<number>(2.8);
  const [simEficiencia, setSimEficiencia] = useState<number>(paddock.eficienciaAprovechamiento || 75);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Sync when selected paddock changes
  useEffect(() => {
    setSimUgg(paddock.uggPresentes > 0 ? paddock.uggPresentes : 25);
  }, [paddock.id, paddock.uggPresentes]);

  const balance: ForageBalanceResult = calculateForageBalance({
    areaHa: paddock.areaHa,
    aforoKgM2: paddock.aforoKgM2,
    porcentajeMS: paddock.porcentajeMS,
    eficienciaAprovechamiento: simEficiencia,
    uggPresentes: simUgg,
    consumoPvPorc: simConsumoPv,
    diasOcupacionActual: paddock.diasOcupacionActual,
    diasDescansoRequeridos: paddock.diasDescansoRequeridos
  });

  // Calculate percentage of autonomy safe range (1-3 days in PRV)
  const isOvergrazed = paddock.diasOcupacionActual > 2;
  const isOptimalReady = paddock.animales === 0 && paddock.diasDescansoActual >= paddock.diasDescansoRequeridos;

  return (
    <div className="forage-balance-card">
      {/* Widget Header */}
      <div className="forage-balance-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="forage-balance-icon">
            <Scale size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Balance Forrajero & Autonomía (PRV)
            </h4>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Oferta disponible vs Demanda diaria del lote
            </span>
          </div>
        </div>

        <button
          type="button"
          className={`btn-toggle-sim ${showSimulator ? 'active' : ''}`}
          onClick={() => setShowSimulator(prev => !prev)}
          title="Ajustar simulador interactivo de consumo y carga"
        >
          <Sliders size={13} />
          <span>{showSimulator ? 'Ocultar' : 'Simular'}</span>
        </button>
      </div>

      {/* Main KPI Comparisons */}
      <div className="forage-balance-grid">
        <div className="balance-kpi-item">
          <span className="balance-kpi-label">Oferta Neta Disponible</span>
          <div className="balance-kpi-val highlight-green">
            {balance.ofertaTotalKgMs.toLocaleString('es-VE')} <span className="unit">kg MS</span>
          </div>
          <span className="balance-kpi-sub">
            {balance.ofertaNetaKgMsHa.toLocaleString('es-VE')} kg MS/ha ({paddock.aforoKgM2} kg MV/m²)
          </span>
        </div>

        <div className="balance-kpi-item">
          <span className="balance-kpi-label">Demanda Diaria del Lote</span>
          <div className="balance-kpi-val highlight-amber">
            {balance.demandaDiariaLoteKgMs.toLocaleString('es-VE')} <span className="unit">kg MS/d</span>
          </div>
          <span className="balance-kpi-sub">
            {simUgg.toFixed(1)} UGG × 450 kg × {simConsumoPv}% PV
          </span>
        </div>
      </div>

      {/* Autonomy Gauge & Clock */}
      <div className="autonomy-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
            Autonomía Forrajera Calculada
          </span>
          <span style={{
            fontSize: 16,
            fontWeight: 800,
            color: balance.diasAutonomia < 1.0 ? '#dc2626' : 'var(--primary-color)'
          }}>
            {balance.diasAutonomia} días
          </span>
        </div>

        {/* Progress bar */}
        <div className="autonomy-bar-track">
          <div
            className={`autonomy-bar-fill ${balance.diasAutonomia < 1.0 ? 'danger' : balance.diasAutonomia <= 3.0 ? 'optimal' : 'surplus'}`}
            style={{ width: `${Math.min(100, (balance.diasAutonomia / 5) * 100)}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginTop: 4 }}>
          <span>0d (Agotado)</span>
          <span style={{ fontWeight: 700, color: '#166534' }}>1 - 2d (Ideal PRV)</span>
          <span>&gt;4d (Excedente)</span>
        </div>
      </div>

      {/* Voisin Rotation Next Date Recommendation */}
      <div className="rotation-time-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div className="rotation-time-icon">
            <Clock size={16} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Próxima Rotación Recomendada
            </span>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
              {isOvergrazed ? (
                <span style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={14} /> ¡Rotar Hoy Inmediatamente!
                </span>
              ) : isOptimalReady ? (
                <span style={{ color: '#16a34a' }}>
                  Listo para Ingreso Inmediato
                </span>
              ) : (
                <span>{balance.fechaSugeridaRotacion}</span>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0 0', lineHeight: 1.3 }}>
              {isOvergrazed
                ? 'El lote lleva más de 2 días. Para proteger el rebrote y las raíces, mueva el ganado de inmediato.'
                : isOptimalReady
                ? 'El forraje está en punto óptimo (35+ días reposo). Inicie pastoreo despunte de 1 a 2 días.'
                : `Tiempo restante seguro: ${balance.diasRestantesAutonomia} días antes de consumir rebrote.`}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Simulator Sliders (collapsible) */}
      {showSimulator && (
        <div className="simulator-drawer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-color)' }}>
              Simulador de Carga & Demanda
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Ajuste dinámico</span>
          </div>

          <div className="sim-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span>Carga del Lote:</span>
              <strong>{simUgg.toFixed(1)} UGG ({Math.round(simUgg * 1.15)} cab)</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={simUgg}
              onChange={e => setSimUgg(parseFloat(e.target.value))}
              className="aforo-slider"
            />
          </div>

          <div className="sim-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span>Consumo diario (% PV):</span>
              <strong>{simConsumoPv.toFixed(1)}% PV ({balance.consumoPorUggKgMs.toFixed(1)} kg MS/UGG)</strong>
            </div>
            <input
              type="range"
              min="2.0"
              max="3.5"
              step="0.1"
              value={simConsumoPv}
              onChange={e => setSimConsumoPv(parseFloat(e.target.value))}
              className="aforo-slider"
            />
          </div>

          <div className="sim-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
              <span>Aprovechamiento pastura:</span>
              <strong>{simEficiencia}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={simEficiencia}
              onChange={e => setSimEficiencia(parseInt(e.target.value, 10))}
              className="aforo-slider"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {onOpenAforoModal && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenAforoModal}
            style={{ flex: 1, padding: '7px 10px', fontSize: 11.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Scale size={14} />
            <span>Recalcular Aforo</span>
          </button>
        )}
        <Link
          to="/eventos"
          className="btn-primary"
          style={{
            flex: 1,
            padding: '7px 10px',
            fontSize: 11.5,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6
          }}
        >
          <span>Rotar Lote</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
