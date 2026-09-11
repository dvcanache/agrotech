import React, { useState } from 'react';
import { Play, LineChart, Table } from 'lucide-react';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { NormalDistributionChart } from './NormalDistributionChart';
import {
  DistribucionNormalFilterDrawer,
  DistribucionNormalFilterValues
} from './DistribucionNormalFilterDrawer';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { exportToCSV } from '../../utils/exportUtils';
import { MOCK_DISTRIBUCIONES_POR_CRITERIO } from '../gestionMockData';

export const DistribucionNormalView: React.FC = () => {
  // Criterio seleccionado en el header
  const [selectedCriterio, setSelectedCriterio] = useState<string>(
    'Producción - Promedio días producción'
  );

  // Estado de procesamiento
  const [isProcessed, setIsProcessed] = useState(false);
  const [activeTab, setActiveTab] = useState<'grafico' | 'tabla'>('grafico');

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

  // Datos del criterio actual
  const currentData = MOCK_DISTRIBUCIONES_POR_CRITERIO[selectedCriterio] ||
    MOCK_DISTRIBUCIONES_POR_CRITERIO['Producción - Promedio días producción'];

  const handleProcesar = () => {
    setIsProcessed(true);
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
    const rows = currentData.intervalosFrecuencia.map(row => [
      row.rango,
      row.frecuenciaObservada,
      `${row.porcentajeObservado}%`,
      row.frecuenciaEsperada,
      `${row.porcentajeAcumulado}%`,
      row.zScore
    ]);
    exportToCSV(`distribucion_normal_${selectedCriterio.replace(/\s+/g, '_')}`, headers, rows);
  };

  return (
    <div className="report-view-container">
      {/* Encabezado con selector de criterio y botón Procesar */}
      <ReportViewHeader
        title="Distribución normal"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={filters.min || filters.max || filters.desde || filters.padre ? 1 : 0}
        onExportXLSX={handleExportXLSX}
        exportDisabled={!isProcessed}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <select
              className="report-select-control"
              value={selectedCriterio}
              onChange={e => {
                setSelectedCriterio(e.target.value);
                setIsProcessed(false);
              }}
            >
              <option value="Producción - Promedio días producción">
                Producción - Promedio días producción
              </option>
              <option value="Producción - Producción total de leche">
                Producción - Producción total de leche (Kg)
              </option>
              <option value="Crecimiento - Ganancia diaria de peso">
                Crecimiento - Ganancia diaria de peso (g/día)
              </option>
            </select>

            <button
              type="button"
              className="btn-amber-action"
              onClick={handleProcesar}
              title="Calcular distribución normal gaussiana"
            >
              <Play size={14} fill="#ffffff" />
              <span>Procesar</span>
            </button>
          </div>
        }
      />

      {/* Contenido Principal */}
      {!isProcessed ? (
        /* Estado inicial antes de procesar: coincide exactamente con el screenshot */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 380,
          backgroundColor: '#ffffff',
          borderRadius: 10,
          border: '1px solid var(--border-gray)',
          boxShadow: varCardShadow,
          padding: 32,
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#e8f5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <LineChart size={32} color="#2d6a4f" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
            Seleccione un criterio y haga click en procesar para generar su reporte
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 460 }}>
            El sistema calculará la media poblacional, la desviación estándar, el coeficiente de variación y generará la curva campana de Gauss con intervalos de frecuencia.
          </p>
        </div>
      ) : (
        /* Estado procesado con estadísticas, gráfico campana y tabla */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Tarjetas de Métricas Estadísticas */}
          <div className="stats-cards-grid">
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Media (x̄)</span>
              <span className="stat-kpi-value">{currentData.media} {currentData.unidad}</span>
              <span style={{ fontSize: 11, color: '#16a34a' }}>Valor esperado promedio</span>
            </div>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Desv. Estándar (σ)</span>
              <span className="stat-kpi-value">{currentData.desviacionEstandar}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Dispersión típica</span>
            </div>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Mediana (Me)</span>
              <span className="stat-kpi-value">{currentData.mediana} {currentData.unidad}</span>
              <span style={{ fontSize: 11, color: '#2563eb' }}>Percentil 50</span>
            </div>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Coef. Variación (CV)</span>
              <span className="stat-kpi-value">{currentData.coeficienteVariacion}%</span>
              <span style={{ fontSize: 11, color: currentData.coeficienteVariacion < 20 ? '#16a34a' : '#d97706' }}>
                {currentData.coeficienteVariacion < 20 ? 'Homogeneidad alta' : 'Variabilidad moderada'}
              </span>
            </div>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Mín / Máx</span>
              <span className="stat-kpi-value">{currentData.minimo} - {currentData.maximo}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Rango de amplitud</span>
            </div>
            <div className="stat-kpi-card">
              <span className="stat-kpi-label">Muestra (N)</span>
              <span className="stat-kpi-value">{currentData.n} animales</span>
              <span style={{ fontSize: 11, color: '#2d6a4f' }}>100% analizados</span>
            </div>
          </div>

          {/* Selector de Pestaña: Gráfico vs Tabla */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className={`btn-blue-icon ${activeTab === 'grafico' ? '' : 'btn-ghost'}`}
              style={{
                backgroundColor: activeTab === 'grafico' ? '#0284c7' : '#f3f4f6',
                color: activeTab === 'grafico' ? '#ffffff' : 'var(--text-primary)'
              }}
              onClick={() => setActiveTab('grafico')}
            >
              <LineChart size={15} />
              <span>Campana de Gauss</span>
            </button>
            <button
              type="button"
              className={`btn-blue-icon ${activeTab === 'tabla' ? '' : 'btn-ghost'}`}
              style={{
                backgroundColor: activeTab === 'tabla' ? '#0284c7' : '#f3f4f6',
                color: activeTab === 'tabla' ? '#ffffff' : 'var(--text-primary)'
              }}
              onClick={() => setActiveTab('tabla')}
            >
              <Table size={15} />
              <span>Tabla de Frecuencias</span>
            </button>
          </div>

          {/* Vista de Gráfico de Campana */}
          {activeTab === 'grafico' && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 10,
              border: '1px solid var(--border-gray)',
              boxShadow: varCardShadow,
              padding: 20
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                Curva de Densidad Normal — {selectedCriterio}
              </h4>
              <NormalDistributionChart
                curva={currentData.curvaGauss}
                unidad={currentData.unidad}
                media={currentData.media}
              />
            </div>
          )}

          {/* Vista de Tabla de Intervalos y Deciles */}
          {activeTab === 'tabla' && (
            <div className="report-table-wrapper">
              <table className="report-grid-table">
                <thead>
                  <tr>
                    {isColVisible('rango') && <th>Rango del Intervalo</th>}
                    {isColVisible('frecuenciaObservada') && <th>Frecuencia Observada (fo)</th>}
                    {isColVisible('porcentajeObservado') && <th>% Observado</th>}
                    {isColVisible('frecuenciaEsperada') && <th>Frecuencia Esperada (fe)</th>}
                    {isColVisible('porcentajeAcumulado') && <th>% Acumulado</th>}
                    {isColVisible('zScore') && <th>Z-Score</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentData.intervalosFrecuencia.map(int => (
                    <tr key={int.rango}>
                      {isColVisible('rango') && (
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {int.rango} {currentData.unidad}
                        </td>
                      )}
                      {isColVisible('frecuenciaObservada') && <td>{int.frecuenciaObservada}</td>}
                      {isColVisible('porcentajeObservado') && (
                        <td>
                          <span className="badge-category" style={{ backgroundColor: '#f0fdf4', color: '#166534' }}>
                            {int.porcentajeObservado}%
                          </span>
                        </td>
                      )}
                      {isColVisible('frecuenciaEsperada') && <td>{int.frecuenciaEsperada}</td>}
                      {isColVisible('porcentajeAcumulado') && <td>{int.porcentajeAcumulado}%</td>}
                      {isColVisible('zScore') && (
                        <td style={{ color: int.zScore >= 0 ? '#166534' : '#b91c1c' }}>
                          {int.zScore > 0 ? `+${int.zScore}` : int.zScore}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Drawer de Filtros */}
      <DistribucionNormalFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
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

const varCardShadow = '0 4px 18px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.02)';
