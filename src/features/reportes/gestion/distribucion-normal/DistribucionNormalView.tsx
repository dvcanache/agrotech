import React, { useState, useMemo } from 'react';
import {
  Play,
  LineChart,
  Table,
  Sliders,
  Award,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  X,
  Layers,
  Scale,
  Milk,
  Calendar,
  Zap,
  Egg,
  Sparkles,
  Droplets,
  Ruler,
  RefreshCw,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { NormalDistributionChart } from './NormalDistributionChart';
import {
  DistribucionNormalFilterDrawer,
  DistribucionNormalFilterValues
} from './DistribucionNormalFilterDrawer';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';
import { EspecieAnimal } from '../../../../types/animal';
import {
  ZOOTECH_VARIABLES,
  SPECIES_OPTIONS,
  MOCK_POBLACION_ZOOTECNICA,
  AnimalZootecnico,
  calculateZootechStats,
  calculateGeneticSimulation
} from './distribucionNormalData';

export const DistribucionNormalView: React.FC = () => {
  // Especie zootécnica seleccionada (por defecto Bovinos)
  const [selectedSpecies, setSelectedSpecies] = useState<EspecieAnimal>('Bovinos');

  // Variable zootécnica seleccionada (por defecto Producción 305 Días)
  const [selectedVarId, setSelectedVarId] = useState<string>('produccion_305');

  // Estado de procesamiento
  const [isProcessed, setIsProcessed] = useState(true);
  const [activeTab, setActiveTab] = useState<'gauss' | 'tabla' | 'animales'>('gauss');

  // Sliders de Selección Genética y Descarte (Culling)
  const [lowerPercent, setLowerPercent] = useState<number>(15);
  const [upperPercent, setUpperPercent] = useState<number>(15);

  // Parámetros efectivamente aplicados en la simulación y gráficos
  const [appliedLowerPercent, setAppliedLowerPercent] = useState<number>(15);
  const [appliedUpperPercent, setAppliedUpperPercent] = useState<number>(15);

  // Control de recálculo y actualización
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  // Semoviente seleccionado para vista rápida
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalZootecnico | null>(null);

  // Estados de modales y drawers
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Filtros aplicados
  const [filters, setFilters] = useState<DistribucionNormalFilterValues>({
    tipo: 'Todos',
    variable: 'Días producción',
    agruparPor: 'Lote',
    min: '',
    max: '',
    desde: '',
    hasta: '',
    rebano: 'Todos los Rebaños',
    raza: 'Todas las Razas',
    padre: ''
  });

  // Columnas configurables para la tabla de intervalos
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'rango', label: 'Rango de Valores', visible: true },
    { key: 'frecuenciaObservada', label: 'Frecuencia Observada (fo)', visible: true },
    { key: 'porcentajeObservado', label: '% Observado', visible: true },
    { key: 'frecuenciaEsperada', label: 'Frecuencia Esperada (fe)', visible: true },
    { key: 'porcentajeAcumulado', label: '% Acumulado', visible: true },
    { key: 'zScore', label: 'Z-Score', visible: true }
  ]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  const isColVisible = (key: string) => columns.find(c => c.key === key)?.visible ?? true;

  // Variables zootécnicas asociadas a la especie seleccionada
  const speciesVariables = useMemo(() => {
    return ZOOTECH_VARIABLES.filter(v => v.especie === selectedSpecies);
  }, [selectedSpecies]);

  // Configuración de la variable actual
  const currentVarConfig = useMemo(() => {
    const found = ZOOTECH_VARIABLES.find(v => v.id === selectedVarId);
    if (found && found.especie === selectedSpecies) return found;
    const fallback = ZOOTECH_VARIABLES.find(v => v.especie === selectedSpecies);
    return fallback || ZOOTECH_VARIABLES[0];
  }, [selectedVarId, selectedSpecies]);

  // Cambio de especie zootécnica
  const handleSpeciesChange = (speciesId: EspecieAnimal) => {
    setSelectedSpecies(speciesId);
    const targetVars = ZOOTECH_VARIABLES.filter(v => v.especie === speciesId);
    if (targetVars.length > 0) {
      setSelectedVarId(targetVars[0].id);
    }
    setSelectedAnimal(null);
    setIsProcessed(true);
    setHasPendingChanges(false);
  };

  // Población filtrada según filtros del drawer y variable zootécnica
  const rawAnimals = useMemo(() => {
    const list = MOCK_POBLACION_ZOOTECNICA[currentVarConfig.id] || [];
    return list.filter(animal => {
      if (filters.raza !== 'Todas las Razas' && animal.raza !== filters.raza) return false;
      if (filters.min && !isNaN(parseFloat(filters.min)) && animal.valor < parseFloat(filters.min)) return false;
      if (filters.max && !isNaN(parseFloat(filters.max)) && animal.valor > parseFloat(filters.max)) return false;
      return true;
    });
  }, [currentVarConfig.id, filters.raza, filters.min, filters.max]);

  // Razas disponibles para la especie y variable actual
  const availableBreeds = useMemo(() => {
    const list = MOCK_POBLACION_ZOOTECNICA[currentVarConfig.id] || [];
    return Array.from(new Set(list.map(a => a.raza))).sort();
  }, [currentVarConfig.id]);

  // Estadísticas zootécnicas calculadas
  const stats = useMemo(() => {
    return calculateZootechStats(rawAnimals);
  }, [rawAnimals]);

  // Simulación genética dinámica con parámetros aplicados (utilizada en gráficos, tablas y métricas)
  const simulation = useMemo(() => {
    return calculateGeneticSimulation(
      rawAnimals,
      stats,
      appliedLowerPercent,
      appliedUpperPercent,
      currentVarConfig.esMenorMejor
    );
  }, [rawAnimals, stats, appliedLowerPercent, appliedUpperPercent, currentVarConfig.esMenorMejor]);

  // Previsualización de corte zootécnico en tiempo real para las tarjetas de sliders mientras se ajustan
  const previewSimulation = useMemo(() => {
    if (lowerPercent === appliedLowerPercent && upperPercent === appliedUpperPercent) {
      return simulation;
    }
    return calculateGeneticSimulation(
      rawAnimals,
      stats,
      lowerPercent,
      upperPercent,
      currentVarConfig.esMenorMejor
    );
  }, [rawAnimals, stats, lowerPercent, upperPercent, appliedLowerPercent, appliedUpperPercent, simulation, currentVarConfig.esMenorMejor]);

  const handleLowerChange = (val: number) => {
    const clamped = Math.max(0, Math.min(30, isNaN(val) ? 0 : val));
    setLowerPercent(clamped);
    setHasPendingChanges(clamped !== appliedLowerPercent || upperPercent !== appliedUpperPercent);
  };

  const handleUpperChange = (val: number) => {
    const clamped = Math.max(0, Math.min(30, isNaN(val) ? 0 : val));
    setUpperPercent(clamped);
    setHasPendingChanges(lowerPercent !== appliedLowerPercent || clamped !== appliedUpperPercent);
  };

  // Nomenclatura zootécnica adaptada a cada especie
  const getSubjectWording = (species: EspecieAnimal) => {
    switch (species) {
      case 'Aves de corral': return 'lotes / aves';
      case 'Porcinos': return 'cerdas / ejemplares';
      case 'Búfalos': return 'búfalas / bucerros';
      case 'Caprinos': return 'cabras / cabritos';
      case 'Equinos': return 'ejemplares equinos';
      default: return 'vientres / semovientes';
    }
  };

  const getEliteGroupLabel = (species: EspecieAnimal) => {
    switch (species) {
      case 'Aves de corral': return 'Lotes / Aves Élite';
      case 'Porcinos': return 'Cerdas Élite / Reproductores';
      case 'Equinos': return 'Ejemplares Élite';
      default: return 'Donadoras Élite';
    }
  };

  const getCullingGroupLabel = (species: EspecieAnimal) => {
    switch (species) {
      case 'Aves de corral': return 'Descarte / Salida de Lote';
      case 'Porcinos': return 'Descarte / Reemplazo';
      case 'Equinos': return 'Descarte / Reubicación';
      default: return 'Descarte Sugerido (Culling)';
    }
  };

  const handleActualizarSimulador = () => {
    setIsRecalculating(true);
    setAppliedLowerPercent(lowerPercent);
    setAppliedUpperPercent(upperPercent);
    setHasPendingChanges(false);

    // Calcular valores actualizados de corte para el feedback
    const updatedSim = calculateGeneticSimulation(
      rawAnimals,
      stats,
      lowerPercent,
      upperPercent,
      currentVarConfig.esMenorMejor
    );

    const cullingSymbol = !currentVarConfig.esMenorMejor ? '≤' : '≥';
    const eliteSymbol = !currentVarConfig.esMenorMejor ? '≥' : '≤';

    setUpdateFeedback(
      `¡Simulación zootécnica actualizada [${selectedSpecies}]! Descarte: ${lowerPercent}% (${cullingSymbol} ${updatedSim.lowerCutoffValue} ${currentVarConfig.unidad}, ${updatedSim.cullingAnimals.length} ${getSubjectWording(selectedSpecies)}) | Élite: ${upperPercent}% (${eliteSymbol} ${updatedSim.upperCutoffValue} ${currentVarConfig.unidad}, ${updatedSim.eliteAnimals.length} ${getSubjectWording(selectedSpecies)})`
    );

    setTimeout(() => {
      setUpdateFeedback(null);
    }, 4500);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 250);
  };

  const handleResetParametros = () => {
    setLowerPercent(15);
    setUpperPercent(15);
    setAppliedLowerPercent(15);
    setAppliedUpperPercent(15);
    setHasPendingChanges(false);
    setUpdateFeedback('Parámetros restablecidos a los valores estándar (15% Descarte / 15% Élite).');
    setTimeout(() => setUpdateFeedback(null), 3500);
  };

  const handleProcesar = () => {
    setIsProcessed(true);
    handleActualizarSimulador();
  };

  const handleExportXLSX = () => {
    if (!isProcessed) return;
    const headers = [
      'Rango del Intervalo',
      'Frecuencia Observada (fo)',
      '% Observado',
      'Frecuencia Esperada (fe)',
      '% Acumulado',
      'Z-Score'
    ];
    const rows = stats.intervalosFrecuencia.map(row => [
      row.rango,
      row.frecuenciaObservada,
      `${row.porcentajeObservado}%`,
      row.frecuenciaEsperada,
      `${row.porcentajeAcumulado}%`,
      row.zScore
    ]);
    exportToCSV(`distribucion_normal_${selectedSpecies}_${currentVarConfig.id}`, headers, rows);
  };

  const handleExportPDF = () => {
    if (!isProcessed) return;
    const headers = ['Arete', 'Nombre', 'Raza', 'Categoría', 'Lote', `${currentVarConfig.nombre} (${currentVarConfig.unidad})`, 'Z-Score', 'Recomendación'];
    const rows = rawAnimals.map(a => {
      const isCull = simulation.cullingAnimals.some(c => c.id === a.id);
      const isElite = simulation.eliteAnimals.some(e => e.id === a.id);
      const rec = isCull ? getCullingGroupLabel(selectedSpecies) : isElite ? getEliteGroupLabel(selectedSpecies) : 'Promedio';
      const z = stats.desviacionEstandar > 0 ? ((a.valor - stats.media) / stats.desviacionEstandar).toFixed(2) : '0';
      return [a.arete, a.nombre, a.raza, a.categoria, a.lote, a.valor, z, rec];
    });
    exportToPDF(
      `distribucion_normal_${selectedSpecies}_${currentVarConfig.id}`,
      `Análisis Biométrico Gaussiano (${selectedSpecies}) - ${currentVarConfig.nombre}`,
      headers,
      rows
    );
  };

  const getVariableIcon = (varId: string) => {
    switch (varId) {
      case 'peso_destete':
      case 'peso_destete_bucerro':
      case 'peso_destete_cabrito':
      case 'peso_faena_pollo':
        return <Scale size={20} />;
      case 'produccion_305':
      case 'leche_bufala_270':
      case 'leche_cabra_210':
        return <Milk size={20} />;
      case 'gdp':
      case 'gdp_porcina':
      case 'gdp_caprina':
        return <TrendingUp size={20} />;
      case 'iep':
        return <Calendar size={20} />;
      case 'postura_pct':
        return <Egg size={20} />;
      case 'ica_avicola':
      case 'grasa_dorsal':
        return <TrendingDown size={20} />;
      case 'lnv_camada':
        return <Sparkles size={20} />;
      case 'grasa_bufala_pct':
        return <Droplets size={20} />;
      case 'alzada_cruz':
      case 'perimetro_toracico':
        return <Ruler size={20} />;
      case 'condicion_equina':
        return <Award size={20} />;
      default:
        return <LineChart size={20} />;
    }
  };

  return (
    <div className="report-view-container">
      {/* Encabezado con título y acciones */}
      <ReportViewHeader
        title="Distribución normal & Selección Genética"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={filters.min || filters.max || filters.raza !== 'Todas las Razas' ? 1 : 0}
        onExportXLSX={handleExportXLSX}
        exportDisabled={!isProcessed}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleExportPDF}
              title="Descargar Ficha en PDF"
              style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px' }}
            >
              <span>PDF Zootécnico</span>
            </button>
            <button
              type="button"
              className="btn-amber-action"
              onClick={handleProcesar}
              title="Recalcular parámetros de la muestra"
            >
              <Play size={14} fill="#ffffff" />
              <span>Procesar</span>
            </button>
          </div>
        }
      />

      {/* Barra Selectora Multiespecie */}
      <div className="species-selector-bar">
        {SPECIES_OPTIONS.map(spec => {
          const isSelected = selectedSpecies === spec.id;
          return (
            <button
              key={spec.id}
              type="button"
              className={`species-tab-btn ${isSelected ? 'active' : ''}`}
              onClick={() => handleSpeciesChange(spec.id)}
              title={`${spec.nombre} - ${spec.descripcion}`}
            >
              <span className="species-tab-icon">{spec.icono}</span>
              <span className="species-tab-name">{spec.nombre}</span>
            </button>
          );
        })}
      </div>

      {/* Selector Rápido de Variable Zootécnica de la Especie */}
      <div className="variable-selector-grid">
        {speciesVariables.map(v => {
          const isActive = currentVarConfig.id === v.id;
          return (
            <button
              key={v.id}
              type="button"
              className={`variable-card-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSelectedVarId(v.id);
                setIsProcessed(true);
              }}
            >
              <div className="variable-icon-wrapper">
                {getVariableIcon(v.id)}
              </div>
              <div className="variable-card-info">
                <span className="variable-card-title">{v.nombre}</span>
                <span className="variable-card-sub">{v.subtitulo}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido Principal */}
      <div className="gaussian-analytics-container">
        {/* Tarjetas de Métricas Estadísticas Zootécnicas Completas */}
        <div className="zootech-stats-grid">
          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Media (μ)</span>
            <span className="zootech-stat-value">{stats.media}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
              {currentVarConfig.unidad} (Valor Esperado)
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Desv. Estándar (σ)</span>
            <span className="zootech-stat-value">{stats.desviacionEstandar}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#eff6ff', color: '#1e40af' }}>
              ±{stats.desviacionEstandar} {currentVarConfig.unidad}
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Varianza (σ²)</span>
            <span className="zootech-stat-value">{stats.varianza.toLocaleString()}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
              Dispersión Poblacional
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Mediana (Me / P50)</span>
            <span className="zootech-stat-value">{stats.mediana}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#f5f3ff', color: '#6d28d9' }}>
              Centro 50%
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Coef. Variación</span>
            <span className="zootech-stat-value">{stats.coeficienteVariacion}%</span>
            <span
              className="zootech-stat-pill"
              style={{
                backgroundColor: stats.coeficienteVariacion < 15 ? '#dcfce7' : '#fef3c7',
                color: stats.coeficienteVariacion < 15 ? '#15803d' : '#b45309'
              }}
            >
              {stats.coeficienteVariacion < 15 ? 'Alta Homogeneidad' : 'Variabilidad Moderada'}
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Percentiles (P25 - P75)</span>
            <span className="zootech-stat-value">{stats.p25} - {stats.p75}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
              Rango Intercuartil
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Extremos (P10 - P90)</span>
            <span className="zootech-stat-value">{stats.p10} - {stats.p90}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
              80% Central
            </span>
          </div>

          <div className="zootech-stat-card">
            <span className="zootech-stat-title">Muestra Activa (N)</span>
            <span className="zootech-stat-value">{stats.n}</span>
            <span className="zootech-stat-pill" style={{ backgroundColor: '#e8f5e9', color: 'var(--primary-color)' }}>
              100% Evaluados
            </span>
          </div>
        </div>

        {/* Panel de Simulación Genética & Sliders de Umbrales */}
        <div className="genetic-simulation-panel">
          <div className="simulation-header">
            <div className="simulation-header-title">
              <Sliders size={18} color="var(--primary-color)" />
              <span>Simulador Zootécnico de Presión de Selección y Descarte Genético ({selectedSpecies})</span>
              {hasPendingChanges && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 9px',
                  borderRadius: 12,
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a'
                }}>
                  ● Cambios pendientes por actualizar
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleActualizarSimulador}
                disabled={isRecalculating}
                title="Actualizar y recalcular simulación zootécnica y campana de Gauss"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 16px',
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderRadius: 8,
                  backgroundColor: hasPendingChanges ? '#ea580c' : '#2d6a4f',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <RefreshCw size={14} className={isRecalculating ? 'spin-anim' : ''} />
                <span>{isRecalculating ? 'Recalculando...' : hasPendingChanges ? 'Actualizar Simulación ●' : 'Actualizar Simulación'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetParametros}
                title="Restablecer a valores estándar (15% / 15%)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid var(--border-gray)',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={13} />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Feedback banner al actualizar */}
          {updateFeedback && (
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: 8,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#166534',
              fontSize: 12.5,
              fontWeight: 600
            }}>
              <CheckCircle2 size={16} color="#16a34a" />
              <span>{updateFeedback}</span>
            </div>
          )}

          {/* Banner de Ganancia Potencial del Rebaño / Piara / Parvada */}
          <div className="simulation-gain-banner">
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#15803d',
              flexShrink: 0
            }}>
              <Zap size={24} />
            </div>

            <div className="gain-metric-box">
              <span className="gain-metric-label">Progreso del Plantel tras Descarte ({selectedSpecies})</span>
              <span className="gain-metric-val">
                {simulation.potentialHerdGain > 0 ? `+${simulation.potentialHerdGain}` : simulation.potentialHerdGain} {currentVarConfig.unidad}
              </span>
              <span style={{ fontSize: 11.5, color: '#166534' }}>
                Nuevo promedio estimado: <strong>{simulation.remainingMean} {currentVarConfig.unidad}</strong> ({simulation.remainingAnimalsCount} {getSubjectWording(selectedSpecies)} retenidos)
              </span>
            </div>

            <div style={{ width: 1, height: 40, backgroundColor: '#bbf7d0', margin: '0 8px' }} />

            <div className="gain-metric-box">
              <span className="gain-metric-label">Diferencial de Selección (S) — {getEliteGroupLabel(selectedSpecies)}</span>
              <span className="gain-metric-val" style={{ color: '#1d4ed8' }}>
                +{simulation.selectionDifferential} {currentVarConfig.unidad}
              </span>
              <span style={{ fontSize: 11.5, color: '#1e40af' }}>
                Promedio grupo élite: <strong>{simulation.eliteMean} {currentVarConfig.unidad}</strong> ({simulation.eliteAnimals.length} {getSubjectWording(selectedSpecies)})
              </span>
            </div>
          </div>

          {/* Sliders duales interactivos */}
          <div className="sliders-dual-grid">
            {/* Slider 1: Umbral Inferior de Descarte (Culling) */}
            <div className="slider-card-culling">
              <div className="slider-title-row">
                <span className="slider-label culling">
                  <AlertTriangle size={15} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                  Umbral Inferior — {getCullingGroupLabel(selectedSpecies)}
                </span>
                <span className="slider-badge-val culling">
                  {lowerPercent}% inferior ({previewSimulation.cullingAnimals.length} {getSubjectWording(selectedSpecies)})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  className="modern-range-slider culling"
                  value={lowerPercent}
                  onChange={e => handleLowerChange(parseInt(e.target.value, 10) || 0)}
                  style={{ flex: 1 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={lowerPercent}
                    onChange={e => handleLowerChange(parseInt(e.target.value, 10) || 0)}
                    onKeyDown={e => { if (e.key === 'Enter') handleActualizarSimulador(); }}
                    style={{
                      width: 52,
                      padding: '4px 6px',
                      border: '1.5px solid #fca5a5',
                      borderRadius: 6,
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#991b1b',
                      fontSize: 13,
                      background: '#fff'
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#991b1b' }}>%</span>
                </div>
              </div>

              {/* Presets rápidos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10.5, color: '#991b1b', fontWeight: 600 }}>Presets:</span>
                {[5, 10, 15, 20, 25].map(p => (
                  <button
                    key={p}
                    type="button"
                    className="simulation-preset-btn"
                    onClick={() => handleLowerChange(p)}
                    style={{
                      border: lowerPercent === p ? '1px solid #dc2626' : '1px solid #fecaca',
                      background: lowerPercent === p ? '#dc2626' : '#fff',
                      color: lowerPercent === p ? '#fff' : '#991b1b'
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#991b1b', fontWeight: 600 }}>
                <span>Corte: {!currentVarConfig.esMenorMejor ? `≤ ${previewSimulation.lowerCutoffValue}` : `≥ ${previewSimulation.lowerCutoffValue}`} {currentVarConfig.unidad}</span>
                <span>Recomendación: Culling / Reemplazo</span>
              </div>
            </div>

            {/* Slider 2: Umbral Superior de Donadoras / Ejemplares Élite */}
            <div className="slider-card-elite">
              <div className="slider-title-row">
                <span className="slider-label elite">
                  <Award size={16} style={{ display: 'inline', verticalAlign: 'sub', marginRight: 4 }} />
                  Umbral Superior — {getEliteGroupLabel(selectedSpecies)}
                </span>
                <span className="slider-badge-val elite">
                  {upperPercent}% superior ({previewSimulation.eliteAnimals.length} {getSubjectWording(selectedSpecies)})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  className="modern-range-slider elite"
                  value={upperPercent}
                  onChange={e => handleUpperChange(parseInt(e.target.value, 10) || 0)}
                  style={{ flex: 1 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={upperPercent}
                    onChange={e => handleUpperChange(parseInt(e.target.value, 10) || 0)}
                    onKeyDown={e => { if (e.key === 'Enter') handleActualizarSimulador(); }}
                    style={{
                      width: 52,
                      padding: '4px 6px',
                      border: '1.5px solid #bfdbfe',
                      borderRadius: 6,
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#1e40af',
                      fontSize: 13,
                      background: '#fff'
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1e40af' }}>%</span>
                </div>
              </div>

              {/* Presets rápidos */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10.5, color: '#1e40af', fontWeight: 600 }}>Presets:</span>
                {[5, 10, 15, 20, 25].map(p => (
                  <button
                    key={p}
                    type="button"
                    className="simulation-preset-btn"
                    onClick={() => handleUpperChange(p)}
                    style={{
                      border: upperPercent === p ? '1px solid #2563eb' : '1px solid #bfdbfe',
                      background: upperPercent === p ? '#2563eb' : '#fff',
                      color: upperPercent === p ? '#fff' : '#1e40af'
                    }}
                  >
                    {p}%
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#1e40af', fontWeight: 600 }}>
                <span>Corte: {!currentVarConfig.esMenorMejor ? `≥ ${previewSimulation.upperCutoffValue}` : `≤ ${previewSimulation.upperCutoffValue}`} {currentVarConfig.unidad}</span>
                <span>Recomendación: Selección Élite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de Pestaña: Campana de Gauss vs Tabla Frecuencias vs Semovientes */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn-blue-icon ${activeTab === 'gauss' ? '' : 'btn-ghost'}`}
            style={{
              backgroundColor: activeTab === 'gauss' ? 'var(--primary-color)' : '#f3f4f6',
              color: activeTab === 'gauss' ? '#ffffff' : 'var(--text-primary)'
            }}
            onClick={() => setActiveTab('gauss')}
          >
            <LineChart size={15} />
            <span>Campana de Gauss Interactiva</span>
          </button>

          <button
            type="button"
            className={`btn-blue-icon ${activeTab === 'animales' ? '' : 'btn-ghost'}`}
            style={{
              backgroundColor: activeTab === 'animales' ? 'var(--primary-color)' : '#f3f4f6',
              color: activeTab === 'animales' ? '#ffffff' : 'var(--text-primary)'
            }}
            onClick={() => setActiveTab('animales')}
          >
            <Layers size={15} />
            <span>Grupos de Selección ({simulation.cullingAnimals.length} descarte / {simulation.eliteAnimals.length} élite)</span>
          </button>

          <button
            type="button"
            className={`btn-blue-icon ${activeTab === 'tabla' ? '' : 'btn-ghost'}`}
            style={{
              backgroundColor: activeTab === 'tabla' ? 'var(--primary-color)' : '#f3f4f6',
              color: activeTab === 'tabla' ? '#ffffff' : 'var(--text-primary)'
            }}
            onClick={() => setActiveTab('tabla')}
          >
            <Table size={15} />
            <span>Tabla de Intervalos de Frecuencia</span>
          </button>
        </div>

        {/* Pestaña 1: Gráfico de Campana de Gauss con Cortes Visuales */}
        {activeTab === 'gauss' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 10,
            border: '1px solid var(--border-gray)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
            padding: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Curva de Densidad Normal Gaussiana ({selectedSpecies}) — {currentVarConfig.nombre}
                </h4>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                  {currentVarConfig.descripcion}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 600 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#dc2626' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: 'rgba(239,68,68,0.4)', border: '1.5px solid #dc2626', borderRadius: 2 }} />
                  Descarte ({appliedLowerPercent}%)
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#15803d' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: 'rgba(82,183,136,0.4)', border: '1.5px solid #15803d', borderRadius: 2 }} />
                  Población Central
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#2563eb' }}>
                  <span style={{ width: 10, height: 10, backgroundColor: 'rgba(37,99,235,0.4)', border: '1.5px solid #2563eb', borderRadius: 2 }} />
                  {getEliteGroupLabel(selectedSpecies)} ({appliedUpperPercent}%)
                </span>
              </div>
            </div>

            <NormalDistributionChart
              curva={stats.curvaGauss}
              unidad={currentVarConfig.unidad}
              media={stats.media}
              desviacionEstandar={stats.desviacionEstandar}
              lowerCutoffValue={simulation.lowerCutoffValue}
              upperCutoffValue={simulation.upperCutoffValue}
              lowerPercent={appliedLowerPercent}
              upperPercent={appliedUpperPercent}
              variableName={currentVarConfig.nombre}
              isLowerBetter={currentVarConfig.esMenorMejor}
            />

            {/* Fila con Chips de Aretes Rápidos Clickables para ambos grupos */}
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#991b1b', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>🔻 {getCullingGroupLabel(selectedSpecies)} ({simulation.cullingAnimals.length})</span>
                  <span>{!currentVarConfig.esMenorMejor ? `≤ ${simulation.lowerCutoffValue}` : `≥ ${simulation.lowerCutoffValue}`} {currentVarConfig.unidad}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 90, overflowY: 'auto' }}>
                  {simulation.cullingAnimals.map(anim => (
                    <button
                      key={anim.id}
                      type="button"
                      className="animal-tag-chip"
                      onClick={() => setSelectedAnimal(anim)}
                      title={`Ver ficha rápida de ${anim.arete} - ${anim.nombre}`}
                      style={{ borderLeft: '3px solid #dc2626' }}
                    >
                      <span>{anim.arete}</span>
                      <span style={{ color: '#991b1b', fontWeight: 600 }}>({anim.valor})</span>
                    </button>
                  ))}
                  {simulation.cullingAnimals.length === 0 && (
                    <span style={{ fontSize: 12, color: '#991b1b' }}>No hay ejemplares en este rango (aumente el slider).</span>
                  )}
                </div>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                  <span>⭐ {getEliteGroupLabel(selectedSpecies)} ({simulation.eliteAnimals.length})</span>
                  <span>{!currentVarConfig.esMenorMejor ? `≥ ${simulation.upperCutoffValue}` : `≤ ${simulation.upperCutoffValue}`} {currentVarConfig.unidad}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 90, overflowY: 'auto' }}>
                  {simulation.eliteAnimals.map(anim => (
                    <button
                      key={anim.id}
                      type="button"
                      className="animal-tag-chip"
                      onClick={() => setSelectedAnimal(anim)}
                      title={`Ver ficha rápida de ${anim.arete} - ${anim.nombre}`}
                      style={{ borderLeft: '3px solid #2563eb' }}
                    >
                      <span>{anim.arete}</span>
                      <span style={{ color: '#1e40af', fontWeight: 600 }}>({anim.valor})</span>
                    </button>
                  ))}
                  {simulation.eliteAnimals.length === 0 && (
                    <span style={{ fontSize: 12, color: '#1e40af' }}>No hay ejemplares en este rango (aumente el slider).</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña 2: Tablas comparativas de Selección Genética y Descarte */}
        {activeTab === 'animales' && (
          <div className="selection-tables-grid">
            {/* Tabla Grupo Descarte */}
            <div className="selection-group-box">
              <div className="selection-group-header culling">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={16} />
                  <span>{getCullingGroupLabel(selectedSpecies)} ({simulation.cullingAnimals.length})</span>
                </div>
                <span className="slider-badge-val culling">
                  Promedio: {simulation.cullingAnimals.length > 0 ? (simulation.cullingAnimals.reduce((acc, a) => acc + a.valor, 0) / simulation.cullingAnimals.length).toFixed(stats.precision > 0 ? stats.precision : 1) : 0} {currentVarConfig.unidad}
                </span>
              </div>

              <div className="report-table-wrapper" style={{ maxHeight: 420 }}>
                <table className="report-grid-table">
                  <thead>
                    <tr>
                      <th>Identificador / Arete</th>
                      <th>Nombre / Denominación</th>
                      <th>Raza</th>
                      <th>Lote</th>
                      <th>Valor ({currentVarConfig.unidad})</th>
                      <th>Z-Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.cullingAnimals.map(anim => (
                      <tr
                        key={anim.id}
                        onClick={() => setSelectedAnimal(anim)}
                        style={{ cursor: 'pointer' }}
                        title="Haga click para ver detalles"
                      >
                        <td>
                          <span className="animal-tag-chip" style={{ borderLeft: '3px solid #dc2626' }}>
                            {anim.arete}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{anim.nombre}</td>
                        <td>{anim.raza}</td>
                        <td>{anim.lote}</td>
                        <td style={{ fontWeight: 800, color: '#dc2626' }}>
                          {anim.valor}
                        </td>
                        <td style={{ color: '#991b1b', fontWeight: 600 }}>
                          {anim.zScore} σ
                        </td>
                      </tr>
                    ))}
                    {simulation.cullingAnimals.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>
                          No hay ejemplares bajo el corte de descarte actual.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Grupo Élite */}
            <div className="selection-group-box">
              <div className="selection-group-header elite">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={16} />
                  <span>{getEliteGroupLabel(selectedSpecies)} ({simulation.eliteAnimals.length})</span>
                </div>
                <span className="slider-badge-val elite">
                  Promedio: {simulation.eliteMean} {currentVarConfig.unidad}
                </span>
              </div>

              <div className="report-table-wrapper" style={{ maxHeight: 420 }}>
                <table className="report-grid-table">
                  <thead>
                    <tr>
                      <th>Identificador / Arete</th>
                      <th>Nombre / Denominación</th>
                      <th>Raza</th>
                      <th>Lote</th>
                      <th>Valor ({currentVarConfig.unidad})</th>
                      <th>Z-Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.eliteAnimals.map(anim => (
                      <tr
                        key={anim.id}
                        onClick={() => setSelectedAnimal(anim)}
                        style={{ cursor: 'pointer' }}
                        title="Haga click para ver detalles"
                      >
                        <td>
                          <span className="animal-tag-chip" style={{ borderLeft: '3px solid #2563eb' }}>
                            {anim.arete}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{anim.nombre}</td>
                        <td>{anim.raza}</td>
                        <td>{anim.lote}</td>
                        <td style={{ fontWeight: 800, color: '#2563eb' }}>
                          {anim.valor}
                        </td>
                        <td style={{ color: '#1d4ed8', fontWeight: 600 }}>
                          +{anim.zScore} σ
                        </td>
                      </tr>
                    ))}
                    {simulation.eliteAnimals.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-secondary)' }}>
                          No hay ejemplares sobre el corte élite actual.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pestaña 3: Vista de Tabla de Intervalos y Deciles */}
        {activeTab === 'tabla' && (
          <div className="report-table-wrapper">
            <table className="report-grid-table">
              <thead>
                <tr>
                  {isColVisible('rango') && <th>Rango del Intervalo ({currentVarConfig.unidad})</th>}
                  {isColVisible('frecuenciaObservada') && <th>Frecuencia Observada (fo)</th>}
                  {isColVisible('porcentajeObservado') && <th>% Observado</th>}
                  {isColVisible('frecuenciaEsperada') && <th>Frecuencia Esperada (fe)</th>}
                  {isColVisible('porcentajeAcumulado') && <th>% Acumulado</th>}
                  {isColVisible('zScore') && <th>Z-Score Central</th>}
                </tr>
              </thead>
              <tbody>
                {stats.intervalosFrecuencia.map(int => (
                  <tr key={int.rango}>
                    {isColVisible('rango') && (
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {int.rango} {currentVarConfig.unidad}
                      </td>
                    )}
                    {isColVisible('frecuenciaObservada') && (
                      <td style={{ fontWeight: 600 }}>{int.frecuenciaObservada} ejemplares</td>
                    )}
                    {isColVisible('porcentajeObservado') && (
                      <td>
                        <span className="badge-category" style={{ backgroundColor: '#f0fdf4', color: '#166534', fontWeight: 700 }}>
                          {int.porcentajeObservado}%
                        </span>
                      </td>
                    )}
                    {isColVisible('frecuenciaEsperada') && <td>{int.frecuenciaEsperada}</td>}
                    {isColVisible('porcentajeAcumulado') && <td>{int.porcentajeAcumulado}%</td>}
                    {isColVisible('zScore') && (
                      <td style={{ color: int.zScore >= 0 ? '#166534' : '#b91c1c', fontWeight: 600 }}>
                        {int.zScore > 0 ? `+${int.zScore}` : int.zScore} σ
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popover / Modal de Ficha Rápida de Semoviente al hacer click en su arete */}
      {selectedAnimal && (
        <div className="animal-quick-popover" onClick={() => setSelectedAnimal(null)}>
          <div className="animal-quick-box" onClick={e => e.stopPropagation()}>
            <div style={{
              padding: '16px 20px',
              backgroundColor: selectedAnimal.recomendacionGenetica === 'Descarte Sugerido' ? '#fef2f2' : '#eff6ff',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: 14,
                  fontWeight: 800,
                  backgroundColor: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1'
                }}>
                  {selectedAnimal.arete}
                </span>
                <strong style={{ fontSize: 15, color: 'var(--text-primary)' }}>{selectedAnimal.nombre}</strong>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAnimal(null)}
                style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: 11 }}>Especie:</span>
                  <strong>{selectedSpecies}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: 11 }}>Raza:</span>
                  <strong>{selectedAnimal.raza}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: 11 }}>Categoría:</span>
                  <strong>{selectedAnimal.categoria} ({selectedAnimal.edadAnos} {selectedAnimal.edadAnos < 1 ? 'año' : 'años'})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: 11 }}>Lote Actual:</span>
                  <strong>{selectedAnimal.lote}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: 11 }}>Sexo:</span>
                  <strong>{selectedAnimal.sexo}</strong>
                </div>
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{currentVarConfig.nombre}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                    {selectedAnimal.valor} {currentVarConfig.unidad}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Posición Z-Score</div>
                  <div style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: (selectedAnimal.zScore || 0) >= 0 ? '#15803d' : '#dc2626'
                  }}>
                    {(selectedAnimal.zScore || 0) > 0 ? `+${selectedAnimal.zScore}` : selectedAnimal.zScore} σ
                  </div>
                </div>
              </div>

              <div style={{
                padding: '10px 12px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                backgroundColor: selectedAnimal.recomendacionGenetica === 'Descarte Sugerido' ? '#fef2f2' : '#f0fdf4',
                color: selectedAnimal.recomendacionGenetica === 'Descarte Sugerido' ? '#991b1b' : '#166534',
                border: `1px solid ${selectedAnimal.recomendacionGenetica === 'Descarte Sugerido' ? '#fecaca' : '#bbf7d0'}`
              }}>
                {selectedAnimal.recomendacionGenetica === 'Descarte Sugerido' ? (
                  <>⚠️ <strong>Recomendación Zootécnica:</strong> Rendimiento de {selectedAnimal.valor} {currentVarConfig.unidad} en el percentil inferior {lowerPercent}%. Se sugiere descarte productivo ({getCullingGroupLabel(selectedSpecies)}), renovación de lote o reemplazo.</>
                ) : (
                  <>⭐ <strong>Recomendación Zootécnica:</strong> Rendimiento zootécnico destacado de {selectedAnimal.valor} {currentVarConfig.unidad} en el percentil superior {upperPercent}%. Ejemplar de alto mérito ({getEliteGroupLabel(selectedSpecies)}) priorizado para multiplicación genética y programas de reproducción.</>
                )}
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', textAlign: 'right' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedAnimal(null)}
                style={{ padding: '6px 16px', fontSize: 13 }}
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer de Filtros */}
      <DistribucionNormalFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        availableBreeds={availableBreeds}
        onReset={() =>
          setFilters({
            tipo: 'Todos',
            variable: currentVarConfig.nombre,
            agruparPor: 'Lote',
            min: '',
            max: '',
            desde: '',
            hasta: '',
            rebano: 'Todos los Rebaños',
            raza: 'Todas las Razas',
            padre: ''
          })
        }
      />

      {/* Modal de Configuración de Columnas */}
      <ReportSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        columns={columns}
        onToggleColumn={toggleColumn}
        onResetColumns={resetColumns}
      />
    </div>
  );
};
