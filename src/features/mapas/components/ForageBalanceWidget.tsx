import React, { useState, useEffect } from 'react';
import { GisPaddock } from '../mapasData';
import {
  calculateForageBalance,
  ForageBalanceResult,
  SPECIES_EMOJI,
  getUggFactor,
  FORAGE_SPECIES_PRESETS
} from '../../potreros/prvUtils';
import {
  Scale,
  Clock,
  AlertTriangle,
  Sliders,
  ArrowRight,
  Warehouse,
  CheckCircle2,
  Activity,
  Layers,
  Leaf
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
  const isPastoral = paddock.tipoInstalacion === 'potrero' || paddock.tipoInstalacion === 'sabana';

  // Preset forrajero corregido según la especie botánica del potrero
  const botanicalPreset = FORAGE_SPECIES_PRESETS[paddock.especieForrajera];
  const aforoEfectivoKgM2 = paddock.aforoKgM2 > 0 ? paddock.aforoKgM2 : (botanicalPreset?.aforoTipicoKgM2 || 1.55);
  const porcentajeMSEfectivo = paddock.porcentajeMS > 0 ? paddock.porcentajeMS : (botanicalPreset?.porcentajeMS || 22);
  const diasDescansoEfectivos = paddock.diasDescansoRequeridos > 0 ? paddock.diasDescansoRequeridos : (botanicalPreset?.diasDescansoOptimo || 30);

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
    aforoKgM2: aforoEfectivoKgM2,
    porcentajeMS: porcentajeMSEfectivo,
    eficienciaAprovechamiento: simEficiencia,
    uggPresentes: simUgg,
    consumoPvPorc: simConsumoPv,
    diasOcupacionActual: paddock.diasOcupacionActual,
    diasDescansoRequeridos: diasDescansoEfectivos
  });

  // Ley 2 de Voisin: Tiempo de Ocupación Máximo <= 2 días
  const isOvergrazed = paddock.diasOcupacionActual > 2;
  const isOptimalReady = paddock.animales === 0 && paddock.diasDescansoActual >= diasDescansoEfectivos;

  // Render facility card for intensive housing
  if (!isPastoral) {
    const maxCapacity = paddock.capacidadMaxima || Math.round(paddock.animales * 1.2) || 100;
    const occupancyPercent = Math.min(100, Math.round((paddock.animales / maxCapacity) * 100));
    const factorUgg = getUggFactor(paddock.especie);
    const m2Disponibles = paddock.areaHa * 10000;
    const densidadTexto = paddock.animales > 0 
      ? (m2Disponibles / paddock.animales >= 1 
          ? `${(m2Disponibles / paddock.animales).toFixed(1)} m²/cab` 
          : `${(paddock.animales / m2Disponibles).toFixed(2)} cab/m²`)
      : 'Disponible';

    return (
      <div className="forage-balance-card" style={{ borderColor: 'var(--primary-light)' }}>
        <div className="forage-balance-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="forage-balance-icon" style={{ backgroundColor: 'var(--primary-ultra-light)', color: 'var(--primary-color)' }}>
              <Warehouse size={18} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                Gestión Zootécnica & Instalación
              </h4>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {SPECIES_EMOJI[paddock.especie]} {paddock.sector} • {paddock.sistemaAlojamiento || 'Instalación techada'}
              </span>
            </div>
          </div>
        </div>

        {/* Capacity and Stocking Grid */}
        <div className="forage-balance-grid">
          <div className="balance-kpi-item">
            <span className="balance-kpi-label">Ocupación de Instalación</span>
            <div className="balance-kpi-val highlight-green">
              {paddock.animales} <span className="unit">/ {maxCapacity} plazas</span>
            </div>
            <span className="balance-kpi-sub">
              {occupancyPercent}% de capacidad de diseño
            </span>
          </div>

          <div className="balance-kpi-item">
            <span className="balance-kpi-label">Carga Zootécnica UGG</span>
            <div className="balance-kpi-val highlight-amber">
              {paddock.uggPresentes.toFixed(2)} <span className="unit">UGG</span>
            </div>
            <span className="balance-kpi-sub">
              Factor especie: {factorUgg} UGG/ejemplar
            </span>
          </div>
        </div>

        {/* Progress Bar of Capacity */}
        <div className="autonomy-banner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
              Densidad & Espacio Vital
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary-color)' }}>
              {densidadTexto}
            </span>
          </div>

          <div className="autonomy-bar-track">
            <div
              className={`autonomy-bar-fill ${occupancyPercent > 90 ? 'danger' : 'optimal'}`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginTop: 4 }}>
            <span>0% Vacío</span>
            <span style={{ fontWeight: 700, color: '#166534' }}>Óptimo Confort Animal</span>
            <span>100% Lleno</span>
          </div>
        </div>

        {/* Feeding and Sanitation Specs */}
        <div className="rotation-time-card" style={{ borderLeftColor: '#0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div className="rotation-time-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <Layers size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Sistema de Alimentación & Manejo
              </span>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                {paddock.especieForrajera}
              </div>
              <p style={{ fontSize: 11, color: '#475569', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                Permanencia acumulada: {paddock.diasOcupacionActual} días. Monitoreo higiénico y bioseguridad activa.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <Link
            to="/animales"
            className="btn-secondary"
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
            <Activity size={14} />
            <span>Ver Semovientes</span>
          </Link>
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
            <span>Manejo de Lote</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Pastoral Grazing Paddock Layout
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
              Oferta disponible vs Demanda diaria ({SPECIES_EMOJI[paddock.especie]} {paddock.especie})
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

      {/* Alerta de Sobrepastoreo Crítico (Ley 2 de Voisin: >2 días) */}
      {isOvergrazed && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 8,
          padding: '10px 14px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: '#991b1b',
          fontSize: 12,
          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)'
        }}>
          <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: '#b91c1c' }}>¡ALERTA VOISIN: SOBREPASTOREO CRÍTICO!</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, color: '#7f1d1d', marginTop: 2 }}>
              El lote acumula <strong>{paddock.diasOcupacionActual} días</strong> de permanencia (límite PRV: 2 días). El ganado está consumiendo los rebrotes tiernos ("diente de fuego"), agotando las reservas radiculares. ¡Rotar el lote de inmediato!
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Comparisons */}
      <div className="forage-balance-grid">
        <div className="balance-kpi-item">
          <span className="balance-kpi-label">Oferta Neta Disponible</span>
          <div className="balance-kpi-val highlight-green">
            {balance.ofertaTotalKgMs.toLocaleString('es-VE')} <span className="unit">kg MS</span>
          </div>
          <span className="balance-kpi-sub">
            {balance.ofertaNetaKgMsHa.toLocaleString('es-VE')} kg MS/ha ({aforoEfectivoKgM2.toFixed(2)} kg MV/m² • {paddock.especieForrajera})
          </span>
        </div>

        <div className="balance-kpi-item">
          <span className="balance-kpi-label">Demanda Diaria del Lote</span>
          <div className="balance-kpi-val highlight-amber">
            {balance.demandaDiariaLoteKgMs.toLocaleString('es-VE')} <span className="unit">kg MS/d</span>
          </div>
          <span className="balance-kpi-sub">
            {simUgg.toFixed(1)} UGG × 450 kg × {simConsumoPv}% PV (12.6 kg MS/UGG)
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
                ? `El lote lleva ${paddock.diasOcupacionActual} días (>2 días límite). Para proteger el rebrote y la longevidad del pastizal, desaloje el ganado hoy mismo.`
                : isOptimalReady
                ? 'El forraje está en punto óptimo de reposo. Inicie pastoreo despunte de 1 a 2 días.'
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
              <strong>{simUgg.toFixed(1)} UGG</strong>
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
