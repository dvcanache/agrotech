import React, { useState, useMemo } from 'react';
import { Award, Filter } from 'lucide-react';
import { DoughnutChart } from '../../../../components/charts/DoughnutChart';
import { ReportViewHeader } from '../../components/ReportViewHeader';
import { ReportSettingsModal, ColumnSetting } from '../../components/ReportSettingsModal';
import { AnalisisInventarioModal } from './AnalisisInventarioModal';
import { InventariosFilterDrawer, InventariosFilterValues } from './InventariosFilterDrawer';
import { exportToCSV } from '../../utils/exportUtils';
import {
  MOCK_INVENTARIO_LOTES,
  MOCK_INVENTARIO_CATEGORIA_CHART,
  MOCK_INVENTARIO_LOCACION_CHART,
  MOCK_INVENTARIO_ESTATUS_CHART
} from '../gestionMockData';
import { CategoriaAnimal, EstatusAnimal } from '../../../../types2/common';

export const InventariosView: React.FC = () => {
  // Estados de modales y drawers
  const [isAnalisisModalOpen, setIsAnalisisModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Columnas configurables
  const [columns, setColumns] = useState<ColumnSetting[]>([
    { key: 'lote', label: 'Lotes', visible: true },
    { key: 'becerras', label: 'Becerras', visible: true },
    { key: 'mautas', label: 'Mautas', visible: true },
    { key: 'novillas', label: 'Novillas', visible: true },
    { key: 'vacas', label: 'Vacas', visible: true },
    { key: 'becerros', label: 'Becerros', visible: true },
    { key: 'mautes', label: 'Mautes', visible: true },
    { key: 'novillos', label: 'Novillos', visible: true },
    { key: 'toros', label: 'Toros', visible: true },
    { key: 'total', label: 'Total', visible: true }
  ]);

  // Filtros aplicados
  const [filters, setFilters] = useState<InventariosFilterValues>({
    lotes: ['ESCT', 'POT1', 'SEC1', '01'],
    estatus: ['Activo'] as EstatusAnimal[],
    categorias: ['Becerra', 'Mauta', 'Novilla', 'Vaca', 'Becerro', 'Maute', 'Novillo', 'Toro'] as CategoriaAnimal[],
    fechaCorte: new Date().toISOString().split('T')[0]
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.lotes.length < 4) count++;
    if (filters.estatus.length < 3) count++;
    if (filters.categorias.length < 8) count++;
    return count;
  }, [filters]);

  const toggleColumn = (key: string) => {
    setColumns(prev =>
      prev.map(col => (col.key === key ? { ...col, visible: !col.visible } : col))
    );
  };

  const resetColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, visible: true })));
  };

  // Mapeo de columnas a categorías zootécnicas
  const CATEGORY_MAP: Record<string, CategoriaAnimal> = {
    becerras: 'Becerra',
    mautas: 'Mauta',
    novillas: 'Novilla',
    vacas: 'Vaca',
    becerros: 'Becerro',
    mautes: 'Maute',
    novillos: 'Novillo',
    toros: 'Toro'
  };

  const isColVisible = (key: string) => {
    const col = columns.find(c => c.key === key);
    if (col && !col.visible) return false;
    if (CATEGORY_MAP[key]) {
      return filters.categorias.includes(CATEGORY_MAP[key]);
    }
    return true;
  };

  // Helper para calcular total por fila considerando únicamente categorías visibles
  const getRowTotal = (r: typeof MOCK_INVENTARIO_LOTES[0]) => {
    let sum = 0;
    if (filters.categorias.includes('Becerra')) sum += r.becerras;
    if (filters.categorias.includes('Mauta')) sum += r.mautas;
    if (filters.categorias.includes('Novilla')) sum += r.novillas;
    if (filters.categorias.includes('Vaca')) sum += r.vacas;
    if (filters.categorias.includes('Becerro')) sum += r.becerros;
    if (filters.categorias.includes('Maute')) sum += r.mautes;
    if (filters.categorias.includes('Novillo')) sum += r.novillos;
    if (filters.categorias.includes('Toro')) sum += r.toros;
    return sum;
  };

  // Filtrado de filas de la matriz
  const filteredRows = useMemo(() => {
    return MOCK_INVENTARIO_LOTES.filter(lote =>
      filters.lotes.includes(lote.loteCodigo)
    );
  }, [filters.lotes]);

  // Totales calculados
  const totals = useMemo(() => {
    return filteredRows.reduce(
      (acc, r) => ({
        becerras: acc.becerras + (filters.categorias.includes('Becerra') ? r.becerras : 0),
        mautas: acc.mautas + (filters.categorias.includes('Mauta') ? r.mautas : 0),
        novillas: acc.novillas + (filters.categorias.includes('Novilla') ? r.novillas : 0),
        vacas: acc.vacas + (filters.categorias.includes('Vaca') ? r.vacas : 0),
        becerros: acc.becerros + (filters.categorias.includes('Becerro') ? r.becerros : 0),
        mautes: acc.mautes + (filters.categorias.includes('Maute') ? r.mautes : 0),
        novillos: acc.novillos + (filters.categorias.includes('Novillo') ? r.novillos : 0),
        toros: acc.toros + (filters.categorias.includes('Toro') ? r.toros : 0),
        total: acc.total + getRowTotal(r)
      }),
      {
        becerras: 0,
        mautas: 0,
        novillas: 0,
        vacas: 0,
        becerros: 0,
        mautes: 0,
        novillos: 0,
        toros: 0,
        total: 0
      }
    );
  }, [filteredRows, filters.categorias]);

  // Gráfico filtrado por categorías activas
  const categoryChartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    MOCK_INVENTARIO_CATEGORIA_CHART.labels.forEach((lbl, idx) => {
      const isIncluded = filters.categorias.some(c => lbl.toLowerCase().includes(c.toLowerCase()));
      if (isIncluded) {
        labels.push(lbl);
        data.push(MOCK_INVENTARIO_CATEGORIA_CHART.data[idx]);
        colors.push(MOCK_INVENTARIO_CATEGORIA_CHART.colors[idx]);
      }
    });

    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      data: data.length > 0 ? data : [0],
      colors: colors.length > 0 ? colors : ['#cbd5e1']
    };
  }, [filters.categorias]);

  const handleExportXLSX = () => {
    const headers = [
      'Lotes',
      'Becerras',
      'Mautas',
      'Novillas',
      'Vacas',
      'Becerros',
      'Mautes',
      'Novillos',
      'Toros',
      'Total'
    ];
    const rows = filteredRows.map(r => [
      r.loteNombre,
      filters.categorias.includes('Becerra') ? r.becerras : 0,
      filters.categorias.includes('Mauta') ? r.mautas : 0,
      filters.categorias.includes('Novilla') ? r.novillas : 0,
      filters.categorias.includes('Vaca') ? r.vacas : 0,
      filters.categorias.includes('Becerro') ? r.becerros : 0,
      filters.categorias.includes('Maute') ? r.mautes : 0,
      filters.categorias.includes('Novillo') ? r.novillos : 0,
      filters.categorias.includes('Toro') ? r.toros : 0,
      getRowTotal(r)
    ]);
    rows.push([
      'Total activos',
      totals.becerras,
      totals.mautas,
      totals.novillas,
      totals.vacas,
      totals.becerros,
      totals.mautes,
      totals.novillos,
      totals.toros,
      totals.total
    ]);
    rows.push([
      'Total',
      totals.becerras,
      totals.mautas,
      totals.novillas,
      totals.vacas,
      totals.becerros,
      totals.mautes,
      totals.novillos,
      totals.toros,
      totals.total
    ]);
    exportToCSV('reporte_inventarios', headers, rows);
  };

  return (
    <div className="report-view-container">
      {/* Encabezado con botones */}
      <ReportViewHeader
        title="Inventarios"
        backRoute="/reportes"
        onFilterToggle={() => setIsFilterDrawerOpen(prev => !prev)}
        isFilterOpen={isFilterDrawerOpen}
        activeFiltersCount={activeFiltersCount}
        onExportXLSX={handleExportXLSX}
        onSettingsClick={() => setIsSettingsModalOpen(true)}
        extraActions={
          <button
            type="button"
            className="btn-amber-action"
            onClick={() => setIsAnalisisModalOpen(true)}
            title="Abrir análisis detallado de inventario"
          >
            <Award size={16} />
            <span>Análisis de Inventario</span>
          </button>
        }
      />

      {/* Fila de 3 Gráficos Donut */}
      <div className="inventories-charts-grid">
        {/* Gráfico 1: Categoría */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">Inventario por categoría</div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={categoryChartData.labels}
              data={categoryChartData.data}
              colors={categoryChartData.colors}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            {categoryChartData.labels.map((lbl, idx) => (
              <span key={lbl} className="legend-pill">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: categoryChartData.colors[idx] }}
                ></span>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Gráfico 2: Locación */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">Inventario por locación</div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={MOCK_INVENTARIO_LOCACION_CHART.labels}
              data={MOCK_INVENTARIO_LOCACION_CHART.data}
              colors={MOCK_INVENTARIO_LOCACION_CHART.colors}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            {MOCK_INVENTARIO_LOCACION_CHART.labels.map((lbl, idx) => (
              <span key={lbl} className="legend-pill">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: MOCK_INVENTARIO_LOCACION_CHART.colors[idx] }}
                ></span>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Gráfico 3: Estatus */}
        <div className="inventory-chart-card">
          <div className="chart-card-title">Inventario por estatus</div>
          <div className="donut-wrapper-relative">
            <DoughnutChart
              labels={MOCK_INVENTARIO_ESTATUS_CHART.labels}
              data={MOCK_INVENTARIO_ESTATUS_CHART.data}
              colors={MOCK_INVENTARIO_ESTATUS_CHART.colors}
            />
            <div className="donut-center-metric">{totals.total}</div>
          </div>
          <div className="chart-custom-legend">
            {MOCK_INVENTARIO_ESTATUS_CHART.labels.map((lbl, idx) => (
              <span key={lbl} className="legend-pill">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: MOCK_INVENTARIO_ESTATUS_CHART.colors[idx] }}
                ></span>
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Matriz de Lotes vs Categorías */}
      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            <tr>
              {isColVisible('lote') && (
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Lotes</span>
                    <Filter size={13} style={{ color: '#9ca3af' }} />
                  </div>
                </th>
              )}
              {isColVisible('becerras') && <th>Becerras</th>}
              {isColVisible('mautas') && <th>Mautas</th>}
              {isColVisible('novillas') && <th>Novillas</th>}
              {isColVisible('vacas') && <th>Vacas</th>}
              {isColVisible('becerros') && <th>Becerros</th>}
              {isColVisible('mautes') && <th>Mautes</th>}
              {isColVisible('novillos') && <th>Novillos</th>}
              {isColVisible('toros') && <th>Toros</th>}
              {isColVisible('total') && <th>Total</th>}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.loteCodigo}>
                {isColVisible('lote') && <td>{row.loteNombre}</td>}
                {isColVisible('becerras') && <td>{row.becerras}</td>}
                {isColVisible('mautas') && <td>{row.mautas}</td>}
                {isColVisible('novillas') && <td>{row.novillas}</td>}
                {isColVisible('vacas') && <td>{row.vacas}</td>}
                {isColVisible('becerros') && <td>{row.becerros}</td>}
                {isColVisible('mautes') && <td>{row.mautes}</td>}
                {isColVisible('novillos') && <td>{row.novillos}</td>}
                {isColVisible('toros') && <td>{row.toros}</td>}
                {isColVisible('total') && <td style={{ fontWeight: 700 }}>{getRowTotal(row)}</td>}
              </tr>
            ))}

            {/* Fila Total Activos */}
            <tr className="total-active-row">
              {isColVisible('lote') && <td>Total activos</td>}
              {isColVisible('becerras') && <td>{totals.becerras}</td>}
              {isColVisible('mautas') && <td>{totals.mautas}</td>}
              {isColVisible('novillas') && <td>{totals.novillas}</td>}
              {isColVisible('vacas') && <td>{totals.vacas}</td>}
              {isColVisible('becerros') && <td>{totals.becerros}</td>}
              {isColVisible('mautes') && <td>{totals.mautes}</td>}
              {isColVisible('novillos') && <td>{totals.novillos}</td>}
              {isColVisible('toros') && <td>{totals.toros}</td>}
              {isColVisible('total') && <td>{totals.total}</td>}
            </tr>

            {/* Fila Total General */}
            <tr className="total-general-row">
              {isColVisible('lote') && <td>Total</td>}
              {isColVisible('becerras') && <td>{totals.becerras}</td>}
              {isColVisible('mautas') && <td>{totals.mautas}</td>}
              {isColVisible('novillas') && <td>{totals.novillas}</td>}
              {isColVisible('vacas') && <td>{totals.vacas}</td>}
              {isColVisible('becerros') && <td>{totals.becerros}</td>}
              {isColVisible('mautes') && <td>{totals.mautes}</td>}
              {isColVisible('novillos') && <td>{totals.novillos}</td>}
              {isColVisible('toros') && <td>{totals.toros}</td>}
              {isColVisible('total') && <td>{totals.total}</td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Análisis de Inventario */}
      <AnalisisInventarioModal
        isOpen={isAnalisisModalOpen}
        onClose={() => setIsAnalisisModalOpen(false)}
        totalAnimales={totals.total}
      />

      {/* Drawer de Filtros */}
      <InventariosFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onReset={() =>
          setFilters({
            lotes: ['ESCT', 'POT1', 'SEC1', '01'],
            estatus: ['Activo'] as EstatusAnimal[],
            categorias: ['Becerra', 'Mauta', 'Novilla', 'Vaca', 'Becerro', 'Maute', 'Novillo', 'Toro'] as CategoriaAnimal[],
            fechaCorte: new Date().toISOString().split('T')[0]
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
