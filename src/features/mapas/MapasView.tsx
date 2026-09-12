import React, { useState, useMemo } from 'react';
import {
  GIS_PADDOCKS,
  GIS_POINTS_OF_INTEREST,
  GIS_GATES,
  GisPaddock,
  GisPointOfInterest,
  GisGate
} from './mapasData';
import { getPrvStatusInfo, PrvStatus, SPECIES_EMOJI, getUggFactor } from '../potreros/prvUtils';
import { EspecieAnimal } from '../../types/animal';
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
  DoorClosed,
  Warehouse
} from 'lucide-react';
import { Link } from 'react-router-dom';

type MapLayerType = 'satelital' | 'topografico' | 'ndvi';

interface SectorFilterItem {
  id: 'todos' | EspecieAnimal;
  label: string;
  icon: string;
}

const SECTORES: SectorFilterItem[] = [
  { id: 'todos', label: 'Todos los Sectores', icon: '🐾' },
  { id: 'Bovinos', label: 'Bovinos', icon: '🐮' },
  { id: 'Aves de corral', label: 'Aves de corral', icon: '🐔' },
  { id: 'Porcinos', label: 'Porcinos', icon: '🐷' },
  { id: 'Búfalos', label: 'Búfalos', icon: '🐃' },
  { id: 'Caprinos', label: 'Caprinos', icon: '🐐' },
  { id: 'Equinos', label: 'Equinos', icon: '🐴' }
];

