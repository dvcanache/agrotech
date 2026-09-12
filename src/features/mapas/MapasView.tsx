import React, { useState } from 'react';
import {
  GIS_PADDOCKS,
  GIS_POINTS_OF_INTEREST,
  GisPaddock,
  GisPointOfInterest
} from './mapasData';
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
  Maximize2,
  Compass,
  Info,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

type MapLayerType = 'satelital' | 'topografico' | 'ndvi';

export const MapasView: React.FC = () => {
  const [selectedPaddock, setSelectedPaddock] = useState<GisPaddock | null>(GIS_PADDOCKS[0]);
  const [hoveredPaddock, setHoveredPaddock] = useState<GisPaddock | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayerType>('satelital');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showPOIs, setShowPOIs] = useState<boolean>(true);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 1.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  // Total summary
  const totalSuperficie = GIS_PADDOCKS.reduce((sum, p) => sum + p.areaHa, 0);
  const potrerosActivos = GIS_PADDOCKS.filter(p => p.estatus === 'Activo').length;
  const potrerosDescanso = GIS_PADDOCKS.filter(p => p.estatus === 'En descanso').length;
  const animalesTotales = GIS_PADDOCKS.reduce((sum, p) => sum + p.animales, 0);

  // Style depending on layer
  const getMapBackground = () => {
    switch (activeLayer) {
      case 'satelital':
        return 'linear-gradient(135deg, #1e3a24 0%, #15261b 40%, #0d1b11 100%)';
      case 'topografico':
        return 'linear-gradient(135deg, #d8ccb8 0%, #c5b59b 40%, #b2a084 100%)';
      case 'ndvi':
        return 'linear-gradient(135deg, #0b2f11 0%, #144e1c 50%, #20722e 100%)';
      default:
        return '#1e3a24';
    }
  };

  const getPaddockFill = (paddock: GisPaddock) => {
    if (activeLayer === 'ndvi') {
      // NDVI scale: vibrant shades of green and yellow
      if (paddock.estatus === 'Activo') return 'rgba(34, 197, 94, 0.55)';
      if (paddock.estatus === 'En descanso') return 'rgba(234, 179, 8, 0.55)';
      return 'rgba(239, 68, 68, 0.45)';
    }
    if (activeLayer === 'topografico') {
      return paddock.estatus === 'Activo' ? 'rgba(45, 106, 79, 0.3)' : 'rgba(180, 140, 90, 0.3)';
    }
    return paddock.fillColor;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* Header */}
      <div className="events-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="events-header-left">
          <h2 className="toolbar-title">Cartografía GIS & Potreros</h2>
          <span>
            Visualizador satelital georreferenciado y delimitación de pasturas
          </span>
        </div>
        <div className="events-header-right">
          <Link to="/potreros" className="btn-secondary" style={{ textDecoration: 'none' }}>
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
        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Superficie Predial</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalSuperficie.toFixed(1)} ha
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Potreros en Pastoreo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosActivos} de {GIS_PADDOCKS.length}
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Potreros en Descanso</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {potrerosDescanso} parcelas
            </div>
          </div>
        </div>

        <div className="kpi-card" style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
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
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Animales en Pastoreo</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
              {animalesTotales} cabezas
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Workspace with Two Columns */}
      <div className="gis-workspace-grid">
        {/* Map Container */}
        <div style={{
          position: 'relative',
          backgroundColor: '#0d1b11',
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid #23422a',
          minWidth: 0,
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Top Floating Map Controls */}
          <div style={{
            position: 'absolute',
            top: 14,
            left: 14,
            right: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            {/* Layer Switcher */}
            <div className="gis-layer-switcher">
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'satelital' ? 'active' : ''}`}
                onClick={() => setActiveLayer('satelital')}
              >
                Satelital ArcGIS
              </button>
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'topografico' ? 'active' : ''}`}
                onClick={() => setActiveLayer('topografico')}
              >
                Topográfico
              </button>
              <button
                type="button"
                className={`gis-layer-btn ${activeLayer === 'ndvi' ? 'active' : ''}`}
                onClick={() => setActiveLayer('ndvi')}
              >
                Biomasa (NDVI)
              </button>
            </div>

            {/* Coordinates & Compass */}
            <div className="gis-coord-badge">
              <Compass size={14} color="#52b788" />
              <span>9°33'14" N, 69°12'54" W</span>
            </div>
          </div>

          {/* Zoom & Action Controls (Bottom Right) */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            zIndex: 10
          }}>
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
              title="Restablecer vista"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Toggle POIs Control (Bottom Left) */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 10,
            display: 'flex',
            gap: 8
          }}>
            <button
              type="button"
              className={`gis-toggle-btn ${showPOIs ? 'active' : ''}`}
              onClick={() => setShowPOIs(prev => !prev)}
            >
              <MapPin size={15} />
              <span>Instalaciones / Puntos</span>
            </button>
          </div>

          {/* Map SVG Canvas */}
          <div style={{
            width: '100%',
            height: 560,
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
              >
                {/* Defs for gradients & patterns */}
                <defs>
                  <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  </pattern>
                  <pattern id="contourPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="15" fill="none" stroke="rgba(100,80,50,0.12)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid Overlay */}
                <rect width="950" height="720" fill="url(#gridPattern)" />
                {activeLayer === 'topografico' && (
                  <rect width="950" height="720" fill="url(#contourPattern)" />
                )}

                {/* Road / Internal Path network */}
                <path
                  d="M 50 280 L 890 300 M 340 70 L 330 670 M 560 80 L 540 680"
                  stroke="rgba(210, 180, 140, 0.4)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Paddock Polygons */}
                {GIS_PADDOCKS.map(paddock => {
                  const isSelected = selectedPaddock?.id === paddock.id;
                  const isHovered = hoveredPaddock?.id === paddock.id;

                  return (
                    <g key={paddock.id}>
                      <polygon
                        points={paddock.polygonPoints}
                        fill={getPaddockFill(paddock)}
                        stroke={isSelected ? '#52b788' : isHovered ? '#ffffff' : paddock.color}
                        strokeWidth={isSelected ? 4 : isHovered ? 3 : 2}
                        strokeDasharray={paddock.estatus === 'En descanso' ? '6,3' : undefined}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          filter: isSelected ? 'drop-shadow(0 0 10px rgba(82,183,136,0.7))' : undefined
                        }}
                        onMouseEnter={() => setHoveredPaddock(paddock)}
                        onMouseLeave={() => setHoveredPaddock(null)}
                        onClick={() => setSelectedPaddock(paddock)}
                      />

                      {/* Paddock Label */}
                      <text
                        x={paddock.center.x}
                        y={paddock.center.y - 10}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="700"
                        style={{ pointerEvents: 'none', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
                      >
                        {paddock.codigo}
                      </text>
                      <text
                        x={paddock.center.x}
                        y={paddock.center.y + 8}
                        textAnchor="middle"
                        fill="#e2e8f0"
                        fontSize="11"
                        fontWeight="500"
                        style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                      >
                        {paddock.areaHa} ha
                      </text>
                      {paddock.animales > 0 && (
                        <text
                          x={paddock.center.x}
                          y={paddock.center.y + 24}
                          textAnchor="middle"
                          fill="#86efac"
                          fontSize="10"
                          fontWeight="600"
                          style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                        >
                          {paddock.animales} cab • {paddock.cargaUggHa} UGG
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Points of Interest */}
                {showPOIs && GIS_POINTS_OF_INTEREST.map(poi => (
                  <g key={poi.id} style={{ cursor: 'pointer' }}>
                    <circle
                      cx={poi.x}
                      cy={poi.y}
                      r={6}
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                    <rect
                      x={poi.x + 8}
                      y={poi.y - 9}
                      width={poi.nombre.length * 6.4 + 10}
                      height={18}
                      rx={4}
                      fill="rgba(15, 23, 42, 0.85)"
                    />
                    <text
                      x={poi.x + 13}
                      y={poi.y + 4}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {poi.nombre}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Selected Paddock Inspector Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, width: '100%' }}>
          {selectedPaddock ? (
            <div className="gis-panel-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, width: '100%' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary-color)',
                    letterSpacing: '0.05em'
                  }}>
                    Ficha de Parcela GIS
                  </span>
                  <h3 style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: '3px 0 0 0',
                    color: 'var(--text-primary)',
                    wordBreak: 'break-word',
                    lineHeight: 1.2
                  }}>
                    {selectedPaddock.codigo} - {selectedPaddock.nombre}
                  </h3>
                </div>
                <span
                  className={`badge-status ${selectedPaddock.estatus.toLowerCase().replace(' ', '-')}`}
                  style={{ flexShrink: 0 }}
                >
                  {selectedPaddock.estatus}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                padding: '12px 0',
                borderTop: '1px solid var(--border-gray)',
                borderBottom: '1px solid var(--border-gray)',
                width: '100%'
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Superficie</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedPaddock.areaHa} ha
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Perímetro</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedPaddock.perimetroM} m
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Carga Actual</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary-color)' }}>
                    {selectedPaddock.cargaUggHa} UGG/ha
                  </div>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Animales</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedPaddock.animales} cabezas
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, width: '100%' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, display: 'block' }}>FORRAJE DOMINANTE</span>
                  <div style={{ color: 'var(--text-primary)', marginTop: 2, fontWeight: 500, wordBreak: 'break-word' }}>
                    {selectedPaddock.especieForrajera}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, display: 'block' }}>LOTE ASIGNADO</span>
                  <div style={{ color: 'var(--text-primary)', marginTop: 2, fontWeight: 500, wordBreak: 'break-word' }}>
                    {selectedPaddock.lote}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: 4 }}>
                <Link
                  to="/potreros"
                  className="btn-primary"
                  style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}
                >
                  Ver en Maestro de Potreros
                </Link>
                <Link
                  to="/eventos"
                  className="btn-secondary"
                  style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}
                >
                  Registrar Rotación de Potrero
                </Link>
              </div>
            </div>
          ) : (
            <div className="gis-panel-card" style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Info size={32} style={{ margin: '0 auto 8px auto', opacity: 0.6 }} />
              <p>Seleccione un potrero en el mapa para inspeccionar sus métricas agronómicas.</p>
            </div>
          )}

          {/* Quick Paddock List */}
          <div className="gis-panel-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Directorio de Parcelas ({GIS_PADDOCKS.length})
              </h4>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Clic para enfocar</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto', width: '100%' }}>
              {GIS_PADDOCKS.map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 6,
                    backgroundColor: selectedPaddock?.id === p.id ? 'var(--primary-ultra-light)' : '#f8f9fa',
                    border: selectedPaddock?.id === p.id ? '1px solid var(--primary-light)' : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedPaddock(p)}
                >
                  <div style={{ minWidth: 0, marginRight: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.codigo}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nombre}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{p.areaHa} ha</div>
                    <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{p.estatus}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
