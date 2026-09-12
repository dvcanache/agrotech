import React, { useState, useMemo } from 'react';
import {
  GIS_PADDOCKS,
  GIS_POINTS_OF_INTEREST,
  GIS_GATES,
  GisPaddock,
  GisPointOfInterest,
  GisGate
} from './mapasData';
import { getPrvStatusInfo, PrvStatus } from '../potreros/prvUtils';
import { ForageBalanceWidget } from './components/ForageBalanceWidget';
import { ModalAforoPotrero } from '../potreros/components/ModalAforoPotrero';
import { PotreroItem } from '../potreros/potrerosData';
import './mapas.css';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Trees,
  CheckCircle2,
  Moon,
  Activity,
  Compass,
  Info,
  ExternalLink,
  Scale,
  Sparkles,
  DoorOpen,
  DoorClosed
} from 'lucide-react';
import { Link } from 'react-router-dom';

type MapLayerType = 'satelital' | 'topografico' | 'ndvi';

export const MapasView: React.FC = () => {
  const [paddocks, setPaddocks] = useState<GisPaddock[]>(GIS_PADDOCKS);
  const [selectedPaddock, setSelectedPaddock] = useState<GisPaddock | null>(GIS_PADDOCKS[0]);
  const [hoveredPaddock, setHoveredPaddock] = useState<GisPaddock | null>(null);
  const [hoveredGate, setHoveredGate] = useState<GisGate | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satelital');
  const [isPrvMode, setIsPrvMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPOIs, setShowPOIs] = useState<boolean>(true);
  const [showGates, setShowGates] = useState<boolean>(true);
  const [showContourLines, setShowContourLines] = useState<boolean>(true);
  const [paddockSearch, setPaddockSearch] = useState('');
  const [prvFilter, setPrvFilter] = useState<'todos' | PrvStatus>('todos');
  const [isAforoModalOpen, setIsAforoModalOpen] = useState<boolean>(false);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  // Filter paddocks by search & PRV status
  const filteredPaddocks = useMemo(() => {
    return paddocks.filter(p => {
      if (prvFilter !== 'todos') {
        const prv = getPrvStatusInfo(
          p.animales,
          p.diasOcupacionActual,
          p.diasDescansoActual,
          p.diasDescansoRequeridos
        );
        if (prv.status !== prvFilter) return false;
      }
      if (paddockSearch.trim()) {
        const q = paddockSearch.toLowerCase().trim();
        const matchCode = p.codigo.toLowerCase().includes(q);
        const matchName = p.nombre.toLowerCase().includes(q);
        const matchForage = p.especieForrajera.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchForage) return false;
      }
      return true;
    });
  }, [paddocks, prvFilter, paddockSearch]);

  // PRV breakdown counts
  const prvCounts = useMemo(() => {
    const counts = { optimo: 0, pastoreo: 0, sobrepastoreo: 0, descanso: 0 };
    paddocks.forEach(p => {
      const info = getPrvStatusInfo(
        p.animales,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        p.diasDescansoRequeridos
      );
      counts[info.status]++;
    });
    return counts;
  }, [paddocks]);

  // Total summary metrics
  const totalSuperficie = paddocks.reduce((sum, p) => sum + p.areaHa, 0);
  const potrerosActivos = paddocks.filter(p => p.animales > 0).length;
  const potrerosDescanso = paddocks.filter(p => p.animales === 0).length;
  const animalesTotales = paddocks.reduce((sum, p) => sum + p.animales, 0);
  const uggTotales = paddocks.reduce((sum, p) => sum + p.uggPresentes, 0);

  // Update aforo callback from modal
  const handleSaveAforo = (
    codigo: string,
    aforoKgM2: number,
    porcentajeMS: number,
    cargaRecomendadaUggHa: number,
    aforoKgMsHa: number
  ) => {
    setPaddocks(prev =>
      prev.map(p => {
        if (p.codigo === codigo) {
          const updated = {
            ...p,
            aforoKgM2,
            porcentajeMS,
            aforoKgMsHa,
            // Recalculate approximate NDVI based on new fresh biomass
            ndviValue: Math.min(0.85, Math.max(0.2, Number((0.25 + (aforoKgM2 / 6) * 0.6).toFixed(2))))
          };
          if (selectedPaddock?.codigo === codigo) {
            setSelectedPaddock(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  // Convert GisPaddock list to PotreroItem list for ModalAforo
  const potrerosAsItems: PotreroItem[] = useMemo(() => {
    return paddocks.map(p => ({
      codigo: p.codigo,
      descripcion: p.nombre,
      areaHa: p.areaHa,
      perimetroM: p.perimetroM,
      especieForrajera: p.especieForrajera,
      aforoKgM2: p.aforoKgM2,
      porcentajeMS: p.porcentajeMS,
      aforoKgMsHa: p.aforoKgMsHa,
      cargaRecomendadaUggHa: 1.5,
      diasOcupacionMax: p.diasOcupacionMax,
      diasOcupacionActual: p.diasOcupacionActual,
      diasDescansoRequeridos: p.diasDescansoRequeridos,
      diasDescansoActual: p.diasDescansoActual,
      estatus: p.estatus,
      loteAsignado: p.lote,
      animalesPresentes: p.animales,
      uggPresentes: p.uggPresentes,
      cargaActualUggHa: p.cargaUggHa,
      eficienciaAprovechamiento: p.eficienciaAprovechamiento,
      ndviValue: p.ndviValue,
      prvStatus: p.prvStatus
    }));
  }, [paddocks]);

  const activePaddockItem: PotreroItem | null = useMemo(() => {
    if (!selectedPaddock) return null;
    return potrerosAsItems.find(p => p.codigo === selectedPaddock.codigo) || null;
  }, [selectedPaddock, potrerosAsItems]);

  // Color generator for paddock polygon depending on active mode and layer
  const getPaddockFill = (paddock: GisPaddock) => {
    const prvInfo = getPrvStatusInfo(
      paddock.animales,
      paddock.diasOcupacionActual,
      paddock.diasDescansoActual,
      paddock.diasDescansoRequeridos
    );

    // If PRV Traffic Light Mode is enabled, force Voisin semantic colors
    if (isPrvMode) {
      switch (prvInfo.status) {
        case 'optimo':
          return 'rgba(34, 197, 94, 0.65)'; // 🟢 Verde brillante
        case 'pastoreo':
          return 'rgba(234, 179, 8, 0.60)'; // 🟡 Amarillo
        case 'sobrepastoreo':
          return 'rgba(239, 68, 68, 0.65)'; // 🔴 Rojo
        case 'descanso':
          return 'rgba(59, 130, 246, 0.55)'; // 🔵 Azul
        default:
          return 'rgba(34, 197, 94, 0.5)';
      }
    }

    // Layer-specific fills
    if (activeLayer === 'ndvi') {
      // Heatmap pseudo-color scale (0.10 to 0.85 NDVI)
      const val = paddock.ndviValue;
      if (val >= 0.75) return 'rgba(4, 120, 87, 0.70)'; // Deep forest (Exuberante)
      if (val >= 0.65) return 'rgba(22, 163, 74, 0.65)'; // Lush green (Óptimo)
      if (val >= 0.55) return 'rgba(74, 222, 128, 0.60)'; // Bright green (Bueno)
      if (val >= 0.48) return 'rgba(132, 204, 22, 0.55)'; // Light lime (Moderado)
      if (val >= 0.40) return 'rgba(234, 179, 8, 0.55)';  // Yellow (Bajo/Pastoreado)
      if (val >= 0.25) return 'rgba(217, 119, 6, 0.50)';  // Amber (Rastrojo)
      return 'rgba(185, 28, 28, 0.55)';                   // Reddish-brown (Muy bajo)
    }

    if (activeLayer === 'topografico') {
      // Hypsometric tint based on elevation/status
      return paddock.animales > 0 ? 'rgba(74, 114, 85, 0.4)' : 'rgba(196, 164, 132, 0.35)';
    }

    // Satelital HD default
    return paddock.fillColor;
  };

  const getPaddockStroke = (paddock: GisPaddock) => {
    const isSelected = selectedPaddock?.id === paddock.id;
    const isHovered = hoveredPaddock?.id === paddock.id;

    if (isSelected) return '#52b788';
    if (isHovered) return '#ffffff';

    if (isPrvMode) {
      const prv = getPrvStatusInfo(
        paddock.animales,
        paddock.diasOcupacionActual,
        paddock.diasDescansoActual,
        paddock.diasDescansoRequeridos
      );
      return prv.color;
    }

    return paddock.color;
  };

  // Map canvas background depending on layer
  const getMapBackground = () => {
    switch (activeLayer) {
      case 'satelital':
        return 'linear-gradient(135deg, #182e1c 0%, #112216 40%, #0a170e 100%)';
      case 'topografico':
        return 'linear-gradient(135deg, #dfd5c4 0%, #ccbfa9 50%, #b8aa92 100%)';
      case 'ndvi':
        return 'linear-gradient(135deg, #07190b 0%, #0d2c14 50%, #14441f 100%)';
      default:
        return '#182e1c';
    }
  };

  // Track mouse coordinates over SVG for dynamic tooltip
  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="gis-workspace-container">
      {/* Header */}
      <div className="events-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="events-header-left">
          <h2 className="toolbar-title">Cartografía Agro-GIS & Pastoreo Racional Voisin (PRV)</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Visor satelital ArcGIS, topografía, biomasa NDVI (0.10–0.85) y semáforo zootécnico de rotación
          </span>
        </div>
        <div className="events-header-right" style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsAforoModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Scale size={15} />
            <span>Calculadora de Aforo</span>
          </button>
          <Link to="/potreros" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={15} />
            <span>Maestro de Potreros</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        width: '100%'
      }}>
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2d6a4f',
            flexShrink: 0
          }}>
            <Trees size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Superficie Predial</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalSuperficie.toFixed(1)} ha
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#e3f2fd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1976d2',
            flexShrink: 0
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Potreros Ocupados</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosActivos} de {paddocks.length}
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#fff3e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f57c00',
            flexShrink: 0
          }}>
            <Moon size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>En Reposo / Descanso</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosDescanso} parcelas
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: '#f3e5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7b1fa2',
            flexShrink: 0
          }}>
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Presión de Pastoreo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {animalesTotales} cab ({uggTotales.toFixed(1)} UGG)
            </div>
          </div>
        </div>
      </div>

      {/* PRV Traffic Light Quick Filter Bar */}
      <div className="prv-summary-bar" style={{ padding: '8px 14px' }}>
        <div className="prv-summary-title">
          <Sparkles size={16} color="var(--primary-color)" />
          <span style={{ fontSize: 12.5 }}>Semáforo Pastoreo Voisin:</span>
        </div>

        <div className="prv-summary-pills">
          <button
            type="button"
            className={`prv-filter-pill ${prvFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setPrvFilter('todos')}
          >
            Todos ({paddocks.length})
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-optimo ${prvFilter === 'optimo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('optimo')}
            title="Punto Óptimo de Reposo: listo para pastorear"
          >
            <span>🟢 Punto Óptimo ({prvCounts.optimo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-pastoreo ${prvFilter === 'pastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('pastoreo')}
            title="Pastoreo activo: 1 a 2 días de permanencia"
          >
            <span>🟡 En Pastoreo ({prvCounts.pastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-sobrepastoreo ${prvFilter === 'sobrepastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('sobrepastoreo')}
            title="Alerta de sobrepastoreo: >2 días"
          >
            <span>🔴 Sobrepastoreo ({prvCounts.sobrepastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-descanso ${prvFilter === 'descanso' ? 'active' : ''}`}
            onClick={() => setPrvFilter('descanso')}
            title="En descanso y recuperación forrajera"
          >
            <span>🔵 En Descanso ({prvCounts.descanso})</span>
          </button>
        </div>

        {prvFilter !== 'todos' && (
          <button
            type="button"
            onClick={() => setPrvFilter('todos')}
            style={{ fontSize: 11, color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Restablecer
          </button>
        )}
      </div>

      {/* Main Map Workspace with Two Columns */}
      <div className="gis-workspace-grid">
        {/* Left: Map Container */}
        <div className="gis-map-viewport">
          {/* Top Floating Map Controls */}
          <div className="gis-controls-header">
            {/* Multi-layer Switcher */}
            <div className="gis-layer-switcher">
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'satelital' ? 'active' : ''}`}
                onClick={() => setActiveLayer('satelital')}
                title="Capa Satelital HD (ArcGIS World Imagery)"
              >
                <Layers size={13} />
                <span>Satelital HD</span>
              </button>
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'topografico' ? 'active' : ''}`}
                onClick={() => setActiveLayer('topografico')}
                title="Capa Topográfica y Curvas de Nivel"
              >
                <span>Topografía</span>
              </button>
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'ndvi' ? 'active' : ''}`}
                onClick={() => setActiveLayer('ndvi')}
                title="Capa de Biomasa Forrajera NDVI (0.10 a 0.85)"
              >
                <span>Biomasa (NDVI)</span>
              </button>
            </div>

            {/* PRV Traffic Light Mode Toggle */}
            <button
              type="button"
              className={`gis-prv-toggle-btn ${isPrvMode ? 'active' : ''}`}
              onClick={() => setIsPrvMode(prev => !prev)}
              title="Alternar modo semáforo de Pastoreo Racional Voisin"
            >
              <span>🚦 Semáforo PRV</span>
              <span style={{ fontSize: 10, opacity: 0.9 }}>
                {isPrvMode ? 'ACTIVO' : 'OFF'}
              </span>
            </button>

            {/* Georeferencing Coordinates & Compass */}
            <div className="gis-coord-badge">
              <Compass size={14} color="#52b788" />
              <span>9°33'14" N, 69°12'54" W • 145 msnm</span>
            </div>
          </div>

          {/* Zoom & Action Controls (Bottom Right) */}
          <div className="gis-bottom-right-controls">
            <button
              type="button"
              className="gis-map-control-btn"
              onClick={handleZoomIn}
              title="Acercar (Zoom In)"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              className="gis-map-control-btn"
              onClick={handleZoomOut}
              title="Alejar (Zoom Out)"
            >
              <ZoomOut size={18} />
            </button>
            <button
              type="button"
              className="gis-map-control-btn"
              onClick={handleResetZoom}
              title="Restablecer vista centrada"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Toggle POIs & Gates Controls (Bottom Left) */}
          <div className="gis-bottom-tools">
            <button
              type="button"
              className={`gis-toggle-btn ${showPOIs ? 'active' : ''}`}
              onClick={() => setShowPOIs(prev => !prev)}
            >
              <MapPin size={14} />
              <span>Instalaciones</span>
            </button>

            <button
              type="button"
              className={`gis-toggle-btn ${showGates ? 'active' : ''}`}
              onClick={() => setShowGates(prev => !prev)}
              title="Mostrar tranqueras y portones de acceso numerados"
            >
              <DoorClosed size={14} />
              <span>Tranqueras (G1-G8)</span>
            </button>

            {activeLayer === 'topografico' && (
              <button
                type="button"
                className={`gis-toggle-btn ${showContourLines ? 'active' : ''}`}
                onClick={() => setShowContourLines(prev => !prev)}
              >
                <span>Curvas de Nivel</span>
              </button>
            )}
          </div>

          {/* NDVI Legend Bar (when NDVI layer active) */}
          {activeLayer === 'ndvi' && (
            <div className="ndvi-legend-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc' }}>
                  Índice de Vigor Vegetal (NDVI)
                </span>
                <span style={{ fontSize: 10.5, color: '#86efac', fontWeight: 600 }}>
                  {hoveredPaddock ? `${hoveredPaddock.codigo}: ${hoveredPaddock.ndviValue.toFixed(2)}` : '0.10 - 0.85'}
                </span>
              </div>
              <div className="ndvi-bar-gradient">
                {hoveredPaddock && (
                  <div
                    className="ndvi-indicator-pin"
                    style={{
                      left: `${Math.max(0, Math.min(100, ((hoveredPaddock.ndviValue - 0.1) / 0.75) * 100))}%`
                    }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: '#94a3b8' }}>
                <span>0.10 (Suelo)</span>
                <span>0.35 (Bajo)</span>
                <span>0.55 (Medio)</span>
                <span>0.70 (Alto)</span>
                <span>0.85 (Óptimo)</span>
              </div>
            </div>
          )}

          {/* Dynamic Floating Tooltip */}
          {hoveredPaddock && tooltipPos && (
            <div
              className="gis-floating-tooltip"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y
              }}
            >
              {(() => {
                const prv = getPrvStatusInfo(
                  hoveredPaddock.animales,
                  hoveredPaddock.diasOcupacionActual,
                  hoveredPaddock.diasDescansoActual,
                  hoveredPaddock.diasDescansoRequeridos
                );
                return (
                  <>
                    <div className="gis-tooltip-header">
                      <div>
                        <strong style={{ fontSize: 12.5, color: '#ffffff' }}>
                          {hoveredPaddock.codigo} - {hoveredPaddock.nombre}
                        </strong>
                        <div style={{ fontSize: 10.5, color: '#94a3b8' }}>{hoveredPaddock.especieForrajera}</div>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 10,
                          backgroundColor: prv.bgColor,
                          color: prv.textColor
                        }}
                      >
                        {prv.dotEmoji} {prv.shortLabel}
                      </span>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Superficie / Perímetro:</span>
                      <strong>{hoveredPaddock.areaHa} ha • {hoveredPaddock.perimetroM} m</strong>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Lote & Presión:</span>
                      <strong>
                        {hoveredPaddock.animales > 0
                          ? `${hoveredPaddock.animales} cab (${hoveredPaddock.cargaUggHa} UGG/ha)`
                          : 'Sin ganado'}
                      </strong>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Aforo & Oferta MS:</span>
                      <strong>{hoveredPaddock.aforoKgM2} kg/m² ({hoveredPaddock.aforoKgMsHa.toLocaleString('es-VE')} kg MS/ha)</strong>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Permanencia / Reposo:</span>
                      <strong>
                        {hoveredPaddock.animales > 0
                          ? `${hoveredPaddock.diasOcupacionActual} días ocupado`
                          : `${hoveredPaddock.diasDescansoActual} / ${hoveredPaddock.diasDescansoRequeridos} días reposo`}
                      </strong>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Índice NDVI:</span>
                      <strong style={{ color: '#86efac' }}>{hoveredPaddock.ndviValue.toFixed(2)}</strong>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Gate Tooltip */}
          {hoveredGate && tooltipPos && (
            <div
              className="gis-floating-tooltip"
              style={{
                left: tooltipPos.x,
                top: tooltipPos.y,
                minWidth: 200
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {hoveredGate.abierta ? <DoorOpen size={14} color="#22c55e" /> : <DoorClosed size={14} color="#f59e0b" />}
                <strong style={{ fontSize: 12 }}>{hoveredGate.codigo} - {hoveredGate.nombre}</strong>
              </div>
              <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                Acceso al Callejón Central PRV
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: hoveredGate.abierta ? '#86efac' : '#fef08a', marginTop: 3 }}>
                Estado: {hoveredGate.abierta ? 'Abierta (Ganado en parcela)' : 'Cerrada (Parcela en reposo)'}
              </div>
            </div>
          )}

          {/* Map SVG Canvas */}
          <div style={{
            width: '100%',
            height: 590,
            background: getMapBackground(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'grab',
            transition: 'background 0.4s ease',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.25s ease-out'
            }}>
              <svg
                viewBox="0 0 950 720"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  userSelect: 'none'
                }}
                preserveAspectRatio="xMidYMid meet"
                onMouseMove={handleSvgMouseMove}
              >
                {/* Defs for textures, contour lines & patterns */}
                <defs>
                  {/* Satelital Grid Texture */}
                  <pattern id="gisSatGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.5" fill="rgba(255,255,255,0.15)" />
                  </pattern>

                  {/* Topographic Contour Texture */}
                  <pattern id="topographicMesh" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M 0 30 Q 50 10 100 30 M 0 60 Q 50 40 100 60 M 0 90 Q 50 70 100 90" fill="none" stroke="rgba(120,90,50,0.15)" strokeWidth="1" />
                  </pattern>

                  {/* Electric Fence Pattern for internal borders */}
                  <pattern id="electricFence" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="1" fill="#cbd5e1" />
                  </pattern>

                  {/* Satellite Landscape Features Simulation */}
                  <radialGradient id="lakeGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0f4c5c" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1b263b" stopOpacity="0.9" />
                  </radialGradient>
                </defs>

                {/* Base Layer Texture */}
                <rect width="950" height="720" fill="url(#gisSatGrid)" />
                {activeLayer === 'topografico' && (
                  <rect width="950" height="720" fill="url(#topographicMesh)" />
                )}

                {/* Georeferencing Lat/Long Grid Lines */}
                <g stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3,3">
                  {/* Meridians */}
                  <line x1="200" y1="40" x2="200" y2="680" />
                  <line x1="450" y1="40" x2="450" y2="680" />
                  <line x1="700" y1="40" x2="700" y2="680" />
                  {/* Parallels */}
                  <line x1="60" y1="200" x2="900" y2="200" />
                  <line x1="60" y1="450" x2="900" y2="450" />
                </g>

                {/* Lat/Long Coordinate Ticks on Margins */}
                <g fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">
                  <text x="200" y="32" textAnchor="middle">69°13'15"W</text>
                  <text x="450" y="32" textAnchor="middle">69°13'00"W</text>
                  <text x="700" y="32" textAnchor="middle">69°12'45"W</text>
                  <text x="50" y="204" textAnchor="end">9°33'30"N</text>
                  <text x="50" y="454" textAnchor="end">9°33'00"N</text>
                </g>

                {/* Topographic Contour Lines (when topographic layer active) */}
                {activeLayer === 'topografico' && showContourLines && (
                  <g stroke="rgba(100, 75, 45, 0.45)" strokeWidth="1.2" fill="none">
                    <path d="M 60 140 Q 300 110 500 130 T 900 150" />
                    <text x="75" y="136" fill="#8c6d48" fontSize="9" fontWeight="600">110m</text>

                    <path d="M 60 230 Q 350 200 600 240 T 900 220" />
                    <text x="75" y="226" fill="#8c6d48" fontSize="9" fontWeight="600">120m</text>

                    <path d="M 60 340 Q 400 310 650 330 T 900 360" />
                    <text x="75" y="336" fill="#8c6d48" fontSize="9" fontWeight="600">130m</text>

                    <path d="M 60 460 Q 380 430 700 480 T 900 470" />
                    <text x="75" y="456" fill="#8c6d48" fontSize="9" fontWeight="600">140m</text>

                    <path d="M 60 580 Q 450 560 750 590 T 900 610" />
                    <text x="75" y="576" fill="#8c6d48" fontSize="9" fontWeight="600">150m</text>

                    {/* Spot elevations */}
                    <g fill="#785530" fontSize="9.5" fontWeight="700">
                      <text x="240" y="160">▲ 168 msnm</text>
                      <text x="680" y="210">▲ 155 msnm</text>
                      <text x="430" y="430">▲ 142 msnm</text>
                    </g>
                  </g>
                )}

                {/* Central PRV Grazing Corridor & Farm Roads */}
                <path
                  d="M 50 285 L 890 305 M 338 70 L 328 670 M 562 80 L 542 680"
                  stroke={activeLayer === 'topografico' ? 'rgba(160, 130, 90, 0.6)' : 'rgba(215, 185, 140, 0.45)'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 50 285 L 890 305 M 338 70 L 328 670 M 562 80 L 542 680"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="6,6"
                  fill="none"
                  opacity="0.4"
                />

                {/* Paddock Polygons Overlay */}
                {paddocks.map(paddock => {
                  const isSelected = selectedPaddock?.id === paddock.id;
                  const isHovered = hoveredPaddock?.id === paddock.id;
                  const prvInfo = getPrvStatusInfo(
                    paddock.animales,
                    paddock.diasOcupacionActual,
                    paddock.diasDescansoActual,
                    paddock.diasDescansoRequeridos
                  );
                  const isOvergrazedAlert = prvInfo.status === 'sobrepastoreo';

                  return (
                    <g key={paddock.id}>
                      {/* Outer boundary polygon */}
                      <polygon
                        points={paddock.polygonPoints}
                        fill={getPaddockFill(paddock)}
                        stroke={getPaddockStroke(paddock)}
                        strokeWidth={isSelected ? 4 : isHovered ? 3.5 : isOvergrazedAlert ? 3 : 2}
                        strokeDasharray={paddock.animales === 0 && !isPrvMode ? '6,4' : undefined}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          filter: isSelected
                            ? 'drop-shadow(0 0 12px rgba(82,183,136,0.85))'
                            : isOvergrazedAlert
                            ? 'drop-shadow(0 0 10px rgba(239,68,68,0.75))'
                            : undefined
                        }}
                        onMouseEnter={() => setHoveredPaddock(paddock)}
                        onMouseLeave={() => setHoveredPaddock(null)}
                        onClick={() => setSelectedPaddock(paddock)}
                      />

                      {/* Overgrazing Warning Ring */}
                      {isOvergrazedAlert && (
                        <circle
                          cx={paddock.center.x}
                          cy={paddock.center.y - 30}
                          r="10"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="pulse-warning"
                        />
                      )}

                      {/* Paddock Text Labels */}
                      <text
                        x={paddock.center.x}
                        y={paddock.center.y - 12}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14.5"
                        fontWeight="800"
                        style={{ pointerEvents: 'none', textShadow: '0 2px 5px rgba(0,0,0,0.9)' }}
                      >
                        {paddock.codigo}
                      </text>

                      <text
                        x={paddock.center.x}
                        y={paddock.center.y + 6}
                        textAnchor="middle"
                        fill="#f1f5f9"
                        fontSize="11.5"
                        fontWeight="600"
                        style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                      >
                        {paddock.areaHa} ha
                      </text>

                      {/* Animals & UGG or PRV Badge Indicator */}
                      {paddock.animales > 0 ? (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 24}
                          textAnchor="middle"
                          fill={isOvergrazedAlert ? '#fca5a5' : '#86efac'}
                          fontSize="10.5"
                          fontWeight="700"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                        >
                          {paddock.animales} cab • {paddock.cargaUggHa} UGG/ha
                        </text>
                      ) : (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 24}
                          textAnchor="middle"
                          fill={prvInfo.status === 'optimo' ? '#86efac' : '#93c5fd'}
                          fontSize="10"
                          fontWeight="600"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                        >
                          {prvInfo.status === 'optimo'
                            ? `🟢 Listo (${paddock.diasDescansoActual}d)`
                            : `🔵 Reposo (${paddock.diasDescansoActual}/${paddock.diasDescansoRequeridos}d)`}
                        </text>
                      )}

                      {/* NDVI value indicator badge on polygon */}
                      {activeLayer === 'ndvi' && (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 40}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="10"
                          fontWeight="800"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                        >
                          NDVI {paddock.ndviValue.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Gates (Tranqueras G1-G8) Overlay */}
                {showGates && GIS_GATES.map(gate => (
                  <g
                    key={gate.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredGate(gate)}
                    onMouseLeave={() => setHoveredGate(null)}
                    onClick={() => {
                      const found = paddocks.find(p => p.id === gate.paddockId);
                      if (found) setSelectedPaddock(found);
                    }}
                  >
                    {/* Gate Post 1 */}
                    <circle cx={gate.x - 4} cy={gate.y} r={3} fill="#475569" stroke="#ffffff" strokeWidth="1" />
                    {/* Gate Post 2 */}
                    <circle cx={gate.x + 4} cy={gate.y} r={3} fill="#475569" stroke="#ffffff" strokeWidth="1" />
                    {/* Gate Bar */}
                    <line
                      x1={gate.x - 4}
                      y1={gate.y}
                      x2={gate.x + 4}
                      y2={gate.y}
                      stroke={gate.abierta ? '#22c55e' : '#f59e0b'}
                      strokeWidth={2.5}
                    />
                    {/* Gate Tag */}
                    <rect
                      x={gate.x - 10}
                      y={gate.y - 14}
                      width={20}
                      height={12}
                      rx={3}
                      fill={gate.abierta ? '#166534' : '#78350f'}
                    />
                    <text
                      x={gate.x}
                      y={gate.y - 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="800"
                    >
                      {gate.codigo}
                    </text>
                  </g>
                ))}

                {/* Points of Interest (Facilities) */}
                {showPOIs && GIS_POINTS_OF_INTEREST.map(poi => (
                  <g key={poi.id} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={poi.x}
                      cy={poi.y}
                      r={7}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <rect
                      x={poi.x + 9}
                      y={poi.y - 10}
                      width={poi.nombre.length * 6.2 + 10}
                      height={19}
                      rx={4}
                      fill="rgba(15, 23, 42, 0.9)"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="0.5"
                    />
                    <text
                      x={poi.x + 14}
                      y={poi.y + 3}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {poi.nombre}
                    </text>
                  </g>
                ))}

                {/* Graphical Scale Bar (Bottom Left) */}
                <g transform="translate(70, 680)">
                  <rect x="0" y="0" width="160" height="4" fill="#ffffff" />
                  <rect x="80" y="0" width="80" height="4" fill="#2d6a4f" />
                  <line x1="0" y1="-3" x2="0" y2="7" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="80" y1="-3" x2="80" y2="7" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="160" y1="-3" x2="160" y2="7" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="-6" fill="#ffffff" fontSize="9" fontWeight="600">0</text>
                  <text x="80" y="-6" fill="#ffffff" fontSize="9" fontWeight="600" textAnchor="middle">250m</text>
                  <text x="160" y="-6" fill="#ffffff" fontSize="9" fontWeight="600" textAnchor="end">500m</text>
                </g>

                {/* North Arrow / Compass Rose (Top Right) */}
                <g transform="translate(900, 75)">
                  <circle cx="0" cy="0" r="16" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <polygon points="0,-12 4,2 0,-1 -4,2" fill="#ef4444" />
                  <polygon points="0,12 4,2 0,-1 -4,2" fill="#ffffff" />
                  <text x="0" y="-18" fill="#ffffff" fontSize="10" fontWeight="800" textAnchor="middle">N</text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Selected Paddock Inspector & Forage Balance Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, width: '100%' }}>
          {selectedPaddock ? (
            <div className="gis-drawer-card">
              {/* Header with Paddock Code and PRV Badge */}
              <div className="gis-drawer-header">
                {(() => {
                  const prv = getPrvStatusInfo(
                    selectedPaddock.animales,
                    selectedPaddock.diasOcupacionActual,
                    selectedPaddock.diasDescansoActual,
                    selectedPaddock.diasDescansoRequeridos
                  );
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--primary-color)',
                          letterSpacing: '0.04em'
                        }}>
                          Ficha Parcelaria GIS
                        </span>
                        <span
                          className={`prv-chip ${prv.badgeClass}`}
                          style={{
                            backgroundColor: prv.bgColor,
                            color: prv.textColor,
                            borderColor: prv.borderColor
                          }}
                        >
                          <span className="prv-chip-dot" style={{ backgroundColor: prv.color }} />
                          <span>{prv.shortLabel}</span>
                        </span>
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                        {selectedPaddock.codigo} — {selectedPaddock.nombre}
                      </h3>
                      <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
                        {prv.tagline} • {prv.description}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="gis-drawer-body">
                {/* 4 Essential Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 10,
                  background: '#f8fafc',
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>SUPERFICIE</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {selectedPaddock.areaHa} ha
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>{selectedPaddock.perimetroM} m cerca</span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>CARGA ACTUAL</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-color)' }}>
                      {selectedPaddock.cargaUggHa} UGG/ha
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.animales} cab ({selectedPaddock.uggPresentes.toFixed(1)} UGG)
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>AFORO MATERIA SECA</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d' }}>
                      {selectedPaddock.aforoKgMsHa.toLocaleString('es-VE')} <span style={{ fontSize: 10 }}>kg/ha</span>
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.aforoKgM2} kg MV/m² ({selectedPaddock.porcentajeMS}% MS)
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>VIGOR NDVI</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}>
                      {selectedPaddock.ndviValue.toFixed(2)}
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.especieForrajera.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Forage Balance Calculator Widget Component */}
                <ForageBalanceWidget
                  paddock={selectedPaddock}
                  onOpenAforoModal={() => setIsAforoModalOpen(true)}
                />
              </div>
            </div>
          ) : (
            <div className="gis-panel-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Info size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h4 style={{ margin: 0, fontSize: 14 }}>Ningún potrero seleccionado</h4>
              <p style={{ fontSize: 12, marginTop: 4 }}>
                Haga clic en cualquier parcela del mapa para inspeccionar su balance forrajero y estado PRV.
              </p>
            </div>
          )}

          {/* Quick Paddock List & Filter */}
          <div className="gis-panel-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Parcelas del Predio ({filteredPaddocks.length})
              </h4>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Clic para enfocar</span>
            </div>

            <input
              type="text"
              className="form-input"
              placeholder="Buscar parcela por código o forraje..."
              value={paddockSearch}
              onChange={e => setPaddockSearch(e.target.value)}
              style={{
                height: 32,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                width: '100%',
                marginBottom: 10
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
              {filteredPaddocks.map(p => {
                const prv = getPrvStatusInfo(
                  p.animales,
                  p.diasOcupacionActual,
                  p.diasDescansoActual,
                  p.diasDescansoRequeridos
                );
                return (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 8,
                      backgroundColor: selectedPaddock?.id === p.id ? 'var(--primary-ultra-light)' : '#f8fafc',
                      border: selectedPaddock?.id === p.id ? '1px solid var(--primary-light)' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setSelectedPaddock(p)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: prv.color, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.codigo} — {p.nombre}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.especieForrajera}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p.areaHa} ha</div>
                      <div style={{ fontSize: 10, color: prv.color, fontWeight: 600 }}>{prv.shortLabel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Aforo Component */}
      <ModalAforoPotrero
        isOpen={isAforoModalOpen}
        onClose={() => setIsAforoModalOpen(false)}
        paddock={activePaddockItem}
        paddocksList={potrerosAsItems}
        onSaveAforo={handleSaveAforo}
      />
    </div>
  );
};