export const MapasView: React.FC = () => {
  const [paddocks, setPaddocks] = useState<GisPaddock[]>(GIS_PADDOCKS);
  const [selectedPaddock, setSelectedPaddock] = useState<GisPaddock | null>(GIS_PADDOCKS[0]);
  const [selectedSpecies, setSelectedSpecies] = useState<'todos' | EspecieAnimal>('todos');
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

  // Handle species/sector filter change with auto-focus
  const handleSelectSector = (secId: 'todos' | EspecieAnimal) => {
    setSelectedSpecies(secId);
    if (secId !== 'todos') {
      const match = paddocks.find(p => p.especie === secId);
      if (match) {
        setSelectedPaddock(match);
      }
    }
  };

  // Filter paddocks by species, search & PRV status
  const filteredPaddocks = useMemo(() => {
    return paddocks.filter(p => {
      if (selectedSpecies !== 'todos' && p.especie !== selectedSpecies) {
        return false;
      }
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
        const matchSector = p.sector.toLowerCase().includes(q);
        const matchSpecies = p.especie.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchForage && !matchSector && !matchSpecies) return false;
      }
      return true;
    });
  }, [paddocks, selectedSpecies, prvFilter, paddockSearch]);

  // Active sector paddocks for KPI calculations
  const activeSectorPaddocks = useMemo(() => {
    if (selectedSpecies === 'todos') return paddocks;
    return paddocks.filter(p => p.especie === selectedSpecies);
  }, [paddocks, selectedSpecies]);

  // PRV breakdown counts
  const prvCounts = useMemo(() => {
    const counts = { optimo: 0, pastoreo: 0, sobrepastoreo: 0, descanso: 0 };
    activeSectorPaddocks.forEach(p => {
      const info = getPrvStatusInfo(
        p.animales,
        p.diasOcupacionActual,
        p.diasDescansoActual,
        p.diasDescansoRequeridos
      );
      counts[info.status]++;
    });
    return counts;
  }, [activeSectorPaddocks]);

  // Summary metrics for the active sector or all farm
  const totalSuperficie = activeSectorPaddocks.reduce((sum, p) => sum + p.areaHa, 0);
  const potrerosActivos = activeSectorPaddocks.filter(p => p.animales > 0).length;
  const potrerosDescanso = activeSectorPaddocks.filter(p => p.animales === 0).length;
  const animalesTotales = activeSectorPaddocks.reduce((sum, p) => sum + p.animales, 0);
  const uggTotales = activeSectorPaddocks.reduce((sum, p) => sum + p.uggPresentes, 0);

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
      especie: p.especie,
      sector: p.sector,
      tipoInstalacion: p.tipoInstalacion,
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
      prvStatus: p.prvStatus,
      sistemaAlojamiento: p.sistemaAlojamiento,
      capacidadMaxima: p.capacidadMaxima
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
          return 'rgba(34, 197, 94, 0.65)';
        case 'pastoreo':
          return 'rgba(234, 179, 8, 0.60)';
        case 'sobrepastoreo':
          return 'rgba(239, 68, 68, 0.65)';
        case 'descanso':
          return 'rgba(59, 130, 246, 0.55)';
        default:
          return 'rgba(34, 197, 94, 0.5)';
      }
    }

    // Layer-specific fills
    if (activeLayer === 'ndvi') {
      const val = paddock.ndviValue;
      if (val >= 0.75) return 'rgba(4, 120, 87, 0.70)';
      if (val >= 0.65) return 'rgba(22, 163, 74, 0.65)';
      if (val >= 0.55) return 'rgba(74, 222, 128, 0.60)';
      if (val >= 0.48) return 'rgba(132, 204, 22, 0.55)';
      if (val >= 0.40) return 'rgba(234, 179, 8, 0.55)';
      if (val >= 0.25) return 'rgba(217, 119, 6, 0.50)';
      return 'rgba(185, 28, 28, 0.55)';
    }

    if (activeLayer === 'topografico') {
      return paddock.animales > 0 ? 'rgba(74, 114, 85, 0.4)' : 'rgba(196, 164, 132, 0.35)';
    }

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
          <h2 className="toolbar-title">Cartografía Agro-GIS & Infraestructura Multi-Especie</h2>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Visor satelital predial: potreros PRV, galpones avícolas, cochineras, apriscos y caballerizas con carga zootécnica
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

      {/* Sector / Especie Filter Toolbar */}
      <div className="species-sector-toolbar">
        <div className="species-sector-scroll">
          {SECTORES.map(sec => {
            const isSelected = selectedSpecies === sec.id;
            const count = sec.id === 'todos'
              ? paddocks.length
              : paddocks.filter(p => p.especie === sec.id).length;
            return (
              <button
                key={sec.id}
                type="button"
                className={`sector-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectSector(sec.id)}
              >
                <span className="sector-tab-icon">{sec.icon}</span>
                <span className="sector-tab-label">{sec.label}</span>
                <span className="sector-tab-badge">{count}</span>
              </button>
            );
          })}
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {selectedSpecies === 'todos' ? 'Superficie Predial' : `Superficie Sector ${selectedSpecies}`}
            </div>
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              Instalaciones Activas
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosActivos} de {activeSectorPaddocks.length}
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              En Reposo / Disponibles
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosDescanso} sectores
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
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              Población & Carga Zootécnica
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {animalesTotales.toLocaleString('es-VE')} cab/aves ({uggTotales.toFixed(1)} UGG)
            </div>
          </div>
        </div>
      </div>

      {/* PRV Traffic Light Quick Filter Bar */}
      <div className="prv-summary-bar" style={{ padding: '8px 14px' }}>
        <div className="prv-summary-title">
          <Sparkles size={16} color="var(--primary-color)" />
          <span style={{ fontSize: 12.5 }}>Semáforo de Pastoreo / Ocupación:</span>
        </div>

        <div className="prv-summary-pills">
          <button
            type="button"
            className={`prv-filter-pill ${prvFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setPrvFilter('todos')}
          >
            Todos ({activeSectorPaddocks.length})
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-optimo ${prvFilter === 'optimo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('optimo')}
            title="Punto Óptimo de Reposo: listo para pastoreo o recepción"
          >
            <span>🟢 Punto Óptimo ({prvCounts.optimo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-pastoreo ${prvFilter === 'pastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('pastoreo')}
            title="Ocupación activa controlada"
          >
            <span>🟡 En Ocupación ({prvCounts.pastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-sobrepastoreo ${prvFilter === 'sobrepastoreo' ? 'active' : ''}`}
            onClick={() => setPrvFilter('sobrepastoreo')}
            title="Alerta de sobrepastoreo o alta densidad"
          >
            <span>🔴 Sobrepastoreo ({prvCounts.sobrepastoreo})</span>
          </button>

          <button
            type="button"
            className={`prv-filter-pill pill-descanso ${prvFilter === 'descanso' ? 'active' : ''}`}
            onClick={() => setPrvFilter('descanso')}
            title="En descanso, vacío sanitario o recuperación"
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
              <span>Tranqueras (G1-G12)</span>
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
                <span>0.10 (Suelo / Cemento)</span>
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
                          {SPECIES_EMOJI[hoveredPaddock.especie]} {hoveredPaddock.codigo} - {hoveredPaddock.nombre}
                        </strong>
                        <div style={{ fontSize: 10.5, color: '#94a3b8' }}>
                          {hoveredPaddock.sector} • {hoveredPaddock.especieForrajera}
                        </div>
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
                      <span>Lote & Carga Zootécnica:</span>
                      <strong>
                        {hoveredPaddock.animales > 0
                          ? `${hoveredPaddock.animales} ${hoveredPaddock.especie === 'Aves de corral' ? 'aves' : 'cab'} (${hoveredPaddock.uggPresentes.toFixed(1)} UGG)`
                          : 'Sin animales'}
                      </strong>
                    </div>

                    {hoveredPaddock.aforoKgMsHa > 0 ? (
                      <div className="gis-tooltip-row">
                        <span>Aforo & Oferta MS:</span>
                        <strong>{hoveredPaddock.aforoKgM2} kg/m² ({hoveredPaddock.aforoKgMsHa.toLocaleString('es-VE')} kg MS/ha)</strong>
                      </div>
                    ) : (
                      <div className="gis-tooltip-row">
                        <span>Alojamiento:</span>
                        <strong>{hoveredPaddock.sistemaAlojamiento || 'Instalación techada'}</strong>
                      </div>
                    )}

                    <div className="gis-tooltip-row">
                      <span>Permanencia / Reposo:</span>
                      <strong>
                        {hoveredPaddock.animales > 0
                          ? `${hoveredPaddock.diasOcupacionActual} días ocupado`
                          : `${hoveredPaddock.diasDescansoActual} / ${hoveredPaddock.diasDescansoRequeridos} días reposo`}
                      </strong>
                    </div>

                    <div className="gis-tooltip-row">
                      <span>Factor UGG & Densidad:</span>
                      <strong style={{ color: '#86efac' }}>
                        {getUggFactor(hoveredPaddock.especie)} UGG/cab • {hoveredPaddock.cargaUggHa.toFixed(2)} UGG/ha
                      </strong>
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
                Acceso al Corredor de Manejo y Callejón PRV
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: hoveredGate.abierta ? '#86efac' : '#fef08a', marginTop: 3 }}>
                Estado: {hoveredGate.abierta ? 'Abierta (Paso / Manejo activo)' : 'Cerrada (Sector en reposo)'}
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
                </defs>

                {/* Base Layer Texture */}
                <rect width="950" height="720" fill="url(#gisSatGrid)" />
                {activeLayer === 'topografico' && (
                  <rect width="950" height="720" fill="url(#topographicMesh)" />
                )}

                {/* Georeferencing Lat/Long Grid Lines */}
                <g stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3,3">
                  <line x1="200" y1="40" x2="200" y2="680" />
                  <line x1="450" y1="40" x2="450" y2="680" />
                  <line x1="700" y1="40" x2="700" y2="680" />
                  <line x1="60" y1="200" x2="930" y2="200" />
                  <line x1="60" y1="450" x2="930" y2="450" />
                </g>

                {/* Lat/Long Coordinate Ticks on Margins */}
                <g fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">
                  <text x="200" y="32" textAnchor="middle">69°13'15"W</text>
                  <text x="450" y="32" textAnchor="middle">69°13'00"W</text>
                  <text x="700" y="32" textAnchor="middle">69°12'45"W</text>
                  <text x="50" y="204" textAnchor="end">9°33'30"N</text>
                  <text x="50" y="454" textAnchor="end">9°33'00"N</text>
                </g>

                {/* Topographic Contour Lines */}
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
                  </g>
                )}

                {/* Central PRV Grazing Corridors & Service Roads connecting all sectors */}
                <g stroke={activeLayer === 'topografico' ? 'rgba(160, 130, 90, 0.6)' : 'rgba(215, 185, 140, 0.45)'} strokeWidth="8" strokeLinecap="round" fill="none">
                  {/* Horizontal Roads */}
                  <path d="M 50 275 L 940 275" />
                  <path d="M 50 490 L 940 490" />
                  {/* Vertical Roads */}
                  <path d="M 330 65 L 330 690" />
                  <path d="M 545 65 L 545 690" />
                  <path d="M 752 65 L 752 690" />
                  <path d="M 848 65 L 848 690" />
                </g>
                <g stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" fill="none" opacity="0.35">
                  <path d="M 50 275 L 940 275" />
                  <path d="M 50 490 L 940 490" />
                  <path d="M 330 65 L 330 690" />
                  <path d="M 545 65 L 545 690" />
                  <path d="M 752 65 L 752 690" />
                  <path d="M 848 65 L 848 690" />
                </g>

                {/* Multi-Species Paddocks & Installations Overlay */}
                {paddocks.map(paddock => {
                  const isSelected = selectedPaddock?.id === paddock.id;
                  const isHovered = hoveredPaddock?.id === paddock.id;
                  const matchesSpecies = selectedSpecies === 'todos' || paddock.especie === selectedSpecies;
                  const prvInfo = getPrvStatusInfo(
                    paddock.animales,
                    paddock.diasOcupacionActual,
                    paddock.diasDescansoActual,
                    paddock.diasDescansoRequeridos
                  );
                  const isOvergrazedAlert = prvInfo.status === 'sobrepastoreo';

                  // Dynamic styles when species is filtered
                  const opacity = matchesSpecies ? 1.0 : 0.22;
                  const strokeColor = isSelected ? '#52b788' : isHovered ? '#ffffff' : getPaddockStroke(paddock);
                  const strokeWidth = isSelected ? 4 : isHovered ? 3.5 : (selectedSpecies !== 'todos' && matchesSpecies) ? 3 : 2;

                  return (
                    <g
                      key={paddock.id}
                      style={{
                        opacity,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Polygon Surface */}
                      <polygon
                        points={paddock.polygonPoints}
                        fill={getPaddockFill(paddock)}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={paddock.animales === 0 && !isPrvMode ? '6,4' : undefined}
                        style={{
                          filter: isSelected
                            ? 'drop-shadow(0 0 14px rgba(82,183,136,0.95))'
                            : (selectedSpecies !== 'todos' && matchesSpecies)
                            ? 'drop-shadow(0 0 10px rgba(82,183,136,0.65))'
                            : isOvergrazedAlert
                            ? 'drop-shadow(0 0 10px rgba(239,68,68,0.75))'
                            : undefined
                        }}
                        onMouseEnter={() => setHoveredPaddock(paddock)}
                        onMouseLeave={() => setHoveredPaddock(null)}
                        onClick={() => setSelectedPaddock(paddock)}
                      />

                      {/* Overgrazing Alert Pulse */}
                      {isOvergrazedAlert && matchesSpecies && (
                        <circle
                          cx={paddock.center.x}
                          cy={paddock.center.y - 28}
                          r="9"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="pulse-warning"
                        />
                      )}

                      {/* Code and Species Icon Text */}
                      <text
                        x={paddock.center.x}
                        y={paddock.center.y - 10}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={paddock.areaHa < 2 ? "12" : "13.5"}
                        fontWeight="800"
                        style={{ pointerEvents: 'none', textShadow: '0 2px 5px rgba(0,0,0,0.9)' }}
                      >
                        {SPECIES_EMOJI[paddock.especie]} {paddock.codigo}
                      </text>

                      {/* Area label */}
                      <text
                        x={paddock.center.x}
                        y={paddock.center.y + 6}
                        textAnchor="middle"
                        fill="#f1f5f9"
                        fontSize="11"
                        fontWeight="600"
                        style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                      >
                        {paddock.areaHa} ha
                      </text>

                      {/* Animals & UGG count */}
                      {paddock.animales > 0 ? (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 22}
                          textAnchor="middle"
                          fill={isOvergrazedAlert ? '#fca5a5' : '#86efac'}
                          fontSize={paddock.areaHa < 2 ? "9.5" : "10"}
                          fontWeight="700"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                        >
                          {paddock.animales} {paddock.especie === 'Aves de corral' ? 'aves' : 'cab'} • {paddock.uggPresentes.toFixed(1)} UGG
                        </text>
                      ) : (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 22}
                          textAnchor="middle"
                          fill={prvInfo.status === 'optimo' ? '#86efac' : '#93c5fd'}
                          fontSize="9.5"
                          fontWeight="600"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                        >
                          {paddock.tipoInstalacion === 'potrero' || paddock.tipoInstalacion === 'sabana'
                            ? (prvInfo.status === 'optimo'
                                ? `🟢 Listo (${paddock.diasDescansoActual}d)`
                                : `🔵 Reposo (${paddock.diasDescansoActual}/${paddock.diasDescansoRequeridos}d)`)
                            : 'Disponible'}
                        </text>
                      )}

                      {/* NDVI value on active NDVI layer */}
                      {activeLayer === 'ndvi' && (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 36}
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="9.5"
                          fontWeight="800"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}
                        >
                          NDVI {paddock.ndviValue.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Gates (Tranqueras G1-G12) Overlay */}
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
                    <circle cx={gate.x - 4} cy={gate.y} r={3} fill="#475569" stroke="#ffffff" strokeWidth="1" />
                    <circle cx={gate.x + 4} cy={gate.y} r={3} fill="#475569" stroke="#ffffff" strokeWidth="1" />
                    <line
                      x1={gate.x - 4}
                      y1={gate.y}
                      x2={gate.x + 4}
                      y2={gate.y}
                      stroke={gate.abierta ? '#22c55e' : '#f59e0b'}
                      strokeWidth={2.5}
                    />
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
                      width={poi.nombre.length * 6.0 + 10}
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
                      fontSize="9.5"
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

        {/* Right: Selected Paddock Inspector & Zootechnical Balance Widget */}
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--primary-color)',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6
                        }}>
                          <span>{SPECIES_EMOJI[selectedPaddock.especie]}</span>
                          <span>{selectedPaddock.sector}</span>
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
                        {selectedPaddock.sistemaAlojamiento || selectedPaddock.especieForrajera}
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
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>CARGA ZOOTÉCNICA</span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary-color)' }}>
                      {selectedPaddock.cargaUggHa.toFixed(2)} UGG/ha
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.animales} {selectedPaddock.especie === 'Aves de corral' ? 'aves' : 'cab'} ({selectedPaddock.uggPresentes.toFixed(1)} UGG)
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {selectedPaddock.aforoKgMsHa > 0 ? 'AFORO MATERIA SECA' : 'CAPACIDAD DE DISEÑO'}
                    </span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d' }}>
                      {selectedPaddock.aforoKgMsHa > 0
                        ? `${selectedPaddock.aforoKgMsHa.toLocaleString('es-VE')} kg/ha`
                        : `${selectedPaddock.capacidadMaxima || Math.round(selectedPaddock.animales * 1.25)} plazas`}
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.aforoKgMsHa > 0
                        ? `${selectedPaddock.aforoKgM2} kg MV/m² (${selectedPaddock.porcentajeMS}% MS)`
                        : 'Aforo de Alojamiento'}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {selectedPaddock.aforoKgMsHa > 0 ? 'VIGOR NDVI' : 'SISTEMA'}
                    </span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}>
                      {selectedPaddock.aforoKgMsHa > 0
                        ? selectedPaddock.ndviValue.toFixed(2)
                        : (selectedPaddock.tipoInstalacion === 'galpon' ? 'Galpón' :
                           selectedPaddock.tipoInstalacion === 'cochinera' ? 'Cochinera' :
                           selectedPaddock.tipoInstalacion === 'aprisco' ? 'Aprisco' : 'Caballeriza')}
                    </div>
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {selectedPaddock.aforoKgMsHa > 0
                        ? selectedPaddock.especieForrajera.split(' ')[0]
                        : 'Bioseguridad'}
                    </span>
                  </div>
                </div>

                {/* Forage Balance / Facility Management Widget */}
                <ForageBalanceWidget
                  paddock={selectedPaddock}
                  onOpenAforoModal={() => setIsAforoModalOpen(true)}
                />
              </div>
            </div>
          ) : (
            <div className="gis-panel-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Info size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h4 style={{ margin: 0, fontSize: 14 }}>Ningún sector seleccionado</h4>
              <p style={{ fontSize: 12, marginTop: 4 }}>
                Haga clic en cualquier parcela o instalación del mapa para inspeccionar sus datos zootécnicos.
              </p>
            </div>
          )}

          {/* Quick Paddock List & Filter */}
          <div className="gis-panel-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Instalaciones del Predio ({filteredPaddocks.length})
              </h4>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Clic para enfocar</span>
            </div>

            <input
              type="text"
              className="form-input"
              placeholder="Buscar por código, sector o forraje..."
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
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
                      <span style={{ fontSize: 14 }}>{SPECIES_EMOJI[p.especie]}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.codigo} — {p.nombre}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.sector} • {p.especieForrajera}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{p.areaHa} ha</div>
                      <div style={{ fontSize: 10, color: prv.color, fontWeight: 600 }}>
                        {p.animales > 0 ? `${p.animales} cab/av` : prv.shortLabel}
                      </div>
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
